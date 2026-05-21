"use client";

import {
  FileText,
  HandWaving,
  LinkedinLogo,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./animate-ui/tooltip";
import { isCaseStudyPath } from "../lib/caseStudy";
import { CopyEmailIcon } from "./CopyEmailIcon";
import { NavBrandLink } from "./NavBrandLink";

const hind = { fontFamily: "var(--font-hind), sans-serif" } as const;
const tiltTransition = "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)" as const;

const NAV_SHELL_SHADOW =
  "0 8px 28px -6px rgba(0, 0, 0, 0.045), 0 2px 6px -2px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.4)";

/** Border-only mask — glow layer must sit above the nav fill, not behind it. */
const BORDER_GLOW_MASK: React.CSSProperties = {
  padding: "2px",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
};

/** #744577 — visible on #FAFAFA and the frosted nav bar. */
const NAV_BORDER_GLOW_RGB = "116, 69, 119";

/**
 * Ellipse tightens toward the edge under the cursor so the opposite border
 * gets little or no glow (e.g. cursor on top → thin glow on the bottom).
 */
function borderGlowBackground(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const fromTop = y / height;
  const fromBottom = 1 - fromTop;
  const fromLeft = x / width;
  const fromRight = 1 - fromLeft;

  const nearVerticalEdge = Math.min(fromTop, fromBottom);
  const nearHorizontalEdge = Math.min(fromLeft, fromRight);

  const rx = 48 + nearHorizontalEdge * 160;
  const ry = 28 + nearVerticalEdge * 100;

  return `radial-gradient(${rx}px ${ry}px at ${x}px ${y}px, rgba(${NAV_BORDER_GLOW_RGB}, 0.95) 0%, rgba(${NAV_BORDER_GLOW_RGB}, 0.55) 26%, rgba(${NAV_BORDER_GLOW_RGB}, 0.18) 44%, transparent 58%)`;
}

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

export default function Nav() {
  const pathname = usePathname();
  const isCaseStudy = isCaseStudyPath(pathname);
  const [scrolledDown, setScrolledDown] = useState(false);
  const navShellRef = useRef<HTMLDivElement>(null);
  const borderGlowRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const setBorderGlow = useCallback(
    (clientX: number, clientY: number, visible: boolean) => {
      const shell = navShellRef.current;
      const glow = borderGlowRef.current;
      if (!shell || !glow || reducedMotionRef.current) return;

      const rect = shell.getBoundingClientRect();
      glow.style.opacity = visible ? "1" : "0";
      if (visible) {
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        glow.style.background = borderGlowBackground(
          x,
          y,
          rect.width,
          rect.height,
        );
      }
    },
    [],
  );

  const handleShellMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setBorderGlow(event.clientX, event.clientY, true);
  };

  const handleShellMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setBorderGlow(event.clientX, event.clientY, true);
  };

  const handleShellMouseLeave = () => {
    setBorderGlow(0, 0, false);
  };

  useEffect(() => {
    if (!isCaseStudy) { setScrolledDown(false); return; }
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) setScrolledDown(true);
      else if (y < lastY) setScrolledDown(false);
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCaseStudy]);

  const navHiddenByScroll = isCaseStudy && scrolledDown;

  const about    = useTilt(-8);
  const linkedin = useTilt(8);
  const mail     = useTilt(-8);
  const resume   = useTilt(8);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 pt-4 pb-2 pointer-events-none"
      style={{
        opacity: 1,
        transform: navHiddenByScroll ? "translateY(-100%)" : "translateY(0)",
        transition: "opacity 400ms cubic-bezier(0.23, 1, 0.32, 1), transform 400ms cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="w-[86%] max-w-[1008px] mx-auto pointer-events-auto">
        <TooltipProvider openDelay={150} closeDelay={150}>
          <div
            ref={navShellRef}
            className="relative rounded-full"
            onMouseEnter={handleShellMouseEnter}
            onMouseMove={handleShellMouseMove}
            onMouseLeave={handleShellMouseLeave}
          >
            <div
              className="relative z-[1] flex items-center justify-between px-6 h-[60px] rounded-full"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.37)",
                boxShadow: NAV_SHELL_SHADOW,
              }}
            >
            {/* Left: name + logo */}
            <NavBrandLink
              href="/"
              className={`rounded-full transition-opacity ${pathname === "/" ? "" : "hover:opacity-75"}`}
              style={{ padding: "6px 12px 6px 8px", display: "flex", alignItems: "center" }}
            />

            {/* Nav Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Tooltip side="bottom" sideOffset={8}>
                <TooltipTrigger
                  asChild
                  onMouseEnter={about.onMouseEnter}
                  onMouseLeave={about.onMouseLeave}
                >
                  <Link
                    href="/about"
                    className="flex items-center justify-center w-8 h-8"
                    aria-label="About"
                  >
                    <span style={about.iconStyle}>
                      <HandWaving size={24} color="#555555" weight="regular" aria-hidden />
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>About</TooltipContent>
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
                    className="flex items-center justify-center w-8 h-8"
                    aria-label="LinkedIn"
                  >
                    <span style={linkedin.iconStyle}>
                      <LinkedinLogo size={24} color="#555555" weight="regular" aria-hidden />
                    </span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>LinkedIn</TooltipContent>
              </Tooltip>

              <CopyEmailIcon
                tooltipSide="bottom"
                onMouseEnter={mail.onMouseEnter}
                onMouseLeave={mail.onMouseLeave}
                iconStyle={mail.iconStyle}
              />

              <Tooltip side="bottom" sideOffset={8}>
                <TooltipTrigger
                  asChild
                  onMouseEnter={resume.onMouseEnter}
                  onMouseLeave={resume.onMouseLeave}
                >
                  <Link
                    href="/resume"
                    className="flex items-center justify-center w-8 h-8"
                    aria-label="Resume"
                  >
                    <span style={resume.iconStyle}>
                      <FileText size={24} color="#555555" weight="regular" aria-hidden />
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Resume</TooltipContent>
              </Tooltip>
            </div>
            </div>
            <div
              ref={borderGlowRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[2] rounded-full opacity-0 transition-opacity duration-300 ease-out"
              style={{
                ...BORDER_GLOW_MASK,
                filter: "blur(0.5px)",
              }}
            />
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
