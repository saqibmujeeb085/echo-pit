"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

type ClientItem = {
  name: string;
  description: string;
  logo?: string;
  href?: string;
};

type ClientsSectionProps = {
  title?: string;
  clients?: ClientItem[];
};

const defaultClients: ClientItem[] = [
  {
    name: "Thu Cuc",
    description: "Hospital specialized in cosmetology. Dermatology clinic.",
    logo: "https://admin.tuvanweb.com/uploads/files/Homepage/Clients/ThuCuc.svg",
  },
  {
    name: "Vinmec",
    description: "An academic health system invested and developed by Vingroup",
    logo: "https://admin.tuvanweb.com/uploads/images/p%201.svg",
  },
  {
    name: "VinGroup",
    description: "Vietnam's multi-industry corporation in service, technology.",
    logo: "https://admin.tuvanweb.com/uploads/images/p%202.svg",
  },
  {
    name: "FPT Telecom",
    description: "Provider of telecommunications, internet, and TV service",
    logo: "https://admin.tuvanweb.com/uploads/images/p%203.svg",
  },
  {
    name: "FPT Information System",
    description: "Provider of software solutions and information technology",
    logo: "https://admin.tuvanweb.com/uploads/images/p%204.svg",
  },
  {
    name: "Happynest",
    description: "The home lovers community and online furniture shopping",
    logo: "https://admin.tuvanweb.com/uploads/images/p%205.svg",
  },
  {
    name: "Viettel Post",
    description: "Domestic and international courier services, logistics.",
    logo: "https://admin.tuvanweb.com/uploads/images/p%206.svg",
  },
  {
    name: "Edupia",
    description: "Enterprise in the field of Edtech in Vietnam",
    logo: "https://admin.tuvanweb.com/uploads/images/p%207.svg",
  },
  {
    name: "GIMO",
    description: "Fintech offers on-demand pay solutions for businesses",
    logo: "https://admin.tuvanweb.com/uploads/images/p%208.svg",
  },
  {
    name: "MB Ageas",
    description: "MB Ageas Life Insurance",
    logo: "https://admin.tuvanweb.com/uploads/images/p%209.svg",
  },
  {
    name: "ORG Group",
    description: "Providing clean agricultural products",
    logo: "https://admin.tuvanweb.com/uploads/images/p%2010.svg",
  },
  {
    name: "Aurora Vietnam",
    description: "A boutique consultant agency",
    logo: "https://admin.tuvanweb.com/uploads/images/p%2011.svg",
  },
  {
    name: "Mobifone",
    description:
      "Telecommunications – Information Technology – Digital Content",
    logo: "https://admin.tuvanweb.com/uploads/images/p%2012.svg",
  },
];

const ellipsePath =
  "M280 99C202.72 99 132.782 93.406 82.1859 84.371C56.8796 79.852 36.4612 74.481 22.3928 68.541C15.3544 65.569 9.9624 62.479 6.34613 59.323C2.7243 56.163 0.999996 53.044 0.999996 50C0.999997 46.9562 2.7243 43.8373 6.34613 40.6767C9.9624 37.5209 15.3544 34.4305 22.3928 31.459C36.4612 25.5194 56.8796 20.148 82.1859 15.6291C132.782 6.594 202.72 1 280 1C357.28 1 427.218 6.5941 477.814 15.6291C503.12 20.1481 523.539 25.5194 537.607 31.459C544.646 34.4305 550.038 37.5209 553.654 40.6767C557.276 43.8373 559 46.9562 559 50C559 53.044 557.276 56.163 553.654 59.323C550.038 62.479 544.646 65.569 537.607 68.541C523.539 74.481 503.12 79.852 477.814 84.371C427.218 93.406 357.28 99 280 99Z";

const ringOffsets = [
  62.5585, 125.117, 187.676, 250.234, 312.793, 375.351, 437.91, 500.468,
];

