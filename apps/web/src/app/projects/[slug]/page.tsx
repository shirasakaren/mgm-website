import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { projectDetailData } from "@/components/projects/detail/detail-data";
import { ProjectDetail } from "@/components/projects/detail/project-detail";
import { SITE_URL } from "@/lib/base-path";
import { projectMediaUrl, projectThemeId, publishedProjects } from "@/lib/project-cms";
import { fetchProjectFeed, readProjectDetail } from "@/lib/project-cms-server";
import { PROJECT_THEMES, projectThemeCss } from "@/lib/project-themes";

type ProjectPageProps = PageProps<"/projects/[slug]">;

export const dynamicParams = false;

export async function generateStaticParams() {
  return publishedProjects(await fetchProjectFeed()).map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { record } = await readProjectDetail(slug);
  if (!record) return { title: "Project not found | MGM Laboratory" };
  const { project } = record;
  const title = `${project.seoTitle || project.title} | MGM Laboratory`;
  const description = project.seoDescription || project.description || project.summary;
  const cover = projectMediaUrl(project.coverKey);
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
      images:
        cover && metadataBase
          ? [{ url: cover, alt: project.coverAlt || project.title }]
          : undefined,
    },
  };
}

export async function generateViewport({ params }: ProjectPageProps): Promise<Viewport> {
  const { slug } = await params;
  const { record } = await readProjectDetail(slug);
  if (!record) return {};
  // The browser chrome wears the project's background, following the
  // system scheme (the site's own toggle can't reach a meta tag).
  const theme = PROJECT_THEMES[projectThemeId(record.project)];
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: theme.light.bg },
      { media: "(prefers-color-scheme: dark)", color: theme.dark.bg },
    ],
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { record, feed } = await readProjectDetail(slug);
  if (!record) notFound();

  const data = projectDetailData(record, feed);

  return (
    <>
      {/* The project's palette exists only while this page is mounted: the
          variables sit on :root (the site header reads them too) and the
          page background follows them, light or dark with the site. A
          plain <style> (not a hoisted one) leaves with the page. */}
      <style>{`${projectThemeCss(data.themeId)}html,body{background:var(--project-bg)}`}</style>
      <ProjectDetail data={data} key={data.slug} />
    </>
  );
}
