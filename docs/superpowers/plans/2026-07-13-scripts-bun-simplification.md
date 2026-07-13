# Scripts Bun Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the whole-`scripts/` simplification by using Bun-native file-content I/O and subprocess APIs, shortening the security scanner without weakening it, and enforcing a material production line-count reduction.

**Architecture:** Preserve the post-Zod module boundaries established by the earlier plans. Replace direct file-content reads/writes and subprocess boilerplate with Bun primitives, retain Node path/realpath/temp APIs where Bun has no simpler equivalent, and use existing security tests as immutable behavior contracts.

**Tech Stack:** Bun 1.3.14, TypeScript 6, Bun test, Git CLI.

## Global Constraints

- Complete the catalog sync and Zod generation plans first.
- Preserve staged-index, working-tree, and reachable-history security scans.
- Preserve credential redaction, public-registry enforcement, and exact installed dependency versions.
- Peer dependency ranges are allowed only because peers are compatibility contracts, not installed resolution state.
- Do not add a utility module unless at least two surviving production modules need the same non-trivial behavior.
- `node:path`, temporary-directory APIs, and `realpath` may remain.
- Every commit appends `Co-authored-by: Codex <noreply@openai.com>` as a message footer.

---

### Task 1: Lock the security scanner behavior before refactoring

**Files:**
- Modify: `tests/npm-security.test.ts`

**Interfaces:**
- Consumes: `findNpmSecurityIssues`, `scanStagedRepository`, and `scanRepositoryHistory`.
- Produces: regression coverage for optional peer ranges and sanitized subprocess failures.

- [ ] **Step 1: Add the missing behavior tests**

```ts
test("allows peer compatibility ranges but rejects installed dependency ranges", () => {
  expect(codes("package.json", JSON.stringify({ peerDependencies: { zod: "^4.1.5" } }))).toEqual([]);
  expect(codes("package.json", JSON.stringify({ devDependencies: { zod: "^4.1.5" } }))).toContain(
    "non_exact_dependency",
  );
});

test("never includes credential values in reported issues", () => {
  const secret = `npm_${"x".repeat(36)}`;
  expect(JSON.stringify(findNpmSecurityIssues("notes.txt", `_authToken=${secret}`))).not.toContain(secret);
});
```

- [ ] **Step 2: Run the tests**

Run: `bun test tests/npm-security.test.ts`

Expected: the peer-range test fails until the scanner distinguishes installed and peer dependency sections; all existing security tests still pass.

- [ ] **Step 3: Make the smallest policy correction**

```ts
const installedDependencySections = ["dependencies", "devDependencies", "optionalDependencies"] as const;
```

Apply exact-version checking only to those sections. Do not add a generic dependency-policy framework.

- [ ] **Step 4: Run and commit**

Run: `bun test tests/npm-security.test.ts`

Expected: PASS.

```bash
git add scripts/check-npm-security.ts tests/npm-security.test.ts
git commit -m "test: preserve npm security policy during simplification"
```

### Task 2: Replace file-content I/O and subprocess boilerplate with Bun APIs

**Files:**
- Modify: every surviving file under `scripts/`
- Modify: directly affected tests under `tests/`

**Interfaces:**
- Preserves every exported function signature from the first two plans.

- [ ] **Step 1: Inventory only replaceable Node APIs**

Run: `rg -n 'node:fs|readFile|writeFile|existsSync|execFile|spawn' scripts tests`

Expected: a finite list of file-content reads/writes and process calls. Do not include `node:path`, `node:os`, temp-directory creation, directory traversal, or `realpath` in the replacement target unless the Bun version is shorter and equally clear.

- [ ] **Step 2: Replace production file-content reads**

Use:

```ts
const text = await Bun.file(path).text();
const json: unknown = await Bun.file(path).json();
const exists = await Bun.file(path).exists();
await Bun.write(path, content);
```

Remove corresponding `node:fs/promises` imports. Keep binary Git object reads as `Uint8Array` from `Bun.spawnSync`.

- [ ] **Step 3: Centralize no more than one subprocess helper per file**

