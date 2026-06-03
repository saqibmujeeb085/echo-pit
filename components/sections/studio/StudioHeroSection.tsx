"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

import styles from "../../../styles/StudioHeroSection.module.css";

type StudioHeroSectionProps = {
  title?: string;
  address?: string;
  description?: string;
  videoSrc?: string;
  maskSrc?: string;
};

type OrbitDot = {
  element: SVGGElement;
  centerX: number;
  centerY: number;
};

const getEllipsePoint = (
  pointerX: number,
  pointerY: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
) => {
  const radians = (rotation * Math.PI) / 180;

  const angle = Math.atan2(
    (pointerX * Math.sin(radians) + pointerY * Math.cos(radians)) * radiusX,
    (pointerX * Math.cos(radians) - pointerY * Math.sin(radians)) * radiusY,
  );

  return {
    x:
      radiusX * Math.cos(angle) * Math.cos(-radians) -
      radiusY * Math.sin(angle) * Math.sin(-radians),

    y:
      radiusX * Math.cos(angle) * Math.sin(-radians) +
      radiusY * Math.sin(angle) * Math.cos(-radians),
  };
};

const StudioHeroSection = ({
  title = "Studio",
  address = "131 Tran Phu, Hadong, Hanoi, Vietnam",
  description = "All Great Things\nHave Small Beginnings",
  videoSrc = "https://admin.tuvanweb.com//uploads/files/Studio/Banner%20Studio.mp4",
  maskSrc = "/images/studio/clip-path.svg",
}: StudioHeroSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const firstDotRef = useRef<SVGGElement | null>(null);

  const secondDotRef = useRef<SVGGElement | null>(null);

  const orbitDotsRef = useRef<OrbitDot[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  /**
   * Calculate the actual browser position of each SVG dot.
   *
   * Run this again after scrolling or resizing so the
   * cursor-following movement stays accurate.
   */
  const calculateDotCenters = useCallback(() => {
    const dotElements = [firstDotRef.current, secondDotRef.current].filter(
      Boolean,
    ) as SVGGElement[];

    orbitDotsRef.current = dotElements.map((element) => {
      /**
       * Reset the old translated position before calculating
       * the new center. This prevents movement drift.
       */
      gsap.set(element, {
        x: 0,
        y: 0,
      });

      const bounds = element.getBoundingClientRect();

      return {
        element,
        centerX: bounds.left + bounds.width / 2,
        centerY: bounds.top + bounds.height / 2,
      };
    });
  }, []);

  /**
   * Mouse tracking for the two ellipse dots.
   *
   * The source interaction uses:
   * radiusX: 80
   * radiusY: 30
   * rotation: 30 degrees
   */
  useLayoutEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    if (!finePointer.matches) return;

    calculateDotCenters();

    const handleMouseMove = (event: MouseEvent) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        orbitDotsRef.current.forEach(({ element, centerX, centerY }) => {
          const offset = getEllipsePoint(
            event.clientX - centerX,
            event.clientY - centerY,
            80,
            30,
            30,
          );

          gsap.to(element, {
            x: offset.x,
            y: offset.y,
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      });
    };

    const handleResize = () => {
      calculateDotCenters();
    };

    const handleScroll = () => {
      calculateDotCenters();
    };

    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("resize", handleResize);

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("resize", handleResize);

      window.removeEventListener("scroll", handleScroll);
    };
  }, [calculateDotCenters]);

  /**
   * Reveal the title, address, and quote after the first paint.
   *
   * The transition classes reproduce:
   * translateY(100%) rotateX(-66deg) → normal state
   */
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const revealClassName = `${styles.rotate3d} ${
    isVisible ? styles.rotate3dVisible : styles.rotate3dHidden
  }`;

  return (
    <section
      ref={sectionRef}
      className="bg-neutral-0 text-neutral-800"
      data-cursor-theme="dark"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div className={`container ${styles.wrapper}`}>
        {/* Hero heading and visual */}
        <div className={styles.container}>
          <div className={styles.heading}>
            {/* Main title */}
            <h1 className={revealClassName}>{title}</h1>

            {/* Visual behind the title */}
            <div className={styles.bannerContainer}>
              <div className={styles.bannerBackground}>
                {/* Masked hover video */}
                <div
                  className={styles.bannerVideo}
                  style={{
                    WebkitMaskImage: `url("${maskSrc}")`,
                    maskImage: `url("${maskSrc}")`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                >
                  <video autoPlay loop muted playsInline preload="metadata">
                    <source src={videoSrc} type="video/mp4" />
                  </video>

                  {/* White title clone displayed over video */}
                  <div className={`${styles.heading} ${styles.headingClone}`}>
                    <span className={revealClassName}>{title}</span>
                  </div>
                </div>

                {/* Default SVG ellipse artwork */}
                <div className={styles.backgroundGraphic}>
                  <svg
                    className="h-full w-full"
                    viewBox="0 0 928 428"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <ellipse
                      cx="301.711"
                      cy="213.924"
                      rx="343"
                      ry="78"
                      transform="rotate(-30 301.711 213.924)"
                      stroke="#181818"
                      strokeWidth="2"
                    />

                    <ellipse
                      cx="619.711"
                      cy="214.156"
                      rx="343"
                      ry="78"
                      transform="rotate(-30 619.711 214.156)"
                      stroke="#181818"
                      strokeWidth="2"
                    />

                    <g ref={firstDotRef}>
                      <circle cx="505" cy="88" r="12" fill="#181818" />
                    </g>

                    <g ref={secondDotRef}>
                      <circle cx="815" cy="88" r="12" fill="#181818" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className={styles.quote}>
          <div
            className={`${styles.address} ${revealClassName}`}
            style={{
              transitionDelay: "200ms",
            }}
          >
            {address}
          </div>

          <div
            className={`${styles.description} ${revealClassName}`}
            style={{
              transitionDelay: "300ms",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioHeroSection;
