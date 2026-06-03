import "server-only";

import { cache } from "react";

import { projectDetails } from "@/data/project-details-data";
import type { ProjectDetail, ProjectWithNext } from "@/data/project-details";

/**
 * Local dummy fetch layer.
 *
 * Later, replace the projectDetails lookup with:
 *
 * const response = await fetch(`${process.env.API_URL}/projects/${slug}`, {
 *   next: { revalidate: 60 },
 * });
 *
 * if (!response.ok) return null;
 * return response.json();
 */
export const fetchProjectBySlug = cache(
  async (slug: string): Promise<ProjectWithNext | null> => {
    const currentIndex = projectDetails.findIndex(
      (project) => project.slug === slug,
    );

    if (currentIndex === -1) {
      return null;
    }

    const project = projectDetails[currentIndex];

    const nextProject =
      projectDetails[(currentIndex + 1) % projectDetails.length];

    return {
      ...project,
      nextProject: {
        id: nextProject.id,
        slug: nextProject.slug,
        name: nextProject.name,
        shortDescription: nextProject.shortDescription,
        thumbnail: nextProject.thumbnail,
      },
    };
  },
);

export const fetchAllProjectSlugs = cache(async (): Promise<string[]> => {
  return projectDetails.map((project) => project.slug);
});

export const fetchAllProjects = cache(async (): Promise<ProjectDetail[]> => {
  return projectDetails;
});
