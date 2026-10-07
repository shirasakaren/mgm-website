import { articleSearchIndex } from "@/lib/article-index-server";

export const dynamic = "force-static";

/** The /articles search index, written to a static file at build time. */
export function GET() {
  return Response.json(articleSearchIndex());
}
