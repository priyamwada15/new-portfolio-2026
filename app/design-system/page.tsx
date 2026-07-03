import type { Metadata } from "next";
import type { CSSProperties } from "react";
import TableOfContents, { TocItem } from "../components/TableOfContents";
import SectionLabel from "../components/SectionLabel";
import { LiquidButton } from "../components/animate-ui/liquid-button";
import {
  caseStudyHeadline,
  caseStudyH2,
  caseStudyBody,
  CASE_STUDY_TOC_GRID_CLASS,
} from "@/design-system";

export const metadata: Metadata = {
  title: "Design System | Priyamwada Pandey",
  description:
    "The Workbench — a quiet grayscale base that borrows one committed color per project, never its own.",
};

const TOC_ITEMS: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "elevation", label: "Elevation" },
  { id: "components", label: "Components" },
  { id: "guidelines", label: "Do's & Don'ts" },
];

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.5L6.2 11.5L13 4.5"
        stroke="#111111"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="#111111"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Section({
  id,
  tag,
  title,
  children,
}: {
  id: string;
  tag: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <SectionLabel>{tag}</SectionLabel>
      <h2 className={`${caseStudyH2} mb-8`}>{title}</h2>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  );
}

function ColorSwatch({
  name,
  hex,
  note,
}: {
  name: string;
  hex: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="h-20 w-full rounded-[10px] border border-border"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <div>
        <p className="font-label text-[13px] font-semibold text-ink">{name}</p>
        <p className="font-mono text-[12px] text-muted">{hex}</p>
        {note ? (
          <p className="mt-1 text-[12px] leading-snug text-secondary">{note}</p>
        ) : null}
      </div>
    </div>
  );
}

function ColorGroup({
  label,
  columns = 4,
  children,
}: {
  label: string;
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}) {
  const gridCols =
    columns === 2
      ? "grid-cols-2 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-4";
  return (
    <div>
      <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-4">
        {label}
      </p>
      <div className={`grid ${gridCols} gap-x-6 gap-y-8`}>{children}</div>
    </div>
  );
}

function RuleCallout({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[14px] border border-border px-6 py-5">
      <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        Named rule
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-primary">
        <span className="font-semibold text-ink">{name}.</span> {children}
      </p>
    </div>
  );
}

function TypeSpecimen({
  role,
  meta,
  className,
  style,
  children,
}: {
  role: string;
  meta: string;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-8 last:border-b-0 last:pb-0 sm:flex-row sm:gap-8">
      <div className="shrink-0 sm:w-[136px]">
        <p className="font-label text-[13px] font-semibold text-ink">{role}</p>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted">
          {meta}
        </p>
      </div>
      <p className={className} style={style}>
        {children}
      </p>
    </div>
  );
}

function ShadowDemo({
  label,
  valueLabel,
  style,
  hoverStyle,
}: {
  label: string;
  valueLabel: string;
  style: CSSProperties;
  hoverStyle?: CSSProperties;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        tabIndex={hoverStyle ? undefined : 0}
        className="group flex h-24 w-full items-center justify-center rounded-[14px] bg-surface-card text-center font-label text-[12px] text-muted outline-none transition-shadow duration-500"
        style={style}
      >
        {label}
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-muted text-center">
        {valueLabel}
      </p>
    </div>
  );
}

