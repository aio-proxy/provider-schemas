import { describe, expect, test } from "bun:test";
import * as publicApi from "../src/index";
import { hasProviderOptionsSchema, PROVIDER_OPTIONS_SCHEMAS, providerOptionsSchema } from "../src/index";
import { PROVIDER_OPTIONS_ZOD_SCHEMAS, providerOptionsZodSchema } from "../src/zod";

describe("provider schema lookup", () => {
  test("returns a generated schema entry by package name", () => {
    const first = Object.entries(PROVIDER_OPTIONS_SCHEMAS)[0];
    expect(first).toBeDefined();
    if (first === undefined) return;
    const [packageName, entry] = first;
    expect(hasProviderOptionsSchema(packageName)).toBe(entry.schema !== null);
    expect(providerOptionsSchema(packageName)).toEqual(entry.schema === null ? undefined : entry);
  });

  test("returns undefined for unknown packages", () => {
    expect(hasProviderOptionsSchema("unknown-provider")).toBe(false);
    expect(providerOptionsSchema("unknown-provider")).toBeUndefined();
  });

  test("does not publish the build-time provider catalog", () => {
    expect(publicApi).not.toHaveProperty("PROVIDER_SCHEMA_ALLOWLIST");
  });

  test("returns an executable Zod schema from the optional subpath", () => {
    const first = Object.entries(PROVIDER_OPTIONS_ZOD_SCHEMAS)[0];
    expect(first).toBeDefined();
    if (first === undefined) return;
    const [packageName, schema] = first;
    expect(providerOptionsZodSchema(packageName)).toBe(schema);
    expect(schema.safeParse({}).success).toBe(true);
    expect(providerOptionsZodSchema("unknown-provider")).toBeUndefined();
  });
});
