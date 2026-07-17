"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { fontStyle } from "@/design-system";

/** Reference width the Figma frame was designed at — image width/top are expressed as % of this. */
const CAROUSEL_CANVAS_WIDTH = 768;

export type ImageRedaction = {
  left: string;
  top?: string;
  bottom?: string;
  width: string;
  height: string;
  borderRadius?: string;
};

export type BeforeAfterImage = {
  src: string;
  alt: string;
  /** Natural design width/height in px (768px-frame reference) — scaled down responsively, never exceeding it. */
  width: number;
  height: number;
  /** Vertical offset from the top of the image group, in px on the 768px canvas. Omit (0) for single-image slides. */
  top?: number;
  redactions?: ImageRedaction[];
};

export type BeforeAfterSlide = {
  badgeLabel: string;
  badgeBg: string;
  badgeColor: string;
  /** Badge stroke: the spec's color-at-50%-opacity over a white base, pre-blended to a solid hex. */
  badgeBorder: string;
  title: string;
  images: BeforeAfterImage[];
  caption?: string;
};

const EASE_OUT = [0.23, 1, 0.32, 1] as [number, number, number, number];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    scale: 0.94,
    opacity: 0,
  }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    scale: 0.94,
    opacity: 0,
  }),
};

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous screen" : "Next screen"}
      className={`absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white ${
        direction === "left" ? "left-3" : "right-3"
      }`}
    >
      <svg
        width="8"
        height="14"
        viewBox="0 0 8 14"
        fill="none"
        aria-hidden="true"
        style={direction === "left" ? { transform: "rotate(180deg)" } : undefined}
      >
        <path
          d="M1 1L7 7L1 13"
          stroke="#555555"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function ImageGroup({ images }: { images: BeforeAfterImage[] }) {
  if (images.length === 1) {
    const image = images[0];
    return (
      <div
        className="relative mx-auto w-full overflow-hidden rounded-lg border border-border shadow-[0px_0px_28px_4px_rgba(0,0,0,0.04)]"
        style={{ width: `min(${image.width}px, 100%)`, aspectRatio: `${image.width} / ${image.height}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
        {image.redactions?.map((r) => (
          <div
            key={`${r.left}-${r.top ?? r.bottom}`}
            className="absolute bg-white/20 backdrop-blur-[7.5px]"
            style={{
              left: r.left,
              top: r.top,
              bottom: r.bottom,
              width: r.width,
              height: r.height,
              borderRadius: r.borderRadius,
            }}
          />
        ))}
      </div>
    );
  }

  // Multiple overlapping images (e.g. two stacked screenshots) — sized as one
  // group whose height matches their combined bounding box on the canvas.
  const groupTop = Math.min(...images.map((i) => i.top ?? 0));
  const groupBottom = Math.max(...images.map((i) => (i.top ?? 0) + i.height));
  const groupHeight = groupBottom - groupTop;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${CAROUSEL_CANVAS_WIDTH} / ${groupHeight}` }}>
      {images.map((image) => (
        <div
          key={image.src}
          className="absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-lg border border-border shadow-[0px_0px_28px_4px_rgba(0,0,0,0.04)]"
          style={{
            top: `${(((image.top ?? 0) - groupTop) / groupHeight) * 100}%`,
            width: `min(${image.width}px, 100%)`,
            aspectRatio: `${image.width} / ${image.height}`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function BeforeAfterCarousel({ slides }: { slides: BeforeAfterSlide[] }) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const slide = slides[index];

  const goTo = (nextIndex: number) => setSlide([nextIndex, nextIndex > index ? 1 : -1]);

  return (
    <motion.div
      layout
      className="relative w-full overflow-hidden rounded-[var(--ds-radius-container)] bg-surface-media"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: EASE_OUT }}
          layout
          className="flex flex-col pb-6"
        >
          <div className="flex items-center gap-4 px-6 pb-4 pt-6">
            <span
              className="shrink-0 rounded-[4px] border px-3 py-[6px] font-mono text-[12px] font-medium uppercase leading-4"
              style={{
                backgroundColor: slide.badgeBg,
                color: slide.badgeColor,
                borderColor: slide.badgeBorder,
              }}
            >
              {slide.badgeLabel}
            </span>
            <p className="min-w-0 text-[14px] font-medium leading-[160%] text-[#333333]" style={fontStyle.figtree}>
              {slide.title}
            </p>
          </div>
          <div className="px-6">
            <ImageGroup images={slide.images} />
          </div>
          {slide.caption && (
            <p
              className="px-6 pt-6 text-center text-[12px] font-normal leading-[187%] text-[#555555]"
              style={fontStyle.figtree}
            >
              {slide.caption}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
      {index > 0 && <ArrowButton direction="left" onClick={() => goTo(index - 1)} />}
      {index < slides.length - 1 && (
        <ArrowButton direction="right" onClick={() => goTo(index + 1)} />
      )}
    </motion.div>
  );
}
