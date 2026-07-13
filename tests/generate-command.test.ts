import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { synchronizeProviderArtifacts } from "../scripts/generate";

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
  await writeFile(join(rootPath, "providers.json"), JSON.stringify([source]));
  return { rootPath, targetPath };
};

describe("schema snapshot synchronization", () => {
  test("writes once, stays stable, and fails check mode for stale output", async () => {
    const fixture = await createFixture();

    await expect(synchronizeProviderArtifacts(fixture.rootPath, true)).rejects.toThrow(
      "Provider artifacts are out of date",
    );

    await expect(synchronizeProviderArtifacts(fixture.rootPath)).resolves.toEqual({ changed: true, count: 1 });
    const first = await readFile(fixture.targetPath, "utf8");

    await expect(synchronizeProviderArtifacts(fixture.rootPath)).resolves.toEqual({ changed: false, count: 1 });
    expect(await readFile(fixture.targetPath, "utf8")).toBe(first);

    await writeFile(fixture.targetPath, "stale");
    await expect(synchronizeProviderArtifacts(fixture.rootPath, true)).rejects.toThrow(
      "Provider artifacts are out of date",
    );
  });
});
