import { Metadata } from "next";
import Image from "next/image";
import CaseStudyLayout from "../components/CaseStudyLayout";
import AutoPauseVideo from "../components/AutoPauseVideo";
import { CoreFeatureVideo } from "./CoreFeatureVideo";
import WorkflowLoopGraphic from "./WorkflowLoopGraphic";
import KnowledgeSourcesDemo from "./KnowledgeSourcesDemo";
import { CardRow, SectionHeader } from "../components/CaseStudySections";
import {
  brands,
  caseStudyRowTitle,
  caseStudySubheading,
  caseStudyText,
  caseStudyTitle,
  mediaPanel,
  SITE_DEFAULT_PAGE_BG,
} from "@/design-system";

const CORE_FEATURES = [
  {
    title: "Knowledge Dashboard",
    description:
      "Teams connected sources like Notion and Google Drive so Asimov could answer from company docs, with sync status and refresh timing visible for each source.",
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

/**
 * Screenshot sizes are the Figma frame's, as a share of the 488×558 panel
 * (centred, 48px from the top), so the layout holds as the panel scales.
 */
const OPPORTUNITIES = [
  {
    title: "Opportunity 1: Work happened across multiple tools",
    description: [
      "Slack conversations often triggered work elsewhere.",
      "Customer-facing teams moved from a discussion to updating HubSpot, writing reports or sharing project updates, oftentimes carrying the same context across multiple tools.",
      "Summaries reduced reading time, but rarely reduced the work that followed.",
    ],
    image: {
      src: "/new-asimov/Slack%201.avif",
      alt: "Slack thread with Asimov summarizing the conversation",
      width: 415,
    },
    caption: "Example scenario of Asimov summarizing threads.",
  },
  {
    title: "Opportunity 2: Teams had different workflows",
    description: [
      "Engineering wanted GitHub workflows, sales wanted CRM updates and marketing wanted content generation. The pattern that emerged was a need for flexibility.",
      "Instead of designing automations for every use case, I designed a system that let teams define their own actions on top of connected tools.",
    ],
    image: {
      src: "/new-asimov/Slack%202.avif",
      alt: "Slack thread showing Asimov integrating with another app",
      width: 378,
    },
    caption: "Example scenario of Asimov integrating with other apps.",
  },
] as const;

const OPPORTUNITY_PANEL = { width: 488, height: 558, imageTop: 48, captionTop: 510 };

const DEEP_DIVE_ITEMS = [
  {
    title: "Knowledge and access controls",
    description: [
      "Asimov was only as useful as the context it could reach. I designed the setup so teams could pick exactly which sources and Slack channels it used, and see what was syncing.",
    ],
    graphicOverlay: <KnowledgeSourcesDemo />,
    fillContainer: false,
  },
  {
    title: "Tool integrations",
    description: [
      "I designed each integration to show what it was connected to, what data Asimov could read and where to manage permissions, so teams always knew what the AI could reach.",
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
      "No fixed set of actions could cover every team's workflow, so I designed a system where teams decided what Asimov could do.",
      "They could turn built-in actions on or off for connected tools and write their own through a configurable schema.",
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

const ABOUT_STATS = [
  { label: "12 of 15", text: "beta teams kept using Asimov" },
  { label: "~74%", text: "fewer repetitive questions asked" },
  { label: "86%", text: "of responses rated helpful" },
];

const REFLECTIONS = [
  {
    title: "Permissions should ship with the first action",
    text: "Once Asimov could act in other apps, who was allowed to configure it became the harder question. Today, I would design governance alongside the feature instead of treating it as a later phase.",
  },
  {
    title: "AI products become platforms faster than you expect",
    text: "Asimov went from one Slack capability to a system of knowledge, integrations and actions. I'd plan the structure for new capabilities before we needed them.",
  },
] as const;

/** Admin modal placement inside the 768×481 Blocker panel (Figma px). */
const BLOCKER_PANEL = { width: 768, height: 481, imageWidth: 505, imageTop: 64 };

export const metadata: Metadata = {
  title: "Asimov for Tars | AI Agent Workflow Design Case Study | Priyamwada Pandey",
  description:
    "How I designed the knowledge, integrations and custom actions system that took Tars' Slack AI agent from a single capability to a teammate 12 of 15 beta teams kept using.",
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
      sept2026Layout
      accentDark={brands.tars.dark}
      accentLight={brands.tars.light}
      bodyBackgroundColor={SITE_DEFAULT_PAGE_BG}
      headlineClassName={caseStudyTitle}
      logos={[
        { src: "/logos/tars.svg", alt: "TARS" },
      ]}
      projectName="Asimov for Tars"
      breadcrumbLabel="Asimov for Tars"
      headline="Designing the configuration hub for a Slack AI agent used by startup teams"
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
    >
      <section id="about" className="flex flex-col gap-12">
        <SectionHeader title="What is Asimov?">
          <p>
            Asimov is Tars&rsquo; AI agent for Slack. Work kept starting in Slack threads and
            finishing somewhere else, so we wanted the agent to handle that second half.
          </p>
          <p>
            I took it from a thread summarizer to an AI teammate inside Slack, creating experiences
            for knowledge management, app integrations and configuring automated workflows.
          </p>
        </SectionHeader>
        <CardRow variant="stat" cards={ABOUT_STATS} />
      </section>

      <section id="what-i-designed" className="flex flex-col gap-[88px]">
        <SectionHeader eyebrow="What I Designed" title="Expanding Asimov's role in Slack">
          <p>
            The product began with a single capability: summarizing Slack threads. Each release
            expanded what Asimov could understand, connect to and eventually do on a team&rsquo;s
            behalf.
          </p>
        </SectionHeader>
        {CORE_FEATURES.map((feature) => (
          <div key={feature.title} className="flex flex-col gap-12">
            <SectionHeader subheading level={3} title={feature.title}>
              <p>{feature.description}</p>
            </SectionHeader>
            <CoreFeatureVideo src={feature.videoSrc} title={feature.title} />
          </div>
        ))}
      </section>

      <section id="opportunities" className="flex flex-col gap-[88px]">
        <SectionHeader eyebrow="Opportunities & Research" title="Finding useful roles for Asimov">
          <p>
            I interviewed customer success, sales, engineering, design and marketing to understand
            how work moved across conversations, tools and teams.
          </p>
          <p>
            Rather than validating a specific feature, I wanted to identify where an AI teammate
            could meaningfully participate in daily work and boost productivity.
          </p>
        </SectionHeader>
        <div className="flex flex-col gap-28">
          {OPPORTUNITIES.map((opportunity, index) => (
            <div
              key={opportunity.title}
              className={`flex w-full items-start gap-8 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <h3 className={caseStudySubheading}>{opportunity.title}</h3>
                <div className={`${caseStudyText} flex flex-col gap-3`}>
                  {opportunity.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <figure
                className={`relative min-w-0 flex-1 overflow-hidden ${mediaPanel}`}
                style={{ aspectRatio: `${OPPORTUNITY_PANEL.width} / ${OPPORTUNITY_PANEL.height}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={opportunity.image.src}
                  alt={opportunity.image.alt}
                  className="absolute left-1/2 h-auto -translate-x-1/2 rounded-[9px] border border-border"
                  style={{
                    width: `${(opportunity.image.width / OPPORTUNITY_PANEL.width) * 100}%`,
                    top: `${(OPPORTUNITY_PANEL.imageTop / OPPORTUNITY_PANEL.height) * 100}%`,
                  }}
                />
                <figcaption
                  className="absolute inset-x-6 text-center font-label text-[12px] leading-[22.4px] text-secondary"
                  style={{ top: `${(OPPORTUNITY_PANEL.captionTop / OPPORTUNITY_PANEL.height) * 100}%` }}
                >
                  {opportunity.caption}
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </section>

      <section id="deep-dive" className="flex flex-col gap-[88px]">
        <div className="flex flex-col gap-2">
          <SectionHeader eyebrow="Deep Dive" title="Asimov's core system">
            <p>
              Setup took three steps: connect Slack, add knowledge sources and choose what Asimov
              could access.
            </p>
            <p>After that, teams worked with it directly inside Slack.</p>
          </SectionHeader>
          <div
            className="aspect-[1008/262] w-full overflow-hidden rounded-[var(--ds-radius-container)]"
            aria-hidden="true"
          >
            <WorkflowLoopGraphic />
          </div>
        </div>
        {DEEP_DIVE_ITEMS.map((item) => (
          <div key={item.title} className="flex flex-col gap-12">
            <SectionHeader subheading level={3} title={item.title}>
              {item.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </SectionHeader>
            <div
              className={`relative w-full overflow-hidden ${
                item.fillContainer ? "aspect-[1008/658]" : ""
              } ${mediaPanel}`}
              aria-hidden="true"
            >
              {item.graphicOverlay}
            </div>
          </div>
        ))}
      </section>

      <section id="blocker" className="flex flex-col items-center gap-12">
        <SectionHeader eyebrow="Blocker" title="Permissions and access">
          <p>
            Early versions focused on what Asimov could do. As it grew, the question became who
            should be allowed to configure it.
          </p>
          <p>
            Full role-based permissions needed backend work beyond the beta timeline. I designed the
            future access model and used Slack&rsquo;s admin permissions in the meantime.
          </p>
        </SectionHeader>
        <div
          className={`relative w-[768px] max-w-full overflow-hidden ${mediaPanel}`}
          style={{ aspectRatio: `${BLOCKER_PANEL.width} / ${BLOCKER_PANEL.height}` }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: `${(BLOCKER_PANEL.imageWidth / BLOCKER_PANEL.width) * 100}%`,
              top: `${(BLOCKER_PANEL.imageTop / BLOCKER_PANEL.height) * 100}%`,
              filter: "drop-shadow(0px 0px 24px rgba(0,0,0,0.04))",
            }}
          >
            <Image
              src="/new-asimov/Admin User Manage Settings Modal.avif"
              alt="Admin settings modal for managing who has access to configure Asimov"
              width={505}
              height={635}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section id="reflections">
        <SectionHeader
          eyebrow="Reflections"
          title="What I'd take into the next project"
          bodyClassName="gap-12 pt-2"
        >
          {REFLECTIONS.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <h3 className={caseStudyRowTitle}>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </SectionHeader>
      </section>
    </CaseStudyLayout>
  );
}