```ts
const run = (command: readonly string[], cwd: string) => {
  const result = Bun.spawnSync(command, { cwd, stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) throw new Error(`${command[0]} failed: ${result.stderr.toString().trim()}`);
  return result.stdout;
};
```

Do not create a shared process abstraction. Keep async Bun installation commands async and Git snapshot reads synchronous if that yields less code.

- [ ] **Step 4: Use Bun writes in tests where no filesystem primitive is needed**

Replace `writeFile(path, value)` with `Bun.write(path, value)` and `readFile(path, "utf8")` with `Bun.file(path).text()`. Keep `mkdtemp`, `mkdir`, `rm`, `unlink`, and `realpath` from Node when they express the operation directly.

- [ ] **Step 5: Run all tests**

Run: `bun run test:unit && bun run typecheck`

Expected: PASS.

- [ ] **Step 6: Commit Bun-native I/O cleanup**

```bash
git add scripts tests
git commit -m "refactor: use bun native script io"
```

### Task 3: Collapse redundant security scanning helpers

**Files:**
- Modify: `scripts/check-npm-security.ts`
- Modify: `tests/npm-security.test.ts`

**Interfaces:**
- Preserves: `findNpmSecurityIssues`, `scanStagedRepository`, `scanRepositoryHistory`.

- [ ] **Step 1: Record the current production line count**

Run: `wc -l scripts/*.ts`

Expected: save the total in the task notes; do not commit a generated metric file.

- [ ] **Step 2: Remove helper layers that have one caller**

Inline `decode`, `nullSeparated`, and `withCommit` when doing so shortens the scanner. Keep `gitOutput` and `scanGitSnapshot` only if both staged and history scans still use them. Replace Promise `.then(groups => groups.flat())` with direct `await` when clearer.

Target shape:

```ts
const scan = async (paths: readonly string[], read: (path: string) => Uint8Array | Promise<Uint8Array>, commit?: string) =>
  (await Promise.all(paths.map(async (path) => findNpmSecurityIssues(path, await read(path))))).flatMap((issues) =>
    commit ? issues.map((issue) => ({ ...issue, commit })) : issues,
  );
```

- [ ] **Step 3: Run security tests after each deletion batch**

Run: `bun test tests/npm-security.test.ts`

Expected: PASS after every batch; stop and revert the specific deletion if a security behavior changes.

- [ ] **Step 4: Commit the scanner simplification**

```bash
git add scripts/check-npm-security.ts tests/npm-security.test.ts
git commit -m "refactor: simplify npm security scanning"
```

### Task 4: Verify whole-repository simplification and update documentation

**Files:**
- Modify: `README.md`
- Modify: relevant docs only if command names changed

**Interfaces:**
- Produces final documented maintenance workflow.

- [ ] **Step 1: Update README workflow**

Document exactly:

```text
1. Edit providers.json.
2. Run bun run generate.
3. Commit providers.json, package.json, bun.lock, .github/dependabot.yml, src/provider-types.generated.ts, src/schema-module.ts, and src/zod-module.ts when changed.
```

State that existing versions are preserved and new Providers resolve `latest` once before Dependabot takes over updates.

- [ ] **Step 2: Run the final verification suite**

Run:

```bash
bun run generate
bun run generate
git diff --check
bun run ci
bun pm pack --dry-run
rg -n '@babel/parser|typebox|declaration-parser|schema-normalizer' scripts src package.json
```

Expected: all commands exit 0; the second generation creates no new diff; the search returns no production references.

- [ ] **Step 3: Verify material code reduction**

Run:

```bash
wc -l scripts/*.ts
git diff oke144158 --stat -- scripts package.json
```

Expected: total production script lines are materially below the original 1172 lines and the custom 431-line declaration parser is gone. If production lines did not decrease substantially, remove remaining one-caller abstractions before completion; do not count deleted tests as production simplification.

- [ ] **Step 4: Commit final documentation and cleanup**

```bash
git add README.md docs scripts tests package.json bun.lock src .github
git commit -m "docs: document generated provider workflow"
```
