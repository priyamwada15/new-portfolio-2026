"use client";

import { CirclesThree, Eyes, Handshake } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import CaseStudyLayout from "../components/CaseStudyLayout";
import SolutionShowcase from "../components/SolutionShowcase";
import { RocketMortgageTripleVideos } from "../components/RocketMortgageTripleVideos";
import {
  CASE_STUDY_BODY_CLASS,
  CASE_STUDY_SECTION_BODY_CLASS,
  HOME_V2_PAGE_BG,
} from "../lib/caseStudy";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;
const accent = "#851F27";

/** Spacing & type tokens (formerly tuned via DialKit). */
const RM_LAYOUT_STYLE = {
  "--rm-section-stack-gap": "160px",
  "--rm-element-gap": "16px",
  "--rm-body-stack-gap": "20px",
  "--rm-grid-gap": "40px",
  "--rm-grid-gap-lg": "64px",
  "--rm-h2-below": "40px",
  "--rm-metrics-gap": "48px",
  "--rm-feedback-gap": "40px",
  "--rm-context-bottom": "160px",
  "--rm-h1-hero-gap": "32px",
  "--rm-hero-meta-gap": "40px",
  "--rm-padding-card": "40px",
  "--rm-padding-quote-y": "48px",
  "--rm-padding-feedback-y": "40px",
  "--rm-padding-metrics-top": "24px",
  "--rm-metric-caption-top": "16px",
  "--rm-h1-size": "36px",
  "--rm-h1-weight": "500",
  "--rm-h2-size": "32px",
  "--rm-h2-weight": "700",
  "--rm-tldr-title-size": "32px",
  "--rm-tldr-title-weight": "700",
  "--rm-body-size": "16px",
  "--rm-body-weight": "400",
  "--rm-metric-value-size": "48px",
  "--rm-metric-value-weight": "700",
  "--rm-metric-caption-size": "14px",
  "--rm-metric-caption-weight": "400",
} as React.CSSProperties;

function ContextTldr({ metricCaptionTop }: { metricCaptionTop: number }) {
  const metrics = [
    { value: "92%", label: "found the tailored responses were helpful" },
    { value: "75%", label: "said customized recommendations were trustworthy" },
    { value: "90%", label: "found transfer option reduced frustration" },
  ];

  return (
    <div className="rm-tldr flex max-w-[768px] flex-col">
      <h2 className="rm-tldr-title leading-[48px] text-[#333333]" style={figtree}>
        TL;DR
      </h2>
      <div className="rm-tldr-body">
        <p className="rm-body-text leading-[160%] text-[#333333]" style={figtree}>
          Rocket Mortgage&apos;s AI assistant guides homebuyers through the mortgage process, but the guidance inside the assistant was largely generic and disconnected from each client&apos;s specific situation.
        </p>
        <p className="rm-body-text leading-[160%] text-[#333333]" style={figtree}>
          I redesigned the post-offer onboarding experience inside Rocket Assist and introduced new interaction patterns like task cards, document components and a transparent human handoff flow.
        </p>
        <p className="rm-body-text leading-[160%] text-[#333333]" style={figtree}>
          The redesign was tested with Rocket Mortgage clients and clients reported that the context-driven conversation and new experience was more helpful and reduced frustration.
        </p>
      </div>
      <div className="rm-metrics flex flex-row items-start">
        {metrics.map((metric) => (
          <div key={metric.value} className="flex flex-1 flex-col">
            <p className="rm-metric-value leading-[48px] text-[#111111]" style={figtree}>
              {metric.value}
            </p>
            <p
              className="rm-metric-caption leading-[21px] text-[#555555]"
              style={{ ...figtree, paddingTop: metricCaptionTop }}
            >
              {metric.label}
            </p>
          </div>
        ))}
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
    <div className="relative h-[450px] min-w-0 flex-1 overflow-hidden rounded-[24px] bg-[#F5F5F5]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute left-1/2 max-w-none -translate-x-1/2"
        style={{ top: "-215.2px", width: "285.27px", height: "580px" }}
      />
      <p
        className="absolute left-1/2 top-[396px] w-max max-w-[calc(100%-2rem)] -translate-x-1/2 text-center text-[14px] font-medium leading-[160%] text-[#333333]"
        style={figtree}
      >
        {caption}
      </p>
    </div>
  );
}

function ProblemQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[120px] min-w-0 flex-1 items-center justify-center rounded-[24px] bg-[#F5F5F5] px-7 py-10">
      <p
        className="text-center text-[14px] font-light italic leading-[140%] text-[#333333]"
        style={figtree}
      >
        {children}
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
    <div className="relative h-[450px] min-w-0 flex-1 overflow-hidden rounded-[24px] bg-[#111111]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute left-1/2 max-w-none -translate-x-1/2"
        style={{ top: "-112.2px", width: "235.1px", height: "478px" }}
      />
      <p
        className="absolute left-1/2 top-[396px] w-max max-w-[calc(100%-2rem)] -translate-x-1/2 text-center text-[14px] font-medium leading-[160%] text-[#FEFEFE]"
        style={figtree}
      >
        {caption}
      </p>
    </div>
  );
}

function SolutionTypeSection({
  icon: Icon,
  title,
  paragraphs,
  topSpacing = false,
  showcase,
  visuals,
}: {
  icon: Icon;
  title: string;
  paragraphs: string[];
  topSpacing?: boolean;
  showcase: React.ReactNode;
  visuals: { src: string; alt: string; caption: string }[];
}) {
  return (
    <div className={`flex flex-col gap-4 ${topSpacing ? "pt-24" : "pt-10"}`}>
      <div className="flex items-center gap-2">
        <Icon size={32} weight="regular" color="#333333" className="shrink-0" aria-hidden />
        <h3 className="text-[24px] font-bold leading-[140%] text-[#333333]" style={figtree}>
          {title}
        </h3>
      </div>
      <div className="flex flex-col gap-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-[16px] font-normal leading-[160%] text-[#333333]" style={figtree}>
            {paragraph}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-8">
        <div className="pt-4">{showcase}</div>
        <div className="flex flex-col gap-8 md:flex-row">
          {visuals.map((visual) => (
            <SolutionVisualCard key={visual.caption} {...visual} />
          ))}
        </div>
      </div>
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
    <div className="rm-testimonial-card flex min-w-0 flex-1 flex-col gap-6 rounded-[24px] bg-[#F5F5F5] p-10">
      <p className="text-[14px] font-normal italic leading-[160%] text-[#555555]" style={figtree}>
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <p
            className="text-[12px] font-bold uppercase leading-[21px]"
            style={{ ...figtree, color: accent }}
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
        <div className="flex flex-col gap-3">
          <p className="text-[12px] font-normal leading-[140%] text-[#555555]" style={figtree}>
            {title}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/rocket-mortgage.svg"
            alt="Rocket Mortgage"
            className="h-[17px] w-auto object-contain object-left"
          />
        </div>
      </div>
    </div>
  );
}

function ReflectionCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rm-reflection-card flex min-w-0 flex-1 flex-col justify-center gap-6 rounded-[24px] bg-[#F5F5F5] px-7 py-10">
      <div className="flex flex-col gap-3">
        <p className="text-[20px] font-semibold leading-[140%] text-[#333333]" style={figtree}>
          {number}
        </p>
        <p className="text-[20px] font-semibold leading-[140%] text-[#333333]" style={figtree}>
          {title}
        </p>
      </div>
      <p className="text-[14px] font-normal leading-[140%] text-[#555555]" style={figtree}>
        {body}
      </p>
    </div>
  );
}

