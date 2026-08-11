"use client";

import { useState } from "react";
import CaseStudyLayout from "../components/CaseStudyLayout";
import SolutionShowcase from "../components/SolutionShowcase";
import { RocketMortgageTripleVideos } from "../components/RocketMortgageTripleVideos";
import { ImageZoomViewer, type ZoomImage } from "../components/ImageZoomViewer";
import {
  brands,
  caseStudyBody,
  caseStudySectionBody,
  caseStudySectionH2,
  fontStyle,
  SITE_DEFAULT_PAGE_BG,
} from "@/design-system";

/** Spacing & type tokens (formerly tuned via DialKit). */
const RM_LAYOUT_STYLE = {
  "--rm-section-stack-gap": "160px",
  "--rm-body-stack-gap": "20px",
  "--rm-grid-gap": "40px",
  "--rm-grid-gap-lg": "64px",
  "--rm-feedback-gap": "40px",
  "--rm-context-bottom": "120px",
  "--rm-h1-hero-gap": "32px",
  "--rm-hero-meta-gap": "40px",
  "--rm-padding-card": "40px",
  "--rm-padding-quote-y": "48px",
  "--rm-padding-feedback-y": "40px",
  "--rm-h1-size": "36px",
  "--rm-h1-weight": "500",
  "--rm-body-size": "16px",
  "--rm-body-weight": "400",
} as React.CSSProperties;

function ContextTldr() {
  return (
    <div className="flex max-w-[768px] flex-col items-start gap-6">
      <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
        TL;DR
      </h2>
      <div className="flex flex-col items-start gap-4">
        <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
          Rocket Mortgage&apos;s AI assistant supports homebuyers after their offer is accepted, but the
          guidance was generic when clients needed advice tailored to their loan stage and home.
        </p>
        <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
          I redesigned the experience from onboarding through in-chat guidance, introducing personalized
          task cards, contextual recommendations and a transparent human handoff. The interaction patterns I
          proposed influenced Rocket Assist&apos;s product roadmap beyond the internship.
        </p>
      </div>
      <div className="flex w-full flex-col items-center gap-8 pt-6 md:flex-row md:gap-14">
        <TestimonialCard
          quote="This was perhaps her most complex assignment, and Pri quickly mapped key friction points while collaborating with engineers and researchers. Her work helped influence product roadmap priorities."
          name="Dana Lee"
          title="Director of Conversational AI Design & Digital Product Management"
          linkedin="https://www.linkedin.com/in/danayoo/"
        />
        <TestimonialCard
          quote="Driven by curiosity to understand client problems, Pri developed solutions that delivered business value. Her prototypes influenced product strategy, and she collaborated exceptionally across teams."
          name="Amanda Matzenbach"
          title="Conversational AI Design Manager & Mentor"
          linkedin="https://www.linkedin.com/in/amanda-matzenbach/"
        />
      </div>
    </div>
  );
}

function ProblemVisualCard({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <div className="relative h-[450px] w-full overflow-hidden rounded-[var(--ds-radius-container)] bg-[#F5F5F5] md:w-[368px] md:shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute left-1/2 max-w-none -translate-x-1/2"
        style={{ top: "-215.2px", width: "285.27px", height: "580px" }}
      />
      <p
        className="absolute left-1/2 top-[396px] w-max max-w-[calc(100%-2rem)] -translate-x-1/2 text-center text-[14px] font-medium leading-[160%] text-[#333333]"
        style={fontStyle.figtree}
      >
        {caption}
      </p>
    </div>
  );
}

