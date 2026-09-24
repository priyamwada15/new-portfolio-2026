import CaseStudyLayout from "../components/CaseStudyLayout";
import SolutionShowcase from "../components/SolutionShowcase";
import { RocketMortgageTripleVideos } from "../components/RocketMortgageTripleVideos";
import { SectionHeader, Testimonial } from "../components/CaseStudySections";
import {
  brands,
  caseStudyRowTitle,
  caseStudySubheading,
  caseStudyText,
  caseStudyTitle,
  SITE_DEFAULT_PAGE_BG,
} from "@/design-system";

const PROBLEM_IMAGE_DIR = "/new-rocket-mortgage-case-page";

/** Number, title and one-line description under each old-UI screenshot. */
function ProblemCardText({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="flex gap-2 font-label text-[20px] leading-[28px]">
        <span className="font-semibold text-[var(--accent-dark)]">{number}</span>
        <span className="font-medium text-primary">{title}</span>
      </p>
      <p className="font-label text-[16px] leading-[24px] text-secondary">{text}</p>
    </div>
  );
}

/**
 * Old-UI card. `full` shows the whole phone; otherwise the phone is cropped to
 * its lower part, cut off by the card's top edge. Sizes are the Figma
 * proportions (328px phone inside the 414px padded card) so the crop holds as cards scale.
 */
