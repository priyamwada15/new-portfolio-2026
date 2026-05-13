"use client";

// Shadow-band ray effect — visible only on md+ (≥768px) screens.
// Technique: semi-transparent dark bands; the gaps between them read as
// light rays (venetian blind / leaf shadow effect). Works on any light bg.
// Each ray's travel distance is a CSS custom property so a single
// @keyframes rule handles all of them without duplication.

const RAYS = [
  // Sharper shadow bands centered in the viewport
  { left: 36, width: 42, blur: 4,  opacity: 0.07,  dur: 3,   delay: 0,    dist: 40 },
  { left: 43, width: 36, blur: 3,  opacity: 0.085, dur: 2.5, delay: -0.5, dist: 52 },
  { left: 49, width: 44, blur: 4,  opacity: 0.06,  dur: 3.5, delay: -1,   dist: 44 },
  { left: 55, width: 38, blur: 3,  opacity: 0.08,  dur: 2.5, delay: -1.5, dist: 48 },
  { left: 61, width: 42, blur: 4,  opacity: 0.065, dur: 4,   delay: -0.8, dist: 36 },
  { left: 67, width: 36, blur: 3,  opacity: 0.07,  dur: 3,   delay: -2,   dist: 40 },
  // Soft wide bands for atmospheric depth
  { left: 40, width: 110, blur: 18, opacity: 0.038, dur: 8, delay: -2, dist: 28 },
  { left: 60, width: 120, blur: 22, opacity: 0.030, dur: 9, delay: -3, dist: 22 },
] as const;

export function SunlightEffect({ className }: { className?: string }) {
  return (
    <div
      className={className ?? "absolute inset-0 overflow-hidden pointer-events-none hidden md:block"}
      aria-hidden="true"
    >
      {/* Warm radial glow from upper-right — the ambient light source */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "65%",
          height: "65%",
          background:
            "radial-gradient(ellipse at top right, rgba(255, 248, 200, 0.60) 0%, rgba(255, 240, 180, 0.22) 40%, transparent 70%)",
        }}
      />

      {/* Subtle dark-left gradient — matches the light-source directionality */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(100deg, rgba(0,0,0,0.04) 0%, transparent 55%)",
        }}
      />

      {/* Shadow bands — darker stripes; gaps between them read as light rays */}
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
            transform: "rotate(-35deg)",
            transformOrigin: "top center",
            opacity: ray.opacity,
            filter: `blur(${ray.blur}px)`,
            animation: `sun-ray-sway ${ray.dur}s ease-in-out infinite alternate`,
            animationDelay: `${ray.delay}s`,
            "--ray-dist": `${ray.dist}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
