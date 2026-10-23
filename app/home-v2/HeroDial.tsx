"use client";

import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";
import { useEffect } from "react";

/** Text colour tokens from design-system/tokens/semantic.css (on-dark is left out, it's white on the light page). */
const COLOR_OPTIONS = ["ink", "primary", "secondary", "tertiary", "muted", "faint"].map((name) => ({
  value: `var(--ds-text-${name})`,
  label: name,
}));

/**
 * Dev-only DialKit panel for the homepage hero. Sets --hero-top-gap (space between
 * the nav and the card), --hero-card-gap (space between the card and the headline)
 * and the second headline line's --hero-title-size-2 / --hero-title-color-2, which
 * .hero in CloudsHero.module.css reads. (It can also take --hero-card-w, a fixed
 * card width that replaces the fit to the screen height.) DialRoot hides itself in production.
 */
export function HeroDial() {
  const { gapToNav, gapToHeadline, secondLine } = useDialKit("Hero", {
    gapToNav: [48, 0, 128, 4],
    gapToHeadline: [56, 0, 96, 4],
    secondLine: {
      fontSize: [20, 14, 28, 1],
      color: { type: "select", options: COLOR_OPTIONS, default: "var(--ds-text-tertiary)" },
    },
  });

  useEffect(() => {
    const root = document.documentElement;
    const vars = {
      "--hero-top-gap": `${gapToNav}px`,
      "--hero-card-gap": `${gapToHeadline}px`,
      "--hero-title-size-2": `${secondLine.fontSize}px`,
      "--hero-title-color-2": secondLine.color,
    };
    for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
    return () => {
      for (const name of Object.keys(vars)) root.style.removeProperty(name);
    };
  }, [gapToNav, gapToHeadline, secondLine.fontSize, secondLine.color]);

  return <DialRoot position="top-right" />;
}
