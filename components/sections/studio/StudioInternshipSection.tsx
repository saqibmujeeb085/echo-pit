"use client";

import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type { AnimationItem } from "lottie-web";

import styles from "../../../styles/StudioInternshipSection.module.css";

type AnimationSegment = [startFrame: number, endFrame: number];

type BrushAnimation = AnimationItem & {
  /**
   * Available on lottie-web AnimationItem at runtime.
   * Used by the original interaction logic.
   */
  isPaused: boolean;
};

type BrushLayer = {
  path: string;
  dataIndex?: number;
  isBaseLayer?: boolean;
};

type StudioInternshipSectionProps = {
  title?: string;
  buttonLabel?: string;
  internshipHref?: string;

  /**
   * Keep the default values to preserve the source animation.
   * Override only when you have replacement Lottie files.
   */
  brushLayers?: BrushLayer[];
};

const INITIAL_SEGMENT: AnimationSegment = [180, 360];

const CLICK_SEGMENTS: AnimationSegment[] = [
  [0, 180],
  [180, 360],
];

const defaultBrushLayers: BrushLayer[] = [
  {
    path: "/lottie/Brush-4.json",
    dataIndex: 4,
    isBaseLayer: true,
  },
  {
    path: "/lottie/Brush-2.json",
    dataIndex: 3,
  },
  {
    path: "/lottie/Brush-3.json",
    dataIndex: 2,
  },
  {
    path: "/lottie/Brush-1.json",
  },
];

const StudioInternshipSection = ({
  title = "We train ourselves to find new members through Pit Internship Journey (the UX/UI internship program at Pit Studio)",
  buttonLabel = "See Internship Program",
  internshipHref = "https://internship.pitstudio.co/",
  brushLayers = defaultBrushLayers,
}: StudioInternshipSectionProps) => {
  /**
   * DOM containers that receive generated inline SVG output
   * from the Lottie renderer.
   */
  const layerContainerRefs = useRef<Array<HTMLDivElement | null>>([]);

  /**
   * Loaded animation controllers.
   */
  const animationRefs = useRef<Array<BrushAnimation | null>>([]);

  /**
   * Load all four SVG Lottie layers.
   *
   * The original section autoplays frames 180–360
   * once and keeps looping disabled.
   */
  useEffect(() => {
    let mounted = true;

    const createdAnimations: BrushAnimation[] = [];

    const loadAnimations = async () => {
      const lottie = (await import("lottie-web")).default;

      if (!mounted) return;

      brushLayers.forEach((layer, index) => {
        const container = layerContainerRefs.current[index];

        if (!container) return;

        const animation = lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: layer.path,
          initialSegment: [...INITIAL_SEGMENT],
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
          },
        }) as BrushAnimation;

        animationRefs.current[index] = animation;

        createdAnimations.push(animation);
      });
    };

    loadAnimations();

    return () => {
      mounted = false;

      createdAnimations.forEach((animation) => {
        animation.destroy();
      });

      animationRefs.current = [];
    };
  }, [brushLayers]);

  /**
   * Original click sequence:
   *
   * Normal layer array:
   * Brush-4 → Brush-2 → Brush-3 → Brush-1
   *
   * Playback search order:
   * Brush-1 → Brush-3 → Brush-2 → Brush-4
   *
   * The first paused animation is played.
   * When none are paused, reset all layers and restart Brush-1.
   */
  const playNextBrushLayer = useCallback(() => {
    const normalOrder = animationRefs.current;

    const reversedOrder = [...normalOrder].reverse();

    /**
     * Wait until every Lottie animation has loaded.
     */
    if (reversedOrder.some((animation) => !animation)) {
      return;
    }

    const nextPausedLayer = reversedOrder.find(
      (animation) => animation?.isPaused,
    );

    if (nextPausedLayer) {
      nextPausedLayer.playSegments(CLICK_SEGMENTS, true);

      return;
    }

    /**
     * All layers have played.
     * Reset everything and restart from Brush-1.
     */
    reversedOrder.forEach((animation) => {
      animation?.resetSegments(true);
      animation?.pause();
    });

    const brushOneAnimation = normalOrder[normalOrder.length - 1];

    brushOneAnimation?.playSegments(CLICK_SEGMENTS, true);
  }, []);

  const handleIllustrationMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    /**
     * Ignore right-clicks.
     */
    if (event.button !== 0) return;

    playNextBrushLayer();
  };

  const handleIllustrationKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();

    playNextBrushLayer();
  };

  return (
    <section
      className={styles.section}
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div className={`container ${styles.container}`}>
        {/* -------------------------------------------------- */}
        {/* Left content                                       */}
        {/* -------------------------------------------------- */}

        <div className={styles.left}>
          <div className="text-base font-medium md:text-h8 lg:text-h7 xl:text-h6">
            {title}
          </div>

          <a
            href={internshipHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
          >
            <span className={styles.ctaRipple} />

            <span className={styles.ctaLabel}>{buttonLabel}</span>
          </a>
        </div>

        {/* -------------------------------------------------- */}
        {/* Interactive layered illustration                   */}
        {/* -------------------------------------------------- */}

        <div
          className={styles.right}
          data-cursor-variant="text"
          data-cursor-theme="dark"
          data-cursor-stretch="true"
          data-cursor-text="Click me"
          data-cursor-media=""
          role="button"
          tabIndex={0}
          aria-label="Play internship illustration animation"
          onMouseDown={handleIllustrationMouseDown}
          onKeyDown={handleIllustrationKeyDown}
        >
          {brushLayers.map((layer, index) => {
            const isBaseLayer = layer.isBaseLayer || index === 0;

            return (
              <div
                key={layer.path}
                ref={(element) => {
                  layerContainerRefs.current[index] = element;
                }}
                data-index={layer.dataIndex}
                className={
                  isBaseLayer
                    ? styles.illustrationBase
                    : styles.illustrationLayer
                }
                aria-hidden="true"
              />
            );
          })}
        </div>

        {/* -------------------------------------------------- */}
        {/* Mobile-only control                                */}
        {/* -------------------------------------------------- */}

        <button
          type="button"
          className={styles.mobileTap}
          onClick={playNextBrushLayer}
        >
          Tap here
        </button>
      </div>
    </section>
  );
};

export default StudioInternshipSection;
