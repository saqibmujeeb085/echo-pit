"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnimationItem } from "lottie-web";
import styles from "../../../styles/ServicesBenefitSection.module.css";

type ServicesBenefitSectionProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;

  /**
   * Trusted local SVG files from your public directory.
   * They are fetched and injected as inline SVG markup.
   */
  sceneSrc?: string;
  mobileGroundSrc?: string;

  /**
   * Lottie uses the SVG renderer, so its generated output is also SVG.
   */
  catLottiePath?: string;
  bottomLottiePath?: string;

  /**
   * Each target SVG is parsed and appended as a nested inline <svg>.
   * No <img>, <object>, or SVG <image> element is used.
   */
  targetAssets?: string[];
};

type SceneElements = {
  rope: SVGGElement;
  ropeLine: SVGGElement;
  ropeHead: SVGGElement;
  arrowHead: SVGPathElement;
  eyes: SVGGElement | null;
  leftPupil: SVGGElement | null;
  rightPupil: SVGGElement | null;
  leftEye: SVGPathElement | null;
  targets: SVGSVGElement[];
};

const defaultTargetAssets = [
  "/images/services/target_diamond.svg",
  "/images/services/target_view.svg",
  "/images/services/target_heart.svg",
  "/images/services/target_gold.svg",
];

const SVG_NS = "http://www.w3.org/2000/svg";

const fetchSvgMarkup = async (src: string) => {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(`Unable to load SVG asset: ${src}`);
  }

  return response.text();
};

