"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

type ProjectItem = {
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string[];
};

type FeaturedProjectsSectionProps = {
  projects?: ProjectItem[];
  viewAllHref?: string;
};

const defaultProjects: ProjectItem[] = [
  {
    title: "BankRT",
    slug: "bankrt",
    description:
      "Private banking consists of personalized financial services & products offered to the high-net-worth individual.",
    image: "/assets/images/BankRT.jpg",
    tags: ["WEBSITE", "PRODUCT", "ILLUSTRATION", "ANIMATION", "BRANDING"],
  },
  {
    title: "Get Slash",
    slug: "get-slash",
    description:
      "Slash is a revolutionary payment method for shopping that offers a transparent solution without hidden fees or interest.",
    image: "/assets/images/Get-Slash.jpg",
    tags: ["WEBSITE", "INTERACTION", "ANIMATION", "DEVELOPMENT"],
  },
  {
    title: "Hi FPT",
    slug: "hi-fpt",
    description:
      "Hi FPT is a multi-featured application serving customer needs through safety, quality, and convenience.",
    image: "/assets/images/HIFPT.png",
    tags: [
      "MOBILE APP",
      "ILLUSTRATION",
      "INTERACTION",
      "ANIMATION",
      "BRANDING",
    ],
  },
  {
    title: "ORG Invest",
    slug: "org-invest",
    description:
      "The application provides investment opportunities for people without much experience, helping capital grow steadily and transparently.",
    image: "/assets/images/ORG.png",
    tags: ["MOBILE APP", "ILLUSTRATION", "INTERACTION", "DEVELOPMENT"],
  },
  {
    title: "pisign",
    slug: "pisign",
    description:
      "pisign helps users manage and sign documents easily, saving time and money with clients.",
    image: "/assets/images/pisign.png",
    tags: ["MOBILE APP", "PRODUCT", "ILLUSTRATION", "ANIMATION", "BRANDING"],
  },
  {
    title: "OneVinmec",
    slug: "onevinmec",
    description:
      "OneVinmec is Vinmec’s exclusive smart healthcare application with features updated and optimized continuously.",
    image: "/assets/images/OneVinmec.png",
    tags: ["MOBILE APP", "ILLUSTRATION", "INTERACTION", "ANIMATION"],
  },
];

const ArrowIcon = () => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="dot-icon h-8 w-8"
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

