import "server-only";

import type { HomeContent } from "@/lib/content-types";

import articles from "@/content/articles.json";
import home from "@/content/home.json";
import members from "@/content/members.json";
import projects from "@/content/projects.json";
import publications from "@/content/publications.json";
import research from "@/content/research.json";
import type { CmsArticleRecord } from "@/lib/article-cms";
import type { CmsMemberRecord } from "@/lib/member-cms";
import type { CmsProjectRecord } from "@/lib/project-cms";
import type { CmsPublicationRecord } from "@/lib/publication-cms";
import type { CmsResearchRecord } from "@/lib/research-cms";

/**
 * The site's content, frozen from the CMS into `src/content/*.json`. Every
 * page reads from here at build time; nothing is fetched at runtime.
 *
 * The files hold the published records exactly as the public API served
 * them, in the same order (newest first), so edits are plain JSON changes.
 * Media keys resolve to files under `public/media/`.
 */

export const ARTICLE_RECORDS = articles as unknown as CmsArticleRecord[];
export const PROJECT_RECORDS = projects as unknown as CmsProjectRecord[];
export const MEMBER_RECORDS = members as unknown as CmsMemberRecord[];
export const PUBLICATION_RECORDS = publications as unknown as CmsPublicationRecord[];
export const RESEARCH_RECORDS = research as unknown as CmsResearchRecord[];
export const HOME_CONTENT = home as unknown as HomeContent;
