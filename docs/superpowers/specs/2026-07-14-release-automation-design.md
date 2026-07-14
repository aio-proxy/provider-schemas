# Release automation design

## Goals

- Remove the GitHub Actions Node 20 deprecation warning.
- Track every publishable change with Changesets.
- Add a patch changeset automatically to every Dependabot pull request.
- Publish `@aio-proxy/provider-schemas` without a long-lived npm token.

## CI

Upgrade `actions/checkout` from `v4` to `v6` in both workflows. The referenced CI run succeeded; this change addresses its checkout deprecation warning rather than a test failure.

## Changesets

Add `@changesets/cli`, a single-package Changesets configuration, and scripts for versioning and publishing. Human-authored pull requests choose their own semver bump. The existing trusted Dependabot snapshot workflow also writes a deterministic patch changeset for `@aio-proxy/provider-schemas`, so reruns update the same file instead of creating duplicates.

## Release workflow

On every push to `main`, `changesets/action@v2` either creates or updates the release pull request, or publishes after that pull request is merged. The workflow installs with Bun, uses Node 24/npm through `actions/setup-node@v6`, runs the existing CI checks, publishes with npm provenance, creates Git tags, and creates GitHub Releases.

The job receives only `contents: write`, `pull-requests: write`, and `id-token: write`. npm authentication uses Trusted Publishing; no `NPM_TOKEN` is stored.

## Initial publication

The package does not exist on npm yet. Publish `0.1.0` manually once, then bind npm Trusted Publishing to repository `aio-proxy/provider-schemas` and workflow `.github/workflows/release.yml`. Subsequent releases are fully automated.

## Verification

- Run the full local CI command.
- Validate all workflow YAML with Bun's YAML parser.
- Verify Changesets can read the repository and produce the expected release status.
- Verify the Dependabot workflow generates one valid patch changeset deterministically.

