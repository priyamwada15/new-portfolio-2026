import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import AutoPauseVideo from "../components/AutoPauseVideo";
import { DebugChatPreview } from "../components/DebugChatPreview";
import ScaleToFit from "../components/ScaleToFit";
import SectionLabel from "../components/SectionLabel";
import VisibilityMount from "../components/VisibilityMount";
import {
  brands,
  caseStudyBody,
  caseStudyH2,
  caseStudySectionBody,
  caseStudySectionH2,
  SITE_DEFAULT_PAGE_BG,
  TARS_DEBUG_MODE_HERO_VIDEO,
} from "@/design-system";

export const metadata: Metadata = {
  title: "Debug Mode | Priyamwada Pandey",
  description:
    "I designed and shipped a debug tool that reduced testing time by ~70%, for two distinct user groups.",
};

const TLDR_ROWS = [
  {
    label: "Problem",
    text: "Tars lets enterprise teams build AI agents as visual flowcharts, but debugging large 500-node canvases meant manually tracing every node to find a broken node.",
  },
  {
    label: "Solution",
    text: "I designed and shipped Debug Mode, an automated test runner with one interface tailored to two technical audiences through a signal canvas and adaptive controls.",
  },
  {
    label: "Contribution",
    text: "Troubleshooting time dropped by ~70%, validated post-release. Shipped in a month, full release, still in use.",
  },
] as const;

function PlaceholderSection({ id, label }: { id: string; label: string }) {
  return (
    <section id={id}>
      <SectionLabel>{label}</SectionLabel>
      <h2 className={`${caseStudyH2} mb-10`}>{label}</h2>
      <p className={caseStudyBody}>Content coming soon.</p>
    </section>
  );
}

function IterationBadge({ tone }: { tone: "iteration" | "shipped" }) {
  const isShipped = tone === "shipped";
  return (
    <span
      className="inline-flex w-fit items-center justify-center rounded font-mono text-[12px] font-medium uppercase"
      style={{
        padding: "6px 12px",
        background: isShipped ? "#EBFAEB" : "#EBF5FF",
        color: isShipped ? "#297A3A" : "#0068D6",
        border: isShipped
          ? "1px solid rgba(41, 122, 58, 0.5)"
          : "1px solid rgba(0, 98, 209, 0.5)",
      }}
    >
      {isShipped ? "Shipped" : "Design Iteration"}
    </span>
  );
}

