import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import SolutionShowcase from "../components/SolutionShowcase";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import SectionLabel from "../components/SectionLabel";
import VisualCaption from "../components/VisualCaption";

export const metadata: Metadata = {
  title: "Rocket Mortgage | Priyamwada Pandey",
  description:
    "I introduced interaction patterns to Rocket's AI assistant that made it to the product roadmap.",
};

const accent = "#851F27";

const CARD_BORDER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23E6E6E6' stroke-width='1.5' stroke-dasharray='8 8' stroke-linecap='round'/%3E%3C/svg%3E\")";

function ClientQuote({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <div
      data-toc-dark="true"
      className="rm-quote-block"
      style={{ backgroundColor: "#111111" }}
    >
      <div className="w-[70%] max-w-[1298px] mx-auto py-12 md:py-16">
        {/* rm-quote-inner handles desktop padding to align text with the content column */}
        <div className="rm-quote-inner">
          <p
            className="text-lg md:text-xl text-white leading-relaxed italic mb-4"
            style={{ fontFamily: "var(--font-ovo), serif" }}
          >
            &ldquo;{quote}&rdquo;
          </p>
          <p className="font-mono text-[14px] font-semibold tracking-wider text-neutral-400">
            {attribution}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Journey timeline — problem space visual ───────────────────────────────
function JourneyTimeline() {
  return (
    <div className="w-full mt-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/rm-problem-space.svg"
        alt="Diagram showing the 7–10 day critical window between offer acceptance and move-in, with stages: mortgage processing, inspections, appraisal, negotiate repairs, and closing."
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </div>
  );
}

function FeedbackBubble({ text }: { text: string }) {
  return (
    <p className="font-sans text-[16px] leading-relaxed italic" style={{ color: "#111111" }}>
      &ldquo;{text}&rdquo;
    </p>
  );
}

export default function RocketMortgagePage() {
  return (
    <CaseStudyLayout
      accentDark={accent}
      accentLight="#F8D6D9"
      logos={[
        { src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" },
        { src: "/logos/rocket-assist-full.svg", alt: "Rocket Assist" },
      ]}
      projectName="Rocket Mortgage"
      headline="I introduced interaction patterns to Rocket's AI assistant that made it to the product roadmap."
      reverseHeaderOrder
      hideContextLabel
      heroVisual={
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/rm-hero.avif"
          alt="Rocket Assist interface overview"
          className="w-full rounded-2xl min-[400px]:rounded-[28px]"
          style={{ display: "block" }}
        />
      }
      context="Rocket Mortgage's AI assistant guides first-time homebuyers through the mortgage process. At the post-offer stage, guidance inside the assistant was largely generic and disconnected from each client's specific situation."
      contribution={
        <ul className="space-y-5">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
            <span>Redesigned the post-offer onboarding experience inside Rocket Assist for first-time homebuyers</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
            <span>Introduced task carousels, visual document components and a transparent human escalation path</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
            <span>92% of clients found the personalized experience helpful; several interaction patterns entered roadmap discussions</span>
          </li>
        </ul>
      }
      contextVisual={
        <BeforeAfterSlider
          beforeSrc="/rm-before.avif"
          afterSrc="/rm-after.avif"
          beforeAlt="Rocket Assist chat before redesign"
          afterAlt="Rocket Assist chat after redesign"
          startPercent={40}
        />
      }
      meta={{
        timeline: "May 2025 – Aug 2025",
        industry: "Fintech",
        role: "Product Design",
        team: "Conversational AI Designers, Product Designers",
      }}
      nextProject={{
        href: "/tars-debug-mode",
        tags: "Product Design · 2022 · Tars Technologies",
        title:
          "I designed and shipped a debug tool that reduced testing time by 50%, for two distinct user groups.",
      }}
      toc={[
        { id: "problem-space", label: "Problem Space" },
        { id: "orientation", label: "Orientation" },
        { id: "comprehension", label: "Comprehension" },
        { id: "resolution", label: "Resolution" },
        { id: "impact", label: "Impact" },
        { id: "business-impact", label: "Business Impact" },
        { id: "testimonials", label: "Testimonials" },
        { id: "reflection", label: "Reflection" },
      ]}
    >
      {/* Client Quote 1 */}
      <ClientQuote
        quote="I'm buying a house; it's a lot of money, it should really be a guided journey"
        attribution="A Rocket Mortgage client"
      />

      {/* Problem Space */}
      <section id="problem-space">
        <SectionLabel>Problem Space</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          Where homebuyers start to feel lost.
        </h2>
        <div className="space-y-5">
          <p>
            After an offer is accepted, first-time homebuyers enter a 7 to 10 day window that requires completing inspections, reviewing documents and making decisions that directly affect their purchase. The guidance available inside Rocket Mortgage at this stage is not personalized, with no account for the specifics of a client&apos;s home or nuances related to their mortgage journey.
          </p>
          <p className="italic text-secondary">
            72% of clients end up seeking help via chat, which drives agent call volume up at exactly the moment when support teams are already stretched.
          </p>
        </div>
        <JourneyTimeline />
      </section>

      {/* Client Quote 2 */}
      <ClientQuote
        quote="It took me a little bit of digging into the report to see what the appraisal was. It would be nice if there was just, like, appraisal came in at this amount."
        attribution="A Rocket Mortgage client"
      />

      {/* Orientation */}
      <section id="orientation">
        <SectionLabel>Orientation</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          Give clients a starting point.
        </h2>
        <SolutionShowcase
          bgSrc="/rm-bg-orientation.avif"
          bgAlt="Living room interior"
          videoSrc="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776030651/Onboarding_Flow_hm76na.mp4"
          videoAlt="Redesigned onboarding flow for Rocket Assist"
        />
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mt-10">
          <div className="space-y-5">
            <p>
              Before anything else could work, clients needed to know where they were in the process and what required their attention. The most common question in the chat logs was some version of &lsquo;what do I do next?&rsquo; I started there.
            </p>
            <p>
              I explored moving the answer into the conversation itself — building an onboarding flow that introduced clients to Rocket Assist in the context of their specific loan stage, so the first thing they saw was directly relevant to where they were in the process. The most relevant next steps surfaced as task-based carousels inside the chat.
            </p>
          </div>
          <div className="flex flex-col" style={{ padding: "40px 0" }}>
            <p className="font-mono text-[11px] font-semibold tracking-wider uppercase mb-5" style={{ color: accent }}>How clients experienced this</p>
            <div className="flex flex-col gap-[40px]">
              <FeedbackBubble text="...I like that it realized that the home has a pool so I would need a pool inspection done too and it's giving relevant information..." />
              <FeedbackBubble text="...I like how the inspector cards are laid out and the information shown, feels super helpful. Everything is perfectly readable." />
            </div>
          </div>
        </div>
      </section>

      {/* Comprehension */}
      <section id="comprehension">
        <SectionLabel>Comprehension</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          Bring the information into the conversation.
        </h2>
        <SolutionShowcase
          bgSrc="/rm-bg-comprehension.avif"
          bgAlt="Kitchen interior"
          videoSrc="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776035827/Inspector_Recommendations_cvyuma.mp4"
          videoAlt="Personalized recommendations of local inspectors"
          videoClipPath="inset(0 12px)"
        />
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mt-10">
          <div className="space-y-5">
            <p>
              Knowing what to do next and being able to act on it are different problems. Once clients had a task in front of them, the next gap was the information required to complete it. At the post-offer stage, that meant inspection reports, appraisal documents and multiple contacts — all outside the assistant. Text responses alone weren&apos;t enough.
            </p>
            <p>
              I introduced visual components that brought the information inside: inspector recommendation cards personalized to the client&apos;s home, document cards with highlighted insights and dynamic prompt buttons that surfaced the next logical action without requiring the client to ask.
            </p>
          </div>
          <div className="flex flex-col" style={{ padding: "40px 0" }}>
            <p className="font-mono text-[11px] font-semibold tracking-wider uppercase mb-5" style={{ color: accent }}>How clients experienced this</p>
            <div className="flex flex-col gap-[40px]">
              <FeedbackBubble text="I like that the inspector cards are easy to navigate and they are simple in design, I can see everything clearly" />
              <FeedbackBubble text="...I like that there is a direct link to the report and that there are highlights of the report. I like that I could download it instantly." />
            </div>
          </div>
        </div>
      </section>

      {/* Resolution */}
      <section id="resolution">
        <SectionLabel>Resolution</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          Design the exit.
        </h2>
        <SolutionShowcase
          bgSrc="/rm-bg-resolution.avif"
          bgAlt="Person on telephone"
          videoSrc="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776035827/Human_Handover_xbhbj3.mp4"
          videoAlt="Quick human handover and context preservation"
          videoClipPath="inset(0 12px)"
        />
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mt-10">
          <div className="space-y-5">
            <p>
              Some decisions carry too much weight for an AI to hold. The conversation logs showed a consistent pattern: clients would reach a point where they needed reassurance that only a person could give. Rather than treating this as a failure state, I designed the handoff as a feature.
            </p>
            <p>
              Clients could transfer directly to their Purchase Specialist, see the estimated wait time upfront and schedule a callback if needed. The conversation history carried over so the specialist could see exactly what the client had already been through — no starting over, no repeated context.
            </p>
          </div>
          <div className="flex flex-col" style={{ padding: "40px 0" }}>
            <p className="font-mono text-[11px] font-semibold tracking-wider uppercase mb-5" style={{ color: accent }}>How clients experienced this</p>
            <div className="flex flex-col gap-[40px]">
              <FeedbackBubble text="Overall, I am a big fan of the flow of connecting to a person when required and that the chat history is not deleted." />
              <FeedbackBubble text="...I also like that it would notify me through the app when the person is available and I don't have to save random numbers on my phone." />
            </div>
          </div>
        </div>
      </section>

      {/* Impact + client quotes merged */}
      <section id="impact">
        <SectionLabel>Impact</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-14">
          Validating the experience with clients
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              stat: "92%",
              label: "Found tailored responses helpful",
              quote: "I like that it [Rocket Assist] realized that the home has a pool so I would need a pool inspection done too, giving relevant info…",
            },
            {
              stat: "75%",
              label: "Liked the inspector recommendations",
              quote: "I like the inspector recommendations from my realtor, rather than those who might have paid for advertisement on this app.",
            },
            {
              stat: "90%",
              label: "Found transfer option reduced frustration",
              quote: "I also really like that it gives me the option and the wait time to connect to a human being for stuff that is sensitive…",
            },
          ].map((item) => (
            <div key={item.stat} className="flex flex-col gap-3">
              <p className="font-sans text-4xl md:text-5xl font-bold text-ink leading-none">{item.stat}</p>
              <p className="font-mono text-[14px] font-semibold tracking-wider uppercase"
                style={{ color: accent }}>{item.label}</p>
              <p className="font-sans text-sm text-secondary leading-relaxed italic">&ldquo;{item.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business Impact */}
      <section id="business-impact">
        <SectionLabel>Business Impact</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          The work moved beyond the internship into roadmap discussions.
        </h2>
        <p className="font-sans text-base text-secondary leading-relaxed mb-8">
          Early and frequent conversations with the product team helped align the work around what was actually feasible and what could move fast. Several of the interaction patterns introduced are now part of ongoing roadmap discussions for the Rocket Mortgage mobile app experience.
        </p>
        <blockquote className="border-l-2 pl-5" style={{ borderColor: accent }}>
          <p className="font-sans text-[20px] leading-relaxed italic mb-3" style={{ color: accent }}>
            &ldquo;I am really excited about the direct escalation feature; this solves a real problem that the clients face. The current experience leaves them hanging in the void with just contact details. The proposed experience would be incredible!&rdquo;
          </p>
          <p className="font-mono text-[14px] font-semibold tracking-wider uppercase text-secondary">
            Digital Product Manager, RMO, Rocket Mortgage
          </p>
        </blockquote>
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <SectionLabel>Testimonials</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          From the people I worked with
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              quote: "This was perhaps her most complex assignment, and Pri quickly mapped key friction points while collaborating with engineers and researchers. Her work helped influence product roadmap priorities.",
              name: "Dana Lee",
              title: "Director of Conversational AI Design & Digital Product Management",
              company: "Rocket Mortgage",
              linkedin: "https://www.linkedin.com/in/danayoo/",
            },
            {
              quote: "Pri routinely sought out and addressed challenging issues, independently identified critical opportunities for improvement, and delivered results on par with a full-time associate designer.",
              name: "Amanda Matzenbach",
              title: "Conversational AI Design Manager & Mentor",
              company: "Rocket Mortgage",
              linkedin: "https://www.linkedin.com/in/amanda-matzenbach/",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="flex flex-col justify-between p-10"
              style={{
                backgroundColor: "#FBFBFB",
                borderRadius: "24px",
                backgroundImage: CARD_BORDER,
              }}
            >
              <p className="font-sans text-base text-secondary leading-relaxed italic mb-10">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-[14px] font-bold tracking-wider uppercase"
                    style={{ color: accent }}>{item.name}</p>
                  <a
                    href={item.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.name} on LinkedIn`}
                    className="hover:opacity-60 transition-opacity shrink-0"
                  >
                    <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <path d="M20.875 5.875H7.125C6.79348 5.875 6.47554 6.0067 6.24112 6.24112C6.0067 6.47554 5.875 6.79348 5.875 7.125V20.875C5.875 21.2065 6.0067 21.5245 6.24112 21.7589C6.47554 21.9933 6.79348 22.125 7.125 22.125H20.875C21.2065 22.125 21.5245 21.9933 21.7589 21.7589C21.9933 21.5245 22.125 21.2065 22.125 20.875V7.125C22.125 6.79348 21.9933 6.47554 21.7589 6.24112C21.5245 6.0067 21.2065 5.875 20.875 5.875ZM11.5 17.75C11.5 17.9158 11.4342 18.0747 11.3169 18.1919C11.1997 18.3092 11.0408 18.375 10.875 18.375C10.7092 18.375 10.5503 18.3092 10.4331 18.1919C10.3158 18.0747 10.25 17.9158 10.25 17.75V12.75C10.25 12.5842 10.3158 12.4253 10.4331 12.3081C10.5503 12.1908 10.7092 12.125 10.875 12.125C11.0408 12.125 11.1997 12.1908 11.3169 12.3081C11.4342 12.4253 11.5 12.5842 11.5 12.75V17.75ZM10.875 11.5C10.6896 11.5 10.5083 11.445 10.3542 11.342C10.2 11.239 10.0798 11.0926 10.0089 10.9213C9.93791 10.75 9.91934 10.5615 9.95551 10.3796C9.99169 10.1977 10.081 10.0307 10.2121 9.89959C10.3432 9.76848 10.5102 9.67919 10.6921 9.64301C10.874 9.60684 11.0625 9.62541 11.2338 9.69636C11.4051 9.76732 11.5515 9.88748 11.6545 10.0417C11.7575 10.1958 11.8125 10.3771 11.8125 10.5625C11.8125 10.8111 11.7137 11.0496 11.5379 11.2254C11.3621 11.4012 11.1236 11.5 10.875 11.5ZM18.375 17.75C18.375 17.9158 18.3092 18.0747 18.1919 18.1919C18.0747 18.3092 17.9158 18.375 17.75 18.375C17.5842 18.375 17.4253 18.3092 17.3081 18.1919C17.1908 18.0747 17.125 17.9158 17.125 17.75V14.9375C17.125 14.5231 16.9604 14.1257 16.6674 13.8326C16.3743 13.5396 15.9769 13.375 15.5625 13.375C15.1481 13.375 14.7507 13.5396 14.4576 13.8326C14.1646 14.1257 14 14.5231 14 14.9375V17.75C14 17.9158 13.9342 18.0747 13.8169 18.1919C13.6997 18.3092 13.5408 18.375 13.375 18.375C13.2092 18.375 13.0503 18.3092 12.9331 18.1919C12.8158 18.0747 12.75 17.9158 12.75 17.75V12.75C12.7508 12.5969 12.8077 12.4494 12.91 12.3355C13.0123 12.2216 13.1529 12.1492 13.305 12.1321C13.4571 12.115 13.6102 12.1542 13.7353 12.2425C13.8604 12.3308 13.9488 12.4619 13.9836 12.6109C14.4064 12.3241 14.8993 12.1579 15.4095 12.1301C15.9196 12.1023 16.4277 12.214 16.8792 12.4532C17.3306 12.6924 17.7084 13.05 17.972 13.4877C18.2355 13.9254 18.3748 14.4266 18.375 14.9375V17.75Z" fill="#0A66C2"/>
                    </svg>
                  </a>
                </div>
                <p className="font-sans text-xs text-secondary">{item.title}</p>
                <p className="font-sans text-xs text-secondary">{item.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reflection */}
      <section id="reflection">
        <SectionLabel>Reflection</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          Not waiting to be pointed in the right direction is what opened the most useful conversations.
        </h2>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Left: reflection image + caption */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/rm-reflection.avif"
              alt="Presenting the Rocket Mortgage project at the intern design showcase"
              className="w-full rounded-2xl object-cover"
              style={{ outline: "1px solid rgba(0,0,0,0.06)" }}
            />
            <VisualCaption>Presenting the project in a showcase to the larger product management & design team at Rocket Mortgage</VisualCaption>
          </div>
          {/* Right: reflection text */}
          <div className="space-y-5">
            <p>
              Working inside a mature design team for the first time, the difference was immediately noticeable. Watching senior designers think through downstream consequences before they became problems, reshaped how I approach my own work.
            </p>
            <p>
              The moment that stuck with me most was presenting to the RMO product lead. I expected design feedback. Instead he broke each feature down to its smallest moving part. APIs, infrastructure constraints and engineering dependencies. It was the first time I understood that a single feature is really ten decisions that all need to align first.
            </p>
            <p>
              Not waiting to be pointed in the right direction is what opened the most useful conversations. Seeking out engineers, designers and domain experts on my own got me into conversations I wasn&apos;t expected to be in and those conversations shaped the work more than anything else.
            </p>
          </div>
        </div>
      </section>
    </CaseStudyLayout>
  );
}
