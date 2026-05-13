"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast as sonnerToast } from "sonner";
import { toastRestartPrompt } from "@/components/ui/pixelact-ui/toast";

const BASE_SCROLL_PX_PER_SEC = 165;
const SCROLL_RAMP_INTERVAL_SEC = 5;
const SCROLL_RAMP_DELTA_PX_PER_SEC = 28;
const SCROLL_PX_PER_SEC_MAX = 380;
const LATERAL_PX_PER_SEC = 300;
const KERB_W = 14;
/** Vertical dash + gap (terminal-style kerb segments). */
const KERB_DASH_PX = 6;
const KERB_GAP_PX = 8;
const KERB_STRIP_STYLE = {
  width: KERB_W,
  backgroundImage: `repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.6) 0 ${KERB_DASH_PX}px,
    transparent ${KERB_DASH_PX}px ${KERB_DASH_PX + KERB_GAP_PX}px
  )`,
} as const;
const CAR_W = 86;
const CAR_IMG_H = 150;
const CAR_BOTTOM_FRAC = 0.11;
/** Collision: top band only, narrower than car width (excludes “sides” of silhouette). */
const CAR_HITBOX_H = 28;
const CAR_HITBOX_W = 38;
const BASE_MAX_OBSTACLES = 8;
const MAX_OBSTACLES_CEIL = 15;
const SPAWN_INTERVAL_SEC = 2.35;
/** Terminal-style obstacle cells (█-like blocks). */
const CELL_PX = 9;
const GRID_BLOCK_SPAWN_CHANCE = 0.48;

const NOISE_LINE_H = 14;
const NOISE_LINE_CHARS = 7;
const NOISE_ROWS = 42;
const NOISE_PARALLAX = 0.38;

/** Total track width (kerbs + asphalt); centered on viewport. */
const TRACK_W_CLASS = "w-[min(392px,calc(100vw-32px))]";

function noiseLine(seed: number, w: number) {
  const chars = "#.:·";
  let out = "";
  for (let c = 0; c < w; c++) {
    const t = Math.sin(seed * 0.31 + c * 1.73) * 10000;
    const i = Math.floor((t - Math.floor(t)) * chars.length);
    out += chars[i] ?? ".";
  }
  return out;
}

function snapXToGrid(x: number, cell: number, minX: number) {
  return minX + Math.floor((x - minX) / cell) * cell;
}

type Obstacle = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Grid-sized “character cell” obstacle (█ strip). */
  gridBlock: boolean;
};

type AboutRaceStripProps = {
  carSrc: string;
  /** Simulation and controls run only after the intro dialog is closed. */
  gameRunning: boolean;
};

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return !(
    a.x + a.w < b.x ||
    a.x > b.x + b.w ||
    a.y + a.h < b.y ||
    a.y > b.y + b.h
  );
}

/**
 * Full-viewport #111111 with a centered strip (dashed white kerbs | asphalt | dashed white kerbs).
 * Terminal-style margin noise (# . : ·), scanlines + vignette, and grid “█” obstacles.
 */
