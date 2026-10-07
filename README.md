# MGM Laboratory

## Important

This project is no longer supported by the lab and the server will be taken down. Thanks for anyone who contributed to this project and help to achieve it. This sites will be the creator's portfolio and if you wanted to see it, you can visit https://mgm.creations.ren.

Anything that's in this website are not supported by the lab anymore, so any use of elements or things from this repo are forbidden. Creators and maintainer are not liable for any fraud or wrongdoings caused by this project in the future.

---

The MGM Laboratory site: a Next.js app (`apps/web`) exported as a fully static site and deployed to GitHub Pages. The content (articles, projects, members, publications, research and media) was exported from the old CMS and lives in the repo.

[![Deploy to GitHub Pages](https://github.com/shirasakaren/mgm-website/actions/workflows/pages.yml/badge.svg)](https://github.com/shirasakaren/mgm-website/actions/workflows/pages.yml)

<img width="1454" src=".github/screenshots/1.png" />
<img width="1454" src=".github/screenshots/2.png" />
<img width="1454" src=".github/screenshots/3.png" />
<img width="1454" src=".github/screenshots/4.png" />
<img width="1454" src=".github/screenshots/5.png" />
<img width="1454" src=".github/screenshots/6.png" />
<img width="1454" src=".github/screenshots/7.png" />
<img width="1454" src=".github/screenshots/8.png" />
<img width="1454" src=".github/screenshots/9.png" />
<img width="1454" src=".github/screenshots/10.png" />
<img width="1454" src=".github/screenshots/11.png" />

## Docs

Start with [`CLAUDE.md`](CLAUDE.md): it is the maintained handoff memory and reading order for contributors and coding agents. The principal references are [`docs/static-site.md`](docs/static-site.md) (content, media, the publication PDF switch, deployment), [`docs/project-overview.md`](docs/project-overview.md) and [`docs/architecture.md`](docs/architecture.md). Design, animation and verification guides live in [`docs/`](docs/).

## Local development

Requires Node 22 and pnpm 11.3.0.

```bash
pnpm install
pnpm dev:web                # http://localhost:3000
pnpm build                  # static export to apps/web/out
pnpm --filter web preview   # serve apps/web/out on http://localhost:3001
```

Run `pnpm lint`, `pnpm typecheck` and `pnpm format:check` before opening a PR. To change content, edit the JSON in `apps/web/src/content/` (media in `apps/web/public/media/`); see [`docs/static-site.md`](docs/static-site.md).

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/pages.yml`); pull requests build it without deploying. The custom domain and DNS setup are described in [`docs/static-site.md`](docs/static-site.md).

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the PR workflow and local setup. Security issues go to [`SECURITY.md`](SECURITY.md) instead of a public issue.
