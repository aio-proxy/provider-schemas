# Provider Catalog Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `providers.json` the only manually maintained Provider membership list and make `bun run generate` synchronize `package.json`, `bun.lock`, and `.github/dependabot.yml` before generating schemas.

**Architecture:** Keep catalog parsing pure, derive a deterministic Dependabot document from it, and run Bun package-manager mutations directly. Normal generation applies add/remove operations; `--check` performs only comparisons and never invokes Bun or the network.

**Tech Stack:** Bun 1.3.14, TypeScript 6, Bun test, YAML through `Bun.YAML`.

## Global Constraints

- `providers.json` contains only `packageName` and `factoryName`; it stores no versions.
- Existing exact Provider versions are preserved, including Dependabot updates.
- Missing Providers are installed from `<package>@latest` with exact versions from the public npm registry.
- Removed Providers are removed from `package.json`, `bun.lock`, and `node_modules`.
- Check mode is offline and read-only.
- Non-Provider development dependencies are never modified.
- Use Bun file/process APIs where they are the direct native equivalent.
- Every commit appends `Co-authored-by: Codex <noreply@openai.com>` as a message footer.

---

### Task 1: Replace cross-file validation with pure catalog projections

**Files:**
- Modify: `scripts/provider-catalog.ts`
- Replace tests: `tests/provider-catalog.test.ts`

**Interfaces:**
- Produces: `readProviderSchemaCatalog(rootPath: string): Promise<readonly ProviderSchemaSource[]>`
- Produces: `renderDependabot(catalog: readonly ProviderSchemaSource[]): string`
- Produces: `readManagedProviderNames(dependabotText: string): readonly string[]`
- Produces: `planProviderDependencyChanges(catalogNames, previousNames, devDependencies): { add: string[]; remove: string[] }`

- [ ] **Step 1: Rewrite tests around deterministic projections**

```ts
test("renders one exact allow list and one wildcard group", () => {
  const source = renderDependabot([
    { packageName: "@ai-sdk/anthropic", factoryName: "createAnthropic" },
    { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
  ]);
  expect(source).toContain('dependency-name: "@ai-sdk/anthropic"');
  expect(source).toContain('dependency-name: "@ai-sdk/openai"');
  expect(source.match(/patterns:/g)).toHaveLength(1);
  expect(source).toContain('          - "*"');
  expect(readManagedProviderNames(source)).toEqual(["@ai-sdk/anthropic", "@ai-sdk/openai"]);
});

test("plans additions and removals without touching tool dependencies", () => {
  expect(
    planProviderDependencyChanges(
      ["@ai-sdk/openai", "@ai-sdk/xai"],
      ["@ai-sdk/anthropic", "@ai-sdk/openai"],
      { "@ai-sdk/openai": "4.0.11", typescript: "6.0.3" },
    ),
  ).toEqual({ add: ["@ai-sdk/xai"], remove: ["@ai-sdk/anthropic"] });
});
```

- [ ] **Step 2: Run the focused tests and confirm the new exports are missing**

Run: `bun test tests/provider-catalog.test.ts`

Expected: FAIL because `renderDependabot`, `readManagedProviderNames`, and `planProviderDependencyChanges` do not exist.

- [ ] **Step 3: Implement the pure catalog functions**

```ts
export const renderDependabot = (catalog: readonly ProviderSchemaSource[]) =>
  Bun.YAML.stringify(
    {
      version: 2,
      updates: [{
        "package-ecosystem": "npm",
        directory: "/",
        schedule: { interval: "daily", time: "09:00", timezone: "Asia/Shanghai" },
        allow: catalog.map(({ packageName }) => ({ "dependency-name": packageName })),
        groups: { "provider-sources": { patterns: ["*"] } },
        "open-pull-requests-limit": 1,
        "commit-message": { prefix: "fix", include: "scope" },
      }],
    },
    null,
    2,
  ).replaceAll(": \n", ":\n");

export const readManagedProviderNames = (text: string) => {
  const yaml = Bun.YAML.parse(text) as { updates?: Array<{ allow?: Array<{ "dependency-name"?: unknown }> }> };
  return (yaml.updates?.find((item) => item)?.allow ?? [])
    .map((item) => item["dependency-name"])
    .filter((name): name is string => typeof name === "string" && !name.includes("*"))
    .sort();
};

export const planProviderDependencyChanges = (
  catalogNames: readonly string[],
  previousNames: readonly string[],
  devDependencies: Readonly<Record<string, string>>,
) => ({
  add: catalogNames.filter((name) => devDependencies[name] === undefined),
  remove: previousNames.filter((name) => !catalogNames.includes(name)),
});
```

Keep the existing shape, duplicate, package-name, factory-name, and ordering validation. Delete wildcard regex construction and the old three-file validation loop.

