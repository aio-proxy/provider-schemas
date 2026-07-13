# Provider generation simplification design

## Goal

Make `providers.json` the only file a maintainer edits when adding or removing a provider. A single `bun run generate` command synchronizes provider dependencies, the lockfile, Dependabot policy, and the generated schema snapshot.

At the same time, simplify the complete `scripts/` implementation. Prefer Bun-native file and process APIs, replace the custom declaration graph parser with `ts-morph`, remove unused build-only capabilities, and materially reduce the amount of code without weakening the repository's security guarantees.

## Source of truth

`providers.json` remains an ordered array of:

```json
{ "packageName": "@ai-sdk/openai", "factoryName": "createOpenAI" }
```

It intentionally contains no version. It is the only manually maintained provider catalog and determines:

- which provider packages must exist in `package.json.devDependencies`;
- which packages Dependabot may update;
- which installed packages are inspected to produce `src/schema-module.ts`.

`package.json` remains the persisted version state required by the package manager. Existing exact provider versions are preserved, including versions written by Dependabot. When a catalog entry has no corresponding dependency, generation resolves `<package>@latest` and writes the resolved exact version.

## Generation flow

`bun run generate` performs one explicit pipeline:

1. Read and validate `providers.json` for shape, valid package and factory names, duplicates, and package-name ordering.
2. Read the previously generated Dependabot allow list to identify the prior managed provider set.
3. Remove packages that were previously managed but no longer appear in the catalog.
4. Add catalog packages missing from `devDependencies` using Bun's exact development-dependency installation. Existing provider versions are never rewritten by generation.
5. Let Bun update `package.json`, `bun.lock`, and `node_modules` as part of dependency addition or removal.
6. Render `.github/dependabot.yml` deterministically from the catalog.
7. Read the installed provider declaration files and render `src/schema-module.ts`.

Adding a provider may access the public npm registry. A generation run with no provider membership changes must not perform dependency installation or make network requests.

The generated Dependabot configuration contains one exact `allow` entry per catalog package. The `provider-sources` group uses `patterns: ["*"]`; the allow list already restricts the update job, so the provider names are not duplicated in the group.

## Check mode

`bun run check:generated` remains read-only and offline. It verifies that:

- the catalog is valid;
- the Provider subset of `devDependencies` matches the catalog;
- every Provider dependency uses an exact version;
- the generated Dependabot configuration matches the catalog;
- the generated schema snapshot matches the installed provider versions.

Check mode never installs, removes, or rewrites files. Its error tells the maintainer to run `bun run generate`.

## Dependabot flow

Dependabot continues to update existing exact versions in `package.json` and `bun.lock`. Generation preserves those versions because it only installs missing catalog packages.

The existing Dependabot snapshot workflow runs generation after an update. Generation refreshes schemas while leaving Dependabot's new versions intact. No version is written back to `providers.json`.

## Script architecture

The refactor should leave a small number of modules with direct responsibilities:

- generation orchestration and configuration synchronization;
- Provider declaration analysis and schema rendering;
- schema normalization;
- npm registry and credential security scanning.

Existing thin modules may be merged or deleted when they no longer define a useful boundary. No general-purpose configuration generation framework is introduced.

### Declaration analysis

Use `ts-morph` as the declaration-analysis layer. It replaces the custom Babel-based file graph, import/re-export resolution, alias tracking, overload handling, declaration collection, and JSDoc traversal.

The analyzer:

- loads the package declaration entry selected from `exports["."].types`, `types`, or `typings`;
- resolves the configured factory from the entry module's exported declarations, including named re-exports and export stars;
- selects the first public call signature and reads its first parameter type;
- collects the referenced declarations needed by TypeBox;
- reads declaration and property JSDoc;
- uses the same AST layer to handle the existing `typeof fetch` compatibility rewrite.

Remove `@babel/parser` after the migration. Direct TypeScript Compiler API calls are allowed only where `ts-morph` has no suitable read-only API and the fallback is smaller than a custom workaround.

The following existing outputs are not part of the production contract and are removed:

- parsed parameter optionality;
- source-file lists;
- dependency callbacks and generated dependency lists;
- custom declaration file-count, traversal-depth, and aggregate-byte limits.

TypeScript/ts-morph owns module resolution and cycle handling instead of duplicating those mechanisms locally.

### Schema normalization

Keep only normalization behavior exercised by the installed provider catalog and required by the public output contract:

- resolve local definitions and recursive references;
- omit unsupported optional properties with warnings;
- fail schemas when unsupported required properties make the root unusable;
- retain descriptions and deterministic ordering.

Branches that are neither used by the current Provider set nor needed by these policies may be deleted. The committed `src/schema-module.ts` is the behavioral regression baseline.

### Security scanning

Security is not an edge capability. Preserve all existing protections:

- forbid tracked package-manager registry configuration;
- reject private registries and credential-bearing URLs;
- reject npm credentials without echoing their values;
- require exact dependency versions;
- scan the staged index, working tree, and reachable Git history.

The implementation may be shortened and switched to Bun file/process APIs, but these checks and their fail-closed behavior remain.

## Bun-native implementation policy

Use:

- `Bun.file()` for content reads and existence checks;
- `Bun.write()` for generated content;
- `Bun.spawn()` or `Bun.spawnSync()` for Bun and Git subprocesses;
- Bun's package-manager CLI for exact dependency addition/removal and lockfile updates.

Retain `node:path`, temporary-directory APIs, and `realpath` only where Bun has no equally direct native replacement. Do not reimplement path or filesystem primitives merely to remove a `node:` import.

## Error handling

Generation fails before schema rendering when:

- the catalog is invalid;
- a package cannot be resolved from the public npm registry;
- Bun dependency synchronization fails;
- an installed package identity does not match its catalog name;
- the configured factory or typed first parameter cannot be resolved;
- a generated target cannot be rendered deterministically.

Subprocess failures include the command and sanitized stderr. Errors must never print registry credentials or token values.

## Testing and verification

Tests cover:

- adding a catalog Provider resolves and stores an exact development dependency;
- removing a catalog Provider removes it from the manifest and lockfile;
- existing Provider versions, including Dependabot updates, are preserved;
- non-Provider development dependencies are preserved;
- Dependabot exact allow entries are sorted and the group uses one wildcard;
- check mode is offline, read-only, and rejects drift;
- generation is idempotent;
- ts-morph resolves direct exports, named re-exports, export stars, aliases, overloads, referenced declarations, cycles, and JSDoc needed by real Providers;
- all current npm security guarantees remain covered;
- the current 42-Provider schema snapshot remains unchanged unless an intentional, reviewed normalization correction is required.

Verification runs the full repository CI command and a second generation followed by a clean Git diff.

## Simplification acceptance criteria

The refactor is successful only if:

- maintainers add or remove Providers by editing only `providers.json` and running `bun run generate`;
- the number of scripts and total production script lines decrease materially;
- the custom declaration graph parser and `@babel/parser` are removed;
- unused parser outputs and dependency tracking are removed;
- duplicated Provider lists and wildcard-matching validation code are removed;
- no new abstraction exists solely for hypothetical future generators;
- the published package still contains no runtime dependency or build-script leakage.

If the ts-morph implementation does not remove substantially more code than it adds, use the direct TypeScript Compiler API instead rather than keeping both layers.

## Non-goals

- Storing Provider versions in `providers.json`.
- Replacing Dependabot with a custom updater.
- Automatically committing generated files from local hooks or CI.
- Changing the public runtime API.
- Weakening registry, credential, exact-version, or Git-history security checks.
