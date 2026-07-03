import type { CSSProperties } from "react";

/** Font role CSS for inline styles. Variables are set in app/layout.tsx. */

export const fontFamily = {
  body: "var(--font-hind), sans-serif",
  label: "var(--font-hind), sans-serif",
  mono: "var(--font-dm-mono), ui-monospace, monospace",
  festive: "var(--font-festive), cursive",
  kalam: "var(--font-kalam), cursive",
} as const;

export const fontStyle = {
  body: { fontFamily: fontFamily.body } satisfies CSSProperties,
  label: { fontFamily: fontFamily.label } satisfies CSSProperties,
  figtree: { fontFamily: fontFamily.body } satisfies CSSProperties,
} as const;
