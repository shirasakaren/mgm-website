import type { Member } from "@/data/members";
import type { CmsArticleRecord } from "@/lib/article-cms";
import {
  articleCategories,
  hasCategory,
  toArticleCard,
  type ArticleBatch,
  type ArticleCategory,
  type ArticleIndexQuery,
} from "@/lib/article-index";
import { bodyText, searchArticles, tokenize } from "@/lib/article-search";

/**
 * The /articles index selection, shared by the build (the page's first
 * batch) and the browser (every batch after it, and every search, read
 * from the static `/articles-index.json`).
 */

/** An author as the index needs one: enough to name and link them. */
export type ArticleIndexAuthor = Pick<Member, "slug" | "name">;

/**
 * Whether every term of the query appears somewhere in the article (title,
 * subtitle, categories, authors or body). The ranking search forgives typos
 * and partial words, which is right for ordering but far too loose for a
 * list that filters: "kit-build" alone matched 194 of 209 articles.
 */
function containsEveryTerm(
  record: CmsArticleRecord,
  terms: readonly string[],
  authors: readonly ArticleIndexAuthor[],
) {
  const { article } = record;
  const names = article.authorSlugs
    .map((slug) => authors.find((author) => author.slug === slug)?.name ?? "")
    .join(" ");
  const haystack = [
    article.title,
    article.subtitle ?? "",
    article.categories.join(" "),
    names,
    bodyText(record),
  ]
    .join(" ")
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

/** The records a query selects, in the order the list shows them. */
function selectRecords(
  records: readonly CmsArticleRecord[],
  query: ArticleIndexQuery,
  authors: readonly ArticleIndexAuthor[],
) {
  let selected: readonly CmsArticleRecord[] = records;
  if (query.q) {
    const terms = tokenize(query.q);
    // Nothing searchable in the query (punctuation only): nothing matches.
    const matching = terms.length
      ? records.filter((record) => containsEveryTerm(record, terms, authors))
      : [];
    const bySlug = new Map(records.map((record) => [record.slug, record]));
    const ranked = searchArticles(matching, query.q, Number.POSITIVE_INFINITY).map(
      (result) => result.slug,
    );
    // A match the ranking scores at zero (an author's name, say) still
    // belongs in the list: it follows the ranked ones, newest first.
    const rankedSet = new Set(ranked);
    const rest = matching
      .filter((record) => !rankedSet.has(record.slug))
      .sort((left, right) => right.article.date.localeCompare(left.article.date))
      .map((record) => record.slug);
    selected = [...ranked, ...rest].flatMap((slug) => {
      const record = bySlug.get(slug);
      return record ? [record] : [];
    });
  }
  if (query.category) {
    const slug = query.category;
    selected = selected.filter((record) => hasCategory(record, slug));
  }
  return selected;
}

export type ArticleIndexResult = ArticleBatch & {
  /** Every category across the whole published list (not only the matches). */
  categories: ArticleCategory[];
  /** Published articles in total, whatever the query. */
  all: number;
};

export function selectArticleIndex(
  records: readonly CmsArticleRecord[],
  authors: readonly ArticleIndexAuthor[],
  query: ArticleIndexQuery,
  { offset = 0, limit }: { offset?: number; limit: number },
): ArticleIndexResult {
  const selected = selectRecords(records, query, authors);
  const start = Math.max(0, Math.min(offset, selected.length));
  const end = Math.min(selected.length, start + Math.max(0, limit));
  return {
    items: selected
      .slice(start, end)
      .map((record) => toArticleCard(record, authors as readonly Member[])),
    total: selected.length,
    offset: start,
    nextOffset: end < selected.length ? end : null,
    categories: articleCategories(records),
    all: records.length,
  };
}

/** The static search index: every published article, its body cut to text. */
export type ArticleSearchIndex = {
  records: CmsArticleRecord[];
  authors: ArticleIndexAuthor[];
};

/**
 * One record as the search index ships it: the article, one text block
 * holding its body, and its image captions as bare image blocks. That is all
 * the search and the filter read (captions count for ranking, not for the
 * filter, as in the full document). The BlockNote documents stay out of the
 * browser.
 */
export function toSearchRecord(record: CmsArticleRecord): CmsArticleRecord {
  const text = bodyText(record);
  const captions = record.content.flatMap((block, index) => {
    const caption = (block.props as { caption?: unknown } | undefined)?.caption;
    return block.type === "image" && typeof caption === "string" && caption
      ? [{ id: `image-${index}`, type: "image", props: { caption } }]
      : [];
  });
  return {
    ...record,
    content: [
      ...(text ? [{ id: "text", type: "paragraph", content: [{ type: "text", text }] }] : []),
      ...captions,
    ],
  };
}
