import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";

export type NpmSecurityIssueCode =
  | "credential_url"
  | "forbidden_registry_config"
  | "non_exact_dependency"
  | "npm_credential"
  | "private_registry";

export type NpmSecurityIssue = {
  readonly code: NpmSecurityIssueCode;
  readonly path: string;
  readonly commit?: string;
};

const forbiddenRegistryConfig = new Set([".npmrc", ".yarnrc", ".yarnrc.yml", "bunfig.toml"]);
const dependencySections = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"] as const;
const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
const publicRegistryHost = "registry.npmjs.org";
const lockfileName = /^(?:bun\.lock|package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/u;

const isPublicRegistry = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.toLowerCase() === publicRegistryHost && url.port === "";
  } catch {
    return false;
  }
};

const hasPrivateRegistryAssignment = (content: string): boolean => {
  const assignment = /(?<![A-Za-z0-9_$])["']?(?:registry|registry-url)["']?\s*[:=]\s*["']?([^\s"',#}]+)/giu;
  for (const match of content.matchAll(assignment)) {
    if (!isPublicRegistry(match[1])) return true;
  }
  return false;
};

const hasPrivateLockfileUrl = (content: string): boolean => {
  for (const match of content.matchAll(/https?:\/\/([^/\s"']+)/giu)) {
    if (match[1]?.toLowerCase() !== publicRegistryHost) return true;
  }
  return false;
};

export const findNpmSecurityIssues = (path: string, input: Uint8Array | string): readonly NpmSecurityIssue[] => {
  const content = typeof input === "string" ? input : new TextDecoder().decode(input);
  if (content.includes("\0")) return [];

  const issues: NpmSecurityIssue[] = [];
  const add = (code: NpmSecurityIssueCode) => {
    if (!issues.some((issue) => issue.code === code)) issues.push({ code, path });
  };
  const name = basename(path);

  if (forbiddenRegistryConfig.has(name)) add("forbidden_registry_config");
  if (
    /\bnpm_[A-Za-z0-9]{20,}\b/u.test(content) ||
    /(?:^|\n)\s*(?:(?:\/\/[^\s]+\/):)?(?:_authToken|_auth|username|password)\s*=/imu.test(content)
  ) {
    add("npm_credential");
  }
  if (/https?:\/\/[^\s/@:]+:[^\s/@]+@/iu.test(content)) add("credential_url");

  if (lockfileName.test(name) ? hasPrivateLockfileUrl(content) : hasPrivateRegistryAssignment(content)) {
    add("private_registry");
  }

  if (name === "package.json") {
    try {
      const manifest = JSON.parse(content) as {
        readonly publishConfig?: { readonly registry?: unknown };
        readonly dependencies?: Readonly<Record<string, unknown>>;
        readonly devDependencies?: Readonly<Record<string, unknown>>;
        readonly optionalDependencies?: Readonly<Record<string, unknown>>;
        readonly peerDependencies?: Readonly<Record<string, unknown>>;
      };
      for (const section of dependencySections) {
        for (const value of Object.values(manifest[section] ?? {})) {
          if (typeof value !== "string" || !exactVersion.test(value)) add("non_exact_dependency");
        }
      }
      const publishRegistry = manifest.publishConfig?.registry;
      if (publishRegistry !== undefined && !isPublicRegistry(publishRegistry)) add("private_registry");
    } catch {
      // Other repository checks report invalid package JSON.
    }
  }

  return issues;
};

const decode = (value: Uint8Array) => new TextDecoder().decode(value);

const gitOutput = (rootPath: string, args: readonly string[]): Uint8Array => {
  const result = Bun.spawnSync(["git", ...args], {
    cwd: rootPath,
    stdout: "pipe",
    stderr: "pipe",
  });
  if (result.exitCode !== 0) {
    throw new Error(`git ${args[0] ?? "command"} failed: ${decode(result.stderr).trim()}`);
  }
  return result.stdout;
};

const nullSeparated = (value: Uint8Array) => decode(value).split("\0").filter(Boolean);

const withCommit = (issues: readonly NpmSecurityIssue[], commit?: string) =>
  commit === undefined ? issues : issues.map((issue) => ({ ...issue, commit }));

const scanGitSnapshot = (
  paths: readonly string[],
  read: (path: string) => Uint8Array | Promise<Uint8Array>,
  commit?: string,
) =>
  Promise.all(paths.map(async (path) => withCommit(findNpmSecurityIssues(path, await read(path)), commit))).then(
    (groups) => groups.flat(),
  );

export const scanStagedRepository = async (rootPath: string): Promise<readonly NpmSecurityIssue[]> => {
  const paths = nullSeparated(gitOutput(rootPath, ["ls-files", "--cached", "-z"]));
  return scanGitSnapshot(paths, (path) => gitOutput(rootPath, ["show", `:${path}`]));
};

const scanWorkingRepository = async (rootPath: string): Promise<readonly NpmSecurityIssue[]> => {
  const paths = nullSeparated(gitOutput(rootPath, ["ls-files", "--cached", "--others", "--exclude-standard", "-z"]));
  const existing: string[] = [];
  for (const path of paths) {
    if (await Bun.file(join(rootPath, path)).exists()) existing.push(path);
  }
  return scanGitSnapshot(existing, (path) => readFile(join(rootPath, path)));
};

export const scanRepositoryHistory = async (rootPath: string): Promise<readonly NpmSecurityIssue[]> => {
  const issues: NpmSecurityIssue[] = [...(await scanWorkingRepository(rootPath))];
  const commits = decode(gitOutput(rootPath, ["rev-list", "--all"]))
    .trim()
    .split("\n")
    .filter(Boolean);
  for (const commit of commits) {
    const paths = nullSeparated(gitOutput(rootPath, ["ls-tree", "-r", "--name-only", "-z", commit]));
    issues.push(
      ...(await scanGitSnapshot(paths, (path) => gitOutput(rootPath, ["show", `${commit}:${path}`]), commit)),
    );
  }
  return issues;
};

const printIssues = (issues: readonly NpmSecurityIssue[]) => {
  for (const issue of issues) {
    const commit = issue.commit === undefined ? "" : ` commit=${issue.commit.slice(0, 12)}`;
    console.error(`[${issue.code}] path=${issue.path}${commit}`);
  }
};

if (import.meta.main) {
  const staged = process.argv.includes("--staged");
  const history = process.argv.includes("--history");
  if (staged === history) {
    throw new Error("Use exactly one of --staged or --history");
  }
  const issues = staged ? await scanStagedRepository(process.cwd()) : await scanRepositoryHistory(process.cwd());
  if (issues.length > 0) {
    console.error(`npm security check failed with ${issues.length} issue(s)`);
    printIssues(issues);
    process.exitCode = 1;
  } else {
    console.log(`npm security: ${staged ? "staged index" : "working tree and history"} clean`);
  }
}
