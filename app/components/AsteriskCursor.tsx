"use client";

import { useEffect, useRef } from "react";
import {
  isClickableCursorTarget,
  isFinePointerDevice,
  prefersReducedMotion,
  triggerAsteriskSpin,
} from "../lib/cursorUtils";

export function AsteriskCursor() {
  const headWrapRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const wasClickableRef = useRef(false);
  const lastTargetRef = useRef<EventTarget | null>(null);
  const pendingPosRef = useRef<{ x: number; y: number } | null>(null);
  const moveRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointerDevice()) return;

    const headWrap = headWrapRef.current;
    const head = headRef.current;
    if (!headWrap || !head) return;

    const flushHeadPosition = () => {
      moveRafRef.current = null;
      const pos = pendingPosRef.current;
      if (!pos) return;
      headWrap.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -55%)`;
    };

    const scheduleHeadPosition = (x: number, y: number) => {
      pendingPosRef.current = { x, y };
      if (moveRafRef.current !== null) return;
      moveRafRef.current = window.requestAnimationFrame(flushHeadPosition);
    };

    const onAnimationEnd = () => {
      head.classList.remove("asterisk-cursor__head--spinning");
    };

    head.addEventListener("animationend", onAnimationEnd);

    const onMove = (e: PointerEvent) => {
      scheduleHeadPosition(e.clientX, e.clientY);

      if (e.target === lastTargetRef.current) return;
      lastTargetRef.current = e.target;

      const clickable = isClickableCursorTarget(e.target);
      if (clickable && !wasClickableRef.current) {
        triggerAsteriskSpin(head);
      } else if (!clickable) {
        head.classList.remove("asterisk-cursor__head--spinning");
      }
      wasClickableRef.current = clickable;
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
    };
  }, []);

  return (
    <div className="asterisk-cursor-layer" aria-hidden>
      <div ref={headWrapRef} className="asterisk-cursor__head-wrap">
        <span ref={headRef} className="asterisk-cursor__head">
          *
        </span>
      </div>
    </div>
  );
}
