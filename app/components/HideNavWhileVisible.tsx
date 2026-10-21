"use client";

import { useEffect, useRef } from "react";

/**
 * Hides the site nav while the element it sits in covers the top of the screen
 * (sets `data-nav-hidden` on <html>; Nav.module.css fades the pill out). The nav
 * comes back once that element has scrolled away.
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
        if (entry.isIntersecting) root.dataset.navHidden = "";
        else delete root.dataset.navHidden;
      },
      { rootMargin: "0px 0px -95% 0px" },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
      delete root.dataset.navHidden;
    };
  }, []);

  return <span ref={ref} hidden />;
}
