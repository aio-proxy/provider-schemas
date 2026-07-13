import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateProviderArtifacts } from "../scripts/provider-artifacts";

const fixture = async () => {
  const rootPath = await mkdtemp(join(tmpdir(), "provider-artifacts-"));
  const source = { packageName: "@fixture/provider", factoryName: "createFixture" } as const;
  const packageRoot = join(rootPath, "node_modules", source.packageName);
  await mkdir(packageRoot, { recursive: true });
  await Bun.write(
    join(packageRoot, "package.json"),
    JSON.stringify({ name: source.packageName, version: "1.0.0", types: "./index.d.ts" }),
  );
  await Bun.write(
    join(packageRoot, "index.d.ts"),
    `
      /** Fixture options. */
      export interface FixtureOptions {
        /** API key. */
        apiKey?: string;
        /** Whether enabled. @default true */
        enabled?: boolean;
        fetch?: typeof fetch;
      }
      export declare function createFixture(options?: FixtureOptions): unknown;
    `,
  );
  return { rootPath, source, packageRoot };
};

describe("provider artifact generation", () => {
  test("generates executable Zod and static JSON schemas from one declaration", async () => {
    const fixtureData = await fixture();
    const artifacts = await generateProviderArtifacts({
      rootPath: fixtureData.rootPath,
      sources: [fixtureData.source],
      resolveSource: async () => fixtureData.packageRoot,
    });

    expect(artifacts.count).toBe(1);
    expect(artifacts.typeSource).toContain("interface P0FixtureOptions");
    expect(artifacts.zodSource).toContain("PROVIDER_OPTIONS_ZOD_SCHEMAS");
    expect(artifacts.zodSource).toContain("P0ProviderOptionsSchema");
    expect(artifacts.jsonSource).toContain('"packageVersion": "1.0.0"');
    expect(artifacts.entries[fixtureData.source.packageName]?.schema).toMatchObject({
      type: "object",
      description: "Fixture options.",
      properties: {
        apiKey: { type: "string", description: "API key." },
        enabled: { type: "boolean", default: true },
      },
    });
    expect(artifacts.entries[fixtureData.source.packageName]?.schema).not.toHaveProperty("required");
    expect(artifacts.entries[fixtureData.source.packageName]?.warnings).toEqual([
      { code: "unsupported_optional", path: "fetch" },
    ]);
  });
});
