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

      // Two-threshold (enter/exit) rule: a video starts playing once fully
      // within the viewport (no clipping), and keeps playing through partial
      // clipping while scrolling — it only stops once it has actually left
      // the viewport. Using a looser exit condition than the entry condition
      // means a playing video's own edge crossing the "fully visible"
      // boundary doesn't flicker it off. Because this is recomputed fresh
      // from current geometry every call, the top MAX_PLAYING closest to
      // center always wins — no separate eviction bookkeeping needed.
      const vpW = window.innerWidth;
      const vpH = window.innerHeight;
      const vpCenterY = vpH / 2;

      const eligible = list
        .map((e) => {
          const rect = e.el.getBoundingClientRect();
          const fully =
            rect.width > 0 &&
            rect.height > 0 &&
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= vpH &&
            rect.right <= vpW;
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
        })
        .filter((x) => x.fully || (!x.e.el.paused && x.onscreen))
        .sort((a, b) => a.distToCenter - b.distToCenter);

      const allow = new Set(eligible.slice(0, MAX_PLAYING).map((x) => x.e.el));

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

  // IntersectionObserver only fires when an element crosses its own 400px
  // threshold, which is too sparse to catch the exact moment a card becomes
  // fully visible. A scroll listener keeps reconcile running continuously
  // (throttled to one rAF per tick via scheduleReconcile) so play/pause
  // reacts immediately to the real scroll position.
  window.addEventListener("scroll", () => scheduleReconcile(registry), {
    passive: true,
  });

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
