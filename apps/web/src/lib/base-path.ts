/**
 * The path the site is served under: empty on its own domain, `/<repo>` on a
 * GitHub Pages project URL. Set at build time through NEXT_PUBLIC_BASE_PATH
 * (the Pages workflow fills it in), and mirrored in next.config.ts.
 *
 * `next/link` and the router add it on their own. Everything else that names
 * a file in `public/` (an <img>, a <video>, a texture, a fetch) goes through
 * `withBasePath`.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Prefixes a root-relative path with the base path; other URLs pass through. */
export function withBasePath(path: string): string;
export function withBasePath(path: string | undefined): string | undefined;
export function withBasePath(path: string | undefined) {
  if (!path || !BASE_PATH) return path;
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}

/**
 * The site's public origin, for absolute URLs (Open Graph images). The Pages
 * workflow sets NEXT_PUBLIC_SITE_URL to the address the site is served at.
 */
export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://labmgm.org").origin;
