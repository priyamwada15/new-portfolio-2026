"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASE = "/debug-mode-bento-scrub-scroll/";

const SIDE_CELLS = [
  { cls: "bento-item--a", src: `${BASE}Frame 1707481427.png`, alt: "Canvas with debug mode active", objectPosition: "top center" },
  { cls: "bento-item--b", src: `${BASE}Frame 1707481428.png`, alt: "Split view: canvas and chatbot panel", objectPosition: "top right" },
  { cls: "bento-item--e", src: `${BASE}Frame 1707481430.png`, alt: "Debug chatbot panel close-up", objectPosition: "center" },
  { cls: "bento-item--c", src: `${BASE}Frame 1707481429.png`, alt: "Active gambit close-up", objectPosition: "center" },
  { cls: "bento-item--d", src: `${BASE}Frame 1707481432.png`, alt: "Error caught: Rewards Card gambit", objectPosition: "top center" },
];

export function BentoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const wrapperEl = wrapperRef.current!;
    const galleryEl = galleryRef.current!;

    const setup = () => {
      tlRef.current?.scrollTrigger?.kill();
      tlRef.current?.kill();

      // Clear any previous transforms so measurements are from real layout
      gsap.set(galleryEl, { clearProps: "all" });

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const galleryRect = galleryEl.getBoundingClientRect();
      const heroCell = galleryEl.querySelector<HTMLElement>(".bento-item--hero")!;
      const heroRect = heroCell.getBoundingClientRect();

      // Hero center in the gallery's own coordinate space — this becomes the scale anchor
      const originX = heroRect.left - galleryRect.left + heroRect.width / 2;
      const originY = heroRect.top - galleryRect.top + heroRect.height / 2;

      // Scale needed for the hero cell to fill the viewport
      const heroScale = Math.max(vw / heroRect.width, vh / heroRect.height);

      // With transform-origin at hero center, the hero's viewport position stays fixed
      // at its natural center (~vh/4 for row-1). Translate the gallery so the hero
      // arrives at viewport center at full scale.
      const heroCenterY = heroRect.top + heroRect.height / 2;
      const heroTranslateY = vh / 2 - heroCenterY;

      gsap.set(galleryEl, { transformOrigin: `${originX}px ${originY}px`, willChange: "transform" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperEl,
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: true,
        },
      });

      // Scale the gallery as a single unit — gaps and proportions fully preserved.
      // y-translation centers the hero in the viewport at full scale.
      tl.to(galleryEl, { scale: heroScale, y: heroTranslateY, ease: "none" }, 0);

      // Individual image zoom within each cell (layered on top of the gallery scale)
      const imgs = Array.from(galleryEl.querySelectorAll<HTMLElement>("img"));
      tl.to(imgs, { scale: 1.1, ease: "none" }, 0);

      tlRef.current = tl;
    };

    const frameId = requestAnimationFrame(setup);
    window.addEventListener("resize", setup);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", setup);
      tlRef.current?.scrollTrigger?.kill();
      tlRef.current?.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="bento-wrap">
      <div ref={galleryRef} className="bento-gallery">
        {SIDE_CELLS.map((cell) => (
          <div key={cell.cls} className={`bento-item ${cell.cls}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cell.src}
              alt={cell.alt}
              style={{ objectPosition: cell.objectPosition }}
            />
          </div>
        ))}
        <div className="bento-item bento-item--hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Debug%20Hero%20Image.png"
            alt="Debug Mode — Tars canvas with active gambit highlighted"
          />
        </div>
      </div>
    </div>
  );
}
