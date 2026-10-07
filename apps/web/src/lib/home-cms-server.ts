import "server-only";

import type { HomeContent } from "@/lib/content-types";

import { HOME_CONTENT } from "@/lib/static-content";

/** The homepage video block. */
export async function fetchHomeContent(): Promise<HomeContent> {
  return HOME_CONTENT;
}
