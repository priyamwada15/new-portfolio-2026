"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const BRAND_TEXT = "priyamwada pandey";
const LOGO_HOME_PX = 24;
const LOGO_ROLL_PX = 12;
const LOGO_ROLL_SCALE = LOGO_ROLL_PX / LOGO_HOME_PX;
const GAP_PX = 8;
/** Half-width of the lift zone — only letters this close to the orb center move */
const WAVE_RADIUS_PX = 26;
const WAVE_LIFT_PX = -20;
const TEXT_OFFSET_PX = LOGO_HOME_PX + GAP_PX;
const SHRINK_DURATION = 0.4;
const ROLL_DURATION = 2.6;
const RESTORE_DURATION = 0.4;

type NavBrandLinkProps = {
  href: string;
  className?: string;
  style?: React.CSSProperties;
};

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return [...segmenter.segment(text)].map((s) => s.segment);
  }
  return [...text];
}

/** Cosine bump: 1 at center, 0 at ±radius — traveling wave crest follows the orb */
function waveLift(signedDist: number, radius: number, lift: number): number {
  const abs = Math.abs(signedDist);
  if (abs >= radius) return 0;
  const envelope = Math.cos((abs / radius) * (Math.PI / 2));
  const ripple = 0.72 + 0.28 * Math.cos(signedDist * 0.32);
  return lift * envelope * ripple;
}

