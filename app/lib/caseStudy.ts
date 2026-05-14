/** Body / surface fill for all case study routes (see CaseStudyPageStyle). */
export const CASE_STUDY_PAGE_BG = "#FDFDFD";

/** Root marketing surface (matches `app/layout.tsx` body background). */
export const SITE_DEFAULT_PAGE_BG = "#ECEAE6";

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

/** Case studies whose body + footer match the homepage (#ECEAE6). */
export function caseStudyUsesSiteDefaultSurface(pathname: string): boolean {
  return (
    isRocketMortgagePath(pathname) ||
    pathname === "/tars-debug-mode" ||
    pathname.startsWith("/tars-debug-mode/")
  );
}
