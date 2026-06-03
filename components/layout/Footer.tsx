"use client";

import Link from "next/link";
import { ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SocialLink = {
  label: string;
  href: string;
};

type MagneticProps = {
  children: ReactNode;
  className?: string;
  scale?: number;
  speed?: number;
  tolerance?: number;
  typeTolerance?: "fixed" | "percent";
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const keywords = ["idea", "business", "project"];

const socialLinks: SocialLink[] = [
  { label: "Dribbble", href: "https://dribbble.com/" },
  { label: "Behance", href: "https://www.behance.net/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
];

const ArrowIcon = () => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-12 md:size-[4.5rem] xl:size-24"
    >
      <path d="M37 11L11 37" stroke="currentColor" strokeWidth="4" />
      <path
        d="M13.4941 11H36.9482V34.4541"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
};

const getPointerFromCenter = (
  event: React.MouseEvent<HTMLDivElement>,
  amplified = false,
) => {
  const rect = event.currentTarget.getBoundingClientRect();

  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;

  if (!amplified) {
    return { x, y };
  }

  return {
    x: x + x + (x > 0 ? 1 : -1) * 0.01 * x,
    y: y + (y > 0 ? 1 : -1) * 0.01 * y,
  };
};

const Magnetic = ({
  children,
  className = "",
  scale = 1,
  speed = 0.5,
  tolerance = 0,
  typeTolerance = "fixed",
  onMouseEnter,
  onMouseLeave,
}: MagneticProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const boundaryRef = useRef<HTMLSpanElement | null>(null);

  const rectRef = useRef<DOMRect | null>(null);
  const toleranceRef = useRef({ x: 0, y: 0 });
  const isMouseInside = useRef(false);

  const moveItem = (
    x: number,
    y: number,
    duration: number,
    ease: string = "power3.out",
  ) => {
    if (!itemRef.current) return;

    gsap.to(itemRef.current, {
      x,
      y,
      duration,
      ease,
      force3D: true,
      overwrite: true,
    });
  };

  const handleEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!rootRef.current) return;

    isMouseInside.current = true;
    rectRef.current = rootRef.current.getBoundingClientRect();

    const rect = rectRef.current;

    toleranceRef.current = {
      x:
        typeTolerance === "fixed"
          ? tolerance * 2
          : (rect.width * tolerance) / 100,
      y:
        typeTolerance === "fixed"
          ? tolerance * 2
          : (rect.height * tolerance) / 100,
    };

    if (scale > 1 && boundaryRef.current) {
      gsap.set(boundaryRef.current, { scale });
    }

    onMouseEnter?.(event);
  };

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseInside.current || !rectRef.current) return;

    const rect = rectRef.current;

    const x = gsap.utils.mapRange(
      0,
      rect.width * scale,
      -toleranceRef.current.x,
      toleranceRef.current.x,
      event.clientX - rect.x + (rect.width * scale - rect.width) / 2,
    );

    const y = gsap.utils.mapRange(
      0,
      rect.height * scale,
      -toleranceRef.current.y,
      toleranceRef.current.y,
      event.clientY - rect.y + (rect.height * scale - rect.height) / 2,
    );

    moveItem(x, y, speed);
  };

  const handleLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseInside.current) return;

    isMouseInside.current = false;

    if (itemRef.current) {
      gsap.killTweensOf(itemRef.current);
    }

    moveItem(0, 0, 1.2, "elastic.out(1.1, 0.4)");

    if (boundaryRef.current) {
      gsap.set(boundaryRef.current, { scale: 1 });
    }

    rectRef.current = null;
    onMouseLeave?.(event);
  };

  return (
    <div
      ref={rootRef}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative ${className}`}
    >
      <span ref={boundaryRef} className="absolute inset-0 rounded-full" />

      <div ref={itemRef} className="relative h-full w-full">
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const navLayerRef = useRef<HTMLDivElement | null>(null);
  const navBgRef = useRef<HTMLDivElement | null>(null);
  const navInnerTextRef = useRef<HTMLDivElement | null>(null);
  const ringsSizeRef = useRef<HTMLDivElement | null>(null);
  // const bottomRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (window.innerWidth >= 1280) {
        gsap.set(navBgRef.current, {
          width: 0,
          height: 0,
        });

        // gsap.set(bottomRef.current, {
        //   yPercent: 100,
        // });
      }

      // ScrollTrigger.create({
      //   trigger: sectionRef.current,
      //   start: "top 5%",
      //   onEnter: () => {
      //     gsap.to(bottomRef.current, {
      //       yPercent: 0,
      //       duration: 0.45,
      //       ease: "power3.out",
      //     });
      //   },
      //   onLeaveBack: () => {
      //     if (window.innerWidth < 1280) return;

      //     gsap.to(bottomRef.current, {
      //       yPercent: 100,
      //       duration: 0.45,
      //       ease: "power3.inOut",
      //     });
      //   },
      // });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSectionMouseMove = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (window.innerWidth < 1280) return;

    const button = buttonRef.current;
    const rings = ringsSizeRef.current;

    if (!button || !rings) return;

    const rect = button.getBoundingClientRect();

    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const distanceX = Math.abs(buttonCenterX - event.clientX);
    const distanceY = Math.abs(buttonCenterY - event.clientY);

    const mappedX = gsap.utils.mapRange(0, 1000, 0, 50, distanceX);
    const mappedY =
      gsap.utils.mapRange(0, 1000, 0, 50, distanceY) *
      (window.innerWidth / window.innerHeight);

    const size = Math.max(Math.sqrt(mappedX ** 2 + mappedY ** 2) / 2.5 - 5, 0);

    gsap.set(rings, {
      width: `${size}%`,
      height: `${size}%`,
    });
  };

  const handleButtonEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1280) return;

    const { x, y } = getPointerFromCenter(event);

    gsap.set(navLayerRef.current, {
      x: 1.2 * x,
      y: 1.2 * y,
    });

    gsap.set(navInnerTextRef.current, {
      x: -0.8 * x,
      y: -0.8 * y,
    });

    gsap.to(navBgRef.current, {
      width: "100%",
      height: "100%",
      duration: 0.3,
      ease: "power3.out",
    });

    gsap.to(navLayerRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power3.in",
    });

    gsap.to(navInnerTextRef.current, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power3.in",
    });
  };

  const handleButtonLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1280) return;

    const { x, y } = getPointerFromCenter(event);

    gsap.to(navBgRef.current, {
      width: 0,
      height: 0,
      duration: 0.3,
      ease: "power3.inOut",
    });

    gsap.to(navLayerRef.current, {
      x: 0.7 * x,
      y: 0.7 * y,
      duration: 0.3,
      ease: "power3.in",
    });

    gsap.to(navInnerTextRef.current, {
      x: -0.5 * x,
      y: -0.5 * y,
      duration: 0.3,
      ease: "power3.in",
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="relative h-screen min-h-[50rem] overflow-visible bg-neutral-0 text-neutral-900"
    >
      <div className="absolute top-0 flex h-screen min-h-[50rem] w-full flex-col overflow-hidden bg-neutral-0">
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center text-center text-[2.5rem] font-bold leading-[3rem] md:text-[5rem] md:leading-[5.75rem] lg:flex-row xl:text-h2">
            <div className="lg:mr-9">
              <span>
                Start your{" "}
                <span className="inline lg:block xl:hidden">idea</span>
              </span>
            </div>

            <div className="mt-12 lg:mt-0">
              <Link href="/contact" aria-label="Work with us">
                <Magnetic
                  scale={1.5}
                  tolerance={10}
                  typeTolerance="percent"
                  className="group block size-[15rem] rounded-full md:size-[20rem] lg:size-[24rem] xl:size-[32rem]"
                  onMouseEnter={handleButtonEnter}
                  onMouseLeave={handleButtonLeave}
                >
                  <div className="relative h-full w-full rounded-full text-neutral-0">
                    {/* Rings */}
                    <div className="pointer-events-none absolute inset-0 z-0 hidden rotate-[15deg] rounded-full xl:block">
                      <div
                        ref={ringsSizeRef}
                        className="relative"
                        style={{
                          transformOrigin: "center left",
                          width: "12%",
                          height: "12%",
                          zIndex: 0,
                        }}
                      >
                        {[1, 2, 3, 4].map((item, index) => (
                          <div
                            key={item}
                            className="absolute left-0 top-0"
                            style={{
                              left: `${item * 50}%`,
                              zIndex: 4 - index,
                            }}
                          >
                            <div className="absolute left-0 top-0 size-[15rem] rounded-full border-2 border-neutral-800 bg-white md:size-[20rem] lg:size-[24rem] xl:size-[32rem]" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main button */}
                    <div
                      ref={buttonRef}
                      className="relative z-10 h-full w-full overflow-hidden rounded-full border-2 border-neutral-800 bg-neutral-800"
                    >
                      {/* Rotating words */}
                      <div className="hidden h-full w-full [perspective:200px] xl:block">
                        {keywords.map((word, index) => (
                          <div
                            key={word}
                            className="footer-btn-word absolute inset-0 flex h-full w-full items-center justify-center"
                            style={{
                              animationDelay: `${index * 3}s`,
                            }}
                          >
                            <span>{word}</span>
                          </div>
                        ))}
                      </div>

                      {/* Directional white reveal */}
                      <div
                        ref={navLayerRef}
                        className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-full xl:h-auto xl:w-auto"
                      >
                        <div
                          ref={navBgRef}
                          className="relative h-full w-full overflow-hidden rounded-full bg-white xl:h-0 xl:w-0"
                        >
                          <div className="absolute left-1/2 top-1/2 size-[15rem] -translate-x-1/2 -translate-y-1/2 md:size-[20rem] lg:size-[24rem] xl:size-[32rem]">
                            <div
                              ref={navInnerTextRef}
                              className="flex h-full w-full flex-col items-center justify-center text-center text-base font-medium text-neutral-800 lg:text-lg xl:text-h8"
                            >
                              <ArrowIcon />
                              <span>Work With Us</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Magnetic>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div
          // ref={bottomRef}
          className="flex flex-col flex-wrap justify-between px-6 pb-8 text-center text-tn uppercase md:flex-row md:px-12 md:pb-6 lg:px-20 xl:px-[6.25rem] xl:pb-10 xl:text-sm"
        >
          <div className="order-2 w-full pt-6 md:w-auto md:pt-0 md:text-left xl:order-1 xl:flex-1">
            WE ARE FROM HANOI, VIETNAM
          </div>

          <div className="order-1 w-full border-b border-[#e7e7e7] pb-8 text-xs md:mb-6 md:px-12 md:pb-4 lg:px-20 xl:order-2 xl:mb-0 xl:w-0 xl:border-0 xl:p-0 xl:text-sm">
            <ul className="flex flex-wrap justify-center text-center font-bold md:justify-between xl:absolute xl:left-1/2 xl:-translate-x-1/2 xl:gap-9">
              {socialLinks.map((item, index) => (
                <li
                  key={item.label}
                  className={`mt-6 w-1/3 md:mt-0 md:w-auto ${
                    index === 3 ? "ml-[16.66%] md:ml-0" : ""
                  }`}
                >
                  <Link href={item.href} target="_blank">
                    <span className="text-rotate-3d block [perspective:1000px]">
                      <span className="text-rotate-top inline-block transition-all duration-300">
                        {item.label}
                      </span>
                      <span className="text-rotate-bottom text-primary-600 transition-all duration-300">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-2 mt-2 w-full md:mt-0 md:w-auto md:text-right xl:order-3 xl:flex-1">
            © 2026 <span className="px-5" /> PIT STUDIO — DIGITAL PRODUCT STUDIO
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
