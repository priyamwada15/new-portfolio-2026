"use client";

import { useEffect, useRef, useState } from "react";
import { FloorPlanScene, ROOT_H, ROOT_W } from "./FloorPlanScene";

/** Scales the fixed 1728x1117 floor-plan canvas to fit the viewport width, capped at 1x. */
export function FloorPlanScaler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => setScale(container.getBoundingClientRect().width / ROOT_W);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: ROOT_H * scale }}>
      <div className="absolute left-0 top-0" style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <FloorPlanScene />
      </div>
    </div>
  );
}
