import { join } from "node:path";
import {
  generateProviderSchemaEntries,
  type ProviderSchemaSource,
  renderGeneratedProviderSchemas,
} from "./provider-schemas-generator";

export type SynchronizeProviderSchemasOptions = {
  readonly rootPath: string;
  readonly targetPath: string;
  readonly check?: boolean;
  readonly sources?: readonly ProviderSchemaSource[];
};

const currentSource = async (targetPath: string) => {
  const file = Bun.file(targetPath);
  return (await file.exists()) ? file.text() : undefined;
};

export const synchronizeProviderSchemas = async ({
  rootPath,
  targetPath,
  check = false,
  sources,
}: SynchronizeProviderSchemasOptions): Promise<{ readonly changed: boolean; readonly count: number }> => {
  const generated = await generateProviderSchemaEntries({
    rootPath,
    ...(sources === undefined ? {} : { sources }),
  });
  const source = renderGeneratedProviderSchemas(generated.entries);
  const current = await currentSource(targetPath);
  const count = Object.keys(generated.entries).length;
  if (current === source) return { changed: false, count };
  if (check) throw new Error("Provider schema snapshot is out of date; run `bun run generate`");
  await Bun.write(targetPath, source);
  return { changed: true, count };
};

if (import.meta.main) {
  const rootPath = join(import.meta.dir, "..");
  const result = await synchronizeProviderSchemas({
    rootPath,
    targetPath: join(rootPath, "src/schema-module.ts"),
    check: process.argv.includes("--check"),
  });
  console.log(`provider schemas: ${result.count} generated${result.changed ? " (updated)" : ""}`);
}
