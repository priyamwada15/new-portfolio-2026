"use client";

import { useRef, useState } from "react";

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
  /** Size in px inside the 790×535 slide. */
  width: number;
  height: number;
  /** Offset in px from the top of the slide. Defaults to the image area's top (92). */
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

const SLIDE_WIDTH = 790;
const SLIDE_GAP = 24;
/** Where the image area starts inside a slide (below the badge row). */
const IMAGE_AREA_TOP = 92;

function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous screen" : "Next screen"}
      className={`absolute top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_16px_3px_rgba(0,0,0,0.06)] ${
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
        <path d="M1 1L7 7L1 13" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Slide({ slide }: { slide: BeforeAfterSlide }) {
  return (
    <div
      className="relative h-[535px] shrink-0 rounded-[var(--ds-radius-container)] border border-border bg-surface-page"
      style={{ width: SLIDE_WIDTH }}
    >
      <div className="absolute left-6 right-6 top-6 flex items-center gap-4">
        <span
          className="shrink-0 rounded-[4px] border px-3 py-[6px] font-mono text-[12px] font-medium uppercase leading-4"
          style={{ backgroundColor: slide.badgeBg, color: slide.badgeColor, borderColor: slide.badgeBorder }}
        >
          {slide.badgeLabel}
        </span>
        <p className="min-w-0 font-label text-[14px] font-medium leading-[22.4px] text-primary">{slide.title}</p>
      </div>
      {slide.images.map((image) => (
        <div
          key={image.src}
          className="absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-lg border border-border shadow-[0_0_16px_3px_rgba(0,0,0,0.04)]"
          style={{ top: image.top ?? IMAGE_AREA_TOP, width: image.width, height: image.height }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt} className="size-full object-cover" />
          {image.redactions?.map((r) => (
            <div
              key={`${r.left}-${r.top ?? r.bottom}`}
              className="absolute bg-white/20 backdrop-blur-[7.5px]"
              style={{ left: r.left, top: r.top, bottom: r.bottom, width: r.width, height: r.height, borderRadius: r.borderRadius }}
            />
          ))}
        </div>
      ))}
      {slide.caption && (
        <p className="absolute inset-x-6 top-[488px] text-center font-label text-[12px] leading-[22.4px] text-secondary">
          {slide.caption}
        </p>
      )}
    </div>
  );
}

/** Horizontal track of fixed-size slides; the next slide peeks in from the right edge. */
export default function BeforeAfterCarousel({ slides }: { slides: BeforeAfterSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({ atStart: el.scrollLeft <= 1, atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  };

  /** Free scrolling can leave the track between slides, so arrows align to the next/previous slide edge. */
  const step = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const stride = SLIDE_WIDTH + SLIDE_GAP;
    const position = el.scrollLeft / stride;
    const target = direction > 0 ? Math.floor(position + 0.01) + 1 : Math.ceil(position - 0.01) - 1;
    el.scrollTo({ left: Math.max(0, target) * stride, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="flex overflow-x-auto overscroll-x-contain rounded-[var(--ds-radius-container)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: SLIDE_GAP }}
      >
        {slides.map((slide) => (
          <Slide key={slide.title} slide={slide} />
        ))}
      </div>
      {!edges.atStart && <ArrowButton direction="left" onClick={() => step(-1)} />}
      {!edges.atEnd && <ArrowButton direction="right" onClick={() => step(1)} />}
    </div>
  );
}
