import { join } from "node:path";

export type ProviderSchemaSource = {
  readonly packageName: string;
  readonly factoryName: string;
};

export const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
const factoryName = /^[$A-Z_a-z][$\w]*$/u;
const npmPackageName = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/u;

const asRecord = (value: unknown, label: string): Readonly<Record<string, unknown>> => {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new Error(`${label} must be an object`);
  return value as Readonly<Record<string, unknown>>;
};

export const readProviderSchemaCatalog = async (rootPath: string): Promise<readonly ProviderSchemaSource[]> => {
  const value: unknown = await Bun.file(join(rootPath, "providers.json")).json();
  if (!Array.isArray(value)) throw new Error("providers.json must contain an array");

  const sources = value.map((item, index): ProviderSchemaSource => {
    const entry = asRecord(item, `providers.json entry ${index}`);
    const packageName = entry["packageName"];
    const providerFactoryName = entry["factoryName"];
    if (typeof packageName !== "string" || !npmPackageName.test(packageName)) {
      throw new Error(`Invalid provider packageName at index ${index}`);
    }
    if (typeof providerFactoryName !== "string" || !factoryName.test(providerFactoryName)) {
      throw new Error(`Invalid provider factoryName for ${packageName}`);
    }
    return { packageName, factoryName: providerFactoryName };
  });

  const seen = new Set<string>();
  for (const source of sources) {
    if (seen.has(source.packageName)) throw new Error(`Duplicate provider package: ${source.packageName}`);
    seen.add(source.packageName);
  }
  for (let index = 1; index < sources.length; index += 1) {
    if ((sources[index - 1]?.packageName ?? "") > (sources[index]?.packageName ?? "")) {
      throw new Error("Provider catalog must be sorted by packageName");
    }
  }
  return sources;
};

export const renderDependabot = (catalog: readonly ProviderSchemaSource[]) =>
  [
    "version: 2",
    "",
    "updates:",
    "  - package-ecosystem: npm",
    "    directory: /",
    "    schedule:",
    "      interval: daily",
    '      time: "09:00"',
    "      timezone: Asia/Shanghai",
    "    allow:",
    ...catalog.map(({ packageName }) => `      - dependency-name: "${packageName}"`),
    "    groups:",
    "      provider-sources:",
    "        patterns:",
    '          - "*"',
    "    open-pull-requests-limit: 1",
    "    commit-message:",
    "      prefix: fix",
    "      include: scope",
    "",
  ].join("\n");

export const readManagedProviderNames = (text: string): readonly string[] => {
  const document = asRecord(Bun.YAML.parse(text), "dependabot.yml");
  if (!Array.isArray(document["updates"])) return [];
  const npmUpdate = document["updates"]
    .map((value, index) => asRecord(value, `dependabot.yml update ${index}`))
    .find((update) => update["package-ecosystem"] === "npm" && update["directory"] === "/");
  if (!npmUpdate || !Array.isArray(npmUpdate["allow"])) return [];
  return npmUpdate["allow"]
    .map((value, index) => asRecord(value, `Dependabot allow rule ${index}`)["dependency-name"])
    .filter((name): name is string => typeof name === "string" && !name.includes("*"))
    .sort();
};

export const planProviderDependencyChanges = (
  catalogNames: readonly string[],
  previousNames: readonly string[],
  devDependencies: Readonly<Record<string, string>>,
) => ({
  add: catalogNames.filter((name) => devDependencies[name] === undefined),
  remove: previousNames.filter((name) => !catalogNames.includes(name)),
});