const ClientsSection = ({
  title = "Our\nclients",
  clients = defaultClients,
}: ClientsSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const ringRefs = useRef<SVGPathElement[]>([]);
  const ringContainerRefs = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 80,
        rotateX: -35,
        transformPerspective: 700,
        transformOrigin: "center top",
      });

      gsap.set(ringRefs.current, {
        y: 0,
      });

      // Each list item starts from 4rem down
      gsap.set(itemRefs.current, {
        paddingTop: "3.5rem",
        paddingBottom: "3.5rem",
      });

      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      introTl
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          ease: "power3.out",
        })
        .to(
          ringRefs.current,
          {
            y: (index) => ringOffsets[index],
            duration: 1.1,
            stagger: 0.045,
            ease: "power3.out",
          },
          "-=0.45",
        );

      gsap.to(ringRefs.current, {
        y: (index) => ringOffsets[index] + 20,
        ease: "none",
        scrollTrigger: {
          trigger: ringContainerRefs.current,
          start: "top 70%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Individual scroll animation for each child
      itemRefs.current.forEach((item) => {
        if (!item) return;

        gsap.fromTo(
          item,
          {
            paddingTop: "4rem",
            paddingBottom: "4rem",
          },
          {
            paddingTop: "0rem",
            paddingBottom: "0rem",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "top center",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-visible bg-neutral-900 text-neutral-0"
      data-cursor-theme="white"
      data-cursor-stretch="true"
    >
      <div
        ref={ringContainerRefs}
        className="container bg-neutral-900 pt-14 text-center md:pt-[7.5rem] xl:pt-40 mx-auto overflow-hidden"
      >
        <div
          ref={titleRef}
          className="whitespace-pre text-h7 font-medium md:text-h5"
        >
          {title}
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 560 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-6 inline-block w-[17rem] md:mt-[4.5rem] md:w-[26.25rem] xl:mt-20 xl:w-[35rem]"
        >
          <ellipse
            cx="280"
            cy="50"
            rx="50"
            ry="280"
            transform="rotate(90 280 50)"
            fill="white"
          />

          {ringOffsets.map((_, index) => (
            <path
              key={index}
              ref={(el) => {
                if (el) ringRefs.current[index] = el;
              }}
              d={ellipsePath}
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <ul className="overflow-hidden pb-4 bg-neutral-800 ">
        {clients.map((client, index) => {
          const content = (
            <div
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
              className="group relative inline-flex min-h-[5.75rem] w-full justify-center border-b border-neutral-500 bg-neutral-800 transition-colors duration-700 ease-default hover:bg-neutral-900 md:min-h-[4.5rem] lg:min-h-[5rem] xl:min-h-[6.75rem]"
            >
              <div className="container mx-auto flex justify-center">
                <div className="  flex w-full max-w-[100vw] items-center ">
                  <div className="flex h-full w-1/2 items-center">
                    <div className="relative flex h-full items-center md:pl-14 lg:pl-[6.9375rem] xl:pl-[7.625rem]">
                      <div className="pr-2 text-sm opacity-100 transition-opacity duration-700 ease-in-out group-hover:opacity-0 group-hover:duration-0 xl:text-base">
                        {client.name}
                      </div>

                      <div className="absolute left-[-1.5rem] top-1/2 flex h-12 w-36 -translate-y-1/2 items-center opacity-0 transition-opacity duration-0 ease-in-out group-hover:opacity-100 group-hover:duration-700 md:left-6 lg:left-[4.5rem] xl:left-14 xl:h-[4.25rem] xl:w-[12.75rem]">
                        {client.logo ? (
                          <Image
                            src={client.logo}
                            alt={`${client.name} logo`}
                            height={500}
                            width={500}
                            className="max-h-full max-w-full object-contain object-left"
                          />
                        ) : (
                          <span className="text-sm font-medium xl:text-base">
                            {client.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full w-1/2 items-center">
                    <div className="line-clamp-3 text-left text-sm sm:line-clamp-2 lg:line-clamp-1 xl:text-base">
                      {client.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

          return (
            <li key={`${client.name}-${index}`}>
              {client.href ? (
                <a href={client.href} target="_blank" rel="noreferrer">
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ClientsSection;
