"use client";

import { useEffect, useRef } from "react";
import { useScrollActive } from "../lib/useScrollActive";
import {
  isClickableCursorTarget,
  isFinePointerDevice,
  prefersReducedMotion,
  triggerAsteriskSpin,
} from "../lib/cursorUtils";

const TAIL_CHARS =
  ".,:;+-=~^_`'\"\\/|()[]{}<>!?$#@%&0123456789abcdefghijklmnopqrstuvwxyz";

const CUSTOM_HOVER_SELECTOR =
  ".cursor-hover-light, .cursor-hover-dark, .cursor-hover-eye-dark";

const FOOTER_SELECTOR = ".flip-board-footer";

const TRAIL_CLASS = "ascii-cursor__trail-char";

function pickChar(rand: () => number) {
  const i = Math.floor(rand() * TAIL_CHARS.length);
  return TAIL_CHARS[i] ?? ".";
}

export function AsciiCursorTrail() {
  const layerRef = useRef<HTMLDivElement>(null);
  const headWrapRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const trailElsRef = useRef<HTMLSpanElement[]>([]);
  const trailIndexRef = useRef(0);
  const lastSpawnRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastTargetRef = useRef<EventTarget | null>(null);
  const hoveringCustomCursorRef = useRef(false);
  const hoveringFooterRef = useRef(false);
  const wasClickableRef = useRef(false);
  const lightboxOpenRef = useRef(false);
  const pendingPosRef = useRef<{ x: number; y: number } | null>(null);
  const moveRafRef = useRef<number | null>(null);
  const scrollingRef = useScrollActive();

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const syncLightbox = () => {
      lightboxOpenRef.current = document.body.classList.contains(
        "home-v2-lightbox-open",
      );
      layer.style.display = lightboxOpenRef.current ? "none" : "";
    };

    syncLightbox();
    const observer = new MutationObserver(syncLightbox);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointerDevice()) return;

    const layer = layerRef.current;
    const headWrap = headWrapRef.current;
    const head = headRef.current;
    if (!layer || !headWrap || !head) return;

    let seed = (Date.now() % 2147483647) + 1;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const maxItems = 14;
    const minDistPx = 12;
    const minIntervalMs = 24;

    // Pre-create the trail elements once and recycle them (no DOM allocations during pointer moves).
    if (trailElsRef.current.length === 0) {
      const els: HTMLSpanElement[] = [];
      for (let i = 0; i < maxItems; i += 1) {
        const el = document.createElement("span");
        el.className = TRAIL_CLASS;
        el.style.opacity = "0";
        el.style.animation = "none";
        el.addEventListener("animationend", () => {
          el.style.opacity = "0";
          el.style.animation = "none";
        });
        layer.appendChild(el);
        els.push(el);
      }
      trailElsRef.current = els;
    }

    const clearTrail = () => {
      for (const el of trailElsRef.current) {
        el.style.opacity = "0";
        el.style.animation = "none";
      }
    };

    const flushHeadPosition = () => {
      moveRafRef.current = null;
      const pos = pendingPosRef.current;
      if (!pos || lightboxOpenRef.current) return;
      headWrap.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -55%)`;
    };

    const scheduleHeadPosition = (x: number, y: number) => {
      pendingPosRef.current = { x, y };
      if (moveRafRef.current !== null) return;
      moveRafRef.current = window.requestAnimationFrame(flushHeadPosition);
    };

    const isPointerOverFooter = (x: number, y: number, target: EventTarget | null) => {
      if (target instanceof Element && target.closest(FOOTER_SELECTOR)) {
        return true;
      }
      // Hit-test topmost element only — avoids white asterisk when snippets (or
      // other sheet content) visually overlap the fixed footer underneath.
      const hit = document.elementFromPoint(x, y);
      return hit instanceof Element && Boolean(hit.closest(FOOTER_SELECTOR));
    };

    const syncFooterAtTarget = (
      x: number,
      y: number,
      target: EventTarget | null,
    ) => {
      const overFooter = isPointerOverFooter(x, y, target);
      if (overFooter === hoveringFooterRef.current) return;
      hoveringFooterRef.current = overFooter;
      head.classList.toggle("ascii-cursor__head--on-footer", overFooter);
    };

    const syncHoverState = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;

      const customHover = Boolean(el?.closest(CUSTOM_HOVER_SELECTOR));
      if (customHover !== hoveringCustomCursorRef.current) {
        hoveringCustomCursorRef.current = customHover;
      }

      if (target !== lastTargetRef.current) {
        lastTargetRef.current = target;

        const clickable =
          !hoveringCustomCursorRef.current &&
          !hoveringFooterRef.current &&
          isClickableCursorTarget(target);
        if (clickable && !wasClickableRef.current) {
          triggerAsteriskSpin(head);
        } else if (!clickable) {
          head.classList.remove("asterisk-cursor__head--spinning");
        }
        wasClickableRef.current = clickable;
      }
    };

    const spawnTrail = (x: number, y: number) => {
      const pool = trailElsRef.current;
      if (pool.length === 0) return;

      const idx = trailIndexRef.current;
      trailIndexRef.current = (idx + 1) % pool.length;
      const el = pool[idx]!;
      el.textContent = pickChar(rand);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.animation = "none";
      el.style.opacity = "";
      // Restart the CSS animation with a minimal reflow.
      void el.getBoundingClientRect();
      el.style.animation = "";
    };

    const onAnimationEnd = () => {
      head.classList.remove("asterisk-cursor__head--spinning");
    };

    head.addEventListener("animationend", onAnimationEnd);

    const onMove = (e: PointerEvent) => {
      if (lightboxOpenRef.current) return;

      const x = e.clientX;
      const y = e.clientY;
      scheduleHeadPosition(x, y);

      if (scrollingRef.current) return;

      syncFooterAtTarget(x, y, e.target);
      syncHoverState(e.target);

      if (hoveringCustomCursorRef.current || hoveringFooterRef.current) {
        clearTrail();
        lastSpawnRef.current = { x, y, t: performance.now() };
        return;
      }

      const now = performance.now();
      const last = lastSpawnRef.current;
      const dx = last ? x - last.x : Infinity;
      const dy = last ? y - last.y : Infinity;
      const dist = Math.hypot(dx, dy);
      const dt = last ? now - last.t : Infinity;

      if (dist < minDistPx || dt < minIntervalMs) return;
      lastSpawnRef.current = { x, y, t: now };
      spawnTrail(x, y);
    };

    const onLeave = () => {
      wasClickableRef.current = false;
      lastTargetRef.current = null;
      hoveringFooterRef.current = false;
      head.classList.remove(
        "asterisk-cursor__head--spinning",
        "ascii-cursor__head--on-footer",
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      head.removeEventListener("animationend", onAnimationEnd);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (moveRafRef.current !== null) window.cancelAnimationFrame(moveRafRef.current);
      clearTrail();
    };
  }, [scrollingRef]);

  return (
    <div ref={layerRef} className="ascii-cursor-layer" aria-hidden>
      <div ref={headWrapRef} className="ascii-cursor__head-wrap">
        <span ref={headRef} className="ascii-cursor__head">
          *
        </span>
      </div>
    </div>
  );
}
