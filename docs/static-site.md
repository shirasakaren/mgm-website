# Static Site: Content, Media and Deployment

The site is a fully static Next.js export (`output: "export"` in `apps/web/next.config.ts`). `next build` renders every page to `apps/web/out/`, and GitHub Pages serves that folder. Nothing runs on a server: there is no API, database, admin or form handling. The content that used to live in the CMS was exported from the production API once and committed to the repo.

## Content

| File                                         | What it holds                                                    |
| -------------------------------------------- | ---------------------------------------------------------------- |
| `apps/web/src/content/articles.json`         | Published articles with their BlockNote documents, newest first  |
| `apps/web/src/content/projects.json`         | Published projects (detail fields, media sections, `mediaSizes`) |
| `apps/web/src/content/members.json`          | Member records (directory card + profile)                        |
| `apps/web/src/content/publications.json`     | Publications (authors, bibliographic data, `paperKey`)           |
| `apps/web/src/content/research.json`         | Research initiatives                                             |
| `apps/web/src/content/home.json`             | The homepage reel video (`videoMode`, `videoKey`)                |
| `apps/web/src/content/paper-visibility.json` | Which publication PDFs are published (see below)                 |

The records keep the exact shape and order the old public API served (`{ slug, updatedAt, article | project | ..., content | body }`), so the existing components render them unchanged.

`src/lib/static-content.ts` imports the JSON (server-only). The helper modules the pages already used now read from it instead of fetching: `lib/article-cms-seed.ts`, `lib/project-cms-server.ts`, `lib/publication-cms-seed.ts`, `lib/research-cms-server.ts`, `lib/member-cms-seed.ts`, `lib/home-cms-server.ts`. The "feed" functions return the records with their documents emptied, like the API's light feed did. Everything runs at build time.

Members combine two sources, as before: the bundled roster in `src/data/members.ts` merged with `members.json` (`mergeMemberRecords`). A record whose `sourceSlug` differs from its `slug` was renamed: its old URL is still generated and redirects (a meta refresh) to the new one.

Shapes and presets that used to come from the shared workspace package (theme ids, project media items, the home record) live in `src/lib/content-types.ts`.

### Updating content

1. Edit the JSON in `apps/web/src/content/`. Keep each record's shape; a new record needs a unique `slug` and, for articles, projects, publications and research, `draft: false` in its inner object.
2. Put new media in `apps/web/public/media/<collection>/` and reference it by file name (the "key") in the record.
3. Check it locally (`pnpm dev:web`, then `pnpm build` and `pnpm --filter web preview`), commit, open a PR, and merge to `main` to deploy.

Dynamic routes are generated from the JSON (`generateStaticParams`, `dynamicParams = false`), so a new record gets its page on the next build and an unknown slug is a 404.

## Media

Media files are in `apps/web/public/media/`, one folder per collection, named by their original storage key:

| Folder                  | Used by                                                    | URL helper                                 |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------ |
| `media/articles/`       | Article covers and images inside article bodies            | `articleCoverUrl()` (`lib/article-cms.ts`) |
| `media/projects/`       | Project covers, image sections, video posters, body images | `projectMediaUrl()` (`lib/project-cms.ts`) |
| `media/projects-video/` | Project video sections                                     | `projectVideoUrl()` (`lib/project-cms.ts`) |
| `media/members/`        | Member portraits                                           | `memberPhotoUrl()` (`lib/member-cms.ts`)   |
| `media/home-video/`     | The homepage reel video                                    | `homeVideoUrl()` (`lib/home-cms.ts`)       |

`researchCoverUrl()` and `authorPhotoUrl()` point at `media/research/` and `media/publications/`; no current record uses them. Images inside BlockNote documents are stored as root paths (`/media/articles/<key>`) and resolved through `safeImageSrc()` (`components/articles/detail/story-model.ts`).

Images are not optimized at build time (`images.unoptimized: true`): they ship as they were uploaded.

## Base path

On its own domain the site is served from `/`. On a GitHub Pages project URL (`https://shirasakaren.github.io/mgm-website`) it is served from `/mgm-website`. The build reads `NEXT_PUBLIC_BASE_PATH` for that prefix, sets Next's `basePath` from it, and `src/lib/base-path.ts` exposes it:

