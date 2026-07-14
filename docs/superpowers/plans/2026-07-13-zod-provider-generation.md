# Zod Provider Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the custom Babel/TypeBox generation pipeline with ts-morph, ts-to-zod, and Zod 4 while adding an optional public `/zod` subpath.

**Architecture:** ts-morph resolves each Provider factory and emits standalone TypeScript source. ts-to-zod consumes only that source-text boundary and generates executable Zod source; Zod 4 converts the same schemas to the static JSON Schema snapshot. The main entry remains JSON-only, while `/zod` imports Zod at runtime.

**Tech Stack:** Bun 1.3.14, TypeScript 6, ts-morph 28, ts-to-zod 5.1, Zod 4.

## Global Constraints

- Complete `2026-07-13-provider-catalog-sync.md` first.
- Remove `@babel/parser`, TypeBox, the custom declaration graph, and unused parser outputs.
- Never pass AST nodes between ts-morph's TypeScript instance and ts-to-zod's TypeScript 5 instance.
- Unsupported optional properties are omitted with warnings; unsupported required properties make the Provider JSON schema unavailable.
- Plain JSDoc descriptions are exposed to `ts-to-zod` through its `@description` metadata tag.
- `z.toJSONSchema()` uses input semantics, inline reused schemas, and `unrepresentable: "any"`; warned top-level optional properties are removed from JSON output.
- The current 42-Provider JSON snapshot is the regression baseline.
- `zod` is an exact devDependency and an optional compatible Zod 4 peer dependency.
- Every commit appends `Co-authored-by: Codex <noreply@openai.com>` as a message footer.

---

### Task 1: Prove the source-text conversion boundary

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`
- Create: `tests/ts-to-zod-compatibility.test.ts`

**Interfaces:**
- Produces evidence that `generate({ sourceText })` works under Bun while the repository compiles with TypeScript 6.

- [ ] **Step 1: Add exact build dependencies**

Run:

```bash
bun add --dev --exact ts-morph@28.0.0 ts-to-zod@5.1.0 zod@4.4.3
```

Expected: `package.json` and `bun.lock` update; no runtime dependency is added.

- [ ] **Step 2: Write the compatibility test**

```ts
import { expect, test } from "bun:test";
import { generate } from "ts-to-zod";

test("ts-to-zod generates Zod 4 source from a standalone type", () => {
  const result = generate({
    sourceText: "export interface FixtureOptions { apiKey?: string }",
    getSchemaName: (name) => `${name}Schema`,
    keepComments: true,
  });
  expect(result.errors).toEqual([]);
  expect(result.getZodSchemasFile("./fixture-types")).toContain("FixtureOptionsSchema");
  expect(result.getZodSchemasFile("./fixture-types")).toContain("z.object");
});
```

- [ ] **Step 3: Run the compatibility test**

Run: `bun test tests/ts-to-zod-compatibility.test.ts`

Expected: PASS. If it fails because the documented programmatic API differs, inspect the installed package declarations and update only the call shape; do not import ts-to-zod internal modules.

- [ ] **Step 4: Commit the compatibility gate**

```bash
git add package.json bun.lock tests/ts-to-zod-compatibility.test.ts
git commit -m "test: verify ts-to-zod generation boundary"
```

### Task 2: Replace custom declaration traversal with ts-morph

**Files:**
- Create: `scripts/provider-declaration.ts`
- Replace tests: `tests/declaration-parser.test.ts`

**Interfaces:**
- Produces: `extractProviderDeclaration(options): Promise<{ sourceText: string; warnings: ProviderOptionsSchemaWarning[] }>`
- Consumes: `{ packageRoot, declarationEntry, factoryName }`.

- [ ] **Step 1: Rewrite tests around production outputs only**

Keep fixtures for direct exports, named re-exports, export stars, imported aliases, first overload selection, referenced declarations, cycles, interface/property JSDoc, unsupported optional properties, and unsupported required properties. Delete tests for `optional`, `sourceFiles`, callbacks, depth, file-count, and byte limits.

```ts
const result = await extractProviderDeclaration({ packageRoot: root, declarationEntry: entry, factoryName: "createFixture" });
expect(result.sourceText).toContain("export interface FixtureOptions");
expect(result.sourceText).toContain("export interface SharedOptions");
expect(result.warnings).toContainEqual({ code: "unsupported_optional", path: "fetch" });
```

- [ ] **Step 2: Run the declaration tests and confirm failure**

Run: `bun test tests/declaration-parser.test.ts`

Expected: FAIL because `provider-declaration.ts` does not exist.

- [ ] **Step 3: Implement the ts-morph analyzer**

```ts
const project = new Project({
  compilerOptions: { allowJs: false, declaration: true, moduleResolution: ModuleResolutionKind.Bundler },
  skipAddingFilesFromTsConfig: true,
});
const entry = project.addSourceFileAtPath(declarationEntry);
project.resolveSourceFileDependencies();
const declarations = entry.getExportedDeclarations().get(factoryName);
if (!declarations?.length) throw new Error(`Exported provider factory not found: ${factoryName}`);
```

Resolve the first call signature and first parameter from the exported declaration. Walk referenced type declarations through ts-morph symbols, deduplicate by canonical file path plus declaration position, and print a standalone source containing only required interfaces/type aliases. Preserve JSDoc in printed text. Sanitize unsupported optional properties before printing and collect their dot paths; throw a typed `UnsupportedRequiredProviderOptionError` for required unsupported properties.

- [ ] **Step 4: Run declaration tests**

Run: `bun test tests/declaration-parser.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the analyzer**

