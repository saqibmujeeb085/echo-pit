"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ServiceItem = {
  title: string;
  href: string;
};

type ServicesSectionProps = {
  heading?: string;
  services?: ServiceItem[];
};

const defaultServices: ServiceItem[] = [
  {
    title: "UX/UI Design",
    href: "/services",
  },
  {
    title: "Web, App Development",
    href: "/services",
  },
  {
    title: "Illustration",
    href: "/services",
  },
  {
    title: "Interaction",
    href: "/services",
  },
];

const itemIndentClasses = [
  "md:pl-0",
  "md:pl-[4.5rem] lg:pl-24 xl:pl-[7.625rem]",
  "md:pl-36 lg:pl-48 xl:pl-[15.25rem]",
  "md:pl-[13.5rem] lg:pl-72 xl:pl-[22.875rem]",
];

const ServicesSection = ({
  heading = "Our services.",
  services = defaultServices,
}: ServicesSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, {
        opacity: 0,
        y: "3rem",
      });

      gsap.set(itemRefs.current, {
        opacity: 0,
        y: "4rem",
      });

      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
      });

      itemRefs.current.forEach((item) => {
        if (!item) return;

        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-neutral-0 text-neutral-800"
      data-cursor-theme="dark"
      data-cursor-stretch="true"
    >
      <div className="container font-medium">
        <h6
          ref={headingRef}
          className="mt-12 text-3xl md:mt-20 lg:mt-24 lg:text-[2.625rem] lg:leading-[3rem] xl:mt-40 xl:text-h6"
        >
          {heading}
        </h6>

        <div className="mt-10 mb-12 space-y-6 md:mt-12 md:mb-28 md:space-y-10 lg:mt-14 lg:mb-[7.5rem] lg:space-y-12 xl:mt-16 xl:mb-[13.5rem] xl:space-y-14">
          {services.map((service, index) => {
            const count = String(index + 1).padStart(2, "0");

            return (
              <div
                key={`${service.title}-${index}`}
                ref={(el) => {
                  if (el) itemRefs.current[index] = el;
                }}
                className={`group flex ${itemIndentClasses[index] ?? ""}`}
              >
                <span className="mr-2 mt-1.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-neutral-800 text-[0.625rem] leading-3 transition-colors duration-700 ease-default group-hover:bg-neutral-800 group-hover:text-neutral-0 md:mr-3 md:mt-3.5 md:size-6 md:text-tn lg:mr-4 lg:mt-[1.375rem] lg:size-7 xl:mr-6 xl:mt-8 xl:size-10 xl:text-sm">
                  {count}
                </span>

                <div className="text-4xl md:text-h5 lg:text-h3 xl:text-h1">
                  <Link
                    href={service.href}
                    className="inline-block transition-opacity duration-500 hover:opacity-70"
                    data-cursor-variant="media"
                    data-cursor-stretch="true"
                  >
                    {service.title}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
