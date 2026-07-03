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

/** Shared media panel shell (grey fill + large radius). */
export const mediaPanel =
  "bg-surface-media rounded-[24px]" as const;
