"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

const WORD_COMPLEX = "complex";
const WORD_INTUITIVE = "intuitive";
const SCRAMBLE_CHARS = `${WORD_COMPLEX}${WORD_INTUITIVE}01#*@&`;

const SCRAMBLE_DURATION_S = 1.75;
const SCRAMBLE_SPEED = 0.28;
const SCRAMBLE_REVEAL_DELAY = 0.1;
const HOLD_INTUITIVE_MS = 700;

type HeroComplexWordProps = {
  className?: string;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function StyledComplexMark() {
  return (
    <span className="hero-complex-word__mark">
      <span className="hero-complex-word__figtree">c</span>
      <span className="hero-complex-word__figtree">θ</span>
      <span className="hero-complex-word__figtree">m</span>
      <span className="hero-complex-word__figtree">p</span>
      <span className="hero-complex-word__festive">l</span>
      <span className="hero-complex-word__figtree">e</span>
      <span className="hero-complex-word__festive">X</span>
    </span>
  );
}

export function HeroComplexWord({ className }: HeroComplexWordProps) {
  const plainRef = useRef<HTMLSpanElement>(null);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const runIdRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const [interacting, setInteracting] = useState(false);
  const interactingRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    interactingRef.current = interacting;
  }, [interacting]);

  const isStale = useCallback((id: number) => runIdRef.current !== id, []);

  const showStyledMark = useCallback(() => {
    activeTweenRef.current?.kill();
    activeTweenRef.current = null;
    const el = plainRef.current;
    if (el) {
      gsap.killTweensOf(el);
      el.textContent = "";
    }
    interactingRef.current = false;
    setInteracting(false);
  }, []);

  const scrambleTo = useCallback(
    (text: string, id: number, onStart?: () => void): Promise<void> =>
      new Promise((resolve) => {
        const el = plainRef.current;
        if (!el || isStale(id)) {
          resolve();
          return;
        }

        activeTweenRef.current?.kill();

        if (reducedMotionRef.current) {
          el.textContent = text;
          onStart?.();
          resolve();
          return;
        }

        activeTweenRef.current = gsap.to(el, {
          duration: SCRAMBLE_DURATION_S,
          ease: "power2.out",
          scrambleText: {
            text,
            chars: SCRAMBLE_CHARS,
            speed: SCRAMBLE_SPEED,
            revealDelay: SCRAMBLE_REVEAL_DELAY,
          },
          onStart: () => {
            if (!isStale(id)) onStart?.();
          },
          onComplete: () => {
            activeTweenRef.current = null;
            resolve();
          },
        });
      }),
    [isStale],
  );

  const runHoverCycle = useCallback(
    async (id: number) => {
      const el = plainRef.current;
      if (!el || isStale(id)) return;

      el.textContent = WORD_COMPLEX;

      if (reducedMotionRef.current) {
        await scrambleTo(WORD_INTUITIVE, id);
        if (isStale(id)) return;
        await scrambleTo(WORD_COMPLEX, id);
        if (isStale(id)) return;
        showStyledMark();
        return;
      }

      activeTweenRef.current?.kill();

      await scrambleTo(WORD_INTUITIVE, id, () => {
        interactingRef.current = true;
        setInteracting(true);
      });
      if (isStale(id)) return;
      await wait(HOLD_INTUITIVE_MS);
      if (isStale(id)) return;
      await scrambleTo(WORD_COMPLEX, id);
      if (isStale(id)) return;
      showStyledMark();
    },
    [isStale, scrambleTo, showStyledMark],
  );

  const runLeaveReturn = useCallback(
    async (id: number) => {
      const el = plainRef.current;
      if (!el || isStale(id)) {
        showStyledMark();
        return;
      }

      if (reducedMotionRef.current) {
        showStyledMark();
        return;
      }

      if (!interactingRef.current) {
        interactingRef.current = true;
        setInteracting(true);
      }

      await scrambleTo(WORD_COMPLEX, id);
      if (isStale(id)) return;
      showStyledMark();
    },
    [isStale, scrambleTo, showStyledMark],
  );

  const onEnter = useCallback(() => {
    const id = ++runIdRef.current;
    activeTweenRef.current?.kill();
    void runHoverCycle(id);
  }, [runHoverCycle]);

  const onLeave = useCallback(() => {
    const id = ++runIdRef.current;
    activeTweenRef.current?.kill();

    if (!interactingRef.current) {
      showStyledMark();
      return;
    }

    void runLeaveReturn(id);
  }, [runLeaveReturn, showStyledMark]);

  useGSAP(
    () => () => {
      runIdRef.current += 1;
      showStyledMark();
    },
    { scope: plainRef, dependencies: [showStyledMark] },
  );

  return (
    <span
      className={cn(
        "hero-complex-word cursor-pointer rounded-sm",
        "leading-[130%] focus-visible:ring-2 focus-visible:ring-[#744577]/35",
        interacting && "hero-complex-word--scrambling",
        className,
      )}
      role="text"
      aria-label={`${WORD_COMPLEX} (hover for ${WORD_INTUITIVE})`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
    >
      <span className="hero-complex-word__ghost" aria-hidden>
        <span className="hero-complex-word__ghost-plain">{WORD_INTUITIVE}</span>
        <StyledComplexMark />
      </span>
      <span className="hero-complex-word__surface">
        <span
          ref={plainRef}
          className="hero-complex-word__plain"
          aria-hidden={!interacting}
        />
        <span className="hero-complex-word__styled" aria-hidden={interacting}>
          <StyledComplexMark />
        </span>
      </span>
    </span>
  );
}