function EvolutionCard({
  tone,
  description,
  children,
}: {
  tone: "iteration" | "shipped";
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="w-full md:flex-1 overflow-hidden flex flex-col gap-6 bg-surface-media rounded-[24px]"
      style={{ aspectRatio: "364 / 450", padding: "24px 24px 0" }}
    >
      <div className="flex flex-col gap-3">
        <IterationBadge tone={tone} />
        <p className="font-label text-[14px] font-medium leading-[160%] text-primary">
          {description}
        </p>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export default function DebugModePage() {
  return (
    <CaseStudyLayout
      accentDark="#6D33AA"
      accentLight="#E2D6EE"
      bodyBackgroundColor={SITE_DEFAULT_PAGE_BG}
      headlineColor="#333333"
      contentBodyClassName={caseStudyBody}
      sectionBodyClassName={caseStudySectionBody}
      logos={[{ src: "/logos/tars.svg", alt: "TARS" }]}
      projectName="Debug Mode for Tars"
      breadcrumbLabel="Tars"
      headline="Designed an internal debugger for Tars' CS team, cutting troubleshooting time by ~70%."
      reverseHeaderOrder={true}
      heroVisual={
        <AutoPauseVideo
          src={TARS_DEBUG_MODE_HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Debug Mode — Tars canvas with active gambit highlighted"
          className="block w-full rounded-2xl"
        />
      }
      contextVisualBelow={true}
      contextLabel="TL;DR"
      context={
        <div className="flex flex-col gap-14">
          <h2 className={caseStudySectionH2}>TL;DR</h2>
          <div className="flex flex-col gap-14">
            {TLDR_ROWS.map((row) => (
              <div
                key={row.label}
                className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-8"
              >
                <p className="font-label text-[20px] font-medium text-secondary md:w-[140px] md:flex-none">
                  {row.label}
                </p>
                <p className={`${caseStudyBody} md:max-w-[392px]`}>{row.text}</p>
              </div>
            ))}
          </div>
        </div>
      }
      hideContextLabel={true}
      meta={{
        timeline: "Oct 2022",
        industry: "B2B SaaS",
        role: "Product Designer",
        team: "CS Team, CTO, CEO, Developers",
      }}
      toc={[
        { id: "core-features", label: "Core Features" },
        { id: "impact", label: "Impact" },
        { id: "context-section", label: "Context" },
        { id: "design-evolutions", label: "Design Evolutions" },
        { id: "scope-decisions", label: "Scope Decisions" },
        { id: "in-hindsight", label: "In Hindsight" },
      ]}
    >
      {/* Core Features */}
      <section id="core-features">
        <SectionLabel>Core Features</SectionLabel>
        <h2 className={`${caseStudySectionH2} mb-10`}>
          One glance tells if the flow is healthy
        </h2>

        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-16">
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="font-label text-[20px] font-medium text-primary">
                  Single-signal canvas
                </h3>
                <p className={caseStudyBody}>
                  Shows exactly where the debugger is at every node, so the CS
                  team don&apos;t lose their place and don&apos;t have to
                  scroll back to the start.
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="font-label text-[20px] font-medium text-primary">
                  Failing node, highlighted automatically
                </h3>
                <p className={caseStudyBody}>
                  When the system identifies a connection break between two
                  nodes, the first node turns red and the canvas zooms
                  straight to it, so the CS team can go in and see exactly
                  what needs fixing.
                </p>
              </div>
            </div>
            <div
              className="w-full overflow-hidden rounded-[18px]"
              style={{
                aspectRatio: "768 / 524",
                boxShadow: "inset 0 0 0 1.5px var(--ds-border-media)",
              }}
            >
              <AutoPauseVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1784081146/New_Debug_Video_uscsz1.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Debug Mode canvas highlighting the active gambit as it steps through the flow"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div
              className="w-full md:flex-1 overflow-hidden bg-surface-media rounded-[24px]"
              style={{ aspectRatio: "364 / 450", padding: "24px 24px 0" }}
            >
              <ScaleToFit width={368} height={760}>
                <DebugChatPreview autoPlay />
              </ScaleToFit>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="font-label text-[20px] font-medium text-primary">
                Simple and clear controls
              </h3>
              <p className={caseStudyBody}>
                Play/pause, stop, restart. These same three controls work for
                the CS team and for a client with no dev background.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact">
        <SectionLabel>Impact</SectionLabel>
        <h2 className={`${caseStudySectionH2} mb-6`}>
          Faster troubleshooting, strong adoption and lasting trust
        </h2>

        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-[88px]">
          <div className="flex-1 md:max-w-[320px]">
            <SectionLabel>Faster Troubleshooting</SectionLabel>
            <p className="font-label text-[48px] font-bold leading-[48px] text-ink">
              ~70%
            </p>
            <p className={`${caseStudyBody} mt-4`}>
              Troubleshooting time dropped by roughly 70% post-release, time
              that used to go entirely into manually tracing broken flows.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-12">
            <div>
              <SectionLabel>Became the team&apos;s default workflow</SectionLabel>
              <p className={caseStudyBody}>
                The CS team started running Debug Mode every time a chatbot
                changed, often multiple passes in a single update.
              </p>
            </div>
            <div>
              <SectionLabel>Earned enough trust to fade into the background</SectionLabel>
              <p className={caseStudyBody}>
                On the release call, Tars&apos; CEO described watching a CS
                team member start a test run, switch to other work, and check
                back only occasionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Context */}
      <section id="context-section">
        <SectionLabel>Context</SectionLabel>
        <h2 className={`${caseStudySectionH2} mb-[33px]`}>
          500 nodes in a flow, one broken link and two different users
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-label text-[20px] font-medium text-primary">
              Problem: Finding failures in large flows was painfully manual
            </h3>
            <div className="space-y-5">
              <p className={caseStudyBody}>
                The CS team was losing hours debugging chatbots with 500+
                nodes. Identifying where a flow broke meant manually
                searching through the huge canvas for the error, losing
                their place, restarting from the beginning, and repeating
                this process.
              </p>
              <p className={caseStudyBody}>
                Navigating this visually complex canvas was the bottleneck
                that was costing turn-around-time for enterprise clients.
              </p>
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new-debug-mode/Before%20Gambit%20Canvas.png"
            alt="Tars gambit canvas with 500+ nodes before Debug Mode"
            className="w-full rounded-[24px] border border-[#E8E8E8]"
            style={{ display: "block" }}
          />

          <div className="flex flex-col gap-2">
            <h3 className="font-label text-[20px] font-medium text-primary">
              Constraint: The same tool had to serve two very different users
            </h3>
            <p className={caseStudyBody}>
              The CS team needed detailed debugging signals like API errors
              and JSON, while clients would eventually need a much simpler
              experience. Rather than compromise both, we scoped Debug
              Mode&apos;s first release for the CS team, using their feedback
              to inform a future client-facing version.
            </p>
          </div>
        </div>
      </section>

      {/* Design Evolutions */}
      <section id="design-evolutions">
        <SectionLabel>Design Evolutions</SectionLabel>
        <h2 className={`${caseStudySectionH2} mb-10`}>
          Iteration 1: One signal instead of three
        </h2>

        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-label text-[20px] font-medium text-primary">
                Why didn&apos;t this work?
              </h3>
              <p className={caseStudyBody}>
                Three status colors (active, passed, error) layered onto
                500+ blue nodes created more visual noise than clarity.
              </p>
            </div>
            <div className="w-full flex flex-col gap-6 bg-surface-media rounded-[24px] p-6">
              <IterationBadge tone="iteration" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-debug-mode/Color%20Coded%20States.png"
                alt="Color-coded gambit states prototype with yellow, green, and red status colors"
                className="w-full rounded-lg border border-[#E9EAEB]"
                style={{ aspectRatio: "720 / 514.34", display: "block", objectFit: "cover" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-label text-[20px] font-medium text-primary">
                The shipped solution
              </h3>
              <div className="space-y-5">
                <p className={caseStudyBody}>
                  Instead of relying on multiple colors, I designed the
                  active step to be the single visual focus: full opacity
                  with a subtle glow while the rest of the canvas faded to
                  40%. Animated connector lines previewed the execution
                  path.
                </p>
                <p className={caseStudyBody}>
                  When something broke, the run paused automatically at
                  that unresolved node. The failing node would turn red and
                  the canvas zoomed directly to it.
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-6 bg-surface-media rounded-[24px] p-6">
              <IterationBadge tone="shipped" />
              <div
                className="w-full overflow-hidden rounded-[18px]"
                style={{
                  aspectRatio: "720 / 524",
                  boxShadow: "inset 0 0 0 1.5px var(--ds-border-media)",
                }}
              >
                <AutoPauseVideo
                  src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775950124/Shipped_Details_nilvsq.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Debug Mode canvas showing the single-signal active state and connector animation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <h2 className={`${caseStudySectionH2} mt-[88px] mb-10`}>
          Iteration 2: Six debugger controls down to three
        </h2>

        <div className="flex flex-col gap-14">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <EvolutionCard
              tone="iteration"
              description="Multiple controls that would have complicated the workflow."
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-debug-mode/Complex%20Controls.png"
                alt="Complex six-control debugger interface prototype"
                className="w-full h-full object-cover object-top"
              />
            </EvolutionCard>
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="font-label text-[20px] font-medium text-primary">
                Why didn&apos;t this work?
              </h3>
              <div className="space-y-3">
                <p className="font-label text-[14px] font-normal leading-[160%] text-secondary">
                  The first version featured traditional IDE conventions:
                  play/pause, stop, step into, step out, step over, logs.
                </p>
                <p className="font-label text-[14px] font-normal leading-[160%] text-secondary">
                  The CS team could read it, but these advanced controls
                  were where non-technical clients would stall. This
                  wasn&apos;t a scalable design.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <EvolutionCard
              tone="shipped"
              description="3 simple and basic controls that didn't complicate things and got the job done."
            >
              <ScaleToFit width={368} height={760}>
                <DebugChatPreview autoPlay />
              </ScaleToFit>
            </EvolutionCard>
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="font-label text-[20px] font-medium text-primary">
                The shipped solution
              </h3>
              <div className="space-y-3">
                <p className="font-label text-[14px] font-normal leading-[160%] text-secondary">
                  I shipped three controls and status messages stated
                  clearly, so nothing about what the tool was doing had to
                  be inferred.
                </p>
                <p className="font-label text-[14px] font-normal leading-[160%] text-secondary">
                  That cut held up against real usage. Within a couple
                  months, 90% of errors traced back to minor control
                  changes or API and custom code issues, the exact cases
                  the three-control version already covered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scope Decisions */}
      <section id="scope-decisions" className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex-1 md:max-w-[372px] flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <SectionLabel>Scope Decisions</SectionLabel>
            <h2 className={caseStudySectionH2}>
              Shipping in phases and shelving the debug console
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-label text-[14px] font-normal leading-[160%] text-secondary">
              The first release focused on the CS team. As enterprise
              onboarding accelerated, reducing their debugging time mattered
              more than waiting for a version that served everyone.
              Shipping in phases let us solve the immediate problem first.
            </p>
            <p className="font-label text-[14px] font-normal leading-[160%] text-secondary">
              The debugging console never shipped. I had designed it as a
              way to surface deeper error reports, but once V1 launched,
              the CS team found the simpler interface handled nearly every
              issue. Since engineering support was rarely needed, the
              console was shelved.
            </p>
          </div>
        </div>

        <div className="w-full md:w-[364px] md:flex-none flex flex-col items-center gap-6 bg-surface-media rounded-[24px] p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new-debug-mode/ChatbotPreview%20Console%20Window.png"
            alt="Shelved debug console prototype showing detailed error logs and API responses"
            className="w-full rounded-2xl"
            style={{ display: "block" }}
          />
          <p className="font-label text-[14px] font-medium leading-[160%] text-primary text-center">
            The debug console design that was shelved
          </p>
        </div>
      </section>
      {/* In Hindsight */}
      <section id="in-hindsight">
        <SectionLabel>In Hindsight</SectionLabel>
        <h2 className={`${caseStudySectionH2} mb-8`}>What I&apos;d add today</h2>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-label text-[20px] font-medium text-primary">
              Passive notifications
            </h3>
            <p className={caseStudyBody}>
              Watching the CS team trust the tool enough to multitask
              revealed one missing piece: they still had to look back at
              the canvas to know when a run paused. I&apos;d add sound and
              desktop notifications so the debugger could actively alert
              them.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-label text-[20px] font-medium text-primary">
                Surface run health at a glance
              </h3>
              <p className={caseStudyBody}>
                While the canvas showed where failures occurred,
                understanding the overall health of a test still required
                scanning the flow. I&apos;d add status pills summarizing
                nodes tested, errors found, and run progress, giving the
                team an at-a-glance view of each run.
              </p>
            </div>
            <div
              className="w-full overflow-hidden rounded-[24px] border border-[#E9EAEB]"
              style={{ aspectRatio: "768 / 604.85" }}
            >
              <VisibilityMount>
                <ScaleToFit width={696} height={720}>
                  <iframe
                    src="/new-debug-mode/Debug%20Mode%20Test%20Run%20Prototype/Debug%20Mode%20Test%20Run.dc.html"
                    title="Debug Mode test run prototype with run health status pills"
                    width={696}
                    height={720}
                    scrolling="no"
                    className="border-0"
                  />
                </ScaleToFit>
              </VisibilityMount>
            </div>
          </div>
        </div>
      </section>
    </CaseStudyLayout>
  );
}
