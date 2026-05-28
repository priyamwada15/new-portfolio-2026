"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function LazyVideo({
  src,
  poster,
  ariaLabel,
  loop = true,
  style,
  className,
}: {
  src: string;
  poster: string;
  ariaLabel: string;
  loop?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          setInView(true);
        } else {
          setInView(false);
        }
      },
      {
        threshold: 0.25,
        rootMargin: "150px",
      },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (inView && shouldLoad) {
      void v.play().catch(() => {
        // Autoplay can still be blocked in some environments; poster will remain visible.
      });
    } else {
      v.pause();
    }
  }, [inView, shouldLoad]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      playsInline
      loop={loop}
      preload="none"
      poster={poster}
      aria-label={ariaLabel}
      // Avoid fetching video bytes until we've confirmed it's in view.
      src={shouldLoad ? src : undefined}
      style={style}
    />
  );
}