const FeaturedProjectsSection = ({
  projects = defaultProjects,
  viewAllHref = "/works/projects",
}: FeaturedProjectsSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const cardRefs = useRef<HTMLAnchorElement[]>([]);
  const mobileOverlayRefs = useRef<HTMLDivElement[]>([]);
  const desktopLayerRefs = useRef<HTMLAnchorElement[]>([]);
  const desktopImageRefs = useRef<HTMLImageElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /**
       * Mobile / tablet image cover reveal
       */
      mobileOverlayRefs.current.forEach((overlay) => {
        if (!overlay) return;

        gsap.to(overlay, {
          height: "0%",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: overlay.parentElement,
            start: "top 80%",
            once: true,
          },
        });
      });

      /**
       * Desktop sticky image circular reveal
       */
      if (window.innerWidth >= 1024) {
        desktopLayerRefs.current.forEach((layer, index) => {
          if (!layer) return;

          const image = desktopImageRefs.current[index];

          if (index === 0) {
            gsap.set(layer, {
              clipPath: "circle(150% at 4rem 5rem)",
              zIndex: 1,
            });

            gsap.set(image, {
              scale: 1,
            });

            return;
          }

          gsap.set(layer, {
            clipPath: "circle(0% at 4rem 5rem)",
            zIndex: index + 1,
          });

          gsap.set(image, {
            scale: 1.5,
          });

          gsap.to(layer, {
            clipPath: "circle(150% at 4rem 5rem)",
            ease: "none",
            scrollTrigger: {
              trigger: cardRefs.current[index],
              start: "top 75%",
              end: "top 20%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          gsap.to(image, {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: cardRefs.current[index],
              start: "top 75%",
              end: "top 20%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        });
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [projects.length]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-neutral-900 text-neutral-0"
      data-cursor-theme="white"
      data-cursor-stretch="true"
    >
      <div className="container max-lg:px-0">
        <div
          className="relative flex w-full cursor-pointer"
          data-cursor-variant="project"
          data-cursor-theme="primary"
          data-cursor-stretch="true"
        >
          {/* LEFT PROJECT LIST */}
          <div className="relative flex w-full flex-col lg:w-1/2">
            <div className="relative flex flex-1 flex-col border-x border-neutral-0/20">
              {projects.map((project, index) => (
                <Link
                  key={`${project.slug}-${index}`}
                  href={`/projects/${project.slug}`}
                  ref={(el) => {
                    if (el) cardRefs.current[index] = el;
                  }}
                  className="flex flex-1 flex-wrap gap-x-5 border-neutral-0/20 px-6 py-12 max-lg:border-b md:flex-nowrap md:px-12 lg:min-h-screen lg:px-10 lg:pt-20 xl:px-16 xl:pt-[7.5rem]"
                >
                  <div className="order-1 mt-10 w-full text-xs md:order-none md:mt-0 md:w-1/2 lg:w-full xl:text-sm">
                    <h5 className="text-h8 font-bold md:text-h6 xl:text-h5">
                      {project.title}
                    </h5>

                    <div className="mt-4 md:mt-6 xl:mt-10 xl:max-w-[25rem]">
                      {project.description}
                    </div>

                    <ul className="mt-8 flex flex-wrap gap-x-2 gap-y-4 md:mt-10 md:flex-col md:gap-y-[1.125rem] lg:mt-12 xl:mt-20 xl:gap-y-6">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="list-inside list-[square] list-item transition-opacity duration-700 marker:text-[1.25rem]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* MOBILE / TABLET IMAGE */}
                  <div className="relative w-full md:w-1/2 lg:hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="aspect-[1.128] w-full object-cover md:aspect-[0.835]"
                      height={1080}
                      width={1080}
                    />

                    <div
                      ref={(el) => {
                        if (el) mobileOverlayRefs.current[index] = el;
                      }}
                      className="absolute top-0 h-full w-full bg-neutral-800 transition-all duration-1000 ease-out"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* VIEW ALL CASES */}
            <div
              className="text-center md:py-2 lg:border-x lg:border-t lg:border-neutral-0/20 lg:py-8 xl:py-[1.625rem]"
              data-cursor-theme="white"
              data-cursor-stretch="true"
            >
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-x-4 p-0 text-sm font-medium text-primary-600 xl:text-base"
              >
                <button className="btn p-0 btn-icon gap-x-4">
                  <div className="dot bg-primary-600 text-neutral-0">
                    <svg
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="dot-icon w-8 h-8"
                    >
                      <path
                        d="M37 11L11 37"
                        stroke="currentColor"
                        stroke-width="4"
                      ></path>
                      <path
                        d="M13.4941 11H36.9482V34.4541"
                        stroke="currentColor"
                        stroke-width="4"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-sm xl:text-base ">VIEW ALL CASES</span>
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT STICKY IMAGE STACK */}
          <div className="relative hidden w-1/2 lg:block">
            <div className="sticky top-0 h-screen">
              {projects.map((project, index) => (
                <Link
                  key={`desktop-${project.slug}-${index}`}
                  href={`/projects/${project.slug}`}
                  ref={(el) => {
                    if (el) desktopLayerRefs.current[index] = el;
                  }}
                  className="absolute top-0 block h-screen w-full"
                >
                  <div className="h-full w-full pb-[7.25rem] pl-9 pt-20 xl:px-16">
                    <div className="relative h-full overflow-hidden">
                      <Image
                        ref={(el) => {
                          if (el) desktopImageRefs.current[index] = el;
                        }}
                        src={project.image}
                        height={1080}
                        width={1080}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
