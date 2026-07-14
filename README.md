# @aio-proxy/provider-schemas

Generated JSON Schemas for AI SDK provider factory options.

```ts
import { providerOptionsSchema } from "@aio-proxy/provider-schemas";

const entry = providerOptionsSchema("@ai-sdk/openai");
```

Executable Zod 4 schemas are available from the optional subpath:

```ts
import { providerOptionsZodSchema } from "@aio-proxy/provider-schemas/zod";

const schema = providerOptionsZodSchema("@ai-sdk/openai");
const result = schema?.safeParse({ apiKey: process.env.OPENAI_API_KEY });
```

Install a compatible Zod 4 version when using this subpath. The main JSON Schema entry does not import Zod.

Provider package names and factory functions live in the build-only `providers.json` catalog. It is the only Provider list maintained by hand.

To add a provider:

1. Add its package and factory names to `providers.json` in import-specifier order; use `subpath` for package exports such as `@ai-sdk/google-vertex/anthropic`.
2. Run `bun run generate`.

Use `overrides.optional` when an upstream required root option should be optional in the published schema.

Generation installs new Providers from npm at an exact version, removes deleted Providers, and synchronizes `package.json`, `bun.lock`, `.github/dependabot.yml`, `src/zod-module.ts`, and `src/schema-module.ts`. Existing versions are preserved and subsequently updated by Dependabot.

## Registry security

This repository only permits the public npm registry. Install dependencies with:

```sh
bun run install:public
bunx lefthook install
```

Lefthook checks the staged Git index before every commit. CI additionally scans the complete reachable commit history, so credentials or private registry URLs remain blocked even if a later commit removes them.

## Releases

Changesets maintains the release pull request and publishes merged versions through npm Trusted Publishing. Dependabot pull requests receive a patch changeset automatically; other user-facing pull requests should include an appropriate changeset.

The package must be published and connected to GitHub once before automated releases can start:

```sh
npm publish --access public
npm trust github @aio-proxy/provider-schemas --file .github/workflows/release.yml --repo aio-proxy/provider-schemas --allow-publish --yes
```

Run the first command with an authenticated npm account after this workflow reaches `main`. Later releases are published from `.github/workflows/release.yml` through OIDC without an `NPM_TOKEN`.

The organization must permit GitHub Actions to create pull requests. Then enable **Allow GitHub Actions to create and approve pull requests** under the repository's Actions workflow permissions so Changesets can maintain the release pull request.
