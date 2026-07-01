"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const AUTO_SPEED    = 0.22;
const MOUSE_Y_RANGE = 100;
const MOUSE_X_RANGE = 12;
const EXIT_DURATION = 280;

export function CreativeLicenseLightbox({ onClose }: { onClose: () => void }) {
  const rotatorRef = useRef<HTMLDivElement>(null);
  const autoYRef   = useRef(0);
  const mouseYRef  = useRef(0);
  const mouseXRef  = useRef(0);
  const rafRef     = useRef<number | null>(null);
  const pausedRef  = useRef(false);
  const closingRef = useRef(false);

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
      if (!pausedRef.current) autoYRef.current += AUTO_SPEED;
      const rotY = autoYRef.current + mouseYRef.current;
      el.style.transform = `rotateX(${mouseXRef.current}deg) rotateY(${rotY}deg)`;
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
