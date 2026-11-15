import type { Metadata } from "next";
import type { ReactNode } from "react";
import CaseStudyLayout from "../../components/CaseStudyLayout";
import { CaseStudyDemoCard } from "../../components/CaseStudyDemoCard";
import { LeadOverview, SectionHeader } from "../../components/CaseStudySections";
import { AsimovKnowledgeEmbed } from "../../home-v2/AsimovKnowledgeEmbed";
import {
  caseStudyHeading,
  caseStudySectionTagCaps,
  caseStudyTitle,
  CASE_STUDY_PAGE_BG,
} from "@/design-system";
import { CaseStudyBody } from "./CaseStudyBody";
import { ShowcaseTile } from "./ShowcaseTile";
import { StoryTabs, StoryTabsProvider, SwitchTabButton } from "./StoryTabs";

/**
 * Working draft of the visual-first Asimov page. Lives beside the original at
 * /tars-asimov so the two can be merged later; hidden from search until then.
 */
export const metadata: Metadata = {
  title: "Asimov for Tars | Showcase draft | Priyamwada Pandey",
  robots: { index: false, follow: false },
};

/** Where the 2026 screens live (cropped from the Figma frames at 2x). */
const IMG = "/new-asimov-2026";

/**
 * Tile sizes in Figma px: full-width frames are 1008px wide, half frames 492px,
 * with 24px between frames. Heights follow each crop's own aspect ratio.
 */
const FULL = (height: number) => [1008, height] as const;
const HALF = (height: number) => [492, height] as const;

function Showcase({
  id,
  tag,
  headline,
  children,
}: {
  id: string;
  tag: string;
  headline: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <p className={caseStudySectionTagCaps}>{tag}</p>
        <h2 className={`${caseStudyHeading} max-w-[720px]`}>{headline}</h2>
      </div>
      <div className="flex flex-col gap-12">{children}</div>
    </section>
  );
}

