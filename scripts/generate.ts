import { join } from "node:path";
import { type GenerateProviderArtifactsOptions, generateProviderArtifacts } from "./provider-artifacts";
import { synchronizeProviderConfiguration } from "./provider-sync";

export type SynchronizeProviderArtifactsOptions = GenerateProviderArtifactsOptions & {
  readonly check?: boolean;
};

const currentSource = async (path: string) => {
  const file = Bun.file(path);
  return (await file.exists()) ? file.text() : undefined;
};

export const synchronizeProviderArtifacts = async ({
  rootPath,
  check = false,
  sources,
  resolveSource,
}: SynchronizeProviderArtifactsOptions): Promise<{ readonly changed: boolean; readonly count: number }> => {
  const generated = await generateProviderArtifacts({
    rootPath,
    ...(sources === undefined ? {} : { sources }),
    ...(resolveSource === undefined ? {} : { resolveSource }),
  });
  const targets = [
    [join(rootPath, "src/provider-types.generated.ts"), generated.typeSource],
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

export type RunGenerationOptions = {
  readonly rootPath: string;
  readonly check?: boolean;
  readonly synchronizeConfiguration?: typeof synchronizeProviderConfiguration;
  readonly synchronizeSchemas?: typeof synchronizeProviderArtifacts;
};

export const runGeneration = async ({
  rootPath,
  check = false,
  synchronizeConfiguration = synchronizeProviderConfiguration,
  synchronizeSchemas = synchronizeProviderArtifacts,
}: RunGenerationOptions) => {
  await synchronizeConfiguration({ rootPath, check });
  return synchronizeSchemas({ rootPath, check });
};

if (import.meta.main) {
  const result = await runGeneration({
    rootPath: join(import.meta.dir, ".."),
    check: process.argv.includes("--check"),
  });
  console.log(`provider artifacts: ${result.count} generated${result.changed ? " (updated)" : ""}`);
}
