import Link from "next/link";
import TableOfContents, { TocItem } from "./TableOfContents";

interface Meta {
  timeline: string;
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
  toc?: TocItem[];
  callout?: React.ReactNode;
  meta: Meta;
  nextProject?: NextProject;
  accentDark?: string;
  accentLight?: string;
  children: React.ReactNode;
}

const hind = { fontFamily: "var(--font-hind), sans-serif" } as const;

const h1Style: React.CSSProperties = {
  fontFamily: "var(--font-ovo), serif",
  letterSpacing: "-0.3px",
  textWrap: "balance",
};

const MetaGrid = ({ meta, accentDark }: { meta: Meta; accentDark: string }) => (
  <div className="grid grid-cols-1 min-[400px]:grid-cols-2 min-[1080px]:grid-cols-4 gap-6">
    {[
      { label: "Timeline", value: meta.timeline },
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
  toc,
  callout,
  meta,
  nextProject,
  accentDark = "#333333",
  accentLight = "#E5E2DC",
  children,
}: Props) {
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
      style={h1Style}
    >
      {headline}
    </h1>
  );

  // H1 at top of right column (when TOC is present) — no margin top, mb for spacing to context
  // Uses text-wrap: pretty (not balance) so the text fills the full column width.
  const h1InColumn = (
    <h1
      className="text-2xl md:text-[40px] font-normal leading-tight text-ink mb-10"
      style={{ ...h1Style, textWrap: "pretty" as React.CSSProperties["textWrap"] }}
    >
      {headline}
    </h1>
  );

  // ── context + contribution block ──────────────────────────────────────
  const contextBlock = (
    <div id="context" className="grid md:grid-cols-2 gap-10 md:gap-16 mb-40">
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
                <div className="text-base text-secondary leading-relaxed">{context}</div>
              </section>
            )}
            {hideContextLabel && (
              <div className="text-base text-secondary leading-relaxed">{context}</div>
            )}
            {contribution && (
              <section>
                <p
                  className="font-mono text-[14px] font-semibold tracking-wider uppercase mb-4"
                  style={{ color: accentDark }}
                >
                  Contribution
                </p>
                <div className="text-base text-secondary leading-relaxed">{contribution}</div>
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
            <div className="text-base text-secondary leading-relaxed">{context}</div>
          </section>
          {contribution && (
            <section>
              <p
                className="font-mono text-[14px] font-semibold tracking-wider uppercase mb-4"
                style={{ color: accentDark }}
              >
                Contribution
              </p>
              <div className="text-base text-secondary leading-relaxed">{contribution}</div>
            </section>
          )}
        </>
      )}
    </div>
  );

  // ── next project footer — removed ────────────────────────────────────
  const nextProjectBlock = null;

  // ── header content ────────────────────────────────────────────────────
  // When toc is provided, H1 moves to the right column — header only has logos + meta.
  // mb-14 = 56px gap between meta and H1.
  const headerContent = toc ? (
    reverseHeaderOrder ? (
      /* RM with TOC: logos → heroVisual → meta (H1 goes to right col) */
      <>
        {logoRow("mb-8")}
        {heroVisual && <div className="mb-10">{heroVisual}</div>}
        <MetaGrid meta={meta} accentDark={accentDark} />
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
    <article
      className="w-[70%] max-w-[1298px] mx-auto pb-16"
      style={{ "--accent-dark": accentDark, "--accent-light": accentLight } as React.CSSProperties}
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mt-8 mb-0 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:opacity-60 transition-opacity"
          style={{ color: "#555555" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/house-fill.svg"
            alt=""
            aria-hidden="true"
            className="w-3.5 h-3.5"
            style={{ filter: "invert(35%) sepia(0%) saturate(0%) brightness(60%)" }}
          />
          <span
            className="text-[12px] uppercase"
            style={{ ...hind, color: "#555555", lineHeight: 0.8, transform: "translateY(1px)" }}
          >
            Home
          </span>
        </Link>
        <span className="text-[12px] text-[#555555] select-none" style={{ ...hind, lineHeight: 0.8 }}>
          /
        </span>
        <span
          className="text-[12px] uppercase text-[#333333]"
          style={{ ...hind, lineHeight: 0.8, transform: "translateY(1px)" }}
        >
          {projectName}
        </span>
      </nav>

      {/* Header — mb-14 (56px) creates the gap to H1 when toc is present */}
      <header className={`mt-12 ${toc ? "mb-14" : "mb-16"}`}>
        {headerContent}
      </header>

      {/* Body */}
      {toc ? (
        <div className="grid items-start grid-cols-1 min-[1080px]:grid-cols-[160px_1fr] gap-0 min-[1080px]:gap-[80px]">
          {/* Left: sticky TOC — aligns with top of H1 */}
          <TableOfContents items={tocItems} />

          {/* Right: H1 → contextVisual? → context → body → footer */}
          <div>
            {h1InColumn}
            {contextVisual && <div className="mb-14">{contextVisual}</div>}
            {contextBlock}
            {callout && <div className="mb-40">{callout}</div>}
            <div className="space-y-40">{children}</div>
            {nextProjectBlock}
          </div>
        </div>
      ) : (
        <>
          {contextVisual && <div className="mb-14">{contextVisual}</div>}
          {contextBlock}
          {callout && <div className="mb-40">{callout}</div>}
          <div className="space-y-40">{children}</div>
          {nextProjectBlock}
        </>
      )}
    </article>
  );
}
