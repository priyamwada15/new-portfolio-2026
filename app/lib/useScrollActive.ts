"use client";

import { useEffect, useRef } from "react";

/** True while the user is actively scrolling (clears shortly after scroll stops). */
export function useScrollActive(timeoutMs = 120) {
  const scrollingRef = useRef(false);

  useEffect(() => {
    let timer = 0;

    const onScroll = () => {
      scrollingRef.current = true;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        scrollingRef.current = false;
      }, timeoutMs);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [timeoutMs]);

  return scrollingRef;
}
