"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./HeroLicenseCard.module.css";

/**
 * Cursor follow, in the spirit of the creative license lightbox. Side-to-side
 * tilt stays under 90° (where the card would turn edge-on and show its back)
 * so it never fights the click-to-flip.
 */
const TILT_Y_MAX = 35;
const TILT_X_MAX = 12;
/** How far the card drifts toward the cursor, in px. */
const DRIFT_X_MAX = 18;
const DRIFT_Y_MAX = 10;
/** How quickly the card catches up with the cursor each frame (0–1). */
const FOLLOW_EASE = 0.1;
/** Horizontal drag distance, in px, that counts as a flip on touch. */
const DRAG_FLIP_PX = 40;
/** The "flip" cursor sits this far down-right of the pointer, so the pointer stays visible. */
const CURSOR_OFFSET = 18;
/** How quickly the "flip" cursor catches up with the pointer each frame (0–1). */
const CURSOR_EASE = 0.28;

const FRONT_ALT =
  "Creative license card for Priyamwada Pandey, Product Designer, license number ARPR115D, issued September 2021, renewed by curiosity, authorized to make it weirder.";
const BACK_ALT =
  "Back of the creative license. Open for full time roles and contract work. Known to research the Indian maximalist graphic movement obsessively, sketch floor plans when she misses her architecture roots, and daydream about a prototype studio with all the sensors. 3+ years of experience, 2 countries worked, 13+ products shipped.";

/**
 * Priyamwada's creative license, front and centre in the hero. It turns and
 * drifts toward the cursor and flips to its back on click, tap, drag, Enter
 * or Space. At rest it floats gently in place. No auto-spin. Reduced motion:
 * no float or follow, and the flip is a crossfade.
 */
export function HeroLicenseCard() {
  const [flipped, setFlipped] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; flipped: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  // "flip" cursor (mouse) and "tap to flip" hint (touch, until the first flip)
  const [cursorOn, setCursorOn] = useState(false);
  const [touch, setTouch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [everFlipped, setEverFlipped] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTarget = useRef({ x: 0, y: 0 });
  const cursorPos = useRef<{ x: number; y: number } | null>(null);
  const cursorRaf = useRef<number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTouch(window.matchMedia("(hover: none)").matches);
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const moveCursor = () => {
    const el = cursorRef.current;
    const pos = cursorPos.current;
    if (!el || !pos) {
      cursorRaf.current = null;
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = cursorTarget.current;
    const ease = reduced ? 1 : CURSOR_EASE;
    pos.x += (t.x - pos.x) * ease;
    pos.y += (t.y - pos.y) * ease;
    el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
    const settled = Math.abs(t.x - pos.x) < 0.2 && Math.abs(t.y - pos.y) < 0.2;
    cursorRaf.current = settled ? null : requestAnimationFrame(moveCursor);
  };
  const trackCursor = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cursorTarget.current = { x: e.clientX + CURSOR_OFFSET, y: e.clientY + CURSOR_OFFSET };
    if (!cursorPos.current) cursorPos.current = { ...cursorTarget.current };
    if (cursorRaf.current === null) cursorRaf.current = requestAnimationFrame(moveCursor);
  };
  useEffect(() => () => {
    if (cursorRaf.current !== null) cancelAnimationFrame(cursorRaf.current);
  }, []);
  const flip = () => {
    setFlipped((f) => !f);
    setEverFlipped(true);
  };

  useEffect(() => {
    const el = tiltRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !fine || reduced) return;

    // Measured on the untransformed button, so the drift and float don't feed back into it.
    const anchor = el.closest("button") ?? el;
    // dx/dy: cursor position around the card centre, -1 to 1.
    let target = { dx: 0, dy: 0 };
    const current = { dx: 0, dy: 0 };
    let raf: number | null = null;

    const tick = () => {
      current.dx += (target.dx - current.dx) * FOLLOW_EASE;
      current.dy += (target.dy - current.dy) * FOLLOW_EASE;
      const { dx, dy } = current;
      el.style.transform =
        `translate3d(${(dx * DRIFT_X_MAX).toFixed(2)}px, ${(dy * DRIFT_Y_MAX).toFixed(2)}px, 0) ` +
        `rotateX(${(-dy * TILT_X_MAX).toFixed(2)}deg) rotateY(${(dx * TILT_Y_MAX).toFixed(2)}deg)`;
      const settled = Math.abs(target.dx - dx) < 0.001 && Math.abs(target.dy - dy) < 0.001;
      raf = settled ? null : requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = anchor.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      target = {
        dx: clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)),
        dy: clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)),
      };
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    dragRef.current = { x: e.clientX, flipped: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    trackCursor(e);
    const drag = dragRef.current;
    if (!drag || drag.flipped) return;
    if (Math.abs(e.clientX - drag.x) > DRAG_FLIP_PX) {
      drag.flipped = true;
      suppressClickRef.current = true;
      flip();
    }
  };
  const onPointerEnd = () => {
    dragRef.current = null;
  };
  const onClick = () => {
    // A drag already flipped the card; ignore the click the browser sends after it.
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    flip();
  };

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        cursorPos.current = null;
        trackCursor(e);
        setCursorOn(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setCursorOn(false);
      }}
      aria-label={flipped ? "Creative license, back. Press to see the front." : "Creative license, front. Press to see the back."}
    >
      <div className={styles.float}>
        <div className={styles.tilt} ref={tiltRef}>
          <div className={styles.flip} data-flipped={flipped || undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/26june-homepage-assets/creative-license-front.avif"
              alt={FRONT_ALT}
              aria-hidden={flipped || undefined}
              className={`${styles.face} ${styles.front}`}
              draggable={false}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/26june-homepage-assets/creative-license-back.avif"
              alt={BACK_ALT}
              aria-hidden={!flipped || undefined}
              className={`${styles.face} ${styles.back}`}
              draggable={false}
            />
          </div>
        </div>
      </div>
      {touch && (
        <span className={styles.hint} data-hidden={everFlipped || undefined} aria-hidden="true">
          tap to flip
        </span>
      )}
      {mounted &&
        createPortal(
          <div ref={cursorRef} className={styles.cursor} data-on={cursorOn || undefined} aria-hidden="true">
            <span>{flipped ? "flip back" : "flip"}</span>
          </div>,
          document.body,
        )}
    </button>
  );
}
