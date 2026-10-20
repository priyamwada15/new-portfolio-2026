"use client";

import { useEffect, useRef } from "react";

const CELL = 8;
const GAP = 1;
const LIFE_MS = 700;
const MAX_ALPHA = 0.85;
const ROSE_SHARE = 0.3;
/** Trail: clear space kept around the card and headline, then a fade up to full strength. */
const AVOID_CLEARANCE = 24;
const AVOID_FADE = 96;
/** Headline push: how far the cursor reaches, and the most a word moves. */
const PUSH_RADIUS = 160;
const PUSH_X_MAX = 24;
const PUSH_Y_MAX = 16;
/** The most a line may move toward the line next to it. */
const LINE_INWARD_MAX = 4;
/** Easing per frame (0–1): words part quickly and settle back slowly. */
const PART_EASE = 0.18;
const SETTLE_EASE = 0.035;
/** Gap pixels: new ones appear only every so often and linger, so the gaps shimmer slowly. */
const GAP_SPRAY_MS = 160;
const GAP_LIFE_MS = 1400;
/** Share of a gap pixel's life spent fading in, so it doesn't pop on. */
const GAP_FADE_IN = 0.25;

type Cell = { born: number; life: number; strength: number; color: string; fadeIn: number };
type Rect = { left: number; top: number; right: number; bottom: number };
type Word = { el: HTMLElement; base: Rect; x: number; y: number; tx: number; ty: number };

/**
 * Pixel trail across the homepage hero, plus the headline push. Cells light up
 * along the cursor path, fading to nothing around the license card
 * (`[data-pixel-avoid]`) and the headline. Near the headline, words (`[data-push-word]`)
 * are pushed away from the cursor and pixels fill the gaps they open; when the
 * cursor leaves, the words settle back slowly. Mouse only; off with reduced
 * motion. The draw loop runs only while something is still moving or fading.
 */
