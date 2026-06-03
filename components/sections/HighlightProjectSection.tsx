"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnimationItem } from "lottie-web";

type HighlightProjectSectionProps = {
  title?: string[];
  lottiePath?: string;
};

const HighlightProjectSection = ({
  title = ["Our", "highlight", "project"],
  lottiePath = "/lottie/Home-OurHighlight.json",
}: HighlightProjectSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const lottieRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let mounted = true;

    const ctx = gsap.context(() => {
      /**
       * This is the main title movement.
       * It matches the original style:
       * transform: translateY(0%) -> translateY(70%)
       */
      gsap.fromTo(
        titleRef.current,
        {
          yPercent: 0,
        },
        {
          yPercent: 70,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom 20%",
            scrub: true,
            invalidateOnRefresh: true,

            // Enable for debugging only:
            // markers: true,
          },
        },
      );
    }, sectionRef);

    const loadLottie = async () => {
      if (!lottieRef.current) return;

      const lottie = (await import("lottie-web")).default;

      if (!mounted || !lottieRef.current) return;

      animationRef.current = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: lottiePath,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      });

      animationRef.current.addEventListener("DOMLoaded", () => {
        const playhead = { frame: 0 };
        const totalFrames = animationRef.current?.totalFrames || 70;

        gsap.to(playhead, {
          frame: totalFrames - 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            animationRef.current?.goToAndStop(playhead.frame, true);
          },
        });

        ScrollTrigger.refresh();
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
      className="relative h-[30rem] overflow-hidden bg-neutral-0 md:h-[48rem] lg:h-[42.75rem] xl:h-[67.5rem]"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div
        ref={containerRef}
        className="relative h-full overflow-visible bg-neutral-0"
      >
        {/* 1. Absolute animation layer */}
        <div
          ref={lottieRef}
          className="pointer-events-none absolute top-0 h-full w-full"
        />

        {/* 2. Title layer */}
        <div className="relative flex h-full flex-col text-neutral-0 mix-blend-difference">
          <div
            ref={titleRef}
            className="mx-auto h-full pt-[10%] text-center text-[3.5rem] font-medium leading-[7rem] [perspective:37.5rem] md:text-h5 xl:text-h3"
          >
            {title.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>

        {/* 3. SVG overlay layer */}
        <div
          title=""
          role="button"
          aria-label="animation"
          className="pointer-events-none text-neutral-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1920 1080"
            width="1920"
            height="1080"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <g transform="matrix(0.5,0,0,0.5,599,717)" opacity="1">
              <g transform="matrix(1,0,0,1,723,95)" opacity="1">
                <g opacity="1" transform="matrix(2,0,0,2,0,0)">
                  <path
                    fill="currentColor"
                    fillOpacity="1"
                    d="M 361.5 450 L 361.5 0 C 361.5 26.2153 199.5119 47.5 0 47.5 C -199.5119 47.5 -361.5 26.2153 -361.5 0 L -361.5 450 z"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HighlightProjectSection;
