import type { CSSProperties } from "react";

/** Where each case study's backdrop has its olive centre and how far its rose reaches (CaseBackdrop.module.css). */
export const CASE_BACKDROPS = {
  rocket: { at: "50% 46%", reach: "100%" },
  asimov: { at: "40% 36%", reach: "110%" },
  debugMode: { at: "60% 60%", reach: "94%" },
} as const;

export type CaseBackdrop = (typeof CASE_BACKDROPS)[keyof typeof CASE_BACKDROPS];

export const backdropStyle = (b: CaseBackdrop) =>
  ({ "--backdrop-at": b.at, "--backdrop-reach": b.reach }) as CSSProperties;
