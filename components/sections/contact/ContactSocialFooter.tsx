"use client";

import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import gsap from "gsap";
import styles from "../../../styles/ContactSocialFooter.module.css";

export type SocialLink = {
  name: string;
  href: string;
};

export type SocialLinkGroup = SocialLink[];

type ContactSocialFooterProps = {
  heading?: string;
  groups?: SocialLinkGroup[];

  /**
   * Optional API endpoint.
   *
   * Expected response:
   * {
   *   data: [
   *     [{ name: "Behance", href: "..." }, ...],
   *     [{ name: "Instagram", href: "..." }, ...]
   *   ]
   * }
   *
   * Leave empty to use the local `groups` prop or the defaults below.
   */
  apiUrl?: string;

  brandLabel?: string;
};

const defaultGroups: SocialLinkGroup[] = [
  [
    {
      name: "Behance",
      href: "https://www.behance.net/pitstudio",
    },
    {
      name: "Dribbble",
      href: "https://dribbble.com/PitStudio",
    },
    {
      name: "UI8",
      href: "https://ui8.net/pit-studio",
    },
  ],
  [
    {
      name: "Instagram",
      href: "https://www.instagram.com/pit.studio",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/PitStudio.co",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/pitstudio/",
    },
  ],
];

/**
 * Rotates a point around the origin.
 *
 * The original footer rotates the pointer offset by -45 degrees
 * before applying it to the ellipse background.
 */
const rotatePoint = (x: number, y: number, angleInDegrees = -45) => {
  const radians = angleInDegrees * (Math.PI / 180);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: Math.floor((x * cos + y * sin) * 100) / 100,
    y: Math.floor((-x * sin + y * cos) * 100) / 100,
  };
};

const getEllipseElements = (anchor: HTMLAnchorElement) => {
  const ellipse = anchor.querySelector<HTMLElement>("[data-social-ellipse]");

  const background = anchor.querySelector<HTMLElement>(
    "[data-social-background]",
  );

  if (!ellipse || !background) return null;

  return {
    ellipse,
    background,
  };
};

const getPointerOffset = (
  event: ReactMouseEvent<HTMLAnchorElement>,
  ellipse: HTMLElement,
) => {
  const bounds = ellipse.getBoundingClientRect();

  const x = event.clientX - bounds.left - bounds.width / 2;

  const y = event.clientY - bounds.top - bounds.height / 2;

  return rotatePoint(x, y, -45);
};

const ContactSocialFooter = ({
  heading = "See us more on",
  groups = defaultGroups,
  apiUrl,
  brandLabel = "PIT STUDIO — DIGITAL PRODUCT STUDIO",
}: ContactSocialFooterProps) => {
  const [socialGroups, setSocialGroups] = useState<SocialLinkGroup[]>(groups);

  const currentYear = useMemo(() => {
    return new Date().getFullYear();
  }, []);

  /**
   * The original page retrieves the grouped social links from an API.
   * This remains optional so the component also works with local data.
   */
  useEffect(() => {
    if (!apiUrl) return;

    let ignoreResponse = false;

    const loadSocialLinks = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Unable to load footer links: ${response.status}`);
        }

        const payload: {
          data?: SocialLinkGroup[];
        } = await response.json();

        if (!ignoreResponse && Array.isArray(payload.data)) {
          setSocialGroups(payload.data);
        }
      } catch (error) {
        /**
         * Keep the local fallback links if the endpoint fails.
         */
        console.error(error);
      }
    };

    loadSocialLinks();

    return () => {
      ignoreResponse = true;
    };
  }, [apiUrl]);

  /**
   * Enter animation:
   * Start the white fill beyond the pointer entry position,
   * then animate it back into the center.
   */
  const handleMouseEnter = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const elements = getEllipseElements(event.currentTarget);

    if (!elements) return;

    const offset = getPointerOffset(event, elements.ellipse);

    gsap.set(elements.background, {
      x: 1.2 * offset.x,
      y: 1.2 * offset.y,
    });

    gsap.to(elements.background, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: true,
    });
  };

  /**
   * Exit animation:
   * Move the white fill toward the pointer exit direction.
   */
  const handleMouseLeave = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const elements = getEllipseElements(event.currentTarget);

    if (!elements) return;

    const offset = getPointerOffset(event, elements.ellipse);

    gsap.to(elements.background, {
      x: offset.x,
      y: offset.y,
      duration: 0.4,
      ease: "power3.in",
      overwrite: true,
    });
  };

  return (
    <footer
      className="theme__dark bg-neutral-800 text-neutral-0"
      data-cursor-theme="white"
      data-cursor-stretch="true"
      data-cursor-media=""
    >
      <div className={`container ${styles.content}`}>
        <div className="text-center text-h8 font-medium md:text-h7 lg:text-h5 xl:text-h3">
          {heading}
        </div>

        <div className={styles.socialContainer}>
          {socialGroups.map((group, groupIndex) => (
            <div
              key={`social-group-${groupIndex}`}
              className="flex w-full justify-center gap-x-4 py-[4.5rem] md:w-1/2 md:gap-x-3 lg:gap-x-4 lg:py-24 xl:gap-x-6 xl:py-[8.125rem]"
            >
              {group.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.social}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={styles.socialDetail}>
                    <div className={styles.borderContainer}>
                      <div data-social-ellipse className={styles.ellipse}>
                        <div
                          data-social-background
                          className={styles.background}
                        >
                          <div />
                        </div>
                      </div>
                    </div>

                    <span className="pointer-events-none relative z-10 text-white">
                      {social.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-0/10 py-5 text-center text-xxs lg:py-[1.875rem] lg:text-tn xl:mt-20 xl:py-10 xl:text-sm">
        <span className="mr-8">© {currentYear}</span>

        <span>{brandLabel}</span>
      </div>
    </footer>
  );
};

export default ContactSocialFooter;
