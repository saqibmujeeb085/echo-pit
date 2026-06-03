"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

import {
  workFilters,
  workProjects,
  type WorkFilter,
  type WorkProject,
} from "@/data/works-data";

type WorksProjectsSectionProps = {
  projectsHref?: string;
  inspirationHref?: string;
  viewMoreHref?: string;
  orbitSpeed?: number;
  maxScrollDistance?: number;
};

type OrbitGraphicProps = {
  progress: number;
  speed: number;
};

type ProjectCardProps = {
  project: WorkProject;
  index: number;
};

const clamp = (value: number, minimum: number, maximum: number) => {
  return Math.min(Math.max(value, minimum), maximum);
};

const sanitizeSvgId = (value: string) => {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
};

/* -------------------------------------------------------------------------- */
/*                             Small Inline SVG Icons                         */
/* -------------------------------------------------------------------------- */

const DribbbleIcon = () => {
  const clipPathId = sanitizeSvgId(useId());

  return (
    <svg
      className="inline-block h-8 w-8"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M10 2.24813C11.8374 1.44534 13.8667 1 16 1C20.0882 1 23.7944 2.63548 26.5 5.28785M10 2.24813C10 2.24813 16.2545 9.589 18.5 15C20.7455 20.411 21.5 29.9596 21.5 29.9596M10 2.24813C5.58717 4.17618 2.2813 8.16602 1.30005 13M21.5 29.9596C19.797 30.6311 17.9416 31 16 31C12.4612 31 9.20858 29.7745 6.64343 27.7248M21.5 29.9596C26.7686 27.8821 30.5783 22.9083 30.9672 17M26.5 5.28785C29.277 8.01024 31 11.8039 31 16C31 16.336 30.989 16.6695 30.9672 17M26.5 5.28785C26.5 5.28785 22.7138 11.2268 15.217 13.7403C7.72016 16.2538 1.30005 13 1.30005 13M1.30005 13C1.10329 13.9693 1 14.9726 1 16C1 20.7455 3.20363 24.9762 6.64343 27.7248M30.9672 17C30.9672 17 24.1344 14.6365 16.6595 17.8275C9.23039 20.999 6.64343 27.7248 6.64343 27.7248"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>

      <defs>
        <clipPath id={clipPathId}>
          <rect width="32" height="32" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

const ArrowIcon = () => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block h-8 w-8"
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

/* -------------------------------------------------------------------------- */
/*                         Animated Header Inline SVG                         */
/* -------------------------------------------------------------------------- */

const OrbitGraphic = ({ progress, speed }: OrbitGraphicProps) => {
  const firstOrbitPath =
    "M353.607 271.258C400.88 223.985 439.097 176.584 462.668 138.154C474.451 118.942 482.589 101.948 486.359 88.3171C490.118 74.7306 489.587 64.2911 483.715 58.419C477.843 52.5468 467.403 52.016 453.817 55.7743C440.186 59.5447 423.192 67.6829 403.98 79.4661C365.549 103.037 318.148 141.254 270.876 188.527C223.603 235.799 185.386 283.2 161.815 321.631C150.032 340.843 141.894 357.837 138.123 371.468C134.365 385.054 134.896 395.494 140.768 401.366C146.64 407.238 157.08 407.769 170.666 404.01C184.297 400.24 201.291 392.102 220.503 380.319C258.933 356.748 306.334 318.531 353.607 271.258Z";

  const secondOrbitPath =
    "M401.607 271.258C448.88 223.985 487.097 176.584 510.668 138.154C522.451 118.942 530.589 101.948 534.359 88.3171C538.118 74.7306 537.587 64.2911 531.715 58.419C525.843 52.5468 515.403 52.016 501.817 55.7743C488.186 59.5447 471.192 67.6829 451.98 79.4661C413.549 103.037 366.148 141.254 318.876 188.527C271.603 235.799 233.386 283.2 209.815 321.631C198.032 340.843 189.894 357.837 186.123 371.468C182.365 385.054 182.896 395.494 188.768 401.366C194.64 407.238 205.08 407.769 218.666 404.01C232.297 400.24 249.291 392.102 268.503 380.319C306.933 356.748 354.334 318.531 401.607 271.258Z";

  const thirdOrbitPath =
    "M449.607 271.258C496.88 223.985 535.097 176.584 558.668 138.154C570.451 118.942 578.589 101.948 582.359 88.3171C586.118 74.7306 585.587 64.2911 579.715 58.419C573.843 52.5468 563.403 52.016 549.817 55.7743C536.186 59.5447 519.192 67.6829 499.98 79.4661C461.549 103.037 414.148 141.254 366.876 188.527C319.603 235.799 281.386 283.2 257.815 321.631C246.032 340.843 237.894 357.837 234.123 371.468C230.365 385.054 230.896 395.494 236.768 401.366C242.64 407.238 253.08 407.769 266.666 404.01C280.297 400.24 297.291 392.102 316.503 380.319C354.933 356.748 402.334 318.531 449.607 271.258Z";

  return (
    <svg
      viewBox="0 0 721 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full"
      style={{
        aspectRatio: "721 / 480",
      }}
      aria-hidden="true"
    >
      <g transform={`matrix(1, 0, 0, 1, ${-80 * progress}, 0)`}>
        <circle r="9" transform="matrix(1, 0, 0, 1, -7, -7)" fill="white">
          <animateMotion
            dur={`${speed}s`}
            repeatCount="indefinite"
            path={firstOrbitPath}
          />
        </circle>

        <path d={firstOrbitPath} stroke="white" />
      </g>

      <path d={secondOrbitPath} stroke="white" opacity="0.7" />

      <path
        d={thirdOrbitPath}
        stroke="white"
        opacity="0.5"
        transform={`matrix(1, 0, 0, 1, ${80 * progress}, 0)`}
      />
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Project Card                                 */
/* -------------------------------------------------------------------------- */

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.16,
      },
    );

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!isVisible || !cardRef.current) {
      return;
    }

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 48,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index % 2 ? 0.15 : 0,
        ease: "power3.out",
      },
    );
  }, [index, isVisible]);

  const playVideo = () => {
    const video = videoRef.current;

    if (!video) return;

    video.play().catch(() => {
      /**
       * If autoplay is blocked, the image remains visible.
       */
    });
  };

  const pauseVideo = () => {
    const video = videoRef.current;

    if (!video) return;

    video.pause();
  };

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer opacity-0"
      data-cursor-variant="project"
      data-cursor-theme="primary"
      data-cursor-stretch="true"
      data-cursor-media=""
      onMouseEnter={playVideo}
      onMouseLeave={pauseVideo}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="flex flex-col md:flex-row lg:flex-col">
          {/* Card text */}
          <div className="order-1 mt-10 w-full border-b-0 border-neutral-500 md:order-none md:mt-0 md:w-1/2 lg:w-full lg:border lg:border-b-0 lg:p-6 xl:px-12 xl:py-11">
            <div className="text-h8 font-medium md:text-h7 lg:text-h6">
              {project.title}
            </div>

            <ol className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-tn uppercase xl:mt-8 xl:text-xs">
              {project.tags.map((tag) => (
                <li
                  key={`${project.id}-${tag.slug}`}
                  className="list-inside list-[square] marker:text-primary-600"
                >
                  {tag.name}
                </li>
              ))}
            </ol>
          </div>

          {/* Card thumbnail */}
          <div className="relative aspect-[1.25] w-full flex-1 overflow-hidden md:w-1/2 md:pb-0 lg:w-full">
            <img
              src={project.thumbnail}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Desktop hover video */}
            {project.videoUrl ? (
              <video
                ref={videoRef}
                src={project.videoUrl}
                muted
                playsInline
                loop
                preload="none"
                className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 lg:block"
              />
            ) : null}

            {/* Image-cover entrance animation */}
            <div
              className={`absolute top-0 w-full bg-neutral-800 transition-[height] duration-1000 ease-out lg:border-x lg:border-neutral-500 ${
                isVisible ? "h-0" : "h-full"
              } ${index % 2 ? "delay-200" : ""}`}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                            Main Works Section                              */
