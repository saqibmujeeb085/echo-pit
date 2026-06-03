"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

type ContactLink = {
  label: string;
  href: string;
};

type HeroSectionProps = {
  title?: string;
  email?: string;
  address?: string;
  addressHref?: string;
  links?: ContactLink[];

  /**
   * Optional hover media.
   * Supports an image or video.
   *
   * Examples:
   * "/videos/contact-hover.mp4"
   * "/images/contact/contact-hover.jpg"
   */
  mediaSrc?: string;

  /**
   * Add this SVG inside your public folder:
   * /public/images/contact/clip-path.svg
   */
  maskImage?: string;
};

type OrbitPoint = {
  x: number;
  y: number;
  element: SVGGElement;
};

const defaultLinks: ContactLink[] = [
  {
    label: "Hotline",
    href: "https://bento.me/pitstudio",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/+84344321686",
  },
  {
    label: "Zalo",
    href: "https://zalo.me/0344321686",
  },
  {
    label: "Messenger",
    href: "https://m.me/pitstudio.co",
  },
];

const isVideoFile = (src?: string) => {
  if (!src) return false;

  return /\.(mp4|webm|ogg)$/i.test(src);
};

/**
 * Returns a position along an ellipse based on the pointer direction.
 * This recreates the interaction logic used by the original section.
 */
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

