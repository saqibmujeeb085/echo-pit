export type WorkFilter = {
  id: string | number;
  name: string;
  slug: string;
};

export type WorkTag = {
  id: string | number;
  name: string;
  slug: string;
};

export type WorkProject = {
  id: string | number;
  title: string;
  slug: string;
  thumbnail: string;
  videoUrl?: string;
  description?: string;
  tags: WorkTag[];
};

export const workFilters: WorkFilter[];

export const workProjects: WorkProject[];
