"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const AUTO_SPEED    = 0.22;
const MOUSE_Y_RANGE = 100;
const MOUSE_X_RANGE = 12;
const EXIT_DURATION = 280;
const DRAG_Y_FULL_DEG = 320; // rotateY covered by a full-viewport-width drag
const DRAG_X_FULL_DEG = 60;  // rotateX covered by a full-viewport-height drag
const DRAG_X_MAX      = 40;  // clamp so the card never tips past edge-on

export function CreativeLicenseLightbox({ onClose }: { onClose: () => void }) {
  const rotatorRef = useRef<HTMLDivElement>(null);
  const autoYRef   = useRef(0);
  const mouseYRef  = useRef(0);
  const mouseXRef  = useRef(0);
  const rafRef     = useRef<number | null>(null);
  const pausedRef  = useRef(false);
  const closingRef = useRef(false);

  // Touch drag: rotation follows the finger 1:1 instead of snapping to an
  // absolute screen-position offset, so a full drag can reach the back face.
  const isDraggingRef   = useRef(false);
  const dragStartXRef   = useRef(0);
  const dragStartYRef   = useRef(0);
  const dragBaseYRotRef = useRef(0);
  const dragBaseXRotRef = useRef(0);
  const touchYRef       = useRef(0);
  const touchXRef       = useRef(0);

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    setTimeout(onClose, EXIT_DURATION);
  };

  useEffect(() => {
    document.body.classList.add("home-v2-lightbox-open");
    return () => document.body.classList.remove("home-v2-lightbox-open");
  }, []);

  useEffect(() => {
    const el = rotatorRef.current;
    if (!el) return;
    const tick = () => {
      if (isDraggingRef.current) {
        el.style.transform = `rotateX(${touchXRef.current}deg) rotateY(${touchYRef.current}deg)`;
      } else {
        if (!pausedRef.current) autoYRef.current += AUTO_SPEED;
        const rotY = autoYRef.current + mouseYRef.current;
        el.style.transform = `rotateX(${mouseXRef.current}deg) rotateY(${rotY}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouseYRef.current =  dx * MOUSE_Y_RANGE;
      mouseXRef.current = -dy * MOUSE_X_RANGE;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    pausedRef.current = true;
    isDraggingRef.current = true;
    dragStartXRef.current = touch.clientX;
    dragStartYRef.current = touch.clientY;
    // Pick up rotation exactly where the auto-spin/mouse offset left it, so there's no jump.
    dragBaseYRotRef.current = autoYRef.current + mouseYRef.current;
    dragBaseXRotRef.current = mouseXRef.current;
    touchYRef.current = dragBaseYRotRef.current;
    touchXRef.current = dragBaseXRotRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const dx = touch.clientX - dragStartXRef.current;
    const dy = touch.clientY - dragStartYRef.current;
    touchYRef.current = dragBaseYRotRef.current + (dx / window.innerWidth) * DRAG_Y_FULL_DEG;
    const rawX = dragBaseXRotRef.current - (dy / window.innerHeight) * DRAG_X_FULL_DEG;
    touchXRef.current = Math.max(-DRAG_X_MAX, Math.min(DRAG_X_MAX, rawX));
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    pausedRef.current = false;
    // Hand rotation back to the auto-spin/mouse baseline so it continues from here, not from before the drag.
    autoYRef.current = touchYRef.current;
    mouseYRef.current = 0;
    mouseXRef.current = touchXRef.current;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      className={`cl-lightbox-overlay${isClosing ? " cl-lightbox-overlay--closing" : ""}`}
      onClick={handleClose}
      role="dialog"
      aria-modal
      aria-label="Creative License"
    >
      <div
        className={`cl-lightbox-entry${isClosing ? " cl-lightbox-entry--closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div style={{ perspective: "1200px" }}>
          <div ref={rotatorRef} className="cl-lightbox-rotator">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/26june-homepage-assets/Creative License Front.png"
              alt="Creative License — front"
              className="cl-lightbox-face cl-lightbox-face--front"
              draggable={false}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/26june-homepage-assets/Creative License Back.png"
              alt="Creative License — back"
              className="cl-lightbox-face cl-lightbox-face--back"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
