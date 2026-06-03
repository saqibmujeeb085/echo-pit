"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

type LottieSvgProps = {
  path: string;
  className?: string;
};

type StudioWaySectionProps = {
  label?: string;
  firstText?: string;
  secondText?: string;
  firstIconPath?: string;
  secondIconPath?: string;
};

/**
 * Inline SVG Lottie renderer.
 *
 * The original page renders the Lottie animation as a <span>
 * positioned directly inside the text line.
 */
const LottieSvg = ({ path, className = "" }: LottieSvgProps) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);

  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadLottie = async () => {
      const container = containerRef.current;

      if (!container) return;

      const lottie = (await import("lottie-web")).default;

      if (!mounted || !containerRef.current) {
        return;
      }

      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        autoplay: true,
        loop: true,
        path,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
        },
      });
    };

    loadLottie();

    return () => {
      mounted = false;

      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [path]);

  return <span ref={containerRef} className={className} aria-hidden="true" />;
};

const StudioWaySection = ({
  label = "The way we are going",
  firstText = "We love what we do, be creative ",
  secondText = " & unique, and never stop improving",
  firstIconPath = "/lottie/Studio-Icon-1.json",
  secondIconPath = "/lottie/Studio-Icon-2.json",
}: StudioWaySectionProps) => {
  return (
    <section
      className="
        theme__dark
        bg-neutral-900
        text-white
        container
        relative
        pb-[5.25rem]
        pt-16
        md:pb-[5.75rem]
        lg:pb-[6.625rem]
        lg:pt-20
        xl:py-32
      "
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      {/* Small introductory text */}
      <div
        className="
          text-base
          lg:text-[1.3125rem]
          lg:leading-[1.875rem]
          xl:text-xl
        "
      >
        {label}
      </div>

      {/* Main statement */}
      <p
        className="
          mt-4
          max-w-7xl
          text-h7
          font-medium
          md:text-h6
          lg:mt-6
          lg:text-h5
          xl:mt-8
          xl:text-h3
        "
      >
        <span>{firstText}</span>

        <LottieSvg
          path={firstIconPath}
          className="
            inline-block
            aspect-square
            h-12
            align-middle
            md:h-16
            lg:h-20
            xl:h-[7.5rem]
          "
        />

        <span>{secondText}</span>

        <LottieSvg
          path={secondIconPath}
          className="
            ml-4
            inline-block
            aspect-square
            h-12
            align-middle
            md:h-16
            lg:h-20
            xl:ml-10
            xl:h-[7.5rem]
          "
        />
      </p>
    </section>
  );
};

export default StudioWaySection;