function ProblemCard({
  src,
  alt,
  full = false,
  ...text
}: React.ComponentProps<typeof ProblemCardText> & { src: string; alt: string; full?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center gap-10 overflow-hidden rounded-[var(--ds-radius-container)] border border-border bg-surface-media px-10 pb-10 ${
        full ? "justify-end pt-10" : ""
      }`}
    >
      <div
        className="relative w-[79.23%] overflow-hidden"
        style={{ aspectRatio: full ? "328 / 667" : "328 / 394" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="absolute bottom-0 left-0 w-full max-w-none" />
      </div>
      <ProblemCardText {...text} />
    </div>
  );
}

function ProblemSpace() {
  return (
    <section id="problem-space" className="flex flex-col gap-12">
      <SectionHeader eyebrow="Problem Space" title="Rocket's AI assistant treated every homebuyer the same">
        <p>
          As an intern at Rocket Mortgage, I had to pick my own solo project. I went through the
          research team&rsquo;s reports, client reviews and chat transcripts looking for a gap and
          kept landing on Rocket Assist.
        </p>
        <p>
          Clients were leaving the chat and calling support for questions it could have answered. I
          scoped the project around the three gaps that showed up most.
        </p>
      </SectionHeader>
      <div className="grid w-full grid-cols-2 gap-4">
        <div className="flex flex-col gap-[21px]">
          <ProblemCard
            full
            src={`${PROBLEM_IMAGE_DIR}/Problem%201.avif`}
            alt="Rocket Assist answering a question about required documents with a long block of text"
            number="01"
            title="Everything was text"
            text="Answers came as paragraphs with nothing a client could act on."
          />
          <figure className="flex flex-1 flex-col justify-center gap-4 rounded-[var(--ds-radius-container)] border border-border bg-surface-page p-10">
            <blockquote className="font-label text-[20px] leading-[1.4] text-primary">
              <span className="font-black">&ldquo;</span> It&rsquo;s an authenticated experience so
              it should have my data, but this chat history tells me otherwise.{" "}
              <span className="font-black">&rdquo;</span>
            </blockquote>
            <figcaption className="text-right font-label text-[14px] leading-[24px] text-tertiary">
              Rocket Mortgage Client
            </figcaption>
          </figure>
        </div>
        <div className="flex flex-col gap-4">
          <ProblemCard
            src={`${PROBLEM_IMAGE_DIR}/Problem%202.avif`}
            alt="Rocket Assist giving the same generic loan-stage answer to every client"
            number="02"
            title="Every client got the same advice"
            text="The chat had their loan data but it still answered like a stranger, with no context retention."
          />
          <ProblemCard
            src={`${PROBLEM_IMAGE_DIR}/Problem%203.avif`}
            alt="Rocket Assist replying to a request for help with only a name and phone number"
            number="03"
            title="Asking for a person led nowhere"
            text="Clients got a name and a phone number instead of a connection in chat."
          />
        </div>
      </div>
    </section>
  );
}

const CORE_FLOWS = [
  {
    title: "Move 1: Reading the loan stage to know what's next",
    body: [
      "I sat with engineers to see what data the chat could use without a big restructure. A live API already fed each client's loan stage to their dashboard, so Rocket Assist could read the same state and show only the tasks still open.",
    ],
    bgSrc: "/rm-bg-orientation.avif",
    bgAlt: "Living room interior",
    videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776030651/Onboarding_Flow_hm76na.mp4",
    videoAlt: "Redesigned onboarding flow for Rocket Assist",
  },
  {
    title: "Move 2: Naming the source behind every recommendation",
    body: [
      "Inspector suggestions named the realtor as the source, appraisal insights pointed to the report and insurance tips came from the home's own listing. Clients could open the files right in the chat.",
    ],
    bgSrc: "/rm-bg-comprehension.avif",
    bgAlt: "Kitchen interior",
    videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776035827/Inspector_Recommendations_cvyuma.mp4",
    videoAlt: "Personalized recommendations of local inspectors",
  },
  {
    title: "Move 3: Handing off to a person before the client gets stuck",
    body: [
      "Chat specialists handled these conversations every day, so I interviewed them on what clients kept asking and how they worked around Rocket Assist.",
      "A request for help or signs of frustration now route the client straight to their purchase specialist, with the conversation history carried over.",
    ],
    bgSrc: "/rm-bg-resolution.avif",
    bgAlt: "Person on telephone",
    videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776035827/Human_Handover_xbhbj3.mp4",
    videoAlt: "Quick human handover and context preservation",
  },
];

/** Text and phone video side by side, in two equal columns; the video side alternates. */
function CoreFlows() {
  return (
    <section id="core-flows" className="flex flex-col gap-28">
      <SectionHeader eyebrow="Core Flows" title="How I turned a generic experience into a guided mortgage journey">
        <p>
          The redesign runs from onboarding through in-chat guidance, with task cards scoped to each
          client&rsquo;s loan stage, recommendations that name their source and a handoff to a real
          person.
        </p>
        <p>
          The interaction patterns I proposed influenced Rocket Assist&rsquo;s product roadmap beyond
          the internship.
        </p>
      </SectionHeader>
      {CORE_FLOWS.map((flow, index) => (
        <div
          key={flow.title}
          className={`flex w-full items-start gap-12 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <h3 className={caseStudySubheading}>{flow.title}</h3>
            <div className={`${caseStudyText} flex flex-col gap-4`}>
              {flow.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          {/* Figma: 480×747 container, 323×667 phone with 41.94px corners. */}
          <SolutionShowcase
            bgSrc={flow.bgSrc}
            bgAlt={flow.bgAlt}
            videoSrc={flow.videoSrc}
            videoAlt={flow.videoAlt}
            className="aspect-[480/747] min-w-0 flex-1"
            videoClassName="h-[89.29%] w-[67.29%] rounded-[41.94px] object-cover"
          />
        </div>
      ))}
    </section>
  );
}

const IMPACT_STATS = [
  {
    value: "92%",
    label: "Improved Experience",
    text: "of clients found the tailored responses were more helpful than the current guidance.",
  },
  {
    value: "75%",
    label: "Increased Trust",
    text: "of clients found sourced recommendations by AI more trustworthy.",
  },
  {
    value: "96%",
    label: "Reduced Frustration",
    text: "of clients noted the proposed handoff flow would reduce frustration.",
  },
];

function Impact() {
  return (
    <section id="impact">
      <SectionHeader eyebrow="Impact" title="Validating the new experience with the clients" bodyClassName="gap-12">
        {IMPACT_STATS.map((stat) => (
          <div key={stat.label} className="flex items-center gap-6">
            <p className="flex size-[91px] shrink-0 items-center justify-center rounded-full bg-[var(--accent-dark)] font-label text-[32px] font-bold leading-[48px] text-surface-page">
              {stat.value}
            </p>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className={caseStudyRowTitle}>{stat.label}</h3>
              <p>{stat.text}</p>
            </div>
          </div>
        ))}
      </SectionHeader>
    </section>
  );
}

