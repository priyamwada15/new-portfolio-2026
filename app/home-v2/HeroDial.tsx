"use client";

import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";
import { useEffect } from "react";

/**
 * Dev-only DialKit panel for the homepage hero. Sets --hero-card-w (the license
 * card's width; its height follows the card's own aspect ratio), --hero-top-gap
 * (space between the nav and the card) and --hero-card-gap (space between the card
 * and the headline), which .hero in CloudsHero.module.css reads. DialRoot hides itself in production.
 */
export function HeroDial() {
  const { cardWidth, gapToNav, gapToHeadline } = useDialKit("Hero", {
    cardWidth: [560, 280, 720, 8],
    gapToNav: [48, 0, 128, 4],
    gapToHeadline: [56, 0, 96, 4],
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--hero-card-w", `${cardWidth}px`);
    root.style.setProperty("--hero-top-gap", `${gapToNav}px`);
    root.style.setProperty("--hero-card-gap", `${gapToHeadline}px`);
    return () => {
      root.style.removeProperty("--hero-card-w");
      root.style.removeProperty("--hero-top-gap");
      root.style.removeProperty("--hero-card-gap");
    };
  }, [cardWidth, gapToNav, gapToHeadline]);

  return <DialRoot position="top-right" />;
}
