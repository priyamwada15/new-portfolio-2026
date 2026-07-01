import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import VisualCaption from "../components/VisualCaption";
import DarkVideoFrame from "../components/DarkVideoFrame";
import {
  brands,
  caseStudyBody,
  caseStudySectionBody,
  fontStyle,
  salesforceBody,
  salesforceH2,
  salesforceH3,
  SALESFORCE_HERO_VIDEO,
  SITE_DEFAULT_PAGE_BG,
} from "@/design-system";

const TRAJECTORY_VIDEO = (
  <div>
    <DarkVideoFrame
      src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952448/Academic_Trajectory_jkfdhx.mp4"
      className="w-full rounded-2xl"
    />
  </div>
);

const OVERVIEW_VIDEO = (
  <div>
    <DarkVideoFrame
      src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952378/Dashboard_isvhue.mp4"
      className="w-full rounded-2xl"
    />
    <VisualCaption>The Overview section of Galileo.</VisualCaption>
  </div>
);

function SalesforceScreenshotFrame({
  src,
  alt,
  imgStyle,
}: {
  src: string;
  alt: string;
  imgStyle: React.CSSProperties;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-[501px] w-full overflow-hidden rounded-[24px] bg-surface-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="absolute max-w-none rounded-[24px]" style={imgStyle} />
      </div>
    </div>
  );
}

const PROBLEM_ITEMS = [
  {
    number: "01",
    title: "Decisions made early compound over time",
    desc: "Early course choices shape workload balance and eligibility for majors down the line. These decisions can have long-term consequences.",
  },
  {
    number: "02",
    title: "Data exists but interpretation doesn't",
    desc: "University tools surface requirements but don't help students understand what any of it means for their specific path.",
  },
  {
    number: "03",
    title: "Academic systems are fragmented by design",
    desc: "Students piece together their academic picture from degree audits, course catalogs, enrollment portals and peer advice, none of which talk to each other.",
  },
  {
    number: "04",
    title: "Decision fatigue erodes away confidence",
    desc: "Scattered information forces students to synthesize academic data manually, increasing cognitive load and reducing confidence in their choices.",
  },
] as const;

function ProblemCard({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8 rounded-[24px] bg-surface-media px-4 py-10">
      <p className="text-[20px] font-semibold leading-[140%] text-[#333333]" style={fontStyle.figtree}>
        {number}
      </p>
      <div className="flex flex-col gap-3">
        <p className="text-[20px] font-semibold leading-[140%] text-[#032C5F]" style={fontStyle.figtree}>
          {title}
        </p>
        <p className="text-[14px] font-normal leading-[140%] text-[#555555]" style={fontStyle.figtree}>
          {desc}
        </p>
      </div>
    </div>
  );
}

function ReflectionQuoteCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-6 rounded-[24px] bg-surface-media px-7 py-10">
      <div className="flex flex-col gap-3">
        <p className="text-[20px] font-semibold leading-[140%] text-[#333333]" style={fontStyle.figtree}>
          {number}
        </p>
        <p className="text-[20px] font-semibold leading-[140%] text-[#333333]" style={fontStyle.figtree}>
          {title}
        </p>
      </div>
      <p className="text-[14px] font-normal leading-[140%] text-[#555555]" style={fontStyle.figtree}>
        {body}
      </p>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Galileo for Salesforce | Priyamwada Pandey",
  description:
    "I co-led the design of a 0→1 AI product that helps students plan their academic future.",
};

