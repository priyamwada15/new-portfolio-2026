"use client";

import { Briefcase, DiscoBall, FileText, LinkedinLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./animate-ui/tooltip";
import {
  CASE_STUDY_CHROME_BG,
  HOME_V2_PAGE_BG,
  PLAYGROUND_PAGE_BG,
  SITE_DEFAULT_PAGE_BG,
} from "@/design-system";
import { useHideOnScroll } from "./useHideOnScroll";
import { isCaseStudyPath } from "../lib/caseStudy";
import { CopyEmailIcon } from "./CopyEmailIcon";
import { NavBrandLink } from "./NavBrandLink";

const tiltTransition = "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)" as const;

function useTilt(deg: number) {
  const [hovered, setHovered] = useState(false);
  return {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    iconStyle: {
      display: "inline-flex",
      transform: hovered ? `rotate(${deg}deg)` : "rotate(0deg)",
      transition: tiltTransition,
    } as React.CSSProperties,
  };
}

// Playground's page background is dark (#0a0a0a); Nav's default icon/text
// colors are tuned for the site's light-background pages and read as
// near-invisible there. Not promoted to a design-system token yet — this
// is the only page using it.
const PLAYGROUND_NAV_ICON_COLOR = "#F6F6FB";

const navTextClass = "cursor-hover-pointer text-[14px] leading-none transition-opacity hover:opacity-75";

export default function Nav() {
  const pathname = usePathname();
  const isHomeV2 = pathname === "/";
  const isCaseStudy = pathname ? isCaseStudyPath(pathname) : false;
  const isPlayground =
    pathname === "/playground" || (pathname?.startsWith("/playground/") ?? false);
  const caseStudyBg = isCaseStudy ? CASE_STUDY_CHROME_BG : null;
  const navIconColor = isPlayground ? PLAYGROUND_NAV_ICON_COLOR : "#555555";
  // Current page link is rose; Playground's dark page uses the lifted rose
  const navActiveColor = isPlayground
    ? "var(--ds-nav-active-on-dark)"
    : "var(--ds-nav-active)";
  const navTextStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-hind), sans-serif",
    fontWeight: 500,
    color: active ? navActiveColor : navIconColor,
  });
  // Solid fill behind the sticky nav so scrolled content doesn't show through it
  const navSurfaceBg = isHomeV2
    ? HOME_V2_PAGE_BG
    : isPlayground
      ? PLAYGROUND_PAGE_BG
      : (caseStudyBg ?? SITE_DEFAULT_PAGE_BG);
  const navHidden = useHideOnScroll();

  const work = useTilt(8);
  const disco = useTilt(-8);
  const linkedin = useTilt(8);
  const mail = useTilt(-8);
  const resume = useTilt(8);

  return (
    // Sticky wrapper slides the nav up while scrolling down and back on scroll up.
    // Kept separate from the inner div because its hero-intro animation holds a transform.
    <div
      className="site-nav-sticky"
      data-hidden={navHidden || undefined}
      style={{ backgroundColor: navSurfaceBg }}
    >
    <div
      className="relative z-50 w-full pt-[16px] pb-[16px] xl:pt-8 xl:pb-2 hero-intro hero-intro--nav-top"
      style={caseStudyBg ? { backgroundColor: caseStudyBg } : undefined}
    >
      <div className="w-[86%] max-w-[1008px] mx-auto pointer-events-auto">
        <TooltipProvider openDelay={150} closeDelay={150}>
          <div className="relative rounded-full">
            <div
              className="relative flex items-center justify-between h-[60px] rounded-full"
              style={{
                background: caseStudyBg
                  ? caseStudyBg
                  : isHomeV2
                    ? "rgba(255, 255, 255, 0.15)"
                    : "transparent",
              }}
            >
              <NavBrandLink
                href="/"
                className={`cursor-hover-pointer rounded-full transition-opacity ${pathname === "/" ? "" : "hover:opacity-75"}`}
                style={{ padding: "6px 12px 6px 0", display: "flex", alignItems: "center" }}
                textColor={isPlayground ? PLAYGROUND_NAV_ICON_COLOR : undefined}
                logoSrc={isPlayground ? "/logos/nav-logo-playground.svg" : undefined}
              />

              {/* Text links from 640px up */}
              <div className="hidden sm:flex items-center gap-6">
                <Link
                  href="/"
                  className={navTextClass}
                  style={navTextStyle(isHomeV2)}
                  aria-current={isHomeV2 ? "page" : undefined}
                >
                  work
                </Link>
                <Link
                  href="/playground"
                  className={navTextClass}
                  style={navTextStyle(isPlayground)}
                  aria-current={isPlayground ? "page" : undefined}
                >
                  playground
                </Link>
                <a
                  href="https://www.linkedin.com/in/priyamwadapandey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navTextClass}
                  style={navTextStyle(false)}
                >
                  linkedin
                </a>
                <CopyEmailIcon
                  tooltipSide="bottom"
                  label="contact"
                  labelStyle={navTextStyle(false)}
                  className={navTextClass}
                />
                <a
                  href="/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navTextClass}
                  style={navTextStyle(false)}
                >
                  resume
                </a>
              </div>

              {/* Icons below 640px */}
              <div className="flex sm:hidden items-center gap-3">
                <Tooltip side="bottom" sideOffset={8}>
                  <TooltipTrigger
                    asChild
                    onMouseEnter={work.onMouseEnter}
                    onMouseLeave={work.onMouseLeave}
                  >
                    <Link
                      href="/"
                      className="cursor-hover-pointer flex items-center justify-center w-8 h-8"
                      aria-label="Work"
                      aria-current={isHomeV2 ? "page" : undefined}
                    >
                      <span style={work.iconStyle}>
                        <Briefcase size={24} color={isHomeV2 ? navActiveColor : navIconColor} weight="regular" aria-hidden />
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Work</TooltipContent>
                </Tooltip>

                <Tooltip side="bottom" sideOffset={8}>
                  <TooltipTrigger
                    asChild
                    onMouseEnter={disco.onMouseEnter}
                    onMouseLeave={disco.onMouseLeave}
                  >
                    <Link
                      href="/playground"
                      className="cursor-hover-pointer flex items-center justify-center w-8 h-8"
                      aria-label="Playground"
                      aria-current={isPlayground ? "page" : undefined}
                    >
                      <span style={disco.iconStyle}>
                        <DiscoBall size={24} color={isPlayground ? navActiveColor : navIconColor} weight="regular" aria-hidden />
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Playground</TooltipContent>
                </Tooltip>

                <Tooltip side="bottom" sideOffset={8}>
                  <TooltipTrigger
                    asChild
                    onMouseEnter={linkedin.onMouseEnter}
                    onMouseLeave={linkedin.onMouseLeave}
                  >
                    <a
                      href="https://www.linkedin.com/in/priyamwadapandey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-hover-pointer flex items-center justify-center w-8 h-8"
                      aria-label="LinkedIn"
                    >
                      <span style={linkedin.iconStyle}>
                        <LinkedinLogo size={24} color={navIconColor} weight="regular" aria-hidden />
                      </span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>LinkedIn</TooltipContent>
                </Tooltip>

                <CopyEmailIcon
                  tooltipSide="bottom"
                  iconColor={navIconColor}
                  onMouseEnter={mail.onMouseEnter}
                  onMouseLeave={mail.onMouseLeave}
                  iconStyle={mail.iconStyle}
                  className="cursor-hover-pointer"
                />

                <Tooltip side="bottom" sideOffset={8}>
                  <TooltipTrigger
                    asChild
                    onMouseEnter={resume.onMouseEnter}
                    onMouseLeave={resume.onMouseLeave}
                  >
                    <a
                      href="/resume"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-hover-pointer flex items-center justify-center w-8 h-8"
                      aria-label="Resume"
                    >
                      <span style={resume.iconStyle}>
                        <FileText size={24} color={navIconColor} weight="regular" aria-hidden />
                      </span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Resume</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
    </div>
  );
}