export default function RocketMortgageContent() {
  return (
    <div className="rm-dial-root" style={RM_LAYOUT_STYLE}>
      <CaseStudyLayout
        accentDark={accent}
        accentLight="#F8D6D9"
        bodyBackgroundColor={HOME_V2_PAGE_BG}
        headlineFont="figtree"
        headlineColor="#333333"
        headlineClassName="leading-[1.3]"
        headlineStyle={{
          fontSize: 36,
          fontWeight: 500,
        }}
        contentBodyClassName={CASE_STUDY_BODY_CLASS}
        sectionBodyClassName={CASE_STUDY_SECTION_BODY_CLASS}
        tocLinkFontFamily="var(--font-hind), sans-serif"
        logos={[
          { src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" },
          { src: "/logos/rocket-assist-full.svg", alt: "Rocket Assist" },
        ]}
        projectName="Rocket Mortgage"
        headline="I redesigned the interaction model for Rocket's AI assistant and the patterns I proposed made it to the product roadmap."
        reverseHeaderOrder
        hideContextLabel
        heroVisual={<RocketMortgageTripleVideos className="rounded-2xl" />}
        context={<ContextTldr metricCaptionTop={16} />}
        meta={{
          timelineLabel: "Handed off",
          timeline: "Aug 2025",
          industry: "Fintech",
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
          { id: "problem-space", label: "Problem Space" },
          { id: "solution-space", label: "Solution Space" },
          { id: "testimonials", label: "Testimonials" },
          { id: "reflection", label: "Reflection" },
        ]}
      >
        <section id="problem-space" className="flex max-w-[768px] flex-col gap-8">
          <h2 className="rm-h2 !mb-0 leading-[48px] text-[#333333]" style={figtree}>
            Generic chat experience at a crucial stage was causing client frustration
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-8 pt-4 md:flex-row">
              <ProblemVisualCard
                src="/new-rocket-mortgage-case-page/Problem%201.png"
                alt="Rocket Assist showing a generic chat response about buying a home"
                caption="Generic chat experience"
              />
              <ProblemVisualCard
                src="/new-rocket-mortgage-case-page/Problem%202.png"
                alt="Rocket Assist showing a broken human handoff with contact details only"
                caption="Broken human handoff flow"
              />
            </div>
            <p className="rm-body-text leading-[160%] text-[#333333]" style={figtree}>
              The post-offer stage is one of the most emotional and delicate part of the home-buying journey. The clients have just had their offer accepted after many hurdles and what they require is a clear guide on what comes next. This was missing in the current chat experience which was not personalized and gave the same common and generic advice to every home-buyer, irrespective of what stage they were in.
            </p>
            <p className="rm-body-text leading-[160%] text-[#333333]" style={figtree}>
              In delicate situations where the client needed a human intervention, the handoff flow was also broken. Actionable next steps that could be taken from the chat were misising.
            </p>
            <p className="rm-body-text leading-[160%] text-[#333333]" style={figtree}>
              When I picked up this problem space, the common thread between all the client feedback was the same-
            </p>
            <div className="flex flex-col gap-12 py-4 md:flex-row md:items-center">
              <ProblemQuote>
                &ldquo;I&apos;m buying a house; it&apos;s a lot of money - it should really be a{" "}
                <span className="font-semibold">guided journey</span>&rdquo;
              </ProblemQuote>
              <ProblemQuote>
                &ldquo;It&apos;s an <span className="font-semibold">authenticated experience</span> so it has{" "}
                <span className="font-semibold">my data</span>, but{" "}
                <span className="font-semibold">chat history</span> tells me otherwise.&rdquo;
              </ProblemQuote>
            </div>
          </div>
        </section>

        <div id="solution-space" className="flex max-w-[768px] flex-col gap-4">
          <h2 className="rm-h2 !mb-0 leading-[48px] text-[#333333]" style={figtree}>
            So what was the missing layer? There were actually three.
          </h2>

          <SolutionTypeSection
            icon={CirclesThree}
            title="Context-aware & personalized conversation"
            paragraphs={[
              "The most common question in the chat logs was some version of 'what do I do next?' I moved the answer into the conversation itself. An onboarding flow tied to the client's specific loan stage, with the most relevant next steps surfacing as task carousels inside the chat.",
            ]}
            showcase={
              <SolutionShowcase
                bgSrc="/rm-bg-orientation.avif"
                bgAlt="Living room interior"
                videoSrc="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776030651/Onboarding_Flow_hm76na.mp4"
                videoAlt="Redesigned onboarding flow for Rocket Assist"
              />
            }
            visuals={[
              {
                src: "/new-rocket-mortgage-case-page/Solution%20Type%201-%201.png",
                alt: "Rocket Assist showing a personalized greeting with pictures of the client's home",
                caption: "Personalized greeting with pictures of their home",
              },
              {
                src: "/new-rocket-mortgage-case-page/Solution%20Type%201-%202.png",
                alt: "Rocket Assist showing next steps in a visual interactive form",
                caption: "Next steps in a more visual and interactive form",
              },
            ]}
          />

          <SolutionTypeSection
            icon={Eyes}
            title="Interactive in-chat experience"
            topSpacing
            paragraphs={[
              "Once clients had a task in front of them, the next gap was the information needed to act on it, inspection reports, appraisal documents, etc. All of this lived outside the Rocket Assist.",
              "I introduced visual components that brought it inside: inspector cards personalized to the client's home, document cards with highlighted insights and prompt buttons that surfaced the next logical action without requiring the client to ask.",
            ]}
            showcase={
              <SolutionShowcase
                bgSrc="/rm-bg-comprehension.avif"
                bgAlt="Kitchen interior"
                videoSrc="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776035827/Inspector_Recommendations_cvyuma.mp4"
                videoAlt="Personalized recommendations of local inspectors"
              />
            }
            visuals={[
              {
                src: "/new-rocket-mortgage-case-page/Solution%20Type%202-%201.png",
                alt: "In-chat inspector contact cards in Rocket Assist",
                caption: "In-chat inspector contact cards",
              },
              {
                src: "/new-rocket-mortgage-case-page/Solution%20Type%202-%202.png",
                alt: "Important documents accessible within Rocket Assist chat",
                caption: "Important documents accessible within chat",
              },
            ]}
          />

          <SolutionTypeSection
            icon={Handshake}
            title="Transparent & smooth AI-Human handoff flow"
            topSpacing
            paragraphs={[
              "The conversation logs showed a consistent pattern where clients would reach a point where they needed reassurance that only a person could give. Rather than treating this as a failure state, I designed the handoff as a feature.",
              "Clients could transfer directly to their Purchase Specialist, see the estimated wait time and schedule a callback if needed. The conversation history carried over so the specialist could pick up exactly where the client left off.",
            ]}
            showcase={
              <SolutionShowcase
                bgSrc="/rm-bg-resolution.avif"
                bgAlt="Person on telephone"
                videoSrc="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776035827/Human_Handover_xbhbj3.mp4"
                videoAlt="Quick human handover and context preservation"
              />
            }
            visuals={[
              {
                src: "/new-rocket-mortgage-case-page/Solution%20Type%203-%201.png",
                alt: "Rocket Assist showing clear communication on agent availability",
                caption: "Clear communication on agent availability",
              },
              {
                src: "/new-rocket-mortgage-case-page/Solution%20Type%203-%202.png",
                alt: "Rocket Assist preserving context during human handover",
                caption: "Context retention with human handover",
              },
            ]}
          />
        </div>

        <section id="testimonials" className="flex max-w-[768px] flex-col gap-8">
          <h2 className="rm-h2 !mb-0 leading-[48px] text-[#333333]" style={figtree}>
            What the people who saw the work up close had to say
          </h2>
          <div className="rm-testimonial-grid flex flex-col md:flex-row">
            <TestimonialCard
              quote="This was perhaps her most complex assignment, and Pri quickly mapped key friction points while collaborating with engineers and researchers. Her work helped influence product roadmap priorities."
              name="Dana Lee"
              title="Director of Conversational AI Design & Digital Product Management"
              linkedin="https://www.linkedin.com/in/danayoo/"
            />
            <TestimonialCard
              quote="Pri routinely sought out and addressed challenging issues, independently identified critical opportunities for improvement, and delivered results on par with a full-time associate designer."
              name="Amanda Matzenbach"
              title="Conversational AI Design Manager & Mentor"
              linkedin="https://www.linkedin.com/in/amanda-matzenbach/"
            />
          </div>
        </section>

        <section id="reflection" className="flex max-w-[768px] flex-col gap-8">
          <h2 className="rm-h2 !mb-0 leading-[48px] text-[#333333]" style={figtree}>
            Some things I learned during my internship
          </h2>
          <div className="rm-reflection-grid flex flex-col md:flex-row md:items-stretch">
            <ReflectionCard
              number="01"
              title="Thinking in consequences"
              body="A PM breaking down every feature into APIs, infrastructure constraints and engineering dependencies reframed for me what good design means in a mature org. A feature is ten decisions that all need to align first."
            />
            <ReflectionCard
              number="02"
              title="Collaboration as a design tool"
              body="Seeking out engineers, researchers and SMEs before being told to is what got me into the conversations that shaped the work most. Waiting to be pointed in the right direction would have been the wrong instinct here."
            />
            <ReflectionCard
              number="03"
              title="Business needs vs client needs"
              body="The inspector card feature scored high in the usability testing but was deprioritized because the backend architecture wasn't within the team's bandwidth. For me it was a business needs rather than a design failure."
            />
          </div>
        </section>
      </CaseStudyLayout>
    </div>
  );
}
