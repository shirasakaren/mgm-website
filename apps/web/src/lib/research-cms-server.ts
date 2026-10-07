import "server-only";

import type { CmsResearchRecord } from "@/lib/research-cms";
import { RESEARCH_RECORDS } from "@/lib/static-content";

/** The light feed: every published initiative without its BlockNote document. */
export async function fetchResearchFeed(): Promise<CmsResearchRecord[]> {
  return RESEARCH_RECORDS.map((record) => ({ ...record, body: [] }));
}

/** One published initiative with its document, or undefined when absent. */
export async function fetchResearchRecord(slug: string): Promise<CmsResearchRecord | undefined> {
  return RESEARCH_RECORDS.find((record) => record.slug === slug);
}
