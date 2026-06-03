// "use client";

// import React, { useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
// import Link from "next/link";

// const navLinks = [
//   { label: "Work", href: "/work" },
//   { label: "Services", href: "/services" },
//   { label: "Studio", href: "/studio" },
//   { label: "Contact", href: "/contact" },
// ];

// const Header = () => {
//   const headerRef = useRef<HTMLElement | null>(null);
//   const navRef = useRef<HTMLDivElement | null>(null);
//   const lastScroll = useRef(0);

//   useLayoutEffect(() => {
//     const header = headerRef.current;
//     if (!header) return;

//     gsap.fromTo(
//       header,
//       { y: -40, opacity: 0 },
//       { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
//     );

//     const handleScroll = () => {
//       const currentScroll = window.scrollY;
//       const isScrolled = currentScroll > 200;

//       gsap.to(header, {
//         backgroundColor: isScrolled ? "#000000" : "transparent",
//         color: isScrolled ? "#ffffff" : "#000000",
//         duration: 0.35,
//         ease: "power3.out",
//       });

//       gsap.to(navRef.current, {
//         paddingTop: isScrolled ? "1.5rem" : "3rem",
//       });

//       if (currentScroll > lastScroll.current && currentScroll > 80) {
//         gsap.to(header, {
//           y: -100,
//           opacity: 0,
//           duration: 0.45,
//           ease: "power3.out",
//         });
//       } else {
//         gsap.to(header, {
//           y: 0,
//           opacity: 1,
//           duration: 0.45,
//           ease: "power3.out",
//         });
//       }

//       lastScroll.current = currentScroll;
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header
//       ref={headerRef}
//       className="sticky top-0 left-0 w-full z-50"
//       data-cursor-theme="dark"
//       data-cursor-stretch="true"
//     >
//       <nav
//         ref={navRef}
//         className="container mx-auto pt-12 pb-6 py-5 flex items-center justify-between duration-100 transition-all"
//       >
//         <Link href="/" aria-label="PIT Studio Home" className="block">
//           <svg
//             width="168"
//             height="24"
//             viewBox="0 0 168 24"
//             fill="currentColor"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M11.0768 0H0V11.0769C6.11756 11.0769 11.0768 6.11762 11.0768 0Z"
//               fill="#13AF88"
//             ></path>
//             <path
//               d="M14.7691 0C14.7691 8.15682 8.15675 14.7692 0 14.7692V24H23.9998V0H14.7691Z"
//               fill="#13AF88"
//             ></path>
//             <path
//               d="M35.0542 3.69173V20.309H38.3821V14.575H40.9455C42.9917 14.575 44.5208 14.0578 45.5327 13.046C46.5445 12.0116 47.0617 10.7299 47.0617 9.17835C47.0617 7.64929 46.567 6.3451 45.5776 5.28825C44.6107 4.2314 43.1491 3.69173 41.1929 3.69173H35.0542ZM38.3821 11.5619V6.77233H41.2378C42.7444 6.77233 43.6663 7.80669 43.6663 9.13338C43.6663 10.4825 42.7669 11.5619 41.058 11.5619H38.3821Z"
//               fill="currentColor"
//             ></path>
//             <path
//               d="M50.0899 20.309H53.4403V3.69173H50.0899V20.309Z"
//               fill="currentColor"
//             ></path>
//             <path
//               d="M61.0288 20.309H64.4017V6.90725H69.1463V3.69173H56.2843V6.90725H61.0288V20.309Z"
//               fill="currentColor"
//             ></path>
//             <path
//               d="M82.3338 20.5788C84.1551 20.5788 85.6167 20.1066 86.741 19.1622C87.8653 18.2178 88.4275 17.0035 88.4275 15.5194C88.4275 13.6756 87.483 12.3039 85.5942 11.382C85.167 11.1796 84.4924 10.8873 83.5705 10.505L81.929 9.78547C81.0296 9.33575 80.5799 8.79608 80.5799 8.14399C80.5799 7.17708 81.3893 6.54747 82.716 6.54747C83.9527 6.54747 85.4368 7.10962 86.3587 8.09901L88.1351 5.67051C86.6511 4.16394 84.8297 3.4219 82.671 3.4219C81.0071 3.4219 79.6354 3.89411 78.5786 4.81604C77.5218 5.73797 77.0046 6.88476 77.0046 8.2789C77.0046 10.0328 77.8815 11.4045 79.6354 12.4163C80.0852 12.6637 80.7373 12.9785 81.5917 13.3158C82.4687 13.6531 83.0083 13.8555 83.2332 13.9679C84.2451 14.4401 84.7398 15.0247 84.7398 15.6993C84.7398 16.7562 83.7279 17.4757 82.3562 17.4757C80.6473 17.4757 79.0283 16.6662 77.949 15.1597L76.0377 17.4757C77.4093 19.477 79.7479 20.5788 82.3338 20.5788Z"
//               fill="currentColor"
//             ></path>
//             <path
//               d="M94.7393 20.309H98.1122V6.90725H102.857V3.69173H89.9948V6.90725H94.7393V20.309Z"
//               fill="currentColor"
//             ></path>
//             <path
//               d="M105.501 14.2377C105.501 16.3289 106.108 17.903 107.345 18.9823C108.582 20.0616 110.133 20.6013 112 20.6013C113.866 20.6013 115.418 20.0616 116.632 18.9823C117.869 17.903 118.476 16.3289 118.476 14.2377V3.69173H115.103V14.0129C115.103 16.1715 113.889 17.3633 112 17.3633C110.043 17.3633 108.852 16.239 108.852 14.0129V3.69173H105.501V14.2377Z"
//               fill="currentColor"
//             ></path>
//             <path
//               d="M129.013 20.309C131.554 20.309 133.533 19.5669 134.972 18.0829C136.433 16.5988 137.153 14.575 137.153 12.0341C137.153 9.44818 136.433 7.42443 135.017 5.94034C133.6 4.43378 131.644 3.69173 129.148 3.69173H122.649V20.309H129.013ZM125.977 6.88476H129.17C130.609 6.88476 131.711 7.37946 132.498 8.34636C133.285 9.31326 133.69 10.505 133.69 11.9666C133.69 13.4507 133.285 14.6874 132.498 15.6543C131.711 16.6213 130.609 17.1159 129.17 17.1159H125.977V6.88476Z"
//               fill="currentColor"
//             ></path>
//             <path
//               d="M140.628 20.309H143.978V3.69173H140.628V20.309Z"
//               fill="currentColor"
//             ></path>
//             <path
//               d="M156.019 20.5788C158.47 20.5788 160.516 19.7468 162.18 18.0829C163.866 16.4189 164.698 14.3951 164.698 12.0116C164.698 9.62807 163.866 7.60432 162.18 5.91786C160.516 4.2314 158.47 3.39941 156.041 3.39941C153.613 3.39941 151.566 4.2314 149.88 5.91786C148.216 7.60432 147.384 9.65056 147.384 12.0566C147.384 14.4626 148.216 16.4863 149.858 18.1278C151.499 19.7693 153.568 20.5788 156.019 20.5788ZM161.235 12.0116C161.258 13.5182 160.763 14.7774 159.751 15.7893C158.739 16.8011 157.503 17.2958 156.041 17.2958C154.58 17.2958 153.343 16.8011 152.331 15.7893C151.342 14.7774 150.847 13.5182 150.847 12.0116C150.847 10.505 151.342 9.22332 152.353 8.21144C153.365 7.19957 154.58 6.68239 156.041 6.68239C157.503 6.68239 158.717 7.19957 159.729 8.21144C160.741 9.22332 161.235 10.4825 161.235 12.0116Z"
//               fill="currentColor"
//             ></path>
//           </svg>
//         </Link>

