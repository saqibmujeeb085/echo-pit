"use client";

import {
  ComponentPropsWithoutRef,
  MouseEvent as ReactMouseEvent,
  UIEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type HorizontalDragScrollProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "onWheel"
> & {
  /**
   * Mouse drag sensitivity.
   * Original source value: 1.
   */
  scrollMultiplier?: number;

  /**
   * Release momentum strength.
   * Original source value: 20.
   */
  inertiaMultiplier?: number;
};

type DragState = {
  isScrolling: boolean;
  isGrabbing: boolean;
  x: number;
  targetX: number;
  deltaX: number;
  deltaTime: number;
  scrollWidth: number;
};

const damp = (
  current: number,
  target: number,
  smoothing: number,
  deltaTime: number,
) => {
  return current + (target - current) * (1 - Math.exp(-smoothing * deltaTime));
};

const clamp = (value: number, minimum: number, maximum: number) => {
  return Math.min(Math.max(value, minimum), maximum);
};

const HorizontalDragScroll = forwardRef<
  HTMLDivElement,
  HorizontalDragScrollProps
>(
  (
    {
      children,
      className = "",
      scrollMultiplier = 1,
      inertiaMultiplier = 20,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseOver,
      onScroll,
      ...rest
    },
    forwardedRef,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const animationFrameRef = useRef<number | null>(null);

    const [isGrabbing, setIsGrabbing] = useState(false);

    const stateRef = useRef<DragState>({
      isScrolling: false,
      isGrabbing: false,
      x: 0,
      targetX: 0,
      deltaX: 0,
      deltaTime: 0,
      scrollWidth: 0,
    });

    useImperativeHandle(
      forwardedRef,
      () => containerRef.current as HTMLDivElement,
    );

    const cancelAnimation = useCallback(() => {
      if (animationFrameRef.current === null) {
        return;
      }

      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = null;
    }, []);

    const renderScroll = useCallback(
      (timestamp: number) => {
        const container = containerRef.current;

        if (!container) return;

        const state = stateRef.current;

        const deltaTime = (timestamp - state.deltaTime) / 1000;

        state.deltaTime = timestamp;

        if (state.isGrabbing) {
          state.x = state.targetX;
        } else {
          /**
           * Original source damping value: 5.237
           */
          state.x = damp(state.x, state.targetX, 5.237, deltaTime);
        }

        container.scrollTo({
          left: state.x,
        });

        if (Math.round(state.x) === Math.round(state.targetX)) {
          state.x = state.targetX;
          state.isScrolling = false;

          cancelAnimation();

          return;
        }

        animationFrameRef.current = requestAnimationFrame(renderScroll);
      },
      [cancelAnimation],
    );

    const startAnimation = useCallback(() => {
      const state = stateRef.current;

      if (state.isScrolling) return;

      state.isScrolling = true;

      animationFrameRef.current = requestAnimationFrame((timestamp) => {
        state.deltaTime = timestamp;

        renderScroll(timestamp);
      });
    }, [renderScroll]);

    const updateScrollWidth = useCallback(() => {
      const container = containerRef.current;

      if (!container) return;

      stateRef.current.scrollWidth =
        container.scrollWidth - container.clientWidth;
    }, []);

    const releaseDrag = useCallback(() => {
      const state = stateRef.current;

      if (!state.isGrabbing) return;

      cancelAnimation();

      state.isGrabbing = false;

      state.targetX = Math.max(
        0,
        state.x + state.deltaX * scrollMultiplier * inertiaMultiplier,
      );

      setIsGrabbing(false);

      startAnimation();
    }, [cancelAnimation, inertiaMultiplier, scrollMultiplier, startAnimation]);

    /**
     * Trackpad horizontal wheel support.
     *
     * Original source:
     * - only responds when abs(deltaX) > 10
     * - multiplies horizontal movement by 6
     * - uses passive: false
     */
    useEffect(() => {
      const container = containerRef.current;

      if (!container) return;

      const handleWheel = (event: WheelEvent) => {
        if (Math.abs(event.deltaX) <= 10) {
          return;
        }

        event.stopPropagation();
        event.preventDefault();

        const state = stateRef.current;

        const deltaX = event.deltaX * scrollMultiplier * 6;

        const nextX = clamp(state.x + deltaX, 0, state.scrollWidth);

        state.targetX = nextX;
        state.deltaX = deltaX;

        if (nextX !== state.x && !state.isScrolling) {
          startAnimation();
        }
      };

      container.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }, [scrollMultiplier, startAnimation]);

    useEffect(() => {
      updateScrollWidth();

      window.addEventListener("resize", updateScrollWidth);

      window.addEventListener("mouseup", releaseDrag);

      return () => {
        cancelAnimation();

        window.removeEventListener("resize", updateScrollWidth);

        window.removeEventListener("mouseup", releaseDrag);
      };
    }, [cancelAnimation, releaseDrag, updateScrollWidth]);

    const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
      const container = event.currentTarget;
      const state = stateRef.current;

      cancelAnimation();

      state.isGrabbing = true;
      state.isScrolling = false;
      state.scrollWidth = container.scrollWidth - container.clientWidth;
      state.deltaX = 0;
      state.targetX = container.scrollLeft;
      state.x = container.scrollLeft;

      setIsGrabbing(true);

      onMouseDown?.(event);
    };

    const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
      const state = stateRef.current;

      if (!state.isGrabbing) {
        onMouseMove?.(event);

        return;
      }

      const deltaX = -event.movementX * scrollMultiplier;

      const nextX = clamp(state.x + deltaX, 0, state.scrollWidth);

      state.targetX = nextX;
      state.deltaX = deltaX;

      if (nextX !== state.x && !state.isScrolling) {
        startAnimation();
      }

      onMouseMove?.(event);
    };

    const handleMouseUp = (event: ReactMouseEvent<HTMLDivElement>) => {
      releaseDrag();

      onMouseUp?.(event);
    };

    const handleMouseOver = (event: ReactMouseEvent<HTMLDivElement>) => {
      updateScrollWidth();

      onMouseOver?.(event);
    };

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
      const state = stateRef.current;

      /**
       * Keep native touch scrolling synchronized.
       */
      if (!state.isGrabbing && !state.isScrolling) {
        state.x = event.currentTarget.scrollLeft;
        state.targetX = event.currentTarget.scrollLeft;
      }

      onScroll?.(event);
    };

    return (
      <div
        {...rest}
        ref={containerRef}
        className={`${
          isGrabbing ? "cursor-grabbing" : "cursor-grab"
        } ${className}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOver={handleMouseOver}
        onScroll={handleScroll}
      >
        {children}
      </div>
    );
  },
);

HorizontalDragScroll.displayName = "HorizontalDragScroll";

export default HorizontalDragScroll;
