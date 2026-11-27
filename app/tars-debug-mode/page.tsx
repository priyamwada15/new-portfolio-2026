import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import AutoPauseVideo from "../components/AutoPauseVideo";
import { DebugChatPreview } from "../components/DebugChatPreview";
import ScaleToFit from "../components/ScaleToFit";
import { MediaWash, WASH_SCREEN_EDGE, washShadow } from "../components/MediaWash";
import { DebugModeEmbed } from "../home-v2/DebugModeEmbed";
import { CaseStudySummary, SectionHeader } from "../components/CaseStudySections";
import {
  caseStudyRowTitle,
  caseStudySubheading,
  caseStudyText,
  caseStudyTitle,
  CASE_STUDY_PAGE_BG,
} from "@/design-system";

export const metadata: Metadata = {
  title: "Debug Mode for Tars | Internal Tools Design Case Study | Priyamwada Pandey",
  description:
    "I designed and shipped Debug Mode, an internal debugger for Tars that cut troubleshooting time by ~70%.",
  keywords: [
    "internal tools design",
    "developer tools UX",
    "B2B SaaS design case study",
    "enterprise software UX",
    "product designer portfolio",
  ],
};

const CORE_FEATURES = [
  {
    title: "The active node stays in focus",
    text: "The canvas tracks the debugger node by node, so the CS team doesn't lose their place in a 500 node flow.",
  },
  {
    title: "Failures surface on their own",
    text: "When a connection breaks, the run pauses on that node and the canvas zooms straight to it in red.",
  },
];

/**
 * Text column (fixed Figma width) beside a media panel that fills the rest of the
 * row, 40px apart and top-aligned. `mediaSide` alternates the panel's side.
 */
function IterationRow({
  title,
  textWidth,
  mediaSide = "right",
  media,
  children,
}: {
  title: string;
  textWidth: number;
  mediaSide?: "left" | "right";
  media: React.ReactNode;
  children: React.ReactNode;
}) {
  const text = (
    <div className="flex shrink-0 flex-col gap-2 max-md:w-full! md:max-lg:w-[calc(50%-20px)]!" style={{ width: textWidth }}>
      <h3 className={caseStudyRowTitle}>{title}</h3>
      <div className={`${caseStudyText} flex flex-col gap-2`}>{children}</div>
    </div>
  );
  const panel = <div className="min-w-0 flex-1 max-md:order-first max-md:w-full max-md:flex-none">{media}</div>;
  // Phones stack media above text, like MediaRow; tablets split the row evenly.
  return (
    <div className="flex w-full items-start gap-10 max-md:flex-col max-md:items-stretch max-md:gap-6">
      {mediaSide === "left" ? panel : text}
      {mediaSide === "left" ? text : panel}
    </div>
  );
}

