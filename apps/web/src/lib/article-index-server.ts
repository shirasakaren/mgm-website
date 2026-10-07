import "server-only";

import { MEMBERS } from "@/data/members";
import { publishedArticles } from "@/lib/article-cms";
import type { ArticleIndexQuery } from "@/lib/article-index";
import {
  selectArticleIndex,
  toSearchRecord,
  type ArticleIndexResult,
  type ArticleSearchIndex,
} from "@/lib/article-index-select";
import { mergeMemberRecords } from "@/lib/member-cms";
import { ARTICLE_RECORDS, MEMBER_RECORDS } from "@/lib/static-content";

export type { ArticleIndexResult } from "@/lib/article-index-select";

function authors() {
  return mergeMemberRecords(MEMBERS, MEMBER_RECORDS).map(({ slug, name }) => ({ slug, name }));
}

/** The /articles index for a query, read at build time for the first batch. */
export async function readArticleIndex(
  query: ArticleIndexQuery,
  { offset = 0, limit }: { offset?: number; limit: number },
): Promise<ArticleIndexResult> {
  return selectArticleIndex(publishedArticles(ARTICLE_RECORDS), authors(), query, {
    offset,
    limit,
  });
}

/** Everything the browser needs to page and search the index on its own. */
export function articleSearchIndex(): ArticleSearchIndex {
  return { records: publishedArticles(ARTICLE_RECORDS).map(toSearchRecord), authors: authors() };
}
