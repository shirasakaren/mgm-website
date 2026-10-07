import "server-only";

import { MEMBERS } from "@/data/members";
import { publishedArticles, type CmsArticleRecord } from "@/lib/article-cms";
import { fetchArticleFeed, fetchArticleRecord } from "@/lib/article-cms-seed";
import { mergeMemberRecords, type CmsMemberRecord } from "@/lib/member-cms";
import { MEMBER_RECORDS } from "@/lib/static-content";

/** The article page's reads, all from the bundled content. */

export async function readArticle(slug: string): Promise<CmsArticleRecord | undefined> {
  return fetchArticleRecord(slug);
}

export async function readPublishedFeed(): Promise<CmsArticleRecord[]> {
  return publishedArticles(await fetchArticleFeed());
}

/** The member directory, for the bylines and their portraits. */
export async function readMembers(): Promise<{
  members: CmsMemberRecord["member"][];
  records: CmsMemberRecord[];
}> {
  return { members: mergeMemberRecords(MEMBERS, MEMBER_RECORDS), records: MEMBER_RECORDS };
}