```bash
git add scripts/provider-declaration.ts tests/declaration-parser.test.ts
git commit -m "refactor: analyze provider declarations with ts-morph"
```

### Task 3: Generate Zod and JSON Schema from the same source

**Files:**
- Create: `scripts/provider-schema-generator.ts`
- Modify: `scripts/generate.ts`
- Replace tests: `tests/schema-generator.test.ts`
- Generate: `src/zod-module.ts`
- Generate: `src/schema-module.ts`

**Interfaces:**
- Consumes: `extractProviderDeclaration()` from Task 2.
- Produces: `generateProviderArtifacts(rootPath): Promise<{ jsonSource: string; zodSource: string; count: number }>`

- [ ] **Step 1: Write failing artifact tests**

```ts
const artifacts = await generateProviderArtifacts(rootPath);
expect(artifacts.zodSource).toContain('import * as z from "zod"');
expect(artifacts.zodSource).toContain("PROVIDER_OPTIONS_ZOD_SCHEMAS");
expect(artifacts.jsonSource).toContain('"packageVersion": "1.0.0"');
expect(artifacts.jsonSource).toContain('"apiKey"');
```

Add a test that imports the generated temporary Zod module and asserts `safeParse({ apiKey: "x" }).success === true`, then compares its `z.toJSONSchema()` result with the JSON artifact entry.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `bun test tests/schema-generator.test.ts`

Expected: FAIL because the new generator does not exist.

- [ ] **Step 3: Implement source generation**

```ts
const result = generate({
  sourceText: declaration.sourceText,
  getSchemaName: (name) => `${name}Schema`,
  keepComments: true,
});
if (result.errors.length) throw new Error(result.errors.join("\n"));
```

Keep the standalone declaration source in memory, copy plain JSDoc text into `@description` tags for `ts-to-zod`, and render `src/zod-module.ts` with widened map typing. Import that module during generation with a cache-busting file URL, call `z.toJSONSchema(schema, { unrepresentable: "any", io: "input", cycles: "ref", reused: "inline" })`, attach package/factory/version/warnings metadata, sort recursively, and render `src/schema-module.ts`.

- [ ] **Step 4: Integrate both generated targets into check/write mode**

`generate --check` compares both files without writing. Normal generation writes each file only when its content differs. Return one result containing changed target names so CLI output is explicit.

- [ ] **Step 5: Run focused tests and current catalog generation**

Run:

```bash
bun test tests/schema-generator.test.ts tests/generate-command.test.ts
bun run generate
git diff -- src/schema-module.ts src/zod-module.ts
```

Expected: tests pass. Review any JSON snapshot difference field-by-field; do not accept broad churn from Zod defaults. Add only the smallest JSON post-processing needed to preserve descriptions, requiredness, references, and `additionalProperties` behavior.

- [ ] **Step 6: Commit generated artifacts**

```bash
git add scripts/provider-schema-generator.ts scripts/generate.ts tests/schema-generator.test.ts tests/generate-command.test.ts src/schema-module.ts src/zod-module.ts
git commit -m "feat: generate zod and json provider schemas"
```

