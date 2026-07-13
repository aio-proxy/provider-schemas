import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readProviderSchemaCatalog, validateProviderSchemaCatalog } from "../scripts/provider-catalog";

const writeFixture = async ({
  providers = [
    { packageName: "@ai-sdk/anthropic", factoryName: "createAnthropic" },
    { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
  ],
  devDependencies = {
    "@ai-sdk/anthropic": "4.0.12",
    "@ai-sdk/openai": "4.0.11",
    typescript: "6.0.3",
  },
  dependencies = {},
  allow = ["@ai-sdk/*"],
  group = ["@ai-sdk/*"],
}: {
  readonly providers?: readonly unknown[];
  readonly devDependencies?: Readonly<Record<string, string>>;
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly allow?: readonly string[];
  readonly group?: readonly string[];
} = {}) => {
  const rootPath = await mkdtemp(join(tmpdir(), "provider-catalog-"));
  await mkdir(join(rootPath, ".github"), { recursive: true });
  await writeFile(join(rootPath, "providers.json"), JSON.stringify(providers));
  await writeFile(join(rootPath, "package.json"), JSON.stringify({ dependencies, devDependencies }));
  await writeFile(
    join(rootPath, ".github/dependabot.yml"),
    [
      "version: 2",
      "updates:",
      "  - package-ecosystem: npm",
      "    directory: /",
      "    allow:",
      ...allow.map((pattern) => `      - dependency-name: "${pattern}"`),
      "    groups:",
      "      provider-sources:",
      "        patterns:",
      ...group.map((pattern) => `          - "${pattern}"`),
      "",
    ].join("\n"),
  );
  return rootPath;
};

describe("provider schema catalog", () => {
  test("reads and validates provider sources against dependencies and Dependabot policy", async () => {
    const rootPath = await writeFixture();

    await expect(readProviderSchemaCatalog(rootPath)).resolves.toEqual([
      { packageName: "@ai-sdk/anthropic", factoryName: "createAnthropic" },
      { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
    ]);
    await expect(validateProviderSchemaCatalog(rootPath)).resolves.toBeUndefined();
  });

  test("rejects duplicate and unsorted provider entries", async () => {
    const duplicateRoot = await writeFixture({
      providers: [
        { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
        { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
      ],
      devDependencies: { "@ai-sdk/openai": "4.0.11" },
    });
    await expect(readProviderSchemaCatalog(duplicateRoot)).rejects.toThrow(
      "Duplicate provider package: @ai-sdk/openai",
    );

    const unsortedRoot = await writeFixture({
      providers: [
        { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
        { packageName: "@ai-sdk/anthropic", factoryName: "createAnthropic" },
      ],
    });
    await expect(readProviderSchemaCatalog(unsortedRoot)).rejects.toThrow(
      "Provider catalog must be sorted by packageName",
    );
  });

  test("rejects missing and non-exact provider development dependencies", async () => {
    const missingRoot = await writeFixture({
      devDependencies: { "@ai-sdk/anthropic": "4.0.12" },
    });
    await expect(validateProviderSchemaCatalog(missingRoot)).rejects.toThrow(
      "Catalog provider is not a devDependency: @ai-sdk/openai",
    );

    const rangeRoot = await writeFixture({
      devDependencies: {
        "@ai-sdk/anthropic": "4.0.12",
        "@ai-sdk/openai": "^4.0.11",
      },
    });
    await expect(validateProviderSchemaCatalog(rangeRoot)).rejects.toThrow(
      "Catalog provider must use an exact version: @ai-sdk/openai",
    );

    const runtimeRoot = await writeFixture({ dependencies: { "@ai-sdk/openai": "4.0.11" } });
    await expect(validateProviderSchemaCatalog(runtimeRoot)).rejects.toThrow(
      "Catalog provider must only be a devDependency: @ai-sdk/openai",
    );
  });

  test("rejects drift between the catalog and Dependabot provider selection", async () => {
    const missingCatalogRoot = await writeFixture({
      providers: [{ packageName: "@ai-sdk/anthropic", factoryName: "createAnthropic" }],
    });
    await expect(validateProviderSchemaCatalog(missingCatalogRoot)).rejects.toThrow(
      "Dependabot provider dependency is missing from providers.json: @ai-sdk/openai",
    );

    const allowRoot = await writeFixture({ allow: ["@ai-sdk/anthropic"] });
    await expect(validateProviderSchemaCatalog(allowRoot)).rejects.toThrow(
      "Dependabot allow rules do not cover catalog provider: @ai-sdk/openai",
    );

    const groupRoot = await writeFixture({ group: ["@ai-sdk/anthropic"] });
    await expect(validateProviderSchemaCatalog(groupRoot)).rejects.toThrow(
      "Dependabot provider-sources group does not cover catalog provider: @ai-sdk/openai",
    );
  });
});
