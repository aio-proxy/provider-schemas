# Provider Schema Catalog Design

## Goal

Replace the public `allowlist` module and duplicated provider configuration with a build-only provider catalog that keeps provider identity, dependency versions, and Dependabot coverage consistent.

## Source of truth

- `providers.json` contains the ordered `{ packageName, factoryName }` catalog. It does not contain versions.
- `package.json.devDependencies` remains the only provider-version source of truth so Dependabot can update versions and `bun.lock` directly.
- `.github/dependabot.yml` remains the update-policy source of truth. Its stable patterns select and group the provider dependencies.

No file is generated from another configuration file. A catalog validation script reads all three sources and rejects drift.

## Build-time API

Create `scripts/provider-catalog.ts` with these responsibilities:

- Read and validate `providers.json` using `Bun.file().json()`.
- Return provider sources to the schema generator.
- Read `package.json` using `Bun.file().json()` and require every catalog package to be an exact-version `devDependency`.
- Read `.github/dependabot.yml` using `Bun.file().text()` and `Bun.YAML.parse()`.
- Require both Dependabot `allow` rules and the `provider-sources` group to cover every catalog package.
- Require every development dependency selected by the provider `allow` rules to appear in the catalog.
- Reject invalid, duplicate, or unsorted catalog entries with actionable errors.

The script doubles as the `check:catalog` CLI command. It adds no runtime dependency and no YAML library.

## Published API

Delete `src/allowlist.ts` and remove `PROVIDER_SCHEMA_ALLOWLIST` and `ProviderSchemaAllowlistEntry` from the package exports. The catalog is build configuration, not runtime API. Consumers already have `PROVIDER_OPTIONS_SCHEMAS`, which contains the generated package name and factory metadata.

## Generation flow

When callers do not provide explicit test sources, `generateProviderSchemaEntries()` reads `providers.json` through the catalog module. Explicit `sources` continue to work for focused tests.

`scripts/generate.ts` uses `Bun.file()`, `Bun.write()`, and `file.exists()` for file contents. Node filesystem APIs remain where Bun's file-content API is not a replacement, such as `realpath`, temporary directories, and directory traversal.

## CI and Dependabot

Add `check:catalog` to `ci:installed` before snapshot verification. Dependabot continues updating `package.json` and `bun.lock`; the privileged snapshot workflow regenerates only `src/schema-module.ts`. No reverse synchronization is needed because `providers.json` contains no versions.

## Verification

- Catalog tests cover valid configuration, missing/extraneous dependencies, non-exact versions, Dependabot coverage, duplicates, and ordering.
- Generator tests prove the default catalog is loaded and explicit sources still work.
- Public API tests prove the old allowlist exports are gone.
- Full CI, build, runtime leakage, generated snapshot, and package dry-run checks pass.

## Constraints

- Use only the public npm registry.
- Add no dependencies.
- Keep all work unstaged and uncommitted.
