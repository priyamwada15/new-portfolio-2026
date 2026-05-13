"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/pixelact-ui/button";

const SCROLL_PX_PER_SEC = 165;
const LATERAL_PX_PER_SEC = 300;
const KERB_W = 14;
const CAR_W = 86;
const CAR_IMG_H = 150;
const CAR_BOTTOM_FRAC = 0.11;
/** Collision: top band only, narrower than car width (excludes “sides” of silhouette). */
const CAR_HITBOX_H = 28;
const CAR_HITBOX_W = 38;
const MAX_OBSTACLES = 4;
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
 * Full-viewport #FFFFFF void with a centered playable strip (kerb | asphalt | kerb).
 * Obstacles and car exist only in the asphalt band. ArrowLeft / ArrowRight steer.
 */
export default function AboutRaceStrip({ carSrc }: AboutRaceStripProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const carWrapRef = useRef<HTMLDivElement>(null);
  const lateralRef = useRef(0);
  const lateralMaxRef = useRef(120);
  const keysRef = useRef({ left: false, right: false });
  const lastTRef = useRef<number | null>(null);
  const nextIdRef = useRef(1);
  const spawnAccRef = useRef(0);
  const pausedRef = useRef(false);
  const obstaclesRef = useRef<Obstacle[]>([]);
  /** Re-render after obstacle sim without storing the array in React state each frame */
  const [, setMotionTick] = useState(0);
  const [showRestartToast, setShowRestartToast] = useState(false);

  const restartGame = useCallback(() => {
    pausedRef.current = false;
    keysRef.current = { left: false, right: false };
    obstaclesRef.current = [];
    lateralRef.current = 0;
    spawnAccRef.current = 0;
    nextIdRef.current = 1;
    lastTRef.current = null;
    const carEl = carWrapRef.current;
    if (carEl) carEl.style.transform = "translateX(-50%)";
    setShowRestartToast(false);
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

      const w = play.clientWidth;
      const h = play.clientHeight;
      const dy = SCROLL_PX_PER_SEC * scrollMul * dt;

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
        setShowRestartToast(true);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

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
          className="relative isolate min-h-0 min-w-0 flex-1 overflow-hidden bg-[#FFFFFF]"
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

      {showRestartToast ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]/90 p-4"
          role="presentation"
        >
          <div
            className="max-w-sm rounded-sm border border-white/10 bg-[#1a1a1a] p-5 shadow-lg"
            role="status"
            aria-live="polite"
          >
            <p className="pixel-font text-center text-sm leading-snug text-neutral-200">
              Oops! Let&apos;s restart the game.
            </p>
            <div className="mt-4 flex justify-center">
              <Button type="button" variant="default" onClick={restartGame}>
                Restart
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