- [ ] **Step 4: Run the focused tests**

Run: `bun test tests/provider-catalog.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the pure projection change**

```bash
git add scripts/provider-catalog.ts tests/provider-catalog.test.ts
git commit -m "refactor: derive provider configuration from catalog"
```

### Task 2: Add package and Dependabot synchronization

**Files:**
- Create: `scripts/provider-sync.ts`
- Create: `tests/provider-sync.test.ts`

**Interfaces:**
- Consumes: catalog projection functions from Task 1.
- Produces: `synchronizeProviderConfiguration(rootPath, check?): Promise<void>`

- [ ] **Step 1: Write synchronization tests against temporary repositories**

```ts
test("writes stale Dependabot configuration", async () => {
  await expect(synchronizeProviderConfiguration(rootPath)).resolves.toBeUndefined();
});

test("check mode is read-only and reports drift", async () => {
  await expect(synchronizeProviderConfiguration(rootPath, true)).rejects.toThrow(
    "Provider configuration is out of date; run `bun run generate`",
  );
});
```

Use the pure dependency planner to test add/remove decisions. Add a no-op fixture proving an existing exact Provider version is preserved.

- [ ] **Step 2: Run the new test and confirm failure**

Run: `bun test tests/provider-sync.test.ts`

Expected: FAIL because `scripts/provider-sync.ts` does not exist.

- [ ] **Step 3: Implement the minimal synchronizer**

Read files with `Bun.file()`, call `bun remove <name>` once per sorted removal, call `bun add --dev --exact --only-missing --registry=https://registry.npmjs.org <name>@latest` once per sorted addition, and write Dependabot with `Bun.write()` only when content differs. In `check` mode, calculate all drift and throw before invoking Bun or writing.

- [ ] **Step 4: Run synchronization and catalog tests**

Run: `bun test tests/provider-sync.test.ts tests/provider-catalog.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit synchronization**

```bash
git add scripts/provider-sync.ts tests/provider-sync.test.ts
git commit -m "feat: synchronize provider dependency configuration"
```

### Task 3: Integrate synchronization into generation and CI

**Files:**
- Modify: `scripts/generate.ts`
- Modify: `tests/generate-command.test.ts`
- Modify: `package.json`
- Modify: `.github/workflows/dependabot-snapshot.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: `synchronizeProviderConfiguration()` from Task 2.
- Preserves: `synchronizeProviderSchemas()` for focused schema tests.
- Produces: CLI behavior where normal generation synchronizes first and `--check` checks all generated state.

- [ ] **Step 1: Extend the command test to assert ordering and check behavior**

```ts
test("the generation command synchronizes configuration before schemas", async () => {
  const calls: string[] = [];
  await runGeneration({
    rootPath,
    synchronizeConfiguration: async () => { calls.push("configuration"); },
    synchronizeSchemas: async () => { calls.push("schemas"); return { changed: false, count: 1 }; },
  });
  expect(calls).toEqual(["configuration", "schemas"]);
});
```

Test generation against a temporary repository instead of exposing orchestration seams.

- [ ] **Step 2: Run the focused command test and confirm failure**

Run: `bun test tests/generate-command.test.ts`

Expected: FAIL because `runGeneration` and configuration synchronization are absent.

- [ ] **Step 3: Integrate the pipeline**

```ts
export const runGeneration = async (rootPath: string, check = false) => {
  await synchronizeProviderConfiguration(rootPath, check);
  return synchronizeProviderSchemas(rootPath, check);
};
```

Remove the standalone `check:catalog` script from `package.json` and from `ci:installed`; its checks now belong to `generate --check`. Keep `check:generated` as the single generated-state check.

- [ ] **Step 4: Update the Dependabot workflow and README**

Allow the privileged workflow to commit `package.json`, `bun.lock`, `.github/dependabot.yml`, and `src/schema-module.ts`, but retain the initial guard that rejects any other incoming PR file. Change the commit step to add exactly those generated paths. Document: edit only `providers.json`, then run `bun run generate`.

- [ ] **Step 5: Regenerate and run the full verification for this phase**

Run:

```bash
bun run generate
bun test tests/provider-catalog.test.ts tests/provider-sync.test.ts tests/generate-command.test.ts
bun run check:generated
bun run typecheck
git diff --check
```

Expected: all commands exit 0; Dependabot uses exact allow entries and one wildcard group; a second `bun run generate` creates no diff.

- [ ] **Step 6: Commit phase 1**

```bash
git add providers.json package.json bun.lock .github/dependabot.yml .github/workflows/dependabot-snapshot.yml README.md scripts tests src/schema-module.ts
git commit -m "feat: generate provider dependency configuration"
```
