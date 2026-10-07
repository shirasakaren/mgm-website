import type { ArticleBatch, ArticleIndexQuery } from "@/lib/article-index";
import { selectArticleIndex, type ArticleSearchIndex } from "@/lib/article-index-select";
import { withBasePath } from "@/lib/base-path";

let indexRequest: Promise<ArticleSearchIndex | null> | null = null;

/** The static search index, read once per visit (a failed read is retried next time). */
function loadIndex() {
  indexRequest ??= fetch(withBasePath("/articles-index.json"))
    .then((response) => (response.ok ? (response.json() as Promise<ArticleSearchIndex>) : null))
    .catch(() => null)
    .then((index) => {
      if (!index) indexRequest = null;
      return index;
    });
  return indexRequest;
}

/**
 * Reads one batch of the index for a query. The site is static, so the
 * filtering, the search and the paging all run here, over the index the
 * build wrote to `/articles-index.json`.
 */
export async function requestArticleBatch(
  query: ArticleIndexQuery,
  offset: number,
  limit: number,
  signal?: AbortSignal,
): Promise<ArticleBatch | null> {
  const index = await loadIndex();
  if (!index || signal?.aborted) return null;
  return selectArticleIndex(index.records, index.authors, query, { offset, limit });
}
