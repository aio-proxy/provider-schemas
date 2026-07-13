# npm Registry Privacy Guard Design

## Goal

Prevent private npm registry configuration and npm credentials from entering the repository, any local commit, pull-request history, CI installation, or the published package.

## Policy

This repository uses only the public npm registry.

- Tracked `.npmrc`, `.yarnrc`, `.yarnrc.yml`, and `bunfig.toml` files are forbidden.
- Dependency specifications in `package.json` must be exact public npm versions.
- `publishConfig.registry`, when present, must be `https://registry.npmjs.org/`.
- npm tokens, npm authentication assignments, and URLs containing credentials are forbidden in every file.
- Registry assignments and private-registry markers are forbidden unless they resolve to `registry.npmjs.org`.
- Generated schema URLs and JSON Schema metadata remain allowed because they are not package-manager registry configuration.

## Scanner

Create `scripts/check-npm-security.ts` using only Bun and Node built-ins. It returns findings containing a stable code, file path, and optional commit id. It never prints the matched line or suspected credential.

The scanner supports:

- `--staged`: inspect the exact Git index snapshot used by the next commit;
- `--history`: inspect the current working snapshot plus every reachable commit.

The working snapshot includes tracked and untracked non-ignored files so the repository can be checked before its first commit. Binary files and ignored build/dependency directories are skipped.

## Commit Enforcement

Lefthook owns the local pre-commit hook. `lefthook.yml` runs:

```sh
bun scripts/check-npm-security.ts --staged
```

`prepare` installs Lefthook for normal contributor installs. This local repository also runs `lefthook install` explicitly because its initial dependency installation used `--ignore-scripts`.

Git hooks are bypassable with `--no-verify`, so CI checks complete reachable history with `fetch-depth: 0`. A credential introduced and removed in a later commit still fails CI.

## CI and Dependabot

CI runs the dependency-free security scanner before `bun install`, preventing a malicious or private registry configuration from causing a network request. After the scan passes, dependencies install with `--frozen-lockfile --ignore-scripts`.

The privileged Dependabot snapshot workflow runs the same history scan before installing updated dependencies. Its existing changed-file allowlist remains an additional boundary.

## Testing

- Pure scanner tests cover forbidden config names, exact dependency versions, public and private registry assignments, npm tokens, auth assignments, credential URLs, and safe generated-schema URLs.
- Git integration tests create temporary repositories to verify staged scanning and detection of a secret in an earlier commit after its removal.
- Existing CI, generation, build, Node ESM, and package-boundary tests continue to pass.

## Non-goals

- Supporting a private registry allowlist.
- Printing or automatically redacting discovered secret values.
- Rewriting Git history automatically.
- Replacing GitHub secret scanning for unrelated credential formats.
- Creating a commit.
