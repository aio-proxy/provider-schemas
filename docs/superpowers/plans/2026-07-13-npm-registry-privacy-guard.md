# npm Registry Privacy Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Block private npm source configuration and npm credentials before every commit, across all reachable Git history, before CI installs, and before publication.

**Architecture:** A dependency-free Bun scanner evaluates file names, package metadata, and credential/registry patterns without logging matched values. Lefthook runs the staged-index mode locally; CI and the Dependabot workflow run full-history mode with complete Git history before dependency installation.

**Tech Stack:** Bun 1.3.14, TypeScript, Bun test, Git, Lefthook 2.1.9, GitHub Actions.

## Global Constraints

- Only `registry.npmjs.org` is allowed as an npm registry.
- Security findings report code, file, and commit only; never matched contents.
- The scanner must run without installed npm dependencies.
- CI scans before package installation and fetches complete history.
- No git commit is created during this execution.

---

### Task 1: Pure npm Security Policy

**Files:**
- Create: `scripts/check-npm-security.ts`
- Create: `tests/npm-security.test.ts`

**Interfaces:**
- Produces: `findNpmSecurityIssues(path: string, content: Uint8Array | string): readonly NpmSecurityIssue[]`.
- Produces issue codes for forbidden config, dependency source, private registry, npm credential, and credential URL.

- [ ] Write tests for safe public package metadata and generated schema URLs.
- [ ] Write tests for forbidden config names, non-exact dependency specifications, private registries, `_authToken`, npm tokens, and credential URLs.
- [ ] Run `bun test tests/npm-security.test.ts`; expect failure because the scanner module does not exist.
- [ ] Implement the smallest pure scanner that passes every case without returning matched text.
- [ ] Run the test again; expect all cases to pass.

### Task 2: Staged and Historical Git Scanning

**Files:**
- Modify: `scripts/check-npm-security.ts`
- Modify: `tests/npm-security.test.ts`

**Interfaces:**
- Produces: `scanStagedRepository(rootPath: string): Promise<readonly NpmSecurityIssue[]>`.
- Produces: `scanRepositoryHistory(rootPath: string): Promise<readonly NpmSecurityIssue[]>`.

- [ ] Add a temporary-repository test proving staged `.npmrc` content is rejected.
- [ ] Add a two-commit test proving a credential introduced in commit one and removed in commit two remains rejected by history mode.
- [ ] Run the focused tests and observe expected failures for missing Git scanning functions.
- [ ] Implement index reads with `git show :path`, working snapshot reads, and per-commit tree reads without printing file contents.
- [ ] Run the focused tests and expect pass.

### Task 3: Lefthook Commit Enforcement

**Files:**
- Create: `lefthook.yml`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- `pre-commit` invokes `bun scripts/check-npm-security.ts --staged`.
- `bun run check:security` invokes full-history mode.

- [ ] Add exact `lefthook` version `2.1.9` to development dependencies.
- [ ] Add `prepare`, `check:security`, and `ci:installed` scripts while keeping security before installed-tool checks.
- [ ] Document public-registry policy and explicit `bunx lefthook install` recovery command.
- [ ] Run `bun install --ignore-scripts`, then `bunx lefthook install`.
- [ ] Verify Lefthook created an executable `.git/hooks/pre-commit` hook.

### Task 4: CI and Dependabot Pre-install Enforcement

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/dependabot-snapshot.yml`

**Interfaces:**
- CI checks out `fetch-depth: 0` and runs the scanner before `bun install`.
- Dependabot privileged generation scans history before dependency installation.

- [ ] Configure full-history checkout for both workflows.
- [ ] Run `bun scripts/check-npm-security.ts --history` before every install command.
- [ ] Run `bun run ci:installed` after installation in CI.
- [ ] Parse workflow YAML locally and expect success.

### Task 5: Verification

**Files:**
- Inspect: all repository files and Git configuration.

**Interfaces:**
- The current uncommitted repository passes working/history scanning.
- A deliberately staged forbidden file is rejected before commit and then removed from the index.

- [ ] Run the scanner against the current no-commit working snapshot; expect zero findings.
- [ ] Stage a temporary `.npmrc` fixture, run Lefthook, expect failure without logging its value, then unstage and delete it.
- [ ] Run `bun install --frozen-lockfile --ignore-scripts`.
- [ ] Run `bun run ci`; expect all security and existing tests to pass.
- [ ] Run `npm pack --dry-run --json`; verify no registry configuration or security tooling is published.
- [ ] Run `git rev-list --all --count`; expect `0`.
