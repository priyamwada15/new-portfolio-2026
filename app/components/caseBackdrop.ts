import type { CSSProperties } from "react";

/**
 * Where each case study's backdrop has its olive centre (x, y, in % of the box)
 * and how far its rose reaches (radius, in % of the box), for CaseBackdrop.module.css.
 */
export const CASE_BACKDROPS = {
  rocket: { x: 50, y: 46, reach: 100 },
  asimov: { x: 40, y: 36, reach: 110 },
  debugMode: { x: 60, y: 60, reach: 94 },
} as const;

export type CaseBackdrop = (typeof CASE_BACKDROPS)[keyof typeof CASE_BACKDROPS];

/**
 * The backdrop's custom properties. `screenTall` measures the vertical values
 * against the screen's height instead of the box's, for a box that runs past
 * the bottom of the screen (the case study hero), so the gradient keeps the
 * same shape as on a screen-tall box.
 */
export const backdropStyle = (b: CaseBackdrop, { screenTall = false } = {}) =>
  ({
    "--backdrop-x": `${b.x}%`,
    "--backdrop-y": screenTall ? `calc(${b.y} * 1svh)` : `${b.y}%`,
    "--backdrop-rx": `${b.reach}%`,
    "--backdrop-ry": screenTall ? `calc(${b.reach} * 1svh)` : `${b.reach}%`,
  }) as CSSProperties;