export default function SalesforcePage() {
  return (
    <CaseStudyLayout
      accentDark={brands.salesforce.accentDark}
      accentLight={brands.salesforce.accentLight}
      bodyBackgroundColor={SITE_DEFAULT_PAGE_BG}
      headlineFont="figtree"
      headlineColor="#333333"
      headlineClassName="text-[36px] font-medium leading-[130%] text-[#333333]"
      headlineStyle={{ fontWeight: 500 }}
      contentBodyClassName={caseStudyBody}
      sectionBodyClassName={caseStudySectionBody}
      tocLinkFontFamily="var(--font-hind), sans-serif"
      logos={[{ src: "/logos/salesforce.svg", alt: "Salesforce", cls: "h-8" }]}
      reverseHeaderOrder={true}
      hideContextLabel={true}
      heroVisual={
        <video
          src={SALESFORCE_HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Galileo for Salesforce, hero overview"
          className="block w-full rounded-2xl"
        />
      }
      projectName="Galileo for Salesforce"
      headline="Reducing decision fatigue in students by connecting today's course choices to future career options."
      context={
        <div className="flex max-w-[768px] flex-col gap-4">
          <h2 className={salesforceH2} style={fontStyle.figtree}>
            TL;DR
          </h2>
          <div className="flex flex-col gap-4">
            <p className={salesforceBody} style={fontStyle.figtree}>
              Galileo is a 0→1 concept product built in collaboration with the Salesforce
              Experience Design team as part of a semester-long design studio at IUB. This
              project explored how AI could support academic course selection for undeclared
              undergraduates.
            </p>
            <p className={salesforceBody} style={fontStyle.figtree}>
              I co-led design end-to-end, leading the Overview and Academic Trajectory sections
              specifically. My work centered on interaction design, information architecture,
              visual language and AI interaction patterns, specifically how to make
              recommendations feel actionable. The rest of my work happened between sections,
              keeping the design consistent when different people were building in parallel.
            </p>
          </div>
        </div>
      }
      meta={{
        timelineLabel: "Handed Off",
        timeline: "Dec 2025",
        industry: "EdTech / Higher Education",
        role: "Lead Product Designer",
        team: "8 Student Designers, Salesforce Experience Design Team",
      }}
      toc={[
        { id: "understanding-problem", label: "Understanding the problem" },
        { id: "solution-space", label: "Solution space" },
        { id: "reflection", label: "Reflection" },
      ]}
    >
      <section id="understanding-problem" className="flex max-w-[768px] flex-col gap-8">
        <h2 className={salesforceH2} style={fontStyle.figtree}>
          Information overload with no way to connect the threads
        </h2>
        <div className="flex flex-col gap-4">
          <p className={salesforceBody} style={fontStyle.figtree}>
            Undeclared students piece together their academic picture from degree audits,
            enrollment portals, course catalogs and peer advice. None of these systems talk to
            each other and the result is a lot of information that doesn&apos;t add up to
            anything useful when you&apos;re trying to figure out what you actually want.
          </p>
          <p className={salesforceBody} style={fontStyle.figtree}>
            Talking to the students surfaced four consistent patterns:
          </p>
          <div className="flex flex-col gap-10 pt-2">
            <div className="flex flex-col gap-10 md:flex-row">
              <ProblemCard {...PROBLEM_ITEMS[0]} />
              <ProblemCard {...PROBLEM_ITEMS[1]} />
            </div>
            <div className="flex flex-col gap-10 md:flex-row">
              <ProblemCard {...PROBLEM_ITEMS[2]} />
              <ProblemCard {...PROBLEM_ITEMS[3]} />
            </div>
          </div>
        </div>
      </section>

      <section id="solution-space" className="flex max-w-[768px] flex-col gap-4">
        <h2 className={salesforceH2} style={fontStyle.figtree}>
          One system, four lenses and an AI that informs without deciding.
        </h2>

        <div className="flex flex-col gap-4 pt-10">
          <h3 className={salesforceH3} style={fontStyle.figtree}>
            Academic Trajectory
          </h3>
          <div className="flex flex-col gap-4">
            <p className={salesforceBody} style={fontStyle.figtree}>
              This section is where Galileo gets reflective. It shows potential majors and
              careers surfaced from a student&apos;s course history and interests and lets them
              view their academic progress through four lenses: by year, by potential major, by
              course themes and by career pathways.
            </p>
            <p className={salesforceBody} style={fontStyle.figtree}>
              The same data with four different ways to connect it to something that actually
              matters to them. The research kept surfacing the same problem: students had too
              much information and lacked ways to interpret them.
            </p>
            <p className={salesforceBody} style={fontStyle.figtree}>
              The AI transparency patterns I used were drawn from Shape of AI by Emily Campbell.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {TRAJECTORY_VIDEO}
            <SalesforceScreenshotFrame
              src="/new-salesforce/Academic%20Trajectory.png"
              alt="Galileo Academic Trajectory dashboard"
              imgStyle={{
                width: "867px",
                height: "561px",
                left: "calc(50% - 867px / 2 - 89.5px)",
                top: "40px",
              }}
            />
            <SalesforceScreenshotFrame
              src="/new-salesforce/Academic%20Trajectory-%20By%20Course%20Themes.png"
              alt="Galileo Academic Progress by course themes"
              imgStyle={{
                width: "854px",
                height: "552px",
                left: "calc(50% - 854px / 2 - 83px)",
                top: "39.8px",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-24">
          <h3 className={salesforceH3} style={fontStyle.figtree}>
            Overview Dashboard
          </h3>
          <div className="flex flex-col gap-4">
            <p className={salesforceBody} style={fontStyle.figtree}>
              This is the first screen a student lands on. The goal was simple: you open
              Galileo and immediately know where you stand and what needs your attention. GPA,
              GenEd progress, enrollment deadlines and a single path forward into the rest of
              the product.
            </p>
            <p className={salesforceBody} style={fontStyle.figtree}>
              Getting here required cutting almost everything. The first feedback from
              Salesforce was that there was no clear action a student could take. Early
              iterations had an academic compass visualization, quick links, an advisor panel
              and multiple CTAs. None of it made the cut. Every element that stayed had to be
              actionable.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {OVERVIEW_VIDEO}
            <SalesforceScreenshotFrame
              src="/new-salesforce/Overview.png"
              alt="Galileo Overview dashboard"
              imgStyle={{
                width: "867px",
                height: "561px",
                left: "calc(50% - 867px / 2 + 0.5px)",
                top: "40px",
              }}
            />
          </div>
        </div>
      </section>

      <section id="reflection" className="flex max-w-[768px] flex-col gap-4">
        <h2 className={salesforceH2} style={fontStyle.figtree}>
          The messy parts
        </h2>
        <div className="flex flex-col gap-8 py-4 md:flex-row">
          <ReflectionQuoteCard
            number="01"
            title="The advisor question kept coming back"
            body="We designed Galileo for students navigating independently. What we didn't fully resolve was where a human advisor fits into that. Advising is already a system with people in it but Galileo doesn't account for that yet. We made a deliberate call to solve core problem areas completely rather than spread thin across everything."
          />
          <ReflectionQuoteCard
            number="02"
            title="Designing as part of a design team"
            body="7 people were building sections in parallel and my job was partly to make sure they held together as a system. Keeping visual and interaction language consistent across work I didn't directly own required a different kind of discipline. I learned when to push back on a decision that worked in isolation but quietly breaks things when you zoom out."
          />
        </div>
      </section>
    </CaseStudyLayout>
  );
}
