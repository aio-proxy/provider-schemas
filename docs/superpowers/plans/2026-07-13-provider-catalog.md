# Provider Catalog Implementation Plan

> **For agentic workers:** Execute inline with test-driven development. Do not delegate or commit; the user requested unstaged, uncommitted work.

**Goal:** Consolidate provider identity and factory metadata in `providers.json` while validating its consistency with exact provider `devDependencies` and Dependabot policy.

**Architecture:** A build-only catalog module reads the JSON manifest and validates package/dependency/Dependabot relationships. The schema generator loads this catalog by default, while the published runtime API exposes only generated schemas.

**Tech Stack:** Bun 1.3.14, TypeScript 6, Bun test, Bun YAML parser, Biome.

## Global Constraints

- `providers.json` never stores versions.
- `package.json.devDependencies` remains the provider-version source of truth.
- Do not add dependencies.
- Use Bun file APIs for build-script content reads and writes.
- Do not stage or commit changes.

---

### Task 1: Catalog reader and consistency validator

**Files:**
- Create: `providers.json`
- Create: `scripts/provider-catalog.ts`
- Create: `tests/provider-catalog.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `ProviderSchemaSource`, `readProviderSchemaCatalog(rootPath)`, and `validateProviderSchemaCatalog(rootPath)`.

- [ ] Write tests that create temporary `providers.json`, `package.json`, and `.github/dependabot.yml` fixtures and assert valid configuration succeeds.
- [ ] Add failing cases for duplicate/unsorted catalog entries, missing and non-exact development dependencies, uncovered Dependabot entries, and provider dependencies absent from the catalog.
- [ ] Run `bun test tests/provider-catalog.test.ts` and confirm failure because the catalog module is absent.
- [ ] Implement the smallest catalog parser, exact-version check, and restricted `*` pattern matcher using Bun file and YAML APIs.
- [ ] Add `check:catalog` and include the test in `test:unit`.
- [ ] Run `bun test tests/provider-catalog.test.ts` and confirm all cases pass.

### Task 2: Generator and public API migration

**Files:**
- Delete: `src/allowlist.ts`
- Modify: `scripts/provider-schemas-generator.ts`
- Modify: `scripts/generate.ts`
- Modify: `src/index.ts`
- Modify: `tests/schema-generator.test.ts`
- Modify: `tests/generate-command.test.ts`
- Modify: `tests/public-api.test.ts`

**Interfaces:**
- Consumes: `readProviderSchemaCatalog(rootPath)` and `ProviderSchemaSource`.
- Preserves: explicit `GenerateProviderSchemasOptions.sources` for unit fixtures.

- [ ] Update tests first to expect default catalog loading, Bun-backed synchronization behavior, and removal of public allowlist exports.
- [ ] Run the focused tests and confirm they fail for the old implementation.
- [ ] Make the generator await the catalog only when explicit sources are absent.
- [ ] Replace `generate.ts` content reads/writes with `Bun.file()`, `file.exists()`, and `Bun.write()`.
- [ ] Remove the old allowlist module and exports.
- [ ] Run the focused tests and confirm they pass.

### Task 3: CI, documentation, and verification

**Files:**
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Produces: `bun run check:catalog` as a CI-visible consistency gate.

- [ ] Add `check:catalog` to `ci:installed` before `check:generated`.
- [ ] Update README terminology from allowlist to provider catalog and document the two-line provider addition workflow.
- [ ] Run `bun run generate` to confirm the committed-style snapshot remains deterministic.
- [ ] Run `bun run ci` and `npm pack --dry-run` with the public registry policy intact.
- [ ] Inspect `git diff`, `git status`, and staged state; confirm no files are staged and no commit exists.
