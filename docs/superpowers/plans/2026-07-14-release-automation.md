# Release Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Changesets-based npm release automation with OIDC trusted publishing, automatic Dependabot patch changesets, and remove the current checkout deprecation warning.

**Architecture:** Changesets owns version calculation and the release pull request. The existing trusted Dependabot workflow creates one deterministic patch changeset per PR. A main-branch workflow runs Changesets Action, which either updates the release PR or publishes through npm Trusted Publishing.

**Tech Stack:** Bun 1.3.14, Node.js 24, npm, Changesets 2.31.0, GitHub Actions, npm OIDC Trusted Publishing

## Global Constraints

- Do not store an `NPM_TOKEN`.
- Dependabot updates always create a patch changeset.
- Bind npm Trusted Publishing to `.github/workflows/release.yml`.
- Keep the existing Bun install and CI commands.
- The initial `0.1.0` publish remains a one-time manual bootstrap.

---

### Task 1: Add Changesets configuration

**Files:**
- Create: `.changeset/config.json`
- Create: `.changeset/README.md`
- Create: `.changeset/automate-releases.md`
- Modify: `package.json`
- Modify: `bun.lock`

**Interfaces:**
- Produces: `bun run version` runs `changeset version`; `bun run release` runs `changeset publish`.
- Produces: Changesets package identity `@aio-proxy/provider-schemas` with public access and `main` as the base branch.

- [ ] **Step 1: Install the exact Changesets CLI version**

Run: `bun add --dev --exact @changesets/cli@2.31.0`

Expected: `package.json` and `bun.lock` add `@changesets/cli` without changing unrelated dependencies.

- [ ] **Step 2: Add package scripts**

Add to `package.json` scripts:

```json
"release": "changeset publish",
"version": "changeset version"
```

- [ ] **Step 3: Add the single-package configuration**

Create `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.4/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

Create `.changeset/README.md` with a short note that human PRs add a patch, minor, or major changeset while Dependabot changesets are generated automatically.

Create `.changeset/automate-releases.md` for this pull request:

```markdown
---
"@aio-proxy/provider-schemas": patch
---

Automate versioning and npm releases with Changesets.
```

- [ ] **Step 4: Verify Changesets reads the repository**

Run: `bunx changeset status`

Expected: command succeeds and reports a patch release for `@aio-proxy/provider-schemas`.

- [ ] **Step 5: Commit**

```bash
git add .changeset package.json bun.lock
git commit -m "build: configure changesets"
```

### Task 2: Generate Dependabot patch changesets

**Files:**
- Modify: `.github/workflows/dependabot-snapshot.yml`

**Interfaces:**
- Consumes: pull request number from `github.event.pull_request.number`.
- Produces: `.changeset/dependabot-<PR_NUMBER>.md` containing one patch release for `@aio-proxy/provider-schemas`.

- [ ] **Step 1: Allow only the deterministic generated changeset**

Extend the privileged file allow-list expression to accept:

```text
.changeset/dependabot-[0-9]+.md
```

The complete `grep -Ev` expression must continue rejecting all other files.

- [ ] **Step 2: Generate one patch changeset after schema generation**

Add a workflow step with `PR_NUMBER` from the event and this command:

```bash
printf '%s\n' '---' '"@aio-proxy/provider-schemas": patch' '---' '' 'Bump provider dependencies.' > ".changeset/dependabot-${PR_NUMBER}.md"
```

- [ ] **Step 3: Include the changeset in the existing bot commit**

Add `.changeset/dependabot-*.md` to both the `git diff --quiet` path list and `git add` path list. Upgrade this workflow's checkout action to `actions/checkout@v6`.

- [ ] **Step 4: Validate the workflow and generated changeset**

Run:

```bash
bun -e 'const workflow = Bun.YAML.parse(await Bun.file(".github/workflows/dependabot-snapshot.yml").text()); if (!workflow.jobs?.regenerate) throw new Error("missing regenerate job")'
```

Run `bunx changeset status` against the repository's real `.changeset/automate-releases.md` as the parser check; the Dependabot step uses the same frontmatter and package name.

Expected: YAML parses and Changesets recognizes the same patch release shape emitted by the workflow.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/dependabot-snapshot.yml
git commit -m "ci: add changesets to dependabot updates"
```

### Task 3: Add OIDC release workflow and finish CI update

**Files:**
- Create: `.github/workflows/release.yml`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: pushes to `main`, Changesets files, and npm's trusted-publisher binding for `.github/workflows/release.yml`.
- Produces: a release PR while changesets are pending; otherwise publishes, tags, and creates a GitHub Release.

- [ ] **Step 1: Upgrade CI checkout**

Change `.github/workflows/ci.yml` to `actions/checkout@v6`.

- [ ] **Step 2: Add the release workflow**

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

permissions:
  contents: write
  pull-requests: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.3.14"

      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          registry-url: https://registry.npmjs.org
          package-manager-cache: false

      - run: bun scripts/bun-lock-check.ts
      - run: bun install --frozen-lockfile --ignore-scripts --registry=https://registry.npmjs.org

      - name: Create release pull request or publish
        uses: changesets/action@v1
        with:
          publish: bun run release
          github-token: ${{ secrets.GITHUB_TOKEN }}
          createGithubReleases: true
```

- [ ] **Step 3: Validate both workflows**

Run:

```bash
bun -e 'for (const path of [".github/workflows/ci.yml", ".github/workflows/dependabot-snapshot.yml", ".github/workflows/release.yml"]) { const workflow = Bun.YAML.parse(await Bun.file(path).text()); if (!workflow.jobs) throw new Error(`missing jobs: ${path}`); }'
```

Expected: exit code 0.

- [ ] **Step 4: Run full verification**

Run: `bun run ci`

Expected: formatting, generation consistency, type checking, 24 unit tests, build, package test, and registry policy all pass.

Run: `npm pack --dry-run`

Expected: the package tarball contains only the intended public package files.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/release.yml
git commit -m "ci: automate npm releases"
```

### Task 4: Document the one-time npm bootstrap

**Files:**
- Modify: `README.md`

**Interfaces:**
- Produces: exact operator steps for the initial manual publish and trusted-publisher binding.

- [ ] **Step 1: Add release bootstrap instructions**

Document these commands:

```bash
npm publish --access public
npm trust github @aio-proxy/provider-schemas --file .github/workflows/release.yml --repo aio-proxy/provider-schemas --allow-publish --yes
```

State that the first command is run once with an authenticated npm account and later releases are handled by Changesets Action through OIDC.

- [ ] **Step 2: Verify documentation and repository state**

Run: `git diff --check`

Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: explain release bootstrap"
```
