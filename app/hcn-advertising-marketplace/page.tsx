import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import { CaseStudyStatusPills } from "../components/CaseStudyStatusPills";
import { WordReveal } from "../components/WordReveal";
import { HtmlEmbed } from "../components/HtmlEmbed";
import { CaseStudySummary, SectionHeader } from "../components/CaseStudySections";
import { HcnMarketplaceEmbed } from "../home-v2/HcnMarketplaceEmbed";
import { MediaWash } from "../components/MediaWash";
import { caseStudyTitle, CASE_STUDY_PAGE_BG } from "@/design-system";

/* Client is under NDA: no client name in the copy or metadata. */
export const metadata: Metadata = {
  title: "Digital Advertising Marketplace | Product Design Case Study | Priyamwada Pandey",
  description:
    "Designing the foundations of a two-sided digital advertising marketplace: accounts, booking, wallet and space setup.",
};

const lead = "font-semibold text-primary";

const SHOW_SYSTEMS_DESIGN = false;

export default function HcnAdvertisingMarketplacePage() {
  return (
    <CaseStudyLayout
      sept2026Layout
      sideToc={[
        { id: "about", label: "Overview" },
        { id: "accounts", label: "Information Architecture" },
        { id: "wallet", label: "Financial UX" },
        { id: "space", label: "Workflow Design" },
      ]}
      accentDark="var(--ds-case-study-accent)"
      accentLight="var(--ds-case-study-accent-light)"
      bodyBackgroundColor={CASE_STUDY_PAGE_BG}
      headlineClassName={caseStudyTitle}
      logos={[{ src: "/logos/hcn.avif", alt: "HCN", cls: "h-8" }]}
      headline="Designing the foundations of a digital advertising marketplace"
      logosAside={<CaseStudyStatusPills />}
      reverseHeaderOrder
      heroVisual={
        <MediaWash tone="hcn" className="aspect-[1008/575] w-full">
          <HcnMarketplaceEmbed />
        </MediaWash>
      }
      meta={{
        timeline: "June 2026",
        industry: "Advertising",
        role: "Sole product designer",
        team: "Client, PM, Developers",
        items: [
          { label: "Started", value: "June 2026" },
          { label: "Scope", value: "0 to 1, Two-sided Marketplace, Complex Workflows" },
          { label: "Team", value: "Client, PM, Developers, Me" },
          { label: "Contribution", value: "Product Design, Product Strategy, Information Architecture, Financial UX, Design System" },
        ],
      }}
    >
      <section id="about" className="flex flex-col gap-8">
        <SectionHeader eyebrow="Context" title="A marketplace where advertisers run campaigns on screens that businesses rent out">
          <p>
            I&rsquo;m designing a self-serve marketplace for advertising on digital screens. Advertisers
            set up an account, create campaigns, run them and analyze how they perform.
          </p>
          <p>
            Broadcasters rent out their screen space and earn from it. A business can do both,
            running campaigns for itself and, if it&rsquo;s an in-person venue, renting out its own screens.
          </p>
        </SectionHeader>
        <CaseStudySummary
          rows={[
            {
              label: "Goal",
              text: "Launch a self-serve MVP with every major function, so first-time advertisers and broadcasters can onboard and set up quickly.",
            },
            {
              label: "My role",
              text: "Sole product designer building 0 to 1: the product strategy, the workflows that move money from advertisers to broadcasters, and the design system.",
            },
            {
              label: "Status",
              text: "In flight. End-to-end flows are being designed and shipped to staging incrementally ahead of the full MVP launch, each with success measures defined so launch can be measured.",
            },
          ]}
        />
      </section>

      <section aria-label="About the visuals">
        <WordReveal
          className="mx-auto max-w-[760px] text-balance text-center font-label text-[24px] font-medium leading-[1.45] tracking-[-0.01em] text-secondary max-md:text-[20px]"
          text="The demos that follow are *conceptual walkthroughs*, since the product is under NDA and still in flight. They cover the *product decisions* I made and the metrics I&rsquo;m designing toward."
        />
      </section>

      <section id="accounts" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Information Architecture"
          title="Eliminating task switching for dual user personas"
        >
          <p>
            <span className={lead}>Why:</span>{" "}A business that advertises and owns screens does both jobs in one day,
            and two experiences means switching roles each time.
          </p>
          <p>
            <span className={lead}>My approach:</span>{" "}I combined both roles into one account with a grouped
            sidebar and removed the role switch. A tradeoff is that the sidebar is longer and usage
            data will show whether this bet worked in our favor.
          </p>
          <p>
            <span className={lead}>Metrics I designed toward:</span>{" "}
            Task Success Rate (TSR) and Time on Task (ToT) on cross-role tasks, like checking
            earnings before setting a budget.
          </p>
        </SectionHeader>
        <HtmlEmbed
          src="/hcn/visual-1-sidebars.html"
          title="Three sidebars side by side: advertiser, broadcaster and both"
        />
      </section>

      {/* Systems Design is hidden while its framing is reworked. Flip SHOW_SYSTEMS_DESIGN to bring it back. */}
      {SHOW_SYSTEMS_DESIGN && (
        <section id="booking" className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="Systems Design"
            title="Booking starts with a budget, so spend stays in view"
          >
            <p>
              <span className={lead}>Why:</span>{" "}Most advertisers are small businesses buying screen ads for the first time, so a first booking is a bet on a channel they haven&rsquo;t tried.
            </p>
            <p>
              <span className={lead}>My approach:</span>{" "}I made the bet feel small by starting every booking inside a campaign with its own budget. Money set aside for one purpose feels safer to spend than money from a general pot, and the budget moves nothing out of the wallet. It stays visible on every screen and updates as slots are added. Requiring an ad before sending lets broadcasters judge the actual campaign, and a public library can decline one that doesn&rsquo;t suit its visitors.
            </p>
            <p>
              <span className={lead}>Metrics I designed toward:</span>{" "}
              time on task to first booking, and Single Ease Question (SEQ) rating for booking.
            </p>
          </SectionHeader>
          <HtmlEmbed
            src="/hcn/visual-2-booking.html"
            title="The campaign budget staying visible on each step of the booking flow"
          />
        </section>
      )}

      <section id="wallet" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Financial UX"
          title="Designing for transparent payment cycles"
        >
          <p>
            <span className={lead}>Why:</span>{" "}If money were deducted on every request, each decline would mean paying the broadcaster and then refunding the advertiser. That cycle is slow and erodes trust in the product and in broadcasters, so advertisers would hesitate to send requests at all.
          </p>
          <p>
            <span className={lead}>My approach:</span>{" "}I made money move only when a broadcaster approves, and refund the difference if a campaign doesn&rsquo;t play its full period. The wallet shows what&rsquo;s tied up in requests next to what&rsquo;s available. Since nothing is held when a request goes out, someone could over-send and drop some after approval, so the review screen disables sending once pending requests exceed the balance.
          </p>
          <p>
            <span className={lead}>Metrics I designed toward:</span>{" "}
            top-up-to-booking conversion rate (CVR) and balance-related support tickets.
          </p>
        </SectionHeader>
        <HtmlEmbed
          src="/hcn/visual-3-wallet.html"
          title="Wallet balances moving from available to escrow to spent"
        />
      </section>

      <section id="space" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Workflow Design"
          title="Reducing friction in space setup for screen owners"
        >
          <p>
            <span className={lead}>Why:</span>{" "}Adding a space is a broadcaster&rsquo;s first task, and the marketplace needs supply first. A long flow gives them a reason to put it off.
          </p>
          <p>
            <span className={lead}>My approach:</span>{" "}I split setup in two. The first stage asks only for what an advertiser needs to see, and device pairing (connecting the physical screen) waits until after the space is added. An unpaired screen shows its details but can&rsquo;t be booked yet.
          </p>
          <p>
            <span className={lead}>Metrics I designed toward:</span>{" "}
            setup completion rate and Single Ease Question (SEQ) rating for setup.
          </p>
        </SectionHeader>
        <HtmlEmbed
          src="/hcn/visual-4-space.html"
          title="Adding a space and its screens, then pairing a device later"
        />
      </section>
    </CaseStudyLayout>
  );
}
