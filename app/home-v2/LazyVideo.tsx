"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type RegistryEntry = {
  el: HTMLVideoElement;
  near: boolean;
  ensureLoaded: () => void;
};

type VideoRegistry = {
  entries: Map<string, RegistryEntry>;
  scheduled: boolean;
  reconcile: () => void;
};

const MAX_PLAYING = 2;

function getRegistry(): VideoRegistry {
  const w = window as unknown as { __lazyVideoRegistry?: VideoRegistry };
  if (w.__lazyVideoRegistry) return w.__lazyVideoRegistry;

  const registry: VideoRegistry = {
    entries: new Map(),
    scheduled: false,
    reconcile: () => {
      registry.scheduled = false;

      const list = Array.from(registry.entries.values());
      if (list.length === 0) return;

      // A video may play once fully within the viewport (no clipping).
      // ("Fully" means no part of the video's bounding box is clipped by the viewport.)
      const vpW = window.innerWidth;
      const vpH = window.innerHeight;
      const vpCenterY = vpH / 2;

      const measured = list.map((e) => {
        const rect = e.el.getBoundingClientRect();
        const fully =
          rect.width > 0 &&
          rect.height > 0 &&
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= vpH &&
          rect.right <= vpW;
        // Looser check than "fully" — any part of the box still on screen.
        const onscreen =
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < vpH &&
          rect.right > 0 &&
          rect.left < vpW;
        const centerY = rect.top + rect.height / 2;
        const distToCenter = Math.abs(centerY - vpCenterY);
        return { e, fully, onscreen, distToCenter };
      });

      // Sticky: a video already playing keeps its slot as long as it's still
      // onscreen at all, rather than being re-judged against the strict
      // "fully visible" test every reconcile. Tall cards linger near that
      // boundary during scroll, so re-litigating it each tick caused
      // visible play/pause thrashing. New candidates only take a slot once
      // one is actually free.
      const sticky = measured
        .filter((x) => !x.e.el.paused && x.onscreen)
        .sort((a, b) => a.distToCenter - b.distToCenter);

      const allow = new Set(sticky.slice(0, MAX_PLAYING).map((x) => x.e.el));

      if (allow.size < MAX_PLAYING) {
        const candidates = measured
          .filter((x) => x.fully && !allow.has(x.e.el))
          .sort((a, b) => a.distToCenter - b.distToCenter);

        for (const c of candidates) {
          if (allow.size >= MAX_PLAYING) break;
          allow.add(c.e.el);
        }
      }

      for (const entry of list) {
        if (allow.has(entry.el)) {
          entry.ensureLoaded();
          // Kick playback; may be blocked until data is ready (handled by browser).
          void entry.el.play().catch(() => {});
        } else {
          entry.el.pause();
        }
      }
    },
  };

  w.__lazyVideoRegistry = registry;
  return registry;
}

function scheduleReconcile(registry: VideoRegistry) {
  if (registry.scheduled) return;
  registry.scheduled = true;
  window.requestAnimationFrame(registry.reconcile);
}

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
  const id = useId();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldLoadRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const ensureLoaded = () => {
      if (shouldLoadRef.current) return;
      shouldLoadRef.current = true;
      setShouldLoad(true);
    };

    const registry = getRegistry();
    const key = `${id}:${src}`;

    registry.entries.set(key, {
      el,
      near: false,
      ensureLoaded,
    });

    const obs = new IntersectionObserver(
      ([entry]) => {
        const r = registry.entries.get(key);
        if (!r) return;
        // "near" should include elements slightly offscreen to avoid thrash on scroll.
        r.near = entry.isIntersecting;
        // Preload when near, but only play when fully visible (enforced in reconcile).
        if (r.near) r.ensureLoaded();
        scheduleReconcile(registry);
      },
      {
        threshold: [0],
        rootMargin: "400px",
      },
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      registry.entries.delete(key);
      scheduleReconcile(registry);
    };
  }, [id, src]);

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
