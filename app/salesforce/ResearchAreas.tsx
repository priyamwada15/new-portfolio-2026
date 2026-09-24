"use client";

import { useEffect, useRef, useState } from "react";

type Category = "academic" | "career" | "social" | "health" | "direction";

const COLUMNS: { category: Category; label: string; items: { text: string; kept?: boolean }[] }[] = [
  {
    category: "academic",
    label: "Academic",
    items: [
      { text: "Fragmented Information", kept: true },
      { text: "Already need to know what to search", kept: true },
      { text: "Generic guidance and advising", kept: true },
      { text: "Choice Overload", kept: true },
    ],
  },
  {
    category: "career",
    label: "Career",
    items: [
      { text: "Late career guidance" },
      { text: "Disjointed from academics" },
      { text: "No mentorship for transition" },
    ],
  },
  {
    category: "social",
    label: "Social",
    items: [
      { text: "Value peer insights", kept: true },
      { text: "Low Event Visibility" },
      { text: "Networking anxiety" },
      { text: "FOMO" },
      { text: "Scattered communication" },
    ],
  },
  {
    category: "health",
    label: "Health",
    items: [
      { text: "Burnout & stress" },
      { text: "Need emotional resilience" },
      { text: "Loss of support systems" },
    ],
  },
  {
    category: "direction",
    label: "General Direction",
    items: [
      { text: "No goal setting", kept: true },
      { text: "Student Interests + Expert opinions", kept: true },
    ],
  },
];

/** How long each state (full grid / narrowed to the areas we kept) holds before switching. */
const SWITCH_INTERVAL_MS = 1500;

/**
 * Interview themes grouped by area. While the grid is in view it loops between
 * the full set and the areas we kept, fading the rest to 20%. Reduced-motion
 * users see the narrowed state without looping.
 */
export default function ResearchAreas() {
  const ref = useRef<HTMLDivElement>(null);
  const [narrowed, setNarrowed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: no loop; CSS pins the narrowed state instead.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearInterval(interval);
        if (entry.intersectionRatio >= 0.5) {
          interval = setInterval(() => setNarrowed((n) => !n), SWITCH_INTERVAL_MS);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div ref={ref} className="mx-auto flex w-[870px] max-w-full items-start gap-3">
      {COLUMNS.map((column) => (
        <div key={column.category} className="flex min-w-0 flex-1 flex-col gap-[17px]">
          {column.items.map((item) => (
            <div
              key={item.text}
              className={`flex min-h-[109px] flex-col gap-2.5 rounded-[10px] p-[17px] font-label font-medium leading-[1.2] transition-opacity duration-700 ease-out ${
                item.kept ? "" : `${narrowed ? "opacity-20" : "opacity-100"} motion-reduce:opacity-20`
              }`}
              style={{ backgroundColor: `var(--ds-research-${column.category}-bg)` }}
            >
              <p
                className="text-[12px] tracking-[-0.27px]"
                style={{ color: `var(--ds-research-${column.category})` }}
              >
                {column.label}
              </p>
              <p className="text-[14px] tracking-[-0.3px] text-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