//         <ul className="hidden md:flex items-center gap-18">
//           {navLinks.map((item) => (
//             <li key={item.label}>
//               <Link
//                 href={item.href}
//                 // className="text-sm uppercase tracking-wide hover:opacity-60 transition-opacity"
//               >
//                 <span className="relative block group peer text-rotate-3d uppercase font-medium [perspective:1000px]">
//                   <span className="text-rotate-top transition-all duration-300 origin-top ease-default">
//                     {item.label}
//                   </span>
//                   <span className="text-rotate-bottom transition-all duration-300 origin-bottom ease-default text-primary-600">
//                     {item.label}
//                   </span>
//                 </span>
//               </Link>
//             </li>
//           ))}
//         </ul>

//         <button
//           className="md:hidden w-6 h-6 flex flex-col justify-center gap-1"
//           type="button"
//           aria-label="Open menu"
//         >
//           <span className="block h-0.5 w-full bg-current" />
//           <span className="block h-0.5 w-full bg-current" />
//         </button>
//       </nav>
//     </header>
//   );
// };

// export default Header;

"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";

type NavLink = {
  label: string;
  href: string;
  darkHeader?: boolean;
};

const navLinks: NavLink[] = [
  {
    label: "Work",
    href: "/work",
    darkHeader: true,
  },
  {
    label: "Services",
    href: "/services",
    darkHeader: false,
  },
  {
    label: "Studio",
    href: "/studio",
    darkHeader: false,
  },
  {
    label: "Contact",
    href: "/contact",
    darkHeader: true,
  },
];

/**
 * Add routes here when they should use a black header
 * but are not included in the navigation menu.
 *
 * Nested pages are included automatically.
 * Example: "/projects" also matches "/projects/project-name".
 */
const extraDarkHeaderRoutes = ["/projects"];