function SolutionVisualCard({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <div className="relative h-[450px] w-full shrink-0 overflow-hidden rounded-[var(--ds-radius-container)] bg-[#111111]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute left-1/2 max-w-none -translate-x-1/2"
        style={{ top: "-112.2px", width: "235.1px", height: "478px" }}
      />
      <p
        className="absolute left-1/2 top-[396px] w-max max-w-[calc(100%-2rem)] -translate-x-1/2 text-center text-[14px] font-medium leading-[160%] text-[#FEFEFE]"
        style={fontStyle.figtree}
      >
        {caption}
      </p>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  title,
  linkedin,
}: {
  quote: string;
  name: string;
  title: string;
  linkedin: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-2xl bg-[#F7F7F7] p-3">
      <p className="w-full text-[14px] font-medium leading-[22px] text-[#333333]" style={fontStyle.figtree}>
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex w-full flex-col items-center gap-1">
        <div className="flex w-full items-center justify-center gap-2">
          <p
            className="flex-1 text-[12px] font-bold uppercase leading-[21px]"
            style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
          >
            {name}
          </p>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} on LinkedIn`}
            className="shrink-0 hover:opacity-60 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/LinkedIn_icon.svg" alt="" width={16} height={16} />
          </a>
        </div>
        <p className="w-full text-[10px] font-normal leading-[150%] text-[#555555]" style={fontStyle.figtree}>
          {title}
        </p>
      </div>
    </div>
  );
}

function CoreFlows() {
  const flows = [
    {
      bgSrc: "/rm-bg-orientation.avif",
      bgAlt: "Living room interior",
      videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776030651/Onboarding_Flow_hm76na.mp4",
      videoAlt: "Redesigned onboarding flow for Rocket Assist",
      title: "Context-Aware Guidance",
      body: "Reads the client's real loan stage and shows only the tasks still open.",
    },
    {
      bgSrc: "/rm-bg-comprehension.avif",
      bgAlt: "Kitchen interior",
      videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776035827/Inspector_Recommendations_cvyuma.mp4",
      videoAlt: "Personalized recommendations of local inspectors",
      title: "Sourced Recommendations",
      body: "Names every recommendation's source. Realtor, appraisal report or the home's own listing data.",
    },
    {
      bgSrc: "/rm-bg-resolution.avif",
      bgAlt: "Person on telephone",
      videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776035827/Human_Handover_xbhbj3.mp4",
      videoAlt: "Quick human handover and context preservation",
      title: "Transparent Handoff",
      body: "Hands off before the client gets stuck. Wait time shown, no dead air.",
    },
  ];

  return (
    <section id="core-flows" className="flex max-w-[768px] flex-col gap-10">
      <div className="flex flex-col gap-3">
        <p
          className="text-[14px] font-semibold leading-[150%]"
          style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
        >
          Core Flows
        </p>
        <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
          Turning a generic chat into a guided mortgage journey
        </h2>
      </div>
      <div className="flex flex-col gap-14">
        {flows.map((flow) => (
          <div key={flow.title} className="flex flex-col items-start gap-8 md:flex-row md:items-end">
            <SolutionShowcase
              bgSrc={flow.bgSrc}
              bgAlt={flow.bgAlt}
              videoSrc={flow.videoSrc}
              videoAlt={flow.videoAlt}
              className="h-[450px] w-full md:h-[621px] md:w-[368px]"
            />
            <div className="flex w-full flex-col gap-2 md:w-[368px]">
              <p className="text-[20px] font-medium leading-[140%] text-[#333333]" style={fontStyle.figtree}>
                {flow.title}
              </p>
              <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
                {flow.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Impact() {
  const metrics = [
    {
      label: "Improved Experience",
      value: "92%",
      caption: "of clients found the tailored responses were more helpful than the current guidance.",
    },
    {
      label: "Increased Trust",
      value: "75%",
      caption: "of clients found sourced recommendations by AI more trustworthy.",
    },
    {
      label: "Reduced Frustration",
      value: "96%",
      caption: "of clients flagged the transparent human handoff flow design would reduce frustration.",
    },
  ];

  return (
    <section id="impact" className="flex max-w-[768px] flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p
          className="text-[14px] font-semibold leading-[150%]"
          style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
        >
          Impact
        </p>
        <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
          Trust, control and explainability, validated with the clients
        </h2>
      </div>
      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-1 flex-col">
            <p
              className="pb-4 text-[14px] font-semibold leading-[150%]"
              style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
            >
              {metric.label}
            </p>
            <p className="text-[48px] font-bold leading-[48px] text-[#111111]" style={fontStyle.figtree}>
              {metric.value}
            </p>
            <p className="pt-4 text-[16px] font-normal leading-[150%] text-[#555555]" style={fontStyle.figtree}>
              {metric.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApproachCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex w-full flex-col justify-center gap-6 rounded-[var(--ds-radius-container)] bg-[#F5F5F5] px-7 py-10 md:w-[352px]">
      <div className="flex flex-col gap-3">
        <p className="text-[20px] font-semibold leading-[140%] text-[#333333]" style={fontStyle.figtree}>
          {number}
        </p>
        <p className="text-[20px] font-semibold leading-[140%] text-[#333333]" style={fontStyle.figtree}>
          {title}
        </p>
      </div>
      <p className="text-[16px] font-normal leading-[150%] text-[#555555]" style={fontStyle.figtree}>
        {body}
      </p>
    </div>
  );
}

/** The 4 images shown in the Design Approach zoom viewer, browsable via its prev/next arrows. */
const designApproachZoomImages: ZoomImage[] = [
  {
    src: "/new-rocket-mortgage-case-page/Happy%20Path.avif",
    alt: "Flowchart mapping the happy path of the conversation flow",
    caption: "Happy Path for the conversation flow with new interaction opportunity areas identified.",
    zoomable: true,
  },
  {
    src: "/new-rocket-mortgage-case-page/Human%20Handoff.avif",
    alt: "Flowchart mapping the human handoff decision logic",
    caption: "Human handoff flow showing the decision logic behind when a conversation escalates to a specialist.",
    zoomable: true,
  },
  {
    src: "/new-rocket-mortgage-case-page/Key%20Features%20Full%20Image.avif",
    alt: "Key features of the Rocket Assist onboarding experience",
    caption: "Key features identified for personalized onboarding.",
    zoomable: true,
  },
  {
    src: "/new-rocket-mortgage-case-page/Iterations.avif",
    alt: "Iterations of the onboarding task carousel card",
    caption: "Some early explorations for inspector card and onboarding carousels.",
    zoomable: true,
    zoomLevel: 2,
  },
];

function DesignApproachImages() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <ImageZoomViewer images={designApproachZoomImages} index={activeIndex} onIndexChange={setActiveIndex} />
    </div>
  );
}

function DesignApproach() {
  return (
    <section id="design-approach" className="flex max-w-[768px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p
          className="text-[14px] font-semibold leading-[150%]"
          style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
        >
          Design Approach
        </p>
        <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
          From research insights to identifying three design bets
        </h2>
      </div>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col items-center gap-16 md:flex-row">
          <ApproachCard
            number="01"
            title="Mapped chat logs and the research team's past client interviews"
            body="After pouring over research reports from the Research team, I consolidated everything into one affinity board which helped me identify the low and high hanging fruits."
          />
          <ApproachCard
            number="02"
            title="Spoke to chat specialists since they were the closest to the clients"
            body="They handled these conversations daily, so I interviewed them on what clients kept asking the most and how they worked around these gaps that Rocket Assist currently had."
          />
        </div>
        <DesignApproachImages />
        <div className="flex flex-col items-center gap-16 md:flex-row">
          <ApproachCard
            number="03"
            title="Understanding which APIs to connect to Rocket Assist"
            body="I sat with engineers to scope what data the chat could realistically use. We went through what APIs were already connected, what wasn't and what could be pulled in without a massive restructuring."
          />
          <ApproachCard
            number="04"
            title="Pressure testing the identified opportunities of the project"
            body="I brought the affinity map to my mentor and together we narrowed dozens of pain points down to the opportunity areas with the highest stakes, which became the three pillars of the project."
          />
        </div>
      </div>
    </section>
  );
}

function FinalSolutionMove({
  showEyebrow,
  title,
  items,
}: {
  showEyebrow: boolean;
  title: string;
  items: { src: string; alt: string; caption: string; cardTitle: string; body: string }[];
}) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        {showEyebrow && (
          <p
            className="text-[14px] font-semibold leading-[150%]"
            style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
          >
            Final Solution
          </p>
        )}
        <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
          {title}
        </h2>
      </div>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        {items.map((item) => (
          <div key={item.cardTitle} className="flex w-full flex-col gap-8 md:w-[368px]">
            <SolutionVisualCard src={item.src} alt={item.alt} caption={item.caption} />
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-medium leading-[140%] text-[#333333]" style={fontStyle.figtree}>
                {item.cardTitle}
              </p>
              <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinalSolution() {
  return (
    <section id="final-solution" className="flex max-w-[768px] flex-col gap-20">
      <FinalSolutionMove
        showEyebrow
        title="Move 1: Reading the loan stage to know what's next"
        items={[
          {
            src: "/new-rocket-mortgage-case-page/Solution%20Type%201-%202.avif",
            alt: "Rocket Assist showing next steps in a visual interactive form",
            caption: "Next steps in a visual and interactive form",
            cardTitle: "Task lists scoped to real progress",
            body: "Rocket Mortgage already tracked each client against a milestone map: pre-approval letter, signed application. The assistant read that state and showed only what was left, specific to their loan stage.",
          },
          {
            src: "/new-rocket-mortgage-case-page/Solution%20Type%201-%201.avif",
            alt: "Rocket Assist showing a personalized greeting with pictures of the client's home",
            caption: "Personalized greeting with pictures of their home",
            cardTitle: "Reflects the dashboard's data",
            body: "In mortgage origination, the vertical I worked in, a live API fed the main dashboard each client's loan stage. Using this API meant Rocket Assist could personalize its guidance and stay consistent with what the dashboard showed.",
          },
        ]}
      />
      <FinalSolutionMove
        showEyebrow={false}
        title="Move 2: Naming the source behind every recommendation"
        items={[
          {
            src: "/new-rocket-mortgage-case-page/Solution%20Type%202-%201.avif",
            alt: "In-chat inspector contact cards in Rocket Assist",
            caption: "In-chat inspector contact cards",
            cardTitle: "All recommendations name the source",
            body: "Inspector suggestions came labeled with the realtor as the source, appraisal insights were tied to the report and insurance tips pointed back to the home's own Redfin listing.",
          },
          {
            src: "/new-rocket-mortgage-case-page/Solution%20Type%202-%202.avif",
            alt: "Important documents accessible within Rocket Assist chat",
            caption: "Important documents accessible within chat",
            cardTitle: "Relevant files are one tap away",
            body: "Reports could be downloaded straight from the chat by name and file type, so clients didn't need to open a second interface to check the paperwork.",
          },
        ]}
      />
      <FinalSolutionMove
        showEyebrow={false}
        title="Move 3: Transparent & smooth AI-Human handoff flow"
        items={[
          {
            src: "/new-rocket-mortgage-case-page/Solution%20Type%203-%201.avif",
            alt: "Rocket Assist showing clear communication on agent availability",
            caption: "Clear communication on agent availability",
            cardTitle: "Handoff as its own flow",
            body: "Specific signals triggered it automatically: a client asking if anyone could help, or clear frustration in their messages, routed straight to their purchase specialist.",
          },
          {
            src: "/new-rocket-mortgage-case-page/Solution%20Type%203-%202.avif",
            alt: "Rocket Assist preserving context during human handover",
            caption: "Context retention with human handover",
            cardTitle: "Context retention",
            body: "The conversation history carried over so the specialist could pick up exactly where the AI left off. This saves the client having to walk through their problem again.",
          },
        ]}
      />
    </section>
  );
}

function Blockers() {
  return (
    <section id="blockers" className="flex max-w-[768px] flex-col gap-12">
      <div className="flex flex-col gap-3">
        <p
          className="text-[14px] font-semibold leading-[150%]"
          style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
        >
          Blockers
        </p>
        <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
          The inspector card feature tested well but got cut
        </h2>
        <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
          It scored high in usability testing, but the backend architecture needed to support it wasn&apos;t within the team&apos;s bandwidth that cycle. Building it would require multiple API integrations, not just within the Rocket Mortgage system but also Redfin&apos;s, which has been acquired by Rocket Companies. It was an essential lesson in the gap between the simplicity of a feature design and the many pieces that had to fall into place in order to push it out the door.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-8 rounded-[var(--ds-radius-container)] bg-[#F5F5F5] px-10 pb-8 pt-10 md:flex-row md:gap-[58px]">
        <div className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new-rocket-mortgage-case-page/General%20inspector-front.avif"
            alt="Front of the inspector recommendation card showing Sarah Millerson's profile and call-to-action"
            className="w-[310px]"
          />
          <p className="text-[14px] font-medium leading-[160%] text-[#333333]" style={fontStyle.figtree}>
            Front
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new-rocket-mortgage-case-page/General%20inspector-back.avif"
            alt="Back of the inspector recommendation card showing an AI-generated summary of client reviews"
            className="w-[310px]"
          />
          <p className="text-[14px] font-medium leading-[160%] text-[#333333]" style={fontStyle.figtree}>
            Back
          </p>
        </div>
      </div>
    </section>
  );
}

function InHindsight() {
  return (
    <section id="in-hindsight" className="flex max-w-[768px] flex-col gap-12">
      <div className="flex flex-col gap-3">
        <p
          className="text-[14px] font-semibold leading-[150%]"
          style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
        >
          In Hindsight
        </p>
        <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
          What I&apos;d design differently
        </h2>
      </div>
      <div className="flex flex-col items-center gap-16 md:flex-row">
        <ApproachCard
          number="01"
          title="No fallback path existed for a mismatched task"
          body="Rocket Assist reflected the dashboard's state rather than owning it, so a correction path belonged to that system, not this surface."
        />
        <ApproachCard
          number="02"
          title="No way for a client to directly correct the assistant"
          body='Frustration-based triggers caught some of that gap by routing to a human, but a direct "this is wrong" flow stayed out of scope.'
        />
      </div>
    </section>
  );
}

export default function RocketMortgageContent() {
  return (
    <div className="rm-dial-root" style={RM_LAYOUT_STYLE}>
      <CaseStudyLayout
        accentDark={brands.rocket.dark}
        accentLight={brands.rocket.light}
        bodyBackgroundColor={SITE_DEFAULT_PAGE_BG}
        headlineColor="#333333"
        headlineClassName="text-[36px] font-medium leading-[1.3] max-tablet:text-[24px]"
        contentBodyClassName={caseStudyBody}
        sectionBodyClassName={caseStudySectionBody}
        logos={[
          { src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" },
          { src: "/logos/rocket-assist-full.svg", alt: "Rocket Assist" },
        ]}
        projectName="Rocket Mortgage"
        contextLabel="TL;DR"
        headline="Personalizing AI guidance across 6.8M+ client conversations"
        reverseHeaderOrder
        hideContextLabel
        heroVisual={<RocketMortgageTripleVideos className="rounded-2xl" />}
        context={<ContextTldr />}
        meta={{
          timelineLabel: "Handed off",
          timeline: "Aug 2025",
          industry: "B2C Fintech",
          role: "Product Design",
          team: "Conversational AI Designers, Product Designers",
        }}
        nextProject={{
          href: "/tars-debug-mode",
          tags: "Product Design · 2022 · Tars Technologies",
          title:
            "I designed and shipped a debug tool that reduced testing time by ~70%, for two distinct user groups.",
        }}
        toc={[
          { id: "core-flows", label: "Core Flows" },
          { id: "impact", label: "Impact" },
          { id: "problem-space", label: "Problem" },
          { id: "design-approach", label: "Design Approach" },
          { id: "final-solution", label: "Final Solution" },
          { id: "blockers", label: "Blockers" },
          { id: "in-hindsight", label: "In Hindsight" },
          { id: "reflection", label: "Reflections" },
        ]}
      >
        <CoreFlows />

        <Impact />

        <section id="problem-space" className="flex max-w-[768px] flex-col gap-[33px]">
          <div className="flex flex-col gap-3">
            <p
              className="text-[14px] font-semibold leading-[150%]"
              style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
            >
              Problem
            </p>
            <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
              The assistant gave every client the same advice
            </h2>
          </div>
          <div className="flex flex-col gap-12">
            <div className="flex flex-col items-start gap-12 md:flex-row md:items-end">
              <div className="flex w-full flex-col gap-10 md:w-[352px]">
                <p className="text-[16px] font-light italic leading-[140%] text-[#333333]" style={fontStyle.figtree}>
                  &ldquo;It&apos;s an <span className="font-semibold text-[#851F27]">authenticated experience</span> so it has{" "}
                  <span className="font-semibold text-[#851F27]">my data</span>, but{" "}
                  <span className="font-semibold text-[#851F27]">chat history</span>{" "}
                  tells me otherwise.&rdquo;
                </p>
                <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
                  The post-offer stage is one of the most delicate parts of the home-buying journey and the chat treated it like any other. Clients who had just gotten their offer accepted after months of hurdles needed a clear guide on what came next. What they got instead was the same generic advice every buyer saw, regardless of loan stage.
                </p>
              </div>
              <ProblemVisualCard
                src="/new-rocket-mortgage-case-page/Problem%201.avif"
                alt="Rocket Assist showing a generic chat response about buying a home"
                caption="Generic chat experience"
              />
            </div>
            <div className="flex flex-col items-start gap-12 md:flex-row md:items-end">
              <div className="flex w-full flex-col gap-10 md:w-[352px]">
                <p className="text-[16px] font-light italic leading-[140%] text-[#333333]" style={fontStyle.figtree}>
                  &ldquo;I&apos;m buying a house; it&apos;s a lot of money - it should really be{" "}
                  <span className="font-semibold text-[#851F27]">a guided journey.</span>&rdquo;
                </p>
                <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
                  When a client needed a human, the handoff flow was broken. No actionable next step came from the chat itself, just contact details to figure out on their own. This left a majority of clients frustrated, which impacted Rocket Assist&apos;s credibility as a product the clients could depend on.
                </p>
              </div>
              <ProblemVisualCard
                src="/new-rocket-mortgage-case-page/Problem%202.avif"
                alt="Rocket Assist showing a broken human handoff with contact details only"
                caption="Broken human handoff flow"
              />
            </div>
          </div>
        </section>

        <DesignApproach />

        <FinalSolution />

        <Blockers />

        <InHindsight />

        <section id="reflection" className="flex max-w-[768px] flex-col gap-12">
          <div className="flex flex-col gap-3">
            <p
              className="text-[14px] font-semibold leading-[150%]"
              style={{ ...fontStyle.figtree, color: brands.rocket.dark }}
            >
              Reflections
            </p>
            <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
              What I&apos;d take into the next project
            </h2>
          </div>
          <div className="flex w-full flex-col gap-8 md:flex-row md:gap-16">
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-[20px] font-medium leading-[140%] text-[#333333]" style={fontStyle.figtree}>
                Every feature is ten decisions that have to align first.
              </p>
              <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
                Watching a PM break the work down into APIs, infrastructure constraints and engineering dependencies changed what &ldquo;design&rdquo; meant to me in a mature org.
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-[20px] font-medium leading-[140%] text-[#333333]" style={fontStyle.figtree}>
                Collaboration as a design tool
              </p>
              <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
                Seeking out engineers, researchers and SMEs before being asked is what got me into the conversations that shaped the work most and helped me identify edge cases.
              </p>
            </div>
          </div>
        </section>
      </CaseStudyLayout>
    </div>
  );
}
