# Standalone Provider Schemas Design

## Goal

Publish `@aio-proxy/provider-schemas` from a standalone repository. Provider declaration sources are installed as exact-version development dependencies, generated into a committed TypeScript snapshot, and updated through reviewed Dependabot pull requests.

## Constraints

- Use Bun 1.3.14 as the development package manager and test runner.
- Publish plain ESM JavaScript and TypeScript declarations that do not require Bun at runtime.
- Keep every provider source at an exact version in `devDependencies`.
- Keep the generated `src/schema-module.ts` snapshot in version control.
- Keep runtime dependencies empty and publish only `dist`.
- Do not execute dependency lifecycle scripts in CI update jobs.
- Preserve package-root containment, declaration depth, file-count, and byte limits.
- Do not create a git commit until the user explicitly requests one.

## Repository Shape

```text
provider-schemas/
├── .github/
│   ├── dependabot.yml
│   └── workflows/ci.yml
├── docs/superpowers/
├── scripts/
│   ├── declaration-entry.ts
│   ├── declaration-parser.ts
│   ├── generate.ts
│   ├── provider-schemas-generator.ts
│   └── schema-normalizer.ts
├── src/
│   ├── allowlist.ts
│   ├── index.ts
│   ├── schema-module.ts
│   └── types.ts
├── tests/
├── biome.json
├── bun.lock
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

## Dependency Model

The 42 allowlisted provider packages are direct `devDependencies` with exact versions. `package.json` and `bun.lock` are the only provider-version source of truth. The allowlist continues to contain only `{ packageName, factoryName }` pairs.

The generator resolves `node_modules/<packageName>` from the repository root. It reads package metadata and declaration files without importing or executing provider code. The tarball downloader, npm-latest metadata resolver, integrity verifier, extraction cache, immutable observations, and Rslib VM bridge are removed.

## Generation and Build

`bun run generate` renders `src/schema-module.ts`. The generated export is widened to `Readonly<Record<string, ProviderOptionsSchemaEntry>>` so declaration output does not contain the entire schema literal type.

`bun run check:generated` regenerates the snapshot and fails when the working tree changes. `tsc -p tsconfig.build.json` emits ESM JavaScript and declarations into `dist`. The npm package exports only `dist/index.js` and `dist/index.d.ts` and has no runtime dependencies.

## Automation

Dependabot checks npm dependencies every weekday at 09:00 Asia/Shanghai. It is restricted to the allowlisted provider packages and groups them into one provider-source update PR. CI installs with a frozen lockfile, regenerates the snapshot, checks formatting and types, runs unit tests, builds the package, and inspects the package tarball.

Dependabot is periodic rather than an npm publication webhook. A provider published after the daily check is discovered on the next weekday check.

## Release Boundary

This scaffold prepares a public npm package with `publishConfig.access = public`. Automated npm publication is added only after the GitHub repository and npm trusted-publishing relationship exist; the local scaffold does not embed an npm token or an unusable release workflow.

## Non-goals

- Migrating the aio-proxy consumer to the published dependency in this change.
- Supporting private registries or provider packages outside the allowlist.
- Executing provider JavaScript during generation.
- Providing real-time npm publication events.
- Keeping compatibility with the previous tarball cache format.

## Verification

- Existing parser and schema-normalizer tests pass after migration.
- Generation succeeds for every allowlisted installed provider.
- A second generation run produces no diff.
- Build output contains no Babel, TypeBox, provider package, filesystem, or Bun runtime imports.
- `npm pack --dry-run` contains only intended package files.
