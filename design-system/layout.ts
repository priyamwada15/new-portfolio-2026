/** Layout constants for case study shell and chrome. */

/** Body / surface fill for all case study routes. */
export const CASE_STUDY_PAGE_BG = "var(--ds-surface-case-study)";

/** Nav shell + footer on case study routes (#FAFAFA). */
export const CASE_STUDY_CHROME_BG = "var(--ds-color-surface-page)";

/** Root marketing surface (matches layout body background). */
export const SITE_DEFAULT_PAGE_BG = "var(--ds-surface-page)";

/** Homepage surface. */
export const HOME_V2_PAGE_BG = "var(--ds-surface-home)";

/** Case study article column width. */
export const CASE_STUDY_COLUMN_CLASS =
  "w-[70vw] max-w-[1008px] mx-auto pb-16" as const;

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
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295117/Salesforce_new_case_study_card_and_hero_fx5vpe.mp4";

export const TARS_DEBUG_MODE_HERO_VIDEO =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295525/Debug_Mode_new_case_study_and_hero_video_kuliwm.mp4";

export const ROCKET_MORTGAGE_CARD_VIDEOS = [
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295116/RM_Onboarding_new_case_study_and_hero_video_biuj2w.mp4",
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295183/RM_Inspector_new_case_study_and_hero_video_hqwi8n.mp4",
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295274/RM_Escalation_new_case_study_and_hero_video_yrq41o.mp4",
] as const;
