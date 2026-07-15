import Link from "next/link";
import TableOfContents, { TocItem } from "./TableOfContents";
import CaseStudyPageStyle from "./CaseStudyPageStyle";
import SectionLabel from "./SectionLabel";
import {
  brands,
  caseStudyBody,
  caseStudyHeadline,
  caseStudyMetaLabel,
  CASE_STUDY_COLUMN_CLASS,
  CASE_STUDY_SECTION_STACK_CLASS,
  CASE_STUDY_TOC_GRID_CLASS,
  fontStyle,
} from "@/design-system";

interface Meta {
  timeline: string;
  /** When set, replaces the default "Shipped" label (e.g. "HANDED OFF"). */
  timelineLabel?: string;
  industry: string;
  role: string;
  team: string;
}

interface NextProject {
  href: string;
  tags: string;
  title: string;
}

interface Logo {
  src: string;
  alt: string;
  cls?: string;
}

interface Props {
  logos: Logo[];
  tagline?: string;
  headline: string;
  projectName: string;
  /** Short label for the breadcrumb (e.g. "Salesforce", "Tars"). Defaults to `projectName`. */
  breadcrumbLabel?: string;
  /** TOC label for the auto-prepended context section (defaults to "Context"). */
  contextLabel?: string;
  context: React.ReactNode;
  contribution?: React.ReactNode;
  sidePanel?: React.ReactNode;
  contextVisual?: React.ReactNode;
  heroVisual?: React.ReactNode;
  reverseHeaderOrder?: boolean;
  hideContextLabel?: boolean;
  headlineInHeader?: boolean;
  contextVisualBelow?: boolean;
  tocStickyTop?: number;
  toc?: TocItem[];
  callout?: React.ReactNode;
  meta: Meta;
  nextProject?: NextProject;
  accentDark?: string;
  accentLight?: string;
  /** Overrides case-study body fill (e.g. match homepage `#FAFAFA`). */
  bodyBackgroundColor?: string;
  /** Classes for context / contribution body copy (default `text-base …`). */
  contentBodyClassName?: string;
  /** Applied to the main sections stack (e.g. `text-[14px]` for body copy). */
  sectionBodyClassName?: string;
  /** When set, overrides the case-study H1 text color (e.g. `#333333`). */
  headlineColor?: string;
  /** Optional classes merged onto the H1 (replaces default responsive size/weight). */
  headlineClassName?: string;
  /** Inline styles merged onto the H1 (e.g. DialKit-driven size/weight). */
  headlineStyle?: React.CSSProperties;
  children: React.ReactNode;
}

const MetaGrid = ({ meta, accentDark }: { meta: Meta; accentDark: string }) => (
  <div className="grid grid-cols-1 min-[400px]:grid-cols-2 min-[1080px]:grid-cols-4 gap-6">
    {[
      { label: meta.timelineLabel ?? "Shipped", value: meta.timeline },
      { label: "Industry", value: meta.industry },
      { label: "Role", value: meta.role },
      { label: "Team", value: meta.team },
    ].map((item) => (
      <div key={item.label}>
        <p className={caseStudyMetaLabel} style={{ color: accentDark }}>
          {item.label}
        </p>
        <p className="text-sm text-ink">{item.value}</p>
      </div>
    ))}
  </div>
);

