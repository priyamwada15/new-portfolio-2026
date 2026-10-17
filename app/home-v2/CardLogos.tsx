"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const TOUCH_QUERY = "(hover: none)";
/** The card counts as "in focus" while it crosses the middle fifth of the viewport. */
const FOCUS_BAND = "-40% 0px -40% 0px";

/**
 * Case study card logos. They sit in neutral gray and take their brand colour on
 * card hover (CSS). Touch screens can't hover, so there the colour comes in while
 * the card is scrolled into the middle of the screen instead.
 */
export function CardLogos({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const card = ref.current?.closest("a") ?? ref.current;
    if (!card || !window.matchMedia(TOUCH_QUERY).matches) return;
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
