"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import styles from "../../../styles/ServicesHeroSection.module.css";

type ServicesHeroSectionProps = {
  title?: string;
  description?: string;
  href?: string;
  cursorText?: string;
  videoSrc?: string;
  maskSrc?: string;
  lottiePath?: string;
};

const ServicesHeroSection = ({
  title = "Services",
  description = "Creativity, Technology, and Understanding are our things for you and your story is our inspiration",
  href = "/contact",
  cursorText = "Hire us",
  videoSrc = "https://admin.tuvanweb.com/uploads/files/Services/Service-Banner.mp4",
  maskSrc = "/images/services/clip-path.svg",
  lottiePath = "/lottie/Services-Banner.json",
}: ServicesHeroSectionProps) => {
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  /**
   * Trigger the same rotate-3d entrance transition
   * after the first browser paint.
   */
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  /**
   * Background Lottie animation.
   *
   * The original services page uses:
   * /lottie/Services-Banner.json
   * preserveAspectRatio: xMidYMax meet
   */
  useEffect(() => {
    let isMounted = true;

    const loadLottie = async () => {
      if (!lottieContainerRef.current) return;

      const lottie = (await import("lottie-web")).default;

      if (!isMounted || !lottieContainerRef.current) return;

      animationRef.current = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: lottiePath,
        rendererSettings: {
          preserveAspectRatio: "xMidYMax meet",
        },
      });
    };

    loadLottie();

    return () => {
      isMounted = false;

      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [lottiePath]);

  const headingRevealClass = `${styles.reveal3d} ${
    isVisible ? styles.reveal3dVisible : styles.reveal3dHidden
  }`;

  return (
    <section
      className="theme__light bg-neutral-0 text-neutral-800"
      data-cursor-theme="dark"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div className={`container ${styles.wrapper}`}>
        <div className={styles.container}>
          <Link
            href={href}
            className={styles.heading}
            data-cursor-variant="text"
            data-cursor-theme="primary"
            data-cursor-stretch="true"
            data-cursor-text={cursorText}
            data-cursor-media=""
            aria-label={`${cursorText}: ${title}`}
          >
            {/* Main visible heading */}
            <h1 className={headingRevealClass}>{title}</h1>

            {/* Visual banner positioned behind heading */}
            <div className={styles.bannerContainer}>
              <div className={styles.bannerBackground}>
                {/* Masked hover video */}
                <div
                  className={styles.bannerVideo}
                  style={{
                    WebkitMaskImage: `url(${maskSrc})`,
                    maskImage: `url(${maskSrc})`,
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

                  {/* White cloned heading inside masked media */}
                  <div className={`${styles.heading} ${styles.headingClone}`}>
                    <span className={headingRevealClass}>{title}</span>
                  </div>
                </div>

                {/* Default Lottie background */}
                <div
                  ref={lottieContainerRef}
                  className={styles.backgroundAnimation}
                  aria-hidden="true"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Description */}
        <div className={styles.quote}>
          <div
            className={`${styles.description} ${headingRevealClass}`}
            style={{
              transitionDelay: "200ms",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHeroSection;
