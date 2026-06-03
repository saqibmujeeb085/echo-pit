import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetailPageClient from "@/components/projects/ProjectDetailPageClient";
import {
  fetchAllProjectSlugs,
  fetchProjectBySlug,
} from "@/lib/project-details";

type ProjectPageProps = {
  /**
   * Next.js 16 App Router passes dynamic params as a Promise.
   */
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await fetchAllProjectSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.seo.title,
    description: project.seo.description,
    keywords: project.seo.keywords,
    openGraph: {
      title: project.seo.title,
      description: project.seo.description,
      images: [
        {
          url: project.seo.image,
          alt: project.name,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  /**
   * The data is fetched according to the route slug.
   *
   * Examples:
   * /projects/hmi-car
   * /projects/gimo
   * /projects/bankrt
   */
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  /**
   * Header and footer are intentionally not rendered here.
   * Keep them in your shared app layout.
   */
  return <ProjectDetailPageClient project={project} />;
}
