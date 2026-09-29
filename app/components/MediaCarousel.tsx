"use client";

import { useRef, useState } from "react";

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
 * One full-width slide at a time, with arrows and dots. Slides are any media
 * (videos, demos, screenshots). Off-screen slides are clipped by the track, so
 * `AutoPauseVideo` pauses them on its own.
 */
export default function MediaCarousel({ slides, label }: { slides: React.ReactNode[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (target: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="flex w-full flex-col items-center gap-4" role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="relative w-full">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory items-start overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="w-full shrink-0 snap-start"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>
        {index > 0 && <ArrowButton direction="left" onClick={() => goTo(index - 1)} />}
        {index < slides.length - 1 && <ArrowButton direction="right" onClick={() => goTo(index + 1)} />}
      </div>
      <div className="flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`size-2 cursor-pointer rounded-full transition-colors ${
              i === index ? "bg-[var(--accent-dark)]" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
