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

/*
 * Sept 2026 case study type scale — shared by every case study page.
 * Accent-coloured roles read `--accent-dark`, which CaseStudyLayout sets per page;
 * every case study passes the shared rose (--ds-case-study-accent).
 *
 * Tuned in Nov 2026 (see /design-lab): Figtree at weight 500 for anything that
 * leads, tight tracking that grows with the size (-0.025em at 24px and up,
 * -0.02em at 18px, -0.01em below), near-black headings over a lighter body grey,
 * and one quiet 16px label in place of the old 12px uppercase tags.
 */

/** Case study H1 — 32px Medium (28px on phones). */
export const caseStudyTitle =
  "font-label text-[32px] font-medium leading-[1.4] tracking-[-0.025em] text-primary max-md:text-[28px]" as const;

/** Section heading — 24px Medium (20px on phones). */
export const caseStudyHeading =
  "font-label text-[24px] font-medium leading-[1.35] tracking-[-0.025em] text-primary max-md:text-[20px]" as const;

/** Sub-heading inside a section — 18px Medium (16px on phones). */
export const caseStudySubheading =
  "font-label text-[18px] font-medium leading-[1.45] tracking-[-0.02em] text-primary max-md:text-[16px]" as const;

/** Eyebrow above a section heading (e.g. "Problem space"): a quiet 16px label in the meta grey. */
export const caseStudyEyebrow =
  "font-label text-[16px] font-normal leading-[24px] tracking-[-0.01em] text-tertiary" as const;

/**
 * Section tag above a section or release heading (e.g. "Problem space"): the same quiet 16px label as the
 * eyebrow, in sentence case. The meta row labels match it. The name is kept from when these were 12px caps.
 */
export const caseStudySectionTagCaps =
  "font-label text-[16px] font-normal leading-[24px] tracking-[-0.01em] text-tertiary" as const;

/** Section body copy — 16px. */
export const caseStudyText =
  "font-label text-[16px] font-normal leading-[1.6] tracking-[-0.01em] text-secondary" as const;

/** Title above a text + screenshot row — 18px Medium (16px on phones). */
export const caseStudyRowTitle =
  "font-label text-[18px] font-medium leading-[1.6] tracking-[-0.02em] text-primary max-md:text-[16px]" as const;

/** Small label on a card (e.g. "01", "PRINCIPLE 01"). Colour set by card variant. */
export const caseStudyCardLabel =
  "font-label text-[14px] font-normal leading-[28px] tracking-[-0.01em]" as const;

/** Main text on a card. Colour set by card variant. 26px line height on phones. */
export const caseStudyCardText =
  "font-label text-[16px] font-medium leading-[28px] tracking-[-0.01em] max-md:leading-[26px]" as const;

/** Big impact number (e.g. "92%"), shared by every case study's stats. 28px on phones. */
export const caseStudyStatNumber =
  "font-label text-[32px] font-medium leading-none tracking-[-0.03em] text-ink max-md:text-[28px]" as const;

/** Title on a visual asset (e.g. "Knowledge dashboard", "Early direction") — 14px Medium, neutral, the same in every case study. */
export const caseStudyVisualTitle =
  "font-label text-[14px] font-medium leading-[22.4px] tracking-[-0.01em] text-primary" as const;

/** Visual caption under media. */
export const visualCaption =
  "font-label text-[14px] font-normal leading-[22px] tracking-[-0.01em] text-tertiary mt-3 text-center" as const;

/** Iteration / version label above media. */
export const iterationLabel = "text-[12px] font-semibold" as const;

/** Shared media panel shell (#FAFAFA fill, 1px border, 16px radius from the container token). */
export const mediaPanel =
  "border border-border bg-surface-page rounded-[var(--ds-radius-container)]" as const;
