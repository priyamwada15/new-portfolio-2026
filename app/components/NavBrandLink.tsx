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
const TEXT_OFFSET_PX = LOGO_HOME_PX + GAP_PX;
/** Letters within this distance of the orb's center lift fully, clearing the ball */
const WAVE_PLATEAU_PX = 9;
/** Beyond the plateau, the lift eases back to 0 over this distance */
const WAVE_FALLOFF_PX = 16;
const WAVE_LIFT_PX = -14;
const SHRINK_DURATION = 0.3;
/** One leg of the roll (there, or back) across the full name */
const ROLL_DURATION = 1.3;
const RESTORE_DURATION = 0.35;
/** Gliding home after the pointer leaves mid-roll, scaled by how far it has to go */
const RETURN_MIN_DURATION = 0.25;
const RETURN_MAX_DURATION = 0.6;

type NavBrandLinkProps = {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  /** Overrides the default #111111 text color — used on dark-background pages. */
  textColor?: string;
  /** Overrides the default /logos/nav-logo.svg mark — used on dark-background pages. */
  logoSrc?: string;
  /** Color of the logo's circle, shown while its glyph fades out during the roll. */
  logoDiscColor?: string;
};

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return [...segmenter.segment(text)].map((s) => s.segment);
  }
  return [...text];
}

/** Flat-topped bump: full lift over the ball, then a cosine ease back to 0 */
function waveLift(dist: number): number {
  const abs = Math.abs(dist);
  if (abs <= WAVE_PLATEAU_PX) return WAVE_LIFT_PX;
  const t = (abs - WAVE_PLATEAU_PX) / WAVE_FALLOFF_PX;
  if (t >= 1) return 0;
  return WAVE_LIFT_PX * 0.5 * (1 + Math.cos(Math.PI * t));
}

/**
 * Hovering the wordmark shrinks the logo into a ball that rolls along the name
 * and back, lifting each letter clear as it passes, then grows home. The glyph
 * fades while it rolls, leaving a plain disc. Its rotation is
 * derived from its position so it always rolls without sliding, and leaving
 * mid-roll glides it home instead of snapping.
 */
export function NavBrandLink({
  href,
  className,
  style,
  textColor,
  logoSrc,
  logoDiscColor = "var(--ds-nav-logo-disc)",
}: NavBrandLinkProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const orbRef = useRef<HTMLSpanElement>(null);
  const glyphRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const letterElsRef = useRef<HTMLSpanElement[]>([]);
  /** Letter centers, measured from the orb's home center */
  const letterCentersRef = useRef<number[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotionRef = useRef(false);
  const [chars] = useState(() => splitGraphemes(BRAND_TEXT));

  const measureLetters = useCallback(() => {
    const letters = letterElsRef.current.filter(Boolean);
    if (!textRef.current || letters.length === 0) return;
    // Offsets are within the padded wrapper (so they include TEXT_OFFSET_PX) and
    // ignore the letters' own lift. The orb's home center is LOGO_HOME_PX / 2.
    letterCentersRef.current = letters.map(
      (el) => el.offsetLeft + el.offsetWidth / 2 - LOGO_HOME_PX / 2,
    );
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

  /** Rolls the orb to `x` (its offset from home), turning it to match, and lifts the letters it's over. */
  const placeOrb = useCallback((x: number) => {
    const orb = orbRef.current;
    if (!orb) return;
    gsap.set(orb, { x, rotate: (x / (Math.PI * LOGO_ROLL_PX)) * 360 });
    const centers = letterCentersRef.current;
    letterElsRef.current.forEach((el, i) => {
      if (el && centers[i] !== undefined) gsap.set(el, { y: waveLift(centers[i] - x) });
    });
  }, []);

  const stopTimeline = useCallback(() => {
    timelineRef.current?.kill();
    timelineRef.current = null;
  }, []);

  /** Tweens a proxy for the orb's x so the roll and letter wave stay in sync. */
  const rollTo = useCallback(
    (tl: gsap.core.Timeline, from: { x: number }, to: number, duration: number, ease: string) => {
      tl.to(from, { x: to, duration, ease, onUpdate: () => placeOrb(from.x) });
    },
    [placeOrb],
  );

  const playRoll = useCallback(() => {
    const orb = orbRef.current;
    if (!orb || reducedMotionRef.current) return;

    measureLetters();
    const centers = letterCentersRef.current;
    const end = centers[centers.length - 1];
    if (!end || end <= 0) return;

    stopTimeline();
    // Pick up from wherever the orb is, e.g. re-entering while it glides home
    const pos = { x: (gsap.getProperty(orb, "x") as number) || 0 };
    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.to(orb, { scale: LOGO_ROLL_SCALE, duration: SHRINK_DURATION, ease: "power2.inOut" });
    tl.to(glyphRef.current, { opacity: 0, duration: SHRINK_DURATION, ease: "power1.out" }, "<");
    rollTo(tl, pos, end, ROLL_DURATION * (1 - pos.x / end), "sine.inOut");
    rollTo(tl, pos, 0, ROLL_DURATION, "sine.inOut");
    tl.to(orb, { scale: 1, duration: RESTORE_DURATION, ease: "power2.inOut" });
    tl.to(glyphRef.current, { opacity: 1, duration: RESTORE_DURATION, ease: "power1.in" }, "<");
  }, [measureLetters, rollTo, stopTimeline]);

  const glideHome = useCallback(() => {
    const orb = orbRef.current;
    if (!orb) return;
    stopTimeline();
    const pos = { x: (gsap.getProperty(orb, "x") as number) || 0 };
    const end = letterCentersRef.current[letterCentersRef.current.length - 1] || 1;
    const tl = gsap.timeline();
    timelineRef.current = tl;
    if (pos.x > 0) {
      const duration = Math.max(RETURN_MIN_DURATION, RETURN_MAX_DURATION * (pos.x / end));
      rollTo(tl, pos, 0, duration, "power2.inOut");
    }
    tl.to(orb, { scale: 1, duration: RESTORE_DURATION, ease: "power2.inOut" });
    tl.to(glyphRef.current, { opacity: 1, duration: RESTORE_DURATION, ease: "power1.in" }, "<");
  }, [rollTo, stopTimeline]);

  useGSAP(
    () => {
      if (orbRef.current) {
        gsap.set(orbRef.current, {
          yPercent: -50,
          transformOrigin: "50% 50%",
        });
      }
      return () => {
        stopTimeline();
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
      onMouseEnter={playRoll}
      onMouseLeave={glideHome}
      onFocus={playRoll}
      onBlur={glideHome}
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
          {/* Plain disc behind the logo, left showing while the glyph fades out */}
          <span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: logoDiscColor }}
          />
          <img
            ref={glyphRef}
            src={logoSrc ?? "/logos/nav-logo.svg"}
            alt=""
            width={LOGO_HOME_PX}
            height={LOGO_HOME_PX}
            className="relative block size-full"
            draggable={false}
          />
        </span>

        <span
          ref={textRef}
          className="hidden sm:inline text-[14px] leading-none self-center"
          style={{
            fontFamily: "var(--font-hind), sans-serif",
            fontWeight: 500,
            color: textColor ?? "#111111",
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
