"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "@/styles/ProjectDetailPage.module.css";
import type {
  ProjectContentBlock,
  ProjectMedia,
  ProjectWithNext,
} from "@/data/project-details";
import Image from "next/image";
import Footer from "../layout/Footer";

type ProjectDetailPageClientProps = {
  project: ProjectWithNext;
};

type MediaProps = {
  media: ProjectMedia;
  className?: string;
};

const ArrowIcon = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M24.0003 8L6 26.0003" stroke="currentColor" strokeWidth="2.5" />

      <path
        d="M7.72656 8H23.9643V24.2377"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
};

const LargeArrowIcon = () => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.viewAllArrow}
      aria-hidden="true"
    >
      <path d="M37 11L11 37" stroke="currentColor" strokeWidth="4" />

      <path
        d="M13.4941 11H36.9482V34.4541"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
};

const ProjectMediaView = ({ media, className = "" }: MediaProps) => {
  if (media.type === "video") {
    return (
      <video
        src={media.src}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        data-project-parallax-media
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt ?? ""}
      loading="lazy"
      className={className}
      data-project-parallax-media
      width={2000}
      height={2000}
    />
  );
};

const FullMediaBlock = ({ media }: { media: ProjectMedia }) => {
  return (
    <section className={styles.fullMediaSection} data-project-parallax-section>
      <div className={styles.fullMediaFrame}>
        <ProjectMediaView media={media} className={styles.parallaxMedia} />
      </div>
    </section>
  );
};

const ParagraphBlock = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <section className={styles.description} data-project-copy-reveal>
      <div className={styles.descriptionInner}>
        <div className={styles.descriptionTitle}>{title}</div>

        <p className={styles.descriptionContent}>{content}</p>
      </div>
    </section>
  );
};

