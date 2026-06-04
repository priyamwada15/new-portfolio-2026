"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Above-the-fold: visible in SSR/first paint (no wait for hydration + rAF) */
  revealOnMount?: boolean;
  delayMs?: number;
};

export function ScrollReveal({
  children,
  className,
  revealOnMount = false,
  delayMs,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (revealOnMount) return;
    const el = ref.current;
    if (!el || el.classList.contains("is-visible")) return;

    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight - 40 &&
      rect.bottom > 40 &&
      rect.width > 0;
    if (inView) {
      el.classList.add("is-visible");
    }
  }, [revealOnMount]);

  useEffect(() => {
    if (revealOnMount) return;
    const el = ref.current;
    if (!el || el.classList.contains("is-visible")) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "-40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [revealOnMount]);

  return (
    <div
      ref={ref}
      className={cn(
        "card-reveal overflow-visible",
        revealOnMount && "is-visible",
        className,
      )}
      style={delayMs !== undefined ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
