"use client";

import { useEffect, type RefObject } from "react";

/** How far the cursor reaches, and the most a word moves. */
const PUSH_RADIUS = 160;
const PUSH_X_MAX = 24;
const PUSH_Y_MAX = 16;
/** The most a line may move toward the line next to it. */
const LINE_INWARD_MAX = 4;
/** Pushing eases a share of the way each frame (about 0.8s to arrive), so words glide apart while the cursor moves. */
const PUSH_EASE = 0.06;
/** Settling home is a CSS transition, which runs on the compositor and lands without pixel snapping. */
const SETTLE = "translate 1600ms cubic-bezier(0.22, 1, 0.36, 1)";

type Word = {
  el: HTMLElement;
  left: number;
  top: number;
  right: number;
  bottom: number;
  /** Target and current push, in px */
  tx: number;
  ty: number;
  x: number;
  y: number;
};

/**
 * Headline push: words (`[data-push-word]` inside the hero's h1) move away
 * from the cursor, the rest of each line shifts along so nothing overlaps,
 * and the words settle back slowly when the cursor moves off. Mouse only;
 * off with reduced motion.
 */
export function useHeadlinePush(heroRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = heroRef.current;
    const title = hero?.querySelector("h1");
    if (!hero || !title) return;

    const pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const words: Word[] = Array.from(title.querySelectorAll<HTMLElement>("[data-push-word]"), (el) => ({
      el,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      tx: 0,
      ty: 0,
      x: 0,
      y: 0,
    }));
    let frame = 0;

    /** Word boxes in headline coordinates. Offsets ignore transforms, so the push doesn't feed back into them. */
    const measure = () => {
      for (const w of words) {
        w.left = w.el.offsetLeft;
        w.top = w.el.offsetTop;
        w.right = w.left + w.el.offsetWidth;
        w.bottom = w.top + w.el.offsetHeight;
      }
    };

    const distToBox = (x: number, y: number, w: Word) =>
      Math.hypot(Math.max(w.left - x, 0, x - w.right), Math.max(w.top - y, 0, y - w.bottom));

    /** Where each word should sit for a cursor at (px, py), or back home when there's no cursor. */
    const aim = (pointer: { x: number; y: number } | null) => {
      const targets = words.map(() => ({ x: 0, y: 0 }));
      if (!pointer) return targets;
      const { x: px, y: py } = pointer;
      words.forEach((w, i) => {
        const d = distToBox(px, py, w);
        if (d >= PUSH_RADIUS) return;
        const f = (1 - d / PUSH_RADIUS) ** 2;
        const cx = (w.left + w.right) / 2;
        const cy = (w.top + w.bottom) / 2;
        // Sideways: away from the cursor, so words on either side part
        targets[i].x = Math.sign(cx - px || 1) * PUSH_X_MAX * f;
        // Up or down: away from the cursor, strongest for the word right under it
        const under = px >= w.left && px <= w.right;
        targets[i].y = Math.sign(cy - py || 1) * PUSH_Y_MAX * f * (under ? 1 : 0.5);
      });

      // Neighbours make room: on each line, a word never moves back toward the cursor
      // past the word between them, so pushed words carry the rest of the line along
      const lines = [...new Set(words.map((w) => w.top))].sort((a, b) => a - b);
      lines.forEach((top, li) => {
        const line = words.flatMap((w, i) => (w.top === top ? [i] : []));
        for (let k = 1; k < line.length; k++) {
          const [prev, i] = [line[k - 1], line[k]];
          if ((words[i].left + words[i].right) / 2 > px) targets[i].x = Math.max(targets[i].x, targets[prev].x);
        }
        for (let k = line.length - 2; k >= 0; k--) {
          const [i, next] = [line[k], line[k + 1]];
          if ((words[i].left + words[i].right) / 2 < px) targets[i].x = Math.min(targets[i].x, targets[next].x);
        }
        // Lines only move a little toward each other, so they never collide
        for (const i of line) {
          if (li < lines.length - 1) targets[i].y = Math.min(targets[i].y, LINE_INWARD_MAX);
          if (li > 0) targets[i].y = Math.max(targets[i].y, -LINE_INWARD_MAX);
        }
      });
      return targets;
    };

    const apply = (pointer: { x: number; y: number } | null) => {
      const targets = aim(pointer);
      words.forEach((w, i) => {
        w.tx = targets[i].x;
        w.ty = targets[i].y;
      });

      // Nothing to push: every displaced word glides home on the slow settle
      if (words.every((w) => !w.tx && !w.ty)) {
        cancelAnimationFrame(frame);
        frame = 0;
        for (const w of words) {
          if (!w.el.style.translate || w.el.style.transition) continue;
          w.el.style.transition = SETTLE;
          w.el.style.translate = "0px 0px";
        }
        return;
      }

      // Pushing: pick up any word mid-settle from where it is now, then ease toward the targets
      for (const w of words) {
        if (!w.el.style.transition) continue;
        const [x = 0, y = 0] = getComputedStyle(w.el).translate.split(" ").map(parseFloat);
        w.x = Number.isFinite(x) ? x : 0;
        w.y = Number.isFinite(y) ? y : 0;
        w.el.style.transition = "";
        w.el.style.translate = `${w.x}px ${w.y}px`;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    /** Eases each word toward its target, frame by frame, on its own layer so it glides without pixel snapping. */
    const tick = () => {
      let moving = false;
      for (const w of words) {
        w.x += (w.tx - w.x) * PUSH_EASE;
        w.y += (w.ty - w.y) * PUSH_EASE;
        if (Math.abs(w.tx - w.x) < 0.02 && Math.abs(w.ty - w.y) < 0.02) {
          w.x = w.tx;
          w.y = w.ty;
        } else {
          moving = true;
        }
        if (!w.x && !w.y) {
          clear(w);
          continue;
        }
        w.el.style.willChange = "translate";
        w.el.style.translate = `${w.x.toFixed(2)}px ${w.y.toFixed(2)}px`;
      }
      frame = moving ? requestAnimationFrame(tick) : 0;
    };

    const clear = (w: Word) => {
      w.x = w.y = 0;
      w.el.style.willChange = "";
      w.el.style.transition = "";
      w.el.style.translate = "";
    };

    // Once a word has settled home, drop its layer so the text renders exactly as before
    const onTransitionEnd = (e: TransitionEvent) => {
      const w = words.find((word) => word.el === e.target);
      if (w && e.propertyName === "translate" && !w.tx && !w.ty) clear(w);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const heroRect = hero.getBoundingClientRect();
      if (e.clientX < heroRect.left || e.clientX > heroRect.right || e.clientY < heroRect.top || e.clientY > heroRect.bottom) {
        apply(null);
        return;
      }
      measure();
      const rect = title.getBoundingClientRect();
      apply({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onLeave = () => apply(null);

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      for (const w of words) {
        w.tx = w.ty = 0;
        clear(w);
      }
    };

    let active = false;
    const sync = () => {
      const shouldRun = pointerMq.matches && !reducedMq.matches;
      if (shouldRun === active) return;
      active = shouldRun;
      if (active) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        title.addEventListener("transitionend", onTransitionEnd);
      } else {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        title.removeEventListener("transitionend", onTransitionEnd);
        reset();
      }
    };

    sync();
    pointerMq.addEventListener("change", sync);
    reducedMq.addEventListener("change", sync);
    return () => {
      pointerMq.removeEventListener("change", sync);
      reducedMq.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      title.removeEventListener("transitionend", onTransitionEnd);
      reset();
    };
  }, [heroRef]);
}
