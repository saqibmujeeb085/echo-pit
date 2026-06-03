"use client";

import {
  PointerEvent as ReactPointerEvent,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  studioTravelBottomRow,
  studioTravelStops,
  studioTravelTopRow,
  type StudioTravelImage,
  type StudioTravelStop,
} from "@/data/studio-traveling-data";

import styles from "../../../styles/StudioTravelingSection.module.css";

type StudioTravelingSectionProps = {
  secondaryTitle?: string;
  title?: string;

  topRow?: StudioTravelImage[];
  bottomRow?: StudioTravelImage[];
  stops?: StudioTravelStop[];

  /**
   * Desktop mouse-drag sensitivity.
   * Keep this at 1 to match the shared Studio sections.
   */
  dragMultiplier?: number;

  /**
   * Momentum after releasing the pointer.
   */
  inertiaMultiplier?: number;
};

type DragState = {
  isDragging: boolean;
  isAnimating: boolean;

  currentX: number;
  targetX: number;
  velocityX: number;

  maximumX: number;
  previousPointerX: number;
  previousTime: number;
};

const clamp = (value: number, minimum: number, maximum: number) => {
  return Math.min(Math.max(value, minimum), maximum);
};

const damp = (
  current: number,
  target: number,
  smoothing: number,
  deltaTime: number,
) => {
  return current + (target - current) * (1 - Math.exp(-smoothing * deltaTime));
};

