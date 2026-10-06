"use client";

import { useEffect, useRef } from "react";

const CELL = 10;
const GAP = 1;
const LIFE_MS = 700;
const MAX_ALPHA = 0.85;
/** Clear space kept between the last visible cell and the content column. */
const EDGE_CLEARANCE = 24;
/** Clear space kept between the last visible cell and a card above or below a gap. */
const GAP_CLEARANCE = 16;
const ROSE_SHARE = 0.3;
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
/** Side gutters are too thin below this; section gaps run at every width. */
const GUTTER_QUERY = "(min-width: 1024px)";
/** Content blocks: `[data-pixel-block]` elements and children of `[data-pixel-blocks]`. */
const BLOCK_SELECTOR = "[data-pixel-block], [data-pixel-blocks] > *";

type Cell = { born: number; strength: number; color: string };

/**
 * Pixel trail in the side gutters of the homepage and the gaps between its
 * sections. Cells light up along the cursor path, strongest at the viewport
 * edge and along the middle of each gap, fading out before the content.
 * Measures the content column it is rendered after, and stays inside its
 * parent (the page container) so it never draws over the footer.
 * The draw loop runs only while cells are still fading.
 */
export function GutterPixels() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = canvas?.previousElementSibling;
    const container = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !content || !container || !ctx) return;

    const pointerMq = window.matchMedia(POINTER_QUERY);
    const gutterMq = window.matchMedia(GUTTER_QUERY);
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rootStyle = getComputedStyle(document.documentElement);
    const olive = rootStyle.getPropertyValue("--ds-color-brand-hcn-olive").trim();
    const rose = rootStyle.getPropertyValue("--ds-color-brand-hcn-rose").trim();

    const cells = new Map<string, Cell>();
    let left = 0;
    let right = 0;
    let width = 0;
    let gaps: { top: number; bottom: number }[] = [];
    // Vertical extent of the page container, in viewport coordinates
    let clipTop = 0;
    let clipBottom = 0;
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

    /** Vertical gaps between content blocks, in viewport coordinates. Blocks
     *  sharing a row (intro + Adtua on desktop) count as one. */
    const measureClip = () => {
      const rect = container.getBoundingClientRect();
      clipTop = rect.top;
      clipBottom = rect.bottom;
    };

    const measureGaps = () => {
      const rects = Array.from(content.querySelectorAll(BLOCK_SELECTOR), (el) => el.getBoundingClientRect())
        .filter((r) => r.height > 0)
        .sort((a, b) => a.top - b.top);
      gaps = [];
      let bottom = rects[0]?.bottom ?? 0;
      for (const r of rects.slice(1)) {
        if (r.top > bottom) gaps.push({ top: bottom, bottom: r.top });
        bottom = Math.max(bottom, r.bottom);
      }
    };

    const smooth = (t: number) => t * t * (3 - 2 * t);

    /** 1 at the viewport edge, 0 at EDGE_CLEARANCE from the content column. */
    const gutterStrength = (x: number) => {
      if (!gutterMq.matches || (x >= left && x <= right)) return 0;
      const gutter = x < left ? left : width - right;
      const fromContent = x < left ? left - x : x - right;
      if (fromContent <= EDGE_CLEARANCE || gutter <= EDGE_CLEARANCE) return 0;
      return smooth(Math.min(1, (fromContent - EDGE_CLEARANCE) / (gutter - EDGE_CLEARANCE)));
    };

    /** 1 along the middle of a gap, 0 at GAP_CLEARANCE from the blocks around it.
     *  Spans the full width so the band joins the gutters without a seam. */
    const gapStrength = (y: number) => {
      const gap = gaps.find((g) => y > g.top && y < g.bottom);
      if (!gap) return 0;
      const half = (gap.bottom - gap.top) / 2;
      const fromBlock = Math.min(y - gap.top, gap.bottom - y);
      if (fromBlock <= GAP_CLEARANCE || half <= GAP_CLEARANCE) return 0;
      return smooth(Math.min(1, (fromBlock - GAP_CLEARANCE) / (half - GAP_CLEARANCE)));
    };

    const strengthAt = (x: number, y: number) => Math.max(gutterStrength(x), gapStrength(y));

    const light = (x: number, y: number, now: number) => {
      const cx = Math.floor(x / CELL);
      const cy = Math.floor(y / CELL);
      // Whole cells only, so none straddle the container's edge
      if (cy * CELL < clipTop || (cy + 1) * CELL > clipBottom) return;
      const strength = strengthAt(cx * CELL + CELL / 2, cy * CELL + CELL / 2);
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
      // The container scrolls under the fixed canvas, so re-clip every frame
      // to keep fading cells off the footer
      measureClip();
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, clipTop, width, Math.max(0, clipBottom - clipTop));
      ctx.clip();
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
      ctx.restore();
      frame = cells.size > 0 ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      const from = last ?? { x: e.clientX, y: e.clientY };
      last = { x: e.clientX, y: e.clientY };
      // Blocks move under the fixed canvas as the page scrolls
      measureGaps();
      measureClip();
      if (e.clientY < clipTop || e.clientY > clipBottom) return;

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
      const shouldRun = pointerMq.matches && !reducedMq.matches;
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
    pointerMq.addEventListener("change", sync);
    reducedMq.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pointerMq.removeEventListener("change", sync);
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
