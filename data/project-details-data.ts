import type { ProjectDetail } from "./project-details";

/**
 * Dummy data only.
 *
 * Replace the Picsum URLs with your actual API response later.
 * Every project uses the same dynamic template, but each slug controls
 * the copy, media sequence, tags, live link, partner name, and SEO.
 */

const image = (seed: string, width = 1920, height = 1200) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

export const projectDetails: ProjectDetail[] = [
  {
    id: 1,
    slug: "hmi-car",
    name: "HMI Car",
    shortDescription: "HMI Car & App\nDesign Concept",
    partnerText: "Electric Car",
    liveUrl: "https://www.behance.net/",
    thumbnail: image("hmi-next", 1200, 1400),
    tags: [
      { id: 1, name: "MOBILE APP" },
      { id: 2, name: "PRODUCT" },
      { id: 3, name: "INTERACTION" },
      { id: 4, name: "ANIMATION" },
    ],
    seo: {
      title: "HMI Car — Digital Product Case Study",
      description:
        "A reusable dummy HMI car project detail page rendered from dynamic slug-based content.",
      keywords: ["HMI", "UX UI", "Automotive", "Product Design"],
      image: image("hmi-seo", 1200, 630),
    },
    contents: [
      {
        id: "hmi-cover-image",
        type: "full_media",
        media: {
          type: "image",
          src: image("hmi-01"),
          alt: "Dummy HMI dashboard hero image",
        },
      },
      {
        id: "hmi-challenge",
        type: "paragraph",
        title: "The challenge",
        content:
          "This is dummy content for the dynamic project page. The goal is to create a modern and luxurious interface that feels clear, intuitive, and consistent across every digital touchpoint. Replace this copy with content fetched from your API.",
      },
      {
        id: "hmi-image-02",
        type: "full_media",
        media: {
          type: "image",
          src: image("hmi-02"),
          alt: "Dummy full-width interface image",
        },
      },
      {
        id: "hmi-ipc",
        type: "paragraph",
        title: "IPC, HMI Car",
        content:
          "The information cluster and central display use a unified visual language. This block is also fetched by slug, so each project can use its own headings and descriptions while keeping the same layout.",
      },
      {
        id: "hmi-image-03",
        type: "full_media",
        media: {
          type: "image",
          src: image("hmi-03"),
          alt: "Dummy automotive interface image",
        },
      },
      {
        id: "hmi-split-01",
        type: "split_media",
        medias: [
          {
            type: "image",
            src: image("hmi-split-01", 1920, 1000),
            alt: "Dummy wide project image",
          },
          {
            type: "image",
            src: image("hmi-split-02", 1000, 1000),
            alt: "Dummy square interface image",
          },
          {
            type: "image",
            src: image("hmi-split-03", 1000, 1000),
            alt: "Dummy square dashboard image",
          },
        ],
      },
      {
        id: "hmi-image-04",
        type: "full_media",
        media: {
          type: "image",
          src: image("hmi-04"),
          alt: "Dummy full-width concept image",
        },
      },
      {
        id: "hmi-split-02",
        type: "split_media",
        medias: [
          {
            type: "image",
            src: image("hmi-split-04", 1000, 1000),
            alt: "Dummy square app image",
          },
          {
            type: "image",
            src: image("hmi-split-05", 1000, 1000),
            alt: "Dummy square app image",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "gimo",
    name: "GIMO",
    shortDescription: "Financial Welfare\nSolution For Workers",
    partnerText: "Fintech Platform",
    liveUrl: "https://www.behance.net/",
    thumbnail: image("gimo-next", 1200, 1400),
    tags: [
      { id: 1, name: "WEBSITE" },
      { id: 2, name: "PRODUCT" },
      { id: 3, name: "INTERACTION" },
      { id: 4, name: "ANIMATION" },
    ],
    seo: {
      title: "GIMO — Digital Product Case Study",
      description:
        "A dynamic dummy fintech case study rendered from a project slug.",
      keywords: ["Fintech", "Website", "UX UI", "Product Design"],
      image: image("gimo-seo", 1200, 630),
    },
    contents: [
      {
        id: "gimo-cover-image",
        type: "full_media",
        media: {
          type: "image",
          src: image("gimo-01"),
          alt: "Dummy fintech project hero image",
        },
      },
      {
        id: "gimo-challenge",
        type: "paragraph",
        title: "The challenge",
        content:
          "This dummy fintech project demonstrates that the same page template can render a completely different case study. Only the data object changes; the component and animation system remain reusable.",
      },
      {
        id: "gimo-image-02",
        type: "full_media",
        media: {
          type: "image",
          src: image("gimo-02"),
          alt: "Dummy fintech dashboard image",
        },
      },
      {
        id: "gimo-product",
        type: "paragraph",
        title: "A clearer product journey",
        content:
          "Use paragraphs wherever the story needs context. Full-width images and split galleries can be arranged in any sequence inside the contents array.",
      },
      {
        id: "gimo-split-01",
        type: "split_media",
        medias: [
          {
            type: "image",
            src: image("gimo-split-01", 1920, 1000),
            alt: "Dummy wide fintech visual",
          },
          {
            type: "image",
            src: image("gimo-split-02", 1000, 1000),
            alt: "Dummy mobile fintech visual",
          },
          {
            type: "image",
            src: image("gimo-split-03", 1000, 1000),
            alt: "Dummy mobile fintech visual",
          },
        ],
      },
      {
        id: "gimo-image-03",
        type: "full_media",
        media: {
          type: "image",
          src: image("gimo-03"),
          alt: "Dummy full-width fintech image",
        },
      },
    ],
  },
  {
    id: 3,
    slug: "bankrt",
    name: "BankRT",
    shortDescription: "Private Banking\nDigital Experience",
    partnerText: "Private Bank",
    liveUrl: "https://www.behance.net/",
    thumbnail: image("bankrt-next", 1200, 1400),
    tags: [
      { id: 1, name: "WEBSITE" },
      { id: 2, name: "PRODUCT" },
      { id: 3, name: "ILLUSTRATION" },
      { id: 4, name: "BRANDING" },
    ],
    seo: {
      title: "BankRT — Digital Product Case Study",
      description:
        "A dynamic dummy banking case study rendered from a project slug.",
      keywords: ["Banking", "Website", "Branding", "Product Design"],
      image: image("bankrt-seo", 1200, 630),
    },
    contents: [
      {
        id: "bankrt-cover-image",
        type: "full_media",
        media: {
          type: "image",
          src: image("bankrt-01"),
          alt: "Dummy banking interface hero image",
        },
      },
      {
        id: "bankrt-introduction",
        type: "paragraph",
        title: "Digital private banking",
        content:
          "This sample project shows how a third slug loads its own content while preserving exactly the same reusable layout and animation sequence.",
      },
      {
        id: "bankrt-image-02",
        type: "full_media",
        media: {
          type: "image",
          src: image("bankrt-02"),
          alt: "Dummy banking dashboard image",
        },
      },
      {
        id: "bankrt-split-01",
        type: "split_media",
        medias: [
          {
            type: "image",
            src: image("bankrt-split-01", 1000, 1000),
            alt: "Dummy square banking image",
          },
          {
            type: "image",
            src: image("bankrt-split-02", 1000, 1000),
            alt: "Dummy square banking image",
          },
        ],
      },
      {
        id: "bankrt-description",
        type: "paragraph",
        title: "Designed for confidence",
        content:
          "You can add, remove, or reorder blocks inside the data file without changing the page component. Later, replace the local lookup helper with your actual backend request.",
      },
      {
        id: "bankrt-image-03",
        type: "full_media",
        media: {
          type: "image",
          src: image("bankrt-03"),
          alt: "Dummy full-width banking image",
        },
      },
    ],
  },
];
