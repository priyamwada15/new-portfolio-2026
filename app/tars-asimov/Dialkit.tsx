"use client";

// Temporary dev tool for testing heading fonts on the Asimov case study page,
// built on the `dialkit` npm package (https://joshpuckett.me/dialkit).
// Remove this file, its <Dialkit /> usage in page.tsx, the data-dialkit
// attributes in CaseStudyLayout.tsx/page.tsx, the `dialkit`/`motion`
// dependencies, and the test fonts in layout.tsx (Ovo, Young Serif, Frank
// Ruhl Libre, Forum, Sree Krushnadevaraya) once font decisions are locked in.

import { useEffect } from "react";
import { DialRoot, DialStore, useDialKit } from "dialkit";
import "dialkit/styles.css";

const FONT_LABELS = [
  "Figtree",
  "Ovo",
  "Young Serif",
  "Frank Ruhl Libre",
  "Forum",
  "Sree Krushnadevaraya",
] as const;

type FontLabel = (typeof FONT_LABELS)[number];

const FONT_FAMILY_VALUE: Record<FontLabel, string> = {
  Figtree: "var(--font-hind)",
  Ovo: "var(--font-ovo)",
  "Young Serif": "var(--font-young-serif)",
  "Frank Ruhl Libre": "var(--font-frank-ruhl-libre)",
  Forum: "var(--font-forum)",
  "Sree Krushnadevaraya": "var(--font-sree-krushnadevaraya)",
};

const PRIMARY = "#333333";

type Target = "h1" | "h2" | "h3";

type Resolved = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
};

function applyStyle(target: Target, p: Resolved) {
  const family = FONT_FAMILY_VALUE[p.fontFamily as FontLabel] ?? FONT_FAMILY_VALUE.Figtree;
  document.querySelectorAll<HTMLElement>(`[data-dialkit="${target}"]`).forEach((el) => {
    el.style.setProperty("font-family", family);
    el.style.setProperty("font-weight", String(p.fontWeight));
    el.style.setProperty("font-size", `${p.fontSize}px`);
    el.style.setProperty("line-height", `${p.lineHeight}%`);
    el.style.setProperty("letter-spacing", `${p.letterSpacing}px`);
    el.style.setProperty("color", p.color);
  });
}

function headingConfig(fontSize: number, letterSpacing: number) {
  return {
    fontFamily: { type: "select" as const, options: [...FONT_LABELS], default: "Figtree" },
    fontWeight: [500, 100, 900, 100] as [number, number, number, number],
    fontSize: [fontSize, 12, 64] as [number, number, number],
    lineHeight: [140, 100, 200] as [number, number, number],
    letterSpacing: [letterSpacing, -2, 4, 0.1] as [number, number, number, number],
    color: { type: "color" as const, default: PRIMARY },
    reset: { type: "action" as const, label: "Reset to defaults" },
  };
}

// Asimov's accent color (accentDark="#6D33AA" in page.tsx) — the eyebrow
// label's actual current default, unlike the headings which default to
// the design system's primary text color.
const EYEBROW_ACCENT = "#6D33AA";

function eyebrowConfig() {
  return {
    fontWeight: [600, 100, 900, 100] as [number, number, number, number],
    color: { type: "color" as const, default: EYEBROW_ACCENT },
    reset: { type: "action" as const, label: "Reset to defaults" },
  };
}

function applyEyebrowStyle(p: { fontWeight: number; color: string }) {
  document.querySelectorAll<HTMLElement>('[data-dialkit="eyebrow"]').forEach((el) => {
    el.style.setProperty("font-weight", String(p.fontWeight));
    el.style.setProperty("color", p.color);
  });
}

const H1_ID = "asimov-dialkit-h1";
const H2_ID = "asimov-dialkit-h2";
const H3_ID = "asimov-dialkit-h3";
const EYEBROW_ID = "asimov-dialkit-eyebrow";

function DialkitPanels() {
  const h1 = useDialKit("H1 — Case study heading", headingConfig(36, -0.02), {
    id: H1_ID,
    onAction: (action) => action === "reset" && DialStore.resetValues(H1_ID),
  });
  const h2 = useDialKit("H2 — Section headings", headingConfig(32, 0), {
    id: H2_ID,
    onAction: (action) => action === "reset" && DialStore.resetValues(H2_ID),
  });
  const h3 = useDialKit("H3 — Sub-headings", headingConfig(20, 0), {
    id: H3_ID,
    onAction: (action) => action === "reset" && DialStore.resetValues(H3_ID),
  });
  const eyebrow = useDialKit("Eyebrow — Section label", eyebrowConfig(), {
    id: EYEBROW_ID,
    onAction: (action) => action === "reset" && DialStore.resetValues(EYEBROW_ID),
  });

  useEffect(() => {
    applyStyle("h1", h1);
  }, [h1.fontFamily, h1.fontWeight, h1.fontSize, h1.lineHeight, h1.letterSpacing, h1.color]);

  useEffect(() => {
    applyStyle("h2", h2);
  }, [h2.fontFamily, h2.fontWeight, h2.fontSize, h2.lineHeight, h2.letterSpacing, h2.color]);

  useEffect(() => {
    applyStyle("h3", h3);
  }, [h3.fontFamily, h3.fontWeight, h3.fontSize, h3.lineHeight, h3.letterSpacing, h3.color]);

  useEffect(() => {
    applyEyebrowStyle(eyebrow);
  }, [eyebrow.fontWeight, eyebrow.color]);

  return <DialRoot position="bottom-right" theme="dark" />;
}

export default function Dialkit() {
  if (process.env.NODE_ENV === "production") return null;
  return <DialkitPanels />;
}
