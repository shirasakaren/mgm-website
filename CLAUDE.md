# MGM Laboratory Website

Monorepo for the **MGM Laboratory** homepage: a heavily animated, theme-aware Next.js site (`apps/web`) exported as a **fully static site** and deployed to **GitHub Pages** (`github.com/shirasakaren/mgm-website`, target domain `labmgm.org`). There is no API, database, or admin: every page is built from JSON content committed in the repo.

## If you're new here, read in this order

1. `DESIGN_SYSTEM.md` (repo root): brand philosophy, color tokens, typography, iconography. **The design source of truth.**
2. `docs/project-overview.md`: what the site is, all pages, content status.
3. `docs/static-site.md`: where the content lives, how to update it, media and base-path rules, the publication PDF switch, and the GitHub Pages deployment.
4. `docs/architecture.md`: monorepo layout, component/data map, routing.
5. `docs/animation-system.md`: GSAP setup, conventions, the homepage (hero play, magnets, reel and player, cursor flow), and the **gotchas that have already cost days** (read before touching any animation).
6. `docs/navigation-menu.md`: the full-screen nav menu system spec.
7. `docs/page-transition.md`: the full-screen navigation curtain played on every internal route change, and the related homepage-entrance-skip behavior.
8. `docs/projects-page.md`: the `/projects` index and the `/projects/[slug]` detail pages, the most animated pages.
9. `docs/articles-page.md`: the `/articles` library, a persistent WebGL world the list and every article live in.
10. `docs/testing-verification.md`: how work is verified here (Playwright + dev server + static build preview).

## ⚠️ Next.js 16: not the Next.js in your training data

This project runs **Next.js 16.3.4** (App Router, React 19.2.8, Tailwind v4) with `output: "export"`. APIs and conventions differ from older versions. `apps/web/AGENTS.md` (auto-managed by `next dev`, so don't edit it) points at the bundled guides: **before writing any Next-specific code, read the relevant guide in `apps/web/node_modules/next/dist/docs/`** (resolve from the file's directory, since in this monorepo `next` is not hoisted to the root). Static export rules apply: no request-time APIs (`cookies()`, `headers()`, `searchParams` in server pages), every dynamic route needs `generateStaticParams` with `dynamicParams = false`, route handlers must be `force-static` GET only.

## Hard rules (user-enforced, do not bend)

1. **Git identity & attribution.** Commit as whatever identity `git config user.name`/`user.email` resolves to in this working copy, and never impersonate another contributor. **Never mention Claude, ChatGPT, or any AI agent anywhere in a commit message, trailer, PR description, or code comment: no `Co-Authored-By`, no "generated with," nothing.**
2. **Granular commits and PR flow.** One discrete working change per commit; push it to a working branch, open a PR to `main`, and wait for the Pages workflow's build check to pass. Do **not** push directly to `main`, and **never merge a PR unless the user explicitly asks for it in that moment**: a merge to `main` deploys to production within minutes.
3. **Keep the dev server running** at `http://localhost:3000` while working (`pnpm dev:web`). Check it responds before and after changes (`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`).
4. **Verify before declaring done.** Interact with the result in a real browser (Playwright screenshots + interaction scripts; see `docs/testing-verification.md`), and check the static build (`pnpm build`, then `pnpm --filter web preview`) for anything touching data, routes or assets. Fixing a bug = reproducing it first, then re-testing the fix under the same conditions.
5. **Design discipline.** Use the `DESIGN_SYSTEM.md` tokens, not ad-hoc colors. Everything must be theme-aware (light/dark via `.dark` class) and reduced-motion safe (`prefers-reduced-motion`).
6. **Never let a static CSS class set `transform`/`translate-*`/`rotate-*`/`scale-*` on an element GSAP also animates**: GSAP stacks onto it instead of replacing it. This bug has shipped twice. See `docs/animation-system.md` §Gotchas.
7. **Every path to a file in `public/` goes through `withBasePath`** (`src/lib/base-path.ts`) unless it is a `next/link` href. A bare `"/logo.svg"` breaks the site whenever it is served under a sub-path. See `docs/static-site.md`.

## Commands

| Command                             | What it does                                                         |
| ----------------------------------- | -------------------------------------------------------------------- |
| `pnpm dev:web`                      | Next dev server on http://localhost:3000                             |
| `pnpm build`                        | Static export to `apps/web/out/` (plus the visible publication PDFs) |
| `pnpm --filter web preview`         | Serve `apps/web/out/` on http://localhost:3001                       |
| `pnpm lint`                         | ESLint                                                               |
| `pnpm typecheck`                    | `next typegen && tsc --noEmit`                                       |
| `pnpm format` / `pnpm format:check` | Prettier over the repo (also runs on staged files via husky)         |
| `gh run watch`                      | Follow a GitHub Actions run                                          |

Node **22** (`.nvmrc`), pnpm **11.3.0** (`packageManager`), Turbo 2.10.

## Repo map

```
apps/web/            Next.js 16 static site (the only workspace)
  src/app/           public pages, dynamic detail pages (static params), articles-index.json route
  src/content/       the site's content: articles, projects, members, publications, research, home
                     (JSON exported from the old CMS) + paper-visibility.json (PDF switch)
  src/components/    hero/ (interactions/ = desktop hero play, compact/ = the toy box under 880 px)
                     process/ (the fridge magnets) reel/ (the homepage reel, player/ = full-screen player)
                     cursor-distortion/ (site-wide cursor flow) home-extras/ (kinetic headings, finale,
                     3D mark) nav/ transition/ (page-transition curtain) sections/ members/ articles/
                     (world/ list/ detail/ transitions/) projects/ publications/ research/ about/
  src/data/          nav.ts (menu config), competencies.ts, process-magnets.ts, reel.ts, members.ts,
                     and other static page copy
  src/lib/           static-content.ts (reads src/content), base-path.ts (withBasePath, SITE_URL),
                     content-types.ts, *-cms*.ts (record helpers and URL helpers), article-index*.ts,
                     scroll-reveal.ts, motion/, project-themes.ts
  public/            logo.svg, patterns/, partners/, about/, media/ (all CMS media, by collection)
  papers/            publication PDFs (outside public/, copied into the build only when visible)
  scripts/           copy-papers.mjs (post-build PDF copy)
.github/workflows/   pages.yml (typecheck + build on PRs, build + deploy to Pages on main)
DESIGN_SYSTEM.md     brand/design source of truth
docs/                deep-dive documentation (read them)
```

## Pages (apps/web/src/app)

`/` (hero, process magnets, reel, featured projects, competencies, Trusted By, publications, articles, footer finale) · `/about` · `/member` + `/member/[slug]` · `/articles` + `/articles/[slug]` · `/media` · Focus: `/game` `/website` `/mobile` `/ux` · Our Work: `/projects` `/publications` `/research` (each with `[slug]` detail pages) · `/privacy-policy` · `/terms-of-services`. `/media`, `/privacy-policy`, and `/terms-of-services` are bare `PageBand` stubs. Contact, careers, events, forms, shortlinks and the admin were removed with the API. Full inventory: `docs/project-overview.md`.

## Deployment at a glance

- `.github/workflows/pages.yml`: every push to `main` installs, typechecks, builds the static export and deploys it to GitHub Pages; pull requests run the same typecheck and build without deploying.
- The build reads `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` from `actions/configure-pages`: empty base path on the custom domain (`labmgm.org`), `/mgm-website` on `shirasakaren.github.io/mgm-website` before the domain is attached. Domain and DNS setup: `docs/static-site.md`.
