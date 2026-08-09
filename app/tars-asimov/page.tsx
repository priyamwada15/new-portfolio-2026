import { Metadata } from "next";
import Image from "next/image";
import CaseStudyLayout from "../components/CaseStudyLayout";
import SectionLabel from "../components/SectionLabel";
import AutoPauseVideo from "../components/AutoPauseVideo";
import { CoreFeatureVideo } from "./CoreFeatureVideo";
import WorkflowLoopGraphic from "./WorkflowLoopGraphic";
import KnowledgeSourcesDemo from "./KnowledgeSourcesDemo";
import { caseStudySectionH2, mediaPanel } from "@/design-system";

const CORE_FEATURES = [
  {
    title: "Knowledge Dashboard",
    description:
      "Teams connected sources like Notion and Google Drive so Asimov could answer questions using company knowledge beyond Slack. Admins could monitor sync status and control how often each source was refreshed.",
    videoSrc:
      "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/KB_Asimov_nrvbu8.mp4",
  },
  {
    title: "Integrations Hub",
    description:
      "One place to connect an app, see what it's linked to and what information Asimov is accessing from it.",
    videoSrc:
      "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/Integrations_Asimov_izfe8q.mp4",
  },
  {
    title: "Action Configuration",
    description:
      "Teams configured third-party app actions and built custom ones that, combined with Slack context, enabled Asimov to automate recurring workflows.",
    videoSrc:
      "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/Actions_Asimov_e9ezjr.mp4",
  },
] as const;

const OPPORTUNITIES = [
  {
    title: "Opportunity 1: Conversations were only the beginning",
    description: [
      "Slack conversations often triggered work elsewhere.",
      "Customer-facing teams moved from a discussion to updating HubSpot, writing reports or sharing project updates, carrying the same context across multiple tools.",
      "Summaries reduced reading time, but they didn't reduce the work that followed.",
    ],
    image: {
      src: "/new-asimov/Slack 1.png",
      alt: "Slack thread with Asimov summarizing the conversation",
      width: 352,
      height: 361,
    },
    caption: "Example scenario of Asimov summarizing threads.",
  },
  {
    title: "Opportunity 2: No two teams worked the same way",
    description: [
      "Engineering wanted GitHub workflows, sales wanted CRM updates and marketing wanted content generation. The pattern that emerged was a need for flexibility.",
      "Instead of designing automations for every use case, I designed a system that let teams define their own actions on top of connected tools.",
    ],
    image: {
      src: "/new-asimov/Slack 2.png",
      alt: "Slack thread showing Asimov integrating with another app",
      width: 352,
      height: 405,
    },
    caption: "Example scenario of Asimov integrating with other apps.",
  },
] as const;

const DEEP_DIVE_ITEMS = [
  {
    title: "Building trust through knowledge controls",
    description: [
      "Asimov's usefulness depended on the context it could access. I designed the knowledge setup experience to help teams connect relevant sources while maintaining visibility into what information the AI could use.",
      "The experience balanced flexibility with control: teams could add different knowledge sources, select specific Slack channels and monitor sync status from one place.",
    ],
    graphicOverlay: <KnowledgeSourcesDemo />,
    fillContainer: false,
  },
  {
    title: "Connecting AI to the tools teams already used",
    description: [
      "Knowledge answered questions based on databases, but real work happened in tools like HubSpot. I designed the integrations experience to make connecting external systems feel transparent, showing what was connected, what data Asimov could access and where teams could manage permissions.",
      "This helped position integrations as something teams could understand and trust, rather than a hidden system running in the background.",
    ],
    graphicOverlay: (
      <AutoPauseVideo
        src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785523382/Integrations_Preview_xayos0.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Integrations experience demo"
        className="h-full w-full object-cover"
      />
    ),
    fillContainer: true,
  },
  {
    title: "Configuring custom actions",
    description: [
      "No predefined set of actions could cover every team's workflow. Instead of shipping one-off automations, I designed a system that let teams decide what Asimov could do and define new capabilities as their needs evolved.",
      "Teams could enable or disable built-in actions for connected tools and create custom actions through a configurable schema, giving them control over both permissions and extensibility.",
    ],
    graphicOverlay: (
      <AutoPauseVideo
        src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785526992/Actions_Preview_ykwxsc.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Custom actions configuration demo"
        className="h-full w-full object-cover"
      />
    ),
    fillContainer: true,
  },
] as const;

const REFLECTIONS = [
  {
    title: "Power requires permissions, not just capabilities",
    weight: "font-medium",
    paragraphs: [
      "As Asimov evolved from a summarizer to knowledge access and taking actions, I realized that trust depended as much on permission models as on AI capabilities.",
      "Today, I would design governance alongside the feature instead of treating it as a later phase.",
    ],
  },
  {
    title: "AI products become platforms faster than you expect",
    weight: "font-medium",
    paragraphs: [
      "What started as a single Slack capability quickly expanded into a system of knowledge, integrations and custom actions.",
      "The project reinforced the importance of designing scalable foundations that can accommodate new capabilities without breaking the entire experience.",
    ],
  },
] as const;