export default function CaseStudyLayout({
  logos,
  tagline,
  headline,
  projectName,
  breadcrumbLabel,
  contextLabel,
  context,
  contribution,
  sidePanel,
  contextVisual,
  heroVisual,
  reverseHeaderOrder = false,
  hideContextLabel = false,
  headlineInHeader = false,
  contextVisualBelow = false,
  tocStickyTop,
  toc,
  callout,
  meta,
  accentDark = brands.default.accentDark,
  accentLight = brands.default.accentLight,
  bodyBackgroundColor,
  contentBodyClassName,
  sectionBodyClassName,
  headlineColor,
  headlineClassName,
  headlineStyle,
  children,
}: Props) {
  const bodyTextClass = contentBodyClassName ?? caseStudyBody;
  const headlineFontStyle: React.CSSProperties = {
    ...fontStyle.figtree,
    letterSpacing: "-0.02px",
    textWrap: "balance",
  };
  const headlineColorStyle: React.CSSProperties | undefined = headlineColor
    ? { color: headlineColor }
    : undefined;

  const tocItems: TocItem[] = toc
    ? [{ id: "context", label: contextLabel ?? "Context" }, ...toc]
    : [];

  /** H1 in header above hero (Rocket, Salesforce, Debug case studies). */
  const h1InHeaderSection = headlineInHeader || (reverseHeaderOrder && heroVisual);

  // ── logo row ─────────────────────────────────────────────────────────
  const logoRow = (marginBottom: string) => (
    <div className={`flex items-center gap-3 ${marginBottom}`}>
      {logos.map((logo) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          className={`${logo.cls ?? "h-6"} w-auto object-contain`}
        />
      ))}
    </div>
  );

  const h1ClassName = headlineClassName ?? caseStudyHeadline;

  // ── H1 element ────────────────────────────────────────────────────────
  const h1InHeader = (extraClass = "mb-10") => (
    <h1
      className={`${h1ClassName} ${extraClass}`}
      style={{
        ...headlineFontStyle,
        ...headlineColorStyle,
        ...headlineStyle,
        textWrap: "pretty" as React.CSSProperties["textWrap"],
      }}
    >
      {headline}
    </h1>
  );

  // H1 at top of right column (when TOC is present), no margin top, mb for spacing to context
  // Uses text-wrap: pretty (not balance) so the text fills the full column width.
  const h1InColumn = (
    <h1
      className={`${h1ClassName} mb-10`}
      style={{
        ...headlineFontStyle,
        ...headlineColorStyle,
        ...headlineStyle,
        textWrap: "pretty" as React.CSSProperties["textWrap"],
      }}
    >
      {headline}
    </h1>
  );

  // ── context + contribution block ──────────────────────────────────────
  const hasTwoCols = sidePanel !== undefined || contribution !== undefined;
  const contextMarginClass = contextVisualBelow
    ? (contextVisual ? "mb-10" : "mb-[9.5rem]")
    : "mb-40";
  const contextBlock = (
    <div id="context" className={`${hasTwoCols ? "grid md:grid-cols-2 gap-10 md:gap-16" : ""} ${contextMarginClass}`.trim()}>
      {sidePanel !== undefined ? (
        <>
          <div className="flex flex-col gap-8">
            {!hideContextLabel && (
              <section>
                <SectionLabel>Context</SectionLabel>
                <div className={bodyTextClass}>{context}</div>
              </section>
            )}
            {hideContextLabel && (
              <div className={bodyTextClass}>{context}</div>
            )}
            {contribution && (
              <section>
                <SectionLabel>Contribution</SectionLabel>
                <div className={bodyTextClass}>{contribution}</div>
              </section>
            )}
          </div>
          <div>{sidePanel}</div>
        </>
      ) : (
        <>
          <section>
            {!hideContextLabel && <SectionLabel>Context</SectionLabel>}
            <div className={bodyTextClass}>{context}</div>
          </section>
          {contribution && (
            <section>
              <SectionLabel>Contribution</SectionLabel>
              <div className={bodyTextClass}>{contribution}</div>
            </section>
          )}
        </>
      )}
    </div>
  );

  // ── next project footer, removed ────────────────────────────────────
  const nextProjectBlock = null;

  // ── header content ────────────────────────────────────────────────────
  // When toc is provided, H1 moves to the right column, header only has logos + meta.
  // mb-14 = 56px gap between meta and H1.
  const headerContent = toc ? (
    reverseHeaderOrder ? (
      /* logos → H1 → heroVisual → meta */
      <>
        {logoRow("mb-8")}
        {h1InHeaderSection && h1InHeader("rm-header-h1 mb-8")}
        {heroVisual && <div className="rm-header-hero mb-10">{heroVisual}</div>}
        <MetaGrid meta={meta} accentDark={accentDark} />
      </>
    ) : (
      /* Default with TOC: logos → tagline? → meta (H1 goes to right col) */
      <>
        {logoRow("mb-6")}
        {tagline && (
          <p
            className="font-label text-[14px] font-semibold mb-3"
            style={{ color: accentDark }}
          >
            {tagline}
          </p>
        )}
        <MetaGrid meta={meta} accentDark={accentDark} />
      </>
    )
  ) : (
    reverseHeaderOrder ? (
      /* logos → H1 → heroVisual → meta */
      <>
        {logoRow("mb-8")}
        {h1InHeaderSection && h1InHeader("rm-header-h1 mb-8")}
        {heroVisual && <div className="rm-header-hero mb-10">{heroVisual}</div>}
        <MetaGrid meta={meta} accentDark={accentDark} />
      </>
    ) : (
      /* Default without TOC: logos → tagline? → H1 → meta */
      <>
        {logoRow("mb-6")}
        {tagline && (
          <p
            className="font-label text-[14px] font-semibold mb-3"
            style={{ color: accentDark }}
          >
            {tagline}
          </p>
        )}
        {h1InHeader("mb-10")}
        <MetaGrid meta={meta} accentDark={accentDark} />
      </>
    )
  );

  const breadcrumbFontStyle: React.CSSProperties = {
    ...fontStyle.figtree,
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "17px",
    letterSpacing: "-0.02px",
  };

  return (
    <>
    <CaseStudyPageStyle backgroundColor={bodyBackgroundColor} />
    <article
      className={CASE_STUDY_COLUMN_CLASS}
      style={{ "--accent-dark": accentDark, "--accent-light": accentLight } as React.CSSProperties}
    >

      {/* Breadcrumb, mt-12/mb-12 (48px) gap above and below */}
      <div className="mt-12 mb-12 flex flex-row items-center gap-2 py-2 pr-2">
        <Link href="/" className="text-secondary cursor-hover-pointer" style={breadcrumbFontStyle}>
          Home
        </Link>
        <span className="text-secondary" style={breadcrumbFontStyle}>
          /
        </span>
        <span className="text-primary" style={breadcrumbFontStyle}>
          {breadcrumbLabel ?? projectName}
        </span>
      </div>

      {/* Header, mb-14 (56px) creates the gap to H1 when toc is present */}
      <header className={toc ? "mb-14" : "mb-16"}>
        {headerContent}
      </header>

      {/* Body */}
      {toc ? (
        <div className={CASE_STUDY_TOC_GRID_CLASS}>
          {/* Left: sticky TOC, aligns with top of H1 */}
          <TableOfContents
            items={tocItems}
            stickyTop={tocStickyTop}
          />

          {/* Right: H1 (when not in header) → context → body → footer */}
          <div className="min-w-0">
            {!h1InHeaderSection && h1InColumn}
            {contextVisualBelow ? (
              <>
                {contextBlock}
                {contextVisual && <div className="mb-40">{contextVisual}</div>}
              </>
            ) : (
              <>
                {contextVisual && <div className="mb-14">{contextVisual}</div>}
                {contextBlock}
              </>
            )}
            {callout && <div className="mb-40">{callout}</div>}
            <div
              className={[CASE_STUDY_SECTION_STACK_CLASS, sectionBodyClassName]
                .filter(Boolean)
                .join(" ")}
            >
              {children}
            </div>
            {nextProjectBlock}
          </div>
        </div>
      ) : (
        <>
          {contextVisualBelow ? (
            <>
              {contextBlock}
              {contextVisual && <div className="mb-40">{contextVisual}</div>}
            </>
          ) : (
            <>
              {contextVisual && <div className="mb-14">{contextVisual}</div>}
              {contextBlock}
            </>
          )}
          {callout && <div className="mb-40">{callout}</div>}
          <div
            className={[CASE_STUDY_SECTION_STACK_CLASS, sectionBodyClassName]
              .filter(Boolean)
              .join(" ")}
          >
            {children}
          </div>
          {nextProjectBlock}
        </>
      )}
    </article>
    </>
  );
}
