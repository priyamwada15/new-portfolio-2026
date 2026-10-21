import type { CSSProperties } from "react";
import { fontStyle } from "./fonts";

/** Desktop homepage (/) layout spacing — see app/page.tsx. */
export const HOME_V2_ROW_GAP_PX = 56;

/** Widget bento tile eyebrow label (Floor Plan Version, Listening, Reading, Creative License). */
export const homeBentoTileLabelStyle = {
  ...fontStyle.body,
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "17px",
  color: "var(--ds-text-faint)",
} satisfies CSSProperties;
