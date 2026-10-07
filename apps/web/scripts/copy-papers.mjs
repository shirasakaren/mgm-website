// Copies the publication PDFs that are switched on in
// src/content/paper-visibility.json from papers/ into the static export
// (out/papers/). A hidden paper never reaches the deployed site.
import { copyFile, mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => JSON.parse(readFileSync(path.join(root, file), "utf8"));

const { showAll, visible } = read("src/content/paper-visibility.json");
const shown = new Set(visible);
const papers = read("src/content/publications.json")
  .map((record) => ({ slug: record.slug, key: record.publication.paperKey }))
  .filter(({ slug, key }) => key && (showAll || shown.has(slug)));

const outDir = path.join(root, "out", "papers");
await mkdir(outDir, { recursive: true });
for (const { key } of papers) {
  await copyFile(path.join(root, "papers", key), path.join(outDir, key));
}
console.log(`Copied ${papers.length} visible paper(s) into out/papers.`);
