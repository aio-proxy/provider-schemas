import { join } from "node:path";
import { generateProviderArtifacts } from "./provider-artifacts";
import { synchronizeProviderConfiguration } from "./provider-sync";

const currentSource = async (path: string) => {
  const file = Bun.file(path);
  return (await file.exists()) ? file.text() : undefined;
};

export const synchronizeProviderArtifacts = async (
  rootPath: string,
  check = false,
): Promise<{ readonly changed: boolean; readonly count: number }> => {
  const generated = await generateProviderArtifacts(rootPath);
  const targets = [
    [join(rootPath, "src/zod-module.ts"), generated.zodSource],
    [join(rootPath, "src/schema-module.ts"), generated.jsonSource],
  ] as const;
  const changedTargets: (typeof targets)[number][] = [];
  for (const target of targets) {
    if ((await currentSource(target[0])) !== target[1]) changedTargets.push(target);
  }
  if (changedTargets.length === 0) return { changed: false, count: generated.count };
  if (check) throw new Error("Provider artifacts are out of date; run `bun run generate`");
  await Promise.all(changedTargets.map(([path, source]) => Bun.write(path, source)));
  return { changed: true, count: generated.count };
};

export const runGeneration = async (rootPath: string, check = false) => {
  await synchronizeProviderConfiguration(rootPath, check);
  return synchronizeProviderArtifacts(rootPath, check);
};

if (import.meta.main) {
  const result = await runGeneration(join(import.meta.dir, ".."), process.argv.includes("--check"));
  console.log(`provider artifacts: ${result.count} generated${result.changed ? " (updated)" : ""}`);
}
