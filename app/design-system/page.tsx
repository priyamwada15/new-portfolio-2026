import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { CaseStudySideToc, type SideTocItem } from "../components/CaseStudySideToc";
import { CaseStudySummary, SectionHeader } from "../components/CaseStudySections";
import { MediaWash } from "../components/MediaWash";
import {
  caseStudyTitle,
  caseStudyHeading,
  caseStudySubheading,
  caseStudyText,
  caseStudySectionTagCaps,
  caseStudySummaryLabel,
  caseStudySummaryText,
  caseStudyStatNumber,
  mediaPanel,
  CASE_STUDY_COLUMN_CLASS,
} from "@/design-system";

export const metadata: Metadata = {
  title: "Design System | Priyamwada Pandey",
  description:
    "The Workbench: the tokens, type, elevation and components behind priyamwada.me, built from the same design system it describes.",
};

const TOC_ITEMS: SideTocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "elevation", label: "Elevation" },
  { id: "components", label: "Components" },
  { id: "guidelines", label: "Do's and don'ts" },
];

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-12">
      <SectionHeader title={title}>
        {intro}
      </SectionHeader>
      {children}
    </section>
  );
}

/** A labelled block inside a section. */
function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className={caseStudySubheading}>{label}</h3>
      {children}
    </div>
  );
}

/** Title and text, spaced as on a case study. */
function Item({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className={caseStudySubheading}>{title}</h3>
      <div className={`${caseStudyText} flex flex-col gap-2`}>{children}</div>
    </div>
  );
}

/** The same four columns as a case study's meta row. */
const FOUR_COLUMNS = "grid grid-cols-4 gap-x-10 gap-y-8 max-md:grid-cols-2 max-md:gap-x-4";

function Swatches({ colors }: { colors: { name: string; token: string; hex: string; note?: string }[] }) {
  return (
    <div className={FOUR_COLUMNS}>
      {colors.map(({ name, token, hex, note }) => (
        <div key={name} className="flex flex-col gap-4">
          <div
            className="h-20 w-full rounded-[var(--ds-radius-container)] border border-border"
            style={{ backgroundColor: `var(${token})` }}
            aria-hidden
          />
          <div className="flex flex-col gap-2">
            <h4 className={caseStudySubheading}>{name}</h4>
            <p className="font-mono text-[12px] leading-[16px] text-tertiary">{hex}</p>
            {note ? <p className={caseStudyText}>{note}</p> : null}
          </div>
        </div>
      ))}
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
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-4 gap-x-10 gap-y-4 max-md:grid-cols-1">
      <div className="flex flex-col gap-2">
        <h3 className={caseStudySubheading}>{role}</h3>
        <p className="font-mono text-[12px] leading-[16px] text-tertiary">{meta}</p>
      </div>
      <p className={`col-span-3 max-md:col-span-1 ${className}`} style={style}>
        {children}
      </p>
    </div>
  );
}

function ShadowDemo({ label, value, shadow }: { label: string; value: string; shadow: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="h-24 w-full rounded-[var(--ds-radius-container)] bg-surface-page"
        style={{ boxShadow: shadow }}
        aria-hidden
      />
      <div className="flex flex-col gap-2">
        <h3 className={caseStudySubheading}>{label}</h3>
        <p className="font-mono text-[12px] leading-[16px] text-tertiary">{value}</p>
      </div>
    </div>
  );
}

/** Each row pairs a do with the don't closest to it; an empty cell has no counterpart. */
const GUIDELINES: [string, string][] = [
  ["Keep the page white, with near-black headings and grey body text.", "Add a third site color before trying rose or olive."],
  ["Use rose for things people can act on or are acting on, like tooltips and the active nav link.", "Use rose as a fill."],
  ["Keep project brand colors inside their logos and product UI.", "Bring a project's brand color into my headings, labels or page chrome."],
  ["Let Figtree carry headlines, body and labels. Save DM Mono for code and token values.", "Use gradient text for emphasis."],
  ["Keep line heights and spacing in multiples of 4.", "Separate content with hairline dividers. Use spacing, cards or tone."],
  ["Keep shadows at 5% opacity or less at rest.", "Reach for glass effects outside the nav and the demo surfaces."],
  ["Cap body copy at about 640px under a full-width heading, and get to the point fast.", "Let a case study run long and text-heavy."],
  ["Show the problem before the UI in a case study.", "Build a hero-metric block with a gradient accent."],
  ["Hold the side projects to the same craft bar as the case studies.", "Frame AI or conversational work with cute chat-bubble icons."],
  ["", "Use border-left or border-right stripes as a colored accent on cards or callouts."],
  ["", "Repeat identical icon and heading card grids."],
  ["", "Reach for a modal as the first solution."],
];

