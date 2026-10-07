# Security Policy

## Supported scope

`shirasakaren/mgm-website` is the repository for the static MGM Laboratory site. The site has no server, API or database: it is static files served by GitHub Pages.

## Reporting a vulnerability

If you find a security issue, such as a script injection vector or anything that could compromise the published site, please **do not open a public issue**.

Instead, email **hi@labmgm.org** with:

- A description of the issue and its impact.
- Steps to reproduce (or a proof of concept).
- Any relevant logs, requests, or screenshots.

You can expect an initial response within a few business days. We'll keep you updated as the issue is triaged and fixed, and we're happy to credit reporters who want it once a fix has shipped.

## Scope notes

- The published site (`labmgm.org` on GitHub Pages) and the code in this repository are in scope. GitHub Pages' own infrastructure is not.
- Automated scanning that could degrade availability (load testing, aggressive fuzzing against the live site) is **not** authorized. Build the site locally (`pnpm build`) and test the export instead.
