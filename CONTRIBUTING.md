# Contributing to MGM Laboratory's website

Thanks for taking the time to contribute. This is a pnpm monorepo with one workspace: a Next.js site (`apps/web`) exported as a static site and deployed to GitHub Pages. Content lives as JSON in `apps/web/src/content/` (see `docs/static-site.md`). Read `docs/architecture.md` and `DESIGN_SYSTEM.md` before making UI changes.

## Workflow

There's no `dev` branch. Every change to `main` goes through a pull request:

1. Fork the repo (or branch directly if you're a collaborator).
2. Make your change, following the conventions in `docs/` (especially `docs/animation-system.md` if you're touching anything animated).
3. Open a PR against `main`. Keep PRs focused: one discrete change per PR is easier to review than a bundle of unrelated fixes.
4. The Pages workflow runs on every PR (see below) and must be green before a maintainer merges.
5. A maintainer merges the PR once the check is green; the merge to `main` deploys the site. See `GOVERNANCE.md` for how larger decisions get made.

## Checks

Every PR runs `.github/workflows/pages.yml`: install, `pnpm --filter web typecheck`, and the static build. Pushes to `main` run the same and then deploy to GitHub Pages.

Run the fast ones locally before pushing: `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, and `pnpm build` when you changed content, routes or asset paths.

## Local setup

```bash
pnpm install
pnpm dev:web                # http://localhost:3000
pnpm build                  # static export to apps/web/out
pnpm --filter web preview   # serve the export
```

See `docs/testing-verification.md` for how UI changes are expected to be verified (a real browser, not just green tests) before you consider something done.

## Commit messages

Plain prose describing what changed and why, no AI-attribution trailers of any kind, please. Use a hyphen or a colon instead of an em dash. Never use an em dash in a commit message or PR title/body.
