import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  planProviderDependencyChanges,
  readManagedProviderNames,
  readProviderSchemaCatalog,
  renderDependabot,
} from "../scripts/provider-catalog";

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
  test("reads provider sources", async () => {
    const rootPath = await writeFixture({
      providers: [
        { packageName: "@ai-sdk/google-vertex", factoryName: "createGoogleVertex" },
        { packageName: "@ai-sdk/google-vertex", subpath: "anthropic", factoryName: "createVertexAnthropic" },
      ],
    });

    await expect(readProviderSchemaCatalog(rootPath)).resolves.toEqual([
      { packageName: "@ai-sdk/google-vertex", factoryName: "createGoogleVertex" },
      { packageName: "@ai-sdk/google-vertex", subpath: "anthropic", factoryName: "createVertexAnthropic" },
    ]);
  });

  test("rejects duplicate and unsorted provider entries", async () => {
    const duplicateRoot = await writeFixture({
      providers: [
        { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
        { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
      ],
      devDependencies: { "@ai-sdk/openai": "4.0.11" },
    });
    await expect(readProviderSchemaCatalog(duplicateRoot)).rejects.toThrow("Duplicate provider: @ai-sdk/openai");

    const unsortedRoot = await writeFixture({
      providers: [
        { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
        { packageName: "@ai-sdk/anthropic", factoryName: "createAnthropic" },
      ],
    });
    await expect(readProviderSchemaCatalog(unsortedRoot)).rejects.toThrow(
      "Provider catalog must be sorted by specifier",
    );
  });

  test("renders and reads one exact Dependabot allow list", () => {
    const catalog = [
      { packageName: "@ai-sdk/google-vertex", factoryName: "createGoogleVertex" },
      { packageName: "@ai-sdk/google-vertex", subpath: "anthropic", factoryName: "createVertexAnthropic" },
      { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
    ] as const;
    const source = renderDependabot(catalog);

    expect(source).toBe(
      Bun.YAML.stringify(
        {
          version: 2,
          updates: [
            {
              "package-ecosystem": "npm",
              directory: "/",
              schedule: { interval: "daily", time: "09:00", timezone: "Asia/Shanghai" },
              allow: ["@ai-sdk/google-vertex", "@ai-sdk/openai"].map((packageName) => ({
                "dependency-name": packageName,
              })),
              groups: { "provider-sources": { patterns: ["*"] } },
              "open-pull-requests-limit": 1,
              "commit-message": { prefix: "fix", include: "scope" },
            },
          ],
        },
        null,
        2,
      ).replaceAll(": \n", ":\n"),
    );
    expect(source).not.toMatch(/ +$/mu);
    expect(readManagedProviderNames(source)).toEqual(["@ai-sdk/google-vertex", "@ai-sdk/openai"]);
  });

  test("plans provider changes without touching tools", () => {
    expect(
      planProviderDependencyChanges(["@ai-sdk/openai", "@ai-sdk/xai"], ["@ai-sdk/anthropic", "@ai-sdk/openai"], {
        "@ai-sdk/openai": "4.0.11",
        typescript: "6.0.3",
      }),
    ).toEqual({ add: ["@ai-sdk/xai"], remove: ["@ai-sdk/anthropic"] });
  });
});
