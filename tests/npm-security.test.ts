import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findNpmSecurityIssues, scanRepositoryHistory, scanStagedRepository } from "../scripts/check-npm-security";

const codes = (path: string, content: string) => findNpmSecurityIssues(path, content).map((issue) => issue.code);
const roots: string[] = [];

const git = (rootPath: string, ...args: string[]) => {
  const result = Bun.spawnSync(["git", ...args], { cwd: rootPath, stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());
  return result.stdout.toString().trim();
};

const repository = async () => {
  const rootPath = await mkdtemp(join(tmpdir(), "provider-schema-security-"));
  roots.push(rootPath);
  git(rootPath, "init", "-b", "main");
  git(rootPath, "config", "user.name", "Security Test");
  git(rootPath, "config", "user.email", "security@example.com");
  return rootPath;
};

afterEach(async () => {
  await Promise.all(roots.splice(0).map((rootPath) => rm(rootPath, { recursive: true, force: true })));
});

describe("npm registry privacy policy", () => {
  test("allows exact public npm dependencies and ordinary schema URLs", () => {
    const registryKey = ["regis", "try"].join("");
    expect(
      codes(
        "package.json",
        JSON.stringify({
          dependencies: { fixture: "1.2.3" },
          devDependencies: { "@fixture/tool": "2.0.0-beta.1" },
          publishConfig: { access: "public", [registryKey]: "https://registry.npmjs.org/" },
        }),
      ),
    ).toEqual([]);
    expect(
      codes(
        "src/schema-module.ts",
        'export const schema = { format: "uri", examples: ["https://api.example.com/v1"] };',
      ),
    ).toEqual([]);
  });

  test("rejects tracked package-manager registry configuration", () => {
    expect(codes(".npmrc", "registry=https://registry.npmjs.org/")).toContain("forbidden_registry_config");
    expect(codes("config/.yarnrc.yml", "npmRegistryServer: https://registry.npmjs.org/")).toContain(
      "forbidden_registry_config",
    );
    expect(codes("bunfig.toml", "[install]")).toContain("forbidden_registry_config");
  });

  test("rejects non-exact dependency sources", () => {
    expect(codes("package.json", JSON.stringify({ dependencies: { fixture: "^1.2.3" } }))).toContain(
      "non_exact_dependency",
    );
    expect(
      codes("package.json", JSON.stringify({ dependencies: { fixture: "git+https://example.com/repo" } })),
    ).toContain("non_exact_dependency");
  });

  test("allows peer compatibility ranges but still requires exact installed dependencies", () => {
    expect(codes("package.json", JSON.stringify({ peerDependencies: { zod: "^4.1.5" } }))).toEqual([]);
    expect(codes("package.json", JSON.stringify({ devDependencies: { zod: "^4.1.5" } }))).toContain(
      "non_exact_dependency",
    );
  });

  test("rejects private registry assignments and lockfile URLs", () => {
    const privateHost = ["bnpm", "byted", "org"].join(".");
    const registryKey = ["regis", "try"].join("");
    expect(codes("settings.txt", `${registryKey}=https://${privateHost}/`)).toContain("private_registry");
    expect(codes("bun.lock", `resolved = "https://${privateHost}/fixture.tgz"`)).toContain("private_registry");
    expect(codes("settings.txt", `${registryKey}=https://registry.npmjs.org/`)).toEqual([]);
  });

  test("fails closed for malformed registry values", () => {
    const registryKey = ["regis", "try"].join("");
    expect(codes("settings.txt", `${registryKey}=not-a-url`)).toContain("private_registry");
    expect(codes("package.json", JSON.stringify({ publishConfig: { [registryKey]: "not-a-url" } }))).toContain(
      "private_registry",
    );
  });

  test("does not treat identifier suffixes as registry assignments", () => {
    expect(codes("script.ts", "const isPublicRegistry = true; const publishRegistry = undefined;")).toEqual([]);
  });

  test("rejects npm tokens and authentication assignments without returning their values", () => {
    const token = ["npm", "x".repeat(36)].join("_");
    const authKey = ["_auth", "Token"].join("");
    const issues = findNpmSecurityIssues("notes.txt", `${authKey}=${token}`);

    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(["npm_credential"]));
    expect(JSON.stringify(issues)).not.toContain(token);
  });

  test("rejects URLs containing credentials", () => {
    const credentialUrl = ["https://user", "secret@registry.example.com/package"].join(":");
    expect(codes("notes.txt", credentialUrl)).toContain("credential_url");
  });
});

describe("git commit security scanning", () => {
  test("scans the exact staged index before a commit", async () => {
    const rootPath = await repository();
    const authKey = ["_auth", "Token"].join("");
    const secret = ["npm", "x".repeat(36)].join("_");
    await writeFile(join(rootPath, ".npmrc"), `${authKey}=${secret}`);
    git(rootPath, "add", ".npmrc");

    const issues = await scanStagedRepository(rootPath);

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(["forbidden_registry_config", "npm_credential"]),
    );
    expect(JSON.stringify(issues)).not.toContain(secret);
  });

  test("detects a credential in an earlier commit after a later commit removes it", async () => {
    const rootPath = await repository();
    const secret = ["npm", "x".repeat(36)].join("_");
    await writeFile(join(rootPath, "package.json"), JSON.stringify({ name: "fixture", version: "1.0.0" }));
    git(rootPath, "add", "package.json");
    git(rootPath, "commit", "-m", "initial");

    await writeFile(join(rootPath, "notes.txt"), secret);
    git(rootPath, "add", "notes.txt");
    git(rootPath, "commit", "-m", "leak");
    const leakedCommit = git(rootPath, "rev-parse", "HEAD");

    await unlink(join(rootPath, "notes.txt"));
    git(rootPath, "add", "-A");
    git(rootPath, "commit", "-m", "remove leak");

    const issues = await scanRepositoryHistory(rootPath);

    expect(issues).toContainEqual({
      code: "npm_credential",
      path: "notes.txt",
      commit: leakedCommit,
    });
    expect(JSON.stringify(issues)).not.toContain(secret);
  }, 15_000);

  test("scans uncommitted files before the repository has its first commit", async () => {
    const rootPath = await repository();
    const privateHost = ["bnpm", "byted", "org"].join(".");
    const registryKey = ["regis", "try"].join("");
    await mkdir(join(rootPath, "config"));
    await writeFile(join(rootPath, "config/source.txt"), `${registryKey}=https://${privateHost}/`);

    expect(await scanRepositoryHistory(rootPath)).toContainEqual({
      code: "private_registry",
      path: "config/source.txt",
    });
  });
});
