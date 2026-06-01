"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Reveal after mount (double rAF), like homepage tabs — for above-the-fold blocks */
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
    if (!revealOnMount) return;
    const el = ref.current;
    if (!el) return;

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        el.classList.add("is-visible");
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [revealOnMount]);

  useEffect(() => {
    if (revealOnMount) return;
    const el = ref.current;
    if (!el) return;

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
      className={cn("card-reveal overflow-visible", className)}
      style={delayMs !== undefined ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
