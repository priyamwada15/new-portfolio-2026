"use client";

import { useEffect, useRef, useState } from "react";
import { FloorPlanScene, HERO_FOCUS_X, HERO_FOCUS_Y, ROOT_H, ROOT_W } from "./FloorPlanScene";
import "./floor-plan-tilt.css";

/**
 * Below this scale, phone-sized text and tap targets become unusable (e.g.
 * the ~41px social icons would render under 10px at the old fit-to-width
 * formula on a 375px phone). Mobile floors the scale here and scrolls
 * horizontally instead of shrinking further.
 */
const MOBILE_MIN_SCALE = 0.65;

/**
 * Scales the fixed 1728x1117 floor-plan canvas to fit the viewport width,
 * floored at MOBILE_MIN_SCALE. On anything wider than ~1123px
 * (MOBILE_MIN_SCALE * ROOT_W) the floor never engages, so tablet/desktop
 * behavior is unchanged from the old fit-to-width formula. On narrower
 * (phone) viewports, the canvas becomes wider than its container and the
 * wrapper scrolls horizontally (scrollbar hidden via .floor-plan-scroll in
 * floor-plan-tilt.css) instead of shrinking past the floor.
 */
export function FloorPlanScaler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const width = container.getBoundingClientRect().width;
      const nextScale = Math.max(MOBILE_MIN_SCALE, width / ROOT_W);
      setScale(nextScale);

      // nextScale * ROOT_W > width means the floor is engaged (canvas is
      // wider than the container) — that's the only case with anything to
      // scroll/center. Only do this once, on the first render where it's
      // true, so a later resize (e.g. address bar collapsing) doesn't
      // clobber a position the visitor has since scrolled to themselves.
      const isFloorEngaged = nextScale * ROOT_W > width + 1;
      if (!hasCenteredRef.current && isFloorEngaged) {
        hasCenteredRef.current = true;
        const nextClientHeight = ROOT_H * nextScale;
        // Defer to the next frame: scrollLeft/scrollTop assignments are
        // clamped to the CURRENT scrollWidth/scrollHeight at assignment
        // time, and the DOM hasn't re-rendered with nextScale yet (setScale
        // above just scheduled that). Waiting a frame lets React commit the
        // wider layout first, so the assignment below isn't clamped back to
        // the old (narrower) scroll range.
        requestAnimationFrame(() => {
          container.scrollLeft = Math.max(0, HERO_FOCUS_X * nextScale - width / 2);
          container.scrollTop = Math.max(0, HERO_FOCUS_Y * nextScale - nextClientHeight / 2);
        });
      }
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="floor-plan-scroll relative w-full overflow-x-auto"
      style={{ height: ROOT_H * scale }}
    >
      <div className="absolute left-0 top-0" style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <FloorPlanScene />
      </div>
    </div>
  );
}
