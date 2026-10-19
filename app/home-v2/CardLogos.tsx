"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** The card counts as "in view" while it crosses the middle fifth of the viewport. */
const FOCUS_BAND = "-40% 0px -40% 0px";

/**
 * Case study card logos. They sit in neutral gray and take their brand colour
 * while the card is scrolled into the middle of the screen, on every device.
 */
export function CardLogos({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const card = ref.current?.closest("a") ?? ref.current;
    if (!card) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: FOCUS_BAND,
    });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-in-view={inView || undefined}>
      {children}
    </div>
  );
}
