"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { TooltipProvider } from "./animate-ui/tooltip";
import { CopyEmailIcon } from "./CopyEmailIcon";
import { isCaseStudyPath } from "../lib/caseStudy";
import { useSiteHref, useSitePathname } from "../lib/reviewPath";
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
  const isHome = pathname === "/";
  const isWork = pathname ? isCaseStudyPath(pathname) : false;
  const isFun = pathname === "/fun" || pathname.startsWith("/fun/");

  const [open, setOpen] = useState(false);
  const moreId = useId();
  const pillRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
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
  useLayoutEffect(() => {
    const pill = pillRef.current;
    const nav = navRef.current;
    if (!pill || !nav || open) return;
    const sync = () => nav.style.setProperty("--nav-closed-w", `${pill.offsetWidth}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(pill);
    return () => ro.disconnect();
  }, [open, pathname]);

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
      <nav ref={navRef} className={`site-nav ${styles.nav}`} data-dark={isFun || undefined} aria-label="Main">
        <TooltipProvider openDelay={150} closeDelay={150}>
          <div ref={pillRef} className={`${styles.pill} hero-intro hero-intro--nav-top`}>
            <Link href={siteHref("/")} className={styles.mark} aria-label="Priyamwada Pandey, home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/nav-mark.svg" alt="" width={44} height={44} />
            </Link>
            <div className={styles.links}>
              {link(siteHref("/"), "home", isHome)}
              {link(`${siteHref("/")}#work`, "work", isWork)}
              {link(siteHref("/fun"), "fun", isFun)}
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
                <div id={moreId} className={styles.more} data-open={open || undefined}>
                  <div className={styles.moreInner}>
                    <a
                      href="https://www.linkedin.com/in/priyamwadapandey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.link} ${styles.item}`}
                      style={{ "--i": 0 } as CSSProperties}
                    >
                      linkedin
                    </a>
                    <span className={styles.item} style={{ "--i": 1 } as CSSProperties}>
                      <CopyEmailIcon
                        label="email"
                        copiedText="Email copied"
                        tooltipSide="bottom"
                        className={styles.link}
                      />
                    </span>
                    <a
                      href={siteHref("/resume")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.link} ${styles.item}`}
                      style={{ "--i": 2 } as CSSProperties}
                    >
                      resume
                    </a>
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
