/** CSS custom property references for inline / runtime styles. */

export const surfaces = {
  default: "var(--ds-surface-default)",
  caseStudy: "var(--ds-surface-case-study)",
  page: "var(--ds-surface-page)",
  home: "var(--ds-surface-home)",
  card: "var(--ds-surface-card)",
  media: "var(--ds-surface-media)",
} as const;

export type SurfaceToken = (typeof surfaces)[keyof typeof surfaces];
