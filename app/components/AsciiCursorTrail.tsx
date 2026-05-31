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

const TRAIL_CLASS = "ascii-cursor__trail-char";

function pickChar(rand: () => number) {
  const i = Math.floor(rand() * TAIL_CHARS.length);
  return TAIL_CHARS[i] ?? ".";
}

export function AsciiCursorTrail() {
  const layerRef = useRef<HTMLDivElement>(null);
  const headWrapRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const trailPoolRef = useRef<HTMLSpanElement[]>([]);
  const activeTrailCountRef = useRef(0);
  const lastSpawnRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastTargetRef = useRef<EventTarget | null>(null);
  const hoveringCustomCursorRef = useRef(false);
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

    const acquireTrailEl = () => trailPoolRef.current.pop() ?? document.createElement("span");

    const releaseTrailEl = (el: HTMLSpanElement) => {
      el.remove();
      trailPoolRef.current.push(el);
    };

    const clearTrail = () => {
      for (const child of Array.from(layer.children)) {
        if (child instanceof HTMLSpanElement && child.classList.contains(TRAIL_CLASS)) {
          releaseTrailEl(child);
        }
      }
      activeTrailCountRef.current = 0;
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

    const syncHoverState = (target: EventTarget | null) => {
      if (target === lastTargetRef.current) return;
      lastTargetRef.current = target;

      hoveringCustomCursorRef.current = Boolean(
        target instanceof Element && target.closest(CUSTOM_HOVER_SELECTOR),
      );

      const clickable =
        !hoveringCustomCursorRef.current && isClickableCursorTarget(target);
      if (clickable && !wasClickableRef.current) {
        triggerAsteriskSpin(head);
      } else if (!clickable) {
        head.classList.remove("asterisk-cursor__head--spinning");
      }
      wasClickableRef.current = clickable;
    };

    const spawnTrail = (x: number, y: number) => {
      if (activeTrailCountRef.current >= maxItems) {
        const oldest = layer.querySelector(`.${TRAIL_CLASS}`);
        if (oldest instanceof HTMLSpanElement) {
          releaseTrailEl(oldest);
          activeTrailCountRef.current -= 1;
        }
      }

      const el = acquireTrailEl();
      el.className = TRAIL_CLASS;
      el.textContent = pickChar(rand);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.animation = "none";
      layer.appendChild(el);
      void el.offsetWidth;
      el.style.animation = "";
      activeTrailCountRef.current += 1;

      el.addEventListener(
        "animationend",
        () => {
          releaseTrailEl(el);
          activeTrailCountRef.current = Math.max(0, activeTrailCountRef.current - 1);
        },
        { once: true },
      );
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

      syncHoverState(e.target);

      if (hoveringCustomCursorRef.current) {
        if (activeTrailCountRef.current > 0) clearTrail();
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
      head.classList.remove("asterisk-cursor__head--spinning");
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
