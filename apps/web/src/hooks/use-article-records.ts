"use client";

import { useMemo } from "react";

import { publishedArticles, type CmsArticleRecord } from "@/lib/article-cms";

/**
 * The published articles the page was built with. The site is static, so
 * the records never change after the build and nothing is refetched.
 */
export function useArticleRecords(initialRecords: readonly CmsArticleRecord[] = []) {
  const articles = useMemo(() => publishedArticles(initialRecords), [initialRecords]);
  return { articles, ready: true, records: initialRecords as CmsArticleRecord[] };
}
