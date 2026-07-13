import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGeneration, synchronizeProviderArtifacts } from "../scripts/generate";

const createFixture = async () => {
  const rootPath = await mkdtemp(join(tmpdir(), "provider-schema-command-"));
  const source = { packageName: "@fixture/provider", factoryName: "createFixture" } as const;
  const packageRoot = join(rootPath, "node_modules", source.packageName);
  const targetPath = join(rootPath, "src/schema-module.ts");
  await mkdir(packageRoot, { recursive: true });
  await mkdir(join(rootPath, "src"), { recursive: true });
  await writeFile(
    join(packageRoot, "package.json"),
    JSON.stringify({ name: source.packageName, version: "1.0.0", types: "./index.d.ts" }),
  );
  await writeFile(
    join(packageRoot, "index.d.ts"),
    "export declare function createFixture(options: { apiKey?: string }): unknown;",
  );
  return { rootPath, source, targetPath };
};

describe("schema snapshot synchronization", () => {
  test("synchronizes configuration before schemas", async () => {
    const calls: string[] = [];

    await runGeneration({
      rootPath: "/fixture",
      synchronizeConfiguration: async () => {
        calls.push("configuration");
        return { added: [], removed: [], changedDependabot: false };
      },
      synchronizeSchemas: async () => {
        calls.push("schemas");
        return { changed: false, count: 1 };
      },
    });

    expect(calls).toEqual(["configuration", "schemas"]);
  });

  test("writes once, stays stable, and fails check mode for stale output", async () => {
    const fixture = await createFixture();

    await expect(
      synchronizeProviderArtifacts({
        rootPath: fixture.rootPath,
        check: true,
        sources: [fixture.source],
        resolveSource: async () => join(fixture.rootPath, "node_modules", fixture.source.packageName),
      }),
    ).rejects.toThrow("Provider artifacts are out of date");

    await expect(
      synchronizeProviderArtifacts({
        rootPath: fixture.rootPath,
        sources: [fixture.source],
        resolveSource: async () => join(fixture.rootPath, "node_modules", fixture.source.packageName),
      }),
    ).resolves.toEqual({ changed: true, count: 1 });
    const first = await readFile(fixture.targetPath, "utf8");

    await expect(
      synchronizeProviderArtifacts({
        rootPath: fixture.rootPath,
        sources: [fixture.source],
        resolveSource: async () => join(fixture.rootPath, "node_modules", fixture.source.packageName),
      }),
    ).resolves.toEqual({ changed: false, count: 1 });
    expect(await readFile(fixture.targetPath, "utf8")).toBe(first);

    await writeFile(fixture.targetPath, "stale");
    await expect(
      synchronizeProviderArtifacts({
        rootPath: fixture.rootPath,
        check: true,
        sources: [fixture.source],
        resolveSource: async () => join(fixture.rootPath, "node_modules", fixture.source.packageName),
      }),
    ).rejects.toThrow("Provider artifacts are out of date");
  });
});