function GuidelineTable() {
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <thead>
        <tr>
          <th scope="col" className={`px-4 py-3 ${caseStudySubheading}`}>Do</th>
          <th scope="col" className={`px-4 py-3 ${caseStudySubheading}`}>Don&rsquo;t</th>
        </tr>
      </thead>
      <tbody>
        {GUIDELINES.map(([good, bad]) => (
          <tr key={bad} className="odd:bg-surface-page">
            <td className={`rounded-l-[var(--ds-radius-container)] px-4 py-3 align-top ${caseStudyText}`}>{good}</td>
            <td className={`rounded-r-[var(--ds-radius-container)] px-4 py-3 align-top ${caseStudyText}`}>{bad}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function DesignSystemPage() {
  return (
    <article className={CASE_STUDY_COLUMN_CLASS}>
      <CaseStudySideToc items={TOC_ITEMS} alignToId="overview" />

      <div className="mt-12" />
      <header className="hero-intro hero-intro--bento mb-[120px] flex flex-col gap-4">
        {/* Tracking matches the case study headline as CaseStudyLayout renders it */}
        <h1 className={caseStudyTitle} style={{ letterSpacing: "-0.02px" }}>
          The Workbench
        </h1>
        <p className={`${caseStudyText} max-w-[640px]`}>
          A white page and grayscale text, with a rose and an olive that each have their own job.
          This page documents the tokens, type, spacing and components behind priyamwada.me, and
          it&rsquo;s built from the same design system it describes.
        </p>
      </header>

      <div className="hero-intro hero-intro--bento flex flex-col gap-[128px]">
        <Section
          id="overview"
          title="Overview"
          intro={
            <p>
              Most of the site is near-black and grey on white, so the product UI does the talking.
              Olive is where the site shows some personality, on the license card up top and the
              footer at the bottom. Products keep their own colors, inside their logos and their UI.
            </p>
          }
        />

        <Section
          id="colors"
          title="Colors"
          intro={
            <p>
              The palette starts in grayscale. Rose and olive are the only colors the site owns, and
              each one has a fixed job.
            </p>
          }
        >
          <Group label="Text">
            <Swatches
              colors={[
                { name: "Primary", token: "--ds-text-primary", hex: "#0a0a0a", note: "Titles, headings and anything that leads." },
                { name: "Secondary", token: "--ds-text-secondary", hex: "#5e5e5e", note: "Body copy." },
                { name: "Tertiary", token: "--ds-text-tertiary", hex: "#767676", note: "Labels and metadata." },
              ]}
            />
          </Group>
          <Group label="Site colors">
            <Swatches
              colors={[
                { name: "Rose", token: "--ds-color-brand-hcn-rose", hex: "#c02b53", note: "Active nav link, cursor, tooltips and hover rings." },
                { name: "Olive", token: "--ds-color-brand-hcn-olive", hex: "#bfb74c", note: "The license card and the site footer." },
              ]}
            />
          </Group>
          <Group label="Surfaces">
            <Swatches
              colors={[
                { name: "Site", token: "--ds-surface-site", hex: "#ffffff", note: "Every page except the playground." },
                { name: "Page", token: "--ds-surface-page", hex: "#fafafa", note: "Demo cards and media panels." },
              ]}
            />
          </Group>
          <Group label="Borders">
            <Swatches
              colors={[
                { name: "Default", token: "--ds-border-default", hex: "#e8e8e8", note: "Media panels and outlines." },
                { name: "Card", token: "--ds-border-card", hex: "#f2f2f2", note: "Demo cards." },
                { name: "Media", token: "--ds-border-media", hex: "#e6e6e6", note: "Framed screenshots and video." },
              ]}
            />
          </Group>
          <Group label="Project brand colors">
            <Swatches
              colors={[
                { name: "Rocket red", token: "--ds-color-brand-rocket", hex: "#de3341", note: "Rocket Mortgage logo and product UI." },
                { name: "TARS purple", token: "--ds-color-brand-tars", hex: "#6d33aa", note: "TARS logo and product UI." },
                { name: "Salesforce navy", token: "--ds-color-brand-salesforce", hex: "#032c5f", note: "Salesforce and Galileo." },
              ]}
            />
          </Group>
        </Section>

        <Section
          id="typography"
          title="Typography"
          intro={
            <p>
              Figtree carries the whole system, from a case study title down to a label. DM Mono
              only appears for code and token values.
            </p>
          }
        >
          <div className="flex flex-col gap-10">
            <TypeSpecimen role="Title" meta="32/44.8 · 500 · phones 28" className={caseStudyTitle} style={{ letterSpacing: "-0.02px" }}>
              Personalizing AI guidance
            </TypeSpecimen>
            <TypeSpecimen role="Section heading" meta="24/32 · 500 · phones 20/28" className={caseStudyHeading}>
              The canvas follows the run and stops where it breaks
            </TypeSpecimen>
            <TypeSpecimen role="Subheading" meta="16/24 · 500" className={caseStudySubheading}>
              Failures surface on their own
            </TypeSpecimen>
            <TypeSpecimen role="Body" meta="16/28 · 400" className={`${caseStudyText} max-w-[640px]`}>
              When a connection breaks, the run pauses on that node and the canvas zooms straight to
              it in red.
            </TypeSpecimen>
            <TypeSpecimen role="Label" meta="12/16 · 500 · caps, 0.08em" className={caseStudySectionTagCaps}>
              Problem space
            </TypeSpecimen>
            <TypeSpecimen role="Summary label" meta="18/26.1 · 500 · phones 16" className={caseStudySummaryLabel}>
              My role
            </TypeSpecimen>
            <TypeSpecimen role="Summary text" meta="16/25.6 · 400" className={caseStudySummaryText}>
              I designed and shipped Debug Mode in a month.
            </TypeSpecimen>
            <TypeSpecimen role="Stat" meta="32/32 · 500 · phones 28" className={caseStudyStatNumber}>
              ~70%
            </TypeSpecimen>
            <TypeSpecimen role="Mono" meta="DM Mono · 14/24" className="font-mono text-[14px] leading-[24px] text-secondary">
              {'const accent = "var(--ds-case-study-accent)";'}
            </TypeSpecimen>
          </div>
        </Section>

        <Section
          id="spacing"
          title="Spacing"
          intro={<p>Things that belong together sit close, and sections get room to breathe.</p>}
        >
          <div className={FOUR_COLUMNS}>
            <Item title="8px">
              <p>Subheading to its body, and between the paragraphs under it.</p>
            </Item>
            <Item title="16px">
              <p>Label to heading, and between paragraphs that sit beside a heading.</p>
            </Item>
            <Item title="40px">
              <p>Between columns.</p>
            </Item>
            <Item title="128px">
              <p>Between sections.</p>
            </Item>
          </div>
        </Section>

        <Section
          id="elevation"
          title="Elevation"
          intro={
            <p>
              Surfaces sit like thin sheets of paper barely lifted off the one below. If you can
              point to a shadow, it&rsquo;s too strong.
            </p>
          }
        >
          <div className={FOUR_COLUMNS}>
            <ShadowDemo label="Card rest" value="0 4px 12px rgba(0,0,0,.05)" shadow="0 4px 12px rgba(0,0,0,0.05)" />
            <ShadowDemo label="Card hover" value="0 15px 30px -22px rgba(0,0,0,.05)" shadow="0 15px 30px -22px rgba(0,0,0,0.05)" />
            <ShadowDemo
              label="Chip ambient"
              value="0 2px 2px rgba(0,0,0,.015)"
              shadow="0 2px 2px rgba(0,0,0,0.015), -1px -2px 6px rgba(0,0,0,0.012)"
            />
          </div>
        </Section>

        <Section
          id="components"
          title="Components"
          intro={
            <p>
              Every section on this page uses the case study section header: a label, a heading on
              the left and body copy on the right.
            </p>
          }
        >
          <Group label="Summary row">
            <CaseStudySummary
              rows={[
                { label: "Goal", text: "What the project set out to change." },
                { label: "My role", text: "What I owned and who I worked with." },
                { label: "Impact", text: "What came of it. All three get equal emphasis." },
              ]}
            />
          </Group>
          <Group label="Media washes">
            <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1">
              <MediaWash tone="tars" className="h-56">
                {null}
              </MediaWash>
              <MediaWash tone="hcn" className="h-56">
                {null}
              </MediaWash>
            </div>
          </Group>
          <Group label="Demo card and media panel">
            <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1">
              <div
                className="h-56 rounded-[var(--ds-radius-container)] border border-[var(--ds-border-card)] bg-surface-page"
                aria-hidden
              />
              <div className={`h-56 ${mediaPanel}`} aria-hidden />
            </div>
          </Group>
          <Group label="Tooltip">
            <div>
              <span className="inline-flex rounded-md bg-[var(--ds-tooltip-bg)] px-3 py-2 font-label text-[12px] leading-[16px] text-[var(--ds-tooltip-fg)]">
                Copy email
              </span>
            </div>
          </Group>
        </Section>

        <Section
          id="guidelines"
          title="Do's and don'ts"
          intro={<p>The rules I check a new page or component against.</p>}
        >
          <GuidelineTable />
        </Section>
      </div>
    </article>
  );
}
