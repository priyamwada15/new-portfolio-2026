import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import DarkVideoFrame from "../components/DarkVideoFrame";
import BeforeAfterCarousel, { type BeforeAfterSlide } from "./BeforeAfterCarousel";
import {
  brands,
  caseStudyBody,
  caseStudySectionBody,
  caseStudySectionH2,
  fontStyle,
  SALESFORCE_HERO_VIDEO,
  SITE_DEFAULT_PAGE_BG,
} from "@/design-system";

function ApproachCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex w-full flex-col justify-center gap-6 rounded-[var(--ds-radius-container)] bg-[#F5F5F5] px-7 py-10 md:w-[352px]">
      <div className="flex flex-col gap-3">
        <p className="text-[20px] font-semibold leading-[140%] text-[#333333]" style={fontStyle.figtree}>
          {number}
        </p>
        <p className="text-[20px] font-semibold leading-[140%] text-[#333333]" style={fontStyle.figtree}>
          {title}
        </p>
      </div>
      <p className="text-[16px] font-normal leading-[150%] text-[#555555]" style={fontStyle.figtree}>
        {body}
      </p>
    </div>
  );
}

const DESIGN_APPROACH_IMAGES = [
  {
    key: "info-arch",
    src: "/new-salesforce/InfoArch.png",
    alt: "Information architecture map of Galileo's dashboard, advisor and profile flows",
    style: { width: "70.7%", height: "50.25%", right: "2.6%", top: "0%" },
    rotate: "3.94deg",
  },
  {
    key: "impxopp-matrix",
    src: "/new-salesforce/ImpxOpp%20Matrix.png",
    alt: "Importance x Opportunity matrix scoring academic challenges against other student needs",
    style: { width: "58.98%", height: "42.01%", left: "0%", top: "18.42%" },
    rotate: "-5.47deg",
  },
  {
    key: "jen-needs",
    src: "/new-salesforce/Jen%20needs.png",
    alt: "Persona needs summary for Jen, an undeclared student",
    style: { width: "59.77%", height: "42.5%", left: "0.05%", bottom: "5.93%" },
    rotate: "4.58deg",
  },
  {
    key: "interview-insights",
    src: "/new-salesforce/Interview%20Insights%201.png",
    alt: "Synthesized interview insights from student research sessions",
    style: { width: "38.15%", height: "52.72%", right: "5.99%", bottom: "6.86%" },
    rotate: "-8.96deg",
  },
];

