# @aio-proxy/provider-schemas

Generated JSON Schemas for AI SDK provider factory options.

```ts
import { providerOptionsSchema } from "@aio-proxy/provider-schemas";

const entry = providerOptionsSchema("@ai-sdk/openai");
```

Provider packages are exact-version development dependencies. Their package names and factory functions live in the build-only `providers.json` catalog. `bun run check:catalog` verifies that the catalog, `devDependencies`, and Dependabot provider rules agree.

To add a provider:

1. Add it to `devDependencies` with an exact version.
2. Add its package and factory names to `providers.json` in package-name order.
3. Run `bun run check:catalog` and `bun run generate`.

Dependabot updates provider versions in `package.json` and `bun.lock`; the snapshot workflow regenerates `src/schema-module.ts`. The catalog contains no versions, so there is no reverse synchronization step.

## Registry security

This repository only permits the public npm registry. Install dependencies with:

```sh
bun run install:public
bunx lefthook install
```

Lefthook checks the staged Git index before every commit. CI additionally scans the complete reachable commit history, so credentials or private registry URLs remain blocked even if a later commit removes them.
