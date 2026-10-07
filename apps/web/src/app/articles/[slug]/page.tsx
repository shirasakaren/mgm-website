import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { ArticleDetail } from "@/components/articles/detail/article-detail";
import { ArticleStory } from "@/components/articles/detail/article-story";
import { articleDetailData } from "@/components/articles/detail/detail-data";
import { articleCoverUrl, articleThemeId } from "@/lib/article-cms";
import { SITE_URL } from "@/lib/base-path";
import { PROJECT_THEMES, projectThemeCss } from "@/lib/project-themes";

import { readArticle, readMembers, readPublishedFeed } from "./read-article";

type ArticlePageProps = PageProps<"/articles/[slug]">;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await readPublishedFeed()).map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = await readArticle(slug);
  if (!record) return { title: "Article not found | MGM Laboratory" };
  const { article } = record;
  const title = `${article.title} | MGM Laboratory`;
  const description = article.subtitle || undefined;
  const cover = articleCoverUrl(article.coverKey);
  const metadataBase = new URL(SITE_URL);
  return {
    title,
    description,
    metadataBase,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "MGM Laboratory",
      publishedTime: article.date,
      images: cover && metadataBase ? [{ url: cover, alt: article.title }] : undefined,
    },
  };
}

export async function generateViewport({ params }: ArticlePageProps): Promise<Viewport> {
  const { slug } = await params;
  const record = await readArticle(slug);
  if (!record) return {};
  // The browser chrome wears the article's background, following the
  // system scheme (the site's own toggle can't reach a meta tag).
  const theme = PROJECT_THEMES[articleThemeId(record.article)];
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: theme.light.bg },
      { media: "(prefers-color-scheme: dark)", color: theme.dark.bg },
    ],
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [record, feed, members] = await Promise.all([
    readArticle(slug),
    readPublishedFeed(),
    readMembers(),
  ]);
  if (!record) notFound();

  const { data, story } = articleDetailData(record, feed, members.members, members.records);

  return (
    <>
      {/* The article's palette exists only while this page is mounted: the
          variables sit on :root (the site header reads them too) and the
          page background follows them, light or dark with the site. A
          plain <style> (not a hoisted one) leaves with the page. In the
          library world the canvas covers this background with the themed
          library; without it (reduced motion, no WebGL) it is the page. */}
      <style>{`${projectThemeCss(data.themeId)}html,body{background:var(--project-bg)}`}</style>
      <ArticleDetail data={data} key={data.slug}>
        <ArticleStory story={story} />
      </ArticleDetail>
    </>
  );
}
