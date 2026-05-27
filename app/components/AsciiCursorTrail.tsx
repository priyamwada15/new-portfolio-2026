"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TrailItem = {
  id: number;
  x: number;
  y: number;
  ch: string;
  bornAt: number;
};

const TAIL_CHARS = ".,:;+-=~^_`'\"\\/|()[]{}<>!?$#@%&0123456789abcdefghijklmnopqrstuvwxyz";

function pickChar(rand: () => number) {
  const i = Math.floor(rand() * TAIL_CHARS.length);
  return TAIL_CHARS[i] ?? ".";
}

export function AsciiCursorTrail() {
  const [items, setItems] = useState<TrailItem[]>([]);
  const [head, setHead] = useState<{ x: number; y: number } | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hoveringCustomCursorRef = useRef(false);
  const idRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const rand = useMemo(() => {
    // Deterministic-ish per session; avoids pulling in crypto.
    let seed = (Date.now() % 2147483647) + 1;
    return () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }, []);

  useEffect(() => {
    const syncLightbox = () => {
      setLightboxOpen(document.body.classList.contains("home-v2-lightbox-open"));
    };
    syncLightbox();
    const observer = new MutationObserver(syncLightbox);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    const maxItems = 18;
    const ttlMs = 650;
    const minDistPx = 10;
    const minIntervalMs = 18;

    const tick = () => {
      const now = performance.now();
      setItems((prev) => prev.filter((it) => now - it.bornAt < ttlMs));
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      // Hide trail while hovering custom SVG cursor cards.
      const target = e.target as Element | null;
      hoveringCustomCursorRef.current = Boolean(
        target?.closest?.(".cursor-hover-light, .cursor-hover-dark, .cursor-hover-eye-dark"),
      );

      const x = e.clientX;
      const y = e.clientY;
      setHead({ x, y });

      if (hoveringCustomCursorRef.current) {
        setItems([]);
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

      const id = ++idRef.current;
      const ch = pickChar(rand);
      setItems((prev) => {
        const next = [...prev, { id, x, y, ch, bornAt: now }];
        return next.length > maxItems ? next.slice(next.length - maxItems) : next;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [rand]);

  if (!head || lightboxOpen) return null;

  // Tail fades out towards the end: older items get lower opacity.
  const now = performance.now();

  return (
    <div className="ascii-cursor-layer" aria-hidden>
      {items.map((it, idx) => {
        const age = now - it.bornAt;
        const t = Math.min(1, Math.max(0, age / 650));
        const opacity = 0.65 * (1 - t);
        const scale = 1 - t * 0.35;
        return (
          <span
            key={it.id}
            style={{
              position: "fixed",
              left: it.x,
              top: it.y,
              transform: `translate(-50%, -55%) scale(${scale})`,
              opacity,
              fontFamily: "var(--font-dm-mono), ui-monospace, monospace",
              fontSize: "14px",
              lineHeight: 1,
              color: "#333333",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 9999,
              filter: idx < items.length - 8 ? "blur(0.2px)" : "none",
            }}
          >
            {it.ch}
          </span>
        );
      })}

      <span
        style={{
          position: "fixed",
          left: head.x,
          top: head.y,
          transform: "translate(-50%, -55%)",
          fontFamily: "var(--font-dm-mono), ui-monospace, monospace",
          fontSize: "22px",
          lineHeight: 1,
          color: "#111111",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 10000,
        }}
      >
        *
      </span>
    </div>
  );
}

