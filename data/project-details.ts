export type ProjectTag = {
  id: number;
  name: string;
};

export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

export type ProjectParagraphBlock = {
  id: string;
  type: "paragraph";
  title: string;
  content: string;
};

export type ProjectFullMediaBlock = {
  id: string;

  /**
   * The original source uses the misspelled value "full_meida".
   * This implementation accepts both values so it is easy to connect
   * to the source API later.
   */
  type: "full_media" | "full_meida";
  media: ProjectMedia;
};

export type ProjectSplitMediaBlock = {
  id: string;
  type: "split_media";
  medias: ProjectMedia[];
};

export type ProjectContentBlock =
  | ProjectParagraphBlock
  | ProjectFullMediaBlock
  | ProjectSplitMediaBlock;

export type ProjectSeo = {
  title: string;
  description: string;
  keywords: string[];
  image: string;
};

export type ProjectDetail = {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  partnerText: string;
  liveUrl?: string;
  thumbnail: string;
  tags: ProjectTag[];
  seo: ProjectSeo;
  contents: ProjectContentBlock[];
};

export type ProjectWithNext = ProjectDetail & {
  nextProject: Pick<
    ProjectDetail,
    "id" | "slug" | "name" | "shortDescription" | "thumbnail"
  >;
};
