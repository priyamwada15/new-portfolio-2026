"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast as sonnerToast } from "sonner";
import { toastRestartPrompt } from "@/components/ui/pixelact-ui/toast";

const BASE_SCROLL_PX_PER_SEC = 165;
const SCROLL_RAMP_INTERVAL_SEC = 5;
const SCROLL_RAMP_DELTA_PX_PER_SEC = 28;
const SCROLL_PX_PER_SEC_MAX = 380;
const LATERAL_PX_PER_SEC = 300;
const KERB_W = 14;
const CAR_W = 86;
const CAR_IMG_H = 150;
const CAR_BOTTOM_FRAC = 0.11;
/** Collision: top band only, narrower than car width (excludes “sides” of silhouette). */
const CAR_HITBOX_H = 28;
const CAR_HITBOX_W = 38;
const MAX_OBSTACLES = 8;
const SPAWN_INTERVAL_SEC = 2.35;

/** Total track width (kerbs + asphalt); centered on viewport. */
const TRACK_W_CLASS = "w-[min(392px,calc(100vw-32px))]";

type Obstacle = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
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
 * Full-viewport #111111 with a centered strip (white kerb | asphalt | white kerb).
 * Obstacles are white. ArrowLeft / ArrowRight steer.
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
  /** Re-render after obstacle sim without storing the array in React state each frame */
  const [, setMotionTick] = useState(0);

  useEffect(() => {
    if (!gameRunning) return;
    lastTRef.current = null;
    scrollPxPerSecRef.current = BASE_SCROLL_PX_PER_SEC;
    scrollRampAccRef.current = 0;
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
        if (
          spawnAccRef.current >= SPAWN_INTERVAL_SEC &&
          obs.length < MAX_OBSTACLES
        ) {
          spawnAccRef.current = 0;
          const ow = 44 + Math.random() * 52;
          const oh = 14 + Math.random() * 18;
          const pad = 4;
          const innerLeft = pad;
          const innerRight = w - pad;
          const span = innerRight - innerLeft - ow;
          const x =
            span >= 8
              ? innerLeft + Math.random() * span
              : Math.max(pad, (w - ow) / 2);
          obs.push({
            id: nextIdRef.current++,
            x,
            y: -oh - 4,
            w: ow,
            h: oh,
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

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 isolate z-0 overflow-hidden bg-[#111111] outline-none"
      role="application"
      aria-label="Race game. Use arrow left and arrow right to steer and avoid blocks."
      tabIndex={0}
    >
      <div
        className={`absolute left-1/2 top-0 bottom-0 z-[1] flex -translate-x-1/2 ${TRACK_W_CLASS}`}
      >
        <div
          className="pointer-events-none shrink-0 bg-[#FFFFFF]"
          style={{ width: KERB_W }}
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
                className="absolute rounded-sm bg-[#FFFFFF]"
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
          className="pointer-events-none shrink-0 bg-[#FFFFFF]"
          style={{ width: KERB_W }}
          aria-hidden
        />
      </div>
    </div>
  );
}