- `next/link` hrefs and the router add the base path on their own: keep writing `href="/projects"`.
- **Everything else that names a file in `public/`** (an `<img>` or `next/image` `src`, a `<video>`, a texture loaded by XHR, a `fetch`) must go through `withBasePath("/...")`. A bare `"/logo.svg"` works locally and on the custom domain and breaks under a sub-path.
- `SITE_URL` (from `NEXT_PUBLIC_SITE_URL`, default `https://labmgm.org`) is the origin for absolute Open Graph URLs.

Known limitation of the sub-path preview: several transition controllers compare `window.location.pathname` with literal routes (`/projects/<slug>`, `/articles`). Under `/mgm-website` those comparisons miss, so some page-to-page animations fall back to the default curtain there. On the custom domain the base path is empty and everything behaves as in production.

## The articles index

`/articles` is built once, unfiltered, with its first batch of cards. Search (`?q=`), the category filter (`?category=`) and the infinite list run in the browser:

- `src/app/articles-index.json/route.ts` (a `force-static` route handler) writes `/articles-index.json` at build time: every published article with its body cut down to one text block plus its image captions, and the author names.
- `src/lib/article-index-select.ts` holds the selection (strict all-terms filter, ranking search, category filter, paging). The build uses it for the first batch (`lib/article-index-server.ts`) and the browser for every batch after it.
- `components/articles/list/index-request.ts` loads the index once per visit and answers each batch request locally.

Results match what the old API returned for the same queries.

## Publication PDFs

The papers are kept in the repo but **hidden by default**.

- The PDFs are in `apps/web/papers/<paperKey>`, outside `public/`, so they are never copied into the site on their own.
- `apps/web/src/content/paper-visibility.json` is the switch:

  ```json
  {
    "showAll": false,
    "visible": []
  }
  ```

  Set `"showAll": true` to publish every paper, or list publication slugs in `"visible"` to publish them one by one.

- `paperIsPublic()` (`lib/publication-cms.ts`) reads the switch: a visible paper gets the preview, the PDF viewer and the manuscript row on its publication page; a hidden one shows only its DOI and publisher links.
- `apps/web/scripts/copy-papers.mjs` runs after `next build` (`apps/web` `build` script) and copies only the visible PDFs into `out/papers/`. A hidden paper is never deployed.

To change it: edit the JSON, commit, and merge to `main`. The deploy picks it up. Note that the repository itself is public, so the PDFs in `papers/` can be downloaded from GitHub whatever the switch says.

## Deployment

`.github/workflows/pages.yml`:

- **Pull requests**: install, typecheck, build. Nothing is deployed.
- **Push to `main`** (and manual runs): the same, then the `out/` folder is uploaded with `actions/upload-pages-artifact` and published with `actions/deploy-pages` to the `github-pages` environment.
- `actions/configure-pages` provides `base_path` and `base_url`, passed to the build as `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL`. With a custom domain set, `base_path` is empty.

The repository's Pages source must be **GitHub Actions** (Settings → Pages → Build and deployment → Source).

### Custom domain (labmgm.org)

1. Settings → Pages → Custom domain: enter `labmgm.org` and save.
2. DNS at the domain's provider:
   - apex `labmgm.org`: `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and `AAAA` records `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`;
   - `www`: a `CNAME` to `shirasakaren.github.io`.
     Remove the old records that pointed at the previous host.
3. Once the DNS check passes, tick **Enforce HTTPS**.
4. Re-run the workflow (or push to `main`) so the site rebuilds with an empty base path.

## Building on Windows

On Windows, `next build` writes the router's per-segment prefetch files as nested folders (`about/__next.about/__PAGE__.txt`) instead of dotted names (`about/__next.about.__PAGE__.txt`): Next's export joins the segment path with the OS separator and only converts `/`. Pages work, but a local preview logs 404s for those prefetches and client navigation falls back to the full payload. The Linux build in GitHub Actions writes the correct names, so the deployed site is unaffected.
