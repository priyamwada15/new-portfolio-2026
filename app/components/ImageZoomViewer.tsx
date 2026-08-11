"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, type PointerEvent, useState } from "react";
import { fontStyle } from "@/design-system";

/** Fixed zoom level for zoomable images — panning is the only way to see the rest. */
const ZOOMED_SCALE = 4;

/** Matches the slide transition used by the Salesforce case study's BeforeAfterCarousel. */
const SLIDE_EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 48 : -48, scale: 0.94, opacity: 0 }),
  center: { x: 0, scale: 1, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -48 : 48, scale: 0.94, opacity: 0 }),
};

export type ZoomImage = {
  src: string;
  alt: string;
  caption: string;
  /** Enables pan + the "pan around" instruction, for content-dense images like flows. */
  zoomable?: boolean;
  /** Overrides ZOOMED_SCALE for this image. */
  zoomLevel?: number;
};

type ImageZoomViewerProps = {
  images: ZoomImage[];
  index: number;
  onIndexChange: (index: number) => void;
};

export function ImageZoomViewer({ images, index, onIndexChange }: ImageZoomViewerProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(1);

  const imageAreaRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
  } | null>(null);

  const image = images[index];
  const zoom = image?.zoomable ? (image.zoomLevel ?? ZOOMED_SCALE) : 1;

  const clampPan = useCallback(
    (next: { x: number; y: number }) => {
      const area = imageAreaRef.current;
      if (!area) return next;
      // Image scales from its top-left corner (transform-origin), so the overflow
      // only extends right/down — pan can only move it left/up to reveal it, never past (0, 0).
      const maxOffsetX = area.clientWidth * (zoom - 1);
      const maxOffsetY = area.clientHeight * (zoom - 1);
      return {
        x: Math.min(0, Math.max(-maxOffsetX, next.x)),
        y: Math.min(0, Math.max(-maxOffsetY, next.y)),
      };
    },
    [zoom],
  );

  // object-contain letterboxes the image within its box when aspect ratios differ.
  // Since the scale transform pivots on the box's top-left corner, the default pan
  // must skip past that letterbox gap so the view opens on the image content itself.
  const applyDefaultPan = useCallback(() => {
    if (!image?.zoomable) {
      setPan({ x: 0, y: 0 });
      return;
    }
    const area = imageAreaRef.current;
    const el = imgRef.current;
    if (!area || !el || !el.naturalWidth || !el.naturalHeight) {
      setPan({ x: 0, y: 0 });
      return;
    }
    const boxAspect = area.clientWidth / area.clientHeight;
    const naturalAspect = el.naturalWidth / el.naturalHeight;
    const letterboxX =
      naturalAspect < boxAspect ? (area.clientWidth - area.clientHeight * naturalAspect) / 2 : 0;
    const letterboxY =
      naturalAspect > boxAspect ? (area.clientHeight - area.clientWidth / naturalAspect) / 2 : 0;
    setPan(clampPan({ x: -letterboxX * zoom, y: -letterboxY * zoom }));
  }, [image?.zoomable, zoom, clampPan]);

  useEffect(() => {
    applyDefaultPan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!image?.zoomable) return;
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture can fail (e.g. no active pointer session) — dragging still works without it.
      }
      dragStateRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      };
      setIsDragging(true);
    },
    [image?.zoomable, pan],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      setPan(
        clampPan({
          x: drag.startPanX + (e.clientX - drag.startX),
          y: drag.startPanY + (e.clientY - drag.startY),
        }),
      );
    },
    [clampPan],
  );

  const endDrag = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId !== e.pointerId) return;
    dragStateRef.current = null;
    setIsDragging(false);
  }, []);

  const goTo = useCallback(
    (delta: number) => {
      setDirection(delta);
      onIndexChange((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  if (!image) return null;

  const cursorClass = !image.zoomable ? "" : isDragging ? "cursor-grabbing" : "cursor-grab";

  return (
    <div className="group flex aspect-[768/440] w-full flex-col overflow-hidden rounded-[24px] bg-[#F5F5F5]">
      <div
        ref={imageAreaRef}
        className="relative flex-1 overflow-hidden rounded-[24px] bg-surface-home"
      >
        <div
          className={`absolute inset-0 ${cursorClass}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: SLIDE_EASE }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={image.src}
                alt={image.alt}
                draggable={false}
                onLoad={applyDefaultPan}
                className="h-full w-full select-none object-contain"
                style={{
                  transformOrigin: "top left",
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transition: isDragging ? "none" : "transform 0.15s ease-out",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {image.zoomable ? (
          <p
            className="pointer-events-none absolute left-6 top-6 -translate-y-2 rounded-[8px] border border-white/40 bg-white/30 px-3 py-1.5 text-[14px] leading-[17px] text-[#979797] opacity-0 shadow-[0px_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.52,-0.01,0,1)] group-hover:translate-y-0 group-hover:opacity-100"
            style={fontStyle.figtree}
          >
            Pan around to view to full flow
          </p>
        ) : null}

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Previous image"
              className="absolute left-6 top-1/2 flex h-8 w-8 -translate-x-3 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#F2F2F2] bg-[#FAFAFA] opacity-0 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.52,-0.01,0,1)] pointer-events-none group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto"
            >
              <CaretLeft size={16} weight="regular" className="text-secondary" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Next image"
              className="absolute right-6 top-1/2 flex h-8 w-8 translate-x-3 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#F2F2F2] bg-[#FAFAFA] opacity-0 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.52,-0.01,0,1)] pointer-events-none group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto"
            >
              <CaretRight size={16} weight="regular" className="text-secondary" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      <div className="flex h-[49px] shrink-0 items-center px-6 py-4">
        <p className="text-[14px] leading-[17px] text-secondary" style={fontStyle.figtree}>
          {image.caption}
        </p>
      </div>
    </div>
  );
}