export const metadata: Metadata = {
  title: "Asimov for Tars — AI Agent Workflow Design Case Study | Priyamwada Pandey",
  description:
    "How I designed the knowledge, integrations and custom actions system that grew Tars' Slack AI agent from a single capability to 82% pilot adoption.",
  keywords: [
    "AI product design",
    "enterprise AI UX",
    "Slack AI agent design",
    "B2B SaaS UX case study",
    "workflow automation design",
    "AI agent UX designer",
  ],
};

export default function AsimovPage() {
  return (
    <CaseStudyLayout
      accentDark="#6D33AA"
      accentLight="#E2D6EE"
      logos={[
        { src: "/logos/tars.svg", alt: "TARS" },
      ]}
      projectName="Asimov for Tars"
      breadcrumbLabel="Asimov for Tars"
      contextLabel="TL;DR"
      headline="Scaling an AI agent to 82% pilot adoption through configurable workflows"
      headlineColor="#333333"
      headlineClassName="text-[36px] font-medium leading-[140%] text-[#333333] max-tablet:text-[24px]"
      headlineStyle={{ fontWeight: 500 }}
      reverseHeaderOrder={true}
      heroVisual={
        <AutoPauseVideo
          src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785952405/Asimov_Hero_Video_jkk4zq.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Asimov for Tars, hero overview"
          className="block w-full rounded-2xl"
        />
      }
      hideContextLabel={true}
      context={
        <div className="flex max-w-[768px] flex-col items-start gap-6">
          <h2 data-dialkit="h2" className={caseStudySectionH2}>TL;DR</h2>
          <div className="flex flex-col items-start gap-4">
            <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
              As generative AI capabilities emerged in 2023, we saw an
              opportunity to rethink workplace productivity: instead of
              asking people to switch between tools, could an AI agent help
              them work directly where conversations already happened?
            </p>
            <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
              I designed Asimov from its first prototype into a broader AI
              teammate inside Slack, creating experiences for knowledge
              discovery, app integrations and automated workflows. The beta
              release helped the Tars team reduce repetitive task-related
              queries by ~74%.
            </p>
          </div>
          <div className="flex w-full flex-col gap-8 md:flex-row md:gap-12">
            {[
              { label: "Pilot adoption", value: "82%" },
              { label: "Reduction in queries", value: "~74%" },
              { label: "Positive feedback", value: "86%" },
            ].map((item) => (
              <div key={item.label} className="flex-1">
                <SectionLabel>{item.label}</SectionLabel>
                <p className="font-label text-[48px] font-semibold leading-[48px] text-ink">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      }
      meta={{
        timelineLabel: "Shipped (Beta)",
        timeline: "Jan 2024",
        industry: "B2B SaaS",
        role: "Product Designer",
        team: "Founders, Developers",
      }}
      nextProject={{
        href: "/rocket-mortgage",
        tags: "Product Design · 2025 · Rocket Mortgage",
        title:
          "I introduced interaction patterns to Rocket's AI assistant that made it to the product roadmap.",
      }}
      toc={[
        { id: "section-01", label: "Core Features" },
        { id: "section-02", label: "Opportunities & Research" },
        { id: "section-03", label: "Deep Dive" },
        { id: "constraint", label: "Blockers" },
        { id: "reflection", label: "Reflections" },
      ]}
    >
      {/* Section 01 - Core Features */}
      <section id="section-01" className="flex flex-col items-start gap-10">
        <div className="flex flex-col items-start gap-3 [&>p:first-child]:mb-0">
          <SectionLabel>Core Features</SectionLabel>
          <h2 data-dialkit="h2" className={caseStudySectionH2}>
            From thread summaries to an AI-enabled workspace
          </h2>
          <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
            The product began with a single capability: summarizing Slack
            threads. Each release expanded what Asimov could understand,
            connect to and eventually do on a team&apos;s behalf.
          </p>
        </div>

        <div className="flex flex-col items-start gap-16 self-stretch">
          {CORE_FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex flex-col items-start gap-2">
                <h3 data-dialkit="h3" className="text-[20px] font-medium leading-[140%] text-[#333333]">
                  {feature.title}
                </h3>
                <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
                  {feature.description}
                </p>
              </div>
              <CoreFeatureVideo src={feature.videoSrc} title={feature.title} />
            </div>
          ))}
        </div>
      </section>

      {/* Section 02 - Opportunities & Research */}
      <section id="section-02" className="flex flex-col items-start gap-[33px]">
        <div className="flex flex-col items-start gap-3 [&>p:first-child]:mb-0">
          <SectionLabel>Opportunities & Research</SectionLabel>
          <h2 data-dialkit="h2" className={caseStudySectionH2}>
            Designing an AI that could do more than answer
          </h2>
          <div className="flex flex-col items-start gap-4">
            <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
              I interviewed customer success, sales, engineering, design and
              marketing to understand how work moved across conversations,
              tools and teams.
            </p>
            <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
              Rather than validating a specific feature, I wanted to identify
              where an AI teammate could meaningfully participate in daily
              work and boost productivity.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-10 self-stretch">
          {OPPORTUNITIES.map((opportunity, index) => (
            <div
              key={opportunity.title}
              className={`flex flex-col items-center gap-8 self-stretch md:flex-row ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex flex-[336] flex-col items-start gap-4">
                <h3 data-dialkit="h3" className="text-[20px] font-medium leading-[140%] text-[#333333]">
                  {opportunity.title}
                </h3>
                <div className="flex flex-col items-start gap-4">
                  {opportunity.description.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[16px] font-normal leading-[160%] text-[#555555]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <div
                className={`flex w-full flex-[400] flex-col items-center gap-6 py-6 ${mediaPanel}`}
              >
                <div className="w-[88%] overflow-hidden rounded-lg border border-[#E8E8E8]">
                  <Image
                    src={opportunity.image.src}
                    alt={opportunity.image.alt}
                    width={opportunity.image.width}
                    height={opportunity.image.height}
                    className="block h-auto w-full"
                  />
                </div>
                <p className="w-full px-6 text-center text-[12px] leading-[150%] text-[#555555]">
                  {opportunity.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 03 - Deep Dive */}
      <section id="section-03" className="flex flex-col items-start gap-16">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex flex-col items-start gap-3 [&>p:first-child]:mb-0">
            <SectionLabel>Deep Dive</SectionLabel>
            <h2 data-dialkit="h2" className={caseStudySectionH2}>
              Designing the foundation for Asimov
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 self-stretch">
            <div className="flex flex-col items-start gap-4">
              <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
                Asimov&apos;s experience started with a simple setup: connect
                Slack, define knowledge sources and choose what context the AI
                could access.
              </p>
              <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
                Once configured, teams could interact with Asimov directly
                inside Slack, where it used that context to summarize
                conversations, retrieve information and complete workflows.
              </p>
            </div>
            <div
              className="aspect-[768/200] w-full min-h-[140px] overflow-hidden rounded-[var(--ds-radius-container)]"
              aria-hidden="true"
            >
              <WorkflowLoopGraphic />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-16 self-stretch">
          {DEEP_DIVE_ITEMS.map((item) => (
            <div key={item.title} className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex flex-col items-start gap-2">
                <h3 data-dialkit="h3" className="text-[20px] font-medium leading-[140%] text-[#333333]">
                  {item.title}
                </h3>
                <div className="flex flex-col items-start gap-4">
                  {item.description.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[16px] font-normal leading-[160%] text-[#555555]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <div
                className={`relative w-full overflow-hidden ${
                  item.fillContainer ? "aspect-[768/500]" : ""
                } ${mediaPanel}`}
                aria-hidden="true"
              >
                {item.graphicOverlay}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blockers */}
      <section id="constraint" className="flex flex-col items-start gap-12">
        <div className="flex flex-col items-start gap-3 [&>p:first-child]:mb-0">
          <SectionLabel>Blockers</SectionLabel>
          <h2 data-dialkit="h2" className={caseStudySectionH2}>
            Trust became the biggest design challenge
          </h2>
          <div className="flex flex-col items-start gap-4">
            <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
              Early versions of Asimov focused on what the AI could do. As its
              capabilities expanded, a different question emerged: who should
              be allowed to configure those capabilities?
            </p>
            <p className="text-[16px] font-normal leading-[160%] text-[#555555]">
              A full role-based permission system required backend support
              beyond the beta timeline. I designed the future access model
              while relying on Slack&apos;s existing administrator
              permissions as a temporary solution.
            </p>
          </div>
        </div>

        <div className={`relative aspect-[768/481] w-full overflow-hidden ${mediaPanel}`}>
          <div
            className="absolute left-1/2 top-4 w-[505px] max-w-[calc(100%-32px)] -translate-x-1/2 sm:top-16"
            style={{ filter: "drop-shadow(0px 0px 24px rgba(0,0,0,0.04))" }}
          >
            <Image
              src="/new-asimov/Admin User Manage Settings Modal.png"
              alt="Admin settings modal for managing who has access to configure Asimov"
              width={505}
              height={635}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Reflection */}
      <section id="reflection" className="flex flex-col items-start gap-12">
        <div className="flex flex-col items-start gap-3 [&>p:first-child]:mb-0">
          <SectionLabel>Reflections</SectionLabel>
          <h2 data-dialkit="h2" className={caseStudySectionH2}>
            What I&apos;d take into the next project
          </h2>
        </div>

        <div className="flex flex-col items-start gap-12 self-stretch">
          {REFLECTIONS.map((item) => (
            <div key={item.title} className="flex flex-col items-start gap-3 self-stretch">
              <h3 data-dialkit="h3" className={`text-[20px] leading-[140%] text-[#333333] ${item.weight}`}>
                {item.title}
              </h3>
              <div className="flex flex-col items-start gap-4">
                {item.paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[16px] font-normal leading-[160%] text-[#555555]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </CaseStudyLayout>
  );
}
