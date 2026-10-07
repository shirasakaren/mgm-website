import type { Metadata } from "next";

import { ArticlesIndex } from "@/components/articles/list/articles-index";
import { ARTICLE_BATCH_SIZE } from "@/lib/article-index";
import { readArticleIndex } from "@/lib/article-index-server";

export const metadata: Metadata = {
  title: "Articles | MGM Laboratory",
  description: "Writing from MGM Laboratory on research, design, and engineering.",
};

export default async function ArticlesPage() {
  // The page is built once, unfiltered: a `?category=` or `?q=` in the URL
  // is read in the browser, which then asks the static index for its list.
  const query = {};
  const result = await readArticleIndex(query, { limit: ARTICLE_BATCH_SIZE });

  return (
    <>
      {/* Without JavaScript the world never runs: show the DOM cards as they are. */}
      <noscript>
        <style>{`.article-card-cover,.article-card-meta,.article-card-meta>*{opacity:1!important}[data-entrance] :is([data-title-char],[data-entrance-piece]){visibility:visible!important}.articles-top{display:none}`}</style>
      </noscript>
      <ArticlesIndex
        initial={{
          items: result.items,
          total: result.total,
          nextOffset: result.nextOffset,
          categories: result.categories,
          all: result.all,
        }}
        initialQuery={query}
      />
    </>
  );
}
