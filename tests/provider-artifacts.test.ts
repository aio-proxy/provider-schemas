import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateProviderArtifacts } from "../scripts/provider-artifacts";

const fixture = async () => {
  const rootPath = await mkdtemp(join(tmpdir(), "provider-artifacts-"));
  const source = {
    packageName: "@fixture/provider",
    subpath: "special",
    factoryName: "createFixture",
    overrides: { optional: ["name"] },
  } as const;
  const packageRoot = join(rootPath, "node_modules", source.packageName);
  await mkdir(packageRoot, { recursive: true });
  await mkdir(join(packageRoot, "special"), { recursive: true });
  await Bun.write(
    join(packageRoot, "package.json"),
    JSON.stringify({
      name: source.packageName,
      version: "1.0.0",
      exports: { "./special": { types: "./special/index.d.ts" } },
    }),
  );
  await Bun.write(
    join(packageRoot, "special/index.d.ts"),
    `
      /** Fixture options. */
      export interface FixtureOptions {
        /** Provider name. */
        name: string;
        /** Base URL. */
        baseURL: string;
        /** API key. */
        apiKey?: string;
        /** @deprecated Use apiKey instead. */
        legacyKey?: string;
        /** Whether enabled. @default true */
        enabled?: boolean;
        fetch?: typeof fetch;
      }
      export declare function createFixture(options?: FixtureOptions): unknown;
    `,
  );
  await Bun.write(join(rootPath, "providers.json"), JSON.stringify([source]));
  return { rootPath, source, packageRoot };
};

describe("provider artifact generation", () => {
  test("generates executable Zod and static JSON schemas from one declaration", async () => {
    const fixtureData = await fixture();
    const artifacts = await generateProviderArtifacts(fixtureData.rootPath);

    expect(artifacts.count).toBe(1);
    expect(artifacts).not.toHaveProperty("typeSource");
    expect(artifacts.zodSource).toContain("PROVIDER_OPTIONS_ZOD_SCHEMAS");
    expect(artifacts.zodSource).toContain("P0ProviderOptionsSchema");
    expect(artifacts.zodSource).toContain('P0ProviderOptionsSchema.partial({ "name": true })');
    expect(artifacts.zodSource).toContain('.describe("API key.")');
    expect(artifacts.zodSource).not.toMatch(/\* API key\.\s+\* @description API key\./u);
    expect(artifacts.zodSource).toContain("@deprecated Use apiKey instead.");
    expect(artifacts.jsonSource).toContain('"packageVersion": "1.0.0"');
    expect(artifacts).not.toHaveProperty("entries");
    const entries = JSON.parse(
      artifacts.jsonSource.slice(artifacts.jsonSource.indexOf(" = ") + 3, artifacts.jsonSource.lastIndexOf(";")),
    );
    const specifier = `${fixtureData.source.packageName}/${fixtureData.source.subpath}`;
    expect(entries[specifier]?.packageName).toBe(specifier);
    expect(entries[specifier]?.schema).toMatchObject({
      type: "object",
      description: "Fixture options.",
      properties: {
        name: { type: "string", description: "Provider name." },
        baseURL: { type: "string", description: "Base URL." },
        apiKey: { type: "string", description: "API key." },
        enabled: { type: "boolean", default: true },
      },
    });
    expect(entries[specifier]?.schema.required).toEqual(["baseURL"]);
    expect(entries[specifier]?.warnings).toEqual([{ code: "unsupported_optional", path: "fetch" }]);
  });
});