export function HeroPixels() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    const pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rootStyle = getComputedStyle(document.documentElement);
    const olive = rootStyle.getPropertyValue("--ds-pixel-olive").trim();
    const rose = rootStyle.getPropertyValue("--ds-pixel-rose").trim();

    // Everything below is in hero coordinates, so it scrolls with the hero.
    const cells = new Map<string, Cell>();
    let avoid: Rect[] = [];
    let words: Word[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastSpray = 0;
    let last: { x: number; y: number } | null = null;
    let pointer: { x: number; y: number } | null = null;

    const toHero = (r: DOMRect, origin: DOMRect): Rect => ({
      left: r.left - origin.left,
      top: r.top - origin.top,
      right: r.right - origin.left,
      bottom: r.bottom - origin.top,
    });

    const measure = () => {
      const dpr = window.devicePixelRatio || 1;
      const origin = hero.getBoundingClientRect();
      width = origin.width;
      height = origin.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      avoid = Array.from(hero.querySelectorAll<HTMLElement>("[data-pixel-avoid]"), (el) =>
        toHero(el.getBoundingClientRect(), origin),
      );
      // Word boxes without the push applied
      words = Array.from(hero.querySelectorAll<HTMLElement>("[data-push-word]"), (el) => {
        const prev = words.find((w) => w.el === el);
        const r = toHero(el.getBoundingClientRect(), origin);
        const x = prev?.x ?? 0;
        const y = prev?.y ?? 0;
        return {
          el,
          base: { left: r.left - x, top: r.top - y, right: r.right - x, bottom: r.bottom - y },
          x,
          y,
          tx: prev?.tx ?? 0,
          ty: prev?.ty ?? 0,
        };
      });
    };

    const smooth = (t: number) => t * t * (3 - 2 * t);
    const distToRect = (x: number, y: number, r: Rect) =>
      Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));

    /** 0 near the card and headline words, rising to 1 past the fade. */
    const trailStrength = (x: number, y: number) => {
      let d = Infinity;
      for (const r of avoid) d = Math.min(d, distToRect(x, y, r));
      for (const w of words) d = Math.min(d, distToRect(x, y, w.base));
      if (d <= AVOID_CLEARANCE) return 0;
      return smooth(Math.min(1, (d - AVOID_CLEARANCE) / AVOID_FADE));
    };

    const setCell = (cx: number, cy: number, strength: number, now: number, life: number, fadeIn = 0) => {
      if (cx < 0 || cy < 0 || (cx + 1) * CELL > width || (cy + 1) * CELL > height) return;
      cells.set(`${cx},${cy}`, { born: now, life, strength, fadeIn, color: Math.random() < ROSE_SHARE ? rose : olive });
    };

    const lightTrail = (x: number, y: number, now: number) => {
      const cx = Math.floor(x / CELL);
      const cy = Math.floor(y / CELL);
      const strength = trailStrength(cx * CELL + CELL / 2, cy * CELL + CELL / 2);
      // Sparser near the card and headline, not just fainter
      if (strength <= 0 || Math.random() > 0.35 + strength * 0.65) return;
      setCell(cx, cy, strength, now, LIFE_MS);
    };

    /** Where each word should sit for the current cursor position. */
    const aimWords = () => {
      for (const w of words) {
        w.tx = 0;
        w.ty = 0;
      }
      if (!pointer) return;
      const { x: px, y: py } = pointer;
      for (const w of words) {
        const cx = (w.base.left + w.base.right) / 2;
        const cy = (w.base.top + w.base.bottom) / 2;
        // Distance from the cursor to the word's box, so long words react along their length
        const d = distToRect(px, py, w.base);
        if (d >= PUSH_RADIUS) continue;
        const f = (1 - d / PUSH_RADIUS) ** 2;
        // Sideways: away from the cursor, so words on either side part
        w.tx = Math.sign(cx - px || 1) * PUSH_X_MAX * f;
        // Up or down: away from the cursor, strongest for the word right under it
        const inside = px >= w.base.left && px <= w.base.right;
        w.ty = Math.sign(cy - py || 1) * PUSH_Y_MAX * f * (inside ? 1 : 0.5);
      }

      // Neighbours make room: on each line, a word never moves back toward the cursor
      // past the word between them, so pushed words carry the rest of the line along
      const lines = [...new Set(words.map((w) => Math.round(w.base.top)))].sort((a, b) => a - b);
      lines.forEach((top, li) => {
        const line = words.filter((w) => Math.round(w.base.top) === top);
        for (let i = 1; i < line.length; i++) {
          if ((line[i].base.left + line[i].base.right) / 2 > px) line[i].tx = Math.max(line[i].tx, line[i - 1].tx);
        }
        for (let i = line.length - 2; i >= 0; i--) {
          if ((line[i].base.left + line[i].base.right) / 2 < px) line[i].tx = Math.min(line[i].tx, line[i + 1].tx);
        }
        // Lines only move a little toward each other, so they never collide
        for (const w of line) {
          if (li < lines.length - 1) w.ty = Math.min(w.ty, LINE_INWARD_MAX);
          if (li > 0) w.ty = Math.max(w.ty, -LINE_INWARD_MAX);
        }
      });
    };

    /** Pixels in the space the words open up: between parted words and where a word left its line. */
    const lightGaps = (now: number) => {
      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const next = words[i + 1];
        const lineTop = w.base.top;
        const lineBottom = w.base.bottom;
        // Extra space between this word and the next one on the same line
        if (next && Math.abs(next.base.top - w.base.top) < 4) {
          const open = next.x - w.x;
          if (open > CELL / 2) {
            const from = w.base.right + w.x;
            const to = next.base.left + next.x;
            const gx = from + (to - from - open) / 2;
            spray(gx, lineTop, gx + open, lineBottom, open / (PUSH_X_MAX * 2), now);
          }
        }
        // Space left behind on the word's line when it lifts or drops
        if (Math.abs(w.y) > CELL / 2) {
          const top = w.y < 0 ? lineBottom + w.y : lineTop;
          const bottom = w.y < 0 ? lineBottom : lineTop + w.y;
          spray(w.base.left + w.x, top, w.base.right + w.x, bottom, Math.abs(w.y) / PUSH_Y_MAX, now);
        }
      }
    };

    const spray = (l: number, t: number, r: number, b: number, amount: number, now: number) => {
      const cols = Math.floor((r - l) / CELL);
      const rows = Math.floor((b - t) / CELL);
      if (cols <= 0 || rows <= 0) return;
      const count = Math.ceil(cols * rows * 0.2 * amount);
      for (let i = 0; i < count; i++) {
        const cx = Math.floor(l / CELL) + 1 + Math.floor(Math.random() * cols);
        const cy = Math.floor(t / CELL) + Math.floor(Math.random() * rows);
        // Leave a lit cell to finish its fade instead of restarting it
        if (cells.has(`${cx},${cy}`)) continue;
        setCell(cx, cy, Math.min(1, 0.5 + amount), now, GAP_LIFE_MS, GAP_FADE_IN);
      }
    };

    const draw = () => {
      const now = performance.now();

      // Words ease toward their aim: quick to part, slow to settle back
      let moving = false;
      for (const w of words) {
        const parting = Math.abs(w.tx) + Math.abs(w.ty) > Math.abs(w.x) + Math.abs(w.y);
        const ease = parting ? PART_EASE : SETTLE_EASE;
        w.x += (w.tx - w.x) * ease;
        w.y += (w.ty - w.y) * ease;
        if (Math.abs(w.tx - w.x) < 0.05 && Math.abs(w.ty - w.y) < 0.05) {
          w.x = w.tx;
          w.y = w.ty;
        } else {
          moving = true;
        }
        w.el.style.translate = w.x || w.y ? `${w.x.toFixed(2)}px ${w.y.toFixed(2)}px` : "";
      }
      if (pointer && now - lastSpray >= GAP_SPRAY_MS) {
        lastSpray = now;
        lightGaps(now);
      }

      ctx.clearRect(0, 0, width, height);
      for (const [key, cell] of cells) {
        const age = (now - cell.born) / cell.life;
        if (age >= 1) {
          cells.delete(key);
          continue;
        }
        const [cx, cy] = key.split(",").map(Number);
        const fade = cell.fadeIn && age < cell.fadeIn ? age / cell.fadeIn : (1 - age) * (1 - age);
        ctx.globalAlpha = MAX_ALPHA * cell.strength * fade;
        ctx.fillStyle = cell.color;
        ctx.fillRect(cx * CELL, cy * CELL, CELL - GAP, CELL - GAP);
      }
      frame = moving || cells.size > 0 ? requestAnimationFrame(draw) : 0;
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const origin = hero.getBoundingClientRect();
      const x = e.clientX - origin.left;
      const y = e.clientY - origin.top;
      if (x < 0 || y < 0 || x > origin.width || y > origin.height) {
        onLeave();
        return;
      }
      // The card floats and drifts toward the cursor, so re-measure what to avoid
      avoid = Array.from(hero.querySelectorAll<HTMLElement>("[data-pixel-avoid]"), (el) =>
        toHero(el.getBoundingClientRect(), origin),
      );
      const now = performance.now();
      const from = last ?? { x, y };
      last = { x, y };
      pointer = { x, y };
      const dist = Math.hypot(x - from.x, y - from.y);
      const steps = Math.max(1, Math.ceil(dist / CELL));
      for (let i = 1; i <= steps; i++) {
        lightTrail(from.x + ((x - from.x) * i) / steps, from.y + ((y - from.y) * i) / steps, now);
      }
      // Faster movement scatters more cells around the cursor
      const scatter = Math.min(6, Math.floor(dist / 12));
      for (let i = 0; i < scatter; i++) {
        lightTrail(x + (Math.random() - 0.5) * CELL * 5, y + (Math.random() - 0.5) * CELL * 5, now);
      }
      aimWords();
      wake();
    };

    const onLeave = () => {
      last = null;
      if (!pointer) return;
      pointer = null;
      aimWords();
      wake();
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      cells.clear();
      last = null;
      pointer = null;
      for (const w of words) {
        w.x = w.y = w.tx = w.ty = 0;
        w.el.style.translate = "";
      }
      ctx.clearRect(0, 0, width, height);
    };
    const onVisibility = () => {
      if (document.hidden) reset();
    };
    const resizeObserver = new ResizeObserver(measure);

    let active = false;
    const sync = () => {
      const shouldRun = pointerMq.matches && !reducedMq.matches;
      if (shouldRun === active) return;
      active = shouldRun;
      if (active) {
        measure();
        resizeObserver.observe(hero);
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
      } else {
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        reset();
      }
    };

    // Word boxes shift as the web font loads and as the words' appear animation ends
    const remeasure = () => active && measure();
    sync();
    document.fonts?.ready.then(remeasure);
    hero.addEventListener("animationend", remeasure);
    pointerMq.addEventListener("change", sync);
    reducedMq.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pointerMq.removeEventListener("change", sync);
      reducedMq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
      hero.removeEventListener("animationend", remeasure);
      active = false;
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      reset();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}
