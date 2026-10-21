import type { Metadata } from "next";
import type { CSSProperties } from "react";
import TableOfContents, { TocItem } from "../components/TableOfContents";
import SectionLabel from "../components/SectionLabel";
import { LiquidButton } from "../components/animate-ui/liquid-button";
import { backdropStyle, CASE_BACKDROPS } from "../components/caseBackdrop";
import backdrop from "../components/CaseBackdrop.module.css";
import {
  caseStudyHeadline,
  caseStudyH2,
  caseStudyBody,
  caseStudySectionTagCaps,
  caseStudyStatNumber,
  CASE_STUDY_TOC_GRID_CLASS,
} from "@/design-system";

export const metadata: Metadata = {
  title: "Design System | Priyamwada Pandey",
  description:
    "The Workbench: the tokens, type, elevation and components behind priyamwada.me, built from the same design system it describes.",
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
  "Keep the base chrome (nav, footer, page background) in ink, charcoal and off-white.",
  "Use rose for anything on a case study page that should pull the eye: section tags, markers and highlights.",
  "Keep project brand colors inside their logos and product UI.",
  "Let Figtree carry headlines, body and labels. Save DM Mono for code and terminal text.",
  "Keep shadows at 5% opacity or less at rest, and let motion carry the interactivity.",
  "Cap body copy at 65 to 75 characters a line and get to the point fast, since most readers give a case study under two minutes.",
  "Show the problem before the UI in a case study.",
  "Hold the side projects to the same craft bar as the case studies.",
];

