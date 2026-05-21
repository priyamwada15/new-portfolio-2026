"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

const NAME_LATIN = "Priyamwada";
const NAME_DEVANAGARI = "प्रियंवदा";
const SCRAMBLE_CHARS = `${NAME_LATIN}${NAME_DEVANAGARI}01#*`;
const KALAM_FONT = "var(--font-kalam), cursive";
const HIND_FONT = "var(--font-hind), sans-serif";

type HeroPriyamwadaWordProps = {
  className?: string;
};

export function HeroPriyamwadaWord({ className }: HeroPriyamwadaWordProps) {
  const nameRef = useRef<HTMLSpanElement>(null);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const reducedMotionRef = useRef(false);
  const [isDevanagari, setIsDevanagari] = useState(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useGSAP(
    () => {
      if (nameRef.current) {
        nameRef.current.textContent = NAME_LATIN;
        nameRef.current.style.fontFamily = HIND_FONT;
      }
    },
    { scope: nameRef },
  );

  const scrambleTo = useCallback((text: string) => {
    const el = nameRef.current;
    if (!el) return;

    const toDevanagari = text === NAME_DEVANAGARI;
    activeTweenRef.current?.kill();

    if (reducedMotionRef.current) {
      el.textContent = text;
      el.style.fontFamily = toDevanagari ? KALAM_FONT : HIND_FONT;
      setIsDevanagari(toDevanagari);
      return;
    }

    setIsDevanagari(toDevanagari);
    el.style.fontFamily = toDevanagari ? KALAM_FONT : HIND_FONT;

    activeTweenRef.current = gsap.to(el, {
      duration: 0.55,
      ease: "power2.out",
      scrambleText: {
        text,
        chars: SCRAMBLE_CHARS,
        speed: 0.35,
        revealDelay: 0.1,
      },
    });
  }, []);

  return (
    <span
      ref={nameRef}
      className={cn(
        "inline-flex h-full min-h-[1.3em] items-center cursor-pointer rounded-sm outline-none",
        "leading-[130%] focus-visible:ring-2 focus-visible:ring-[#744577]/35",
        className,
      )}
      role="text"
      aria-label={`${NAME_LATIN} (hover for ${NAME_DEVANAGARI})`}
      onMouseEnter={() => scrambleTo(NAME_DEVANAGARI)}
      onMouseLeave={() => scrambleTo(NAME_LATIN)}
      onFocus={() => scrambleTo(NAME_DEVANAGARI)}
      onBlur={() => scrambleTo(NAME_LATIN)}
      tabIndex={0}
      style={{ fontFamily: isDevanagari ? KALAM_FONT : HIND_FONT }}
    />
  );
}
