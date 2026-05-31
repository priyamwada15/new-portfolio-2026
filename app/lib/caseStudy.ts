/** Body / surface fill for all case study routes (see CaseStudyPageStyle). */
export const CASE_STUDY_PAGE_BG = "#FDFDFD";

/** Root marketing surface (matches `app/layout.tsx` body background). */
export const SITE_DEFAULT_PAGE_BG = "#FAFAFA";

/** Homepage surface (matches page + body override in AppChrome). */
export const HOME_V2_PAGE_BG = "#FEFEFE";

/** Section H2 on case study pages — 32px, sentence case (do not use `uppercase` or tracking). */
export const CASE_STUDY_H2_CLASS = "font-mono text-[32px] font-bold text-ink";

/** Section tag above H2 (e.g. Problem space) — sentence case. */
export const CASE_STUDY_SECTION_TAG_CLASS =
  "font-mono text-[14px] font-semibold mb-4";

/** Context, contribution, and section body copy on case study pages. */
export const CASE_STUDY_BODY_CLASS = "text-[16px] text-secondary leading-relaxed";

/** Inherited by paragraphs inside `.case-study-section-stack`. */
export const CASE_STUDY_SECTION_BODY_CLASS = "text-[16px]";

/** Hero/card videos shared between homepage Work cards and case study page heroes. */
export const SALESFORCE_HERO_VIDEO =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295117/Salesforce_new_case_study_card_and_hero_fx5vpe.mp4";

export const TARS_DEBUG_MODE_HERO_VIDEO =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295525/Debug_Mode_new_case_study_and_hero_video_kuliwm.mp4";

/** Homepage Rocket Mortgage card — three phones, left → right. */
export const ROCKET_MORTGAGE_CARD_VIDEOS = [
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295116/RM_Onboarding_new_case_study_and_hero_video_biuj2w.mp4",
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295183/RM_Inspector_new_case_study_and_hero_video_hqwi8n.mp4",
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295274/RM_Escalation_new_case_study_and_hero_video_yrq41o.mp4",
] as const;

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

/** Rocket case study uses the same surface + footer treatment as the homepage. */
export function isRocketMortgagePath(pathname: string): boolean {
  return pathname === "/rocket-mortgage" || pathname.startsWith("/rocket-mortgage/");
}

/** Case studies whose body + footer match the site default surface (#FAFAFA). */
export function caseStudyUsesSiteDefaultSurface(pathname: string): boolean {
  return (
    pathname === "/tars-debug-mode" ||
    pathname.startsWith("/tars-debug-mode/") ||
    pathname === "/salesforce" ||
    pathname.startsWith("/salesforce/")
  );
}