const StudioTravelingSection = ({
  secondaryTitle = "Anddddd",
  title = "Traveling",
  topRow = studioTravelTopRow,
  bottomRow = studioTravelBottomRow,
  stops = studioTravelStops,
  dragMultiplier = 1,
  inertiaMultiplier = 20,
}: StudioTravelingSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const imageRefs = useRef<HTMLImageElement[]>([]);

  const animationFrameRef = useRef<number | null>(null);

  const parallaxFrameRef = useRef<number | null>(null);

  const [isTitleVisible, setIsTitleVisible] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef<DragState>({
    isDragging: false,
    isAnimating: false,

    currentX: 0,
    targetX: 0,
    velocityX: 0,

    maximumX: 0,
    previousPointerX: 0,
    previousTime: 0,
  });

  /* ---------------------------------------------------------------------- */
  /*                          Utility functions                             */
  /* ---------------------------------------------------------------------- */

  const registerImage = useCallback((element: HTMLImageElement | null) => {
    if (!element) return;

    if (imageRefs.current.includes(element)) {
      return;
    }

    imageRefs.current.push(element);
  }, []);

  const updateMaximumScroll = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    dragStateRef.current.maximumX = Math.max(
      container.scrollWidth - container.clientWidth,
      0,
    );
  }, []);

  /**
   * Recreates the source's data-z image movement.
   *
   * Images closer to the horizontal viewport edges translate
   * according to their depth. The translation is clamped so
   * it never exceeds the configured data-z value.
   */
  const updateImageParallax = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const containerBounds = container.getBoundingClientRect();

    const viewportCenter = containerBounds.left + container.clientWidth / 2;

    const viewportRadius = Math.max(container.clientWidth / 2, 1);

    imageRefs.current.forEach((image) => {
      const depth = Number(image.dataset.z ?? 0);

      if (!depth) {
        image.style.transform = "translate3d(0px, 0px, 0px)";

        image.style.zIndex = "0";

        return;
      }

      const bounds = image.getBoundingClientRect();

      const imageCenter = bounds.left + bounds.width / 2;

      const normalizedDistance =
        (imageCenter - viewportCenter) / viewportRadius;

      const translateX = clamp(normalizedDistance * depth, -depth, depth);

      image.style.transform = `translate3d(${translateX}px, 0px, 0px)`;

      image.style.zIndex = String(depth);
    });
  }, []);

  const requestParallaxUpdate = useCallback(() => {
    if (parallaxFrameRef.current) {
      cancelAnimationFrame(parallaxFrameRef.current);
    }

    parallaxFrameRef.current = requestAnimationFrame(() => {
      updateImageParallax();
    });
  }, [updateImageParallax]);

  const stopMomentumAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = null;
    }

    dragStateRef.current.isAnimating = false;
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                      Momentum-based horizontal scroll                  */
  /* ---------------------------------------------------------------------- */

  const animateMomentumRef = useRef<((timestamp: number) => void) | null>(null);

  const animateMomentum = useCallback(
    (timestamp: number) => {
      const container = scrollContainerRef.current;

      const state = dragStateRef.current;

      if (!container) return;

      const deltaTime =
        state.previousTime > 0 ? (timestamp - state.previousTime) / 1000 : 0;

      state.previousTime = timestamp;

      state.currentX = damp(state.currentX, state.targetX, 5.237, deltaTime);

      container.scrollLeft = state.currentX;

      requestParallaxUpdate();

      const isComplete = Math.abs(state.currentX - state.targetX) < 0.5;

      if (isComplete) {
        state.currentX = state.targetX;

        container.scrollLeft = state.targetX;

        state.isAnimating = false;

        animationFrameRef.current = null;

        requestParallaxUpdate();

        return;
      }

      animationFrameRef.current = requestAnimationFrame(
        animateMomentumRef.current!,
      );
    },
    [requestParallaxUpdate],
  );

  useEffect(() => {
    animateMomentumRef.current = animateMomentum;
  }, [animateMomentum]);

  const startMomentumAnimation = useCallback(() => {
    const state = dragStateRef.current;

    if (state.isAnimating) return;

    state.isAnimating = true;
    state.previousTime = 0;

    animationFrameRef.current = requestAnimationFrame(animateMomentum);
  }, [animateMomentum]);

  /* ---------------------------------------------------------------------- */
  /*                              Pointer drag                              */
  /* ---------------------------------------------------------------------- */

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    /**
     * Keep native touch scrolling intact.
     * Custom pointer dragging is only needed for a mouse or pen.
     */
    if (event.pointerType === "touch") {
      return;
    }

    const container = event.currentTarget;

    updateMaximumScroll();
    stopMomentumAnimation();

    container.setPointerCapture(event.pointerId);

    const state = dragStateRef.current;

    state.isDragging = true;
    state.currentX = container.scrollLeft;
    state.targetX = container.scrollLeft;
    state.velocityX = 0;
    state.previousPointerX = event.clientX;

    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;

    const state = dragStateRef.current;

    if (!container || !state.isDragging) {
      return;
    }

    const pointerDelta = event.clientX - state.previousPointerX;

    state.previousPointerX = event.clientX;

    const scrollDelta = -pointerDelta * dragMultiplier;

    state.velocityX = scrollDelta;

    state.currentX = clamp(state.currentX + scrollDelta, 0, state.maximumX);

    state.targetX = state.currentX;

    container.scrollLeft = state.currentX;

    requestParallaxUpdate();
  };

  const releasePointer = (event?: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;

    if (!state.isDragging) return;

    if (event && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    state.isDragging = false;

    state.targetX = clamp(
      state.currentX + state.velocityX * inertiaMultiplier,
      0,
      state.maximumX,
    );

    setIsDragging(false);

    startMomentumAnimation();
  };

  /* ---------------------------------------------------------------------- */
  /*                      Horizontal trackpad movement                      */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      /**
       * Preserve regular vertical page scrolling.
       * Only capture intentional horizontal trackpad gestures.
       */
      if (Math.abs(event.deltaX) <= 10) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      updateMaximumScroll();

      const state = dragStateRef.current;

      const deltaX = event.deltaX * dragMultiplier * 6;

      state.targetX = clamp(state.targetX + deltaX, 0, state.maximumX);

      state.velocityX = deltaX;

      startMomentumAnimation();
    };

    container.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [dragMultiplier, startMomentumAnimation, updateMaximumScroll]);

  /* ---------------------------------------------------------------------- */
  /*                       Native touch-scroll syncing                       */
  /* ---------------------------------------------------------------------- */

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;

    /**
     * Keep native touch scrolling synchronized with
     * the custom momentum state.
     */
    if (!state.isDragging && !state.isAnimating) {
      state.currentX = event.currentTarget.scrollLeft;

      state.targetX = event.currentTarget.scrollLeft;
    }

    requestParallaxUpdate();
  };

  /* ---------------------------------------------------------------------- */
  /*                          Title entrance reveal                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsTitleVisible(true);

        observer.disconnect();
      },
      {
        threshold: 0.14,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                        Initial measurement cleanup                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    updateMaximumScroll();

    const handleResize = () => {
      updateMaximumScroll();
      requestParallaxUpdate();
    };

    window.addEventListener("resize", handleResize);

    window.addEventListener("load", handleResize);

    requestParallaxUpdate();

    return () => {
      stopMomentumAnimation();

      if (parallaxFrameRef.current) {
        cancelAnimationFrame(parallaxFrameRef.current);
      }

      window.removeEventListener("resize", handleResize);

      window.removeEventListener("load", handleResize);
    };
  }, [requestParallaxUpdate, stopMomentumAnimation, updateMaximumScroll]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      {/* -------------------------------------------------------------- */}
      {/* Heading                                                        */}
      {/* -------------------------------------------------------------- */}

      <div
        className={`container whitespace-pre select-none ${
          isTitleVisible ? styles.rotateShow : ""
        }`}
      >
        <div>
          <div className={styles.titleContainer}>
            <div className={`${styles.subtitle} ${styles.textRotate}`}>
              {secondaryTitle}
            </div>
          </div>
        </div>

        <div>
          <div className={styles.titleContainer}>
            <div
              data-index="•••"
              className={`${styles.title} ${styles.textRotate}`}
              style={{
                transitionDelay: "100ms",
              }}
            >
              {title}
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Horizontal travel gallery                                      */}
      {/* -------------------------------------------------------------- */}

      <div className={styles.galleryOuter}>
        <div
          ref={scrollContainerRef}
          className={`container ${styles.scrollContainer} ${
            isDragging ? styles.isDragging : ""
          }`}
          data-cursor-variant="drag"
          data-cursor-theme="white"
          data-cursor-stretch="false"
          data-cursor-media=""
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={releasePointer}
          onPointerCancel={releasePointer}
          onScroll={handleScroll}
        >
          <div className={styles.galleryContent}>
            {/* First image row */}
            <div className={styles.topRow}>
              {topRow.map((image, index) => (
                <div className={styles.topItem} key={image.id}>
                  <img
                    ref={registerImage}
                    src={image.src}
                    alt={image.alt}
                    draggable={false}
                    data-z={image.depth}
                    className={styles.travelImage}
                    onLoad={() => {
                      updateMaximumScroll();
                      requestParallaxUpdate();
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Location markers */}
            <div className={styles.stopRow}>
              {stops.map((stop) => (
                <div
                  className={styles.travelStop}
                  style={
                    {
                      "--travel-index": stop.widthIndex,
                    } as React.CSSProperties
                  }
                  key={stop.id}
                >
                  <img
                    src={stop.icon}
                    alt=""
                    className={styles.stopIcon}
                    draggable={false}
                  />

                  <span>{stop.label}</span>
                </div>
              ))}
            </div>

            {/* Second image row */}
            <div className={styles.bottomRow}>
              {bottomRow.map((image) => (
                <div className={styles.bottomItem} key={image.id}>
                  <img
                    ref={registerImage}
                    src={image.src}
                    alt={image.alt}
                    draggable={false}
                    data-z={image.depth}
                    className={styles.travelImage}
                    onLoad={() => {
                      updateMaximumScroll();
                      requestParallaxUpdate();
                    }}
                  />
                </div>
              ))}

              <div className={styles.trailingSpace} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioTravelingSection;