/** Two half-width tiles; their titles and tiles line up even when the text wraps differently. */
function Pair({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 items-start gap-x-6 gap-y-4 max-md:grid-cols-1">{children}</div>;
}

export default function AsimovShowcasePage() {
  return (
    <StoryTabsProvider>
      <CaseStudyLayout
        sept2026Layout
        accentDark="var(--ds-case-study-accent)"
        accentLight="var(--ds-case-study-accent-light)"
        bodyBackgroundColor={CASE_STUDY_PAGE_BG}
        headlineClassName={caseStudyTitle}
        logos={[{ src: "/logos/tars.svg", alt: "TARS" }]}
        headline="Designing the agent configuration platform and design system for Asimov"
        reverseHeaderOrder
        heroVisual={
          <CaseStudyDemoCard>
            <AsimovKnowledgeEmbed />
          </CaseStudyDemoCard>
        }
        meta={{
          timelineLabel: "Shipped",
          timeline: "Dec 2023 – Apr 2024 · 5 releases",
          industry: "B2B SaaS",
          role: "Product Designer · Led design, Asimov",
          team: "CTO · Eng lead · 4 developers · QA · Designer (me)",
          items: [
            { label: "Shipped", value: "Dec 2023 – Apr 2024 · 5 releases" },
            { label: "Reworked", value: "Nov 2026" },
            { label: "Role", value: "Product Designer · Led design, Asimov" },
            { label: "Team", value: "CTO · Eng lead · 4 developers · QA · Designer (me)" },
            { label: "Key contributions", value: "Research, product design, design system, design QA" },
          ],
        }}
      >
        {/* Shared by both tabs, so it sits above them. */}
        <div className="flex flex-col gap-[88px]">
          <section id="overview">
            <LeadOverview
              label="What is Asimov?"
              lead={
                <>
                  Asimov is Tars&rsquo; AI agent in Slack. It began as a thread summarizer for startups and grew
                  into a teammate that answers from company docs and kicks off work in other tools, with
                  knowledge sources, answer verification and custom actions added over five releases in five
                  months.
                </>
              }
            >
              <p>
                The result is about 74% fewer repeat questions landing on teammates, now answered by Asimov, and
                86% of its answers rated helpful across Tars and the startup teams using it.
              </p>
            </LeadOverview>
          </section>

          <section id="my-role">
            <SectionHeader eyebrow="My role" title="I owned design for a new AI product line at Tars">
              <p>
                I joined Tars as one of its first two designers and led design for Asimov, the new
                product line, alongside its founders. My scope went well past just UI design: I ran the
                research the PRD evolved from, designed the platform teams used to configure Asimov and
                built the design system behind it, which cut handoff-to-release time by ~60%.
              </p>
              <p>
                Through detailed handoff documentation and thorough QA sessions, I kept every build true
                to the design.
              </p>
            </SectionHeader>
          </section>
        </div>

        <StoryTabs
          showcase={
            <div className="flex flex-col gap-16">
              <p className="rounded-[12px] border border-border px-6 py-5 font-label text-[16px] leading-[1.6] text-secondary">
                <strong className="font-semibold text-primary">Reworked in 2026.</strong> After the 2024
                launch, I redesigned Knowledge, Actions and Integrations. These screens haven&rsquo;t
                shipped.
              </p>

              <div className="flex flex-col gap-[184px]">
                <Showcase
                  id="knowledge-management"
                  tag="Knowledge management"
                  headline="Giving admins control over what Asimov reads, and clear status on what it has learned."
                >
                  <ShowcaseTile
                    title="A table that scales to hundreds of pages"
                    text="A Notion source can hold hundreds of pages, so each resource is a row that can be searched, filtered and sorted, with its sync status beside it."
                    size={FULL(580)}
                    src={`${IMG}/knowledge-detail-full.avif`}
                    alt="Knowledge detail for Acme Notion: a table of resources with search, filters, status and citations, and a Details panel on the right."
                  />
                  <Pair>
                    <ShowcaseTile
                      subgrid
                      title="Pick exactly what Asimov reads"
                      text="A tree picker keeps a live count, so an admin sees how many pages they are about to add."
                      size={HALF(500)}
                    />
                    <ShowcaseTile
                      subgrid
                      title="Citations show what Asimov uses"
                      text="A week in, the Citations column shows which pages Asimov relies on, and a failed sync is the only notice on the page."
                      size={HALF(500)}
                    />
                  </Pair>
                </Showcase>

                <Showcase
                  id="actions"
                  tag="Actions"
                  headline="Letting teams trigger work in other tools from Slack, using actions they write themselves."
                >
                  <ShowcaseTile
                    title="Every action, with the command people type"
                    text="The gallery shows each action's command, owner and run count, so teammates can pick one by reading it."
                    size={FULL(580)}
                    src={`${IMG}/actions-gallery-full.avif`}
                    alt="Actions gallery with search and filters, and cards showing each action's command, owner and run count."
                  />
                  <ShowcaseTile
                    title="Templates for people who don't write schemas"
                    text="Release post, LinkedIn post and work log templates let a teammate start from a working action, while developers can still start blank."
                    size={FULL(700)}
                    src={`${IMG}/actions-new-action-dialog.avif`}
                    alt="New action dialog with a blank action option and four templates."
                    dialog={{ width: 797, imageSize: [1594, 1144] }}
                  />
                  <ShowcaseTile
                    title="Configure with a live Slack preview"
                    text="As the name and the when-to-use text change, the preview shows how the command will appear in Slack's slash menu."
                    size={FULL(560)}
                    src={`${IMG}/actions-details-full.avif`}
                    alt="Configure step one, Details, with the Slack slash menu preview on the right."
                  />
                  <ShowcaseTile
                    title="Reads run automatically, writes ask first"
                    text="Each endpoint shows its method and mode, so Asimov asks a person before it creates or deletes anything."
                    size={FULL(720)}
                    src={`${IMG}/actions-schema-full.avif`}
                    alt="Configure step two, Schema, with an OpenAPI editor and three endpoints, where the create and delete endpoints ask first."
                  />
                  <ShowcaseTile
                    title="Test it before anyone else can run it"
                    text="The first read-only endpoint is selected with sample values, so a first test is one click from request to response."
                    size={FULL(720)}
                    src={`${IMG}/actions-test-full.avif`}
                    alt="Configure step four, Test, with a request, a Send request button and a response."
                  />
                  <ShowcaseTile
                    title="Every run, with who ran it and what happened"
                    text="Runs list the person, channel, endpoint, status and duration, so a failing action is found by an admin and not reported by a teammate."
                    size={FULL(680)}
                    src={`${IMG}/actions-runs-full.avif`}
                    alt="Runs for an action: a table of who ran it, the channel, endpoint, status and duration, with a Details panel."
                  />
                </Showcase>

                <Showcase
                  id="integrations"
                  tag="Integrations"
                  headline="Showing admins which tools Asimov is connected to, and what depends on each connection."
                >
                  <ShowcaseTile
                    title="What is connected, and what needs attention"
                    text="A banner and a Connected table put the expired HubSpot connection first, with what stopped working and a Reconnect button."
                    size={FULL(640)}
                    src={`${IMG}/integrations-list-full.avif`}
                    alt="Integrations list with a banner about an expired HubSpot connection, a Connected table and available apps."
                  />
                  <ShowcaseTile
                    title="Each workspace shows what uses it"
                    text="Every Slack workspace lists who connected it, when, and which knowledge sources and actions depend on it."
                    size={FULL(580)}
                    src={`${IMG}/integrations-slack-full.avif`}
                    alt="Slack integration page listing two workspaces with their permissions, and a Details panel."
                  />
                  <Pair>
                    <ShowcaseTile
                      subgrid
                      title="Sign in instead of pasting a token"
                      text="Connecting Slack starts with sign-in and lists what Asimov will be able to do. An API token stays available as a fallback."
                      size={HALF(518)}
                      src={`${IMG}/integrations-add-workspace.avif`}
                      alt="Connect a Slack workspace dialog listing what Asimov will be able to do."
                      dialog={{ width: 444, imageSize: [1114, 938] }}
                    />
                    <ShowcaseTile
                      subgrid
                      title="Disconnect names the impact"
                      text="Before disconnecting Acme, the dialog lists the three knowledge sources and two actions that will stop syncing."
                      size={HALF(518)}
                      src={`${IMG}/integrations-disconnect.avif`}
                      alt="Disconnect Acme dialog listing the knowledge sources and actions that will stop syncing."
                      dialog={{ width: 444, imageSize: [1114, 1178] }}
                    />
                  </Pair>
                </Showcase>

                <section className="flex items-center justify-between gap-6 border-t border-border pt-10 max-md:flex-col max-md:items-start">
                  <p className="max-w-[420px] font-label text-[20px] font-semibold leading-[1.45] text-primary max-md:text-[18px]">
                    Want to know why I made these calls, and how the five releases came together?
                  </p>
                  <SwitchTabButton to="case-study" variant="ghost">
                    Read the case study
                  </SwitchTabButton>
                </section>
              </div>
            </div>
          }
          caseStudy={
            <div className="flex flex-col gap-[184px]">
              <CaseStudyBody />

              <section className="flex items-center justify-between gap-6 border-t border-border pt-10 max-md:flex-col max-md:items-start">
                <p className="max-w-[420px] font-label text-[20px] font-semibold leading-[1.45] text-primary max-md:text-[18px]">
                  Want to see the screens behind these decisions?
                </p>
                <SwitchTabButton to="showcase" variant="ghost">
                  See the visual showcase
                </SwitchTabButton>
              </section>
            </div>
          }
        />
      </CaseStudyLayout>
    </StoryTabsProvider>
  );
}
