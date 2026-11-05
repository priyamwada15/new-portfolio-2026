import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import { CaseStudyStatusPills } from "../components/CaseStudyStatusPills";
import { HtmlEmbed } from "../components/HtmlEmbed";
import { SectionHeader } from "../components/CaseStudySections";
import { HcnMarketplaceEmbed } from "../home-v2/HcnMarketplaceEmbed";
import { caseStudyTitle, CASE_STUDY_PAGE_BG, mediaPanel } from "@/design-system";

/* Client is under NDA: no client name in the copy or metadata, and the page stays out of search. */
export const metadata: Metadata = {
  title: "Digital Advertising Marketplace | Product Design Case Study | Priyamwada Pandey",
  description:
    "Designing the foundations of a two-sided digital advertising marketplace: accounts, booking, wallet and space setup.",
  robots: { index: false, follow: false },
};

const lead = "font-semibold text-primary";

export default function HcnAdvertisingMarketplacePage() {
  return (
    <CaseStudyLayout
      sept2026Layout
      sideToc={[
        { id: "about", label: "Overview" },
        { id: "accounts", label: "Information Architecture" },
        { id: "booking", label: "Systems Design" },
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
        <div className={`${mediaPanel} relative aspect-[1008/575] w-full overflow-hidden`}>
          <HcnMarketplaceEmbed />
        </div>
      }
      meta={{
        timeline: "June 2026",
        industry: "Advertising",
        role: "Sole product designer",
        team: "Client, PM, Developers",
        items: [
          { label: "Started", value: "June 2026" },
          { label: "Status", value: "Pre-launch" },
          { label: "Role", value: "Sole product designer" },
          { label: "Team", value: "Client, PM, Developers" },
        ],
      }}
    >
      <section id="about" className="flex flex-col gap-12">
        <SectionHeader title="Three kinds of users share a new marketplace">
          <p>
            A new marketplace where businesses rent out their screens to advertisers. Advertisers
            book screens, broadcasters own them, and some businesses do both.
          </p>
          <p>
            The goal right now is supply: enough broadcasters that advertisers have varied
            inventory to choose from, so every flow has to be quick to finish. I&rsquo;m the only
            product designer, owning accounts, booking, the wallet and space setup, and building
            the design system flow by flow.
          </p>
        </SectionHeader>
      </section>

      <section id="accounts" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Information Architecture"
          title="Bringing different user roles into one account"
        >
          <p>
            <span className={lead}>Why:</span>{" "}People who both advertise and own screens would have their work split
            across two experiences if they had to switch roles.
          </p>
          <p>
            <span className={lead}>My approach:</span>{" "}I gave them one combined account with a grouped sidebar that
            brings both roles&rsquo; sections together, and removed the role switch. They can compare
            what they spend with what they earn in one place. The sidebar gets longer, and usage
            will show whether that&rsquo;s worth it.
          </p>
          <p>
            <span className={lead}>Metrics I designed toward:</span>{" "}
            task success rate for each role, and cross-role usage rate among dual-role accounts.
          </p>
        </SectionHeader>
        <HtmlEmbed
          src="/hcn/visual-1-sidebars.html"
          title="Three sidebars side by side: advertiser, broadcaster and both"
        />
      </section>

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

      <section id="wallet" className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Financial UX"
          title="Money moves only when a broadcaster approves"
        >
          <p>
            <span className={lead}>Why:</span>{" "}A stored balance avoids card fees on small bookings, but advertisers won&rsquo;t prepay a marketplace they haven&rsquo;t tried unless they trust it with their money.
          </p>
          <p>
            <span className={lead}>My approach:</span>{" "}Money moves only when a broadcaster approves, so an advertiser never pays for a screen that doesn&rsquo;t run. The wallet shows what&rsquo;s tied up in requests next to what&rsquo;s available. Holding nothing leaves a gap: someone could send many requests and drop some after approval, so the review screen disables sending once pending requests exceed the balance.
          </p>
          <p>
            <span className={lead}>Metrics I designed toward:</span>{" "}
            top-up-to-booking conversion rate, and balance-related support contacts.
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
          title="Adding a space asks for little, and device pairing can wait"
        >
          <p>
            <span className={lead}>Why:</span>{" "}Adding a space is a broadcaster&rsquo;s first task, and a long flow gives them a reason to put it off.
          </p>
          <p>
            <span className={lead}>My approach:</span>{" "}I put speed first. Setup asks only for what an advertiser needs to see, and device pairing, which connects the physical screen, comes after the space is added. Owners set one schedule and price for every screen, with optional per-screen prices and higher peak-hour rates. They can browse campaigns right away, an unpaired screen shows its details and photos but can&rsquo;t be booked yet, and owners who need more time can save a draft.
          </p>
          <p>
            <span className={lead}>Metrics I designed toward:</span>{" "}
            time on task to add a first space, and Single Ease Question (SEQ) rating for setup.
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
