"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { TooltipProvider } from "./animate-ui/tooltip";
import { CopyEmailIcon } from "./CopyEmailIcon";
import { isCaseStudyPath } from "../lib/caseStudy";
import { useSiteHref, useSitePathname } from "../lib/reviewPath";
import { smoothScrollToElement } from "../lib/smoothScroll";
import { useHideOnScroll } from "./useHideOnScroll";
import styles from "./Nav.module.css";

/** Grace period before the contact links tuck away once the cursor leaves. */
const CLOSE_DELAY_MS = 220;

/**
 * Site nav: a fixed, blurred pill centred at the top of every page.
 * Hovering, focusing, clicking or tapping "contact" disperses LinkedIn, email
 * and resume out of it (to the right on wider screens, below on phones).
 * The pill keeps its left edge put while it widens, so the links grow rightward.
 */
export default function Nav() {
  const pathname = useSitePathname();
  const siteHref = useSiteHref();
  const router = useRouter();
  const onHome = pathname === "/";
  // On the homepage, "work" takes over from "home" once the case studies reach the upper part of the screen.
  // "fun" takes over in the same way once the fun projects reach it.
  const [workInView, setWorkInView] = useState(false);
  const [funInView, setFunInView] = useState(false);
  const isHome = onHome && !workInView && !funInView;
  const isWork = (onHome && workInView && !funInView) || (pathname ? isCaseStudyPath(pathname) : false);
  const isFun = onHome && funInView;

  const [open, setOpen] = useState(false);
  // Slides up out of the way while scrolling down, and back while scrolling up (stays while contact is open)
  const scrolledAway = useHideOnScroll() && !open;
  const moreId = useId();
  const pillRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerType = useRef("");

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  // Keep the pill's left edge anchored: centre the nav on its closed width.
  // Measured as the pill minus the contact links' current width, so it stays
  // correct while they open and close and the pill never shifts sideways.
  useLayoutEffect(() => {
    const pill = pillRef.current;
    const nav = navRef.current;
    const more = moreRef.current;
    if (!pill || !nav || !more) return;
    let current = -1;
    const sync = () => {
      // On phones the links sit in their own pill below and take no width here.
      const inline = getComputedStyle(more).position !== "absolute";
      // Fractional widths: whole-pixel offsetWidth rounds differently frame to
      // frame, which nudged the whole pill half a pixel back and forth.
      const closed = pill.getBoundingClientRect().width - (inline ? more.getBoundingClientRect().width : 0);
      // Ignore sub-pixel noise; real changes (fonts loading, route change) are larger.
      if (Math.abs(closed - current) < 0.5) return;
      current = closed;
      nav.style.setProperty("--nav-closed-w", `${closed.toFixed(2)}px`);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(pill);
    ro.observe(more);
    return () => ro.disconnect();
  }, [pathname]);

  // Close on Escape or a press outside the contact group.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!contactRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!onHome) return;
    const sections: [string, (inView: boolean) => void][] = [
      ["work", setWorkInView],
      ["fun", setFunInView],
    ];
    const observers = sections.map(([id, setInView]) => {
      const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
        // A line 30% down the screen: below the nav, and below where the case studies start on load.
        rootMargin: "-30% 0px -70% 0px",
      });
      const el = document.getElementById(id);
      if (el) observer.observe(el);
      return observer;
    });
    return () => {
      observers.forEach((observer) => observer.disconnect());
      setWorkInView(false);
      setFunInView(false);
    };
  }, [onHome]);

  // "work" and "fun" glide to their homepage sections. From another page they go home first, then glide.
  const pendingScroll = useRef<string | null>(null);
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) smoothScrollToElement(section);
  };
  useEffect(() => {
    const id = pendingScroll.current;
    if (!onHome || !id) return;
    pendingScroll.current = null;
    // Let the route-change scroll-to-top settle before gliding down.
    const timer = setTimeout(() => scrollToSection(id), 120);
    return () => clearTimeout(timer);
  }, [onHome]);
  const onSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (onHome) {
      scrollToSection(id);
    } else {
      pendingScroll.current = id;
      router.push(siteHref("/"));
    }
  };

  // Route changes close the contact links.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setOpen(false);
  }

  const onContactClick = () => {
    // A mouse already opened it on hover, so a click shouldn't close it again.
    if (pointerType.current === "mouse") setOpen(true);
    else setOpen((o) => !o);
  };

  const link = (href: string, label: string, active: boolean) => (
    <Link href={href} className={styles.link} data-active={active || undefined} aria-current={active ? "page" : undefined}>
      {label}
    </Link>
  );

  return (
    <>
      {/* Keeps page content clear of the fixed nav, at the height the old in-flow nav took. */}
      <div className={styles.spacer} aria-hidden="true" />
      <nav ref={navRef} className={`site-nav ${styles.nav}`} data-hidden={scrolledAway || undefined} aria-label="Main">
        <TooltipProvider openDelay={150} closeDelay={150}>
          <div ref={pillRef} className={`site-nav-pill ${styles.pill} hero-intro hero-intro--nav-top`}>
            <Link href={siteHref("/")} className={styles.mark} aria-label="Priyamwada Pandey, home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/nav-mark.svg" alt="" width={44} height={44} />
            </Link>
            <div className={styles.links}>
              {link(siteHref("/"), "home", isHome)}
              <Link
                href={`${siteHref("/")}#work`}
                onClick={(e) => onSectionClick(e, "work")}
                className={styles.link}
                data-active={isWork || undefined}
                aria-current={isWork ? "location" : undefined}
              >
                work
              </Link>
              <Link
                href={`${siteHref("/")}#fun`}
                onClick={(e) => onSectionClick(e, "fun")}
                className={styles.link}
                data-active={isFun || undefined}
                aria-current={isFun ? "location" : undefined}
              >
                fun
              </Link>
              {/* "about" stays hidden until its page is ready. */}
              <div
                ref={contactRef}
                className={styles.contact}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  cancelClose();
                  setOpen(true);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === "mouse") scheduleClose();
                }}
                onFocus={() => {
                  cancelClose();
                  setOpen(true);
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
                }}
              >
                <button
                  ref={buttonRef}
                  type="button"
                  className={styles.link}
                  aria-expanded={open}
                  aria-controls={moreId}
                  onPointerDown={(e) => {
                    pointerType.current = e.pointerType;
                  }}
                  onClick={() => {
                    onContactClick();
                    pointerType.current = "";
                  }}
                >
                  contact
                </button>
                <div ref={moreRef} id={moreId} className={styles.more} data-open={open || undefined}>
                  <div className={styles.moreInner}>
                    <span className={styles.item} style={{ "--i": 0 } as CSSProperties}>
                      <a href="https://www.linkedin.com/in/priyamwadapandey" target="_blank" rel="noopener noreferrer" className={styles.link}>
                        linkedin
                      </a>
                    </span>
                    <span className={styles.item} style={{ "--i": 1 } as CSSProperties}>
                      <CopyEmailIcon
                        label="email"
                        copiedText="Email copied"
                        tooltipSide="bottom"
                        className={styles.link}
                      />
                    </span>
                    <span className={styles.item} style={{ "--i": 2 } as CSSProperties}>
                      <a href={siteHref("/resume")} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        resume
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </nav>
    </>
  );
}
