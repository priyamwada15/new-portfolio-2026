import type { Metadata } from "next";
import type { ReactNode } from "react";
import CaseStudyLayout from "../components/CaseStudyLayout";
import { CaseStudyDemoCard } from "../components/CaseStudyDemoCard";
import { CaseStudySummary, SectionHeader } from "../components/CaseStudySections";
import { AsimovKnowledgeEmbed } from "../home-v2/AsimovKnowledgeEmbed";
import {
  caseStudyHeading,
  caseStudySectionTagCaps,
  caseStudyTitle,
  CASE_STUDY_PAGE_BG,
} from "@/design-system";
import { ShowcaseTile } from "./showcase/ShowcaseTile";
import { StoryTabs, StoryTabsProvider } from "./showcase/StoryTabs";

export const metadata: Metadata = {
  title: "Asimov for Tars | AI Agent Configuration Platform Case Study | Priyamwada Pandey",
  description:
    "How I led design for Asimov, Tars' Slack AI agent: the platform teams use to configure it, five releases in five months and a design system.",
  keywords: [
    "0 to 1 product design",
    "AI product design",
    "AI agent UX designer",
    "Slack AI agent design",
    "B2B SaaS UX case study",
    "design system",
  ],
};

/** Where the 2026 screens live (cropped from the Figma frames at native 2x). */
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

