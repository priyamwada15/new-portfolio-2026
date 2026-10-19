"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { HeroLicenseCard } from "./HeroLicenseCard";
import { HILLS_W, frontGrassClipPath, ridgeAngle, ridgeY } from "./hillsRidge";
import styles from "./HillsHero.module.css";

const LINES = ["Designing AI and B2B", "products people can follow."] as const;
const HEADLINE = LINES.join(" ");
const FRONT_CLIP = frontGrassClipPath();

/** How far the planted line sinks into the grass, as a fraction of the font size. */
const SINK = 0.1;

/** Clouds: file, on-screen width, height in the sky, resting spot (reduced motion), drift duration and parallax depth. */
const CLOUDS = [
  { src: "/hero/cloud-0.webp", w: 520, top: "34%", rest: "4%", duration: 150, delay: -40, depth: 14 },
  { src: "/hero/cloud-1.webp", w: 460, top: "13%", rest: "64%", duration: 190, delay: -130, depth: 10 },
  { src: "/hero/cloud-2.webp", w: 240, top: "9%", rest: "30%", duration: 230, delay: -60, depth: 6 },
  { src: "/hero/cloud-3.webp", w: 220, top: "42%", rest: "78%", duration: 170, delay: -110, depth: 8 },
] as const;

/**
 * Homepage hero: a dithered solarpunk hillside. The creative license card floats
 * in the sky, clouds drift past, and the headline stands on the meadow ridge with
 * the front grass covering the feet of its letters.
 */
export function HillsHero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Plant the last line on the ridge: each letter is lifted or lowered to the
  // ground under it and tilted to the slope.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const title = titleRef.current;
    if (!stage || !title) return;
    const letters = [...title.querySelectorAll<HTMLElement>("[data-letter]")];

    const plant = () => {
      letters.forEach((l) => (l.style.transform = ""));
      title.style.transform = "";
      const s = stage.getBoundingClientRect();
      const u = s.width / HILLS_W; // CSS px per image px
      const fontPx = parseFloat(getComputedStyle(title).fontSize);
      // The planted line is whichever line the last letter sits on.
      const lastTop = letters[letters.length - 1].offsetTop;
      const planted = letters.filter((l) => Math.abs(l.offsetTop - lastTop) < fontPx * 0.5);
      // Move the whole headline so the planted line's middle letter meets the ridge.
      const mid = planted[Math.floor(planted.length / 2)].getBoundingClientRect();
      const midX = (mid.left + mid.width / 2 - s.left) / u;
      const groundY = s.top + ridgeY(midX) * u + fontPx * SINK;
      title.style.transform = `translateY(${(groundY - mid.bottom).toFixed(2)}px)`;
      // Then fine-tune each planted letter to the curve under it.
      for (const l of planted) {
        const r = l.getBoundingClientRect();
        const x = (r.left + r.width / 2 - s.left) / u;
        const dy = s.top + ridgeY(x) * u + fontPx * SINK - r.bottom;
        l.style.transform = `translateY(${dy.toFixed(2)}px) rotate(${ridgeAngle(x).toFixed(2)}deg)`;
      }
    };

    plant();
    const ro = new ResizeObserver(plant);
    ro.observe(stage);
    ro.observe(title);
    document.fonts?.ready.then(plant);
    return () => ro.disconnect();
  }, []);

  // Clouds lean a little toward the cursor.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
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

      <div className={styles.stage} ref={stageRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/hills.webp" alt="" className={styles.hills} fetchPriority="high" draggable={false} />

        <h1 ref={titleRef} className={styles.title} aria-label={HEADLINE}>
          {LINES.map((line, li) => (
            <span key={line} className={styles.line} aria-hidden="true">
              {line.split(" ").map((word, wi) => (
                <span key={wi}>
                  {wi > 0 ? " " : null}
                  <span className={styles.word}>
                    {[...word].map((ch, ci) => (
                      <span key={ci} data-letter className={styles.letter}>
                        {ch}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
              {li < LINES.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        {/* Front copy of the meadow, cut just under the ridge, so the grass covers the letters' feet. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/hills.webp" alt="" className={styles.front} style={{ clipPath: FRONT_CLIP }} draggable={false} />
      </div>

      <div className={styles.cardSlot}>
        <HeroLicenseCard />
      </div>
    </section>
  );
}
