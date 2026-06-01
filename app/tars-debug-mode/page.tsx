import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import DarkVideoFrame from "../components/DarkVideoFrame";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import { DebugChatPreview } from "../components/DebugChatPreview";
import VisualCaption from "../components/VisualCaption";
import SectionLabel from "../components/SectionLabel";
import IterationLabel from "../components/IterationLabel";
import {
  brands,
  caseStudyBody,
  caseStudyH2,
  caseStudySectionBody,
  caseStudySectionTag,
  SITE_DEFAULT_PAGE_BG,
  TARS_DEBUG_MODE_HERO_VIDEO,
} from "@/design-system";

export const metadata: Metadata = {
  title: "Debug Mode | Priyamwada Pandey",
  description:
    "I designed and shipped a debug tool that reduced testing time by ~70%, for two distinct user groups.",
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E\")";

function DarkHeader({ tag, headline, bgImage }: { tag: string; headline: string; bgImage?: string }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl min-[400px]:rounded-[28px]"
      style={{
        backgroundColor: "#111111",
        backgroundImage: NOISE,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        padding: "72px 48px",
        textAlign: "center",
      }}
    >
      {/* Ghost image layer */}
      {bgImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.12, mixBlendMode: "luminosity" }}
        />
      )}

      {/* Text content */}
      <div className="relative">
        <p
          className={caseStudySectionTag}
          style={{ color: "#AEAEAE" }}
        >
          {tag}
        </p>
        <h2
          className="text-2xl md:text-[36px] font-normal leading-tight"
          style={{
            fontFamily: "var(--font-hind), sans-serif",
            color: "#FAFAFA",
            textWrap: "balance" as React.CSSProperties["textWrap"],
            maxWidth: "760px",
            margin: "0 auto",
          }}
        >
          {headline}
        </h2>
      </div>
    </div>
  );
}


