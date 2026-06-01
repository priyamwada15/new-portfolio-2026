import type { CSSProperties } from "react";
import { fontStyle } from "./fonts";

/** Desktop homepage (/) absolute-layout spacing — see app/page.tsx. */
export const HOME_V2_TOP_PX = 92;
export const HOME_V2_RM_CARD_H_PX = 637;
export const HOME_V2_ROW_GAP_PX = 56;
export const HOME_V2_ROW_H_PX = 450;
export const HOME_V2_CENTRAL_BLOCK_H_PX = 956;
export const HOME_V2_ROW2_H_PX = 450;
export const HOME_V2_FOOTER_SAFE_SPACE_PX = 96;
export const HOME_V2_SNIPPETS_GAP_PX = 64;
export const HOME_V2_SNIPPETS_H_PX = 577;

export const HOME_V2_SECOND_ROW_TOP_PX =
  HOME_V2_TOP_PX + HOME_V2_RM_CARD_H_PX + HOME_V2_ROW_GAP_PX;
export const HOME_V2_CENTRAL_BLOCK_TOP_PX =
  HOME_V2_SECOND_ROW_TOP_PX + HOME_V2_ROW_H_PX + HOME_V2_ROW_GAP_PX;
export const HOME_V2_ROW2_TOP_PX =
  HOME_V2_CENTRAL_BLOCK_TOP_PX + HOME_V2_CENTRAL_BLOCK_H_PX + HOME_V2_ROW_GAP_PX;
export const HOME_V2_SNIPPETS_TOP_PX =
  HOME_V2_ROW2_TOP_PX + HOME_V2_ROW2_H_PX + HOME_V2_SNIPPETS_GAP_PX;

/** Work / play card shell on the homepage. */
export const homeCardShellStyle = {
  background: "var(--ds-surface-page)",
  borderRadius: "24px",
  overflow: "hidden",
} satisfies CSSProperties;

/** Video placeholder fill inside cards. */
export const homeCardMediaBgStyle = {
  backgroundColor: "var(--ds-surface-page)",
} satisfies CSSProperties;

/** Intro paragraph column. */
export const homeIntroCopyStyle = {
  ...fontStyle.body,
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "160%",
  color: "var(--ds-text-secondary)",
} satisfies CSSProperties;

/** Snippet column labels (Reading, Listening, …). */
export const homeSnippetLabelStyle = {
  ...fontStyle.body,
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "130%",
  color: "var(--ds-text-secondary)",
  display: "flex",
  alignItems: "flex-end",
  gap: "8px",
  marginBottom: "16px",
} satisfies CSSProperties;

/** Snippet emphasis line (e.g. track title). */
export const homeSnippetEmphasisStyle = {
  ...fontStyle.body,
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "130%",
  color: "var(--ds-text-primary)",
} satisfies CSSProperties;

/** Learning tool chip background. */
export const homeSnippetChipStyle = {
  width: "24px",
  height: "24px",
  background: "var(--ds-surface-chip)",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} satisfies CSSProperties;

export const homeSnippetToolLabelStyle = {
  ...fontStyle.body,
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "130%",
  color: "var(--ds-text-secondary)",
} satisfies CSSProperties;

/** Card footer base font. */
export const homeCardFooterFont = {
  ...fontStyle.body,
  fontWeight: 400,
} satisfies CSSProperties;

/** Card footer title line. */
export const homeCardFooterTitleStyle = {
  fontSize: "14px",
  lineHeight: "140%",
  display: "flex",
  alignItems: "flex-end",
  color: "var(--ds-text-secondary)",
} satisfies CSSProperties;

/** Card footer tag row. */
export const homeCardFooterTagsStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  lineHeight: "140%",
  color: "var(--ds-text-faint)",
} satisfies CSSProperties;

/** Work tab card description under meta tags. */
export const homeWorkCardDescriptionClass =
  "w-full cursor-default text-sm font-normal leading-[150%] text-primary md:text-base" as const;

/** Work tab uppercase meta tag row (10px). */
export const homeWorkMetaTagStyle = {
  ...fontStyle.body,
  color: "var(--ds-text-secondary)",
  fontSize: "10px",
  lineHeight: "12px",
} satisfies CSSProperties;

/** Play tab text link label. */
export const homePlayLinkLabelClass =
  "font-medium text-[14px] leading-[17px] text-primary" as const;

/** Play tab hover underline. */
export const homePlayLinkUnderlineClass =
  "h-px w-full scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-100" as const;

/** Frosted control shell (nav arrows, strip controls). Matches Nav.tsx. */
export const homeFrostedControlShellStyle = {
  background: "rgba(255, 255, 255, 0.62)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.72)",
  boxShadow:
    "0 8px 28px -6px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
} satisfies CSSProperties;

/** Strip nav arrow button classes. */
export const homeStripNavButtonClass =
  "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full text-primary transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none" as const;

export const homeStripNavButtonStateClass =
  "scale-90 opacity-0 group-hover/strip:scale-100 group-hover/strip:opacity-100 motion-reduce:scale-100 motion-reduce:opacity-100 focus-visible:scale-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nav-glow/40" as const;

/** Tailwind classes for homepage hero headline (home-v2 route). */
export const homeHeroHeadlineClass =
  "hero-headline flex w-full max-w-[1008px] flex-wrap items-center gap-x-[0.35em] gap-y-[18px] text-[24px] font-normal leading-[130%] text-primary md:text-[32px]" as const;
