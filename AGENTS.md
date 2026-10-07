# AGENTS.md: entry point for AI agents working in this repo

This is the **MGM Laboratory** website monorepo: a Next.js 16 site exported as a fully static site and deployed to GitHub Pages from `github.com/shirasakaren/mgm-website` (target domain `labmgm.org`). There is no API, database or admin; the content is JSON in `apps/web/src/content/`.

**Read `CLAUDE.md` (repo root) first.** It contains the hard rules every agent must follow (git identity, commit granularity, no AI attribution anywhere, verification workflow, base-path rule) and the reading order. The deep-dive documentation lives in `docs/`:

- `docs/project-overview.md`: product context, all pages, content status
- `docs/static-site.md`: content files, media, base path, the publication PDF switch, GitHub Pages deployment and custom domain
- `docs/architecture.md`: monorepo layout, components, data, routing
- `docs/animation-system.md`: GSAP conventions and known gotchas (read before touching animations)
- `docs/navigation-menu.md`: the full-screen menu system
- `docs/page-transition.md`: internal-navigation curtain and homepage entrance behavior
- `docs/projects-page.md`: the projects index and detail pages
- `docs/articles-page.md`: the articles library world
- `docs/testing-verification.md`: Playwright verification methodology

Design decisions must follow `DESIGN_SYSTEM.md` (repo root).
