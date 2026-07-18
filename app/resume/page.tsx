import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SunlightEffect } from "../components/SunlightEffect";
import { ResumeDownloadButton } from "./ResumeDownloadButton";

export const metadata: Metadata = {
  title: "Resume | Priyamwada Pandey",
  description: "Resume for Priyamwada Pandey. Product Designer focused on AI-native interfaces.",
};

const RM_ICON = "/Icons/RM%20Logo%20Icon.svg";
const TARS_ICON = "/Icons/Tars%20Icon%20Logo.svg";

const SUMMARY =
  "Product Designer with 3+ years designing for enterprise and early-stage products. I have designed from zero as one of the first two designers at a conversational AI B2B SaaS startup and owned interaction design for an AI assistant embedded inside Rocket Mortgage's client-facing dashboard. I focus on high-stakes workflows where information is scattered: decision-support interfaces, agent configuration and multi-step process design.";

/** Skills — copy matches resume PDF. */
const PD_CHIPS = [
  "User-Centered Design",
  "Information Architecture",
  "Design Systems",
  "Responsive Design",
  "Accessibility",
  "Conversational UI",
  "Agentic Interfaces",
  "Agent Configuration Design",
  "AI Assistant Design",
];

const AI_PROTOTYPE_CHIPS = ["Cursor", "Claude Code", "Figma"];

const RESEARCH_CHIPS = [
  "Usability Testing",
  "Qualitative Research",
  "Interviews",
  "Heuristic Evaluations",
  "Competitive Analysis",
  "A/B Testing",
];

const ROCKET_BULLETS = [
  "Redesigned the post-offer onboarding experience inside Rocket Assist from a text-based assistant into a personalized and context-driven system grounded in each client's actual loan stage and home details.",
  "Defined three net-new interaction patterns for Rocket Assist that were taken into roadmap discussions with the product lead as candidate features for the next development cycle.",
  "Led usability testing with 8 Rocket Mortgage clients against defined success criteria; 92% rated the redesigned experience as more helpful and trustworthy than the existing assistant.",
  "Scoped design features against technical dependencies across product, engineering and research, producing handoff artifacts that were roadmap-ready at the end of a 3-month engagement.",
];

const TARS_BULLETS = [
  "Joined as one of the first two designers at Tars, establishing the design system, component library and design-dev handoff process from scratch, which served as the foundation of subsequent product work.",
  "Owned research and interaction design for the Asimov dashboard, enabling 15+ enterprise teams to configure and manage AI workflows; achieved 41% product adoption within the first quarter post-launch.",
  "Designed and shipped Chatbot Debug Mode for internal team, surfacing conversation flow errors and system issues in one place, cutting manual troubleshooting time by 70% across large-scale deployments.",
];

const TARS_INTERN_BULLETS = [
  "Built Tars' analytics feature from scratch, giving ~85 active clients their first native view of chatbot performance across 10 visualization types. Adopted across the entire active client base.",
  "Redesigned chatbot customization into a WYSIWYG interface, moving advanced controls out of the codebase and into the product and eliminating technical dependency for every active account.",
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
      className="mt-4 list-none space-y-2.5 text-[14px] leading-relaxed text-primary"
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
      <div className="relative z-[2] mx-auto w-[min(100%,86vw)] max-w-[720px] px-4 pb-24 pt-10 sm:px-6">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1
              className="text-3xl font-normal tracking-tight text-ink sm:text-4xl"
              style={{ fontFamily: "var(--font-hind), sans-serif" }}
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
              className="text-[14px] leading-relaxed text-primary"
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
                    <h3 className="text-[16px] text-ink" style={{ fontFamily: "var(--font-hind), sans-serif" }}>
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
                    <h3 className="text-[16px] text-ink" style={{ fontFamily: "var(--font-hind), sans-serif" }}>
                      <span className="font-normal text-primary">Product Designer @ </span>
                      <span className="font-semibold">Tars Technologies</span>
                    </h3>
                    <p
                      className="mt-1 text-xs uppercase tracking-wide text-secondary"
                      style={{ fontFamily: "var(--font-hind), sans-serif" }}
                    >
                      BENGALURU, INDIA <span className="mx-1.5 text-secondary/80">*</span> MAR 2022 – JUL 2024
                    </p>
                    <BulletList items={TARS_BULLETS} dotClass="bg-ink" />
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
                    <h3 className="text-[16px] text-ink" style={{ fontFamily: "var(--font-hind), sans-serif" }}>
                      <span className="font-normal text-primary">Product Design Intern @ </span>
                      <span className="font-semibold">Tars Technologies</span>
                    </h3>
                    <p
                      className="mt-1 text-xs uppercase tracking-wide text-secondary"
                      style={{ fontFamily: "var(--font-hind), sans-serif" }}
                    >
                      BENGALURU, INDIA <span className="mx-1.5 text-secondary/80">*</span> SEP 2021 – FEB 2022
                    </p>
                    <BulletList items={TARS_INTERN_BULLETS} dotClass="bg-ink" />
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section>
            <SectionLabel>Skills</SectionLabel>
            <div className="space-y-6">
              <ChipGroup title="Interaction Design" chips={PD_CHIPS} />
              <ChipGroup title="Tools" chips={AI_PROTOTYPE_CHIPS} />
              <ChipGroup title="Research & Validation" chips={RESEARCH_CHIPS} />
            </div>
          </section>

          <section>
            <SectionLabel>Education</SectionLabel>
            <div className="space-y-8" style={{ fontFamily: "var(--font-hind), sans-serif" }}>
              <div>
                <p className="text-[16px] font-semibold text-ink">MS Human-Computer Interaction</p>
                <p className="mt-1 text-[16px] text-primary">Indiana University Bloomington</p>
                <p className="mt-2 text-xs uppercase italic tracking-wide text-secondary">MAY 2026</p>
              </div>
              <div>
                <p className="text-[16px] font-semibold text-ink">Bachelor of Architecture</p>
                <p className="mt-1 text-[16px] text-primary">Amity University</p>
                <p className="mt-2 text-xs uppercase italic tracking-wide text-secondary">MAY 2019</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