function DesignApproachImages() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "768 / 607" }}>
      {DESIGN_APPROACH_IMAGES.map((image) => (
        <div
          key={image.key}
          className="absolute overflow-hidden rounded-2xl border border-border"
          style={{ ...image.style, transform: `rotate(${image.rotate})` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

/** Reference width the Figma frame was designed at — image width/left are expressed as % of this. */
const IMAGE_FRAME_CANVAS_WIDTH = 768;

function ImageFrame({
  src,
  alt,
  width,
  height,
  left,
}: {
  src: string;
  alt: string;
  /** Natural design width/height in px, on the 768px reference canvas — scales down responsively. */
  width: number;
  height: number;
  /** Natural design left offset in px, on the 768px canvas. Omit to center the image instead. */
  left?: number;
}) {
  const widthPercent = `${(width / IMAGE_FRAME_CANVAS_WIDTH) * 100}%`;
  const leftStyle: React.CSSProperties =
    left === undefined
      ? { left: "50%", transform: "translateX(-50%)" }
      : { left: `${(left / IMAGE_FRAME_CANVAS_WIDTH) * 100}%` };

  return (
    <div
      className="relative w-full overflow-hidden rounded-[var(--ds-radius-container)] bg-[#F5F5F5]"
      style={{ aspectRatio: `${IMAGE_FRAME_CANVAS_WIDTH} / ${height}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute top-0 max-w-none rounded-lg"
        style={{ width: widthPercent, aspectRatio: `${width} / ${height}`, ...leftStyle }}
      />
    </div>
  );
}

function FinalSolutionBlock({
  title,
  body,
  children,
}: {
  title: string;
  body: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-[20px] font-medium leading-[140%] text-[#333333]" style={fontStyle.figtree}>
          {title}
        </p>
        <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
          {body}
        </p>
      </div>
      {children}
    </div>
  );
}

function InsightItem({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[14px] font-semibold leading-[150%] text-salesforce" style={fontStyle.figtree}>
        {label}
      </p>
      <p className="text-[16px] font-normal leading-[150%] text-[#555555]" style={fontStyle.figtree}>
        {body}
      </p>
    </div>
  );
}

const BEFORE_SLIDES: BeforeAfterSlide[] = [
  {
    badgeLabel: "before",
    badgeBg: "#FFEBEB",
    badgeColor: "#CB2A2F",
    badgeBorder: "#E59597",
    title: "Platform 1: iGPS portal of IUB for enrollment into classes",
    images: [
      {
        src: "/new-salesforce/iGPS%20view.png",
        alt: "iGPS class search portal in the Indiana University enrollment system",
        width: 656,
        height: 372,
      },
    ],
    caption: "Limited and scattered information",
  },
  {
    badgeLabel: "before",
    badgeBg: "#FFEBEB",
    badgeColor: "#CB2A2F",
    badgeBorder: "#E59597",
    title: "Platform 2: Degree requirements live in another page.",
    images: [
      {
        src: "/new-salesforce/Degree%20Requirements.png",
        alt: "Indiana University degree requirements page showing major and degree tabs",
        width: 654,
        height: 372,
      },
    ],
    caption: "Students had to have multiple tabs open for processing information.",
  },
  {
    badgeLabel: "before",
    badgeBg: "#FFEBEB",
    badgeColor: "#CB2A2F",
    badgeBorder: "#E59597",
    title:
      "Platform 3: Course reviews live on community platforms and in person 1-1 communication.",
    images: [
      {
        src: "/new-salesforce/Reddit%201.png",
        alt: "Reddit thread discussing course difficulty",
        width: 550,
        height: 184,
        top: 92,
      },
      {
        src: "/new-salesforce/Reddit%202.png",
        alt: "Reddit thread with replies debating a course recommendation",
        width: 654,
        height: 258,
        top: 206,
      },
    ],
    caption:
      "Students rely on Reddit or asking upperclassmen for course reviews for deciding between courses.",
  },
  {
    badgeLabel: "before",
    badgeBg: "#FFEBEB",
    badgeColor: "#CB2A2F",
    badgeBorder: "#E59597",
    title: "Platform 4: Sites like RateMyProfessor give students insights into the professor's teaching style.",
    images: [
      {
        src: "/new-salesforce/RateMyProfessor.png",
        alt: "RateMyProfessor page showing a professor's overall rating and rating distribution",
        width: 654,
        height: 372,
        redactions: [
          { left: "1.07%", top: "24.73%", width: "36.39%", height: "23.66%" },
          { left: "0.15%", bottom: "0.27%", width: "37.31%", height: "9.68%", borderRadius: "0 0 0 7px" },
        ],
      },
    ],
    caption:
      "RateMyProfessor provides reviews but these are calculated bases on generic criteria rather than qualitative information.",
  },
];

const AFTER_SLIDES: BeforeAfterSlide[] = [
  {
    badgeLabel: "after",
    badgeBg: "#EBFAEB",
    badgeColor: "#297A3A",
    badgeBorder: "#94BD9D",
    title: "Feature 1: In-depth course review generated from university portals and peer reviews.",
    images: [
      {
        src: "/new-salesforce/5.%20Course%20Details.png",
        alt: "Galileo course details page showing overview, outcomes, majors and careers",
        width: 503,
        height: 372,
      },
    ],
  },
  {
    badgeLabel: "after",
    badgeBg: "#EBFAEB",
    badgeColor: "#297A3A",
    badgeBorder: "#94BD9D",
    title:
      "Feature 2: Clarity about professor teaching style and course workload and expectations in one place.",
    images: [
      {
        src: "/new-salesforce/Professor%20Reviews.png",
        alt: "Galileo peer insights panel showing course ratings and professor ratings",
        width: 654,
        height: 283,
      },
    ],
  },
  {
    badgeLabel: "after",
    badgeBg: "#EBFAEB",
    badgeColor: "#297A3A",
    badgeBorder: "#94BD9D",
    title: "Feature 3: AI insights on the degree progress so far, which acts as a checkpoint for students.",
    images: [
      {
        src: "/new-salesforce/Academic%20Trajectory-%20Overview.png",
        alt: "Galileo academic trajectory overview showing emerging academic interests and where paths could lead",
        width: 654,
        height: 289,
      },
    ],
  },
  {
    badgeLabel: "after",
    badgeBg: "#EBFAEB",
    badgeColor: "#297A3A",
    badgeBorder: "#94BD9D",
    title: "Feature 4: Providing four lenses for informed academic decision making",
    images: [
      {
        src: "/new-salesforce/Academic%20Trajectory-%204%20lenses.png",
        alt: "Galileo academic progress shown across four lenses, by course themes",
        width: 654,
        height: 290,
      },
    ],
  },
];

const BEFORE_INSIGHTS = [
  {
    label: "4 disconnected systems",
    body: "Degree audits, course catalogs, enrollment portals, and peer advice lived in separate places, leaving students to manually connect courses to majors and careers.",
  },
  {
    label: "Enrolling and planning had separate flows",
    body: "Planning and registering lived in separate systems, so a finalized semester plan had to be manually re-entered or re-searched.",
  },
  {
    label: "Early choices locked in long-term consequences",
    body: "Workload balance and major eligibility down the line got shaped by decisions made before a student had enough context to make them well.",
  },
  {
    label: "Scattered inputs wore down confidence and time",
    body: "Manually synthesizing academic data from all these sources increased cognitive load and left students less sure of their own choices.",
  },
] as const;

const AFTER_INSIGHTS = [
  {
    label: "All in one system",
    body: "In-depth course and professor reviews by peers, a 10,000 feet overview of their academic history and connections to majors and careers, under one tool.",
  },
  {
    label: "Easy sync between planner and enrollment",
    body: "The plugin carries a student's plan directly into iGPS, so registering picked up where planning left off instead of starting over.",
  },
] as const;

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
      headlineColor="#333333"
      headlineClassName="text-[36px] font-medium leading-[130%] text-[#333333] max-tablet:text-[24px]"
      headlineStyle={{ fontWeight: 500 }}
      contentBodyClassName={caseStudyBody}
      sectionBodyClassName={caseStudySectionBody}
      logos={[{ src: "/logos/salesforce.svg", alt: "Salesforce", cls: "h-10" }]}
      reverseHeaderOrder={true}
      hideContextLabel={true}
      contextLabel="TL;DR"
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
      breadcrumbLabel="Salesforce"
      headline="Reducing decision fatigue in students by connecting today's course choices to future career options."
      context={
        <div className="flex max-w-[768px] flex-col gap-14">
          <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
            TL;DR
          </h2>
          <div className="flex flex-col gap-14">
            {[
              {
                label: "Problem",
                body: "Students had to piece together their academic decisions from fragmented university systems, with no personalized guidance connecting the information.",
              },
              {
                label: "Solution",
                body: "We designed Galileo, an AI companion integrated into iGPS that unified course planning, peer insights, scheduling, and academic trajectory into a single experience.",
              },
              {
                label: "Contribution",
                body: "As one of two lead designers, I defined the product's information architecture, designed key experiences, and established trustworthy AI patterns for explainable recommendations.",
              },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <p className="shrink-0 text-[20px] font-medium leading-[140%] text-[#555555]" style={fontStyle.figtree}>
                  {item.label}
                </p>
                <p className="text-[16px] font-normal leading-[160%] text-[#555555] md:w-[392px]" style={fontStyle.figtree}>
                  {item.body}
                </p>
              </div>
            ))}
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
        { id: "before-and-after", label: "Before and After" },
        { id: "design-approach", label: "Design Approach" },
        { id: "final-solution", label: "Final Solution" },
        { id: "in-hindsight", label: "In Hindsight" },
        { id: "reflection", label: "Reflections" },
      ]}
    >
      <section id="before-and-after" className="flex max-w-[768px] flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-semibold leading-[150%] text-salesforce" style={fontStyle.figtree}>
            Before and After
          </p>
          <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
            What actually changed for students, before Galileo and after.
          </h2>
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <BeforeAfterCarousel slides={BEFORE_SLIDES} />
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {BEFORE_INSIGHTS.map((item) => (
                <InsightItem key={item.label} {...item} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <BeforeAfterCarousel slides={AFTER_SLIDES} />
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {AFTER_INSIGHTS.map((item) => (
                <InsightItem key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="design-approach" className="flex max-w-[768px] flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-semibold leading-[150%] text-salesforce" style={fontStyle.figtree}>
            Design Approach
          </p>
          <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
            From interviews and a scope matrix to one academic planning tool
          </h2>
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-16 md:flex-row">
            <ApproachCard
              number="01"
              title="Screening survey + semi-structured interviews"
              body="Of twenty-four survey responses, 91% named academics and coursework as their top priority, which is what pointed the interviews at academic planning. With over 100 synthesized insights, we had a lot to go over."
            />
            <ApproachCard
              number="02"
              title="Importance x Opportunity matrix for scope cut"
              body="Academic challenges scored as the strongest actionable opportunity. Mental health scored just as high on importance, but we ruled it out since an AI system shouldn't be the one replacing a licensed professional."
            />
          </div>
          <DesignApproachImages />
          <div className="flex flex-col gap-16 md:flex-row">
            <ApproachCard
              number="03"
              title="Undeclared students are most vulnerable"
              body="They were the extreme case: making independent academic decisions for the first time, with no fixed major to anchor their course choices against."
            />
            <ApproachCard
              number="04"
              title="6 rounds of testing with students"
              body="Early versions tried to cover academic, social and career support at once. Every round pushed the team to cut further until only academic planning was left standing."
            />
          </div>
        </div>
      </section>

      <section id="final-solution" className="flex max-w-[768px] flex-col gap-[88px]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-[14px] font-semibold leading-[150%] text-salesforce" style={fontStyle.figtree}>
              Final Solution
            </p>
            <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
              Academic Trajectory: naming how the AI knows, and where it might be wrong
            </h2>
          </div>
          <div className="flex flex-col gap-16">
            <DarkVideoFrame
              src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952448/Academic_Trajectory_jkfdhx.mp4"
              className="w-full rounded-2xl"
            />
            <FinalSolutionBlock
              title="Transparent, explainable recommendations"
              body="I showed what data informed each suggestion and refined the recommendation logic to balance both completed coursework and student interest."
            >
              <ImageFrame
                src="/new-salesforce/Academic%20Trajectory.png"
                alt="Galileo Academic Trajectory dashboard"
                width={867}
                height={561}
                left={-115}
              />
            </FinalSolutionBlock>
            <FinalSolutionBlock
              title="The four lenses of academic progress"
              body={
                <>
                  Lets a student view the same course history by year, by potential major, by
                  course theme or by career pathway, each one answering a different version of
                  &ldquo;what does this actually mean for me.&rdquo;
                </>
              }
            >
              <ImageFrame
                src="/new-salesforce/Academic%20Trajectory-%20By%20Course%20Themes.png"
                alt="Galileo Academic Progress by course themes"
                width={854}
                height={552}
                left={-102}
              />
            </FinalSolutionBlock>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
            Overview: cutting everything that wasn&apos;t a next step
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-medium leading-[140%] text-[#333333]" style={fontStyle.figtree}>
                Designed around student actions
              </p>
              <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
                I designed the overview so GPA, degree progress, and deadlines all helped students
                decide what to do next.
              </p>
            </div>
            <DarkVideoFrame
              src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952378/Dashboard_isvhue.mp4"
              className="w-full rounded-2xl"
            />
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-medium leading-[140%] text-[#333333]" style={fontStyle.figtree}>
                Removing features improved clarity
              </p>
              <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
                After concept testing, I cut visualizations and secondary panels that distracted
                from the primary action, making the page more focused and usable.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
            Enrollment Plugin: linking into iGPS instead of building a sixth tool
          </h2>
          <div className="flex flex-col gap-16">
            <FinalSolutionBlock
              title="Integrated into existing workflows"
              body="Connecting Galileo to iGPS turned planning and registration into a single continuous experience."
            >
              <ImageFrame
                src="/new-salesforce/Plugin%20View%201.png"
                alt="Galileo plugin embedded in the iGPS class search page"
                width={736}
                height={414}
              />
            </FinalSolutionBlock>
            <FinalSolutionBlock
              title="Visible system feedback"
              body="A live progress indicator eliminated uncertainty while schedules were added to the enrollment system."
            >
              <ImageFrame
                src="/new-salesforce/Plugin-%20add%20to%20cart.png"
                alt="Galileo plugin showing a progress indicator while adding courses to the schedule"
                width={736}
                height={398}
              />
            </FinalSolutionBlock>
          </div>
        </div>
      </section>

      <section id="in-hindsight" className="flex max-w-[768px] flex-col gap-12">
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-semibold leading-[150%] text-salesforce" style={fontStyle.figtree}>
            In Hindsight
          </p>
          <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
            The advisor gap remained
          </h2>
          <div className="flex flex-col gap-4">
            <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
              Human intervention isn&apos;t a layer you unlock after the others, it&apos;s a seam
              that should run through all of them. A student stuck on the simplest task list
              needs a way to reach a person just as much as a student weighing a fully sourced
              recommendation.
            </p>
            <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
              We chose depth over coverage. Building one core planning experience end to end
              mattered more than spreading across every part of a student&apos;s academic life,
              including advising, and ending up shallow everywhere instead of strong at one
              thing.
            </p>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/new-salesforce/Illustration.png"
          alt="Diagram showing how Galileo's AI layers integrate: base integration, AI clusters, and AI sourcing and trust signals connecting every cluster, with human intervention running through all layers"
          className="w-full rounded-[var(--ds-radius-container)]"
        />
      </section>

      <section id="reflection" className="flex max-w-[768px] flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-semibold leading-[150%] text-salesforce" style={fontStyle.figtree}>
            Reflections
          </p>
          <h2 className={caseStudySectionH2} style={fontStyle.figtree}>
            AI suggestions can still come off as prescriptive
          </h2>
          <p className="text-[16px] font-normal leading-[160%] text-[#555555]" style={fontStyle.figtree}>
            Copy alone doesn&apos;t guarantee behavior change. If I extended this project, I&apos;d
            want to test whether the disclosure language actually changed how students weighed a
            recommendation and explore different interaction patterns for this use case.
          </p>
        </div>
        <div className="flex w-full flex-col gap-10 rounded-[var(--ds-radius-container)] bg-[#F5F5F5] p-10">
          <div className="flex flex-col gap-6">
            <p className="font-mono text-[14px] font-medium leading-[160%] text-[#333333]">
              Prescriptive
            </p>
            <div className="flex flex-col gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-salesforce/Majors.png"
                alt="Your Emerging Academic Interests panel showing Early Childhood Education at 50% match and Occupational Therapy at 24% match"
                className="w-full rounded-lg"
                style={{ aspectRatio: "728 / 179" }}
              />
              <p
                className="text-center text-[12px] font-normal leading-[187%] text-[#555555]"
                style={fontStyle.figtree}
              >
                A percentage next to a major reads like an answer, even with a tooltip sitting
                right next to it explaining how it got there.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <p className="font-mono text-[14px] font-medium leading-[160%] text-[#333333]">
              Assistive
            </p>
            <div className="flex flex-col gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-salesforce/Careers.png"
                alt="Where these paths could lead panel showing Early Education Instructor linked to Education and Occupational Therapist linked to Occupational Therapy"
                className="w-full rounded-lg"
                style={{ aspectRatio: "728 / 179" }}
              />
              <p
                className="text-center text-[12px] font-normal leading-[140%] text-[#555555]"
                style={fontStyle.figtree}
              >
                This pattern already existed a few screens over. Four options with equal weight
                given to each and tracing back to a specific interest instead of ranked against
                the others.
              </p>
            </div>
          </div>
        </div>
      </section>
    </CaseStudyLayout>
  );
}