export default function DebugModePage() {
  return (
    <CaseStudyLayout
      accentDark="#6D33AA"
      accentLight="#E2D6EE"
      bodyBackgroundColor={SITE_DEFAULT_PAGE_BG}
      headlineFont="figtree"
      headlineColor="#333333"
      contentBodyClassName={caseStudyBody}
      sectionBodyClassName={caseStudySectionBody}
      tocLinkFontFamily="var(--font-hind), sans-serif"
      logos={[{ src: "/logos/tars.svg", alt: "TARS" }]}
      projectName="Debug Mode for Tars"
      headline="Designed a debugging feature that tests enterprise AI assistants and stops the moment something breaks. Shipped in a month and it cut manual debugging efforts by 70%."
      reverseHeaderOrder={true}
      heroVisual={
        <video
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
      context={
        <>
          <p className="mb-6">Tars is a B2B platform where enterprise AI agents are built as visual flowcharts. Each node is a single conversational turn called a gambit. An enterprise banking chatbot could have 500 of them, and when something breaks in a workflow that size, finding it manually means scrolling through hundreds of nodes and starting over.</p>
          <p>I designed and shipped Debug Mode, an automated end-to-end test runner that highlights the active gambit, auto-scrolls the canvas, and stops the moment something breaks. I designed for two user types with fundamentally different technical backgrounds.</p>
          <div className="flex flex-row items-center gap-2 mt-8">
            <div className="flex flex-col gap-5 flex-1">
              <p style={{ fontFamily: "var(--font-hind), sans-serif", fontWeight: 600, fontSize: 14, lineHeight: "19px", color: "#555555" }}>Shipped (full-release)</p>
              <p style={{ fontFamily: "var(--font-hind), sans-serif", fontWeight: 400, fontSize: 48, lineHeight: "54px", color: "#6D33AA" }}>1 month</p>
            </div>
            <div className="flex flex-col gap-5 flex-1">
              <p style={{ fontFamily: "var(--font-hind), sans-serif", fontWeight: 600, fontSize: 14, lineHeight: "19px", color: "#555555" }}>Troubleshooting time cut by</p>
              <p style={{ fontFamily: "var(--font-hind), sans-serif", fontWeight: 400, fontSize: 48, lineHeight: "54px", color: "#6D33AA" }}>~70%</p>
            </div>
          </div>
        </>
      }
      hideContextLabel={true}
      contextVisual={
        <>
          <BeforeAfterSlider
            beforeSrc="/Debug_Before.png"
            afterSrc="/Debug_After.png"
            beforeAlt="Tars canvas without Debug Mode"
            afterAlt="Tars canvas with Debug Mode active"
            startPercent={50}
          />
          <div className="mt-8">
            <DarkVideoFrame src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775951109/Debug_Full_Design-1775951040368_vd2lrz.mp4" />
            <VisualCaption>The shipped &lsquo;Debug Mode&rsquo; feature, introduced to reduce testing time by the internal team and clients.</VisualCaption>
          </div>
        </>
      }
      meta={{
        timeline: "Oct 2022",
        industry: "B2B SaaS",
        role: "Product Designer",
        team: "CS Team, CTO, CEO, Developers",
      }}
      toc={[
        { id: "background", label: "Background" },
        { id: "design-decision-01", label: "Design Decision 01" },
        { id: "design-decision-02", label: "Design Decision 02" },
        { id: "reflection", label: "Reflection" },
      ]}
    >
      {/* Background */}
      <section id="background">
        <SectionLabel>Background</SectionLabel>
        <h2 className={`${caseStudyH2} mb-10`}>
          500 gambits, one broken path, no way to find it.
        </h2>
        <div className="space-y-5">
          <p>
            During one of the product team standups, the CTO flagged a pain
            point. The CS team was spending hours debugging chatbots, often
            getting stuck trying to identify a broken gambit in a 500+ gambit
            canvas.
          </p>
          <p>
            When I observed their workflow directly, I saw the real problem was
            mechanical. They&apos;d manually step through the chatbot flow, lose
            track of where they were, scroll back to the beginning and then
            start over. The process was draining and error-prone.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tars-user-group-viz.avif"
            alt="Two distinct user groups: CS team with technical background and clients with no technical background"
            className="w-full"
            style={{ display: "block" }}
          />
          <p>
            The constraint that emerged was non-negotiable. I needed to design
            one interface that could work for the CS team (who could read API
            errors and JSON) while also eventually scaling to clients with no
            technical background. Two completely different mental models
            supported by one feature.
          </p>
        </div>
      </section>

      {/* Design Decision 01 */}
      <section id="design-decision-01">
        <DarkHeader
          tag="Design Decision 01"
          headline="The canvas was overwhelming with three different visual signals. One was enough."
          bgImage="/tars-dd2-bg.avif"
        />

        <div className="mt-10">
          <IterationLabel>Iteration 1, Color-coded states</IterationLabel>
          <p className="font-sans text-[16px] text-secondary leading-relaxed">
            The first version used colors, yellow for active, green for passed
            and red for error. This was logical on paper but the problem showed
            up on a real canvas. 500 gambits, some overlapping, now covered in
            green and yellow and red on top of the existing blue. The color
            system was asking the canvas to communicate three things at once
            when the user only needed one: where is the debugger right now?
          </p>
        </div>

        <div className="mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Color%20Coded%20States.png"
            alt="Color-coded states: yellow for active, green for passed, red for error"
            className="w-full rounded-2xl"
            style={{ display: "block" }}
          />
          <VisualCaption>My initial design of color-coding the gambits based on their debugging state.</VisualCaption>
        </div>

        <div className="mt-10">
          <IterationLabel>Iteration 2, Single color, dashed lines and a glow</IterationLabel>
          <p className="font-sans text-[16px] text-secondary leading-relaxed mb-6">
            One signal. That&apos;s all users needed. I simplified to one. I
            stuck to the default blue and instead used opacity levels to denote
            change. The active gambit got a subtle blue glow on top of the
            opacity change. Dashed connector lines showed the path the debugger
            was taking, so users could see which branch the conversation would
            follow before it got there.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active state", value: "100% opacity + subtle blue glow" },
              { label: "Inactive state", value: "40% opacity, no color change" },
              { label: "Path signal", value: "Dashed and moving connector lines" },
              { label: "Navigation", value: "Auto-zoom follows active gambit" },
            ].map((item) => (
              <div key={item.label} className="border border-[#dcdcdc] p-4 rounded-sm">
                <p className="font-mono text-[11px] font-semibold tracking-tight uppercase text-secondary mb-1">
                  {item.label}
                </p>
                <p className="font-sans text-sm text-secondary leading-snug">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <DarkVideoFrame src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775950124/Shipped_Details_nilvsq.mp4" />
        </div>

        <div className="mt-10">
          <p className="font-sans text-[16px] text-secondary leading-relaxed">
            The original design required users to pan through the flow to
            understand test health. I refined the design to surface this
            immediately. Pills at the top surfaced total gambits tested and error
            count in one glance, shifting the mental model from &lsquo;navigate
            the flow to find problems&rsquo; to &lsquo;confirm status, then drill
            in.&rsquo;
          </p>
        </div>
      </section>

      {/* Design Decision 02 */}
      <section id="design-decision-02">
        <DarkHeader
          tag="Design Decision 02"
          headline="The CS team understood the terminal. The step controls stopped them."
          bgImage="/tars-dd1-bg.avif"
        />

        <div className="mt-10 flex flex-col md:flex-row gap-10">
          <div className="space-y-5 md:flex-1">
            <p>
              With the canvas resolved, I turned to the control panel. I modeled
              the first version on IDE debugger interfaces, the environment the
              CS team was most likely familiar with. Six controls: play/pause,
              stop, step into, step out, step over and see logs.
            </p>
            <p>
              The CS team understood the terminal immediately. Step into, step out
              and step over stopped them. If they were pausing on those controls,
              a client with no development background would be lost.
            </p>
            <p>
              A roadmap conversation happening at the same time made the answer
              clear. An SMB client managing their own chatbot and an enterprise
              client with a dedicated engineering team needed different things from
              this tool. The advanced controls weren&apos;t wrong, they were
              intended for a different release.
            </p>
          </div>

          <div className="md:flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Six%20Controls%20and%20a%20Log%20Panel.png"
              alt="Six debugger controls: play/pause, stop, step into, step out, step over, and see logs"
              className="w-full rounded-2xl"
              style={{ display: "block" }}
            />
          </div>
        </div>

        <div className="mt-10">
          <IterationLabel>Iteration 2, Shipping a simpler version was the right call</IterationLabel>
          <p className="font-sans text-[16px] text-secondary leading-relaxed">
            I stripped the design to three controls: play/pause, stop, restart.
            Status messages, debugging in progress, paused, stopped, removed
            any ambiguity about what was happening without requiring the user to
            understand the canvas.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <DebugChatPreview />
        </div>
      </section>

      {/* Reflection */}
      <section id="reflection">
        <SectionLabel>Reflection</SectionLabel>
        <h2 className={`${caseStudyH2} mb-10`}>
          The right answer and the complete answer aren&apos;t always the same
          thing.
        </h2>
        <div className="space-y-5">
          <p>
            Within a couple of months of releasing the simplified design, we
            found that 90% of errors were easily resolved by making a minor
            change in the gambit controls, or were caused by API connections and
            custom code issues. The advanced controls and debug log were nice to
            think about in terms of feature sophistication, but wouldn&apos;t
            have been needed in the long-term.
          </p>
          <p>
            As a designer, you really have to account for what is actually
            needed. It is easy to get carried away and add more to a design but
            sometimes, Occam&apos;s razor is the right answer.
          </p>
        </div>
      </section>
    </CaseStudyLayout>
  );
}
