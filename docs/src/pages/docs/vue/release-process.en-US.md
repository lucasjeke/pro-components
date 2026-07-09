---
title: Commit and Release
---

This document describes the commit, versioning, build verification, npm publish, and docs deployment workflow for ProComponents.

## Branches

- `main` is the release branch. After code is merged into `main`, GitHub Actions builds and deploys the docs site.
- Feature work and fixes should be completed on a separate branch before merging into `main`.
- Before releasing, make sure the working tree contains only release-related changes.

## Development Commits

### Install and develop

```bash
pnpm install
pnpm dev
```

### Commit message

Commit messages are checked by `scripts/verify-commit.js`.

```bash
<type>(<scope>): <subject>
```

Common examples:

```bash
feat(layout): add left layout
fix(form): correct readonly field style
docs(changelog): update release notes
ci: update docs deploy workflow
chore(release): version packages
```

Allowed `type` values:

```text
build, chore, ci, deps, docs, feat, fix, perf, refactor, release, revert, style, test, types
```

Common `scope` values:

```text
card, components, field, form, layout, listy, provider, route-utils, table, utils, docs, scripts, changelog, release, ci
```

Local commits run:

- `pre-commit`: `pnpm exec lint-staged`
- `commit-msg`: `node scripts/verify-commit.js`

## Changesets

Add a changeset for user-facing package changes:

```bash
pnpm changeset
```

Select affected packages and version bump type:

- `patch`: bugfixes and compatible fixes
- `minor`: compatible new features
- `major`: breaking changes

Docs-only, script-only, and internal maintenance changes do not need a changeset unless they should trigger a package release.

## Pre-release Verification

Recommended checks before publishing:

```bash
pnpm test
pnpm test:scripts
pnpm build
```

For package-scoped changes, run the package-level tests or build first, then run the full `pnpm build` before publishing.

## Version and Changelog

After changesets are ready, run:

```bash
pnpm bump
```

This command runs:

```bash
pnpm changeset version && pnpm docs:changelog
```

It updates:

- package versions
- package `CHANGELOG.md` files
- internal workspace dependency versions
- docs changelog pages

Commit the generated version changes:

```bash
git add .
git commit -m "chore(release): version packages"
```

## npm Publish

Before publishing, make sure npm auth is available and the current branch is the latest `main`:

```bash
npm whoami
git status
```

Publish packages:

```bash
pnpm ci:publish
```

This runs recursive workspace publishing:

```bash
pnpm publish -r --access=public
```

## Docs Deployment

The docs site is deployed by GitHub Actions.

After code is pushed to `main`, `.github/workflows/deploy.yml` runs:

```bash
pnpm install --frozen-lockfile
pnpm build
```

The generated `docs/dist` directory is deployed to GitHub Pages.

## Recommended Release Order

```bash
git checkout main
git pull
pnpm install
pnpm test
pnpm test:scripts
pnpm build
pnpm bump
pnpm test:scripts
pnpm build
git add .
git commit -m "chore(release): version packages"
git push
pnpm ci:publish
```

If publishing must happen after a Git tag or GitHub Release, create and push the release tag first, then run `pnpm ci:publish`.
