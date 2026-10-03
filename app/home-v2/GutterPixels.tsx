"use client";

import { useEffect, useRef } from "react";

const CELL = 10;
const GAP = 1;
const LIFE_MS = 700;
const MAX_ALPHA = 0.85;
/** Clear space kept between the last visible cell and the content column. */
const EDGE_CLEARANCE = 24;
const ROSE_SHARE = 0.3;
const ENABLED_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

type Cell = { born: number; strength: number; color: string };

/**
 * Pixel trail in the side gutters of the homepage. Cells light up along the
 * cursor path, strongest at the viewport edge and fading out before the
 * content column. Measures the content column it is rendered after.
 * The draw loop runs only while cells are still fading.
 */
export function GutterPixels() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = canvas?.previousElementSibling;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !content || !ctx) return;

    const enabledMq = window.matchMedia(ENABLED_QUERY);
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rootStyle = getComputedStyle(document.documentElement);
    const olive = rootStyle.getPropertyValue("--ds-color-brand-hcn-olive").trim();
    const rose = rootStyle.getPropertyValue("--ds-color-brand-hcn-rose").trim();

    const cells = new Map<string, Cell>();
    let left = 0;
    let right = 0;
    let width = 0;
    let frame = 0;
    let last: { x: number; y: number } | null = null;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = document.documentElement.clientWidth;
      canvas.width = width * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rect = content.getBoundingClientRect();
      left = rect.left;
      right = rect.right;
    };

    /** 1 at the viewport edge, 0 at EDGE_CLEARANCE from the content column. */
    const strengthAt = (x: number) => {
      const gutter = x < left ? left : width - right;
      const fromContent = x < left ? left - x : x - right;
      if (fromContent <= EDGE_CLEARANCE || gutter <= EDGE_CLEARANCE) return 0;
      const t = Math.min(1, (fromContent - EDGE_CLEARANCE) / (gutter - EDGE_CLEARANCE));
      return t * t * (3 - 2 * t);
    };

    const light = (x: number, y: number, now: number) => {
      const cx = Math.floor(x / CELL);
      const cy = Math.floor(y / CELL);
      const strength = strengthAt(cx * CELL + CELL / 2);
      // Sparser near the content, not just fainter
      if (strength <= 0 || Math.random() > 0.35 + strength * 0.65) return;
      cells.set(`${cx},${cy}`, {
        born: now,
        strength,
        color: Math.random() < ROSE_SHARE ? rose : olive,
      });
    };

    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const [key, cell] of cells) {
        const age = (now - cell.born) / LIFE_MS;
        if (age >= 1) {
          cells.delete(key);
          continue;
        }
        const [cx, cy] = key.split(",").map(Number);
        ctx.globalAlpha = MAX_ALPHA * cell.strength * (1 - age) * (1 - age);
        ctx.fillStyle = cell.color;
        ctx.fillRect(cx * CELL, cy * CELL, CELL - GAP, CELL - GAP);
      }
      frame = cells.size > 0 ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      const from = last ?? { x: e.clientX, y: e.clientY };
      last = { x: e.clientX, y: e.clientY };
      if (e.clientX >= left && e.clientX <= right) return;

      const dist = Math.hypot(e.clientX - from.x, e.clientY - from.y);
      const steps = Math.max(1, Math.ceil(dist / CELL));
      for (let i = 1; i <= steps; i++) {
        light(from.x + ((e.clientX - from.x) * i) / steps, from.y + ((e.clientY - from.y) * i) / steps, now);
      }
      // Faster movement scatters more cells around the cursor
      const scatter = Math.min(6, Math.floor(dist / 12));
      for (let i = 0; i < scatter; i++) {
        light(e.clientX + (Math.random() - 0.5) * CELL * 5, e.clientY + (Math.random() - 0.5) * CELL * 5, now);
      }
      if (!frame && cells.size > 0) frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      cells.clear();
      last = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const onLeave = () => {
      last = null;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
    };

    let active = false;
    const sync = () => {
      const shouldRun = enabledMq.matches && !reducedMq.matches;
      if (shouldRun === active) return;
      active = shouldRun;
      if (active) {
        resize();
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("resize", resize);
        document.documentElement.addEventListener("pointerleave", onLeave);
      } else {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        stop();
      }
    };

    sync();
    enabledMq.addEventListener("change", sync);
    reducedMq.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      enabledMq.removeEventListener("change", sync);
      reducedMq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1, pointerEvents: "none" }}
    />
  );
}
