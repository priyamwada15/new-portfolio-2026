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
  const inViewRef = useRef(false);
  const shouldLoadRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const playIfInView = () => {
      if (!inViewRef.current || !shouldLoadRef.current) return;
      if (el.readyState >= 2) {
        void el.play().catch(() => {});
        return;
      }
      el.addEventListener(
        "loadeddata",
        () => {
          if (inViewRef.current) void el.play().catch(() => {});
        },
        { once: true },
      );
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!shouldLoadRef.current) {
            shouldLoadRef.current = true;
            setShouldLoad(true);
          }
          playIfInView();
        } else {
          el.pause();
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
    const el = videoRef.current;
    if (!el || !shouldLoad || !inViewRef.current) return;
    if (el.readyState >= 2) {
      void el.play().catch(() => {});
      return;
    }
    el.addEventListener(
      "loadeddata",
      () => {
        if (inViewRef.current) void el.play().catch(() => {});
      },
      { once: true },
    );
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      className={cn(className)}
      muted
      playsInline
      loop={loop}
      preload="none"
      poster={poster}
      aria-label={ariaLabel}
      src={shouldLoad ? src : undefined}
      style={style}
    />
  );
}