const SplitMediaBlock = ({ medias }: { medias: ProjectMedia[] }) => {
  const firstMedia = medias[0];
  const finalTwoMedias = medias.slice(-2);

  return (
    <section className={styles.splitShow} data-project-parallax-section>
      <div className={styles.splitShowContainer}>
        {(medias.length === 1 || medias.length === 3) && firstMedia ? (
          <div className={styles.splitShowItems}>
            <div className={styles.splitShowColumnOne}>
              <div className={styles.splitShowImageContainer}>
                <ProjectMediaView
                  media={firstMedia}
                  className={styles.parallaxMedia}
                />
              </div>
            </div>
          </div>
        ) : null}

        {medias.length > 1 ? (
          <div className={styles.splitShowItems}>
            {finalTwoMedias.map((media, index) => (
              <div
                className={styles.splitShowColumnTwo}
                key={`${media.src}-${index}`}
              >
                <div className={styles.splitShowImageContainer}>
                  <ProjectMediaView
                    media={media}
                    className={styles.parallaxMedia}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

const ContentBlock = ({ block }: { block: ProjectContentBlock }) => {
  if (block.type === "paragraph") {
    return <ParagraphBlock title={block.title} content={block.content} />;
  }

  if (block.type === "full_media" || block.type === "full_meida") {
    return <FullMediaBlock media={block.media} />;
  }

  if (block.type === "split_media") {
    return <SplitMediaBlock medias={block.medias} />;
  }

  return null;
};

const ProjectCover = ({ project }: ProjectDetailPageClientProps) => {
  return (
    <section className={styles.cover}>
      <div className={styles.coverContent}>
        <div>
          <div className={styles.coverBrand}>
            <h1 data-project-cover-reveal>{project.name}</h1>
          </div>

          <div className={styles.coverProject}>
            <h2>
              {project.shortDescription.split("\n").map((line, index) => (
                <span
                  className={styles.coverTitleLine}
                  data-project-cover-reveal
                  key={`${line}-${index}`}
                >
                  {line}
                </span>
              ))}
            </h2>
          </div>
        </div>

        <ul className={styles.coverTags}>
          {project.tags.map((tag) => (
            <li data-project-cover-reveal key={tag.id}>
              {tag.name}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.coverExtra}>
        <a
          href={project.liveUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.liveButton}
        >
          <span className={styles.liveButtonRipple} />

          <span className={styles.liveButtonText}>See live</span>
        </a>

        <div className={styles.coverPartner}>
          <div>Project for</div>

          <div className={styles.coverPartnerStrong}>{project.partnerText}</div>
        </div>
      </div>
    </section>
  );
};

const NextProject = ({ project }: ProjectDetailPageClientProps) => {
  return (
    <section
      className={styles.nextProject}
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-project-next-reveal
    >
      <div className={styles.pageContainer}>
        <div className={styles.nextProjectOuter}>
          <Link
            href={`/projects/${project.nextProject.slug}`}
            className={styles.nextProjectLink}
          >
            <div
              className={`${styles.nextProjectLabel} ${styles.nextProjectLabelMobile}`}
            >
              Next project
            </div>

            <div className={styles.nextProjectLeft}>
              <div
                className={`${styles.baselineVertical} ${styles.baselineLeft}`}
              />

              <div
                className={`${styles.nextProjectLabel} ${styles.nextProjectLabelDesktop}`}
              >
                Next project
              </div>

              <div className={styles.nextProjectInfo}>
                <div className={styles.nextProjectBrand}>
                  {project.nextProject.name}
                </div>

                <div className={styles.nextProjectTitle}>
                  {project.nextProject.shortDescription}
                </div>
              </div>

              <div className={styles.nextProjectButtonWrap}>
                <span className={styles.nextProjectButton}>
                  <span className={styles.nextProjectArrowFrame}>
                    <ArrowIcon className={styles.nextProjectArrowFirst} />

                    <ArrowIcon className={styles.nextProjectArrowSecond} />
                  </span>
                </span>
              </div>

              <div
                className={`${styles.baselineVertical} ${styles.baselineRight}`}
              />
            </div>

            <div
              className={styles.nextProjectRight}
              data-project-parallax-section
            >
              <div className={styles.nextProjectThumbnail}>
                <Image
                  src={project.nextProject.thumbnail}
                  alt={project.nextProject.shortDescription}
                  className={styles.nextProjectImage}
                  data-project-parallax-media
                  width={2000}
                  height={2000}
                />
              </div>
            </div>
          </Link>

          <div className={styles.viewAllCasesWrap}>
            <div className={styles.baselineHorizontal} />

            <div className={styles.viewAllCasesInner}>
              <Link href="/works/projects" className={styles.viewAllCasesLink}>
                <span className={styles.viewAllCasesDot}>
                  <LargeArrowIcon />
                </span>

                <span>VIEW ALL CASES</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectDetailPageClient = ({ project }: ProjectDetailPageClientProps) => {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {
      /**
       * Cover reveal:
       * brand → title lines → tags
       *
       * Matches the original 3D entrance direction:
       * translateY(130%), rotateX(-40deg), opacity 0.
       */
      const coverTargets = gsap.utils.toArray<HTMLElement>(
        "[data-project-cover-reveal]",
      );

      gsap.fromTo(
        coverTargets,
        {
          yPercent: 130,
          rotateX: -40,
          opacity: 0,
          transformPerspective: 600,
          transformOrigin: "center top",
        },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "expo.out",
        },
      );

      /**
       * Full-media and split-media parallax.
       */
      const parallaxSections = gsap.utils.toArray<HTMLElement>(
        "[data-project-parallax-section]",
      );

      parallaxSections.forEach((section) => {
        const mediaElements = section.querySelectorAll<HTMLElement>(
          "[data-project-parallax-media]",
        );

        if (!mediaElements.length) return;

        gsap.fromTo(
          mediaElements,
          {
            yPercent: -12,
            scale: 1.16,
          },
          {
            yPercent: 12,
            scale: 1.16,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      /**
       * Paragraph reveal.
       */
      const copySections = gsap.utils.toArray<HTMLElement>(
        "[data-project-copy-reveal]",
      );

      copySections.forEach((section) => {
        gsap.fromTo(
          Array.from(section.children),
          {
            y: 56,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          },
        );
      });

      /**
       * Next project reveal.
       */
      const nextProject = root.querySelector<HTMLElement>(
        "[data-project-next-reveal]",
      );

      if (nextProject) {
        gsap.fromTo(
          nextProject,
          {
            opacity: 0,
            y: 72,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: nextProject,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
    };
  }, [project.slug]);

  return (
    <>
      <main
        ref={rootRef}
        className={styles.page}
        data-cursor-stretch="true"
        data-cursor-media=""
      >
        <ProjectCover project={project} />

        {project.contents.map((block) => (
          <ContentBlock block={block} key={block.id} />
        ))}

        <NextProject project={project} />
      </main>
      <Footer />
    </>
  );
};

export default ProjectDetailPageClient;
