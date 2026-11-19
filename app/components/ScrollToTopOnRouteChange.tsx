"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isCaseStudyPath } from "@/design-system";
import { stripReviewBase } from "../lib/reviewPath";

const RESTORE_TIMEOUT_MS = 1500;
const USER_INPUT_EVENTS = ["wheel", "touchstart", "keydown", "mousedown"] as const;

const urlKey = () => location.pathname + location.search;

/**
 * Case studies always open at the top. Every other page, when revisited by
 * back, forward or a link, lands on the scroll position the visitor left it at.
 */
export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname();
  const positions = useRef(new Map<string, number>());
  const currentKey = useRef<string | null>(null);

  // Record where the visitor is leaving from, before the next page swaps in
  // and the browser clamps the scroll offset.
  useEffect(() => {
    const save = () => {
      if (currentKey.current) positions.current.set(currentKey.current, window.scrollY);
    };
    document.addEventListener("click", save, true);
    window.addEventListener("popstate", save);
    return () => {
      document.removeEventListener("click", save, true);
      window.removeEventListener("popstate", save);
    };
  }, []);

  useEffect(() => {
    const key = urlKey();
    currentKey.current = key;

    // Preserve in-page hash navigation (e.g. "/#play").
    if (window.location.hash) return;

    const target = isCaseStudyPath(stripReviewBase(location.pathname)) ? 0 : (positions.current.get(key) ?? 0);
    window.scrollTo({ top: target, left: 0, behavior: "instant" });
    if (target === 0) return;

    // The page may not be tall enough yet (images, lazy sections), so keep
    // nudging until it is, unless the visitor starts scrolling themselves.
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      USER_INPUT_EVENTS.forEach((type) => window.removeEventListener(type, stop));
    };
    USER_INPUT_EVENTS.forEach((type) => window.addEventListener(type, stop, { passive: true }));
    const startedAt = performance.now();
    const tick = () => {
      window.scrollTo({ top: target, left: 0, behavior: "instant" });
      if (Math.abs(window.scrollY - target) < 2 || performance.now() - startedAt > RESTORE_TIMEOUT_MS) {
        stop();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return stop;
  }, [pathname]);

  return null;
}
