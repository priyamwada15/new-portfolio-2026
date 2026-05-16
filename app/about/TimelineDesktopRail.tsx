"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const TIMELINE_LINE_CLASS =
  "h-full w-px bg-[repeating-linear-gradient(to_bottom,#C9C9C9_0_5px,transparent_5px_10px)]";

export function TimelineDesktopRail({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState<{ top: number; height: number } | null>(null);

  const measureLine = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const first = container.querySelector<HTMLElement>('[data-timeline-badge="first"]');
    const last = container.querySelector<HTMLElement>('[data-timeline-badge="last"]');
    if (!first || !last) return;

    const cTop = container.getBoundingClientRect().top;
    const top = first.getBoundingClientRect().bottom - cTop;
    const bottom = container.getBoundingClientRect().bottom - last.getBoundingClientRect().top;
    const height = container.getBoundingClientRect().height - top - bottom;

    if (height > 0) {
      setLine({ top, height });
    }
  }, []);

  useLayoutEffect(() => {
    measureLine();

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(measureLine);
    observer.observe(container);

    return () => observer.disconnect();
  }, [measureLine]);

  return (
    <div ref={containerRef} className="relative hidden flex-col lg:flex">
      {line && (
        <div
          className="pointer-events-none absolute left-0 z-0 flex w-[163px] justify-center"
          style={{ top: line.top, height: line.height }}
          aria-hidden
        >
          <div className={TIMELINE_LINE_CLASS} />
        </div>
      )}
      {children}
    </div>
  );
}
