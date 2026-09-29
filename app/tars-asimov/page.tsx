import { Metadata } from "next";
import Image from "next/image";
import CaseStudyLayout from "../components/CaseStudyLayout";
import AutoPauseVideo from "../components/AutoPauseVideo";
import MediaCarousel from "../components/MediaCarousel";
import { CoreFeatureVideo } from "./CoreFeatureVideo";
import KnowledgeSourcesDemo from "./KnowledgeSourcesDemo";
import { CardRow, SectionHeader } from "../components/CaseStudySections";
import {
  brands,
  caseStudyRowTitle,
  caseStudyTitle,
  mediaPanel,
  CASE_STUDY_PAGE_BG,
} from "@/design-system";

const ABOUT_STATS = [
  { label: "12 of 15", text: "startups kept using Asimov" },
  { label: "~74%", text: "fewer repetitive questions between teammates" },
  { label: "86%", text: "of answers rated helpful" },
];

const MY_ROLE = [
  "Designed the platform teams used to configure Asimov: its knowledge sources, integrations, permissions and actions",
  "Built the design system that cut the time between handoff and testing to about two days, down from at least a week",
  "Set up how design moved into engineering, pairing every flow's specs with a recorded walkthrough so developers understood the reasoning behind it as well as the screens",
  "Held the quality bar for what shipped, reviewing every build in the test environment with the front-end developer before release",
] as const;

const REFLECTIONS = [
  {
    title: "Ship a first version of the future, even a small one",
    text: "I parked access to private sources, with roles deciding who could see what, as future scope, and every required update pushed it further back. Next time I'd put a first version of that layer into the release cycle, even one that simply mirrored Slack's permissions, so it already had a place in the product.",
  },
] as const;

/** Media slides share the 1008×658 panel shape used across the page. */
const panelSlide = "aspect-[1008/658] w-full overflow-hidden";

