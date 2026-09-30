"use client";

import { useRef, useState } from "react";

/** Salesforce carousel sizes: 790×535 slides, 24px apart, inside a 1008 column. */
const SLIDE_WIDTH = "78.37%";
const SLIDE_GAP = 24;
/** Media area inside a slide, as a share of the 535px slide height (Figma: 92px from the top). */
const MEDIA_TOP = "17.2%";
const MEDIA_HEIGHT = "75.3%";

export type MediaSlide = {
  title: string;
  /** Rendered inside a centred box with this aspect ratio (e.g. "768 / 501"). */
  media: React.ReactNode;
  aspect: string;
};

function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
      className={`absolute top-1/2 z-10 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_0_16px_3px_rgba(0,0,0,0.06)] ${
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

/**
 * Horizontal track of fixed-shape slides in the Salesforce carousel style: a title
 * at the top left, the media centred below it, and the next slide peeking in from
 * the right. Off-screen slides are clipped, so `AutoPauseVideo` pauses them itself.
 */
export default function MediaCarousel({ slides, label }: { slides: MediaSlide[]; label: string }) {
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
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const stride = first.offsetWidth + SLIDE_GAP;
    const position = el.scrollLeft / stride;
    const target = direction > 0 ? Math.floor(position + 0.01) + 1 : Math.ceil(position - 0.01) - 1;
    el.scrollTo({ left: Math.max(0, target) * stride, behavior: "smooth" });
  };

  return (
    <div className="relative w-full" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="flex overflow-x-auto overscroll-x-contain rounded-[var(--ds-radius-container)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: SLIDE_GAP }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.title}
            className="relative aspect-[790/535] shrink-0 rounded-[var(--ds-radius-container)] border border-border bg-surface-page"
            style={{ width: SLIDE_WIDTH }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${slide.title}`}
          >
            <p className="absolute left-6 right-6 top-6 font-label text-[14px] font-medium leading-[22.4px] text-primary">
              {slide.title}
            </p>
            <div
              className="absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-lg border border-border shadow-[0_0_16px_3px_rgba(0,0,0,0.04)]"
              style={{ top: MEDIA_TOP, height: MEDIA_HEIGHT, aspectRatio: slide.aspect }}
            >
              {slide.media}
            </div>
          </div>
        ))}
      </div>
      {!edges.atStart && <ArrowButton direction="left" onClick={() => step(-1)} />}
      {!edges.atEnd && <ArrowButton direction="right" onClick={() => step(1)} />}
    </div>
  );
}
