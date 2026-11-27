/**
 * The original Asimov case study body (problem, releases with their visuals,
 * design system, reflections), copied unchanged from `../page.tsx` so the Case
 * Study tab keeps every screen, video and demo. "My role" and the overview now
 * sit above the tabs, so they aren't repeated here.
 */
import Image from "next/image";
import AutoPauseVideo from "../../components/AutoPauseVideo";
import MediaCarousel from "../../components/MediaCarousel";
import { SectionHeader } from "../../components/CaseStudySections";
import { CoreFeatureVideo } from "../CoreFeatureVideo";
import KnowledgeSourcesDemo from "../KnowledgeSourcesDemo";
import ProblemSpaceVisual from "../ProblemSpaceVisual";
import AgentMentionVisual from "../AgentMentionVisual";
import {
  caseStudySectionTagCaps,
  caseStudyRowTitle,
  caseStudySubheading,
  caseStudyText,
  mediaPanel,
} from "@/design-system";

const REFLECTIONS = [
  {
    title: "Ship a first version of the future, even a small one",
    text: "Private sources stayed future scope, and every required update pushed them further back. Next time I'd put a first version of that layer into the release cycle, even one that simply mirrored Slack's permissions, so it already had a place in the product.",
  },
] as const;

/**
 * Grey 488×558 panel with a screenshot 48px from the top and its caption 16px
 * below it, in the page's caption style. Sizes are Figma px, turned into
 * percentages so the layout holds as the panel scales.
 */
function PanelShot({
  src,
  alt,
  intrinsic,
  width,
  caption,
  bordered = false,
}: {
  src: string;
  alt: string;
  /** The file's pixel size, for next/image. */
  intrinsic: { width: number; height: number };
  /** Display width inside the 488px panel. */
  width: number;
  caption: string;
  /** Adds a 1px border for screenshots without their own frame. */
  bordered?: boolean;
}) {
  return (
    <figure className={`relative aspect-[488/558] w-full overflow-hidden ${mediaPanel}`}>
      <div
        className="absolute left-1/2 flex -translate-x-1/2 flex-col gap-4"
        style={{ width: `${(width / 488) * 100}%`, top: `${(48 / 558) * 100}%` }}
      >
        <Image
          src={src}
          alt={alt}
          width={intrinsic.width}
          height={intrinsic.height}
          className={`h-auto w-full ${bordered ? "rounded-[9px] border border-border" : ""}`}
          style={{ filter: "drop-shadow(0px 0px 24px rgba(0,0,0,0.04))" }}
        />
        <figcaption className="text-center font-label text-[14px] leading-[22px] text-secondary">{caption}</figcaption>
      </div>
    </figure>
  );
}

function PreviewVideo({ src, label }: { src: string; label: string }) {
  return (
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
  );
}

/** Video frames fill their carousel slot. */
const slotVideo = "block size-full";

