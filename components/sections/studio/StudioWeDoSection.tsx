"use client";

import { useEffect, useRef, useState } from "react";

import HorizontalDragScroll from "@/components/ui/HorizontalDragScroll";

import {
  studioWeDoImages,
  type StudioWeDoImage,
} from "@/data/studio-we-do-data";

import styles from "../../../styles/StudioWeDoSection.module.css";

type StudioWeDoSectionProps = {
  secondaryTitle?: string;
  title?: string;
  images?: StudioWeDoImage[];
};

const StudioWeDoSection = ({
  secondaryTitle = "We love what",
  title = "We do",
  images = studioWeDoImages,
}: StudioWeDoSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  /**
   * Original heading behavior:
   * add rotate__show when the section enters view.
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
        threshold: 0.15,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      {/* ------------------------------------------------------------ */}
      {/* Heading                                                       */}
      {/* ------------------------------------------------------------ */}

      <div
        className={`container whitespace-pre select-none ${
          isVisible ? styles.rotateShow : ""
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
              data-index="••"
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

      {/* ------------------------------------------------------------ */}
      {/* Horizontal gallery                                           */}
      {/* ------------------------------------------------------------ */}

      <div className="relative">
        <HorizontalDragScroll
          className={`
            container
            flex
            overflow-auto
            scrollbar-hide
            pt-4
            md:pt-9
            lg:pt-12
            xl:pt-[4.5rem]
          `}
          data-cursor-variant="drag"
          data-cursor-theme="white"
          data-cursor-stretch="false"
          data-cursor-media=""
        >
          <div className="relative">
            <div className="flex min-w-min">
              {images.map((image) => (
                <div className={styles.dragItem} key={image.id}>
                  <img
                    src={image.src}
                    alt={image.alt ?? image.caption}
                    draggable={false}
                    className={styles.image}
                  />

                  {/* Individual horizontal baseline */}
                  <div className={styles.itemBaseline} />

                  {/* Desktop-only caption */}
                  <div className={styles.captionWidth}>
                    <div className={styles.caption}>{image.caption}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </HorizontalDragScroll>
      </div>
    </section>
  );
};

export default StudioWeDoSection;
