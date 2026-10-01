"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import styles from "./CaseStudySideToc.module.css";

export type SideTocItem = { id: string; label: string };

const subscribeNoop = () => () => {};

/** Where a clicked section lands, below where the nav sits when it slides back in. */
const SCROLL_OFFSET_PX = 96;

/**
 * Back button + table of contents fixed in the left margin, outside the content column.
 * Slides in when the page loads and stays. A section is active once its top crosses the
 * vertical midpoint of the viewport.
 */
export function CaseStudySideToc({ items }: { items: SideTocItem[] }) {
  // The portal needs document.body, so only render on the client
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

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
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  if (!isClient) return null;

  return createPortal(
    <aside
      className={styles.root}
      data-visible={visible || undefined}
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
    </aside>,
    document.body,
  );
}