const matchesRoute = (pathname: string, route: string) => {
  if (route === "/") return pathname === "/";

  return pathname === route || pathname.startsWith(`${route}/`);
};

const Header = () => {
  const pathname = usePathname() ?? "/";

  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const lastScrollRef = useRef(0);
  const darkStateRef = useRef(false);

  const [isDarkHeader, setIsDarkHeader] = useState(false);

  const darkHeaderRoutes = useMemo(() => {
    const navDarkRoutes = navLinks
      .filter((item) => item.darkHeader)
      .map((item) => item.href);

    return [...navDarkRoutes, ...extraDarkHeaderRoutes];
  }, []);

  const isDarkPage = useMemo(() => {
    return darkHeaderRoutes.some((route) => {
      return matchesRoute(pathname, route);
    });
  }, [darkHeaderRoutes, pathname]);

  /**
   * Header entrance animation.
   */
  useLayoutEffect(() => {
    const header = headerRef.current;

    if (!header) return;

    gsap.fromTo(
      header,
      {
        y: -40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      },
    );
  }, []);

  /**
   * Header route theme and scroll behavior.
   */
  useLayoutEffect(() => {
    const header = headerRef.current;
    const nav = navRef.current;

    if (!header || !nav) return;

    lastScrollRef.current = window.scrollY;

    const updateHeader = () => {
      const currentScroll = window.scrollY;
      const isScrolled = currentScroll > 200;

      /**
       * Header should be dark:
       * 1. On a configured dark route.
       * 2. After scrolling more than 200px on any page.
       */
      const shouldUseDarkHeader = isDarkPage || isScrolled;

      /**
       * Hide the header while scrolling down.
       * Reveal it while scrolling up.
       */
      const isScrollingDown =
        currentScroll > lastScrollRef.current && currentScroll > 80;

      gsap.to(header, {
        backgroundColor: shouldUseDarkHeader ? "#181818" : "rgba(0, 0, 0, 0)",
        color: shouldUseDarkHeader ? "#ffffff" : "#181818",
        y: isScrollingDown ? -100 : 0,
        opacity: isScrollingDown ? 0 : 1,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(nav, {
        paddingTop: isScrolled ? "1.5rem" : "3rem",
        paddingBottom: isScrolled ? "1.5rem" : "1.5rem",
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (darkStateRef.current !== shouldUseDarkHeader) {
        darkStateRef.current = shouldUseDarkHeader;
        setIsDarkHeader(shouldUseDarkHeader);
      }

      lastScrollRef.current = currentScroll;
    };

    /**
     * Run immediately when the page changes.
     */
    updateHeader();

    window.addEventListener("scroll", updateHeader, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateHeader);
    };
  }, [isDarkPage]);

  return (
    <header
      ref={headerRef}
      className={`sticky left-0 top-0 z-50 w-full ${
        isDarkPage ? "bg-neutral-800 text-white" : "bg-transparent text-black"
      }`}
      data-cursor-theme={isDarkHeader ? "white" : "dark"}
      data-cursor-stretch="true"
    >
      <nav
        ref={navRef}
        className="container mx-auto flex items-center justify-between pb-6 pt-12"
      >
        {/* Logo */}
        <Link href="/" aria-label="PIT Studio Home" className="block">
          <svg
            width="168"
            height="24"
            viewBox="0 0 168 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.0768 0H0V11.0769C6.11756 11.0769 11.0768 6.11762 11.0768 0Z"
              fill="#13AF88"
            />
            <path
              d="M14.7691 0C14.7691 8.15682 8.15675 14.7692 0 14.7692V24H23.9998V0H14.7691Z"
              fill="#13AF88"
            />
            <path
              d="M35.0542 3.69173V20.309H38.3821V14.575H40.9455C42.9917 14.575 44.5208 14.0578 45.5327 13.046C46.5445 12.0116 47.0617 10.7299 47.0617 9.17835C47.0617 7.64929 46.567 6.3451 45.5776 5.28825C44.6107 4.2314 43.1491 3.69173 41.1929 3.69173H35.0542ZM38.3821 11.5619V6.77233H41.2378C42.7444 6.77233 43.6663 7.80669 43.6663 9.13338C43.6663 10.4825 42.7669 11.5619 41.058 11.5619H38.3821Z"
              fill="currentColor"
            />
            <path
              d="M50.0899 20.309H53.4403V3.69173H50.0899V20.309Z"
              fill="currentColor"
            />
            <path
              d="M61.0288 20.309H64.4017V6.90725H69.1463V3.69173H56.2843V6.90725H61.0288V20.309Z"
              fill="currentColor"
            />
            <path
              d="M82.3338 20.5788C84.1551 20.5788 85.6167 20.1066 86.741 19.1622C87.8653 18.2178 88.4275 17.0035 88.4275 15.5194C88.4275 13.6756 87.483 12.3039 85.5942 11.382C85.167 11.1796 84.4924 10.8873 83.5705 10.505L81.929 9.78547C81.0296 9.33575 80.5799 8.79608 80.5799 8.14399C80.5799 7.17708 81.3893 6.54747 82.716 6.54747C83.9527 6.54747 85.4368 7.10962 86.3587 8.09901L88.1351 5.67051C86.6511 4.16394 84.8297 3.4219 82.671 3.4219C81.0071 3.4219 79.6354 3.89411 78.5786 4.81604C77.5218 5.73797 77.0046 6.88476 77.0046 8.2789C77.0046 10.0328 77.8815 11.4045 79.6354 12.4163C80.0852 12.6637 80.7373 12.9785 81.5917 13.3158C82.4687 13.6531 83.0083 13.8555 83.2332 13.9679C84.2451 14.4401 84.7398 15.0247 84.7398 15.6993C84.7398 16.7562 83.7279 17.4757 82.3562 17.4757C80.6473 17.4757 79.0283 16.6662 77.949 15.1597L76.0377 17.4757C77.4093 19.477 79.7479 20.5788 82.3338 20.5788Z"
              fill="currentColor"
            />
            <path
              d="M94.7393 20.309H98.1122V6.90725H102.857V3.69173H89.9948V6.90725H94.7393V20.309Z"
              fill="currentColor"
            />
            <path
              d="M105.501 14.2377C105.501 16.3289 106.108 17.903 107.345 18.9823C108.582 20.0616 110.133 20.6013 112 20.6013C113.866 20.6013 115.418 20.0616 116.632 18.9823C117.869 17.903 118.476 16.3289 118.476 14.2377V3.69173H115.103V14.0129C115.103 16.1715 113.889 17.3633 112 17.3633C110.043 17.3633 108.852 16.239 108.852 14.0129V3.69173H105.501V14.2377Z"
              fill="currentColor"
            />
            <path
              d="M129.013 20.309C131.554 20.309 133.533 19.5669 134.972 18.0829C136.433 16.5988 137.153 14.575 137.153 12.0341C137.153 9.44818 136.433 7.42443 135.017 5.94034C133.6 4.43378 131.644 3.69173 129.148 3.69173H122.649V20.309H129.013ZM125.977 6.88476H129.17C130.609 6.88476 131.711 7.37946 132.498 8.34636C133.285 9.31326 133.69 10.505 133.69 11.9666C133.69 13.4507 133.285 14.6874 132.498 15.6543C131.711 16.6213 130.609 17.1159 129.17 17.1159H125.977V6.88476Z"
              fill="currentColor"
            />
            <path
              d="M140.628 20.309H143.978V3.69173H140.628V20.309Z"
              fill="currentColor"
            />
            <path
              d="M156.019 20.5788C158.47 20.5788 160.516 19.7468 162.18 18.0829C163.866 16.4189 164.698 14.3951 164.698 12.0116C164.698 9.62807 163.866 7.60432 162.18 5.91786C160.516 4.2314 158.47 3.39941 156.041 3.39941C153.613 3.39941 151.566 4.2314 149.88 5.91786C148.216 7.60432 147.384 9.65056 147.384 12.0566C147.384 14.4626 148.216 16.4863 149.858 18.1278C151.499 19.7693 153.568 20.5788 156.019 20.5788ZM161.235 12.0116C161.258 13.5182 160.763 14.7774 159.751 15.7893C158.739 16.8011 157.503 17.2958 156.041 17.2958C154.58 17.2958 153.343 16.8011 152.331 15.7893C151.342 14.7774 150.847 13.5182 150.847 12.0116C150.847 10.505 151.342 9.22332 152.353 8.21144C153.365 7.19957 154.58 6.68239 156.041 6.68239C157.503 6.68239 158.717 7.19957 159.729 8.21144C160.741 9.22332 161.235 10.4825 161.235 12.0116Z"
              fill="currentColor"
            />
          </svg>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-18 md:flex">
          {navLinks.map((item) => {
            const isActive = matchesRoute(pathname, item.href);

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className="text-rotate-3d group relative block font-medium uppercase [perspective:1000px]"
                    aria-selected={isActive}
                  >
                    <span className="text-rotate-top origin-top transition-all duration-300 ease-default">
                      {item.label}
                    </span>

                    <span className="text-rotate-bottom origin-bottom text-primary-600 transition-all duration-300 ease-default">
                      {item.label}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="flex h-6 w-6 flex-col justify-center gap-1 md:hidden"
          type="button"
          aria-label="Open menu"
        >
          <span className="block h-0.5 w-full bg-current" />
          <span className="block h-0.5 w-full bg-current" />
        </button>
      </nav>
    </header>
  );
};

export default Header;
