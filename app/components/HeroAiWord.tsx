"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const DEFAULT_LABEL = "AI";
const HOVER_PHRASES = [
  "thinking...",
  "researching...",
  "making it pop...",
] as const;
const TYPE_MS = 68;
const HOLD_MS = 1800;

/** Shared center of 10.5×10 sparkle box (all lines stacked here). */
const SPARKLE_ORIGIN = "5px 0";
const ROT_VERTICAL = 90;
const ROT_HORIZONTAL = 0;
const ROT_DIAG_1 = 45;
const ROT_DIAG_2 = -45;

type HeroAiWordProps = {
  className?: string;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function HeroAiWord({ className }: HeroAiWordProps) {
  const chipRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const lineVRef = useRef<HTMLSpanElement>(null);
  const lineHRef = useRef<HTMLSpanElement>(null);
  const lineD1Ref = useRef<HTMLSpanElement>(null);
  const lineD2Ref = useRef<HTMLSpanElement>(null);
  const runIdRef = useRef(0);
  const sparkleTweenRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotionRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const isStale = useCallback((id: number) => runIdRef.current !== id, []);

  const backspace = useCallback(
    async (el: HTMLElement, text: string, id: number) => {
      for (let i = text.length; i >= 0; i--) {
        if (isStale(id)) return;
        el.textContent = text.slice(0, i);
        await wait(TYPE_MS);
      }
    },
    [isStale],
  );

  const type = useCallback(
    async (el: HTMLElement, text: string, id: number) => {
      for (let i = 0; i <= text.length; i++) {
        if (isStale(id)) return;
        el.textContent = text.slice(0, i);
        await wait(TYPE_MS);
      }
    },
    [isStale],
  );

  const resetSparkleLines = useCallback(() => {
    const v = lineVRef.current;
    const h = lineHRef.current;
    const d1 = lineD1Ref.current;
    const d2 = lineD2Ref.current;
    if (!v || !h || !d1 || !d2) return;

    const origin = SPARKLE_ORIGIN;
    gsap.set(v, {
      opacity: 1,
      rotation: ROT_VERTICAL,
      transformOrigin: origin,
      x: 0,
      y: 0,
    });
    gsap.set([h, d1, d2], {
      opacity: 0,
      rotation: ROT_VERTICAL,
      transformOrigin: origin,
      x: 0,
      y: 0,
    });
  }, []);

  const showFullSparkle = useCallback(() => {
    const origin = SPARKLE_ORIGIN;
    gsap.set(lineVRef.current, {
      opacity: 1,
      rotation: ROT_VERTICAL,
      transformOrigin: origin,
    });
    gsap.set(lineHRef.current, {
      opacity: 1,
      rotation: ROT_HORIZONTAL,
      transformOrigin: origin,
    });
    gsap.set(lineD1Ref.current, {
      opacity: 1,
      rotation: ROT_DIAG_1,
      transformOrigin: origin,
    });
    gsap.set(lineD2Ref.current, {
      opacity: 1,
      rotation: ROT_DIAG_2,
      transformOrigin: origin,
    });
  }, []);

  const buildSparkleLoop = useCallback(() => {
    const v = lineVRef.current;
    const h = lineHRef.current;
    const d1 = lineD1Ref.current;
    const d2 = lineD2Ref.current;
    if (!v || !h || !d1 || !d2) return null;

    resetSparkleLines();

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.55 });

    tl.to(h, {
      opacity: 1,
      rotation: ROT_HORIZONTAL,
      duration: 0.48,
      ease: "power2.out",
    })
      .to(
        d1,
        {
          opacity: 1,
          rotation: ROT_DIAG_1,
          duration: 0.48,
          ease: "power2.out",
        },
        "-=0.12",
      )
      .to(
        d2,
        {
          opacity: 1,
          rotation: ROT_DIAG_2,
          duration: 0.48,
          ease: "power2.out",
        },
        "-=0.12",
      )
      .to(
        [h, d1, d2],
        {
          opacity: 0,
          rotation: ROT_VERTICAL,
          duration: 0.4,
          ease: "power2.in",
          stagger: 0.05,
        },
        "+=0.2",
      )
      .set(v, { rotation: ROT_VERTICAL, opacity: 1 });

    return tl;
  }, [resetSparkleLines]);

  const stopSparkle = useCallback(() => {
    sparkleTweenRef.current?.kill();
    sparkleTweenRef.current = null;
    resetSparkleLines();
  }, [resetSparkleLines]);

  const runTextCycle = useCallback(
    async (id: number) => {
      const el = labelRef.current;
      if (!el) return;

      let index = 0;
      while (!isStale(id)) {
        const phrase = HOVER_PHRASES[index % HOVER_PHRASES.length];
        index += 1;
        await type(el, phrase, id);
        if (isStale(id)) return;
        await wait(HOLD_MS);
        if (isStale(id)) return;
        await backspace(el, phrase, id);
      }
    },
    [backspace, isStale, type],
  );

  const onEnter = useCallback(async () => {
    const id = ++runIdRef.current;
    const el = labelRef.current;
    if (!el) return;

    setHovered(true);

    if (reducedMotionRef.current) {
      el.textContent = HOVER_PHRASES[0];
      showFullSparkle();
      void runTextCycle(id);
      return;
    }

    sparkleTweenRef.current?.kill();
    sparkleTweenRef.current = buildSparkleLoop();

    const current = el.textContent ?? DEFAULT_LABEL;
    await backspace(el, current, id);
    if (isStale(id)) return;

    void runTextCycle(id);
  }, [backspace, buildSparkleLoop, isStale, runTextCycle, showFullSparkle]);

  const onLeave = useCallback(async () => {
    const id = ++runIdRef.current;
    const el = labelRef.current;
    if (!el) return;

    stopSparkle();
    setHovered(false);

    if (reducedMotionRef.current) {
      el.textContent = DEFAULT_LABEL;
      return;
    }

    const current = el.textContent ?? "";
    await backspace(el, current, id);
    if (isStale(id)) return;
    await type(el, DEFAULT_LABEL, id);
  }, [backspace, isStale, stopSparkle, type]);

  useGSAP(
    () => {
      return () => {
        runIdRef.current += 1;
        stopSparkle();
      };
    },
    { scope: chipRef },
  );

  return (
    <span
      ref={chipRef}
      className={cn(
        "hero-ai-chip cursor-pointer",
        hovered && "hero-ai-chip--hover",
        className,
      )}
      aria-label={hovered ? undefined : DEFAULT_LABEL}
      onMouseEnter={() => void onEnter()}
      onMouseLeave={() => void onLeave()}
      onFocus={() => void onEnter()}
      onBlur={() => void onLeave()}
      tabIndex={0}
    >
      <span className="hero-ai-chip__sparkle" aria-hidden>
        <span ref={lineVRef} className="hero-ai-chip__sparkle-line" />
        <span ref={lineHRef} className="hero-ai-chip__sparkle-line" />
        <span ref={lineD1Ref} className="hero-ai-chip__sparkle-line" />
        <span ref={lineD2Ref} className="hero-ai-chip__sparkle-line" />
      </span>
      <span ref={labelRef} className="hero-ai-chip__label">
        {DEFAULT_LABEL}
      </span>
      <span className="hero-ai-chip__glow" aria-hidden />
    </span>
  );
}
