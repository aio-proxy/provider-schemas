import { join } from "node:path";

export type ProviderSchemaSource = {
  readonly packageName: string;
  readonly subpath?: string;
  readonly factoryName: string;
  readonly overrides?: {
    readonly optional: readonly string[];
  };
};

export const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
const factoryName = /^[$A-Z_a-z][$\w]*$/u;
const npmPackageName = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/u;

export const providerSpecifier = ({ packageName, subpath }: ProviderSchemaSource) =>
  subpath ? `${packageName}/${subpath}` : packageName;

export const providerPackageNames = (catalog: readonly ProviderSchemaSource[]) => [
  ...new Set(catalog.map(({ packageName }) => packageName)),
];

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
    const subpath = entry["subpath"];
    const providerFactoryName = entry["factoryName"];
    const overridesValue = entry["overrides"];
    if (typeof packageName !== "string" || !npmPackageName.test(packageName)) {
      throw new Error(`Invalid provider packageName at index ${index}`);
    }
    if (typeof providerFactoryName !== "string" || !factoryName.test(providerFactoryName)) {
      throw new Error(`Invalid provider factoryName for ${packageName}`);
    }
    if (subpath !== undefined && (typeof subpath !== "string" || subpath.length === 0)) {
      throw new Error(`Invalid provider subpath for ${packageName}`);
    }
    const overrides =
      overridesValue === undefined ? undefined : asRecord(overridesValue, `overrides for ${packageName}`);
    const optional = overrides?.["optional"];
    if (optional !== undefined && (!Array.isArray(optional) || optional.some((name) => typeof name !== "string"))) {
      throw new Error(`Invalid optional overrides for ${packageName}`);
    }
    return {
      packageName,
      ...(subpath === undefined ? {} : { subpath }),
      factoryName: providerFactoryName,
      ...(optional === undefined ? {} : { overrides: { optional: optional as string[] } }),
    };
  });

  const seen = new Set<string>();
  let previousSpecifier = "";
  for (const source of sources) {
    const specifier = providerSpecifier(source);
    if (seen.has(specifier)) throw new Error(`Duplicate provider: ${specifier}`);
    if (previousSpecifier > specifier) throw new Error("Provider catalog must be sorted by specifier");
    seen.add(specifier);
    previousSpecifier = specifier;
  }
  return sources;
};

export const renderDependabot = (catalog: readonly ProviderSchemaSource[]) =>
  Bun.YAML.stringify(
    {
      version: 2,
      updates: [
        {
          "package-ecosystem": "npm",
          directory: "/",
          schedule: { interval: "daily", time: "09:00", timezone: "Asia/Shanghai" },
          allow: providerPackageNames(catalog).map((packageName) => ({
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
  ).replaceAll(": \n", ":\n");

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
