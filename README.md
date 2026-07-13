# @aio-proxy/provider-schemas

Generated JSON Schemas for AI SDK provider factory options.

```ts
import { providerOptionsSchema } from "@aio-proxy/provider-schemas";

const entry = providerOptionsSchema("@ai-sdk/openai");
```

Provider package names and factory functions live in the build-only `providers.json` catalog. It is the only Provider list maintained by hand.

To add a provider:

1. Add its package and factory names to `providers.json` in package-name order.
2. Run `bun run generate`.

Generation installs new Providers from npm at an exact version, removes deleted Providers, and synchronizes `package.json`, `bun.lock`, `.github/dependabot.yml`, and `src/schema-module.ts`. Existing versions are preserved and subsequently updated by Dependabot.

## Registry security

This repository only permits the public npm registry. Install dependencies with:

```sh
bun run install:public
bunx lefthook install
```

Lefthook checks the staged Git index before every commit. CI additionally scans the complete reachable commit history, so credentials or private registry URLs remain blocked even if a later commit removes them.
