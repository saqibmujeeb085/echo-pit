"use client";

import Image from "next/image";

type ShowreelSectionProps = {
  videoSrc?: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  onClick?: () => void;
};

const PlayIcon = () => {
  return (
    <svg
      className="w-8 md:w-9"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M36 24L14 37L14 11L36 24Z" fill="currentColor" />
    </svg>
  );
};

const ShowreelSection = ({
  videoSrc = "/assets/videos/Showreel-Thumbnails.mp4",
  thumbnailSrc = "/assets/images/Showreel.png",
  thumbnailAlt = "video thumbnail",
  onClick,
}: ShowreelSectionProps) => {
  return (
    <section
      onClick={onClick}
      className="relative h-[26rem] w-full cursor-pointer md:h-[36rem] lg:h-[42.75rem] xl:h-auto xl:aspect-video"
      data-cursor-variant="play"
      data-cursor-theme="primary"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      {/* Desktop Video */}
      <video
        src={videoSrc}
        className="hidden h-full w-full object-cover lg:block"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Mobile / Tablet Thumbnail */}
      <Image
        src={thumbnailSrc}
        className="h-full w-full object-cover lg:hidden"
        alt={thumbnailAlt}
        height={2000}
        width={2000}
      />

      {/* Mobile Play Button */}
      <div className="absolute inset-0 grid place-items-center lg:hidden">
        <div className="grid aspect-square w-20 place-items-center rounded-full bg-primary-600 text-neutral-0 md:w-24">
          <PlayIcon />
        </div>
      </div>
    </section>
  );
};

export default ShowreelSection;
