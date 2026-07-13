import { join } from "node:path";
import {
  exactVersion,
  planProviderDependencyChanges,
  readManagedProviderNames,
  readProviderSchemaCatalog,
  renderDependabot,
} from "./provider-catalog";

const record = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

export const synchronizeProviderConfiguration = async (rootPath: string, check = false) => {
  const catalog = await readProviderSchemaCatalog(rootPath);
  const packageJson = record(await Bun.file(join(rootPath, "package.json")).json());
  const devDependencies = record(packageJson["devDependencies"]) as Record<string, string>;
  const catalogNames = catalog.map(({ packageName }) => packageName);
  const dependabotPath = join(rootPath, ".github/dependabot.yml");
  const dependabotFile = Bun.file(dependabotPath);
  const currentDependabot = (await dependabotFile.exists()) ? await dependabotFile.text() : "";
  const changes = planProviderDependencyChanges(
    catalogNames,
    readManagedProviderNames(currentDependabot),
    devDependencies,
  );
  const desiredDependabot = renderDependabot(catalog);
  const invalidVersion = catalogNames.some(
    (name) => devDependencies[name] !== undefined && !exactVersion.test(devDependencies[name] ?? ""),
  );
  const changedDependabot = currentDependabot !== desiredDependabot;

  if (invalidVersion) throw new Error("Provider dependencies must use exact versions");

  if (check && (changes.add.length > 0 || changes.remove.length > 0 || changedDependabot)) {
    throw new Error("Provider configuration is out of date; run `bun run generate`");
  }

  const runBun = async (args: readonly string[]) => {
    const child = Bun.spawn([process.execPath, ...args], { cwd: rootPath, stdout: "inherit", stderr: "pipe" });
    const stderr = await new Response(child.stderr).text();
    if ((await child.exited) !== 0) throw new Error(`bun ${args[0] ?? "command"} failed: ${stderr.trim()}`);
  };

  for (const name of changes.remove) await runBun(["remove", name]);
  for (const name of changes.add) {
    await runBun([
      "add",
      "--dev",
      "--exact",
      "--only-missing",
      "--registry=https://registry.npmjs.org",
      `${name}@latest`,
    ]);
  }
  if (changedDependabot) await Bun.write(dependabotPath, desiredDependabot);
};
