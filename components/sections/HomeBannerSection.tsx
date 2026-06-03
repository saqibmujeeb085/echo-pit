"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { AnimationItem } from "lottie-web";

type HomeBannerSectionProps = {
  title?: string[];
  description?: string;
  services?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  lottiePath?: string;
};

const ArrowIcon = () => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
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

const HomeBannerSection = ({
  title = ["Transforming", "Digital Product"],
  description = "Lets us help you do",
  services = ["UX/UI Design", "Web, App Development"],
  ctaLabel = "Work With Us",
  ctaHref = "/contact",
  lottiePath = "/lottie/Home-HeroBanner-1.json",
}: HomeBannerSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const lottieRef = useRef<HTMLDivElement | null>(null);
  const titleLineRefs = useRef<HTMLParagraphElement[]>([]);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const serviceRefs = useRef<HTMLSpanElement[]>([]);
  const workRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    let mounted = true;

    const ctx = gsap.context(() => {
      gsap.set(imageWrapRef.current, {
        opacity: 0,
      });

      gsap.set(titleLineRefs.current, {
        opacity: 0,
        yPercent: 90,
        z: -10,
        rotateX: -60,
        transformPerspective: 700,
        transformOrigin: "center bottom",
      });

      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 80,
      });

      gsap.set(serviceRefs.current, {
        opacity: 0,
        y: 80,
      });

      gsap.set(workRef.current, {
        opacity: 0,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.to(imageWrapRef.current, {
        opacity: 1,
        duration: 0.8,
        delay: 0.15,
      })
        .to(
          titleLineRefs.current,
          {
            opacity: 1,
            yPercent: 0,
            z: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.1,
          },
          "-=0.45",
        )
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
          },
          "-=0.35",
        )
        .to(
          serviceRefs.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.06,
          },
          "-=0.75",
        )
        .to(
          workRef.current,
          {
            opacity: 1,
            duration: 0.7,
          },
          "-=0.45",
        );
    }, sectionRef);

    const loadLottie = async () => {
      if (!lottieRef.current) return;

      const lottie = (await import("lottie-web")).default;

      if (!mounted || !lottieRef.current) return;

      animationRef.current = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: lottiePath,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
        },
      });
    };

    loadLottie();

    return () => {
      mounted = false;
      ctx.revert();
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [lottiePath]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-0 text-neutral-800"
    >
      <div className="container relative flex max-w-[100vw] pt-8 pb-[21.5rem] md:pt-20 lg:pt-28 lg:pb-[9.875rem] xl:pb-50">
        {/* Right / Bottom Lottie Image */}
        <div
          ref={imageWrapRef}
          className="absolute bottom-0 left-1/2 flex w-full -translate-x-1/2 cursor-pointer transition-opacity duration-700 md:left-auto md:right-0 md:w-auto md:translate-x-0 lg:top-0 lg:bottom-0 lg:right-[-2rem] lg:h-full lg:items-center xl:right-[-5rem] 2xl:right-0"
          data-cursor-variant="text"
          data-cursor-theme="dark"
          data-cursor-stretch="true"
          data-cursor-text="Click me"
          data-cursor-media=""
        >
          <div
            ref={lottieRef}
            className="aspect-square h-[25rem] md:h-[32rem] lg:h-[32.75rem] xl:h-[56.25rem]"
          />
        </div>

        {/* Left Content */}
        <div className="relative z-10">
          <h2 className="text-h7 font-bold md:text-h5 xl:text-h2">
            {title.map((line, index) => (
              <p
                key={`${line}-${index}`}
                ref={(el) => {
                  if (el) titleLineRefs.current[index] = el;
                }}
                className="origin-bottom"
              >
                {line}
              </p>
            ))}
          </h2>

          <div className="mt-8 xl:mt-12">
            <div ref={descriptionRef} className="text-xs xl:text-sm">
              {description}
            </div>

            <div className="mt-3 text-sm xl:mt-5 xl:text-lg">
              {services.map((service, index) => (
                <span
                  key={service}
                  ref={(el) => {
                    if (el) serviceRefs.current[index] = el;
                  }}
                  className="mr-6 inline-block xl:mr-[4.5rem]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div
            ref={workRef}
            className="mt-9 flex items-center capitalize font-bold xl:mt-[4.5rem]"
          >
            <a href={ctaHref}>
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
                <span className="text-base md:text-lg">{ctaLabel}</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBannerSection;