const HeroSection = ({
  title = "Contact",
  email = "hello@pitstudio.co",
  address = "131 Tran Phu, Hadong, Hanoi, Vietnam",
  addressHref = "https://goo.gl/maps/x7Xy5u4ixjsNYtCn6",
  links = defaultLinks,
  mediaSrc,
  maskImage = "/images/contact/clip-path.svg",
}: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const desktopDotOneRef = useRef<SVGGElement | null>(null);
  const desktopDotTwoRef = useRef<SVGGElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      /**
       * Intro animation:
       * title, email and details rotate upward into view.
       */
      const introTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      introTimeline
        .fromTo(
          headingRef.current,
          {
            opacity: 0,
            yPercent: 90,
            z: -10,
            rotateX: -60,
            transformPerspective: 600,
            transformOrigin: "center center",
          },
          {
            opacity: 1,
            yPercent: 0,
            z: 0,
            rotateX: 0,
            duration: 0.75,
          },
        )
        .fromTo(
          bannerRef.current,
          {
            opacity: 0,
            scale: 0.96,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
          },
          "-=0.55",
        )
        .fromTo(
          emailRef.current,
          {
            opacity: 0,
            yPercent: 90,
            z: -10,
            rotateX: -60,
            transformPerspective: 600,
            transformOrigin: "center center",
          },
          {
            opacity: 1,
            yPercent: 0,
            z: 0,
            rotateX: 0,
            duration: 0.7,
          },
          "-=0.35",
        )
        .fromTo(
          detailsRef.current,
          {
            opacity: 0,
            yPercent: 90,
            z: -10,
            rotateX: -60,
            transformPerspective: 600,
            transformOrigin: "center center",
          },
          {
            opacity: 1,
            yPercent: 0,
            z: 0,
            rotateX: 0,
            duration: 0.7,
          },
          "-=0.5",
        );
    }, section);

    /**
     * Desktop cursor-reactive ellipse dots.
     */
    const mediaQuery = window.matchMedia(
      "(min-width: 768px) and (pointer: fine)",
    );

    const dots = [
      desktopDotOneRef.current,
      desktopDotTwoRef.current,
    ].filter(Boolean) as SVGGElement[];

    let orbitPoints: OrbitPoint[] = [];
    let rafId = 0;

    const calculateDotCenters = () => {
      orbitPoints = dots.map((element) => {
        /**
         * Remove the previous offset before recalculating.
         * This avoids gradual position drift after resizing.
         */
        element.style.transform = "matrix(1, 0, 0, 1, 0, 0)";

        const rect = element.getBoundingClientRect();

        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          element,
        };
      });
    };

    const handlePointerMove = (event: MouseEvent) => {
      if (!mediaQuery.matches) return;

      cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        orbitPoints.forEach(({ element, x, y }) => {
          const offset = getEllipsePoint(
            event.clientX - x,
            event.clientY - y,
            30,
            15,
            0,
          );

          gsap.to(element, {
            x: offset.x,
            y: offset.y,
            duration: 0.35,
            ease: "power3.out",
            overwrite: true,
          });
        });
      });
    };

    calculateDotCenters();

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("resize", calculateDotCenters);
    window.addEventListener("scroll", calculateDotCenters, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(rafId);

      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", calculateDotCenters);
      window.removeEventListener("scroll", calculateDotCenters);

      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-neutral-800 text-neutral-0"
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div className="container pb-10 md:pb-12 lg:pb-14 xl:pb-[4.5rem] mx-auto">
        {/* Main Banner */}
        <div className="flex justify-center pt-12 md:pt-24 lg:pt-[8.625rem] xl:pt-[9.75rem]">
          <div
            className="
              group/contact
              relative
              grid
              cursor-default
              select-none
              place-items-center
              [perspective:37.5rem]
              [&>*]:col-start-1
              [&>*]:row-start-1
            "
          >
            {/* Main Heading */}
            <h1
              ref={headingRef}
              className="
                relative
                z-10
                text-[5rem]/[5.75rem]
                font-medium
                md:text-[7rem]/[7.5rem]
                lg:text-[10.5rem]/[11.625rem]
                xl:text-[16rem]/[17rem]
              "
            >
              {title}
            </h1>

            {/* Ellipse Banner */}
            <div
              ref={bannerRef}
              className="
                pointer-events-none
                absolute
                left-1/2
                w-[20.438rem]
                -translate-x-1/2
                md:mt-1
                md:w-[42rem]
                lg:-mt-[0.938rem]
                lg:w-[54rem]
                xl:-mt-[0.375rem]
                xl:w-[93.735rem]
              "
            >
              <div className="relative pb-[71.25%] md:pb-[32%]">
                {/* Masked hover media */}
                <div
                  className="
                    absolute
                    inset-0
                    z-10
                    hidden
                    overflow-hidden
                    opacity-0
                    transition-opacity
                    duration-150
                    ease-out
                    lg:block
                    xl:group-hover/contact:opacity-100
                  "
                  style={{
                    WebkitMaskImage: `url(${maskImage})`,
                    maskImage: `url(${maskImage})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                >
                  {mediaSrc && isVideoFile(mediaSrc) ? (
                    <video
                      src={mediaSrc}
                      className="h-full w-full bg-neutral-800 object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : mediaSrc ? (
                    <Image
                      src={mediaSrc}
                      alt=""
                      className="h-full w-full object-cover"
                        height={2000}
                        width={2000}
                    />
                  ) : (
                    <div className="h-full w-full bg-neutral-700/80">
                      <div className="h-full w-full bg-gradient-to-br from-neutral-600 via-neutral-700 to-primary-600/60" />
                    </div>
                  )}
                </div>

                {/* Ellipse background */}
                <div
                  className="
                    absolute
                    inset-0
                    transition-opacity
                    duration-150
                    ease-out
                    xl:group-hover/contact:opacity-0
                  "
                >
                  {/* Desktop / Tablet */}
                  <svg
                    viewBox="0 0 1500 480"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden h-full w-full md:block"
                  >
                    <ellipse
                      cx="336.047"
                      cy="239.925"
                      rx="343"
                      ry="78"
                      transform="rotate(-30 336.047 239.925)"
                      stroke="white"
                      strokeWidth="2"
                      fill="transparent"
                    />

                    <ellipse
                      cx="1163.71"
                      cy="240.159"
                      rx="343"
                      ry="78"
                      transform="rotate(-30 1163.71 240.159)"
                      stroke="white"
                      strokeWidth="2"
                      fill="transparent"
                    />

                    <g ref={desktopDotOneRef}>
                      <circle
                        cx="561.336"
                        cy="109"
                        r="12"
                        fill="white"
                      />
                    </g>

                    <g ref={desktopDotTwoRef}>
                      <circle
                        cx="1389"
                        cy="114"
                        r="12"
                        fill="white"
                      />
                    </g>
                  </svg>

                  {/* Mobile */}
                  <svg
                    width="327"
                    height="233"
                    viewBox="0 0 327 233"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full md:hidden"
                  >
                    <mask
                      id="contact-mobile-mask"
                      maskUnits="userSpaceOnUse"
                      x="17"
                      y="26"
                      width="293"
                      height="181"
                    >
                      <ellipse
                        cx="166.939"
                        cy="37.9881"
                        rx="166.939"
                        ry="37.9881"
                        transform="matrix(0.865736 -0.500501 0.4995 0.866314 0 167.105)"
                        fill="#D9D9D9"
                      />
                    </mask>

                    <g mask="url(#contact-mobile-mask)">
                      <ellipse
                        cx="166.939"
                        cy="37.9881"
                        rx="166.939"
                        ry="37.9881"
                        transform="matrix(0.865736 -0.500501 0.4995 0.866314 0 167.105)"
                        stroke="white"
                        strokeWidth="0.933671"
                      />

                      <ellipse
                        cx="285.6"
                        cy="44.6075"
                        rx="5.59997"
                        ry="5.60748"
                        fill="white"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-32 text-center lg:mt-28 xl:mt-[9.125rem]">
          <div
            ref={emailRef}
            className="
              mb-8
              text-base
              font-medium
              md:mb-12
              md:text-lg
              lg:mb-[4.5rem]
              lg:text-2xl
              xl:mb-[6.125rem]
              xl:text-h8
            "
          >
            <a
              href={`mailto:${email}`}
              className="transition-colors duration-300 ease-default hover:text-primary-600"
            >
              {email}
            </a>
          </div>

          <div
            ref={detailsRef}
            className="text-sm font-medium xl:text-lg"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-6 md:flex-nowrap">
              <div className="flex items-center gap-x-3 font-normal xl:gap-x-6">
                <span className="text-xs font-medium md:hidden">•</span>

                <a
                  href={addressHref}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-300 hover:text-primary-600"
                >
                  {address}
                </a>

                <span className="text-xs font-medium lg:text-base xl:text-lg">
                  •
                </span>
              </div>

              <ul className="mt-3 flex gap-x-6 font-normal md:mt-0 xl:gap-x-12 xl:font-medium">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors duration-300 hover:text-primary-600"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;