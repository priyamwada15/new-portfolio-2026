"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { HeroLicenseCard } from "./HeroLicenseCard";
import styles from "./CloudsHero.module.css";

/** Clouds are hidden for now; set to true to bring them back. */
const SHOW_CLOUDS = false;

/** Clouds: file, on-screen width, height in the hero (kept above the headline), resting spot (reduced motion), drift duration and parallax depth. */
const CLOUDS = [
  { src: "/hero/cloud-0.webp", w: 520, top: "30%", rest: "2%", duration: 150, delay: -40, depth: 14 },
  { src: "/hero/cloud-1.webp", w: 460, top: "12%", rest: "66%", duration: 190, delay: -130, depth: 10 },
  { src: "/hero/cloud-2.webp", w: 240, top: "8%", rest: "18%", duration: 230, delay: -60, depth: 6 },
  { src: "/hero/cloud-3.webp", w: 220, top: "44%", rest: "80%", duration: 170, delay: -110, depth: 8 },
] as const;

/** Headline, one array per set line; each word rises in on load, in order. */
const TITLE_LINES = [
  ["Designing", "AI", "and", "B2B"],
  ["products", "people", "can", "follow."],
];

/**
 * Homepage hero: the creative license card floating in the middle with the
 * headline under it, and dithered clouds drifting slowly behind both.
 */
export function CloudsHero() {
  const heroRef = useRef<HTMLElement>(null);

  // Clouds lean a little toward the cursor.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !SHOW_CLOUDS) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const onMove = (e: PointerEvent) => {
      hero.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      hero.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-label="Introduction">
      {SHOW_CLOUDS && (
      <div className={styles.clouds} aria-hidden="true">
        {CLOUDS.map((c) => (
          <div
            key={c.src}
            className={styles.cloudDrift}
            style={{ top: c.top, "--rest-x": c.rest, "--cloud-w": `${c.w}px`, animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.src} alt="" className={styles.cloud} style={{ "--depth": c.depth } as CSSProperties} draggable={false} />
          </div>
        ))}
      </div>
      )}

      <div className={styles.card}>
        <HeroLicenseCard />
      </div>
      <h1 className={styles.title}>
        {TITLE_LINES.map((line, l) => (
          <Fragment key={l}>
            {l > 0 && " "}
            <span className={styles.line}>
              {line.map((word, w) => (
                <Fragment key={word}>
                  {w > 0 && " "}
                  <span className={styles.word} style={{ "--i": TITLE_LINES[0].length * l + w } as CSSProperties}>
                    {word}
                  </span>
                </Fragment>
              ))}
            </span>
          </Fragment>
        ))}
      </h1>
    </section>
  );
}
