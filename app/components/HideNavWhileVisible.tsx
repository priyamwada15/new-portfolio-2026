"use client";

import { useEffect, useRef } from "react";

/**
 * Brings the site nav back once the element it sits in (marked `data-hides-nav`)
 * has scrolled off the top of the screen. The nav is hidden by CSS from the first
 * paint while that element is on the page (Nav.module.css); this sets
 * `data-nav-shown` on <html> when it should show again, and clears it on the way back up.
 */
export function HideNavWhileVisible() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = ref.current?.parentElement;
    if (!target) return;
    const root = document.documentElement;
    // Only the top 5% of the screen counts, so the nav returns as the hero scrolls off
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) delete root.dataset.navShown;
        else root.dataset.navShown = "";
      },
      { rootMargin: "0px 0px -95% 0px" },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
      delete root.dataset.navShown;
    };
  }, []);

  return <span ref={ref} hidden />;
}
