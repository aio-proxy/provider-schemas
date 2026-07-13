import { realpath } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "@babel/parser";
import { Script } from "typebox";
import type { ProviderOptionsSchemaEntry } from "../src/types";
import { readProviderPackageMetadata, resolveDeclarationEntry } from "./declaration-entry";
import { parseProviderFactoryDeclaration } from "./declaration-parser";
import { type ProviderSchemaSource, readProviderSchemaCatalog } from "./provider-catalog";
import { normalizeTypeBoxModule } from "./schema-normalizer";

export type { ProviderSchemaSource } from "./provider-catalog";

const ROOT_NAME = "__AioProxyProviderOptions";
const compareCodeUnits = (left: string, right: string) => (left < right ? -1 : left > right ? 1 : 0);
const npmPackageName = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/iu;

export const resolveInstalledProviderSource = async (
  rootPath: string,
  source: ProviderSchemaSource,
): Promise<string> => {
  if (!npmPackageName.test(source.packageName)) {
    throw new Error(`Invalid npm package name: ${source.packageName}`);
  }

  const packageRoot = await realpath(join(rootPath, "node_modules", source.packageName));
  const metadata = await readProviderPackageMetadata(packageRoot);
  if (metadata.name !== source.packageName) {
    throw new Error(
      `Installed provider package identity mismatch: expected ${source.packageName}, received ${metadata.name}`,
    );
  }

  return packageRoot;
};

export type ProviderSchemaDependencyCallback = (dependency: string) => void;
export type ResolveProviderSource = (rootPath: string, source: ProviderSchemaSource) => Promise<string>;

export type GenerateProviderSchemasOptions = {
  readonly rootPath: string;
  readonly sources?: readonly ProviderSchemaSource[];
  readonly resolveSource?: ResolveProviderSource;
};

export const compileTypeBoxModule = (source: string): Readonly<Record<string, unknown>> => {
  // TypeBox aborts an interface containing `typeof fetch`; a function schema
  // preserves the unsupported shape so normalization can apply requiredness policy.
  const ast = parse(source, { sourceType: "module", plugins: ["typescript"] });
  const ranges: { readonly start: number; readonly end: number }[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (typeof value !== "object" || value === null) return;
    const node = value as {
      readonly type?: unknown;
      readonly start?: number | null;
      readonly end?: number | null;
      readonly exprName?: { readonly type?: unknown; readonly name?: unknown };
    };
    if (
      node.type === "TSTypeQuery" &&
      node.exprName?.type === "Identifier" &&
      node.exprName.name === "fetch" &&
      node.start != null &&
      node.end != null
    ) {
      ranges.push({ start: node.start, end: node.end });
    }
    for (const child of Object.values(value)) visit(child);
  };
  visit(ast);
  const compatibleSource = ranges
    .sort((left, right) => right.start - left.start)
    .reduce((text, range) => `${text.slice(0, range.start)}() => unknown${text.slice(range.end)}`, source);
  return Script(compatibleSource) as unknown as Readonly<Record<string, unknown>>;
};

const sortValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortValue);
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => compareCodeUnits(left, right))
      .map(([key, item]) => [key, sortValue(item)]),
  );
};

export type GeneratedProviderSchemaEntry = {
  readonly entry: ProviderOptionsSchemaEntry;
  readonly dependencies: readonly string[];
};

export type GeneratedProviderSchemas = {
  readonly entries: Readonly<Record<string, ProviderOptionsSchemaEntry>>;
  readonly dependencies: readonly string[];
};

export const generateProviderSchemaEntry = async (
  packageRoot: string,
  source: ProviderSchemaSource,
  onDependency?: ProviderSchemaDependencyCallback,
): Promise<GeneratedProviderSchemaEntry> => {
  const dependencies = new Set<string>();
  const addDependency = (dependency: string) => {
    if (dependencies.has(dependency)) return;
    dependencies.add(dependency);
    onDependency?.(dependency);
  };
  const canonicalPackageRoot = await realpath(packageRoot);
  addDependency(join(canonicalPackageRoot, "package.json"));
  const declarationEntry = await resolveDeclarationEntry(canonicalPackageRoot);
  const [metadata, parsed] = await Promise.all([
    readProviderPackageMetadata(canonicalPackageRoot),
    parseProviderFactoryDeclaration({
      packageRoot: canonicalPackageRoot,
      declarationEntry,
      factoryName: source.factoryName,
      onDependency: addDependency,
    }),
  ]);
  const moduleSource = [`type ${ROOT_NAME} = NonNullable<${parsed.parameterType}>;`, ...parsed.declarations].join(
    "\n\n",
  );
  const parameterDeclaration = parsed.parameterType.match(/^[$A-Z_a-z][$\w]*/)?.[0];
  const documentation = { ...parsed.documentation };
  if (parameterDeclaration) {
    const rootDescription = parsed.documentation[parameterDeclaration];
    if (rootDescription) documentation[ROOT_NAME] = rootDescription;
    for (const [key, description] of Object.entries(parsed.documentation)) {
      if (key.startsWith(`${parameterDeclaration}.`)) {
        documentation[`${ROOT_NAME}${key.slice(parameterDeclaration.length)}`] = description;
      }
    }
  }
  const normalized = normalizeTypeBoxModule({
    rootName: ROOT_NAME,
    module: compileTypeBoxModule(moduleSource),
    documentation,
  });
  return {
    entry: {
      packageName: metadata.name,
      packageVersion: metadata.version,
      factoryName: source.factoryName,
      schema: normalized.schema,
      warnings: normalized.warnings,
    },
    dependencies: [...dependencies].sort(compareCodeUnits),
  };
};

export const generateProviderSchemaEntries = async (
  options: GenerateProviderSchemasOptions,
  onDependency?: ProviderSchemaDependencyCallback,
): Promise<GeneratedProviderSchemas> => {
  const sources = options.sources ?? (await readProviderSchemaCatalog(options.rootPath));
  const resolveSource = options.resolveSource ?? resolveInstalledProviderSource;
  const entries: Record<string, ProviderOptionsSchemaEntry> = {};
  const dependencies = new Set<string>();
  const addDependency = (dependency: string) => {
    if (dependencies.has(dependency)) return;
    dependencies.add(dependency);
    onDependency?.(dependency);
  };
  for (const source of sources) {
    const packageRoot = await resolveSource(options.rootPath, source);
    const generated = await generateProviderSchemaEntry(packageRoot, source, addDependency);
    entries[source.packageName] = generated.entry;
    for (const dependency of generated.dependencies) dependencies.add(dependency);
  }
  return { entries, dependencies: [...dependencies].sort(compareCodeUnits) };
};

export const renderGeneratedProviderSchemas = (
  entries: Readonly<Record<string, ProviderOptionsSchemaEntry>>,
): string => {
  const sorted = Object.fromEntries(
    Object.entries(entries)
      .sort(([left], [right]) => compareCodeUnits(left, right))
      .map(([key, entry]) => [
        key,
        sortValue({
          ...entry,
          warnings: [...entry.warnings].sort((left, right) => compareCodeUnits(left.path, right.path)),
        }),
      ]),
  );
  const serialized = JSON.stringify(sorted, null, 2);
  return [
    "// biome-ignore-all format: This file is deterministically generated.",
    'import type { ProviderOptionsSchemaEntry } from "./types.js";',
    "",
    `export const PROVIDER_OPTIONS_SCHEMAS: Readonly<Record<string, ProviderOptionsSchemaEntry>> = ${serialized};`,
    "",
  ].join("\n");
};