const ServicesBenefitSection = ({
  title = "Aim for your\nright target",
  description = "Right orientation about important goals is the first thing we need to think about them. We make balance your targets with the needs of your users. And a well-organized plan will help you see the finished results for each small stage.",
  ctaLabel = "Start Your Project",
  ctaHref = "/contact",
  sceneSrc = "/images/services/benefit-scene.svg",
  mobileGroundSrc = "/images/services/benefit-mobile-ground.svg",
  catLottiePath = "/lottie/Services-Cat.json",
  bottomLottiePath = "/lottie/Services-ServiceFlax.json",
  targetAssets = defaultTargetAssets,
}: ServicesBenefitSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const sceneMarkupRef = useRef<HTMLDivElement | null>(null);
  const catLottieRef = useRef<HTMLDivElement | null>(null);
  const bottomLottieRef = useRef<HTMLDivElement | null>(null);

  const sceneRef = useRef<SceneElements | null>(null);
  const pendulumRef = useRef<gsap.core.Timeline | null>(null);
  const launchTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const blinkTimerRef = useRef<number | null>(null);
  const eyeRafRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  const [sceneMarkup, setSceneMarkup] = useState("");
  const [mobileGroundMarkup, setMobileGroundMarkup] = useState("");
  const [targetMarkups, setTargetMarkups] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  /**
   * Load trusted local SVG files and inject them inline.
   */
  useEffect(() => {
    let mounted = true;

    const loadSvgAssets = async () => {
      try {
        const [loadedScene, loadedMobileGround, loadedTargets] =
          await Promise.all([
            fetchSvgMarkup(sceneSrc),
            fetchSvgMarkup(mobileGroundSrc),
            Promise.all(targetAssets.map((asset) => fetchSvgMarkup(asset))),
          ]);

        if (!mounted) return;

        setSceneMarkup(loadedScene);
        setMobileGroundMarkup(loadedMobileGround);
        setTargetMarkups(loadedTargets);
      } catch (error) {
        console.error(error);
      }
    };

    loadSvgAssets();

    return () => {
      mounted = false;
    };
  }, [mobileGroundSrc, sceneSrc, targetAssets]);

  const blinkEyes = useCallback(() => {
    const eyes = sceneRef.current?.eyes;

    if (!eyes) return;

    gsap.killTweensOf(eyes);

    gsap
      .timeline()
      .to(eyes, {
        clipPath: "inset(100% 0px 0px)",
        duration: 0.18,
        ease: "power2.in",
      })
      .to(eyes, {
        clipPath: "inset(0% 0px 0px)",
        duration: 0.18,
        ease: "power2.out",
      });
  }, []);

  const stopEyeTracking = useCallback(() => {
    if (eyeRafRef.current) {
      cancelAnimationFrame(eyeRafRef.current);
      eyeRafRef.current = null;
    }

    const scene = sceneRef.current;

    if (!scene) return;

    if (scene.leftPupil) {
      gsap.to(scene.leftPupil, {
        x: 0,
        y: 0,
        duration: 0.35,
        ease: "power3.out",
      });
    }

    if (scene.rightPupil) {
      gsap.to(scene.rightPupil, {
        x: 0,
        y: 0,
        duration: 0.35,
        ease: "power3.out",
      });
    }
  }, []);

  const startEyeTracking = useCallback(() => {
    const updateEyes = () => {
      const scene = sceneRef.current;

      if (
        !scene ||
        !activeRef.current ||
        !scene.leftPupil ||
        !scene.rightPupil ||
        !scene.leftEye
      ) {
        return;
      }

      const targetBounds = scene.arrowHead.getBoundingClientRect();

      const eyeBounds = scene.leftEye.getBoundingClientRect();

      const target = {
        x: targetBounds.left + targetBounds.width / 2,
        y: targetBounds.top + targetBounds.height / 2,
      };

      const eye = {
        x: eyeBounds.left + eyeBounds.width / 2,
        y: eyeBounds.top + eyeBounds.height / 2,
      };

      const dx = target.x - eye.x;
      const dy = target.y - eye.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      const maximum = 10 * Math.min(distance / 400, 1);
      const angle = Math.atan2(dy, dx);

      const x = maximum * Math.cos(angle);
      const y = maximum * Math.sin(angle);

      gsap.set(scene.leftPupil, {
        x: x - 4,
        y: y + 4,
      });

      gsap.set(scene.rightPupil, {
        x: x + 3,
        y: y + 4,
      });

      eyeRafRef.current = requestAnimationFrame(updateEyes);
    };

    if (eyeRafRef.current) {
      cancelAnimationFrame(eyeRafRef.current);
    }

    eyeRafRef.current = requestAnimationFrame(updateEyes);
  }, []);

  /**
   * Convert each target file into a nested inline <svg>.
   *
   * This preserves real SVG nodes inside the main illustration
   * so GSAP can animate them directly.
   */
  const appendInlineTargets = useCallback(
    (ropeHead: SVGGElement, markups: string[]) => {
      const ownerDocument = ropeHead.ownerDocument;
      const parser = new DOMParser();

      ropeHead
        .querySelectorAll("[data-inline-target]")
        .forEach((node) => node.remove());

      /**
       * Remove unresolved nodes copied from the source HTML.
       */
      ropeHead
        .querySelectorAll("use[data-link]")
        .forEach((node) => node.remove());

      return markups.map((markup, index) => {
        const parsedDocument = parser.parseFromString(markup, "image/svg+xml");

        const sourceSvg = parsedDocument.documentElement;

        const nestedSvg = ownerDocument.createElementNS(
          SVG_NS,
          "svg",
        ) as SVGSVGElement;

        nestedSvg.setAttribute("data-inline-target", String(index));

        nestedSvg.setAttribute("x", "615");
        nestedSvg.setAttribute("y", "730");
        nestedSvg.setAttribute("width", "164");
        nestedSvg.setAttribute("height", "164");
        nestedSvg.setAttribute(
          "viewBox",
          sourceSvg.getAttribute("viewBox") ?? "0 0 164 164",
        );

        nestedSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        nestedSvg.setAttribute("transform", "rotate(-12 697 812)");

        nestedSvg.style.display = "none";

        Array.from(sourceSvg.childNodes).forEach((node) => {
          nestedSvg.appendChild(ownerDocument.importNode(node, true));
        });

        ropeHead.appendChild(nestedSvg);

        return nestedSvg;
      });
    },
    [],
  );

  const configureScene = useCallback(() => {
    const host = sceneMarkupRef.current;

    const sceneSvg = host?.querySelector<SVGSVGElement>("svg");

    if (!sceneSvg || !targetMarkups.length) return;

    const rope = sceneSvg.querySelector<SVGGElement>(
      'g[class*="section-benefit_rotate"]',
    );

    const ropeLine = rope?.querySelector<SVGGElement>(":scope > g:first-child");

    const ropeHead = rope?.querySelector<SVGGElement>(
      ":scope > g:nth-child(2)",
    );

    const arrowHead = ropeHead?.querySelector<SVGPathElement>("path");

    if (!rope || !ropeLine || !ropeHead || !arrowHead) {
      return;
    }

    const targets = appendInlineTargets(ropeHead, targetMarkups);

    const eyes = sceneSvg.querySelector<SVGGElement>('g[style*="clip-path"]');

    const pupils = eyes
      ? Array.from(eyes.querySelectorAll<SVGGElement>("g[transform]"))
      : [];

    const leftEye = eyes?.querySelector<SVGPathElement>("path") ?? null;

    sceneRef.current = {
      rope,
      ropeLine,
      ropeHead,
      arrowHead,
      eyes,
      leftPupil: pupils[0] ?? null,
      rightPupil: pupils[1] ?? null,
      leftEye,
      targets,
    };

    gsap.set(eyes, {
      clipPath: "inset(0% 0px 0px)",
    });

    gsap.set(rope, {
      transformOrigin: "top center",
    });

    pendulumRef.current?.kill();

    /**
     * Original idle pendulum:
     * 0° → -45° → 30° → 0° over five seconds.
     */
    pendulumRef.current = gsap
      .timeline({
        repeat: -1,
      })
      .to(rope, {
        rotate: -45,
        duration: 1.25,
        ease: "none",
      })
      .to(rope, {
        rotate: 30,
        duration: 2.5,
        ease: "none",
      })
      .to(rope, {
        rotate: 0,
        duration: 1.25,
        ease: "none",
      });

    setIsReady(true);
  }, [appendInlineTargets, targetMarkups]);

  useEffect(() => {
    if (!sceneMarkup || !targetMarkups.length) {
      return;
    }

    /**
     * Wait until React has inserted the scene SVG markup.
     */
    const frameId = requestAnimationFrame(() => {
      configureScene();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [configureScene, sceneMarkup, targetMarkups.length]);

  const launchTarget = useCallback(() => {
    const scene = sceneRef.current;

    if (!scene || activeRef.current) return;

    activeRef.current = true;
    setIsLaunching(true);
    blinkEyes();

    const selectedTarget = Math.floor(Math.random() * scene.targets.length);

    const target = scene.targets[selectedTarget];

    scene.targets.forEach((item) => {
      item.style.display = "none";
    });

    pendulumRef.current?.pause();
    launchTimelineRef.current?.kill();

    launchTimelineRef.current = gsap
      .timeline({
        onComplete: () => {
          target.style.display = "none";

          activeRef.current = false;
          setIsLaunching(false);

          stopEyeTracking();
          blinkEyes();

          pendulumRef.current?.resume();
        },
      })

      /**
       * Throw downward.
       */
      .to(
        scene.ropeLine,
        {
          scaleY: 2,
          transformOrigin: "top center",
          duration: 1,
          ease: "power1.inOut",
        },
        0,
      )
      .to(
        scene.ropeHead,
        {
          y: 727.272,
          duration: 1,
          ease: "power1.inOut",
        },
        0,
      )

      /**
       * Show a real nested SVG target and pull upward.
       */
      .call(() => {
        target.style.display = "block";
        startEyeTracking();
      })
      .to(scene.ropeLine, {
        scaleY: 0.1,
        transformOrigin: "top center",
        duration: 3,
        ease: "power1.inOut",
      })
      .to(
        scene.ropeHead,
        {
          y: -654.5448,
          duration: 3,
          ease: "power1.inOut",
        },
        "<",
      )

      /**
       * Reset.
       */
      .call(() => {
        target.style.display = "none";
        stopEyeTracking();
      })
      .to(scene.ropeLine, {
        scaleY: 1,
        transformOrigin: "top center",
        duration: 1,
        ease: "power1.inOut",
      })
      .to(
        scene.ropeHead,
        {
          y: 0,
          duration: 1,
          ease: "power1.inOut",
        },
        "<",
      );
  }, [blinkEyes, startEyeTracking, stopEyeTracking]);

  /**
   * Scroll parallax.
   */
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add("(min-width: 768px)", () => {
      const stage = stageRef.current;
      const section = sectionRef.current;

      if (!stage || !section) return;

      gsap.fromTo(
        stage,
        {
          yPercent: -30,
        },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "center center",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => {
      media.revert();
    };
  }, []);

  /**
   * Random idle eye blinking.
   */
  useEffect(() => {
    if (!isReady || isLaunching) return;

    const scheduleBlink = () => {
      blinkTimerRef.current = window.setTimeout(
        () => {
          blinkEyes();
          scheduleBlink();
        },
        2000 + Math.random() * 2000,
      );
    };

    scheduleBlink();

    return () => {
      if (blinkTimerRef.current) {
        window.clearTimeout(blinkTimerRef.current);
      }
    };
  }, [blinkEyes, isLaunching, isReady]);

  /**
   * Supporting Lottie animations render as SVG.
   */
  useEffect(() => {
    let mounted = true;
    const animations: AnimationItem[] = [];

    const loadAnimations = async () => {
      const lottie = (await import("lottie-web")).default;

      if (!mounted) return;

      if (catLottieRef.current) {
        animations.push(
          lottie.loadAnimation({
            container: catLottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: catLottiePath,
            rendererSettings: {
              preserveAspectRatio: "xMidYMax slice",
            },
          }),
        );
      }

      if (bottomLottieRef.current) {
        animations.push(
          lottie.loadAnimation({
            container: bottomLottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: bottomLottiePath,
            rendererSettings: {
              preserveAspectRatio: "xMidYMax slice",
            },
          }),
        );
      }
    };

    loadAnimations();

    return () => {
      mounted = false;

      animations.forEach((animation) => {
        animation.destroy();
      });
    };
  }, [bottomLottiePath, catLottiePath]);

  useEffect(() => {
    return () => {
      pendulumRef.current?.kill();
      launchTimelineRef.current?.kill();

      if (blinkTimerRef.current) {
        window.clearTimeout(blinkTimerRef.current);
      }

      stopEyeTracking();
    };
  }, [stopEyeTracking]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div
        ref={stageRef}
        className={styles.stage}
        data-cursor-theme="white"
        data-cursor-stretch="true"
        data-cursor-media=""
      >
        <div className={styles.overflowFrame}>
          <div className="container z-10 flex-1">
            {/* Main inline SVG scene */}
            <div className="absolute inset-0 block">
              <div className={styles.backgroundContainer}>
                <div
                  className={styles.background}
                  data-cursor-variant={isLaunching ? "default" : "text"}
                  data-cursor-theme="white"
                  data-cursor-stretch="true"
                  data-cursor-text="Click Me"
                  data-cursor-media=""
                  onClick={launchTarget}
                  role="button"
                  tabIndex={0}
                  aria-label="Launch a target"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      launchTarget();
                    }
                  }}
                >
                  <div
                    ref={sceneMarkupRef}
                    className={styles.sceneSvg}
                    dangerouslySetInnerHTML={{
                      __html: sceneMarkup,
                    }}
                  />

                  <div
                    ref={catLottieRef}
                    className={styles.catLottie}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Foreground copy */}
            <div className={styles.content}>
              <div className={styles.title}>{title}</div>

              <p className={styles.description}>{description}</p>

              <Link href={ctaHref} className={styles.cta}>
                <span className={styles.ctaRipple} />

                <span className="relative z-10">{ctaLabel}</span>
              </Link>
            </div>
          </div>

          {/* Bottom SVG / Lottie strip */}
          <div className={styles.bottomStrip}>
            <div
              className={styles.mobileGround}
              dangerouslySetInnerHTML={{
                __html: mobileGroundMarkup,
              }}
            />

            <div
              ref={bottomLottieRef}
              className={styles.bottomLottie}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesBenefitSection;
