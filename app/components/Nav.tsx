"use client";

import {
  FileText,
  HandWaving,
  LinkedinLogo,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./animate-ui/tooltip";
import { CopyEmailIcon } from "./CopyEmailIcon";
import { NavBrandLink } from "./NavBrandLink";
import { NAV_SHELL_BORDER, NAV_SHELL_SHADOW } from "./navShellStyle";

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

  const about = useTilt(-8);
  const linkedin = useTilt(8);
  const mail = useTilt(-8);
  const resume = useTilt(8);

  return (
    <div className="relative z-50 w-full pt-8 pb-2">
      <div className="w-[86%] max-w-[1008px] mx-auto pointer-events-auto">
        <TooltipProvider openDelay={150} closeDelay={150}>
          <div className="relative rounded-full">
            <div
              className="relative flex items-center justify-between h-[60px] rounded-full"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: NAV_SHELL_BORDER,
                boxShadow: NAV_SHELL_SHADOW,
              }}
            >
              <NavBrandLink
                href="/"
                className={`rounded-full transition-opacity ${pathname === "/" ? "" : "hover:opacity-75"}`}
                style={{ padding: "6px 12px 6px 8px", display: "flex", alignItems: "center" }}
              />

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
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