const DONTS = [
  "Use border-left or border-right stripes thicker than 1px as a colored accent on cards or callouts.",
  "Use gradient text for emphasis.",
  "Reach for glass effects outside the nav and the demo surfaces.",
  "Build a hero-metric block with a gradient accent.",
  "Repeat identical icon and heading card grids.",
  "Reach for a modal as the first solution.",
  "Bring a project's brand color into my headings, tags or page chrome.",
  "Add a third site color before trying rose or olive.",
  "Let a case study run long and text-heavy.",
  "Frame AI or conversational work with cute chat-bubble icons.",
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
          A quiet grayscale base with two colors of its own, a rose and an
          olive, that show up wherever my work does. This page documents the
          tokens, type, elevation and components behind priyamwada.me, and
          it&rsquo;s built from the same design system it describes.
        </p>
      </header>

      <div className={CASE_STUDY_TOC_GRID_CLASS}>
        <TableOfContents items={TOC_ITEMS} linkFontFamily="var(--font-hind), sans-serif" />

        <div className="flex flex-col gap-24 md:gap-28">
          <Section id="overview" tag="01 · Overview" title="Built around the work">
            <p className={caseStudyBody}>
              Most of the site is ink and off-white. The two colors I keep for
              myself sit around the work: olive behind the live demos, and rose
              wherever I want you to look next, like a section tag, the active
              link in the nav or the edge of a demo&rsquo;s backdrop. The
              products I worked on keep their own colors, but only inside their
              logos and their UI.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Grayscale first: text and chrome live in ink, charcoal and off-white.",
                "One accent across every case study: rose, used the same way on every page so it starts to mean something.",
                "Olive and rose belong to the backdrop behind the coded demos, the one place the site gets colorful.",
                "Paper-thin depth: shadows sit at 5% opacity or less, so you feel them before you see them.",
                "Figtree carries headlines, body and labels. DM Mono only shows up for code and terminal text.",
                "Motion leans on physical fill and spring response.",
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

          <Section id="colors" tag="02 · Colors" title="Two colors of my own">
            <p className={caseStudyBody}>
              The palette starts in grayscale. Rose and olive are the only
              colors the site owns, and each one has a fixed job. Project brand
              colors stay inside the work they belong to.
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

            <ColorGroup label="Site colors" columns={2}>
              <ColorSwatch
                name="Rose"
                hex="#c02b53"
                note="The case study accent for section tags, markers and highlights. Also the active nav link, the cursor, the hover ring on interactive widgets and the edge of the demo backdrop."
              />
              <ColorSwatch
                name="Olive"
                hex="#bfb74c"
                note="The center of the demo backdrop, and the license card in the hero."
              />
            </ColorGroup>

            <ColorGroup label="Project brand colors" columns={3}>
              <ColorSwatch name="Rocket Red" hex="#de3341" note="Rocket Mortgage logo and product UI only." />
              <ColorSwatch name="TARS Purple" hex="#6d33aa" note="TARS product UI only." />
              <ColorSwatch name="Salesforce Navy" hex="#032c5f" note="Salesforce / Galileo only." />
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
              <RuleCallout name="The Two Color Rule">
                Rose and olive are the only colors the site uses on its own
                chrome. Rose marks where to look and olive sits behind the
                work. If something new needs color, it uses one of these two
                before I add a third.
              </RuleCallout>
              <RuleCallout name="The Product Color Rule">
                A product&rsquo;s brand color stays inside its logo and its own
                UI. It doesn&rsquo;t color a section tag or a heading on my page.
              </RuleCallout>
              <RuleCallout name="The One Ink Rule">
                There is exactly one near-black across the whole system
                (#111111). Don&rsquo;t introduce a second &ldquo;almost
                black&rdquo; for a new component; reuse ink.
              </RuleCallout>
            </div>
          </Section>

          <Section id="typography" tag="03 · Typography" title="One voice, plainly stated">
            <p className={caseStudyBody}>
              Figtree carries the whole system, from a case study title down to
              a chip label. DM Mono only appears for code, terminal and cursor
              text.
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
                role="Section tag"
                meta="Figtree · 600 · 14px · caps, 0.06em"
                className={caseStudySectionTagCaps}
                style={{ color: "var(--ds-case-study-accent)" }}
              >
                Problem space
              </TypeSpecimen>
              <TypeSpecimen
                role="Stat"
                meta="Figtree · 600 · 32px"
                className={caseStudyStatNumber}
              >
                ~70%
              </TypeSpecimen>
              <TypeSpecimen
                role="Mono"
                meta="DM Mono · 400 · 14px"
                className="font-mono text-[14px] text-secondary"
              >
                {'const accent = "var(--ds-case-study-accent)";'}
              </TypeSpecimen>
            </div>

            <RuleCallout name="The One Voice Rule">
              Figtree is the only typeface doing real work across the site, in
              headlines, body and labels. DM Mono is a second voice for literal
              code and terminal text.
            </RuleCallout>
          </Section>

          <Section id="elevation" tag="04 · Elevation" title="Paper-thin layering">
            <p className={caseStudyBody}>
              Surfaces sit like thin sheets of paper barely lifted off the one
              below. Shadows show up as hover feedback and stay out of the
              structure.
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
              If you can point to a shadow, it&rsquo;s too strong. Opacity
              stays at 5% or below, except for focus rings, which need to be
              seen.
            </RuleCallout>
          </Section>

          <Section id="components" tag="05 · Components" title="Playful precision">
            <p className={caseStudyBody}>
              Shapes stay exact and plain. The personality comes through when
              they move.
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
                Ink fills the pill from the bottom on hover with spring
                physics, and the label flips to off-white. It&rsquo;s the
                site&rsquo;s signature interactive moment.
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
                  className="h-16 w-16 shrink-0 rounded-[8px] border-[1.6px] border-white bg-surface-media shadow-[0px_8px_22px_rgba(0,0,0,0.14)] transition-shadow duration-200 hover:shadow-[0px_8px_22px_rgba(0,0,0,0.14),0_0_0_1.5px_#fff,0_0_0_3px_var(--ds-interaction-ring)]"
                  aria-hidden
                />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                The square is the currently playing widget&rsquo;s album art.
                Hover it to see the rose ring interactive widgets use.
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

            <div>
              <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-4">
                Demo backdrop
              </p>
              <div
                className={`h-56 rounded-[24px] ${backdrop.backdrop}`}
                style={backdropStyle(CASE_BACKDROPS.rocket)}
                aria-hidden
              />
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                The live demos on the homepage cards and case study heroes sit
                on an olive to rose gradient with a fine speckle. The dark flecks
                take the color beneath them. Each case study shifts the olive
                center a little, so the three read as a set.
              </p>
            </div>
          </Section>

          <Section id="guidelines" tag="06 · Do's & Don'ts" title="Concrete guardrails">
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