/** Grey panel holding a centred Slack screenshot. `width` is the screenshot's px width inside a 1008×658 panel. */
function ScreenshotPanel({
  src,
  alt,
  width,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  caption: string;
}) {
  return (
    <figure className={`relative ${panelSlide} ${mediaPanel}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute left-1/2 top-[7.3%] h-auto -translate-x-1/2 rounded-[9px] border border-border"
        style={{ width: `${(width / 1008) * 100}%` }}
      />
      <figcaption className="absolute inset-x-6 bottom-[3.5%] text-center font-label text-[12px] leading-[22.4px] text-secondary">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Stand-in for a visual that is still being designed. */
function VisualPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex aspect-[1008/560] w-full items-center justify-center rounded-[var(--ds-radius-container)] border border-dashed border-border bg-surface-page px-10"
      aria-hidden="true"
    >
      <p className="max-w-[480px] text-center font-label text-[14px] leading-[22px] text-muted">
        Visual in progress: {label}
      </p>
    </div>
  );
}

function PreviewVideo({ src, label }: { src: string; label: string }) {
  return (
    <div className={`${panelSlide} ${mediaPanel}`}>
      <AutoPauseVideo
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/** Admin modal placement inside the 768×481 panel (Figma px). */
const ADMIN_PANEL = { width: 768, height: 481, imageWidth: 505, imageTop: 64 };

function Lead({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-primary">{children}</strong>;
}

const RELEASES: {
  number: number;
  title: string;
  body: React.ReactNode;
  media: React.ReactNode;
}[] = [
  {
    number: 1,
    title: "Summaries and answers pulled from long Slack threads",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}the first pain point I found was finding information. Someone looking for
          one detail had to scroll through lengthy threads, because Slack&rsquo;s search couldn&rsquo;t
          pull it out for them.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}the problem was people switching between tools, so the first
          release couldn&rsquo;t ask them to open another one. I designed Asimov to live entirely
          inside Slack&rsquo;s own interface. Teams added it to a channel and it read the history.
          Anyone could ask it to summarize a thread, or ask for a specific piece of information and
          get it back with the context around it. Today&rsquo;s AI meeting notetakers work the same
          way: you ask the transcript a question instead of rewatching the whole recording.
        </p>
        <p>
          <Lead>No configuration hub in the pilot.</Lead>{" "}Trying Asimov meant adding it to a channel
          and nothing more, which let us test whether its answers were useful before building
          anything around it.
        </p>
      </>
    ),
    media: (
      <ScreenshotPanel
        src="/new-asimov/Slack%201.avif"
        alt="Slack thread with Asimov summarizing the conversation"
        width={415}
        caption="Example scenario of Asimov summarizing threads."
      />
    ),
  },
  {
    number: 2,
    title: "Admin-only setup and rules for what Asimov could reveal",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}an AI agent reading team conversations needed guardrails from the start.
          I pushed for permissions as the very next release, before Asimov could reach anything
          beyond Slack.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}I split the problem in two. Who could change Asimov needed an
          answer fast, so I kept it simple on purpose: only Slack workspace admins could configure
          it, since they were already the people accountable for the workspace. What Asimov should
          say was the harder part. It could have read access to something the person asking
          wasn&rsquo;t allowed to see. I designed a response model for those cases in Slack&rsquo;s
          interface, covering different roles and what happens when permissions clash.
        </p>
        <p>
          <Lead>The response model is the decision I&rsquo;m proudest of.</Lead>{" "}It set the base
          for how Asimov would handle roles once teams were ready to share more.
        </p>
      </>
    ),
    media: (
      <div className="flex w-full flex-col items-center gap-12">
        <div
          className={`relative w-[768px] max-w-full overflow-hidden ${mediaPanel}`}
          style={{ aspectRatio: `${ADMIN_PANEL.width} / ${ADMIN_PANEL.height}` }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: `${(ADMIN_PANEL.imageWidth / ADMIN_PANEL.width) * 100}%`,
              top: `${(ADMIN_PANEL.imageTop / ADMIN_PANEL.height) * 100}%`,
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
        <VisualPlaceholder label="the response model cases" />
      </div>
    ),
  },
  {
    number: 3,
    title: "Connecting company docs as knowledge sources",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}channel history only went so far. Teams needed Asimov to answer from
          company docs and other sources, and I pushed for knowledge sources based on the user and
          competitive research.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}once Asimov could read beyond Slack, I designed the first
          configuration flow around one idea: admins should control what the agent could read and
          use. They picked which sources and Slack channels Asimov could use. I added sync status to
          every source so admins could see which time period of messages Asimov had, then run a sync
          again or schedule automatic ones so it kept learning from new messages. For each
          integration, I showed what it was connected to and what data Asimov could read from it.
        </p>
        <p>
          My bet was that control would build confidence in the product, and confidence would drive
          adoption.
        </p>
        <p>
          <Lead>I limited Asimov to public information.</Lead>{" "}In early 2024 teams were hesitant to
          hand an AI agent anything private. I kept Asimov to public and open sources so teams could
          build trust in it first, and moved access to private sources into future scope.
        </p>
        <p>
          <Lead>Knowledge sources and integrations shipped together</Lead>, because connecting an
          app like Notion is what turns it into a knowledge source.
        </p>
      </>
    ),
    media: (
      <MediaCarousel
        label="Knowledge sources and integrations"
        slides={[
          <CoreFeatureVideo
            key="kb"
            src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/KB_Asimov_nrvbu8.mp4"
            title="Knowledge Dashboard"
          />,
          // The demo's tab bar sits above its video, so the panel matches the video's baked-in #F5F5F5.
          <div
            key="sources-demo"
            className="w-full overflow-hidden rounded-[var(--ds-radius-container)] border border-border bg-surface-media"
            aria-hidden="true"
          >
            <KnowledgeSourcesDemo />
          </div>,
          <CoreFeatureVideo
            key="integrations"
            src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/Integrations_Asimov_izfe8q.mp4"
            title="Integrations Hub"
          />,
          <PreviewVideo
            key="integrations-preview"
            src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785523382/Integrations_Preview_xayos0.mp4"
            label="Integrations experience demo"
          />,
        ]}
      />
    ),
  },
  {
    number: 4,
    title: "Two ways to check every answer Asimov gave",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}once Asimov answered from company docs, people needed a way to check it.
          AI interaction patterns were still being worked out in early 2024, and I was convinced an
          agent holding team information had to show its sources before anyone would trust it. I
          pushed for this release.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}I designed two ways to verify any answer: the sources Asimov
          used, like the Slack thread or Notion doc, and the steps it took to reach the answer.
        </p>
        <p>
          I built them around the two ways an answer could go wrong. When Asimov answered
          incorrectly, the team could open its sources and find the cause. If it had hallucinated,
          they gave the answer a thumbs down, with optional detailed feedback. If the information
          was stale, they updated the knowledge source so Asimov had the current version. One design
          handled both cases, and the same thumbs up and down gave us the 86% helpful score.
        </p>
        <p>
          <Lead>This is where the repetitive questions dropped.</Lead>{" "}When a rep asked about an API
          failure that had come up before, Asimov answered with a link to the original thread, and
          the engineering lead didn&rsquo;t have to explain it again.
        </p>
      </>
    ),
    media: <VisualPlaceholder label="source citations design" />,
  },
  {
    number: 5,
    title: "Custom actions to trigger work in other tools from Slack",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}the research had surfaced one clear automation opportunity. If Asimov
          held the full context of a situation, Slack could become the place where every task around
          it got triggered, with no switching between tools. The CTO pushed for Actions as the next
          release.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}letting an AI act in other tools raised the stakes more than
          anything before it. So we piloted custom actions first, and I kept them simple on purpose.
          Teams wrote their own actions through a configurable schema. Tars&rsquo; CEO set one up for
          himself: whenever a developer posted a new release in the release channel, he typed
          /linkedin and Asimov drafted a LinkedIn post about it in his writing style. Starting with
          custom actions let us test whether Asimov understood and carried out actions safely before
          anyone connected their own tools and APIs.
        </p>
        <p>
          <Lead>I designed built-in actions for connected tools</Lead>{" "}so admins could switch
          actions on or off for each app. I held to the principle behind every release: admins
          decide what Asimov can do.
        </p>
      </>
    ),
    media: (
      <MediaCarousel
        label="Actions"
        slides={[
          <CoreFeatureVideo
            key="actions"
            src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/Actions_Asimov_e9ezjr.mp4"
            title="Action Configuration"
          />,
          <PreviewVideo
            key="actions-preview"
            src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785526992/Actions_Preview_ykwxsc.mp4"
            label="Custom actions configuration demo"
          />,
          <ScreenshotPanel
            key="slack-2"
            src="/new-asimov/Slack%202.avif"
            alt="Slack thread showing Asimov integrating with another app"
            width={378}
            caption="Example scenario of Asimov integrating with other apps."
          />,
        ]}
      />
    ),
  },
];

export const metadata: Metadata = {
  title: "Asimov for Tars | AI Agent Configuration Platform Case Study | Priyamwada Pandey",
  description:
    "How I owned design for Asimov, Tars' Slack AI agent, as its founding designer: 20 user interviews, five releases in five months and a design system Tars' main product later adopted.",
  keywords: [
    "founding designer",
    "AI product design",
    "AI agent UX designer",
    "Slack AI agent design",
    "B2B SaaS UX case study",
    "design system",
  ],
};

export default function AsimovPage() {
  return (
    <CaseStudyLayout
      sept2026Layout
      accentDark={brands.tars.dark}
      accentLight={brands.tars.light}
      bodyBackgroundColor={CASE_STUDY_PAGE_BG}
      headlineClassName={caseStudyTitle}
      logos={[
        { src: "/logos/tars.svg", alt: "TARS" },
      ]}
      projectName="Asimov for Tars"
      breadcrumbLabel="Asimov for Tars"
      headline="Designing the agent configuration platform and design system for Asimov as its founding designer"
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
          className="block w-full rounded-[var(--ds-radius-container)]"
        />
      }
      meta={{
        timelineLabel: "Shipped",
        timeline: "Dec 2023 – Apr 2024 · 5 releases",
        industry: "B2B SaaS",
        role: "Product Designer · Founding designer, Asimov",
        team: "CTO · Eng lead · 4 developers · QA · Designer (me)",
        items: [
          { label: "Shipped", value: "Dec 2023 – Apr 2024 · 5 releases" },
          { label: "Role", value: "Product Designer · Founding designer, Asimov" },
          { label: "Team", value: "CTO · Eng lead · 4 developers · QA · Designer (me)" },
          { label: "Key contributions", value: "Research, product design, design system, design QA" },
        ],
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
            Asimov is an AI agent that lives in Slack. It started as a Slack thread summarizer for 15
            startups and grew into a teammate that could answer from company docs and kick off work in
            other tools.
          </p>
          <p>
            I joined Tars, a company that builds AI agents for customer support and sales, as one of
            its first two designers, and Asimov was the new product line I owned on my own. I worked
            with Tars&rsquo; founders on this project. Over five months I ran the research, led design
            for the product and built the design system it shipped on.
          </p>
        </SectionHeader>
        <CardRow variant="stat" cards={ABOUT_STATS} />
      </section>

      <section id="my-role">
        <SectionHeader eyebrow="My role" title="I owned design for a new AI product line at Tars">
          <ul className="flex list-disc flex-col gap-3 pl-5">
            {MY_ROLE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionHeader>
      </section>

      <section id="problem" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="The problem"
          title="Startup teams lost time digging through Slack and switching between tools"
        >
          <p>
            At the startups I talked to, most work began in Slack, and most of what people needed to
            know was buried there too. Finding one detail meant scrolling back through long threads,
            because Slack&rsquo;s search wasn&rsquo;t advanced enough to surface it.
          </p>
          <p>
            The same questions kept coming back as a result. A customer success rep might ask the
            engineering lead about the same API failure in a client&rsquo;s account several times over
            a few months, because the answer sat in an old thread nobody could find.
          </p>
          <p>
            Once people found what they needed, the work usually continued somewhere else. That same
            rep would carry the context of a client issue into HubSpot, a report or a GitHub ticket by
            hand. Every switch cost time, and jumping between tools and tasks all day wore down focus.
          </p>
        </SectionHeader>
        <blockquote className="rounded-[var(--ds-radius-container)] bg-[var(--accent-light)] px-10 py-8 font-label text-[18px] font-medium leading-[1.6] text-primary">
          <span className="text-[var(--accent-dark)]">How might we</span> give startup teams an AI
          assistant in Slack that can find answers across their conversations and docs and act in
          their other tools, while they decide what it can see and do?
        </blockquote>
      </section>

      <section id="research" className="flex flex-col gap-12">
        <SectionHeader eyebrow="Research" title="Every team wanted something different from an AI agent">
          <p>
            Engineering wanted GitHub workflows, sales wanted CRM updates and marketing wanted help
            with content. I brought the synthesis of my interviews to our daily standups and sorted it
            so the team could make calls from it: where needs overlapped, which one-off requests could
            scale to other teams and what belonged in the MVP versus later.
          </p>
          <p>
            The PRD evolved from this synthesis, and most of Asimov&rsquo;s roadmap came straight out
            of it.
          </p>
        </SectionHeader>
        <VisualPlaceholder label="the synthesis framework: team needs sorted into overlapping, scalable one-off, true one-off, MVP and future scope" />
      </section>

      <section id="one-agent" className="flex flex-col gap-12">
        <SectionHeader eyebrow="The dropped direction" title="One agent instead of many">
          <p>
            My early designs followed that split and gave each use-case its own Slack agent. In a
            stakeholder review we looked at what that meant inside a real workspace: several AI agents
            that would get hard to scale and hard to manage. We decided on one agent that could hold
            many contexts.
          </p>
          <p>
            I redesigned Asimov around that single agent, with its knowledge sources (the channels and
            docs it could read) managed separately so each team&rsquo;s context stayed organized. Teams
            could still create more than one Asimov if they wanted.
          </p>
        </SectionHeader>
        <VisualPlaceholder label="the multi-agent iteration next to the single-agent structure" />
      </section>

      <section id="releases" className="flex flex-col gap-[88px]">
        <div className="flex flex-col gap-12">
          <SectionHeader eyebrow="Five releases" title="How Asimov grew, one release at a time">
            <p>
              Each release took two and a half to three weeks from MVP design to launch. Of the four
              that came after the pilot in Release 1, I pushed for three.
            </p>
          </SectionHeader>
          <VisualPlaceholder label="release timeline, marking who pushed each release" />
        </div>
        {RELEASES.map((release) => (
          <div key={release.number} className="flex flex-col gap-12">
            <SectionHeader
              subheading
              level={3}
              eyebrow={`Release ${release.number}`}
              title={release.title}
            >
              {release.body}
            </SectionHeader>
            {release.media}
          </div>
        ))}
      </section>

      <section id="design-system" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Design system"
          title="Building the design system that cut handoff-to-testing time by ~60%"
        >
          <p>
            I waited until Asimov needed its own interface. The summarizer lived inside Slack, so
            there was nothing to systematize yet. When knowledge sources needed a dashboard, I started
            a design system, because every release after that would add more screens and more settings
            to configure.
          </p>
          <p>
            It covered components, tokens and patterns. Once the front-end developers had built it, a
            new design went from handoff to testing in about two days. Before, that took at least a
            week.
          </p>
          <p>
            Its core components like cards, tables and accordions, later moved into Tars&rsquo; main
            product with the same structure and new styling.
          </p>
        </SectionHeader>
        <VisualPlaceholder label="design system overview" />
      </section>

      <section id="outcomes">
        <SectionHeader eyebrow="Outcomes" title="What happened with the 15 startups">
          <ul className="flex list-disc flex-col gap-3 pl-5">
            <li>
              <Lead>12 of 15</Lead>{" "}startups that signed up to try Asimov kept it as a tool.
            </li>
            <li>
              <Lead>~74% fewer repetitive questions</Lead>{" "}between teammates, once Asimov could answer
              from company docs and link to its sources.
            </li>
            <li>
              <Lead>86% of answers</Lead>{" "}got a thumbs up, across Tars&rsquo; own team and the startups
              using it.
            </li>
          </ul>
        </SectionHeader>
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
