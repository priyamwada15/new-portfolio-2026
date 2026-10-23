"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { CopyEmailIcon } from "../CopyEmailIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../animate-ui/tooltip";
import { useSiteHref } from "../../lib/reviewPath";
import { FOOTER_REVEAL_OVERLAP_PX } from "./constants";
import styles from "./SiteFooter.module.css";

/** AppChrome's sentinel at the end of the page; the footer shows once it's on screen. */
const REVEAL_SENTINEL_ID = "flip-board-reveal-sentinel";

const BORDER_TEXT = "DEPARTMENT OF DESIGN ⁘ अभिकल्पना विभाग ⁘ ".repeat(16);

/**
 * Where each sticker sits, in px of the Figma frame: 1440×650 on desktop and
 * 375×620 on phones (SiteFooter.module.css scales both to the screen). `tilt`
 * is the angle baked into the image, undone on hover so the sticker straightens.
 */
type Placement = { x: number; y: number; w: number };
type Sticker = {
  label: string;
  name: string;
  href: string;
  src: string;
  tilt: number;
  desktop: Placement;
  phone: Placement;
};

const STICKERS: Sticker[] = [
  {
    label: "x",
    name: "X",
    href: "https://x.com/PriymwadaPandey",
    src: "/footer/x.webp",
    tilt: 13.57,
    desktop: { x: 421, y: 105, w: 67 },
    phone: { x: 40, y: 72, w: 54 },
  },
  {
    label: "github",
    name: "GitHub",
    href: "https://github.com/priyamwada15",
    src: "/footer/github.webp",
    tilt: -3.35,
    desktop: { x: 819, y: 118, w: 98 },
    phone: { x: 262, y: 56, w: 78 },
  },
  {
    label: "linkedin",
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/priyamwadapandey",
    src: "/footer/linkedin.webp",
    tilt: -7.27,
    desktop: { x: 284, y: 462, w: 82 },
    phone: { x: 34, y: 384, w: 64 },
  },
  {
    label: "resume",
    name: "Resume",
    href: "/resume",
    src: "/footer/resume.webp",
    tilt: 9.59,
    desktop: { x: 1079, y: 368, w: 196 },
    phone: { x: 246, y: 372, w: 104 },
  },
];

// The mailbox art has 24px of room on the left (of 484) for the open door's sticker edge
const MAILBOX = { desktop: { x: 667, w: 121 }, phone: { x: 143, w: 84 } };
/** The mailbox opens once this much of the footer is uncovered, and closes again below CLOSE_AT. */
const OPEN_AT = 0.7;
const CLOSE_AT = 0.5;

const placementVars = (desktop: Placement | { x: number; w: number }, phone: Placement | { x: number; w: number }) =>
  ({
    "--x": desktop.x,
    "--w": desktop.w,
    "--px": phone.x,
    "--pw": phone.w,
    ...("y" in desktop && "y" in phone ? { "--y": desktop.y, "--py": phone.y } : {}),
  }) as CSSProperties;

/**
 * The site footer: an olive panel the page lifts away to reveal, framed by
 * "Department of Design" in English and Hindi. Stickers float gently like the
 * hero's creative license and straighten on hover; the mailbox copies the email.
 * The mailbox opens as the footer comes into view and closes as it scrolls away.
 */
export default function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const siteHref = useSiteHref();

  // AppChrome sizes the reveal spacer from this
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const sync = () =>
      document.documentElement.style.setProperty("--footer-reveal-height", `${footer.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(footer);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--footer-reveal-height");
    };
  }, []);

  // Painted once the end of the page is within a screen of view, and inert (no clicks, out of
  // the tab order and the accessibility tree) until it's on screen
  useEffect(() => {
    const footer = footerRef.current;
    const sentinel = document.getElementById(REVEAL_SENTINEL_ID);
    if (!footer || !sentinel) return;
    let raf = 0;
    const sync = () => {
      raf = 0;
      const top = sentinel.getBoundingClientRect().top;
      const visible = top <= window.innerHeight;
      footer.toggleAttribute("data-painted", top <= window.innerHeight * 2);
      footer.toggleAttribute("data-visible", visible);
      footer.inert = !visible;
      // How much of the footer the page has uncovered, 0 to 1
      const uncovered = (window.innerHeight - top) / footer.offsetHeight;
      if (uncovered >= OPEN_AT) footer.setAttribute("data-open", "");
      else if (uncovered < CLOSE_AT) footer.removeAttribute("data-open");
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    schedule();
    const io = new IntersectionObserver(schedule, { threshold: [0, 1] });
    io.observe(sentinel);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <TooltipProvider>
      <footer
        ref={footerRef}
        className={styles.footer}
        inert
        style={{ "--overlap": `${FOOTER_REVEAL_OVERLAP_PX}px` } as CSSProperties}
        aria-label="Site footer"
      >
        <div className={styles.panel}>
          <div className={styles.frame} aria-hidden>
            <span className={`${styles.strip} ${styles.top}`}>{BORDER_TEXT}</span>
            <span className={`${styles.strip} ${styles.right}`}>{BORDER_TEXT}</span>
            <span className={`${styles.strip} ${styles.bottom}`}>{BORDER_TEXT}</span>
            <span className={`${styles.strip} ${styles.left}`}>{BORDER_TEXT}</span>
          </div>

          <div className={styles.stage}>
            <p className={styles.headline}>
              <span>Thanks for stopping by!</span> <span>My mailbox is open if you’re hiring.</span>
            </p>

            {STICKERS.map((s, i) => (
              <Tooltip key={s.label} side="top" sideOffset={8}>
                <TooltipTrigger asChild>
                  <a
                    href={s.href.startsWith("/") ? siteHref(s.href) : s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className={styles.sticker}
                    style={{ ...placementVars(s.desktop, s.phone), "--tilt": `${s.tilt}deg`, "--i": i } as CSSProperties}
                  >
                    <span className={styles.float}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.src} alt="" draggable={false} />
                    </span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>{s.label}</TooltipContent>
              </Tooltip>
            ))}

            <div className={styles.mailbox} style={placementVars(MAILBOX.desktop, MAILBOX.phone)}>
              <span className={styles.mailboxHint} aria-hidden>
                tap to copy email
              </span>
              <CopyEmailIcon className={styles.mailboxButton} tooltipSide="top" hoverText="email me" copiedText="Email copied">
                <span className={styles.mailboxArt}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.mailboxClosed} src="/footer/mailbox-closed.webp" alt="" draggable={false} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.mailboxOpen} src="/footer/mailbox-open.webp" alt="" draggable={false} />
                </span>
              </CopyEmailIcon>
            </div>
          </div>
        </div>
      </footer>
      {/* The border opacity dial (FooterDial) is hidden; render it here in development to bring it back. */}
    </TooltipProvider>
  );
}
