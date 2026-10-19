"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroLicenseCard.module.css";

/** Max tilt toward the cursor, in degrees. Kept small so the card never feels unsteady. */
const TILT_MAX = 6;
/** How quickly the tilt catches up with the cursor each frame (0–1). */
const TILT_EASE = 0.12;
/** Horizontal drag distance, in px, that counts as a flip on touch. */
const DRAG_FLIP_PX = 40;

const FRONT_ALT =
  "Creative license card for Priyamwada Pandey, Product Designer, license number ARPR115D, issued September 2021, valid until curiosity expires.";
const BACK_ALT =
  "Back of the creative license: notes on what this designer is known for, and that she's open for full time roles and contract work.";

/**
 * Priyamwada's creative license, front and centre in the hero. It tilts a few
 * degrees toward the cursor and flips to its back on click, tap, drag, Enter
 * or Space. No auto-spin. Reduced motion: no tilt, and the flip is a crossfade.
 */
export function HeroLicenseCard() {
  const [flipped, setFlipped] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; flipped: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const el = tiltRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !fine || reduced) return;

    let target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf: number | null = null;

    const tick = () => {
      current.x += (target.x - current.x) * TILT_EASE;
      current.y += (target.y - current.y) * TILT_EASE;
      el.style.transform = `rotateX(${current.x.toFixed(2)}deg) rotateY(${current.y.toFixed(2)}deg)`;
      const settled = Math.abs(target.x - current.x) < 0.01 && Math.abs(target.y - current.y) < 0.01;
      raf = settled ? null : requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Normalised cursor position around the card centre, clamped so a far cursor doesn't over-tilt.
      const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      target = { x: -dy * TILT_MAX, y: dx * TILT_MAX };
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
    const drag = dragRef.current;
    if (!drag || drag.flipped) return;
    if (Math.abs(e.clientX - drag.x) > DRAG_FLIP_PX) {
      drag.flipped = true;
      suppressClickRef.current = true;
      setFlipped((f) => !f);
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
    setFlipped((f) => !f);
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
      aria-label={flipped ? "Creative license, back. Press to see the front." : "Creative license, front. Press to see the back."}
    >
      <div className={styles.tilt} ref={tiltRef}>
        <div className={styles.flip} data-flipped={flipped || undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/26june-homepage-assets/Creative License Front.png"
            alt={FRONT_ALT}
            aria-hidden={flipped || undefined}
            className={`${styles.face} ${styles.front}`}
            draggable={false}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/26june-homepage-assets/Creative License Back.png"
            alt={BACK_ALT}
            aria-hidden={!flipped || undefined}
            className={`${styles.face} ${styles.back}`}
            draggable={false}
          />
        </div>
      </div>
    </button>
  );
}
