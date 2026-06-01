import type { CSSProperties } from "react";

/** Font role CSS for inline styles. Variables are set in app/layout.tsx. */

export const fontFamily = {
  body: "var(--font-hind), sans-serif",
  label: "var(--font-hind), sans-serif",
  display: "var(--font-ovo), serif",
  mono: "var(--font-dm-mono), ui-monospace, monospace",
  festive: "var(--font-festive), cursive",
  kalam: "var(--font-kalam), cursive",
} as const;

export const fontStyle = {
  body: { fontFamily: fontFamily.body } satisfies CSSProperties,
  label: { fontFamily: fontFamily.label } satisfies CSSProperties,
  display: { fontFamily: fontFamily.display } satisfies CSSProperties,
  figtree: { fontFamily: fontFamily.body } satisfies CSSProperties,
  ovo: { fontFamily: fontFamily.display } satisfies CSSProperties,
} as const;