export default function AboutRaceStrip({
  carSrc,
  gameRunning,
}: AboutRaceStripProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const carWrapRef = useRef<HTMLDivElement>(null);
  const lateralRef = useRef(0);
  const lateralMaxRef = useRef(120);
  const keysRef = useRef({ left: false, right: false });
  const lastTRef = useRef<number | null>(null);
  const nextIdRef = useRef(1);
  const spawnAccRef = useRef(0);
  const scrollPxPerSecRef = useRef(BASE_SCROLL_PX_PER_SEC);
  const scrollRampAccRef = useRef(0);
  const pausedRef = useRef(false);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const marginNoiseOffsetRef = useRef(0);
  /** Re-render after obstacle sim without storing the array in React state each frame */
  const [, setMotionTick] = useState(0);

  const noiseColumns = useMemo(() => {
    const baseLeft = Array.from({ length: NOISE_ROWS }, (_, i) =>
      noiseLine(i * 13, NOISE_LINE_CHARS)
    );
    const baseRight = Array.from({ length: NOISE_ROWS }, (_, i) =>
      noiseLine(i * 13 + 991, NOISE_LINE_CHARS)
    );
    const left = [...baseLeft, ...baseLeft, ...baseLeft];
    const right = [...baseRight, ...baseRight, ...baseRight];
    return { left, right };
  }, []);

  useEffect(() => {
    if (!gameRunning) return;
    lastTRef.current = null;
    scrollPxPerSecRef.current = BASE_SCROLL_PX_PER_SEC;
    scrollRampAccRef.current = 0;
    marginNoiseOffsetRef.current = 0;
    const el = rootRef.current;
    window.setTimeout(() => el?.focus(), 0);
  }, [gameRunning]);

  const restartGame = useCallback(() => {
    pausedRef.current = false;
    keysRef.current = { left: false, right: false };
    obstaclesRef.current = [];
    lateralRef.current = 0;
    spawnAccRef.current = 0;
    scrollPxPerSecRef.current = BASE_SCROLL_PX_PER_SEC;
    scrollRampAccRef.current = 0;
    marginNoiseOffsetRef.current = 0;
    nextIdRef.current = 1;
    lastTRef.current = null;
    const carEl = carWrapRef.current;
    if (carEl) carEl.style.transform = "translateX(-50%)";
    setMotionTick((n) => n + 1);
  }, []);

  useEffect(() => {
    const play = playRef.current;
    if (!play) return;

    const updateLateralMax = () => {
      const w = play.clientWidth;
      lateralMaxRef.current = Math.max(
        0,
        Math.min(200, (w - CAR_W) / 2 - 6)
      );
    };
    updateLateralMax();
    const ro = new ResizeObserver(updateLateralMax);
    ro.observe(play);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!gameRunning) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollMul = reduced ? 0.25 : 1;

    const onKeyDown = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      if (e.key === "ArrowLeft") {
        keysRef.current.left = true;
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        keysRef.current.right = true;
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      if (e.key === "ArrowLeft") {
        keysRef.current.left = false;
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        keysRef.current.right = false;
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let raf = 0;
    const tick = (t: number) => {
      if (lastTRef.current === null) lastTRef.current = t;
      const rawDt = (t - lastTRef.current) / 1000;
      const dt = Math.min(0.064, Math.max(0, rawDt));
      lastTRef.current = t;

      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        lastTRef.current = null;
        raf = requestAnimationFrame(tick);
        return;
      }

      const play = playRef.current;
      const carEl = carWrapRef.current;
      if (!play || !carEl) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (pausedRef.current) {
        raf = requestAnimationFrame(tick);
        return;
      }

      scrollRampAccRef.current += dt;
      while (scrollRampAccRef.current >= SCROLL_RAMP_INTERVAL_SEC) {
        scrollRampAccRef.current -= SCROLL_RAMP_INTERVAL_SEC;
        scrollPxPerSecRef.current = Math.min(
          SCROLL_PX_PER_SEC_MAX,
          scrollPxPerSecRef.current + SCROLL_RAMP_DELTA_PX_PER_SEC
        );
      }

      const w = play.clientWidth;
      const h = play.clientHeight;
      const dy = scrollPxPerSecRef.current * scrollMul * dt;

      if (!reduced) {
        marginNoiseOffsetRef.current += dy * NOISE_PARALLAX;
      }

      const k = keysRef.current;
      let latVel = 0;
      if (k.left) latVel -= LATERAL_PX_PER_SEC;
      if (k.right) latVel += LATERAL_PX_PER_SEC;
      const max = lateralMaxRef.current;
      lateralRef.current = Math.max(
        -max,
        Math.min(max, lateralRef.current + latVel * dt)
      );
      carEl.style.transform = `translateX(calc(-50% + ${lateralRef.current}px))`;

      const carTop = h - CAR_BOTTOM_FRAC * h - CAR_IMG_H;
      const carLeft = w / 2 + lateralRef.current - CAR_W / 2;
      const hitLeft = carLeft + (CAR_W - CAR_HITBOX_W) / 2;
      const carBox = {
        x: hitLeft,
        y: carTop,
        w: CAR_HITBOX_W,
        h: CAR_HITBOX_H,
      };

      let obs = obstaclesRef.current.map((o) => ({ ...o, y: o.y + dy }));
      obs = obs.filter((o) => o.y < h + 80);

      let didHit = false;
      for (const o of obs) {
        if (rectsOverlap(o, carBox)) {
          didHit = true;
          break;
        }
      }

      if (!didHit) {
        spawnAccRef.current += dt;
        const speedTier = Math.floor(
          (scrollPxPerSecRef.current - BASE_SCROLL_PX_PER_SEC) /
            SCROLL_RAMP_DELTA_PX_PER_SEC
        );
        const maxObstacles = Math.min(
          MAX_OBSTACLES_CEIL,
          BASE_MAX_OBSTACLES + Math.max(0, speedTier)
        );
        if (
          spawnAccRef.current >= SPAWN_INTERVAL_SEC &&
          obs.length < maxObstacles
        ) {
          spawnAccRef.current = 0;
          const pad = 4;
          const innerLeft = pad;
          const innerRight = w - pad;
          const gridBlock = Math.random() < GRID_BLOCK_SPAWN_CHANCE;
          let ow: number;
          let oh: number;
          let x: number;
          if (gridBlock) {
            const cols = 4 + Math.floor(Math.random() * 5);
            const rows = Math.random() < 0.14 ? 2 : 1;
            ow = cols * CELL_PX;
            oh = rows * CELL_PX;
            const spanSnap = innerRight - innerLeft - ow;
            const maxSteps = Math.max(0, Math.floor(spanSnap / CELL_PX));
            const step =
              maxSteps > 0 ? Math.floor(Math.random() * (maxSteps + 1)) : 0;
            x = snapXToGrid(innerLeft, CELL_PX, innerLeft) + step * CELL_PX;
            x = Math.max(innerLeft, Math.min(x, innerRight - ow));
          } else {
            ow = Math.round(44 + Math.random() * 52);
            oh = Math.round(14 + Math.random() * 18);
            const span = innerRight - innerLeft - ow;
            const rawX =
              span >= 8
                ? innerLeft + Math.random() * span
                : Math.max(pad, (w - ow) / 2);
            x = snapXToGrid(rawX, CELL_PX, innerLeft);
            x = Math.max(innerLeft, Math.min(x, innerRight - ow));
          }
          obs.push({
            id: nextIdRef.current++,
            x,
            y: -oh - 4,
            w: ow,
            h: oh,
            gridBlock,
          });
        }
      }

      obstaclesRef.current = obs;
      setMotionTick((n) => n + 1);

      if (didHit) {
        pausedRef.current = true;
        sonnerToast.dismiss();
        toastRestartPrompt(restartGame);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gameRunning, restartGame]);

  const obstacles = obstaclesRef.current;
  const noiseScrollPx = marginNoiseOffsetRef.current;
  const noisePatternH = NOISE_ROWS * NOISE_LINE_H;
  const noiseWrap = noisePatternH > 0 ? noiseScrollPx % noisePatternH : 0;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 isolate z-0 overflow-hidden bg-[#111111] outline-none"
      role="application"
      aria-label="Race game. Use arrow left and arrow right to steer and avoid blocks."
      tabIndex={0}
    >
      <div
        className="pointer-events-none fixed inset-y-0 left-0 z-[1] flex w-[min(96px,13vw)] justify-center overflow-hidden select-none"
        aria-hidden
      >
        <div
          className="font-mono text-[10px] leading-[14px] text-white/[0.085] whitespace-pre"
          style={{ transform: `translateY(-${noiseWrap}px)` }}
        >
          {noiseColumns.left.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
      <div
        className="pointer-events-none fixed inset-y-0 right-0 z-[1] flex w-[min(96px,13vw)] justify-center overflow-hidden select-none"
        aria-hidden
      >
        <div
          className="font-mono text-[10px] leading-[14px] text-white/[0.085] whitespace-pre"
          style={{ transform: `translateY(-${(noiseScrollPx * 0.82) % noisePatternH}px)` }}
        >
          {noiseColumns.right.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      <div
        className={`absolute left-1/2 top-0 bottom-0 z-[3] flex -translate-x-1/2 ${TRACK_W_CLASS}`}
      >
        <div
          className="pointer-events-none shrink-0"
          style={KERB_STRIP_STYLE}
          aria-hidden
        />
        <div
          ref={playRef}
          className="relative isolate min-h-0 min-w-0 flex-1 overflow-hidden bg-[#111111]"
        >
          <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden>
            {obstacles.map((o) => (
              <div
                key={o.id}
                className={
                  o.gridBlock
                    ? "absolute rounded-[2px] bg-white/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
                    : "absolute rounded-sm bg-white/60"
                }
                style={{
                  left: o.x,
                  top: o.y,
                  width: o.w,
                  height: o.h,
                }}
              />
            ))}
          </div>

          <div
            ref={carWrapRef}
            className="pointer-events-none absolute bottom-[11%] left-1/2 z-20 will-change-transform"
            style={{ transform: "translateX(-50%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local SVG from /public */}
            <img
              src={carSrc}
              alt=""
              className="relative h-[150px] w-auto max-w-[min(100%,320px)] object-contain [image-rendering:pixelated]"
              draggable={false}
            />
          </div>
        </div>
        <div
          className="pointer-events-none shrink-0"
          style={KERB_STRIP_STYLE}
          aria-hidden
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 90% 72% at 50% 48%, transparent 22%, rgba(0,0,0,0.38) 100%)",
            "repeating-linear-gradient(180deg, transparent, transparent 2px, rgba(0,0,0,0.14) 2px, rgba(0,0,0,0.14) 3px)",
          ].join(","),
        }}
        aria-hidden
      />
    </div>
  );
}
