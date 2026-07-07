"use client";

import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

interface TocState {
  activeId:       string;
  itemDarkStates: Record<string, boolean>;
  isStuck:        boolean;
}

export default function TableOfContents({
  items,
  stickyTop = 96,
  stickyPadding = 32,
  linkFontFamily = "var(--font-hind), sans-serif",
}: {
  items: TocItem[];
  stickyTop?: number;
  stickyPadding?: number;
  linkFontFamily?: string;
}) {
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
      const navRect = navRef.current!.getBoundingClientRect();
      const itemMidOffsets = items.map(({ id }) => {
        const el = itemRefs.current[id];
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return (r.top + r.bottom) / 2 - navRect.top;
      });
      return { darkBounds, sectionTops, itemMidOffsets };
    };

    let layout = measure();

    const compute = () => {
      const sy = window.scrollY;
      const { darkBounds, sectionTops, itemMidOffsets } = layout;

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

      // When in flow, nav viewport top is always > stickyTop.
      // When stuck, it equals stickyTop exactly. One reliable DOM read per frame.
      const navViewportTop = navRef.current?.getBoundingClientRect().top ?? stickyTop;
      const isStuck        = navViewportTop <= stickyTop;
      const paddingTop     = isStuck ? stickyPadding : 0;

      const itemDarkStates: Record<string, boolean> = {};
      for (let i = 0; i < items.length; i++) {
        const id          = items[i].id;
        const itemDocMidY = sy + navViewportTop + paddingTop + itemMidOffsets[i];
        let dark          = false;
        for (const { top, bottom } of darkBounds) {
          if (top <= itemDocMidY && bottom >= itemDocMidY) { dark = true; break; }
        }
        itemDarkStates[id] = dark;
      }

      setState({ activeId, itemDarkStates, isStuck });
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return;
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
  }, [items, stickyTop, stickyPadding]);

  const { activeId, itemDarkStates, isStuck } = state;

  return (
    <nav
      ref={navRef}
      aria-label="On this page"
      className="sticky self-start hidden min-[1080px]:block"
      style={{
        top: `${stickyTop}px`,
        paddingTop: isStuck ? `${stickyPadding}px` : "0px",
        maxHeight: `calc(100vh - ${stickyTop}px)`,
        overflowY: "auto",
        transition: "padding-top 250ms cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      <ul>
        {items.map(({ id, label }, index) => {
          const isActive      = activeId === id;
          const isDark        = itemDarkStates[id] ?? false;
          const activeColor   = isDark ? "#FFFFFF"                : "#111111";
          const inactiveColor = isDark ? "rgba(255,255,255,0.55)" : "#767676";

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
                className="block cursor-hover-pointer"
                style={{
                  fontFamily:    linkFontFamily,
                  fontSize:      "14px",
                  lineHeight:    "19px",
                  fontWeight:    isActive ? 500 : 400,
                  color:         isActive ? activeColor : inactiveColor,
                  paddingTop:    index === 0 ? "4px" : "18px",
                  paddingBottom: "4px",
                  transition:    "color 250ms cubic-bezier(0.2, 0, 0, 1), font-weight 250ms cubic-bezier(0.2, 0, 0, 1)",
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
