"use client";

import { useRef, useState } from "react";

/** Salesforce carousel sizes: 790px slides, 24px apart, inside a 1008 column. Full width on phones. */
const SLIDE_WIDTH = "78.37%";
const SLIDE_GAP = 24;
/** Every slide's media area shares the product videos' shape, so slides line up. */
const MEDIA_ASPECT = "768 / 501";

export type MediaSlide = {
  title: string;
  /** Fills the slide's media area directly, with no frame of its own. */
  media: React.ReactNode;
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
 * Horizontal track of slides in the Salesforce carousel style, with the next slide
 * peeking in from the right. Each slide is one container: its title at the top, then
 * the video or image straight below. The fill matches the videos' baked-in #F5F5F5.
 * Off-screen slides are clipped, so `AutoPauseVideo` pauses them itself.
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
            className="flex shrink-0 flex-col overflow-hidden rounded-[var(--ds-radius-container)] border border-border bg-surface-media max-md:w-full!"
            style={{ width: SLIDE_WIDTH }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${slide.title}`}
          >
            <p className="px-6 pb-2 pt-8 max-md:px-4 max-md:pt-4 font-label text-[14px] font-medium leading-[22.4px] text-primary">
              {slide.title}
            </p>
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: MEDIA_ASPECT }}>
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
