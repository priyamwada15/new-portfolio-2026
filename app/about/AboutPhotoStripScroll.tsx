"use client";

import { cn } from "@/lib/utils";

type AboutPhotoStripScrollProps = {
  children: React.ReactNode;
  /** Outer wrapper (bleed host) */
  className?: string;
  /** Inner scroll viewport */
  scrollClassName?: string;
  /** Wide track that holds the strip */
  trackClassName?: string;
};

/**
 * Mobile: horizontal scroll on the inner viewport; vertical (and shadow) bleed
 * paints on the outer host via padding. CSS cannot combine overflow-x: auto with
 * overflow-y: visible on a single element, so we use this two-layer pattern.
 */
export default function AboutPhotoStripScroll({
  children,
  className,
  scrollClassName,
  trackClassName,
}: AboutPhotoStripScrollProps) {
  return (
    <div
      className={cn(
        "max-lg:overflow-visible max-lg:py-12 max-lg:-my-12",
        className
      )}
    >
      <div
        className={cn(
          "w-full max-lg:overflow-x-auto max-lg:overscroll-x-contain",
          "lg:overflow-visible",
          scrollClassName
        )}
      >
        <div
          className={cn(
            "max-lg:inline-block max-lg:min-w-full max-lg:px-10",
            trackClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
