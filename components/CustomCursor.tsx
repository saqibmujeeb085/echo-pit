"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

type CursorVariant =
  | "default"
  | "text"
  | "play"
  | "drag"
  | "project"
  | "project-mini"
  | "close"
  | "media";

type CursorTheme = "dark" | "white" | "primary";

const ArrowIcon = ({ className = "h-12 w-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M37 11L11 37" stroke="currentColor" strokeWidth="4" />
    <path
      d="M13.4941 11H36.9482V34.4541"
      stroke="currentColor"
      strokeWidth="4"
    />
  </svg>
);

const PlayIcon = () => (
  <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
    <path d="M36 24L14 37L14 11L36 24Z" fill="currentColor" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
    <path
      d="M6.66602 25.3334L25.5222 6.47719"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <path
      d="M6.66602 6.66663L25.5222 25.5228"
      stroke="currentColor"
      strokeWidth="2.5"
    />
  </svg>
);

const DragArrow = () => (
  <svg viewBox="0 0 31 60" fill="none" width="24" height="24">
    <path d="M28 2L4 30L28 58" stroke="currentColor" strokeWidth="6" />
  </svg>
);

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const [variant, setVariant] = useState<CursorVariant>("default");
  const [theme, setTheme] = useState<CursorTheme>("dark");
  const [text, setText] = useState("Click me");
  const [media, setMedia] = useState("");
  const [visible, setVisible] = useState(false);
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const inner = innerRef.current;

    if (!cursor || !inner) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      cursor.style.display = "none";
      return;
    }

    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.35,
      ease: "power3.out",
    });

    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.35,
      ease: "power3.out",
    });

    const rotateTo = gsap.quickTo(cursor, "rotate", {
      duration: 0.35,
      ease: "power3.out",
    });

    const innerRotateTo = gsap.quickTo(inner, "rotate", {
      duration: 0.35,
      ease: "power3.out",
    });

    let lastX = 0;
    let lastY = 0;

    const getCursorTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return null;

      return target.closest<HTMLElement>(
        "[data-cursor-variant], [data-cursor-theme], [data-cursor-text], [data-cursor-media]",
      );
    };

    const normalizeVariant = (value?: string): CursorVariant => {
      if (!value) return "default";
      if (value === "project_mini") return "project-mini";

      const allowed: CursorVariant[] = [
        "default",
        "text",
        "play",
        "drag",
        "project",
        "project-mini",
        "close",
        "media",
      ];

      return allowed.includes(value as CursorVariant)
        ? (value as CursorVariant)
        : "default";
    };

    const normalizeTheme = (value?: string): CursorTheme => {
      if (value === "white" || value === "primary" || value === "dark") {
        return value;
      }

      return "dark";
    };

    const handleMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      xTo(clientX);
      yTo(clientY);

      const dx = clientX - lastX;
      const dy = clientY - lastY;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        rotateTo(angle);
        innerRotateTo(-angle);
      }

      lastX = clientX;
      lastY = clientY;

      const target = getCursorTarget(event.target);

      if (target) {
        setVariant(normalizeVariant(target.dataset.cursorVariant));
        setTheme(normalizeTheme(target.dataset.cursorTheme));
        setText(target.dataset.cursorText || "Click me");
        setMedia(target.dataset.cursorMedia || "");
      } else {
        setVariant("default");
        setTheme("dark");
        setText("Click me");
        setMedia("");
      }

      setVisible(true);
    };

    const handleLeave = () => setVisible(false);
    const handleDown = () => setIsDown(true);
    const handleUp = () => setIsDown(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor-root ${visible ? "is-visible" : ""}`}
      data-theme={theme}
      data-variant={variant}
      data-down={isDown ? "true" : "false"}
      aria-hidden="true"
    >
      <div ref={innerRef}>
        <div className="custom-cursor-container">
          <span className="sr-only">Cursor</span>

          <div className="custom-cursor-dot" />

          <div className="cursor-layer cursor-layer-text">
            <div className="text-center">{text}</div>
          </div>

          <div className="cursor-layer cursor-layer-play">
            <PlayIcon />
          </div>

          <div className="cursor-layer cursor-layer-drag">
            <div className="cursor-drag-handle cursor-drag-left">
              <DragArrow />
            </div>

            <div>
              <div className="cursor-drag-text">Drag</div>
              <div className="cursor-drag-point" />
            </div>

            <div className="cursor-drag-handle cursor-drag-right">
              <DragArrow />
            </div>
          </div>

          <div className="cursor-layer cursor-layer-project">
            <ArrowIcon />
          </div>

          <div className="cursor-layer cursor-layer-project-mini">
            <ArrowIcon className="h-8 w-8" />
          </div>

          <div className="cursor-layer cursor-layer-close">
            <CloseIcon />
          </div>

          <div className="cursor-layer cursor-layer-media">
            {media ? <Image src={media} alt="" fill /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCursor;
