"use client";

import {
  GithubLogo,
  LinkedinLogo,
  Mailbox,
  XLogo,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./animate-ui/tooltip";
import {
  CASE_STUDY_PAGE_BG,
  caseStudyUsesSiteDefaultSurface,
  isCaseStudyPath,
} from "../lib/caseStudy";

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

export default function Footer() {
  const pathname = usePathname();
  const x = useTilt(8);
  const linkedin = useTilt(-8);
  const github = useTilt(8);
  const mail = useTilt(-8);

  if (pathname === "/about") {
    return null;
  }

  const footerMuted = "rgba(51,51,51,0.55)";
  const caseStudy = pathname ? isCaseStudyPath(pathname) : false;
  const defaultSurface = pathname ? caseStudyUsesSiteDefaultSurface(pathname) : false;
  const footerBg =
    caseStudy && !defaultSurface ? CASE_STUDY_PAGE_BG : "var(--color-page-bg)";

  const iconProps = {
    size: 24,
    color: footerMuted,
    weight: "regular" as const,
  };

  return (
    <footer className="w-full relative" style={{ backgroundColor: footerBg }}>
      <div
        className="relative z-10 w-[86%] max-w-[1008px] mx-auto flex flex-wrap items-center justify-between gap-y-6"
        style={{ paddingTop: "96px", paddingBottom: "32px" }}
      >
        {/* Left — name + note */}
        <div className="flex flex-col" style={{ gap: "4px" }}>
          <p
            className="text-[14px] font-medium tracking-wide"
            style={{ ...hind, color: footerMuted }}
          >
            <span>priyamwada pandey </span>
            <span className="text-[13px]">© 2026</span>
          </p>
          <p
            style={{ ...hind, fontSize: "10px", fontWeight: 400, color: footerMuted }}
          >
            coded by me, claude and cursor
          </p>
        </div>

        {/* Right — icon buttons */}
        <TooltipProvider openDelay={150} closeDelay={150}>
          <div className="flex items-center gap-3 sm:gap-4">
            <Tooltip side="top" sideOffset={8}>
              <TooltipTrigger
                asChild
                onMouseEnter={x.onMouseEnter}
                onMouseLeave={x.onMouseLeave}
              >
                <a
                  href="https://x.com/PriymwadaPandey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8"
                  aria-label="X (Twitter)"
                >
                  <span style={x.iconStyle}>
                    <XLogo {...iconProps} aria-hidden />
                  </span>
                </a>
              </TooltipTrigger>
              <TooltipContent>X</TooltipContent>
            </Tooltip>

            <Tooltip side="top" sideOffset={8}>
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
                    <LinkedinLogo {...iconProps} aria-hidden />
                  </span>
                </a>
              </TooltipTrigger>
              <TooltipContent>LinkedIn</TooltipContent>
            </Tooltip>

            <Tooltip side="top" sideOffset={8}>
              <TooltipTrigger
                asChild
                onMouseEnter={github.onMouseEnter}
                onMouseLeave={github.onMouseLeave}
              >
                <a
                  href="https://github.com/priyamwada15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8"
                  aria-label="GitHub"
                >
                  <span style={github.iconStyle}>
                    <GithubLogo {...iconProps} aria-hidden />
                  </span>
                </a>
              </TooltipTrigger>
              <TooltipContent>GitHub</TooltipContent>
            </Tooltip>

            <Tooltip side="top" sideOffset={8}>
              <TooltipTrigger
                asChild
                onMouseEnter={mail.onMouseEnter}
                onMouseLeave={mail.onMouseLeave}
              >
                <a
                  href="mailto:priyamwada.dzn@gmail.com"
                  className="flex items-center justify-center w-8 h-8"
                  aria-label="Email"
                >
                  <span style={mail.iconStyle}>
                    <Mailbox {...iconProps} aria-hidden />
                  </span>
                </a>
              </TooltipTrigger>
              <TooltipContent>Email</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </footer>
  );
}
