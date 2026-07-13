import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, realpath, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  compileTypeBoxModule,
  generateProviderSchemaEntries,
  generateProviderSchemaEntry,
  renderGeneratedProviderSchemas,
} from "../scripts/provider-schemas-generator";
import { normalizeTypeBoxModule } from "../scripts/schema-normalizer";

const createInstalledFixture = async () => {
  const rootPath = await mkdtemp(join(tmpdir(), "provider-schema-generation-"));
  const source = { packageName: "@fixture/provider", factoryName: "createFixture" } as const;
  const packageRoot = join(rootPath, "node_modules", source.packageName);
  await mkdir(packageRoot, { recursive: true });
  await writeFile(
    join(packageRoot, "package.json"),
    JSON.stringify({ name: source.packageName, version: "1.2.3", types: "./index.d.ts" }),
  );
  await writeFile(
    join(packageRoot, "index.d.ts"),
    `
      /** Options for the fixture provider. */
      export interface FixtureOptions {
        /** Provider display name. */
        name: string;
        /** Optional API key. */
        apiKey?: string;
        fetch?: typeof fetch;
      }
      export declare function createFixture(options: FixtureOptions): unknown;
    `,
  );
  return { rootPath, packageRoot, source };
};

describe("provider schema generation", () => {
  test("loads providers.json when sources are not supplied", async () => {
    const fixture = await createInstalledFixture();
    await Bun.write(join(fixture.rootPath, "providers.json"), JSON.stringify([fixture.source]));

    const generated = await generateProviderSchemaEntries({ rootPath: fixture.rootPath });

    expect(Object.keys(generated.entries)).toEqual([fixture.source.packageName]);
  });

  test("generates a schema from an installed provider declaration", async () => {
    const fixture = await createInstalledFixture();
    const generated = await generateProviderSchemaEntries({
      rootPath: fixture.rootPath,
      sources: [fixture.source],
    });

    expect(Object.keys(generated.entries)).toEqual([fixture.source.packageName]);
    expect(generated.entries[fixture.source.packageName]).toMatchObject({
      packageName: fixture.source.packageName,
      packageVersion: "1.2.3",
      factoryName: fixture.source.factoryName,
      schema: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", description: "Provider display name." },
          apiKey: { type: "string", description: "Optional API key." },
        },
      },
      warnings: [{ code: "unsupported_optional", path: "fetch" }],
    });
  });

  test("preserves root JSDoc and canonical generation dependencies", async () => {
    const fixture = await createInstalledFixture();
    const generated = await generateProviderSchemaEntry(fixture.packageRoot, fixture.source);
    const canonicalRoot = await realpath(fixture.packageRoot);

    expect(generated.entry.schema).toMatchObject({ description: "Options for the fixture provider." });
    expect(generated.dependencies).toContain(join(canonicalRoot, "package.json"));
    expect(generated.dependencies).toContain(join(canonicalRoot, "index.d.ts"));
  });

  test("normalizes unsupported optional values without rejecting the schema", () => {
    const module = compileTypeBoxModule(`
      type Options = {
        callback?: () => void;
        name: string;
      };
      type Root = Options;
    `);
    const normalized = normalizeTypeBoxModule({ rootName: "Root", module, documentation: {} });

    expect(normalized.schema).toMatchObject({
      type: "object",
      required: ["name"],
      properties: { name: { type: "string" } },
    });
    expect(normalized.warnings).toEqual([{ code: "unsupported_optional", path: "callback" }]);
  });

  test("renders deterministic widened runtime source", () => {
    const entry = {
      packageName: "fixture",
      packageVersion: "1.0.0",
      factoryName: "createFixture",
      schema: { type: "object", properties: { z: { type: "string" }, a: { type: "number" } } },
      warnings: [
        { code: "unsupported_optional" as const, path: "z" },
        { code: "unsupported_optional" as const, path: "a" },
      ],
    };
    const forward = renderGeneratedProviderSchemas({ z: entry, a: entry });
    const reverse = renderGeneratedProviderSchemas({ a: entry, z: entry });

    expect(forward).toBe(reverse);
    expect(forward).toContain(
      "export const PROVIDER_OPTIONS_SCHEMAS: Readonly<Record<string, ProviderOptionsSchemaEntry>> =",
    );
    expect(forward).not.toContain("as const satisfies");
  });
});
