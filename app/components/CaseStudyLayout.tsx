import Link from "next/link";
import TableOfContents, { TocItem } from "./TableOfContents";
import CaseStudyPageStyle from "./CaseStudyPageStyle";

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
  /** Overrides case-study body fill (e.g. match homepage `#ECEAE6`). */
  bodyBackgroundColor?: string;
  /** Case-study headline (H1) font; default matches other case studies. */
  headlineFont?: "ovo" | "figtree";
  /** Classes for context / contribution body copy (default `text-base …`). */
  contentBodyClassName?: string;
  /** TOC link font; default Ovo to match other case studies. */
  tocLinkFontFamily?: string;
  /** Applied to the main sections stack (e.g. `text-[14px]` for body copy). */
  sectionBodyClassName?: string;
  /** When set, overrides the case-study H1 text color (e.g. `#333333`). */
  headlineColor?: string;
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
        <p
          className="font-mono text-[14px] font-semibold tracking-wider uppercase mb-1"
          style={{ color: accentDark }}
        >
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
  accentDark = "#333333",
  accentLight = "#E5E2DC",
  bodyBackgroundColor,
  headlineFont = "ovo",
  contentBodyClassName,
  tocLinkFontFamily,
  sectionBodyClassName,
  headlineColor,
  children,
}: Props) {
  const bodyTextClass =
    contentBodyClassName ?? "text-base text-secondary leading-relaxed";
  const headlineFontStyle: React.CSSProperties =
    headlineFont === "figtree"
      ? {
          fontFamily: "var(--font-hind), sans-serif",
          letterSpacing: "-0.3px",
          textWrap: "balance",
        }
      : {
          fontFamily: "var(--font-ovo), serif",
          letterSpacing: "-0.3px",
          textWrap: "balance",
        };
  const headlineColorStyle: React.CSSProperties | undefined = headlineColor
    ? { color: headlineColor }
    : undefined;

  const tocItems: TocItem[] = toc
    ? [{ id: "context", label: "Context" }, ...toc]
    : [];

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

  // ── H1 element ────────────────────────────────────────────────────────
  const h1InHeader = (extraClass = "mb-10") => (
    <h1
      className={`text-2xl md:text-[40px] font-normal leading-tight text-ink ${extraClass}`}
      style={{
        ...headlineFontStyle,
        ...headlineColorStyle,
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
      className="text-2xl md:text-[40px] font-normal leading-tight text-ink mb-10"
      style={{
        ...headlineFontStyle,
        ...headlineColorStyle,
        textWrap: "pretty" as React.CSSProperties["textWrap"],
      }}
    >
      {headline}
    </h1>
  );

  // ── context + contribution block ──────────────────────────────────────
  const hasTwoCols = sidePanel !== undefined || contribution !== undefined;
  const contextBlock = (
    <div id="context" className={`${hasTwoCols ? "grid md:grid-cols-2 gap-10 md:gap-16" : ""} ${contextVisualBelow ? "mb-10" : "mb-40"}`.trim()}>
      {sidePanel !== undefined ? (
        <>
          <div className="flex flex-col gap-8">
            {!hideContextLabel && (
              <section>
                <p
                  className="font-mono text-[14px] font-semibold tracking-wider uppercase mb-4"
                  style={{ color: accentDark }}
                >
                  Context
                </p>
                <div className={bodyTextClass}>{context}</div>
              </section>
            )}
            {hideContextLabel && (
              <div className={bodyTextClass}>{context}</div>
            )}
            {contribution && (
              <section>
                <p
                  className="font-mono text-[14px] font-semibold tracking-wider uppercase mb-4"
                  style={{ color: accentDark }}
                >
                  Contribution
                </p>
                <div className={bodyTextClass}>{contribution}</div>
              </section>
            )}
          </div>
          <div>{sidePanel}</div>
        </>
      ) : (
        <>
          <section>
            {!hideContextLabel && (
              <p
                className="font-mono text-[14px] font-semibold tracking-wider uppercase mb-4"
                style={{ color: accentDark }}
              >
                Context
              </p>
            )}
            <div className={bodyTextClass}>{context}</div>
          </section>
          {contribution && (
            <section>
              <p
                className="font-mono text-[14px] font-semibold tracking-wider uppercase mb-4"
                style={{ color: accentDark }}
              >
                Contribution
              </p>
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
      /* logos → heroVisual? → meta → H1? (H1 in header when headlineInHeader, else right col) */
      <>
        {logoRow("mb-8")}
        {heroVisual && <div className="mb-10">{heroVisual}</div>}
        <MetaGrid meta={meta} accentDark={accentDark} />
        {headlineInHeader && h1InHeader("mt-10 mb-0")}
      </>
    ) : (
      /* Default with TOC: logos → tagline? → meta (H1 goes to right col) */
      <>
        {logoRow("mb-6")}
        {tagline && (
          <p
            className="font-mono text-[14px] font-semibold tracking-wider uppercase mb-3"
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
      /* RM without TOC: logos → heroVisual → meta → H1 */
      <>
        {logoRow("mb-8")}
        {heroVisual && <div className="mb-10">{heroVisual}</div>}
        <MetaGrid meta={meta} accentDark={accentDark} />
        {h1InHeader("mt-8 mb-0")}
      </>
    ) : (
      /* Default without TOC: logos → tagline? → H1 → meta */
      <>
        {logoRow("mb-6")}
        {tagline && (
          <p
            className="font-mono text-[14px] font-semibold tracking-wider uppercase mb-3"
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

  return (
    <>
    <CaseStudyPageStyle backgroundColor={bodyBackgroundColor} />
    <article
      className="w-[70vw] max-w-[1008px] mx-auto pb-16"
      style={{ "--accent-dark": accentDark, "--accent-light": accentLight } as React.CSSProperties}
    >

      {/* Header, mb-14 (56px) creates the gap to H1 when toc is present */}
      <header className={`mt-12 ${toc ? "mb-14" : "mb-16"}`}>
        {headerContent}
      </header>

      {/* Body */}
      {toc ? (
        <div className="grid items-start grid-cols-1 min-[1080px]:grid-cols-[160px_1fr] gap-0 min-[1080px]:gap-[80px]">
          {/* Left: sticky TOC, aligns with top of H1 */}
          <TableOfContents
            items={tocItems}
            stickyTop={tocStickyTop}
            linkFontFamily={tocLinkFontFamily}
          />

          {/* Right: H1 (unless headlineInHeader) → context → body → footer */}
          <div className="min-w-0">
            {!headlineInHeader && h1InColumn}
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
              className={["case-study-section-stack", sectionBodyClassName].filter(Boolean).join(" ")}
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
            className={["case-study-section-stack", sectionBodyClassName].filter(Boolean).join(" ")}
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