export default function DebugModePage() {
  return (
    <CaseStudyLayout
      sept2026Layout
      sideToc={[
        { id: "about", label: "Overview" },
        { id: "core-features", label: "Core features" },
        { id: "iterations", label: "Iterations" },
        { id: "reflections", label: "Reflections" },
      ]}
      accentDark="var(--ds-case-study-accent)"
      accentLight="var(--ds-case-study-accent-light)"
      bodyBackgroundColor={CASE_STUDY_PAGE_BG}
      headlineClassName={caseStudyTitle}
      logos={[{ src: "/logos/tars.svg", alt: "TARS" }]}
      headline="Designing an internal debugger that cut troubleshooting time by ~70%"
      reverseHeaderOrder
      heroVisual={
        <MediaWash tone="tars" className="aspect-[1008/575] w-full">
          <DebugModeEmbed />
        </MediaWash>
      }
      meta={{
        timeline: "Oct 2022",
        industry: "B2B SaaS",
        role: "Product Designer",
        team: "CS Team, Founders, Developers",
        items: [
          { label: "Shipped", value: "Oct 2022" },
          { label: "Scope", value: "Internal Tools, Complex Workflows" },
          { label: "Team", value: "CS Team, Founders, Developers, Me" },
          { label: "Contribution", value: "Product & Interaction Design" },
        ],
      }}
    >
      <section id="about" className="flex flex-col gap-8">
        <SectionHeader title="What is Debug Mode?">
          <p>
            Debug Mode is a testing tool inside Tars, where teams build AI agents as visual
            flowcharts. It runs a conversation through the flow and stops on the node where it
            breaks.
          </p>
          <p>
            Before it, the CS team traced 500+ nodes by hand to find one broken link. 
          </p>
        </SectionHeader>
        <CaseStudySummary
          rows={[
            {
              label: "Goal",
              text: "Cut the CS team’s turnaround on troubleshooting enterprise client agents.",
            },
            {
              label: "My role",
              text: "I designed and shipped Debug Mode in a month, working with the CS team, founders and developers.",
            },
            {
              label: "Impact",
              text: "About 70% less troubleshooting time: 2–3 hours of active debugging became 0.5 hours of testing, and the CS team can start a run and work on something else.",
            },
          ]}
        />
      </section>

      <section id="core-features" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Core Features"
          title="The canvas follows the run and stops where it breaks"
          bodyClassName="gap-12 pt-2"
        >
          {CORE_FEATURES.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <h3 className={caseStudyRowTitle}>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </SectionHeader>

        <div className="flex flex-col gap-10 md:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h3 className={caseStudySubheading}>Three controls that anyone can run</h3>
            <p className={caseStudyText}>
              Play/pause, stop and restart. I kept the set small enough that a client with no dev
              background could use it once Debug Mode shipped for them.
            </p>
          </div>
          <MediaWash tone="tars" className="aspect-[480/460] min-w-0 flex-1">
            <div className="absolute inset-x-[8.33%] top-10 bottom-0">
              <ScaleToFit width={368} height={760}>
                <DebugChatPreview autoPlay />
              </ScaleToFit>
            </div>
          </MediaWash>
        </div>
      </section>

      <section id="iterations" className="flex flex-col gap-[120px] max-md:gap-20">
        <div className="flex flex-col gap-14">
          <SectionHeader
            eyebrow="Iterations"
            title="Iteration 1: One signal beat three status colors"
          >
            {null}
          </SectionHeader>

          <IterationRow title="500+ nodes, all treated the same" textWidth={300} media={
            <MediaWash tone="tars" className="px-8 pt-8 max-md:px-4 max-md:pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-debug-mode/Before%20Gambit%20Canvas.avif"
                alt="Tars gambit canvas with 500+ nodes, all in the same blue"
                className="block h-auto w-full rounded-t-[10px]"
                style={{ boxShadow: washShadow(), border: WASH_SCREEN_EDGE, borderBottom: 0 }}
              />
            </MediaWash>
          }>
            <p>
              The canvas I was designing for had 500+ nodes and all of them had the same visual
              treatment.
            </p>
          </IterationRow>

          <IterationRow title="My first idea: color-code every status" textWidth={300} mediaSide="left" media={
            <MediaWash tone="tars" className="px-8 pt-8 max-md:px-4 max-md:pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-debug-mode/Color%20Coded%20States.avif"
                alt="Color-coded gambit states prototype with yellow, green and red status colors"
                className="block h-auto w-full rounded-t-[10px]"
                style={{ boxShadow: washShadow(), border: WASH_SCREEN_EDGE, borderBottom: 0 }}
              />
            </MediaWash>
          }>
            <p>
              My first idea was to color code every node by status. I soon realized while testing
              that adding three more colors on top of all that blue made the one failing node
              harder to find.
            </p>
            <p>
              It also made the canvas more chaotic, which was something I wanted to avoid.
            </p>
          </IterationRow>

          <IterationRow title="Shipped: only the active node stands out" textWidth={300} media={
            <MediaWash tone="tars" className="aspect-[668/526]">
              <div
                className="absolute bottom-0 left-8 right-8 top-8 overflow-hidden rounded-t-[10px] max-md:left-4 max-md:right-4 max-md:top-4"
                style={{ boxShadow: washShadow(), border: WASH_SCREEN_EDGE, borderBottom: 0 }}
              >
              <AutoPauseVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/q_auto/v1775950124/Shipped_Details_nilvsq.mp4"
                poster="https://res.cloudinary.com/dh9rvf2hh/video/upload/so_0,q_auto/v1775950124/Shipped_Details_nilvsq.jpg"
                muted
                loop
                playsInline
                preload="none"
                aria-label="Debug Mode canvas showing the single-signal active state and connector animation"
                className="h-full w-full object-cover"
              />
              </div>
            </MediaWash>
          }>
            <p>
              I dropped the status colors and made the active node the only thing that stands
              out. It stays at full opacity while the rest of the canvas fades to 40%.
            </p>
            <p>
              The failure node still needed to stand out from the other nodes, so I retained the
              standard &lsquo;red-failure&rsquo; treatment for it.
            </p>
          </IterationRow>
        </div>

        <div className="flex flex-col gap-14">
          <SectionHeader title="Iteration 2: Dropping the code editor conventions">
            {null}
          </SectionHeader>

          <IterationRow title="My first version borrowed code-editor controls" textWidth={420} media={
            <MediaWash tone="tars" className="aspect-[548/447]">
              <div
                className="absolute inset-x-[7.48%] top-[8.95%] bottom-0 overflow-hidden rounded-t-[10px]"
                style={{ boxShadow: washShadow(), border: WASH_SCREEN_EDGE, borderBottom: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/new-debug-mode/Borrowed%20Controls.avif"
                  alt="First debugger prototype with six code-editor style controls above the chat preview"
                  className="block h-auto w-full"
                />
              </div>
            </MediaWash>
          }>
            <p>
              My first version borrowed from code editors: play/pause, stop, step into, step out,
              step over and logs. The CS team could work with it.
            </p>
            <p>
              However, clients were going to use this tool next, and for anyone without a dev
              background the step controls are where they&rsquo;d get stuck.
            </p>
          </IterationRow>

          <IterationRow title="Shipped: play/pause, stop and restart" textWidth={420} mediaSide="left" media={
            <MediaWash tone="tars" className="aspect-[548/447]">
              <div className="absolute inset-x-[7.48%] top-[8.95%] bottom-0">
                <ScaleToFit width={368} height={760}>
                  <DebugChatPreview autoPlay />
                </ScaleToFit>
              </div>
            </MediaWash>
          }>
            <p>
              The three controls stayed, with a status line that says what the debugger is doing at any moment.
            </p>
            <p>
              Within a couple of months, 90% of the errors the CS team ran into came from small
              control changes or API and custom code issues that were reported via the debugger.
              These three basic controls covered all of them.
            </p>
          </IterationRow>

          <IterationRow title="Shelved: the debug console, because the simple version was enough" textWidth={472} media={
            <MediaWash tone="tars" className="aspect-[496/506]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-debug-mode/ChatbotPreview%20Console%20Window.avif"
                alt="Shelved debug console prototype showing detailed error logs and API responses"
                className="absolute bottom-[7.91%] left-1/2 h-auto w-[83.47%] max-w-none -translate-x-1/2"
              />
            </MediaWash>
          }>
            <p>
              The debugging console was never shipped. I had designed it as a way to surface
              deeper error reports, but the three controls turned out to be enough.
            </p>
            <p>Since engineering support was rarely needed, the console was shelved.</p>
          </IterationRow>
        </div>
      </section>

      <section id="reflections">
        <SectionHeader eyebrow="Reflections" title="Runs should call people back">
          <p>
            Once the CS team started leaving runs on their own, they still had to keep checking
            the canvas to see if one had paused.
          </p>
          <p>I&rsquo;d add sound and desktop notifications so Debug Mode could tell them.</p>
        </SectionHeader>
      </section>
    </CaseStudyLayout>
  );
}
