"use client";

import { useEffect, useRef } from "react";

// Shadow-band ray effect — visible only on md+ (≥768px) screens.
// Technique: semi-transparent dark bands; the gaps between them read as
// light rays (venetian blind / leaf shadow effect). Works on any light bg.
// Each ray's travel distance is a CSS custom property so a single
// @keyframes rule handles all of them without duplication.

const RAYS = [
  // Sharper shadow bands — kept low so #FAFAFA body bg does not read grey
  { left: 36, width: 42, opacity: 0.035, dur: 3, delay: 0, dist: 40 },
  { left: 43, width: 36, opacity: 0.04, dur: 2.5, delay: -0.5, dist: 52 },
  { left: 49, width: 44, opacity: 0.03, dur: 3.5, delay: -1, dist: 44 },
  { left: 55, width: 38, opacity: 0.038, dur: 2.5, delay: -1.5, dist: 48 },
  { left: 61, width: 42, opacity: 0.032, dur: 4, delay: -0.8, dist: 36 },
  { left: 67, width: 36, opacity: 0.035, dur: 3, delay: -2, dist: 40 },
  // Soft wide bands — no blur filter (expensive during scroll)
  { left: 40, width: 110, opacity: 0.012, dur: 8, delay: -2, dist: 28 },
  { left: 60, width: 120, opacity: 0.01, dur: 9, delay: -3, dist: 22 },
] as const;

/** Set true to restore the yellow/peach radial wash (top-right). */
const WARM_GLOW_ENABLED = false;

export function SunlightEffect({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let timer = 0;
    const onScroll = () => {
      root.classList.add("sunlight-scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        root.classList.remove("sunlight-scrolling");
      }, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={className ?? "absolute inset-0 overflow-hidden pointer-events-none hidden md:block"}
      style={{ contain: "strict", isolation: "isolate" }}
      aria-hidden="true"
    >
      {WARM_GLOW_ENABLED ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "75%",
              height: "75%",
              background:
                "radial-gradient(ellipse at top right, rgba(255, 248, 200, 0.45) 0%, rgba(255, 245, 220, 0.18) 45%, transparent 72%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 120% 80% at 85% 0%, rgba(255, 252, 245, 0.35) 0%, transparent 55%)",
            }}
          />
        </>
      ) : null}

      {RAYS.map((ray, i) => (
        <div
          key={i}
          className="sun-ray"
          style={{
            position: "absolute",
            top: "-60%",
            left: `${ray.left}%`,
            width: `${ray.width}px`,
            height: "240%",
            background:
              "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 50%, transparent 100%)",
            transform: "rotate(-35deg) translateZ(0)",
            transformOrigin: "top center",
            opacity: ray.opacity,
            animation: `sun-ray-sway ${ray.dur}s ease-in-out infinite alternate`,
            animationDelay: `${ray.delay}s`,
            "--ray-dist": `${ray.dist}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