const INSPECTOR_CARDS = [
  {
    label: "Front",
    src: "/new-rocket-mortgage-case-page/General%20inspector-front.avif",
    alt: "Front of the inspector recommendation card showing Sarah Millerson's profile and call-to-action",
  },
  {
    label: "Back",
    src: "/new-rocket-mortgage-case-page/General%20inspector-back.avif",
    alt: "Back of the inspector recommendation card showing an AI-generated summary of client reviews",
  },
];

function Blocker() {
  return (
    <section id="blocker" className="flex flex-col items-center gap-12">
      <SectionHeader eyebrow="Blocker" title="The inspector card feature tested well but got cut">
        <p>
          It scored high in usability testing, but the backend architecture needed to support it
          wasn&rsquo;t within the team&rsquo;s bandwidth that cycle. Building it would require
          multiple API integrations, not just within the Rocket Mortgage system but also
          Redfin&rsquo;s, which has been acquired by Rocket Companies.
        </p>
        <p>
          It was an essential lesson in the gap between the simplicity of a feature design and the
          many pieces that had to fall into place in order to push it out the door.
        </p>
      </SectionHeader>
      <div className="flex w-[758px] max-w-full items-center justify-center gap-[58px] rounded-[var(--ds-radius-container)] border border-border bg-surface-page px-10 py-14">
        {INSPECTOR_CARDS.map((card) => (
          <figure key={card.label} className="flex w-[310px] min-w-0 flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.src} alt={card.alt} className="aspect-[310/280] w-full" />
            <figcaption className="font-label text-[14px] font-medium leading-[22px] text-secondary">
              {card.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const REFLECTIONS = [
  {
    title: "No fallback path existed for a mismatched task",
    text: "Rocket Assist reflected the dashboard's state rather than owning it, so a correction path belonged to that system, not this surface.",
  },
  {
    title: "I went to engineers and specialists before anyone asked me to",
    text: "Seeking out engineers, researchers and chat specialists early got me into the conversations that shaped this work most. It's also how I found most of the edge cases.",
  },
];

function Reflections() {
  return (
    <section id="reflections">
      <SectionHeader eyebrow="Reflections" title="What I'm taking with me from Rocket" bodyClassName="gap-12 pt-2">
        {REFLECTIONS.map((item) => (
          <div key={item.title} className="flex flex-col gap-3">
            <h3 className={caseStudyRowTitle}>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </SectionHeader>
    </section>
  );
}

export default function RocketMortgageContent() {
  return (
    <CaseStudyLayout
      sept2026Layout
      accentDark={brands.rocket.dark}
      accentLight={brands.rocket.light}
      bodyBackgroundColor={SITE_DEFAULT_PAGE_BG}
      headlineClassName={caseStudyTitle}
      logos={[
        { src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" },
        { src: "/logos/rocket-assist-full.svg", alt: "Rocket Assist" },
      ]}
      projectName="Rocket Mortgage"
      headline="Personalizing AI guidance across 6.8M+ client conversations"
      reverseHeaderOrder
      heroVisual={<RocketMortgageTripleVideos className="rounded-2xl" />}
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
    >
      <ProblemSpace />

      <Testimonial
        quote="This was perhaps her most complex assignment, and Pri quickly mapped key friction points while collaborating with engineers and researchers. Her work helped influence product roadmap priorities."
        name="Dana Lee"
        title="Director of CXD & Digital Product Management"
        linkedin="https://www.linkedin.com/in/danayoo/"
      />

      <CoreFlows />

      <Impact />

      <Blocker />

      <Testimonial
        quote="Driven by curiosity to understand client problems, Pri developed solutions that delivered business value. Her prototypes influenced product strategy, and she collaborated exceptionally across teams."
        name="Amanda Matzenbach"
        title="Conversational AI Design Manager & Mentor"
        linkedin="https://www.linkedin.com/in/amanda-matzenbach/"
      />

      <Reflections />
    </CaseStudyLayout>
  );
}
