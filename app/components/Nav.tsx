"use client";

import {
  FileText,
  HandWaving,
  LinkedinLogo,
  Mailbox,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./animate-ui/tooltip";
import { isCaseStudyPath } from "../lib/caseStudy";

const hind = { fontFamily: "var(--font-hind), sans-serif" } as const;
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

export default function Nav() {
  const pathname = usePathname();
  const isCaseStudy = isCaseStudyPath(pathname);
  const [scrolledDown, setScrolledDown] = useState(false);

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
            className="flex items-center justify-between px-6 h-[60px] rounded-full"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.37)",
              boxShadow:
                "0 2px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.46)",
            }}
          >
            {/* Left: name + logo */}
            <Link
              href="/"
              className={`flex items-center gap-2 rounded-full transition-opacity ${pathname === "/" ? "" : "hover:opacity-75"}`}
              style={{ padding: "6px 12px 6px 8px" }}
            >
              <img src="/logos/nav-logo.svg" alt="" width={24} height={24} className="shrink-0" />
              <span
                className="hidden sm:inline text-[14px] leading-none"
                style={{ ...hind, fontWeight: 500, color: "#111111" }}
              >
                priyamwada pandey
              </span>
            </Link>

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

              <Tooltip side="bottom" sideOffset={8}>
                <TooltipTrigger
                  asChild
                  onMouseEnter={mail.onMouseEnter}
                  onMouseLeave={mail.onMouseLeave}
                >
                  <a
                    href="mailto:priyamwadapandey15@gmail.com"
                    className="flex items-center justify-center w-8 h-8"
                    aria-label="Email"
                  >
                    <span style={mail.iconStyle}>
                      <Mailbox size={24} color="#555555" weight="regular" aria-hidden />
                    </span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>Email</TooltipContent>
              </Tooltip>

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
        </TooltipProvider>
      </div>
    </div>
  );
}
