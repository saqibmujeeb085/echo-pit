"use client";

import {
  MouseEvent as ReactMouseEvent,
  UIEvent,
  WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { studioPlants, type StudioPlant } from "@/data/studio-plants-data";

import styles from "../../../styles/StudioPlantsDragSection.module.css";

type StudioPlantsDragSectionProps = {
  title?: string;
  secondaryTitle?: string;
  plants?: StudioPlant[];

  /**
   * Horizontal drag sensitivity.
   * The source uses 1.
   */
  scrollMultiplier?: number;

  /**
   * Momentum after releasing the drag.
   * The source uses 20.
   */
  inertiaMultiplier?: number;
};

type DragState = {
  isGrabbing: boolean;
  isScrolling: boolean;

  /**
   * Current rendered horizontal scroll position.
   */
  x: number;

  /**
   * Desired destination used for smooth interpolation.
   */
  targetX: number;

  /**
   * Last drag movement. Used to calculate release inertia.
   */
  deltaX: number;

  /**
   * Previous requestAnimationFrame timestamp.
   */
  deltaTime: number;

  /**
   * Maximum horizontal scroll position.
   */
  scrollWidth: number;
};

const clamp = (value: number, minimum: number, maximum: number) => {
  return Math.min(Math.max(value, minimum), maximum);
};

/**
 * Smooth damping equivalent to the source interpolation.
 */
const damp = (
  current: number,
  target: number,
  smoothing: number,
  deltaTimeInSeconds: number,
) => {
  return (
    current +
    (target - current) * (1 - Math.exp(-smoothing * deltaTimeInSeconds))
  );
};

const StudioPlantsDragSection = ({
  title = "And plant\nalotsssss",
  secondaryTitle = "We are addicted to trees",
  plants = studioPlants,
  scrollMultiplier = 1,
  inertiaMultiplier = 20,
}: StudioPlantsDragSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const headingRef = useRef<HTMLDivElement | null>(null);

  const baselineRef = useRef<HTMLDivElement | null>(null);

  const animationFrameRef = useRef<number | null>(null);

  const dragStateRef = useRef<DragState>({
    isGrabbing: false,
    isScrolling: false,
    x: 0,
    targetX: 0,
    deltaX: 0,
    deltaTime: 0,
    scrollWidth: 0,
  });

  const [isGrabbing, setIsGrabbing] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const updateDragState = useCallback((nextState: Partial<DragState>) => {
    Object.assign(dragStateRef.current, nextState);
  }, []);

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = null;
    }
  }, []);

  /**
   * Smoothly move toward targetX while the user is not
   * actively holding the mouse button.
   */
  const animateScroll = useCallback(
    function animateScrollFn(timestamp: number) {
      const container = scrollContainerRef.current;

      if (!container) return;

      const state = dragStateRef.current;

      const deltaTime =
        state.deltaTime > 0 ? (timestamp - state.deltaTime) / 1000 : 0;

      state.deltaTime = timestamp;

      if (state.isGrabbing) {
        state.x = state.targetX;
      } else {
        state.x = damp(state.x, state.targetX, 5.237, deltaTime);
      }

      container.scrollTo({
        left: state.x,
      });

      const hasFinished = Math.round(state.x) === Math.round(state.targetX);

      if (hasFinished) {
        state.isScrolling = false;

        cancelAnimation();

        return;
      }

      animationFrameRef.current = requestAnimationFrame(animateScrollFn);
    },
    [cancelAnimation],
  );

  const startAnimation = useCallback(() => {
    const state = dragStateRef.current;

    if (state.isScrolling) return;

    state.isScrolling = true;

    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      state.deltaTime = timestamp;

      animateScroll(timestamp);
    });
  }, [animateScroll]);

  const updateScrollWidth = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    updateDragState({
      scrollWidth: container.scrollWidth - container.clientWidth,
    });
  }, [updateDragState]);

  /**
   * Reveal the sticky text once the section enters view.
   */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

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

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /**
   * Recalculate the horizontal drag boundary after resize.
   */
  useEffect(() => {
    updateScrollWidth();

    window.addEventListener("resize", updateScrollWidth);

    return () => {
      window.removeEventListener("resize", updateScrollWidth);

      cancelAnimation();
    };
  }, [cancelAnimation, updateScrollWidth]);

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    const container = event.currentTarget;

    cancelAnimation();

    updateDragState({
      isGrabbing: true,
      isScrolling: false,
      scrollWidth: container.scrollWidth - container.clientWidth,
      deltaX: 0,
      targetX: container.scrollLeft,
      x: container.scrollLeft,
    });

    setIsGrabbing(true);
  };

  const releaseDrag = () => {
    const state = dragStateRef.current;

    if (!state.isGrabbing) return;

    cancelAnimation();

    state.isGrabbing = false;

    state.targetX = clamp(
      state.x + state.deltaX * scrollMultiplier * inertiaMultiplier,
      0,
      state.scrollWidth,
    );

    setIsGrabbing(false);

    startAnimation();
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;

    if (!state.isGrabbing) return;

    const deltaX = -event.movementX * scrollMultiplier;

    const nextPosition = clamp(state.x + deltaX, 0, state.scrollWidth);

    updateDragState({
      targetX: nextPosition,
      deltaX,
    });

    if (nextPosition !== state.x && !state.isScrolling) {
      startAnimation();
    }
  };

  /**
   * Trackpads provide deltaX for horizontal gestures.
   *
   * The source multiplies this movement by 6.
   */
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) <= 10) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const state = dragStateRef.current;

    const deltaX = event.deltaX * scrollMultiplier * 6;

    const nextPosition = clamp(state.x + deltaX, 0, state.scrollWidth);

    updateDragState({
      targetX: nextPosition,
      deltaX,
    });

    if (nextPosition !== state.x && !state.isScrolling) {
      startAnimation();
    }
  };

  /**
   * Preserve the original visual behavior:
   *
   * - Fade the sticky copy while dragging right.
   * - Move the white baseline in the opposite direction.
   */
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const heading = headingRef.current;
    const baseline = baselineRef.current;

    if (!heading || !baseline) return;

    const scrollLeft = container.scrollLeft;

    /**
     * Keep the internal value synchronized with
     * native mobile scrolling.
     */
    if (!dragStateRef.current.isGrabbing && !dragStateRef.current.isScrolling) {
      updateDragState({
        x: scrollLeft,
        targetX: scrollLeft,
      });
    }

    const headingWidth = Math.max(heading.clientWidth, 1);

    heading.style.opacity = String(1 - clamp(scrollLeft / headingWidth, 0, 1));

    baseline.style.transform = `translateX(-${Math.min(
      scrollLeft,
      baseline.offsetLeft,
    )}px)`;
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div className={styles.sectionInner}>
        <div
          ref={scrollContainerRef}
          className={`${styles.scrollContainer} ${
            isGrabbing ? styles.isGrabbing : ""
          }`}
          data-cursor-variant="drag"
          data-cursor-theme="white"
          data-cursor-stretch="false"
          data-cursor-media=""
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={releaseDrag}
          onMouseLeave={releaseDrag}
          onMouseOver={updateScrollWidth}
          onWheel={handleWheel}
          onScroll={handleScroll}
        >
          {/* Sticky left copy */}
          <div
            ref={headingRef}
            className={`${styles.stickyHeading} ${
              isVisible ? styles.isVisible : ""
            }`}
            style={{
              perspective: "37.5rem",
            }}
          >
            <div className={`${styles.subtitle} ${styles.textRotate}`}>
              {secondaryTitle}
            </div>

            <div
              data-index="•"
              style={{
                perspective: "37.5rem",
              }}
            >
              {title.split("\n").map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  data-index={index === 0 ? "•" : undefined}
                  className={`${styles.title} ${styles.textRotate}`}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic plant cards */}
          {plants.map((plant) => (
            <div className={styles.dragItem} key={plant.id}>
              <img
                src={plant.photo}
                alt={plant.description || plant.name}
                draggable={false}
                className={styles.plantImage}
              />

              <div className={styles.plantTitle}>{plant.name}</div>
            </div>
          ))}
        </div>

        {/* Moving bottom baseline */}
        <div
          className={styles.baselineContainer}
          style={{
            maxWidth: "100%",
          }}
        >
          <div ref={baselineRef} className={styles.baseline} />
        </div>
      </div>
    </section>
  );
};

export default StudioPlantsDragSection;