export function NavBrandLink({ href, className, style }: NavBrandLinkProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const orbRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const letterElsRef = useRef<HTMLSpanElement[]>([]);
  const letterCentersRef = useRef<number[]>([]);
  const textWidthRef = useRef(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const rollingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const hoveringRef = useRef(false);
  const [chars] = useState(() => splitGraphemes(BRAND_TEXT));

  const measureLetters = useCallback(() => {
    const text = textRef.current;
    const letters = letterElsRef.current.filter(Boolean);
    if (!text || letters.length === 0) return;

    const textRect = text.getBoundingClientRect();
    textWidthRef.current = text.offsetWidth;
    letterCentersRef.current = letters.map((el) => {
      const r = el.getBoundingClientRect();
      return r.left - textRect.left + r.width / 2;
    });
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const mq = window.matchMedia("(min-width: 640px)");
    const onResize = () => {
      if (mq.matches) measureLetters();
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureLetters]);

  useEffect(() => {
    measureLetters();
  }, [chars, measureLetters]);

  const resetLetters = useCallback(() => {
    letterElsRef.current.forEach((el) => {
      if (el) gsap.set(el, { y: 0 });
    });
  }, []);

  const orbCenterX = useCallback((orbX: number) => {
    const scale =
      (gsap.getProperty(orbRef.current, "scaleX") as number) ?? 1;
    return orbX + (LOGO_HOME_PX * scale) / 2;
  }, []);

  const applyWave = useCallback((circleCenterX: number) => {
    if (!rollingRef.current) return;

    const centers = letterCentersRef.current;
    letterElsRef.current.forEach((el, i) => {
      if (!el || centers[i] === undefined) return;
      const letterX = TEXT_OFFSET_PX + centers[i];
      const lift = waveLift(letterX - circleCenterX, WAVE_RADIUS_PX, WAVE_LIFT_PX);
      gsap.set(el, { y: lift });
    });
  }, []);

  const syncWaveFromOrb = useCallback(() => {
    const x = (gsap.getProperty(orbRef.current, "x") as number) ?? 0;
    applyWave(orbCenterX(x));
  }, [applyWave, orbCenterX]);

  const stopTimeline = useCallback(() => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    rollingRef.current = false;
  }, []);

  const resetOrb = useCallback(() => {
    const orb = orbRef.current;
    if (!orb) return;
    rollingRef.current = false;
    gsap.set(orb, {
      x: 0,
      rotate: 0,
      scale: 1,
      yPercent: -50,
      transformOrigin: "50% 50%",
    });
    resetLetters();
  }, [resetLetters]);

  const playRoll = useCallback(() => {
    const orb = orbRef.current;
    const text = textRef.current;
    if (!orb || !text || reducedMotionRef.current) return;

    measureLetters();
    const textWidth = textWidthRef.current;
    if (textWidth <= 0) return;

    stopTimeline();
    resetOrb();

    const rollDiameter = LOGO_ROLL_PX;
    const travel = GAP_PX + textWidth - rollDiameter;
    const rollTurns = travel / (Math.PI * rollDiameter);

    const tl = gsap.timeline({
      onComplete: () => {
        if (hoveringRef.current) return;
        resetOrb();
      },
    });
    timelineRef.current = tl;

    tl.to(orb, {
      scale: LOGO_ROLL_SCALE,
      duration: SHRINK_DURATION,
      ease: "power2.inOut",
      transformOrigin: "50% 50%",
      onComplete: resetLetters,
    });

    tl.add(() => {
      rollingRef.current = true;
    });

    tl.to(orb, {
      x: travel,
      rotate: rollTurns * 360,
      duration: ROLL_DURATION,
      ease: "none",
      transformOrigin: "50% 50%",
      onUpdate: syncWaveFromOrb,
      onComplete: resetLetters,
    });

    tl.to(orb, {
      x: 0,
      rotate: 0,
      duration: ROLL_DURATION,
      ease: "none",
      transformOrigin: "50% 50%",
      onUpdate: syncWaveFromOrb,
      onComplete: resetLetters,
    });

    tl.add(() => {
      rollingRef.current = false;
    });

    tl.to(orb, {
      scale: 1,
      duration: RESTORE_DURATION,
      ease: "power2.inOut",
      transformOrigin: "50% 50%",
      onComplete: resetLetters,
    });
  }, [
    measureLetters,
    resetLetters,
    resetOrb,
    stopTimeline,
    syncWaveFromOrb,
  ]);

  const onEnter = useCallback(() => {
    hoveringRef.current = true;
    playRoll();
  }, [playRoll]);

  const onLeave = useCallback(() => {
    hoveringRef.current = false;
    stopTimeline();
    resetOrb();
  }, [resetOrb, stopTimeline]);

  useGSAP(
    () => {
      if (orbRef.current) {
        gsap.set(orbRef.current, {
          yPercent: -50,
          transformOrigin: "50% 50%",
        });
      }
      return () => {
        hoveringRef.current = false;
        stopTimeline();
        resetOrb();
      };
    },
    { scope: rootRef },
  );

  return (
    <Link
      ref={rootRef}
      href={href}
      className={className}
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-label={BRAND_TEXT}
    >
      <span
        className="relative inline-flex items-center"
        style={{ paddingLeft: TEXT_OFFSET_PX, minHeight: LOGO_HOME_PX }}
      >
        <span
          ref={orbRef}
          className="absolute left-0 top-1/2 z-10 block shrink-0 -translate-y-1/2 will-change-transform"
          style={{ width: LOGO_HOME_PX, height: LOGO_HOME_PX }}
          aria-hidden
        >
          <img
            src="/logos/nav-logo.svg"
            alt=""
            width={LOGO_HOME_PX}
            height={LOGO_HOME_PX}
            className="block size-full"
            draggable={false}
          />
        </span>

        <span
          ref={textRef}
          className="hidden sm:inline text-[14px] leading-none self-center"
          style={{
            fontFamily: "var(--font-hind), sans-serif",
            fontWeight: 500,
            color: "#111111",
            lineHeight: `${LOGO_HOME_PX}px`,
          }}
          aria-hidden
        >
          {chars.map((char, i) => (
            <span
              key={`${char}-${i}`}
              ref={(el) => {
                if (el) letterElsRef.current[i] = el;
              }}
              className="inline-block will-change-transform"
            >
              {char === " " ? "\u00a0" : char}
            </span>
          ))}
        </span>
      </span>
      <span className="sr-only">{BRAND_TEXT}</span>
    </Link>
  );
}
