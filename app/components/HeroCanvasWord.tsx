"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Scaled from 17.23px / 80px design spec to 32px type. */
const DEFAULT_WIDTH = 149;
const MIN_WIDTH = 89;
const MAX_WIDTH = 409;
const HEIGHT = 61;

type GripSide = "left" | "right";

type HeroCanvasWordProps = {
  className?: string;
};

export function HeroCanvasWord({ className }: HeroCanvasWordProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    side: GripSide;
    startX: number;
    startWidth: number;
    pointerId: number;
  } | null>(null);

  const scaleX = width / DEFAULT_WIDTH;

  const clampWidth = useCallback((next: number) => {
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next));
  }, []);

  const startDrag = useCallback(
    (side: GripSide) => (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        side,
        startX: event.clientX,
        startWidth: width,
        pointerId: event.pointerId,
      };
      setIsDragging(true);
    },
    [width],
  );

  const releaseDrag = useCallback((pointerId?: number) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (pointerId !== undefined && drag.pointerId !== pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
    setWidth(DEFAULT_WIDTH);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      const dx = event.clientX - drag.startX;
      const delta = drag.side === "right" ? dx : -dx;
      setWidth(clampWidth(drag.startWidth + delta));
    },
    [clampWidth],
  );

  const endDrag = useCallback(
    (event: React.PointerEvent) => {
      releaseDrag(event.pointerId);
    },
    [releaseDrag],
  );

  useEffect(() => {
    const onWindowPointerUp = () => {
      releaseDrag();
    };
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);
    return () => {
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };
  }, [releaseDrag]);

  return (
    <span
      className={cn(
        "hero-canvas-chip",
        isDragging && "hero-canvas-chip--dragging",
        className,
      )}
      style={{ width, height: HEIGHT }}
      aria-label="canvas, horizontally resizable"
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <span className="hero-canvas-chip__frame">
        <span
          className="hero-canvas-chip__label"
          style={{ transform: `scaleX(${scaleX})` }}
          aria-hidden
        >
          canvas
        </span>
        <button
          type="button"
          className="hero-canvas-chip__edge hero-canvas-chip__edge--left"
          aria-label="Resize canvas label from the left edge"
          onPointerDown={startDrag("left")}
        />
        <button
          type="button"
          className="hero-canvas-chip__edge hero-canvas-chip__edge--right"
          aria-label="Resize canvas label from the right edge"
          onPointerDown={startDrag("right")}
        />
      </span>

      <button
        type="button"
        className="hero-canvas-chip__grip hero-canvas-chip__grip--tl"
        aria-label="Resize canvas label from the left"
        onPointerDown={startDrag("left")}
      />
      <button
        type="button"
        className="hero-canvas-chip__grip hero-canvas-chip__grip--tr"
        aria-label="Resize canvas label from the right"
        onPointerDown={startDrag("right")}
      />
      <button
        type="button"
        className="hero-canvas-chip__grip hero-canvas-chip__grip--bl"
        aria-label="Resize canvas label from the left"
        onPointerDown={startDrag("left")}
      />
      <button
        type="button"
        className="hero-canvas-chip__grip hero-canvas-chip__grip--br"
        aria-label="Resize canvas label from the right"
        onPointerDown={startDrag("right")}
      />
    </span>
  );
}
