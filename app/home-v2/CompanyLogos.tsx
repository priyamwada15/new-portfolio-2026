"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** A case study counts as "in view" while its row crosses the middle fifth of the viewport. */
const FOCUS_BAND = "-40% 0px -40% 0px";

/**
 * Company logos on a homepage case study row. They sit in neutral gray and take
 * their brand colour while the row is scrolled into the middle of the screen,
 * so only the case study being read is in colour.
 */
export function CompanyLogos({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const row = ref.current?.closest("[data-study-row]");
    if (!row) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: FOCUS_BAND,
    });
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-in-view={inView || undefined}>
      {children}
    </div>
  );
}
