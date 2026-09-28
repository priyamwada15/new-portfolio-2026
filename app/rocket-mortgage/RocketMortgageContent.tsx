import CaseStudyLayout from "../components/CaseStudyLayout";
import SolutionShowcase from "../components/SolutionShowcase";
import { RocketMortgageTripleVideos } from "../components/RocketMortgageTripleVideos";
import { SectionHeader, Testimonials } from "../components/CaseStudySections";
import {
  brands,
  caseStudyEyebrow,
  caseStudyRowTitle,
  caseStudySubheading,
  caseStudyText,
  caseStudyTitle,
  HOME_V2_PAGE_BG,
  ROCKET_MORTGAGE_CARD_VIDEOS,
} from "@/design-system";

const PROBLEM_IMAGE_DIR = "/new-rocket-mortgage-case-page";

/** Number, title and one-line description under each old-UI screenshot. */
function ProblemCardText({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="flex gap-2 font-label text-[18px] leading-[28px]">
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
      className={`flex flex-col items-center gap-10 overflow-hidden rounded-[var(--ds-radius-container)] border border-border bg-surface-page px-10 pb-10 ${
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
          Rocket&rsquo;s AI Assistant was giving clients generic guidance when they needed
          personalized support the most. The lack of relevant guidance and transparency made the
          experience harder to trust and contributed to lower chat containment.
        </p>
        <p>
          To understand where the experience was falling short, I reviewed research reports, client
          reviews, and chat transcripts. Three recurring gaps surfaced across the research, which
          became the focus of the project.
        </p>
      </SectionHeader>
      {/* 01 + quote sit in the right column; DOM order keeps 01 first for screen readers. */}
      <div className="grid w-full grid-cols-2 gap-4">
        <div className="order-2 flex flex-col gap-[21px]">
          <ProblemCard
            full
            src={`${PROBLEM_IMAGE_DIR}/Problem%201.avif`}
            alt="Rocket Assist answering a question about required documents with a long block of text"
            number="01"
            title="Everything was text"
            text="Answers came as paragraphs with nothing a client could act on."
          />
          <figure className="flex flex-1 flex-col justify-center gap-4 rounded-[var(--ds-radius-container)] border border-border bg-surface-page p-10">
            <blockquote className="font-label text-[18px] leading-[1.4] text-primary">
              <span className="font-black">&ldquo;</span> It&rsquo;s an authenticated experience so
              it should have my data, but this chat history tells me otherwise.{" "}
              <span className="font-black">&rdquo;</span>
            </blockquote>
            <figcaption className="text-right font-label text-[14px] leading-[24px] text-tertiary">
              Rocket Mortgage Client
            </figcaption>
          </figure>
        </div>
        <div className="order-1 flex flex-col gap-4">
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

/** Same clips as the hero (RocketMortgageTripleVideos): [0] onboarding, [1] inspector, [2] escalation. */
const CORE_FLOWS = [
  {
    title: "Move 1: Turning walls of text into answers clients could act on",
    body: [
      "In the chat transcripts, Rocket Assist answered almost every question with a block of FAQ text. A client asking what an inspection costs needed an estimate for their area and got a paragraph on everything it depends on.",
      "I kept the AI's guidance to a few lines in the message bubble and moved everything else into cards below it. Inspector recommendations became contact-style cards that named the client's realtor as the source, since a shortlist from someone they already worked with was easier to trust than one from the AI. Clients in testing said as much.",
    ],
    videoSrc: ROCKET_MORTGAGE_CARD_VIDEOS[1],
    videoAlt: "Personalized recommendations of local inspectors",
  },
  {
    title: "Move 2: Using what Rocket already knew about each client",
    body: [
      "By the time clients reached Rocket Assist, they had already shared their documents, pre-approval and home details with Rocket. The chat still answered like a stranger, so clients stopped trusting it and called their specialist even for basic questions.",
      "I sat with engineers and found a live API already feeding each client's loan stage and home details to their dashboard, which made it the lowest-friction way to personalize the chat. Routine questions could now stay in the chat, leaving specialists more time for the sensitive ones.",
    ],
    videoSrc: ROCKET_MORTGAGE_CARD_VIDEOS[0],
    videoAlt: "Redesigned onboarding flow for Rocket Assist",
  },
  {
    title: "Move 3: Handing clients to their specialist without making them start over",
    body: [
      "Asking for a person got clients a phone number, and the specialist on the other end couldn't see the chat. One client wrote, “I already talked about this in chat, why do I have to repeat it everywhere.”",
      "I routed a request for help straight to the client's purchase specialist inside the chat, with the conversation carried over. If the specialist was busy, the client could wait in the chat or get notified when they were free. Handing off early also helped with trust, since the research reports showed clients grew suspicious when the AI claimed it could help with everything.",
    ],
    videoSrc: ROCKET_MORTGAGE_CARD_VIDEOS[2],
    videoAlt: "Quick human handover and context preservation",
  },
];

/** Text and phone video side by side, in two equal columns; the video side alternates. */
function CoreFlows() {
  return (
    <section id="core-flows" className="flex flex-col gap-28">
      <SectionHeader eyebrow="Core Flows" title="What I changed to keep clients in the chat">
        <p>
          I wanted more clients to get their answers in the chat and leave satisfied with it. That
          meant making Rocket Assist personal enough to trust, and giving it interactions such as
          inspector cards and a handoff wait timer, so it felt like a mature Rocket product.
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
          {/* Figma: 480×747 container, 323×667 phone with 41.94px corners; styled like the problem cards. */}
          <SolutionShowcase
            videoSrc={flow.videoSrc}
            videoAlt={flow.videoAlt}
            className="aspect-[480/747] min-w-0 flex-1 border border-border bg-surface-page"
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
      <SectionHeader eyebrow="Impact" title="Validating the new experience with the clients" bodyClassName="gap-12 pt-2">
        {/* Same stat layout as Debug Mode: label, then the number reading straight into its sentence. */}
        {IMPACT_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-4">
            <h3 className={caseStudyEyebrow}>{stat.label}</h3>
            <div className="flex flex-col gap-2">
              <p className="font-label text-[32px] font-bold leading-none text-ink">{stat.value}</p>
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
      bodyBackgroundColor={HOME_V2_PAGE_BG}
      headlineClassName={caseStudyTitle}
      headlineMarginClassName="mb-8"
      logos={[
        { src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" },
        { src: "/logos/rocket-assist-full.svg", alt: "Rocket Assist" },
      ]}
      projectName="Rocket Mortgage"
      headline="Personalizing AI guidance across 6.8M+ client conversations"
      reverseHeaderOrder
      heroVisual={<RocketMortgageTripleVideos framed className="rounded-[var(--ds-radius-container)]" />}
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


      <CoreFlows />

      <Impact />

      <Testimonials
        title="Feedback from my director and mentor"
        items={[
          {
            quote:
              "This was perhaps her most complex assignment, and Pri quickly mapped key friction points while collaborating with engineers and researchers. Her work helped influence product roadmap priorities.",
            name: "Dana Lee",
            title: "Director of CXD & Digital Product Management",
            linkedin: "https://www.linkedin.com/in/danayoo/",
          },
          {
            quote:
              "Driven by curiosity to understand client problems, Pri developed solutions that delivered business value. Her prototypes influenced product strategy, and she collaborated exceptionally across teams.",
            name: "Amanda Matzenbach",
            title: "Conversational AI Design Manager & Mentor",
            linkedin: "https://www.linkedin.com/in/amanda-matzenbach/",
          },
        ]}
      />

      {/* Blocker hidden for now: the "tested well but got cut" framing read as negative. Reframe before bringing back. */}
      {false && <Blocker />}


      <Reflections />
    </CaseStudyLayout>
  );
}
