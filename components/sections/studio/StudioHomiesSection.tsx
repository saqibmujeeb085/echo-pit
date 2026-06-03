"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";

import { studioHomies, type StudioHomie } from "@/data/studio-homies-data";

import styles from "../../../styles/StudioHomiesSection.module.css";

type PortraitShape = "rounded" | "square";

type DisplayHomie = StudioHomie & {
  styleDesktop: PortraitShape;
  styleMobile: PortraitShape;
};

type GridItem = DisplayHomie | null;

type StudioHomiesSectionProps = {
  data?: StudioHomie[];
  joinLabel?: string;
  joinHref?: string;
};

type HomieCardProps = {
  homie: DisplayHomie;
};

const HomieCard = ({ homie }: HomieCardProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playVideo = () => {
    const video = videoRef.current;

    if (!video) return;

    video.play().catch(() => {
      /**
       * Keep the thumbnail visible if the browser
       * prevents programmatic playback.
       */
    });
  };

  const pauseVideo = () => {
    const video = videoRef.current;

    if (!video) return;

    video.pause();
  };

  const shapeClassName = [
    styles.homieContainer,

    homie.styleDesktop === "square"
      ? styles.squareDesktop
      : styles.roundedDesktop,

    homie.styleMobile === "square" ? styles.squareMobile : styles.roundedMobile,
  ].join(" ");

  return (
    <div
      className={shapeClassName}
      onMouseEnter={playVideo}
      onMouseLeave={pauseVideo}
    >
      {/* Expanding outline layers */}
      <div className={styles.outline}>
        <div />
        <div />
        <div />
      </div>

      {/* Static portrait + hover video */}
      <div className={styles.thumbnail}>
        <img
          src={homie.thumbnail}
          alt={homie.lastName}
          loading="lazy"
          className={styles.image}
        />

        <video
          ref={videoRef}
          src={homie.videoUrl}
          className={styles.video}
          loop
          muted
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
};

const StudioHomiesSection = ({
  data = studioHomies,
  joinLabel = "Join us",
  joinHref = "/contact#join-our-team",
}: StudioHomiesSectionProps) => {
  /**
   * Recreate the exact source layout.
   *
   * Desktop shapes:
   * rounded, square, rounded, square...
   *
   * Mobile shapes:
   * rounded, square, square, rounded...
   *
   * Empty desktop cells:
   * - First grid cell
   * - Grid cell after the ninth portrait
   */
  const gridItems = useMemo<GridItem[]>(() => {
    const formattedItems: GridItem[] = data.map((homie, index) => {
      return {
        ...homie,

        styleDesktop: index % 2 ? "square" : "rounded",

        styleMobile: (index + 1) % 4 < 2 ? "rounded" : "square",
      };
    });

    formattedItems.unshift(null);

    formattedItems.splice(10, 0, null);

    return formattedItems;
  }, [data]);

  return (
    <section
      className="theme__dark overflow-hidden bg-neutral-900 text-white"
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div className={`container ${styles.container}`}>
        <div
          className="
            grid
            grid-cols-2
            gap-x-6
            gap-y-8
            md:grid-cols-5
            md:gap-x-[1.875rem]
            md:gap-y-16
            lg:gap-x-10
            xl:gap-x-16
            xl:gap-y-20
          "
        >
          {gridItems.map((item, index) => {
            if (!item) {
              return (
                <div
                  key={`desktop-spacer-${index}`}
                  className="hidden md:block"
                  aria-hidden="true"
                />
              );
            }

            return <HomieCard key={item.id} homie={item} />;
          })}

          {/*
            Mobile-only spacer.
            This keeps the Join us circle aligned in the
            same grid position as the source layout.
          */}
          <div className="block md:hidden" aria-hidden="true" />

          {/* Recruitment CTA */}
          <div className="relative pb-[100%]">
            <Link
              href={joinHref}
              className="
                group
                absolute
                inset-0
                block
                w-full
                rounded-full
                text-base
                md:text-sm
                xl:text-base
              "
            >
              <span
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  rounded-full
                  bg-primary-600
                  transition-all
                  duration-300
                  ease-linear
                  group-hover:scale-[0.925]
                  group-active:scale-[0.925]
                "
              />

              <span
                className="
                  relative
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                "
              >
                {joinLabel}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioHomiesSection;
