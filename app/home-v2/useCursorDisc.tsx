"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CursorDisc.module.css";

/** The disc sits this far down-right of the pointer, so the pointer stays visible. */
const CURSOR_OFFSET = 18;
/** How quickly the disc catches up with the pointer each frame (0–1). */
const CURSOR_EASE = 0.28;

/**
 * Rose disc that follows the mouse beside the pointer, with a short label
 * ("flip", "read"). Call `show` on pointer enter, `move` on pointer move and
 * `hide` on leave; render `disc` anywhere (it portals to the body).
 */
export function useCursorDisc(label: string) {
  const [on, setOn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(id);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  const step = () => {
    const el = ref.current;
    const p = pos.current;
    if (!el || !p) {
      raf.current = null;
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = target.current;
    const ease = reduced ? 1 : CURSOR_EASE;
    p.x += (t.x - p.x) * ease;
    p.y += (t.y - p.y) * ease;
    el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
    const settled = Math.abs(t.x - p.x) < 0.2 && Math.abs(t.y - p.y) < 0.2;
    raf.current = settled ? null : requestAnimationFrame(step);
  };

  const move = (e: { clientX: number; clientY: number; pointerType?: string }) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    target.current = { x: e.clientX + CURSOR_OFFSET, y: e.clientY + CURSOR_OFFSET };
    if (!pos.current) pos.current = { ...target.current };
    if (raf.current === null) raf.current = requestAnimationFrame(step);
  };

  const show = (e: { clientX: number; clientY: number; pointerType?: string }) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    pos.current = null;
    move(e);
    setOn(true);
  };

  const hide = () => setOn(false);

  const disc = mounted
    ? createPortal(
        <div ref={ref} className={styles.cursor} data-on={on || undefined} aria-hidden="true">
          <span>{label}</span>
        </div>,
        document.body,
      )
    : null;

  return { show, move, hide, disc };
}