function GuidelineList({
  type,
  items,
}: {
  type: "do" | "dont";
  items: string[];
}) {
  return (
    <div>
      <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-4">
        {type === "do" ? "Do" : "Don't"}
      </p>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border">
              {type === "do" ? <CheckIcon /> : <CrossIcon />}
            </span>
            <span className="text-[14px] leading-relaxed text-secondary">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DOS = [
  "Keep the base chrome (nav, footer, global page background) strictly grayscale — ink, charcoal, off-white only.",
  "Let exactly one borrowed color own each case study or section, applied with commitment rather than a single timid swatch.",
  "Keep Figtree as the one load-bearing voice across headlines, body, and labels; reserve DM Mono strictly for code and terminal contexts.",
  "Keep shadows at or below 5% opacity at rest; let motion carry interactivity instead of heavier shadows or color swaps.",
  "Cap body copy at 65–75ch and get to the point fast — assume a reader with under two minutes per case study.",
  "Show problem complexity before showing UI screens in a case study.",
  "Hold the creative-coding side quests to the same craft bar as case study components.",
];

const DONTS = [
  "Use border-left / border-right stripes greater than 1px as a colored accent on cards or callouts.",
  "Use gradient text for emphasis — use ink weight or size instead.",
  "Default to glassmorphism; the homepage nav's 15% white tint is deliberate and singular.",
  "Build a generic hero-metric block (big number, small label, gradient accent).",
  "Repeat identical icon-plus-heading card grids.",
  "Reach for a modal as the first solution.",
  "Mix two borrowed project colors on the same screen.",
  "Let a case study run long and text-heavy.",
  "Frame AI or conversational work with cute chat-bubble iconography.",
];

export default function DesignSystemPage() {
  return (
    <div
      className="mx-auto w-[86%] max-w-[1008px] pb-32"
      style={{ "--accent-dark": "#111111", "--accent-light": "#e5e2dc" } as CSSProperties}
    >
      <header className="pt-6 pb-20 md:pb-24">
        <SectionLabel>Design System</SectionLabel>
        <h1 className={caseStudyHeadline}>The Workbench</h1>
        <p className="mt-6 max-w-[560px] text-[16px] leading-relaxed text-secondary">
          A quiet grayscale base that borrows one committed color per project,
          never its own. This page documents the tokens, type, elevation, and
          components behind priyamwada.me — built from the same design system
          it describes.
        </p>
      </header>

      <div className={CASE_STUDY_TOC_GRID_CLASS}>
        <TableOfContents items={TOC_ITEMS} linkFontFamily="var(--font-hind), sans-serif" />

        <div className="flex flex-col gap-24 md:gap-28">
          <Section id="overview" tag="01 — Overview" title="A workbench, not a showroom">
            <p className={caseStudyBody}>
              The base surface carries no color of its own. Color shows up
              only when a specific piece of work is on the table — Rocket
              Mortgage&rsquo;s red, TARS&rsquo;s purple, Salesforce&rsquo;s
              navy — and when it shows up, it commits to that one context
              fully rather than bleeding into the chrome around it.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Grayscale-first: text and chrome live entirely in ink, charcoal, off-white; color is contextual, not ambient.",
                "One committed accent per surface: each case study or interactive moment picks a single color and uses it with intent.",
                "Paper-thin depth: shadows are felt, not seen.",
                "One type voice: Figtree carries headlines, body, and labels; DM Mono steps in only for code and terminal contexts.",
                "Motion favors physical fill and spring response over fades and gradients.",
              ].map((line, i) => (
                <li key={line} className="flex gap-4 text-[15px] leading-relaxed text-primary">
                  <span className="font-mono text-[12px] text-faint pt-[3px]">
                    0{i + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="colors" tag="02 — Colors" title="Borrowed, never owned">
            <p className={caseStudyBody}>
              The palette is grayscale-first with contextual accents borrowed
              per project. No single hex is &ldquo;the&rdquo; brand color.
            </p>

            <ColorGroup label="Primary" columns={2}>
              <ColorSwatch
                name="Ink"
                hex="#111111"
                note="Body text, primary button fill, selection background."
              />
            </ColorGroup>

            <ColorGroup label="Secondary" columns={2}>
              <ColorSwatch name="Charcoal Text" hex="#333333" note="Primary reading color." />
              <ColorSwatch name="Slate Text" hex="#555555" note="Captions, metadata, icons." />
            </ColorGroup>

            <ColorGroup label="Tertiary — borrowed project colors" columns={3}>
              <ColorSwatch name="Rocket Red" hex="#de3341" note="Rocket Mortgage only." />
              <ColorSwatch name="TARS Purple" hex="#6d33aa" note="TARS Debug Mode & Asimov only." />
              <ColorSwatch name="Salesforce Navy" hex="#032c5f" note="Salesforce / Galileo only." />
            </ColorGroup>

            <ColorGroup label="Interaction accent" columns={2}>
              <ColorSwatch
                name="Terminal Pink"
                hex="#d6336c"
                note="Spotify “currently playing” widget hover ring only."
              />
            </ColorGroup>

            <ColorGroup label="Neutral">
              <ColorSwatch name="Surface Base" hex="#fdfdfd" />
              <ColorSwatch name="Surface Page" hex="#fafafa" />
              <ColorSwatch name="Surface Card" hex="#fbfbfb" />
              <ColorSwatch name="Surface Media" hex="#f5f5f5" />
              <ColorSwatch name="Surface Chip" hex="#f3f5f6" />
              <ColorSwatch name="Border Default" hex="#e8e8e8" />
              <ColorSwatch name="Text Muted" hex="#888888" />
              <ColorSwatch name="Text Faint" hex="#989898" />
            </ColorGroup>

            <div className="grid gap-4 sm:grid-cols-2">
              <RuleCallout name="The Borrowed Color Rule">
                The base UI never carries a project&rsquo;s brand color. A
                color only appears inside the boundary of the case study,
                section, or component it belongs to — one accent per
                context, not several diluted ones.
              </RuleCallout>
              <RuleCallout name="The One Ink Rule">
                There is exactly one near-black across the whole system
                (#111111). Don&rsquo;t introduce a second &ldquo;almost
                black&rdquo; for a new component; reuse ink.
              </RuleCallout>
            </div>
          </Section>

          <Section id="typography" tag="03 — Typography" title="One voice, plainly stated">
            <p className={caseStudyBody}>
              Figtree carries the whole system — case study headline down to
              a chip label. DM Mono is reserved strictly for code, terminal,
              and cursor contexts, never for anything decorative.
            </p>

            <div className="flex flex-col gap-8">
              <TypeSpecimen
                role="Headline"
                meta="Figtree · 700 · 32px / 1.3"
                className="font-label text-[32px] font-bold leading-[1.3] text-ink"
              >
                Problem space
              </TypeSpecimen>
              <TypeSpecimen
                role="Body"
                meta="Figtree · 400 · 16px / 1.625"
                className={caseStudyBody}
              >
                Case study prose and context copy run in Figtree, capped at
                65–75 characters per line so a two-minute reader never loses
                their place.
              </TypeSpecimen>
              <TypeSpecimen
                role="Label"
                meta="Figtree · 600 · 14px"
                className="font-label text-[14px] font-semibold text-ink"
              >
                Section tag
              </TypeSpecimen>
              <TypeSpecimen
                role="Mono"
                meta="DM Mono · 400 · 14px"
                className="font-mono text-[14px] text-secondary"
              >
                const accent = borrowed(project);
              </TypeSpecimen>
            </div>

            <RuleCallout name="The One Voice Rule">
              Figtree is the only load-bearing typeface across the system —
              headlines, body, and labels alike. DM Mono is a second voice
              reserved strictly for literal code or terminal contexts — never
              decorative.
            </RuleCallout>
          </Section>

          <Section id="elevation" tag="04 — Elevation" title="Paper-thin layering">
            <p className={caseStudyBody}>
              Surfaces feel like thin sheets of paper barely lifted off the
              one beneath, not objects floating with drama. Shadows exist
              only as ambient hover feedback, never as a permanent
              structural cue.
            </p>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <ShadowDemo
                label="Card rest"
                valueLabel="0 4px 12px rgba(0,0,0,.05)"
                style={{ boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.05)" }}
              />
              <ShadowDemo
                label="Hover me"
                valueLabel="0 15px 30px -22px rgba(0,0,0,.05)"
                style={{ boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.05)" }}
                hoverStyle={{ boxShadow: "0px 15px 30px -22px rgba(0,0,0,0.05)" }}
              />
              <ShadowDemo
                label="Chip ambient"
                valueLabel="0 2px 2px rgba(0,0,0,.015)"
                style={{
                  boxShadow:
                    "0 2px 2px rgba(0,0,0,0.015), -1px -2px 6px rgba(0,0,0,0.012)",
                  borderRadius: "80px",
                }}
              />
              <ShadowDemo
                label="Focus ring"
                valueLabel="0 0 0 2px rgba(116,69,119,.35)"
                style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.04)" }}
              />
            </div>

            <RuleCallout name="The Paper-Thin Rule">
              If a shadow reads as &ldquo;a shadow&rdquo; rather than
              &ldquo;a piece of paper barely lifted,&rdquo; it&rsquo;s too
              strong. Opacity stays at or below 5% except for focus rings,
              which exist to be seen.
            </RuleCallout>
          </Section>

          <Section id="components" tag="05 — Components" title="Playful precision">
            <p className={caseStudyBody}>
              Exact, restrained shapes that reveal personality only through
              motion, never through decoration sitting still.
            </p>

            <div>
              <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-4">
                Liquid button
              </p>
              <div className="flex flex-wrap items-center gap-4 rounded-[14px] bg-surface-page p-8">
                <LiquidButton>View case study</LiquidButton>
                <LiquidButton>Say hello</LiquidButton>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                Ink fills the pill from the bottom on hover via spring
                physics; the label flips to off-white. A liquid-fill reveal,
                not a color crossfade — the system&rsquo;s signature
                interactive moment.
              </p>
            </div>

            <div>
              <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-4">
                Chips &amp; hover ring
              </p>
              <div className="flex flex-wrap items-center gap-6 rounded-[14px] bg-surface-page p-8">
                <span className="inline-flex items-center rounded-[14px] bg-surface-chip px-3.5 py-1.5 font-label text-[14px] font-semibold text-secondary">
                  #agentdesign
                </span>
                <div
                  className="h-16 w-16 shrink-0 rounded-[8px] border-[1.6px] border-white bg-surface-media shadow-[0px_8px_22px_rgba(0,0,0,0.14)] transition-shadow duration-200 hover:shadow-[0px_8px_22px_rgba(0,0,0,0.14),0_0_0_1.5px_#fff,0_0_0_3px_#d6336c]"
                  aria-hidden
                />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                The square is the currently-playing widget&rsquo;s album art —
                hover to see its terminal-pink ring, the system&rsquo;s only
                interaction accent.
              </p>
            </div>

            <div>
              <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-4">
                Media panel
              </p>
              <div className="flex h-40 items-center justify-center rounded-[24px] bg-surface-media font-label text-[12px] text-muted">
                rounded-[24px] · bg-surface-media
              </div>
            </div>
          </Section>

          <Section id="guidelines" tag="06 — Do's & Don'ts" title="Concrete guardrails">
            <div className="grid gap-12 sm:grid-cols-2">
              <GuidelineList type="do" items={DOS} />
              <GuidelineList type="dont" items={DONTS} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
