import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SunlightEffect } from "../components/SunlightEffect";
import { ResumeDownloadButton } from "./ResumeDownloadButton";

export const metadata: Metadata = {
  title: "Resume | Priyamwada Pandey",
  description: "Resume for Priyamwada Pandey — product designer focused on AI-native interfaces.",
};

const RM_ICON = "/Icons/RM%20Logo%20Icon.svg";
const TARS_ICON = "/Icons/Tars%20Icon%20Logo.svg";

const SUMMARY =
  "Product Designer with 3+ years of experience designing AI-powered products across startup and enterprise teams. Most of my work has been for AI-assisted interfaces- agent builders, assistants, developer and internal tooling. I am also a tinkerer at heart and I work where the design needs me, whether that is on paper (or Paper), in Figma, through an IDE, an Arduino or a Microbit.";

/** Skills — copy matches resume / Figma spec (not inferred). */
const PD_CHIPS = [
  "Interaction Design",
  "Agent Interface Design",
  "Information Architecture",
  "Conversational UI",
  "Design Systems",
  "Responsive Design",
  "Accessibility",
];

const AI_PROTOTYPE_CHIPS = ["Cursor", "Claude Code", "Google AI Studio", "Replit", "Paper", "Framer"];

const RESEARCH_CHIPS = [
  "Usability Testing",
  "User Interviews",
  "Qualitative Research",
  "Heuristic Evaluation",
  "Competitive Analysis",
  "A/B Testing",
];

const ROCKET_BULLETS = [
  "Owned end-to-end redesign of an AI-powered assistant embedded within the Rocket Mortgage dashboard, uncovering opportunity areas that expanded the assistant beyond transactional Q&A into guided task completion.",
  "Defined new interaction patterns, card-based components and system behaviors that supported richer, more reliable user interactions across the assistant experience.",
  "Designed high-fidelity interactive prototypes and partnered with the research team to validate concepts with Rocket Mortgage clients (n=8), setting usability success criteria and leading evaluation sessions.",
  "Presented findings and design recommendations to product stakeholders, earning strong PM buy-in and directly informing how concepts were scoped into roadmap-ready features.",
];

const TARS_BULLETS = [
  "Joined as one of the first design hires. Achieved 41% product adoption within the first quarter by owning research and interaction design for the Asimov dashboard and Slack app, enabling teams to access AI-driven assistance inside existing workflows.",
  "Designed and shipped an internal Chatbot Debug Mode for Customer Success teams that surfaced conversation flow errors in real time, cutting troubleshooting time by roughly ~70% across large-scale deployments.",
  "Built the design system from the ground up as one of the first design hires, establishing component libraries, documentation standards and handoff processes that scaled across the product.",
  "Delivered end-to-end design execution across 10 dashboard sections and 15 website pages, producing detailed developer handoff artifacts to keep design and implementation in alignment.",
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-secondary mb-4">{children}</h2>
  );
}

function SkillChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded px-2 py-1 bg-[#E7E7E7] text-xs leading-snug text-[#454545]">
      {children}
    </span>
  );
}

function ChipGroup({ title, chips }: { title: string; chips: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <SkillChip key={c}>{c}</SkillChip>
        ))}
      </div>
    </div>
  );
}

function BulletList({ items, dotClass }: { items: string[]; dotClass: string }) {
  return (
    <ul
      className="mt-4 list-none space-y-2.5 text-base leading-relaxed text-primary"
      style={{ fontFamily: "var(--font-hind), sans-serif" }}
    >
      {items.map((text) => (
        <li key={text} className="flex gap-3">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} aria-hidden />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ResumePage() {
  return (
    <div className="min-h-screen">
      <SunlightEffect className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" />
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative z-[2] mx-auto w-[min(100%,86vw)] max-w-[720px] px-4 pb-24 pt-10 sm:px-6">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1
              className="text-3xl font-normal tracking-tight text-ink sm:text-4xl"
              style={{ fontFamily: "var(--font-ovo), serif" }}
            >
              Priyamwada Pandey
            </h1>
          </div>
          <div className="shrink-0 sm:pt-1">
            <ResumeDownloadButton />
          </div>
        </header>

        <main className="space-y-12">
          <section>
            <SectionLabel>Summary</SectionLabel>
            <p
              className="text-base leading-relaxed text-primary sm:text-[17px] sm:leading-[1.65]"
              style={{ fontFamily: "var(--font-hind), sans-serif" }}
            >
              {SUMMARY}
            </p>
          </section>

          <section>
            <SectionLabel>Experience</SectionLabel>
            <div className="space-y-10">
              <article>
                <div className="flex flex-wrap items-start gap-3">
                  <div
                    className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full"
                    aria-hidden
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={RM_ICON} alt="" className="h-9 w-9 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg text-ink" style={{ fontFamily: "var(--font-hind), sans-serif" }}>
                      <span className="font-normal text-primary">Conversational AI Design Intern @ </span>
                      <span className="font-semibold">Rocket Mortgage</span>
                    </h3>
                    <p
                      className="mt-1 text-xs uppercase tracking-wide text-secondary"
                      style={{ fontFamily: "var(--font-hind), sans-serif" }}
                    >
                      DETROIT, MI <span className="mx-1.5 text-secondary/80">★</span> MAY 2025 - AUG 2025
                    </p>
                    <BulletList items={ROCKET_BULLETS} dotClass="bg-ink" />
                  </div>
                </div>
              </article>

              <article>
                <div className="flex flex-wrap items-start gap-3">
                  <div
                    className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#6D33AA]"
                    aria-hidden
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={TARS_ICON} alt="" className="h-6 w-6 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg text-ink" style={{ fontFamily: "var(--font-hind), sans-serif" }}>
                      <span className="font-normal text-primary">Product Designer @ </span>
                      <span className="font-semibold">Tars Technologies</span>
                    </h3>
                    <p
                      className="mt-1 text-xs uppercase tracking-wide text-secondary"
                      style={{ fontFamily: "var(--font-hind), sans-serif" }}
                    >
                      BENGALURU, INDIA <span className="mx-1.5 text-secondary/80">*</span> SEP 2021 – JUL 2024
                    </p>
                    <BulletList items={TARS_BULLETS} dotClass="bg-ink" />
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section>
            <SectionLabel>Skills</SectionLabel>
            <div className="space-y-6">
              <ChipGroup title="Product Design" chips={PD_CHIPS} />
              <ChipGroup title="AI-Native Prototyping" chips={AI_PROTOTYPE_CHIPS} />
              <ChipGroup title="Research & Validation" chips={RESEARCH_CHIPS} />
            </div>
          </section>

          <section>
            <SectionLabel>Education</SectionLabel>
            <div className="space-y-8" style={{ fontFamily: "var(--font-hind), sans-serif" }}>
              <div>
                <p className="text-base font-semibold text-ink">M.S. in HCI/d</p>
                <p className="mt-1 text-sm text-primary">Indiana University Bloomington</p>
                <p className="mt-2 text-xs uppercase italic tracking-wide text-secondary">MAY 2026</p>
              </div>
              <div>
                <p className="text-base font-semibold text-ink">Bachelor of Architecture</p>
                <p className="mt-1 text-sm text-primary">Amity University, India</p>
                <p className="mt-2 text-xs uppercase italic tracking-wide text-secondary">MAY 2019</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
