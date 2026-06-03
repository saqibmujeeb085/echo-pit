"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnimationItem } from "lottie-web";
import styles from "../../../styles/ServicesDetailSection.module.css";

export type ServiceDetailItem = {
  title: string;
  description: string;
  href?: string;
};

type ServicesDetailSectionProps = {
  services?: ServiceDetailItem[];
  contactHref?: string;
  ctaLabel?: string;
  lottiePath?: string;
};

const defaultServices: ServiceDetailItem[] = [
  {
    title: "Interaction",
    description:
      "Your product will be more perfect than ever with the addition of motion interactive elements. You will experience design testing versions very similar to the final development version, helping to visualize your product.",
  },
  {
    title: "Illustration",
    description:
      "The stories and ideas for your products will be conveyed through more understandable and vivid illustrations. You can choose from many different styles, modern and impressive.",
  },
  {
    title: "Web, App Development",
    description:
      "Turn your design idea into a real product. Build it by warm heart developers. You will have a wide choice of languages and platforms for both mobile app and website, comprehensive frontend and backend.",
  },
  {
    title: "UX/UI Design",
    description:
      "We help you optimize user interface and user experience design on many digital products such as websites, mobile applications, or for car UX & automotive HMI with intuitive high-fidelity prototyping.",
  },
];

const ArrowIcon = () => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.dotIcon}
      aria-hidden="true"
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

const ServicesDetailSection = ({
  services = defaultServices,
  contactHref = "/contact",
  ctaLabel = "Let’s collaborate",
  lottiePath = "/lottie/Services-Services.json",
}: ServicesDetailSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);
  const lottieAnimationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let isMounted = true;
    let scrollTrigger: ScrollTrigger | null = null;

    const setupLottie = async () => {
      const container = lottieContainerRef.current;
      const section = sectionRef.current;

      if (!container || !section) return;

      const lottie = (await import("lottie-web")).default;

      if (!isMounted || !lottieContainerRef.current) return;

      const animation = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: lottiePath,
        rendererSettings: {
          preserveAspectRatio: "xMidYMax meet",
        },
      });

      lottieAnimationRef.current = animation;

      const setupScrollAnimation = () => {
        if (!sectionRef.current) return;

        const totalFrames = Math.max(animation.totalFrames - 1, 0);

        /**
         * Original scroll range:
         * start: section top
         * end: section bottom minus 50vh
         */
        scrollTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",

          end: () => {
            const sectionHeight = sectionRef.current?.offsetHeight ?? 0;

            const distance = Math.max(
              sectionHeight - window.innerHeight * 0.5,
              1,
            );

            return `+=${distance}`;
          },

          scrub: true,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            animation.goToAndStop(self.progress * totalFrames, true);
          },
        });

        ScrollTrigger.refresh();
      };

      animation.addEventListener("DOMLoaded", setupScrollAnimation);
    };

    setupLottie();

    return () => {
      isMounted = false;

      scrollTrigger?.kill();
      lottieAnimationRef.current?.destroy();
      lottieAnimationRef.current = null;
    };
  }, [lottiePath]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-800 text-neutral-0"
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div className="container max-w-none scrollbar-hide">
        <div className={styles.contentWrapper}>
          {/* Sticky Lottie Column */}
          <div className={styles.left}>
            <div className={styles.lottieContainer}>
              <div className={styles.lottie}>
                <div
                  ref={lottieContainerRef}
                  className={styles.lottieInner}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Scrolling Services */}
          <div className={styles.right}>
            {services.map((service) => (
              <article key={service.title} className={styles.item}>
                <Link
                  href={service.href ?? contactHref}
                  className="block cursor-pointer"
                  data-cursor-variant="project"
                  data-cursor-theme="primary"
                  data-cursor-stretch="true"
                  data-cursor-media=""
                >
                  <div className={styles.title}>
                    <h5>{service.title}</h5>
                  </div>

                  <div className={styles.description}>
                    <p>{service.description}</p>
                  </div>

                  {/* CTA displayed only below desktop width */}
                  <div className="block lg:hidden">
                    <span className={styles.mobileCta}>
                      <span className={styles.dot}>
                        <ArrowIcon />
                      </span>

                      <span>{ctaLabel}</span>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesDetailSection;
