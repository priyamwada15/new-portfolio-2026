"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./animate-ui/tooltip";

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
  const isBento = pathname === "/tars-debug-mode";
  const [pastBento, setPastBento] = useState(false);

  useEffect(() => {
    if (!isBento) return;
    const check = () => setPastBento(window.scrollY >= window.innerHeight);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [isBento]);

  const navVisible = !isBento || pastBento;

  const onPlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (pathname !== "/") { window.location.href = "/#play"; return; }
    document.getElementById("play")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const play     = useTilt(8);
  const about    = useTilt(-8);
  const linkedin = useTilt(8);
  const mail     = useTilt(-8);
  const resume   = useTilt(8);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 pt-4 pb-2 pointer-events-none"
      style={{
        opacity: navVisible ? 1 : 0,
        transform: navVisible ? "translateY(0)" : "translateY(-8px)",
        transition: "opacity 400ms cubic-bezier(0.23, 1, 0.32, 1), transform 400ms cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="w-[86%] max-w-[1238px] mx-auto pointer-events-auto">
        <TooltipProvider openDelay={150} closeDelay={150}>
          <div
            className="flex items-center justify-between px-6 h-[60px] rounded-full"
            style={{
              background: "rgba(255, 255, 255, 0.52)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.55)",
              boxShadow: "0 2px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.92)",
            }}
          >
            {/* Left: in-page navigation */}
            <div className="flex items-center gap-2">
              <Tooltip side="bottom" sideOffset={8}>
                <TooltipTrigger
                  asChild
                  onMouseEnter={play.onMouseEnter}
                  onMouseLeave={play.onMouseLeave}
                >
                  <button
                    onClick={onPlayClick}
                    className="flex items-center justify-center w-8 h-8 cursor-pointer"
                    aria-label="Go to Play section"
                  >
                    <span style={play.iconStyle}>
                      <img src="/DiscoBall.svg" alt="" width={24} height={24} />
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Play</TooltipContent>
              </Tooltip>

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
                      <img src="/HandWaving.svg" alt="" width={24} height={24} />
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>About</TooltipContent>
              </Tooltip>
            </div>

            {/* Center: name + logo */}
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

            {/* Right: external links */}
            <div className="flex items-center gap-4">
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
                      <img src="/LinkedinLogo.svg" alt="" width={24} height={24} />
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
                    aria-label="Contact"
                  >
                    <span style={mail.iconStyle}>
                      <img src="/Mailbox.svg" alt="" width={24} height={24} />
                    </span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>Contact</TooltipContent>
              </Tooltip>

              <Tooltip side="bottom" sideOffset={8}>
                <TooltipTrigger
                  asChild
                  onMouseEnter={resume.onMouseEnter}
                  onMouseLeave={resume.onMouseLeave}
                >
                  <a
                    href="https://www.dropbox.com/scl/fi/q25sm46awt2hyr5dxbipp/Pri_Resume.pdf?rlkey=n42okjjek5vmanorbudpp0wrm&st=65336wi9&dl=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8"
                    aria-label="Resume"
                  >
                    <span style={resume.iconStyle}>
                      <img src="/FileText.svg" alt="" width={24} height={24} />
                    </span>
                  </a>
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