function Lead({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-primary">{children}</strong>;
}

const RELEASES: {
  number: number;
  /** Replaces the default "Release N" eyebrow. */
  label?: string;
  /** Text and media side by side in two equal columns (like Rocket Mortgage's Moves). */
  split?: boolean;
  title: string;
  body: React.ReactNode;
  media: React.ReactNode;
}[] = [
  {
    number: 0,
    label: "Initial direction",
    title: "One agent that held every team's context",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}every team shared the pains above, but each wanted something
          different from an AI agent: engineering wanted GitHub workflows, sales wanted CRM updates
          and marketing wanted help with content.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}my early designs gave each use-case its own Slack agent. A
          stakeholder review showed that several agents in one workspace would be hard to scale and
          manage, so I redesigned Asimov as one agent holding many contexts, with each team&rsquo;s
          knowledge sources (the channels and docs it could read) managed separately.
        </p>
      </>
    ),
    media: <AgentMentionVisual />,
  },
  {
    number: 1,
    split: true,
    title: "A pilot entirely inside Slack, with no setup beyond adding Asimov to a channel",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}that was the pain a Slack-only tool could solve first.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}the problem was already too many tools, so I kept the pilot
          entirely inside Slack. Anyone could ask Asimov to summarize a thread or pull out a
          specific answer with its context, much like today&rsquo;s AI meeting notetakers.
        </p>
        <p>
          <Lead>No configuration hub in the pilot.</Lead>{" "}Adding Asimov to a channel was the
          whole setup, so we could test whether its answers were useful before building anything
          around it.
        </p>
      </>
    ),
    media: (
      <PanelShot
        src="/new-asimov/Slack%201.avif"
        alt="Slack thread with Asimov summarizing the conversation"
        intrinsic={{ width: 830, height: 851 }}
        width={415}
        bordered
        caption="Example scenario of Asimov summarizing threads"
      />
    ),
  },
  {
    number: 2,
    title: "Only workspace admins change Asimov, and it never reveals what the asker can’t see",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}an AI agent reading team conversations needed guardrails from day
          one, so I pushed for permissions right after the pilot.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}I split the problem in two. Who could change Asimov needed a
          fast answer: only Slack workspace admins, who were already accountable for the workspace.
          What Asimov should say was harder, since it could read things the person asking
          wasn&rsquo;t allowed to see. I designed a response model in Slack for those cases,
          covering different roles and permission clashes.
        </p>
        <p>
          <Lead>The response model is the decision I&rsquo;m proudest of.</Lead>{" "}It set the base
          for handling roles once teams were ready to share more.
        </p>
      </>
    ),
    media: (
      <div className="grid w-full grid-cols-2 items-start gap-8 max-md:grid-cols-1 max-md:gap-4">
        <PanelShot
          src="/new-asimov/Admin User Manage Settings Modal.avif"
          alt="Admin settings modal for managing who has access to configure Asimov"
          intrinsic={{ width: 1010, height: 1269 }}
          width={330}
          caption="Admin-only settings for Asimov's members, channels and prompt"
        />
        <PanelShot
          src="/new-asimov/Response Model.avif"
          alt="Asimov telling a user privately that their answer is incomplete because it drew on channels they can't access, with Request Access and Dismiss options"
          intrinsic={{ width: 800, height: 963 }}
          width={340}
          caption="Asimov flagging an incomplete answer privately, with a way to request access"
        />
      </div>
    ),
  },
  {
    number: 3,
    title: "Admins decide which company docs Asimov can read",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}channel history only went so far. Research showed teams needed
          answers from company docs too, so I pushed for knowledge sources next.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}I designed the first configuration flow around one idea:
          admins control what the agent can read and use. They picked sources and channels, saw each
          source&rsquo;s sync status and could re-sync or schedule syncs. Each integration showed
          what data Asimov could read. My bet was that control would build confidence, and
          confidence would drive adoption.
        </p>
        <p>
          <Lead>I limited Asimov to public information.</Lead>{" "}Teams in early 2024 were wary of
          giving an AI private data, so I parked private sources for later and let trust build
          first.
        </p>
        <p>
          <Lead>Integrations shipped alongside,</Lead>{" "}since connecting an app like Notion is
          what makes it a knowledge source.
        </p>
      </>
    ),
    media: (
      <MediaCarousel
        label="Knowledge sources and integrations"
        slides={[
          {
            title: "Knowledge dashboard",
            media: (
              <CoreFeatureVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/KB_Asimov_nrvbu8.mp4"
                title="Knowledge Dashboard"
                className={slotVideo}
              />
            ),
          },
          {
            title: "Adding knowledge sources and Slack channels",
            // The demo's tab bar sits above its video, so it runs a little narrower to fit the slot.
            media: (
              <div className="mx-auto w-[96%]" aria-hidden="true">
                <KnowledgeSourcesDemo />
              </div>
            ),
          },
          {
            title: "Integrations hub",
            media: (
              <CoreFeatureVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/Integrations_Asimov_izfe8q.mp4"
                title="Integrations Hub"
                className={slotVideo}
              />
            ),
          },
          {
            title: "What each integration can read",
            media: (
              <PreviewVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785523382/Integrations_Preview_xayos0.mp4"
                label="Integrations experience demo"
              />
            ),
          },
        ]}
      />
    ),
  },
  {
    number: 4,
    split: true,
    title: "Two ways to check every answer Asimov gave",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}once Asimov answered from company docs, people needed to check it.
          AI interaction patterns were still forming in early 2024, and I was convinced an agent
          holding team information had to show its sources to be trusted. I pushed for this release.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}I designed two ways to verify an answer: the sources Asimov
          used and the steps it took. Together they covered both ways an answer could go wrong. A
          hallucination got a thumbs down with optional feedback, and stale information got fixed by
          updating the source. The same thumbs up and down gave us the 86% helpful score.
        </p>
        <p>
          <Lead>This is where repeat questions dropped.</Lead>{" "}Asked about a past API failure,
          Asimov linked the original thread, and the engineering lead didn&rsquo;t have to explain
          it again.
        </p>
      </>
    ),
    media: (
      <PanelShot
        src="/new-asimov/Debug Asimov Response.avif"
        alt="Inspect Asimov Response panel listing the steps Asimov took to answer a request, with the first step expanded to show the tool and query it used"
        intrinsic={{ width: 800, height: 902 }}
        width={370}
        caption="Inspecting the steps Asimov took to reach an answer"
      />
    ),
  },
  {
    number: 5,
    title: "Teams write their own actions first, so we could test whether Asimov acts safely",
    body: (
      <>
        <p>
          <Lead>Why:</Lead>{" "}research surfaced one clear automation opportunity: with a
          situation&rsquo;s full context, Asimov could let teams trigger every related task from
          Slack. The founders pushed for Actions next.
        </p>
        <p>
          <Lead>My approach:</Lead>{" "}letting an AI act in other tools raised the stakes, so we
          piloted custom actions first and I kept them simple on purpose. Teams wrote their own
          through a configurable schema. Tars&rsquo; CEO set up /linkedin to have Asimov draft a
          LinkedIn post in his voice whenever a developer announced a release. This let us test
          whether Asimov acted safely before anyone connected their own tools and APIs.
        </p>
        <p>
          <Lead>I designed built-in actions for connected tools</Lead>{" "}as the next step, so
          admins could switch actions on or off for each app. They never shipped, but they held to
          the principle behind every release: admins decide what Asimov can do.
        </p>
      </>
    ),
    media: (
      <MediaCarousel
        label="Actions"
        slides={[
          {
            title: "Action configuration",
            media: (
              <CoreFeatureVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785343890/Actions_Asimov_e9ezjr.mp4"
                title="Action Configuration"
                className={slotVideo}
              />
            ),
          },
          {
            title: "Writing a custom action",
            media: (
              <PreviewVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785526992/Actions_Preview_ykwxsc.mp4"
                label="Custom actions configuration demo"
              />
            ),
          },
          {
            title: "Asimov pulling an answer from a connected app",
            media: (
              <div className="absolute inset-0 flex justify-center pb-6 pt-2">
                <Image
                  src="/new-asimov/Slack%202.avif"
                  alt="Slack thread showing Asimov integrating with another app"
                  width={756}
                  height={892}
                  className="h-full w-auto rounded-[9px] border border-border"
                />
              </div>
            ),
          },
        ]}
      />
    ),
  },
];

