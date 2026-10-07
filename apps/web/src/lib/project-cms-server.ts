import "server-only";

import type { CmsProjectRecord } from "@/lib/project-cms";
import { PROJECT_RECORDS } from "@/lib/static-content";

/** The light feed: every published project without its BlockNote document. */
export async function fetchProjectFeed(): Promise<CmsProjectRecord[]> {
  return PROJECT_RECORDS.map((record) => ({ ...record, body: [] }));
}

/** One published project with its document, or undefined when absent. */
export async function fetchProjectRecord(slug: string): Promise<CmsProjectRecord | undefined> {
  return PROJECT_RECORDS.find((record) => record.slug === slug);
}

/**
 * Everything a project detail page renders from: the record (with the
 * measured sizes of its media) and the published feed, which decides the
 * next project.
 */
export async function readProjectDetail(slug: string) {
  const [record, feed] = await Promise.all([fetchProjectRecord(slug), fetchProjectFeed()]);
  return { record, feed };
}
