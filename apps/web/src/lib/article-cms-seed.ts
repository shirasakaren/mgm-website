import "server-only";

import type { CmsArticleRecord } from "@/lib/article-cms";
import { ARTICLE_RECORDS } from "@/lib/static-content";

/** Every published article with its document. */
export async function ensureArticleCmsSeeded(): Promise<CmsArticleRecord[]> {
  return ARTICLE_RECORDS;
}

/** The light feed: every published article without its BlockNote document. */
export async function fetchArticleFeed(): Promise<CmsArticleRecord[]> {
  return ARTICLE_RECORDS.map((record) => ({ ...record, content: [] }));
}

export const ensureArticleFeed = fetchArticleFeed;

/** One published article with its document, or undefined when absent. */
export async function fetchArticleRecord(slug: string) {
  return ARTICLE_RECORDS.find((record) => record.slug === slug);
}
