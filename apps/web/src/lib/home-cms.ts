import type { HomeContent } from "@/lib/content-types";

import { withBasePath } from "@/lib/base-path";

export type { HomeContent, HomeVideoMode } from "@/lib/content-types";

/** Resolves an uploaded home-video key to a loadable, range-seekable URL. */
export function homeVideoUrl(key?: string) {
  if (!key) return undefined;
  return withBasePath(`/media/home-video/${encodeURIComponent(key)}`);
}

/** The playable source for the saved homepage video, if one is uploaded. */
export function homeVideoSource(content: HomeContent) {
  return content.videoMode === "upload" ? homeVideoUrl(content.videoKey) : undefined;
}
