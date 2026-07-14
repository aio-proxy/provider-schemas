import { expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const distRoot = join(import.meta.dir, "../dist");
const repositoryRoot = join(import.meta.dir, "..");
const buildOnlyImport =
  /(?:from\s*|import\s*\()\s*["'](?:ts-morph|ts-to-zod|node:fs|node:path|bun|@ai-sdk\/|@openrouter\/)/u;

const readRuntimeFiles = async (root: string): Promise<string> => {
  const contents: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) contents.push(await readRuntimeFiles(path));
    else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts"))) {
      contents.push(await readFile(path, "utf8"));
    }
  }
  return contents.join("\n");
};

test("published runtime artifacts exclude generator tooling and provider imports", async () => {
  const distEntries = await readdir(distRoot);
  expect(distEntries.some((name) => name.endsWith(".map"))).toBe(false);

  const runtimeSource = await readRuntimeFiles(distRoot);
  expect(runtimeSource.match(buildOnlyImport)).toBeNull();
  expect(runtimeSource).not.toContain("provider-artifacts");
  expect(runtimeSource).not.toContain("provider-declaration");

  const declaration = await readFile(join(distRoot, "schema-module.d.ts"), "utf8");
  expect(declaration).toContain("Readonly<Record<string, ProviderOptionsSchemaEntry>>");
  expect(declaration.length).toBeLessThan(512);

  const nodeImport = Bun.spawnSync(["node", "--input-type=module", "--eval", 'await import("./dist/index.js")'], {
    cwd: repositoryRoot,
    stdout: "pipe",
    stderr: "pipe",
  });
  expect(nodeImport.exitCode, nodeImport.stderr.toString()).toBe(0);
});