export default function AsimovPage() {
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
          timeline: "Dec 2023 – Apr 2024",
          industry: "B2B SaaS",
          role: "Product Designer",
          team: "CTO, Engineers, Me",
          items: [
            { label: "Shipped", value: "Dec 2023 – Apr 2024" },
            { label: "Type of work", value: "0 to 1, Complex Workflows" },
            { label: "Team", value: "CTO, Engineers, Me" },
            { label: "Contribution", value: "Product Design, Product Strategy & Research, Design System, Design QA" },
          ],
        }}
      >
        {/* Shared by both tabs. Direct layout children, so they get the page's standard section gap. */}
        <>
          <CaseStudySummary
            rows={[
              {
                label: "Goal",
                text: "Take Asimov from a Slack thread summarizer to a platform teams configure themselves.",
              },
              {
                label: "My role",
                text: "I led design end to end, alongside the founders: the research behind the PRD, the configuration platform and the design system.",
              },
              {
                label: "Impact",
                text: "5 releases in 5 months that took the product from a simple app within Slack to an end-to-end product. The design system cut handoff-to-release time by about 60%, and its core components moved into Tars’ main product.",
              },
            ]}
          />
          <section id="overview">
            <SectionHeader title="Asimov is Tars&rsquo; AI agent for startup teams working in Slack">
              <p>
                It started as a thread summarizer. Over five releases in five months it learned to answer from company docs and to run actions in other tools.
              </p>
              <p>The screens on this page are reworked designs, with the focus on design and user experience.</p>
            </SectionHeader>
          </section>
        </>

        <StoryTabs
          showcase={
            <div className="flex flex-col gap-[184px]">
              <Showcase
                id="knowledge-management"
                tag="Knowledge management"
                headline="Admins decide what Asimov reads and check where each source stands."
              >
                <ShowcaseTile
                  title="A sync failure has to be seen before anything else on the screen"
                  text="After a week the table shows how often Asimov cited each page. One banner names the page that failed to sync, with Retry and Reconnect."
                  size={FULL(580)}
                  src={`${IMG}/knowledge-week-later-full.avif`}
                  alt="Knowledge detail a week later: a banner about one page that failed to sync, and a table with a citations column."
                />
                <Pair>
                  <ShowcaseTile
                    subgrid
                    title="Connecting an app and adding a folder happen in the same place"
                    text="Apps that are already connected say so in the list, and only Notion asks to connect. Website, documents and folders sit below."
                    size={HALF(632)}
                    src={`${IMG}/knowledge-add-dialog.avif`}
                    alt="Add Knowledge dialog listing Slack and HubSpot as connected, Notion with a Connect button, and Website, Documents and Folders under Content."
                    dialog={{ width: 400, imageSize: [888, 840], radius: 16 }}
                  />
                  <ShowcaseTile
                    subgrid
                    title="Admins see how many pages they are adding before they commit"
                    text="The total updates as folders are ticked, and auto-sync is set in the same step."
                    size={HALF(632)}
                    src={`${IMG}/knowledge-select-dialog.avif`}
                    alt="Select resources dialog with six resources ticked, an auto-sync toggle set to every 6 hours, and a footer reading 6 selected, 578 pages."
                    dialog={{ width: 400, imageSize: [888, 1192], radius: 16 }}
                  />
                </Pair>
              </Showcase>

              <Showcase
                id="actions"
                tag="Actions"
                headline="Teams write their own actions and run them from Slack."
              >
                <ShowcaseTile
                  title="People look for an action by the command they already type"
                  text="Each card shows the command people type in Slack and who owns it."
                  size={FULL(580)}
                  src={`${IMG}/actions-gallery-full.avif`}
                  alt="Actions gallery with search and filters, and cards showing each action's command, owner and run count."
                />
                <Pair>
                  <ShowcaseTile
                    subgrid
                    title="Most teammates should never have to write a schema"
                    text="Templates built from real examples let a teammate publish an action without touching a schema. Developers can still start from a blank one."
                    size={HALF(392)}
                    src={`${IMG}/actions-new-action-dialog.avif`}
                    alt="New action dialog with a blank action option and four templates."
                    dialog={{ width: 444, imageSize: [888, 638], radius: 16 }}
                  />
                  <ShowcaseTile
                    subgrid
                    title="Anyone picking a template needs to know what it can change"
                    text="Each template says how many endpoints it calls, whether it asks before writing and who can run it. A preview shows the command in a Slack thread."
                    size={HALF(392)}
                    src={`${IMG}/actions-template-dialog.avif`}
                    alt="Daily work log template dialog with an About section, three endpoints, asks before writing, and a Slack preview of the command."
                    dialog={{ width: 444, imageSize: [888, 508], radius: 16 }}
                  />
                </Pair>
                <ShowcaseTile
                  title="A name only works if it reads well in Slack"
                  text="As the name and the when-to-use text change, the slash menu on the right updates to show how the command will look in Slack."
                  size={FULL(560)}
                  src={`${IMG}/actions-details-full.avif`}
                  alt="Configure step one, Details, with the Slack slash menu preview on the right."
                />
                <ShowcaseTile
                  title="An agent that writes to other tools needs a person in the loop"
                  text="Every endpoint shows its method and whether it runs on its own. Asimov asks a person first before it creates or deletes anything."
                  size={FULL(720)}
                  src={`${IMG}/actions-schema-full.avif`}
                  alt="Configure step two, Schema, with an OpenAPI editor and three endpoints, where the create and delete endpoints ask first."
                />
                <ShowcaseTile
                  title="An action should work once before anyone else depends on it"
                  text="The first read-only endpoint comes selected with sample values, so a first test takes one click and ends with a real response."
                  size={FULL(720)}
                  src={`${IMG}/actions-test-full.avif`}
                  alt="Configure step four, Test, with a request, a Send request button and a response."
                />
                <ShowcaseTile
                  title="An admin should find a failing action before a teammate reports it"
                  text="Each run shows who ran it, in which channel and how it ended. An admin can spot a failing action before anyone reports it."
                  size={FULL(680)}
                  src={`${IMG}/actions-runs-full.avif`}
                  alt="Runs for an action: a table of who ran it, the channel, endpoint, status and duration, with a Details panel."
                />
              </Showcase>

              <Showcase
                id="integrations"
                tag="Integrations"
                headline="Admins see which tools Asimov is connected to and what depends on each one."
              >
                <ShowcaseTile
                  title="An expired connection stops other work, so it comes first"
                  text="An expired HubSpot connection sits in a banner above the table, with what stopped working and a button to reconnect it."
                  size={FULL(640)}
                  src={`${IMG}/integrations-list-full.avif`}
                  alt="Integrations list with a banner about an expired HubSpot connection, a Connected table and available apps."
                />
                <ShowcaseTile
                  title="Before changing a connection, an admin needs to know what relies on it"
                  text="Each Slack workspace shows who connected it and when, along with the knowledge sources and actions that use it."
                  size={FULL(580)}
                  src={`${IMG}/integrations-slack-full.avif`}
                  alt="Slack integration page listing two workspaces with their permissions, and a Details panel."
                />
                <Pair>
                  <ShowcaseTile
                    subgrid
                    title="Granting access starts with what Asimov will be able to do"
                    text="Connecting Slack starts with a sign-in and a list of what Asimov will be able to do. An API token stays available as a fallback."
                    size={HALF(518)}
                    src={`${IMG}/integrations-add-workspace.avif`}
                    alt="Connect a Slack workspace dialog listing what Asimov will be able to do."
                    dialog={{ width: 444, imageSize: [1120, 943], radius: 16 }}
                  />
                  <ShowcaseTile
                    subgrid
                    title="Disconnecting is the moment to show what will break"
                    text="Before an admin disconnects Acme, the dialog lists the three knowledge sources and two actions that will stop syncing."
                    size={HALF(518)}
                    src={`${IMG}/integrations-disconnect.avif`}
                    alt="Disconnect Acme dialog listing the knowledge sources and actions that will stop syncing."
                    dialog={{ width: 444, imageSize: [1120, 1184], radius: 16 }}
                  />
                </Pair>
              </Showcase>
            </div>
          }
        />
      </CaseStudyLayout>
    </StoryTabsProvider>
  );
}
