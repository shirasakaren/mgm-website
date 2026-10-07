import "server-only";

import type { CmsPublicationRecord } from "@/lib/publication-cms";
import { PUBLICATION_RECORDS } from "@/lib/static-content";

/** Every published publication (the records are light by design). */
export async function fetchPublicationFeed(): Promise<CmsPublicationRecord[]> {
  return PUBLICATION_RECORDS;
}

export const ensurePublicationFeed = fetchPublicationFeed;

/** One published publication, or undefined when absent. */
export async function fetchPublicationRecord(slug: string) {
  return PUBLICATION_RECORDS.find((record) => record.slug === slug);
}
