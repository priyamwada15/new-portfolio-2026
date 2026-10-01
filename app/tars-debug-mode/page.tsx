import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import AutoPauseVideo from "../components/AutoPauseVideo";
import { DebugChatPreview } from "../components/DebugChatPreview";
import ScaleToFit from "../components/ScaleToFit";
import { SectionHeader } from "../components/CaseStudySections";
import {
  brands,
  caseStudyEyebrow,
  caseStudyRowTitle,
  caseStudySubheading,
  caseStudyText,
  caseStudyTitle,
  CASE_STUDY_PAGE_BG,
  TARS_DEBUG_MODE_HERO_VIDEO,
  croppedVideoStyles,
} from "@/design-system";

const debugHeroCrop = croppedVideoStyles(TARS_DEBUG_MODE_HERO_VIDEO);

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

/** Figma image panel: page-colored fill, 1px border, 24px corners. */
const imagePanel =
  "overflow-hidden rounded-[var(--ds-radius-container)] border border-border bg-surface-page";

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
    <div className="flex shrink-0 flex-col gap-4" style={{ width: textWidth }}>
      <h3 className={caseStudyRowTitle}>{title}</h3>
      <div className={`${caseStudyText} flex flex-col gap-4`}>{children}</div>
    </div>
  );
  const panel = <div className="min-w-0 flex-1">{media}</div>;
  return (
    <div className="flex w-full items-start gap-10">
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
        { id: "impact", label: "Impact" },
        { id: "iterations", label: "Iterations" },
        { id: "reflections", label: "Reflections" },
      ]}
      accentDark={brands.tars.dark}
      accentLight={brands.tars.light}
      bodyBackgroundColor={CASE_STUDY_PAGE_BG}
      headlineClassName={caseStudyTitle}
      logos={[{ src: "/logos/tars.svg", alt: "TARS" }]}
      headline="Designing an internal debugger that cut troubleshooting time by ~70%"
      reverseHeaderOrder={true}
      heroVisual={
        // Cropped to the app window so the 24px padding is the only space around it.
        <div className="w-full rounded-[var(--ds-radius-container)] bg-surface-page p-6">
          <div className="w-full" style={debugHeroCrop.frame}>
            <AutoPauseVideo
              src={TARS_DEBUG_MODE_HERO_VIDEO.src}
              poster={TARS_DEBUG_MODE_HERO_VIDEO.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Debug Mode canvas highlighting the active gambit as it steps through the flow"
              style={debugHeroCrop.video}
            />
          </div>
        </div>
      }
      meta={{
        timeline: "Oct 2022",
        industry: "B2B SaaS",
        role: "Product Designer",
        team: "CS Team, CTO, CEO, Developers",
      }}
    >
      <section id="about">
        <SectionHeader title="What is Debug Mode?">
          <p>
            Debug Mode is a testing tool inside Tars, where teams build AI agents as visual
            flowcharts. It runs a conversation through the flow and stops on the node where it
            breaks.
          </p>
          <p>
            Before it, the CS team traced 500+ nodes by hand to find one broken link. I designed
            and shipped it within a month.
          </p>
        </SectionHeader>
      </section>

      <section id="core-features" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Core Features"
          title="The canvas follows the run and stops where it breaks"
          bodyClassName="gap-12 pt-2"
        >
          {CORE_FEATURES.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <h3 className={caseStudyRowTitle}>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </SectionHeader>

        {/* The 16:9 video has its own #FAFAFA margins baked in. The inner box crops the
            frame to just the app window (x 167–1760, y 37–1045 of 1920×1080), so the
            panel's 24px padding is the only space around it. */}
        <div className="w-full rounded-[var(--ds-radius-container)] border border-border bg-surface-page p-6">
          <div className="relative aspect-[1593/1008] w-full overflow-hidden">
            <AutoPauseVideo
              src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1784081146/New_Debug_Video_uscsz1.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Debug Mode canvas highlighting the active gambit as it steps through the flow"
              className="absolute left-[-10.48%] top-[-3.67%] aspect-video w-[120.53%] max-w-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-12 md:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <h3 className={caseStudySubheading}>Three controls that anyone can run</h3>
            <p className={caseStudyText}>
              Play/pause, stop and restart. I kept the set small enough that a client with no dev
              background could use it once Debug Mode shipped for them.
            </p>
          </div>
          <div className={`${imagePanel} relative aspect-[480/460] min-w-0 flex-1`}>
            <div className="absolute inset-x-[8.33%] top-10 bottom-0">
              <ScaleToFit width={368} height={760}>
                <DebugChatPreview autoPlay />
              </ScaleToFit>
            </div>
          </div>
        </div>
      </section>

      <section id="impact">
        <SectionHeader
          eyebrow="Impact"
          title="Debug Mode became part of every chatbot update"
          bodyClassName="gap-6 pt-2"
        >
          <p>
            On the release call, Tars&rsquo; CEO described a CS team member starting a run and
            moving on to other work.
          </p>
          <div className="flex flex-col gap-4">
            <p className={caseStudyEyebrow}>Troubleshooting Time</p>
            <div className="flex flex-col gap-2">
              <p className="font-label text-[32px] font-bold leading-none text-ink">~70%</p>
              <p>Time that used to go into tracing broken flows by hand.</p>
            </div>
          </div>
        </SectionHeader>
      </section>

      <section id="iterations" className="flex flex-col gap-[120px]">
        <div className="flex flex-col gap-14">
          <SectionHeader
            eyebrow="Iterations"
            title="Iteration 1: Three status colors down to one signal"
          >
            {null}
          </SectionHeader>

          <IterationRow title="Before" textWidth={300} media={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/new-debug-mode/Before%20Gambit%20Canvas.avif"
              alt="Tars gambit canvas with 500+ nodes, all in the same blue"
              className="block h-auto w-full rounded-[var(--ds-radius-container)] border border-border"
            />
          }>
            <p>
              The canvas I was designing for had 500+ nodes and all of them had the same visual
              treatment.
            </p>
          </IterationRow>

          <IterationRow title="Design Iteration" textWidth={300} mediaSide="left" media={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/new-debug-mode/Color%20Coded%20States.avif"
              alt="Color-coded gambit states prototype with yellow, green and red status colors"
              className="block h-auto w-full rounded-[var(--ds-radius-container)] border border-border"
            />
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

          <IterationRow title="Shipped Design" textWidth={300} media={
            <div className={`${imagePanel} aspect-[668/526]`}>
              <AutoPauseVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775950124/Shipped_Details_nilvsq.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Debug Mode canvas showing the single-signal active state and connector animation"
                className="h-full w-full object-cover"
              />
            </div>
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

          <IterationRow title="Design Iteration" textWidth={420} media={
            <div className={`${imagePanel} relative aspect-[548/447]`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-debug-mode/Complex%20Controls.avif"
                alt="First debugger prototype with six code-editor style controls"
                className="absolute left-1/2 top-[8.95%] h-auto w-[85.04%] -translate-x-1/2 rounded-t-[30px] shadow-[0_0_12px_2.25px_rgba(0,0,0,0.04)]"
              />
            </div>
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

          <IterationRow title="Shipped Design" textWidth={420} mediaSide="left" media={
            <div className={`${imagePanel} relative aspect-[548/447]`}>
              <div className="absolute inset-x-[7.48%] top-[8.95%] bottom-0">
                <ScaleToFit width={368} height={760}>
                  <DebugChatPreview autoPlay />
                </ScaleToFit>
              </div>
            </div>
          }>
            <p>
              I kept play/pause, stop and restart, with a status line that says what the debugger
              is doing at any moment.
            </p>
            <p>
              Within a couple of months, 90% of the errors the CS team ran into came from small
              control changes or API and custom code issues that were reported via the debugger.
              These three basic controls covered all of them.
            </p>
          </IterationRow>

          <IterationRow title="Shelved Design" textWidth={472} media={
            <div className={`${imagePanel} relative aspect-[496/506]`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-debug-mode/ChatbotPreview%20Console%20Window.avif"
                alt="Shelved debug console prototype showing detailed error logs and API responses"
                className="absolute bottom-[7.91%] left-1/2 h-auto w-[83.47%] max-w-none -translate-x-1/2"
              />
            </div>
          }>
            <p>
              The debugging console was never shipped. I had designed it as a way to surface
              deeper error reports, but once V1 launched, the CS team found the simpler interface
              handled nearly every issue.
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
