/** Tailwind class compositions for typography. */

/** Section H2 on case study pages — 32px, sentence case. */
export const caseStudyH2 =
  "font-label text-[32px] font-bold text-ink" as const;

/** Section tag above H2 (e.g. Problem space) — sentence case. */
export const caseStudySectionTag =
  "font-label text-[14px] font-semibold mb-4" as const;

/** Meta grid label in case study header. */
export const caseStudyMetaLabel =
  "font-label text-[14px] font-semibold mb-1" as const;

/** Context, contribution, and section body copy on case study pages. */
export const caseStudyBody =
  "text-[16px] text-secondary leading-relaxed" as const;

/** Inherited by paragraphs inside `.case-study-section-stack`. */
export const caseStudySectionBody = "text-[16px]" as const;

/** Case study H1 default (Figtree). */
export const caseStudyHeadline =
  "text-2xl md:text-[40px] font-normal leading-tight text-ink" as const;

/**
 * Section H2 used on Salesforce & Rocket Mortgage (Figtree medium, not the
 * bold/font-label caseStudyH2 above) — 32px desktop, 24px below 744px.
 */
export const caseStudySectionH2 =
  "text-[32px] font-medium leading-[140%] text-[#333333] max-tablet:text-[24px]" as const;

/*
 * Sept 2026 case study type scale — shared by every case study page.
 * Accent-coloured roles read `--accent-dark`, which CaseStudyLayout sets per brand.
 */

/** Case study H1 — 32px Medium (28px on phones). */
export const caseStudyTitle =
  "font-label text-[32px] font-medium leading-[1.4] text-primary max-md:text-[28px]" as const;

/** Section heading — 24px SemiBold (20px on phones). */
export const caseStudyHeading =
  "font-label text-[24px] font-semibold leading-[1.45] text-primary max-md:text-[20px]" as const;

/** Sub-heading inside a section — 18px Medium (16px on phones). */
export const caseStudySubheading =
  "font-label text-[18px] font-medium leading-[1.45] text-primary max-md:text-[16px]" as const;

/** Eyebrow above a section heading (e.g. "Problem Space"). */
export const caseStudyEyebrow =
  "font-label text-[14px] font-semibold leading-[21px] text-[var(--accent-dark)]" as const;

/** Section body copy — 16px. */
export const caseStudyText =
  "font-label text-[16px] font-normal leading-[1.6] text-secondary" as const;

/** Title above a text + screenshot row — 18px SemiBold (16px on phones). */
export const caseStudyRowTitle =
  "font-label text-[18px] font-semibold leading-[1.6] text-primary max-md:text-[16px]" as const;

/** Small label on a card (e.g. "01", "PRINCIPLE 01"). Colour set by card variant. */
export const caseStudyCardLabel =
  "font-label text-[14px] font-normal leading-[28px]" as const;

/** Main text on a card. Colour set by card variant. 26px line height on phones. */
export const caseStudyCardText =
  "font-label text-[16px] font-medium leading-[28px] max-md:leading-[26px]" as const;

/** Visual caption under media. */
export const visualCaption =
  "font-label text-[12px] font-normal tracking-wider text-muted mt-3 text-center" as const;

/** Iteration / version label above media. */
export const iterationLabel = "text-[12px] font-semibold" as const;

/** Salesforce case study — Figtree body typography. */
export const salesforceH2 =
  "text-[32px] font-bold leading-[48px] text-primary" as const;

export const salesforceH3 =
  "text-[24px] font-bold leading-[140%] text-primary" as const;

export const salesforceBody =
  "text-[16px] font-normal leading-[160%] text-primary" as const;

/** Shared media panel shell (#FAFAFA fill, 1px border, 24px radius). */
export const mediaPanel =
  "border border-border bg-surface-page rounded-[var(--ds-radius-container)]" as const;
