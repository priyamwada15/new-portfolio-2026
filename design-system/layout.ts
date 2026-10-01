import type { CSSProperties } from "react";

/** Layout constants for case study shell and chrome. */

/** Body / surface fill for all case study routes. */
export const CASE_STUDY_PAGE_BG = "var(--ds-surface-case-study)";

/** Nav shell + footer on case study routes (same #FEFEFE surface as the page). */
export const CASE_STUDY_CHROME_BG = "var(--ds-surface-case-study)";

/** Root marketing surface (matches layout body background). */
export const SITE_DEFAULT_PAGE_BG = "var(--ds-surface-page)";

/** Homepage surface. */
export const HOME_V2_PAGE_BG = "var(--ds-surface-home)";

/** Playground page surface. */
export const PLAYGROUND_PAGE_BG = "var(--ds-surface-playground)";

/**
 * Site-wide responsive page-margin ladder: 24px below `tablet` (744px), 48px
 * from `tablet` to `desktop` (1024px), 120px from `desktop` up — the
 * `desktop`+ tier also caps content at 1008px, so margin grows beyond 120px
 * once the viewport is wide enough to hit that ceiling. Any page-width
 * content column should use this rather than a one-off percentage width.
 */
export const RESPONSIVE_CONTENT_WIDTH_CLASS =
  "w-[calc(100%-48px)] min-[744px]:w-[calc(100%-96px)] min-[1024px]:w-[min(calc(100%_-_240px),1008px)] mx-auto" as const;

/** Case study article column width — `RESPONSIVE_CONTENT_WIDTH_CLASS` plus case-study-specific bottom padding. */
export const CASE_STUDY_COLUMN_CLASS = `${RESPONSIVE_CONTENT_WIDTH_CLASS} pb-16` as const;

/** TOC grid at desktop breakpoint. */
export const CASE_STUDY_TOC_GRID_CLASS =
  "grid items-start grid-cols-1 min-[1080px]:grid-cols-[160px_1fr] gap-0 min-[1080px]:gap-[80px]" as const;

/** Vertical rhythm between major case study sections. */
export const CASE_STUDY_SECTION_STACK_CLASS = "case-study-section-stack" as const;

const CASE_STUDY_PREFIXES = [
  "/rocket-mortgage",
  "/salesforce",
  "/tars-debug-mode",
  "/tars-asimov",
] as const;

export function isCaseStudyPath(pathname: string): boolean {
  return CASE_STUDY_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function isRocketMortgagePath(pathname: string): boolean {
  return pathname === "/rocket-mortgage" || pathname.startsWith("/rocket-mortgage/");
}

export function caseStudyUsesSiteDefaultSurface(pathname: string): boolean {
  return (
    pathname === "/tars-debug-mode" ||
    pathname.startsWith("/tars-debug-mode/") ||
    pathname === "/salesforce" ||
    pathname.startsWith("/salesforce/")
  );
}

/** Hero/card videos shared between homepage Work cards and case study page heroes. */
export const SALESFORCE_HERO_VIDEO =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1790270207/acadtrajnew_s2agio.mp4";

/**
 * A screen recording cropped to its app window, dropping the margins baked into the
 * video. Offsets are measured on the full frame and expressed as % of the crop box.
 */
export type CroppedVideo = {
  src: string;
  poster: string;
  /** CSS aspect-ratio of the cropped window */
  frameAspect: string;
  /** CSS aspect-ratio of the full video */
  videoAspect: string;
  left: string;
  top: string;
  width: string;
};

/** Frame (overflow-hidden box) and video styles that show only the cropped window. */
export function croppedVideoStyles(v: CroppedVideo): { frame: CSSProperties; video: CSSProperties } {
  return {
    frame: { position: "relative", aspectRatio: v.frameAspect, overflow: "hidden" },
    video: {
      position: "absolute",
      left: v.left,
      top: v.top,
      width: v.width,
      maxWidth: "none",
      height: "auto",
      aspectRatio: v.videoAspect,
    },
  };
}

/** Knowledge dashboard recording (1894×1012); app window at x 240–1655, y 48–965. */
export const ASIMOV_HERO_VIDEO: CroppedVideo = {
  src: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/KB_Asimov_nrvbu8.mp4",
  poster: "https://res.cloudinary.com/dh9rvf2hh/video/upload/so_0/v1785343890/KB_Asimov_nrvbu8.jpg",
  frameAspect: "1415 / 917",
  videoAspect: "1894 / 1012",
  left: "-16.961%",
  top: "-5.234%",
  width: "133.852%",
};

/** Debug canvas recording (1920×1080); app window at x 167–1760, y 37–1045. */
export const TARS_DEBUG_MODE_HERO_VIDEO: CroppedVideo = {
  src: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1784081146/New_Debug_Video_uscsz1.mp4",
  poster: "https://res.cloudinary.com/dh9rvf2hh/video/upload/so_0/v1784081146/New_Debug_Video_uscsz1.jpg",
  frameAspect: "1593 / 1008",
  videoAspect: "16 / 9",
  left: "-10.483%",
  top: "-3.671%",
  width: "120.527%",
};

export const ROCKET_MORTGAGE_CARD_VIDEOS = [
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295116/RM_Onboarding_new_case_study_and_hero_video_biuj2w.mp4",
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295183/RM_Inspector_new_case_study_and_hero_video_hqwi8n.mp4",
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295274/RM_Escalation_new_case_study_and_hero_video_yrq41o.mp4",
] as const;
