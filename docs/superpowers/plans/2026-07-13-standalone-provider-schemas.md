# Standalone Provider Schemas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, publishable `@aio-proxy/provider-schemas` package whose schemas are generated from exact installed provider development dependencies.

**Architecture:** Preserve the existing declaration parser, TypeBox normalizer, runtime lookup API, and safety limits. Replace npm tarball resolution and Rslib transforms with direct `node_modules` resolution, an explicit generator command, a committed schema snapshot, ordinary TypeScript compilation, and daily Dependabot updates.

**Tech Stack:** Bun 1.3.14, TypeScript 6, Bun test, Biome 2, Babel parser, TypeBox 1, GitHub Actions, Dependabot.

## Global Constraints

- Provider packages are exact-version `devDependencies`; runtime dependencies remain empty.
- CI installs dependencies without lifecycle scripts and with a frozen lockfile.
- Generated schemas are committed in `src/schema-module.ts`.
- Published files are limited to `dist` plus package metadata.
- No git commit is created during this execution.

---

### Task 1: Standalone Package Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.build.json`
- Create: `biome.json`
- Create: `.gitignore`
- Create: `README.md`
- Create: `LICENSE`
- Create: `src/index.ts`
- Create: `src/types.ts`
- Create: `src/allowlist.ts`

**Interfaces:**
- Produces: `providerOptionsSchema(packageName)`, `hasProviderOptionsSchema(packageName)`, `PROVIDER_OPTIONS_SCHEMAS`, `PROVIDER_SCHEMA_ALLOWLIST`, and runtime schema types.

- [ ] Copy the existing runtime API and allowlist into the standalone package.
- [ ] Configure plain ESM TypeScript output to `dist` with declaration files.
- [ ] Configure npm exports, public access, `files: ["dist"]`, and zero runtime dependencies.
- [ ] Run `bun install --ignore-scripts` and `bun run typecheck`; expect exit code 0 after generated source exists.

### Task 2: Installed Provider Source Generation

**Files:**
- Create: `scripts/declaration-entry.ts`
- Create: `scripts/declaration-parser.ts`
- Create: `scripts/schema-normalizer.ts`
- Create: `scripts/provider-schemas-generator.ts`
- Create: `scripts/generate.ts`
- Create: `tests/installed-provider-source.test.ts`

**Interfaces:**
- Produces: `resolveInstalledProviderSource(rootPath, source): Promise<string>`.
- Produces: `generateProviderSchemaEntries({ rootPath, sources?, resolveSource? })`.
- Produces: deterministic `renderGeneratedProviderSchemas(entries)` output.

- [ ] Write a failing test that resolves a fixture direct dependency below `node_modules` and rejects missing or escaped package roots.
- [ ] Run `bun test tests/installed-provider-source.test.ts`; expect failure because the resolver does not exist.
- [ ] Implement direct package-root resolution with `realpath` containment and package identity validation.
- [ ] Run the resolver test; expect pass.
- [ ] Adapt the existing generator to use installed provider roots and remove cache/refresh options.

### Task 3: Parser, Normalizer, and Snapshot Migration

**Files:**
- Create: `tests/declaration-parser.test.ts`
- Create: `tests/schema-generator.test.ts`
- Create: `src/schema-module.ts`

**Interfaces:**
- Consumes: installed provider roots from Task 2.
- Produces: a committed 42-entry `PROVIDER_OPTIONS_SCHEMAS` snapshot.

- [ ] Migrate parser and generator unit fixtures without tarball-cache assertions.
- [ ] Run the migrated unit tests and confirm their pre-migration failures are limited to missing standalone paths or APIs.
- [ ] Implement the minimal path/import changes required by the standalone repository.
- [ ] Run `bun run generate` to write the initial snapshot.
- [ ] Run `bun run generate` again and `git diff --exit-code -- src/schema-module.ts`; expect no second-run diff.
- [ ] Run all Bun tests; expect zero failures.

### Task 4: Dependency and CI Automation

**Files:**
- Create: `.github/dependabot.yml`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Dependabot checks provider sources every weekday at 09:00 Asia/Shanghai.
- CI verifies the lockfile, generated snapshot, formatting, types, tests, build, and npm package contents.

- [ ] Restrict Dependabot to `@ai-sdk/*` and `@openrouter/ai-sdk-provider`, group updates, and limit open version-update PRs to one.
- [ ] Configure CI with Bun 1.3.14 and `bun install --frozen-lockfile --ignore-scripts`.
- [ ] Run the same CI command locally and confirm exit code 0.

### Task 5: Package Boundary Verification

**Files:**
- Create: `tests/runtime-leakage.test.ts`
- Inspect: `dist/**`

**Interfaces:**
- Verifies the published runtime boundary contains no generator-only dependencies.

- [ ] Write a failing leakage test that scans `dist` for Babel, TypeBox, provider package, Node filesystem, and Bun imports.
- [ ] Build the package and make the leakage test pass without allowlisting generator dependencies.
- [ ] Run `npm pack --dry-run`; verify only `dist`, `README.md`, `LICENSE`, and package metadata are included.
- [ ] Run `git status --short --branch`; verify all work remains uncommitted.
