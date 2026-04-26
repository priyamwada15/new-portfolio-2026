"use client";

import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

const STICKY_TOP     = 96; // top-24 = 6rem = 96px
const STICKY_PADDING = 32; // padding-top added when stuck

interface TocState {
  activeId:       string;
  itemDarkStates: Record<string, boolean>;
  isStuck:        boolean;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [state, setState] = useState<TocState>({
    activeId:       items[0]?.id ?? "",
    itemDarkStates: {},
    isStuck:        false,
  });

  const navRef   = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const rafRef   = useRef<number | null>(null);

  useEffect(() => {
    if (!navRef.current) return;

    // ── Pre-compute all static document-space values at mount ──────────
    // Done once: no getBoundingClientRect in the scroll handler.
    const sy0 = window.scrollY;

    // Dark section bounds in document coordinates (these never move)
    const darkBounds = Array.from(
      document.querySelectorAll("[data-toc-dark]")
    ).map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + sy0, bottom: r.bottom + sy0 };
    });

    // Section tops in document coordinates (fixed)
    const sectionTops = items.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return 0;
      return el.getBoundingClientRect().top + sy0;
    });

    // Nav natural top in document coordinates
    const navNaturalDocTop =
      navRef.current.getBoundingClientRect().top + sy0;

    // Item midY offsets relative to the nav's top edge (measured at mount
    // when paddingTop = 0, so offsets are purely from the nav's content edge)
    const navRect = navRef.current.getBoundingClientRect();
    const itemMidOffsets = items.map(({ id }) => {
      const el = itemRefs.current[id];
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return (r.top + r.bottom) / 2 - navRect.top;
    });

    // ── Scroll handler — pure arithmetic, zero DOM reads ───────────────
    const compute = () => {
      const sy = window.scrollY;

      // Active section: last section whose top ≤ scrollY + 160
      let activeIdx = 0;
      for (let i = 0; i < sectionTops.length; i++) {
        if (sectionTops[i] <= sy + 160) activeIdx = i;
      }
      const activeId = items[activeIdx]?.id ?? "";

      // Sticky state
      const isStuck = sy > navNaturalDocTop - STICKY_TOP;

      // Nav top in viewport coordinates
      const paddingTop      = isStuck ? STICKY_PADDING : 0;
      const navViewportTop  = isStuck ? STICKY_TOP : navNaturalDocTop - sy;

      // Per-item dark states: convert each item's midpoint to document
      // coordinates, then test against pre-computed dark section bounds
      const itemDarkStates: Record<string, boolean> = {};
      for (let i = 0; i < items.length; i++) {
        const id            = items[i].id;
        const itemDocMidY   = sy + navViewportTop + paddingTop + itemMidOffsets[i];
        let dark            = false;
        for (const { top, bottom } of darkBounds) {
          if (top <= itemDocMidY && bottom >= itemDocMidY) { dark = true; break; }
        }
        itemDarkStates[id] = dark;
      }

      // Single batched state update — one re-render per frame
      setState({ activeId, itemDarkStates, isStuck });
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return; // skip if frame already queued
      rafRef.current = requestAnimationFrame(() => {
        compute();
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    compute(); // initial run

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [items]);

  const { activeId, itemDarkStates, isStuck } = state;

  return (
    <nav
      ref={navRef}
      aria-label="On this page"
      className="sticky top-24 self-start hidden min-[1080px]:block"
      style={{
        paddingTop: isStuck ? "32px" : "0px",
        transition: "padding-top 250ms cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      <ul className="space-y-[14px]">
        {items.map(({ id, label }) => {
          const isActive      = activeId === id;
          const isDark        = itemDarkStates[id] ?? false;
          const activeColor   = isDark ? "#FFFFFF"                 : "#111111";
          const inactiveColor = isDark ? "rgba(255,255,255,0.55)"  : "#767676";

          return (
            <li key={id}>
              <a
                ref={(el) => { itemRefs.current[id] = el; }}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="block leading-snug"
                style={{
                  fontFamily:   "var(--font-ovo), serif",
                  fontSize:     "16px",
                  fontWeight:   isActive ? 500 : 400,
                  color:        isActive ? activeColor : inactiveColor,
                  paddingTop:   "4px",
                  paddingBottom:"4px",
                  transition:   "color 250ms cubic-bezier(0.2, 0, 0, 1), font-weight 250ms cubic-bezier(0.2, 0, 0, 1)",
                }}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
