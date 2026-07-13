import { PROVIDER_OPTIONS_SCHEMAS } from "./schema-module.js";
import type { ProviderOptionsSchemaEntry } from "./types.js";

export { PROVIDER_OPTIONS_SCHEMAS } from "./schema-module.js";

export const providerOptionsSchema = (packageName: string) => {
  const entry = (PROVIDER_OPTIONS_SCHEMAS as Readonly<Record<string, ProviderOptionsSchemaEntry>>)[packageName];
  return entry?.schema === null ? undefined : entry;
};

export const hasProviderOptionsSchema = (packageName: string) => providerOptionsSchema(packageName) !== undefined;

export type {
  JsonSchema,
  ProviderOptionsSchemaEntry,
  ProviderOptionsSchemaWarning,
} from "./types.js";