export function CaseStudyBody() {
  return (
    <div className="flex flex-col gap-[128px]">
      <section id="story-problem" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="The problem"
          title="Startup teams lost time digging through Slack and switching between tools"
        >
          <p>
            At the startups I talked to, most work began in Slack, and so did most of what people
            needed to know. Finding one detail meant scrolling back through long threads, because
            Slack&rsquo;s search couldn&rsquo;t surface it.
          </p>
          <p>
            The same questions kept coming back as a result. A customer success rep might ask the
            engineering lead about the same API failure several times over a few months.
          </p>
          <p>
            Once they found an answer, the work moved elsewhere. The rep would carry the context into
            HubSpot or a client report by hand, and every switch between tools cost time and focus.
          </p>
        </SectionHeader>
        <ProblemSpaceVisual />
      </section>

      <section id="story-releases" className="flex flex-col gap-[88px]">
        <div className="flex flex-col gap-12">
          <SectionHeader eyebrow="Five releases" title="Five releases in five months, each widening what admins control">
            <p>
              Each release took two and a half to three weeks from MVP design to launch.
            </p>
          </SectionHeader>
        </div>
        {RELEASES.map((release) =>
          release.split ? (
            <div key={release.number} className="flex flex-col gap-12">
            <div className="flex w-full items-start gap-10 max-md:flex-col max-md:items-stretch max-md:gap-6">
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <p className={caseStudySectionTagCaps}>{release.label ?? `Release ${release.number}`}</p>
                <div className="flex flex-col gap-2">
                  <h3 className={caseStudySubheading}>{release.title}</h3>
                  <div className={`${caseStudyText} flex flex-col gap-2`}>{release.body}</div>
                </div>
              </div>
              <div className="min-w-0 flex-1 max-md:flex-none">{release.media}</div>
            </div>
            </div>
          ) : (
          <div key={release.number} className="flex flex-col gap-12">
            <SectionHeader
              subheading
              level={3}
              eyebrow={release.label ?? `Release ${release.number}`}
              title={release.title}
            >
              {release.body}
            </SectionHeader>
            {release.media}
          </div>
          )
        )}
      </section>

      <section id="story-design-system" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Design system"
          title="Building the design system that cut handoff-to-release time by ~60%"
        >
          <p>
            I held off on a design system until Asimov needed its own interface. From then on, every
            release added more screens.
          </p>
          <p>
            I started with the components: 20+ of them, with 90+ variants covering every state a
            screen could show. They carried the product&rsquo;s rules too. The knowledge accordion had a
            variant for each Slack channel type, and sync and training status showed admins where each
            source stood. I later formalized the system into 100+ tokens.
          </p>
          <p>
            Once it was built, a new design went from handoff to release in about two days, down from
            at least a week. Its core components later moved into Tars&rsquo; main product, restyled to
            match.
          </p>
        </SectionHeader>
        <Image
          src="/new-asimov/Design System Visual.avif"
          alt="Asimov's design system: color and type foundations, then components (sync status pills, buttons and the accordion in its closed and open states), then the Manage Knowledge screen built from them"
          width={2016}
          height={2505}
          className="h-auto w-full"
        />
      </section>

      <section id="story-reflections">
        <SectionHeader
          eyebrow="Reflections"
          title="I'd ship a rough version of roles earlier"
          bodyClassName="gap-12 pt-2"
        >
          {REFLECTIONS.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <h3 className={caseStudyRowTitle}>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </SectionHeader>
      </section>
    </div>
  );
}
