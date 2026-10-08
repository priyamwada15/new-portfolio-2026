"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Popover } from "radix-ui";
import { ArrowLeft, CaretUp } from "@phosphor-icons/react";
import styles from "./CaseStudySideToc.module.css";

export type SideTocItem = { id: string; label: string };

const subscribeNoop = () => () => {};

/** Where a clicked section lands, below where the nav sits when it slides back in. */
const SCROLL_OFFSET_PX = 96;

/** Once the logos row scrolls above this, the TOC stops following it and stays here. */
const MIN_TOP_PX = 128;

/** Marks where the flip-board footer starts revealing (AppChrome). */
const FOOTER_SENTINEL_ID = "flip-board-reveal-sentinel";

/**
 * Back button + table of contents fixed in the left margin, outside the content column.
 * Slides in when the page loads and stays. Its top follows the element `alignToId` (the
 * logos row) until that scrolls above MIN_TOP_PX, then it holds there. A section is
 * active once its top crosses the vertical midpoint of the viewport.
 *
 * Below 1280px there's no margin for it, so the same Back link and sections move
 * into a floating pill at the bottom of the screen, which hides as the footer
 * comes into view. Only one of the two is ever displayed (see the CSS module).
 */
export function CaseStudySideToc({ items, alignToId }: { items: SideTocItem[]; alignToId: string }) {
  // The portal needs document.body, so only render on the client
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [atFooter, setAtFooter] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const labelBoxRef = useRef<HTMLSpanElement>(null);
  const labelSizerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sentinel = document.getElementById(FOOTER_SENTINEL_ID);
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      // In view, or already scrolled past it
      setAtFooter(entry.isIntersecting || entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let active: string | null = null;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) active = id;
      }
      const anchor = document.getElementById(alignToId);
      if (anchor && asideRef.current) {
        const top = Math.max(MIN_TOP_PX, anchor.getBoundingClientRect().top);
        asideRef.current.style.top = `${Math.round(top)}px`;
      }
      setActiveId(active);
      // Set after the first frame so the slide-in transition plays on load
      setVisible(true);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Re-align if anything above the logos changes height after load (fonts, nav)
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items, alignToId]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const activeLabel = items.find(({ id }) => id === activeId)?.label ?? "Contents";

  // The pill's width follows the label: a hidden, unconstrained copy of the text
  // is measured whenever its size changes (new section, web font arriving), and
  // the visible box eases to that width with a CSS transition.
  useLayoutEffect(() => {
    const box = labelBoxRef.current;
    const sizer = labelSizerRef.current;
    if (!box || !sizer) return;
    const fit = () => {
      // Round up so a fractional width doesn't trigger the ellipsis
      box.style.width = `${Math.ceil(sizer.getBoundingClientRect().width)}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(sizer);
    return () => observer.disconnect();
  }, [isClient]);

  if (!isClient) return null;

  const barVisible = visible && !atFooter;

  return createPortal(
    <>
      <aside
        ref={asideRef}
        className={styles.root}
        data-visible={visible || undefined}
        // Fades with the page content during the case study transition (globals.css)
        data-cs-fade
        aria-label="Case study navigation"
        inert={!visible}
      >
        <Link href="/" className={`cursor-hover-pointer ${styles.back}`}>
          <ArrowLeft size={14} weight="bold" aria-hidden="true" />
          Back
        </Link>
        <nav aria-label="Table of contents">
          <ol className={styles.list}>
            {items.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`cursor-hover-pointer ${styles.item}`}
                  aria-current={activeId === id ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(id);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
      <Popover.Root open={contentsOpen && barVisible} onOpenChange={setContentsOpen}>
        {/* Anchored to the whole pill so the sheet centres over it */}
        <Popover.Anchor asChild>
          <div
            className={styles.bar}
            data-visible={barVisible || undefined}
            data-cs-fade
            inert={!barVisible}
          >
            <Link href="/" className={styles.barBack}>
              <ArrowLeft size={14} weight="bold" aria-hidden="true" />
              Back
            </Link>
            <span className={styles.barDivider} aria-hidden="true" />
            <Popover.Trigger className={styles.barContents} aria-label={`Contents, current section: ${activeLabel}`}>
              <span ref={labelBoxRef} className={styles.barLabelBox}>
                {/* Keyed so each new label fades in */}
                <span key={activeLabel} className={styles.barLabel}>
                  {activeLabel}
                </span>
              </span>
              <span ref={labelSizerRef} className={styles.barLabelSizer} aria-hidden="true">
                {activeLabel}
              </span>
              <CaretUp size={12} weight="bold" aria-hidden="true" />
            </Popover.Trigger>
          </div>
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content side="top" align="center" sideOffset={8} collisionPadding={16} className={styles.sheet}>
            <nav aria-label="Table of contents">
              <ol className={styles.sheetList}>
                {items.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={styles.sheetItem}
                      aria-current={activeId === id ? "location" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setContentsOpen(false);
                        scrollTo(id);
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>,
    document.body,
  );
}
