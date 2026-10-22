"use client";

import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";
import { useEffect } from "react";

/**
 * Dev-only DialKit panel for trying shades on the homepage case study cards.
 * Sets --home-card-fill / --home-card-stroke, which .cardMedia in home.module.css
 * reads (falling back to the design tokens). DialRoot hides itself in production.
 */
export function CardFillDial() {
  const dial = useDialKit("Case study cards", {
    fill: "#f7f7f7",
    stroke: "#f2f2f2",
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--home-card-fill", dial.fill);
    root.style.setProperty("--home-card-stroke", dial.stroke);
    return () => {
      root.style.removeProperty("--home-card-fill");
      root.style.removeProperty("--home-card-stroke");
    };
  }, [dial.fill, dial.stroke]);

  return <DialRoot position="top-right" />;
}
