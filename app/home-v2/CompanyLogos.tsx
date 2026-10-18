"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** A company counts as "in view" while its group crosses the middle fifth of the viewport. */
const FOCUS_BAND = "-40% 0px -40% 0px";

/**
 * Logos in a homepage company group. They sit in neutral gray and take their
 * brand colour while that company's group is scrolled into the middle of the
 * screen, so only the company being read is in colour.
 */
export function CompanyLogos({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const group = ref.current?.closest("[data-company-group]");
    if (!group) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: FOCUS_BAND,
    });
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-in-view={inView || undefined}>
      {children}
    </div>
  );
}
