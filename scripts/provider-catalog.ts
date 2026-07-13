import { join } from "node:path";

export type ProviderSchemaSource = {
  readonly packageName: string;
  readonly factoryName: string;
};

const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
const factoryName = /^[$A-Z_a-z][$\w]*$/u;
const npmPackageName = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/u;

const asRecord = (value: unknown, label: string): Readonly<Record<string, unknown>> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as Readonly<Record<string, unknown>>;
};

export const readProviderSchemaCatalog = async (rootPath: string): Promise<readonly ProviderSchemaSource[]> => {
  const value: unknown = await Bun.file(join(rootPath, "providers.json")).json();
  if (!Array.isArray(value)) throw new Error("providers.json must contain an array");

  const sources = value.map((item, index): ProviderSchemaSource => {
    const entry = asRecord(item, `providers.json entry ${index}`);
    if (typeof entry["packageName"] !== "string" || !npmPackageName.test(entry["packageName"])) {
      throw new Error(`Invalid provider packageName at index ${index}`);
    }
    if (typeof entry["factoryName"] !== "string" || !factoryName.test(entry["factoryName"])) {
      throw new Error(`Invalid provider factoryName for ${entry["packageName"]}`);
    }
    return { packageName: entry["packageName"], factoryName: entry["factoryName"] };
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

const dependencyPatterns = (value: unknown, label: string): readonly string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${label} must be an array of dependency patterns`);
  }
  return value as readonly string[];
};

const wildcardPattern = (pattern: string) =>
  new RegExp(`^${pattern.replace(/[|\\{}()[\]^$+?.]/gu, "\\$&").replaceAll("*", ".*")}$`, "u");

const matchesAny = (name: string, patterns: readonly string[]) =>
  patterns.some((pattern) => wildcardPattern(pattern).test(name));

export const validateProviderSchemaCatalog = async (rootPath: string): Promise<void> => {
  const sources = await readProviderSchemaCatalog(rootPath);
  const packageJson = asRecord(await Bun.file(join(rootPath, "package.json")).json(), "package.json");
  const devDependencies = asRecord(packageJson["devDependencies"] ?? {}, "package.json devDependencies");
  const nonDevelopmentDependencies = ["dependencies", "optionalDependencies", "peerDependencies"].map((section) =>
    asRecord(packageJson[section] ?? {}, `package.json ${section}`),
  );
  for (const source of sources) {
    const version = devDependencies[source.packageName];
    if (version === undefined) throw new Error(`Catalog provider is not a devDependency: ${source.packageName}`);
    if (typeof version !== "string" || !exactVersion.test(version)) {
      throw new Error(`Catalog provider must use an exact version: ${source.packageName}`);
    }
    if (nonDevelopmentDependencies.some((dependencies) => dependencies[source.packageName] !== undefined)) {
      throw new Error(`Catalog provider must only be a devDependency: ${source.packageName}`);
    }
  }

  const dependabotText = await Bun.file(join(rootPath, ".github/dependabot.yml")).text();
  const dependabot = asRecord(Bun.YAML.parse(dependabotText), "dependabot.yml");
  if (!Array.isArray(dependabot["updates"])) throw new Error("dependabot.yml updates must be an array");
  const npmUpdate = dependabot["updates"]
    .map((value, index) => asRecord(value, `dependabot.yml update ${index}`))
    .find((update) => update["package-ecosystem"] === "npm" && update["directory"] === "/");
  if (npmUpdate === undefined) throw new Error("dependabot.yml must configure npm updates for /");

  if (!Array.isArray(npmUpdate["allow"])) throw new Error("Dependabot npm allow rules must be an array");
  const allowPatterns = npmUpdate["allow"].map((value, index) => {
    const rule = asRecord(value, `Dependabot allow rule ${index}`);
    if (typeof rule["dependency-name"] !== "string") {
      throw new Error(`Dependabot allow rule ${index} must have dependency-name`);
    }
    return rule["dependency-name"];
  });
  const groups = asRecord(npmUpdate["groups"], "Dependabot npm groups");
  const providerGroup = asRecord(groups["provider-sources"], "Dependabot provider-sources group");
  const groupPatterns = dependencyPatterns(providerGroup["patterns"], "Dependabot provider-sources patterns");

  for (const source of sources) {
    if (!matchesAny(source.packageName, allowPatterns)) {
      throw new Error(`Dependabot allow rules do not cover catalog provider: ${source.packageName}`);
    }
    if (!matchesAny(source.packageName, groupPatterns)) {
      throw new Error(`Dependabot provider-sources group does not cover catalog provider: ${source.packageName}`);
    }
  }

  const catalogPackages = new Set(sources.map((source) => source.packageName));
  for (const name of Object.keys(devDependencies)) {
    if (matchesAny(name, allowPatterns) && !catalogPackages.has(name)) {
      throw new Error(`Dependabot provider dependency is missing from providers.json: ${name}`);
    }
  }
};

if (import.meta.main) {
  const rootPath = join(import.meta.dir, "..");
  await validateProviderSchemaCatalog(rootPath);
  const sources = await readProviderSchemaCatalog(rootPath);
  console.log(`provider catalog: ${sources.length} entries valid`);
}