/* -------------------------------------------------------------------------- */

const WorksProjectsSection = ({
  projectsHref = "/works/projects",
  inspirationHref = "/works/inspiration",
  viewMoreHref = "https://dribbble.com/PitStudio",
  orbitSpeed = 5,
  maxScrollDistance = 200,
}: WorksProjectsSectionProps) => {
  const pathname = usePathname() ?? "";

  const titleContainerRef = useRef<HTMLDivElement | null>(null);

  const tabsRef = useRef<HTMLDivElement | null>(null);

  const [activeFilter, setActiveFilter] = useState<WorkFilter>(workFilters[0]);

  const [scrollProgress, setScrollProgress] = useState(0);

  const isProjectsPage =
    pathname === projectsHref || pathname.startsWith(`${projectsHref}/`);

  /**
   * Filtering:
   * - id -1 means show everything
   * - other filters match a project tag ID
   */
  const visibleProjects = useMemo(() => {
    if (activeFilter.id === -1) {
      return workProjects;
    }

    return workProjects.filter((project) => {
      return project.tags.some((tag) => {
        return tag.id === activeFilter.id;
      });
    });
  }, [activeFilter]);

  /**
   * Title and filters entrance.
   */
  useLayoutEffect(() => {
    const titleContainer = titleContainerRef.current;

    const tabs = tabsRef.current;

    if (!titleContainer || !tabs) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(titleContainer.children),
        {
          yPercent: 130,
          rotateX: -40,
          opacity: 0,
          transformPerspective: 300,
          transformOrigin: "center top",
        },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
        },
      );

      gsap.fromTo(
        tabs,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.35,
          ease: "power3.out",
        },
      );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  /**
   * Move the SVG ellipses during the first 200px of scrolling.
   */
  useLayoutEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        const distance = Math.max(maxScrollDistance, 1);

        const progress = clamp(window.scrollY, 0, distance) / distance;

        setScrollProgress(progress);
      });
    };

    updateProgress();

    window.addEventListener("scroll", updateProgress, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frameId);

      window.removeEventListener("scroll", updateProgress);
    };
  }, [maxScrollDistance]);

  return (
    <section
      className="bg-neutral-800 text-neutral-0"
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      {/* -------------------------------------------------------------- */}
      {/* Header                                                         */}
      {/* -------------------------------------------------------------- */}

      <div className="container overflow-hidden">
        <div className="mt-8 block items-center justify-between md:mt-16 lg:mt-20 lg:flex xl:mt-9">
          {/* Page tabs */}
          <div
            ref={titleContainerRef}
            className="relative z-10 text-h7 font-medium md:text-h5 lg:text-h4 xl:text-h3"
            style={{
              perspective: "300px",
            }}
          >
            <div>
              <Link
                href={projectsHref}
                className={`block transition-opacity duration-500 ${
                  isProjectsPage ? "opacity-100" : "opacity-[0.15]"
                }`}
              >
                <span>Project</span>
              </Link>
            </div>

            <div>
              <Link
                href={inspirationHref}
                className={`block transition-opacity duration-500 ${
                  isProjectsPage ? "opacity-[0.15]" : "opacity-100"
                }`}
              >
                <span>Inspiration</span>
              </Link>
            </div>
          </div>

          {/* Animated SVG orbit */}
          <div className="pointer-events-none flex justify-center lg:justify-end">
            <div className="h-[17rem] md:h-[22rem] lg:h-[30rem] xl:h-[32rem]">
              <OrbitGraphic progress={scrollProgress} speed={orbitSpeed} />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Filter pills + Inspiration external button                   */}
        {/* ------------------------------------------------------------ */}

        <div
          ref={tabsRef}
          className="scrollbar-hide flex items-center justify-between gap-6 overflow-x-auto pb-8 lg:pb-10 xl:pb-12"
        >
          <div className="flex min-w-max gap-x-3 md:gap-x-4">
            {workFilters.map((filter) => {
              const isActive = activeFilter.id === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`inline-flex shrink-0 items-center justify-center rounded-full border px-6 py-3 text-xs transition-colors duration-300 md:px-8 md:py-[1.125rem] md:text-sm ${
                    isActive
                      ? "border-neutral-0"
                      : "border-transparent hover:border-neutral-0"
                  }`}
                >
                  {filter.name}
                </button>
              );
            })}
          </div>

          {!isProjectsPage ? (
            <div className="ml-auto hidden shrink-0 lg:block">
              <a
                href={viewMoreHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex h-16 items-center overflow-hidden rounded-full border border-neutral-0 px-5 py-4 text-neutral-0 transition-colors duration-300 hover:text-neutral-800"
              >
                <span className="absolute inset-0 translate-x-full rounded-full bg-neutral-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:rounded-none" />

                <span className="relative z-10 inline-flex items-center">
                  <DribbbleIcon />

                  <span className="px-4 font-medium">VIEW MORE</span>

                  <ArrowIcon />
                </span>
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Filtered cards                                                  */}
      {/* -------------------------------------------------------------- */}

      <div className="container pb-16 lg:pb-24 xl:pb-36">
        <div
          key={activeFilter.id}
          className="grid grid-cols-1 gap-y-14 gap-x-14 lg:grid-cols-2 "
        >
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={`${activeFilter.id}-${project.id}`}
              project={project}
              index={index}
            />
          ))}
        </div>

        {!visibleProjects.length ? (
          <div className="py-20 text-center text-sm text-neutral-300">
            No projects found for this filter.
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default WorksProjectsSection;