### Task 4: Publish the optional Zod subpath

**Files:**
- Create: `src/zod.ts`
- Modify: `src/types.ts`
- Modify: `package.json`
- Modify: `tests/public-api.test.ts`
- Modify: `tests/runtime-leakage.test.ts`

**Interfaces:**
- Produces: `PROVIDER_OPTIONS_ZOD_SCHEMAS: Readonly<Record<string, z.ZodType>>`
- Produces: `providerOptionsZodSchema(packageName: string): z.ZodType | undefined`
- Produces package export: `@aio-proxy/provider-schemas/zod`.

- [ ] **Step 1: Write public API tests**

```ts
import { providerOptionsZodSchema, PROVIDER_OPTIONS_ZOD_SCHEMAS } from "../src/zod";

test("returns a generated Zod schema", () => {
  const [packageName, schema] = Object.entries(PROVIDER_OPTIONS_ZOD_SCHEMAS)[0]!;
  expect(providerOptionsZodSchema(packageName)).toBe(schema);
  expect(schema.safeParse({}).success).toBe(true);
});
```

Extend package tests to import `dist/index.js` with Zod temporarily hidden and to import `dist/zod.js` with Zod present.

- [ ] **Step 2: Run tests and confirm failure**

Run: `bun test tests/public-api.test.ts tests/runtime-leakage.test.ts`

Expected: FAIL because the subpath and source module do not exist.

- [ ] **Step 3: Add the subpath and peer contract**

```ts
import { PROVIDER_OPTIONS_ZOD_SCHEMAS } from "./zod-module.js";
import type { ZodType } from "zod";

export { PROVIDER_OPTIONS_ZOD_SCHEMAS } from "./zod-module.js";
export const providerOptionsZodSchema = (packageName: string): ZodType | undefined =>
  PROVIDER_OPTIONS_ZOD_SCHEMAS[packageName];
```

Add `./zod` to `package.json.exports`, add `peerDependencies: { "zod": "^4.1.5" }`, and add `peerDependenciesMeta: { "zod": { "optional": true } }`. Update the npm security exact-version rule so ranges remain forbidden in installed dependency sections but are permitted in `peerDependencies`.

- [ ] **Step 4: Run build and package tests**

Run:

```bash
bun run typecheck
bun run build
bun test tests/public-api.test.ts tests/runtime-leakage.test.ts tests/npm-security.test.ts
bun pm pack --dry-run
```

Expected: all commands pass; the main entry contains no runtime `zod` import; `dist/zod.js` does.

- [ ] **Step 5: Commit the public API**

```bash
git add src/zod.ts src/types.ts package.json tests/public-api.test.ts tests/runtime-leakage.test.ts tests/npm-security.test.ts
git commit -m "feat: export optional zod provider schemas"
```

### Task 5: Remove the old parser and TypeBox pipeline

**Files:**
- Delete: `scripts/declaration-entry.ts`
- Delete: `scripts/declaration-parser.ts`
- Delete: `scripts/provider-schemas-generator.ts`
- Delete: `scripts/schema-normalizer.ts`
- Modify: `package.json`
- Modify: `bun.lock`
- Modify: test imports and `package.json.scripts.test:unit`

**Interfaces:**
- Consumes: new generator and analyzer from Tasks 2–4.
- Produces: no old build-time parser imports or dependencies.

- [ ] **Step 1: Confirm all production and test imports use the new modules**

Run: `rg -n 'declaration-entry|declaration-parser|provider-schemas-generator|schema-normalizer|@babel/parser|typebox' scripts tests src package.json`

Expected: only old files, old test names, and dependency declarations remain.

- [ ] **Step 2: Delete old files and dependencies**

Run:

```bash
bun remove @babel/parser typebox
```

Delete the four old scripts and update `test:unit` to the surviving test paths.

- [ ] **Step 3: Run full phase verification**

Run:

```bash
bun run generate
bun run ci:installed
rg -n '@babel/parser|typebox|declaration-parser|schema-normalizer' scripts src package.json
git diff --check
```

Expected: CI passes; the search returns no production references; a second generation is clean.

- [ ] **Step 4: Commit the removal**

```bash
git add -A scripts tests package.json bun.lock src
git commit -m "refactor: remove legacy provider schema pipeline"
```
