"use client";

import { useEffect, useState } from "react";

/** Ignore scroll deltas smaller than this so trackpad jitter doesn't toggle the nav. */
const MIN_DELTA_PX = 6;

/**
 * True while the user is scrolling down past `revealZonePx`; false when scrolling up
 * or near the top of the page. Used to slide the nav out of the way.
 */
export function useHideOnScroll(revealZonePx = 120) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (y <= revealZonePx) {
        setHidden(false);
      } else if (Math.abs(delta) >= MIN_DELTA_PX) {
        setHidden(delta > 0);
      } else {
        return; // keep lastY so small moves accumulate
      }
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [revealZonePx]);

  return hidden;
}
