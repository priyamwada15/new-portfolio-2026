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

    const measure = () => {
      const sy0 = window.scrollY;
      const darkBounds = Array.from(
        document.querySelectorAll("[data-toc-dark]")
      ).map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + sy0, bottom: r.bottom + sy0 };
      });
      const sectionTops = items.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        return el.getBoundingClientRect().top + sy0;
      });
      const navNaturalDocTop = navRef.current!.getBoundingClientRect().top + sy0;
      const navRect = navRef.current!.getBoundingClientRect();
      const itemMidOffsets = items.map(({ id }) => {
        const el = itemRefs.current[id];
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return (r.top + r.bottom) / 2 - navRect.top;
      });
      return { darkBounds, sectionTops, navNaturalDocTop, itemMidOffsets };
    };

    let layout = measure();

    // ── Scroll handler, pure arithmetic, zero DOM reads ───────────────
    const compute = () => {
      const sy = window.scrollY;
      const { darkBounds, sectionTops, navNaturalDocTop, itemMidOffsets } = layout;

      const threshold = sy + 160;
      let activeIdx = 0;
      let bestTop = -Infinity;
      for (let i = 0; i < sectionTops.length; i++) {
        const t = sectionTops[i];
        if (t <= threshold && t > bestTop) {
          bestTop = t;
          activeIdx = i;
        }
      }
      if (bestTop === -Infinity) activeIdx = 0;
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

      // Single batched state update, one re-render per frame
      setState({ activeId, itemDarkStates, isStuck });
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return; // skip if frame already queued
      rafRef.current = requestAnimationFrame(() => {
        compute();
        rafRef.current = null;
      });
    };

    const onResize = () => {
      layout = measure();
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const fontsDone = document.fonts?.ready?.then(() => {
      layout = measure();
      handleScroll();
    });
    compute(); // initial run

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      void fontsDone;
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
        maxHeight: "calc(100vh - 96px)",
        overflowY: "auto",
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
