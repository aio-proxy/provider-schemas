import { expect, test } from "bun:test";
import { generate } from "ts-to-zod";

test("ts-to-zod generates Zod 4 source from standalone TypeScript", () => {
  const result = generate({
    sourceText: "export interface FixtureOptions { apiKey?: string }",
    getSchemaName: (name) => `${name}Schema`,
    keepComments: true,
  });

  expect(result.errors).toEqual([]);
  expect(result.getZodSchemasFile("./fixture-types.js")).toContain("FixtureOptionsSchema");
  expect(result.getZodSchemasFile("./fixture-types.js")).toContain("z.object");
});
