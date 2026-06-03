"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnimationItem } from "lottie-web";

import styles from "../../../styles/StudioLifeSection.module.css";

type LottieSegment = readonly [startFrame: number, endFrame: number];

type LoopingLottieProps = {
  path: string;
  segment?: LottieSegment;
  className?: string;
};

type StudioLifeSectionProps = {
  title?: string;

  /**
   * Original source assets:
   * /lottie/Tree-full.json
   * /lottie/Studio-Tree.json
   * /lottie/Cay-leo.json
   */
  leftTreePath?: string;
  rightTreePath?: string;
  vinePath?: string;
};

/* -------------------------------------------------------------------------- */
/*                         Reusable looping SVG Lottie                         */
/* -------------------------------------------------------------------------- */

const LoopingLottie = ({
  path,
  segment,
  className = "",
}: LoopingLottieProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAnimation = async () => {
      const container = containerRef.current;

      if (!container) return;

      const lottie = (await import("lottie-web")).default;

      if (!mounted || !containerRef.current) {
        return;
      }

      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        autoplay: !segment,
        loop: !segment,
        path,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
        },
      });

      animationRef.current = animation;

      /**
       * The source plays only a defined frame section
       * for the left and right looping tree animations.
       */
      if (segment) {
        const playSegment = () => {
          animation.playSegments([...segment], true);
        };

        animation.addEventListener("DOMLoaded", playSegment);

        animation.addEventListener("complete", playSegment);
      }
    };

    loadAnimation();

    return () => {
      mounted = false;

      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [path, segment]);

  return (
    <div
      ref={containerRef}
      className={`${styles.lottieSvg} ${className}`}
      aria-hidden="true"
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                              Studio Life Section                           */
/* -------------------------------------------------------------------------- */

const StudioLifeSection = ({
  title = "Studio\nlife",
  leftTreePath = "/lottie/Tree-full.json",
  rightTreePath = "/lottie/Studio-Tree.json",
  vinePath = "/lottie/Cay-leo.json",
}: StudioLifeSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const vineContainerRef = useRef<HTMLDivElement | null>(null);

  const vineAnimationRef = useRef<AnimationItem | null>(null);

  /**
   * Load the vine Lottie separately because it is not autoplayed.
   * Its frame is controlled by scrolling.
   */
  useEffect(() => {
    let mounted = true;

    const loadVineAnimation = async () => {
      const container = vineContainerRef.current;

      if (!container) return;

      const lottie = (await import("lottie-web")).default;

      if (!mounted || !vineContainerRef.current) {
        return;
      }

      const animation = lottie.loadAnimation({
        container: vineContainerRef.current,
        renderer: "svg",
        autoplay: false,
        loop: false,
        path: vinePath,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
        },
      });

      vineAnimationRef.current = animation;

      animation.addEventListener("DOMLoaded", () => {
        animation.goToAndStop(0, true);

        ScrollTrigger.refresh();
      });
    };

    loadVineAnimation();

    return () => {
      mounted = false;

      vineAnimationRef.current?.destroy();
      vineAnimationRef.current = null;
    };
  }, [vinePath]);

  /**
   * Scroll-scrub the vine animation.
   *
   * The source uses different scroll ranges for mobile
   * and desktop. GSAP matchMedia keeps the behavior
   * responsive and recalculates the trigger after resize.
   */
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;

    if (!section) return;

    const media = gsap.matchMedia();

    const updateVineFrame = (progress: number) => {
      const animation = vineAnimationRef.current;

      if (!animation) return;

      const lastFrame = Math.max(animation.totalFrames - 1, 0);

      animation.goToAndStop(progress * lastFrame, true);
    };

    /**
     * Mobile source behavior:
     * start around top -50vh
     * end when top reaches the viewport top
     */
    media.add("(max-width: 767px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top -50%",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,

        onUpdate: (self) => {
          updateVineFrame(self.progress);
        },
      });

      return () => {
        trigger.kill();
      };
    });

    /**
     * Tablet and desktop source behavior:
     * animate while the lower part of the section
     * moves through the viewport.
     */
    media.add("(min-width: 768px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "bottom 75%",
        end: "bottom 25%",
        scrub: true,
        invalidateOnRefresh: true,

        onUpdate: (self) => {
          updateVineFrame(self.progress);
        },
      });

      return () => {
        trigger.kill();
      };
    });

    ScrollTrigger.refresh();

    return () => {
      media.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        theme__dark
        bg-neutral-900
        text-neutral-0
        min-h-screen
      "
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div
        className="
          container
          overflow-hidden
          py-12
          md:pb-[4.5rem]
          lg:pb-24
          lg:pt-16
          xl:py-0
        "
      >
        {/* ---------------------------------------------------------- */}
        {/* Centered title                                             */}
        {/* ---------------------------------------------------------- */}

        <div className="relative w-full">
          <div className={styles.content}>
            <div
              className="
                whitespace-pre-line
                text-center
                text-h4
                text-white
                font-medium
                md:text-h2
                lg:text-h1
                xl:text-h0
                mt-0
              "
            >
              {title}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Two-column tree illustration                               */}
        {/* ---------------------------------------------------------- */}

        <div className="flex pointer-events-none">
          {/* Left tree */}
          <div className="relative w-1/2">
            <LoopingLottie
              path={leftTreePath}
              segment={[57, 140]}
              className={styles.treeLeft}
            />
          </div>

          {/* Right tree and vine overlay */}
          <div className="relative w-1/2">
            <div className={styles.treeRight}>
              <LoopingLottie path={rightTreePath} segment={[60, 460]} />

              <div
                ref={vineContainerRef}
                className={styles.vineOverlay}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioLifeSection;
