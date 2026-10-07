import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import AutoPauseVideo from "../components/AutoPauseVideo";
import { CardRow, MediaRow, MediaTile, SectionHeader } from "../components/CaseStudySections";
import BeforeAfterCarousel from "./BeforeAfterCarousel";
import { BEFORE_SLIDES } from "./beforeSlides";
import ResearchAreas from "./ResearchAreas";
import {
  brands,
  caseStudyTitle,
  SALESFORCE_HERO_VIDEO,
  CASE_STUDY_PAGE_BG,
} from "@/design-system";

/** Brand-coloured inline emphasis inside body copy. */
function Emphasis({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-[var(--accent-dark)]">{children}</strong>;
}

export const metadata: Metadata = {
  title: "Galileo for Salesforce | 0→1 AI Product Design Case Study | Priyamwada Pandey",
  description:
    "I owned the information architecture of Galileo, a 0→1 AI product that helps college students plan their academic future, built for a Salesforce-sponsored design studio course at Indiana University.",
  keywords: [
    "0 to 1 product design",
    "AI product design case study",
    "Salesforce UX design",
    "edtech product design",
    "AI product designer portfolio",
  ],
};

export default function SalesforcePage() {
  return (
    <CaseStudyLayout
      sept2026Layout
      sideToc={[
        { id: "what-is-galileo", label: "Overview" },
        { id: "my-role", label: "My role" },
        { id: "problem", label: "Problem space" },
        { id: "ai-principles", label: "AI principles" },
        { id: "course-details", label: "Course details" },
        { id: "academic-trajectory", label: "Academic trajectory" },
        { id: "reflections", label: "Reflections" },
      ]}
      accentDark={brands.salesforce.accentDark}
      accentLight={brands.salesforce.accentLight}
      bodyBackgroundColor={CASE_STUDY_PAGE_BG}
      headlineClassName={caseStudyTitle}
      logos={[{ src: "/logos/salesforce.svg", alt: "Salesforce", cls: "h-10" }]}
      reverseHeaderOrder={true}
      heroVisual={
        <video
          src={SALESFORCE_HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Galileo for Salesforce, hero overview"
          className="block w-full rounded-[var(--ds-radius-container)]"
        />
      }
      headline="Designing a 0→1 AI platform for fragmented academic data"
      meta={{
        timelineLabel: "Handed off",
        timeline: "Dec 2025",
        industry: "EdTech / Higher Education",
        role: "Lead Product Designer",
        team: "7 Student Designers, Salesforce Experience Design Team",
      }}
    >
      <section id="what-is-galileo" className="flex flex-col gap-12">
        <SectionHeader title="What is Galileo?">
          <p>
            Galileo acts as a companion layer to the university&rsquo;s course enrollment portal
            helping students explore, plan, reflect on emerging academic directions and carry
            finalized courses into enrollment.
          </p>
          <p>
            We built it for a design studio course at Indiana University Bloomington that Salesforce
            sponsors, with a different project for each team. Our stakeholders were the Salesforce
            Experience Design team, and we met them weekly to share progress and get feedback.
          </p>
        </SectionHeader>
        <CardRow
          cards={[
            { label: "01", text: "Shows a student where their coursework already points" },
            { label: "02", text: "Pulls everything about a course onto one page" },
            { label: "03", text: "Carries the finalized plan into enrollment when they're ready" },
          ]}
        />
        <div className="grid aspect-[2/1] grid-cols-2 grid-rows-2 gap-4">
          <MediaTile
            className="row-span-2"
            src="/new-salesforce/galileo/about-bento-1-academic-progress.avif"
            alt="Galileo Academic Progress view with course cards grouped by career pathway"
            frame={{ width: 496, height: 504 }}
            image={{ width: 1131, height: 827, top: 31, left: 31 }}
          />
          <MediaTile
            src="/new-salesforce/galileo/about-bento-2-course-details.avif"
            alt="Galileo course details page for General Educational Psychology"
            frame={{ width: 496, height: 244 }}
            image={{ width: 596, height: 367, top: 23, left: 23 }}
          />
          <MediaTile
            src="/new-salesforce/galileo/about-bento-3-finalized-courses.avif"
            alt="Galileo finalized courses list with an enrollment countdown"
            frame={{ width: 496, height: 244 }}
            image={{ width: 365.5, height: 676, top: 23 }}
          />
        </div>
      </section>

      <section id="my-role" className="flex flex-col gap-12">
        <SectionHeader title="My role">
          <p>
            I owned the information architecture and designed 3 of Galileo&apos;s 5 product areas.
          </p>
          <p>
            <Emphasis>Academic Trajectory</Emphasis>
            {" "}is the four-lens view of where a student&apos;s coursework points.{" "}
            <Emphasis>Course Details</Emphasis>
            {" "}is the consolidated course page built around a personalized summary.
          </p>
          <p>
            I also shaped how{" "}
            <Emphasis>AI interaction patterns</Emphasis>
            {" "}were used across the product and led Galileo&apos;s visual design and evaluation.
          </p>
        </SectionHeader>
        {/* The diagram's #FAFAFA background runs to its bottom edge; the panel adds 24px below it. */}
        <div className="overflow-hidden rounded-[var(--ds-radius-container)] border border-border bg-surface-page pb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new-salesforce/galileo/role-design-flow.avif"
            alt="Galileo information architecture: Academic Overview branches into Browse Courses (Discovery, Course Catalog, Course Details), Shortlisted Courses (All Shortlisted, Scheduler, Compare Courses), Semester Planner, which connects to the iGPS university portal through an enrollment plugin, and Academic Trajectory. Academic Trajectory and Course Details are highlighted as features I owned."
            width={1008}
            height={602}
            className="block h-auto w-full"
          />
        </div>
      </section>

      <section id="problem" className="flex flex-col gap-[72px]">
        <div className="flex flex-col gap-12">
          <SectionHeader eyebrow="Problem Space" title="Where academic planning breaks down">
            <p>
              Interviews with students surfaced two problems that outweighed everything else we
              heard.
            </p>
          </SectionHeader>
          <CardRow
            variant="light"
            cards={[
              {
                label: "01",
                text: [
                  "Academic planning lives across the course catalog, an advisor, peer group chats and whatever review site a student trusts that week.",
                  "Putting together a real picture of one course means stitching all of it together yourself.",
                ],
              },
              {
                label: "02",
                text: [
                  "Most students can list the courses they'd taken but few can say what those courses were actually building toward.",
                  "Choices are reactive instead of directed, with no clear sense of where the coursework was pointing.",
                ],
              },
            ]}
          />
        </div>
        <div className="flex flex-col gap-12">
          <SectionHeader title="Where should we focus?" subheading>
            <p>
              Interviews also touched on career exploration, social life and mental health, so we
              built an Importance x Opportunity matrix to weigh where our effort could do the most good.
            </p>
            <p>
              We chose depth over coverage. Building one core academic planning experience end to
              end mattered more than spreading across every part of a student&apos;s life.
            </p>
          </SectionHeader>
          <ResearchAreas />
        </div>
      </section>

      <section id="ai-principles" className="flex flex-col gap-12">
        <SectionHeader
          title="AI interaction design principles used"
          titleAdornment={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/new-salesforce/galileo/ai-sparkle-32.svg"
              alt=""
              width={32}
              height={32}
              className="pointer-events-none absolute left-[-32px] top-[-15px] size-8 -rotate-[14.85deg] max-md:left-[-16px] max-md:top-[-18px] max-md:size-6"
            />
          }
        >
          <p>
            An AI system that makes choices for a student can build dependency instead of
            judgment, the last thing a student needs while they&apos;re still figuring out who they
            are academically.
          </p>
          <p>
            This ruled out the conversational AI pattern, a chat window where you ask and the
            system answers back. Galileo needed the opposite instinct.
          </p>
        </SectionHeader>
        <CardRow
          cards={[
            {
              icon: "/new-salesforce/galileo/ai-sparkle-16.svg",
              label: "PRINCIPLE 01",
              text: "AI works in the background, not as an active chat window",
            },
            {
              icon: "/new-salesforce/galileo/ai-sparkle-16.svg",
              label: "PRINCIPLE 02",
              text: "Every AI-generated element gets labelled clearly",
            },
            {
              icon: "/new-salesforce/galileo/ai-sparkle-16.svg",
              label: "PRINCIPLE 03",
              text: "Keep paths open beyond what AI suggests",
            },
          ]}
        />
      </section>

      <section id="course-details" className="flex flex-col gap-8">
        <SectionHeader eyebrow="Solution" title="Course Details">
          <p>
            iGPS had the mechanics, Reddit had the unfiltered and anonymous reviews,
            RateMyProfessor had how the professor taught.
          </p>
          <p>
            Students had to check three different platforms, including offline reviews from peers
            to decide on a course.
          </p>
        </SectionHeader>
        <BeforeAfterCarousel slides={BEFORE_SLIDES} />
        <div className="flex flex-col items-start gap-4">
          <span className="rounded-[4px] border border-[#94BD9D] bg-[#EBFAEB] px-3 py-[6px] font-mono text-[12px] font-medium uppercase leading-4 text-[#297A3A]">
            after
          </span>
          <AutoPauseVideo
            src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1790270244/Course_Overview_qyfzvy.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Galileo Course Details page, built from all three sources"
            className="block w-full rounded-[var(--ds-radius-container)] border border-border"
          />
        </div>
        <div className="flex flex-col gap-12">
          <MediaRow
            title="Overview"
            media={{
              src: "/new-salesforce/galileo/course-details-overview.avif",
              alt: "Course Details overview with a personalized summary, course outcomes, associated majors and careers",
              image: { width: 622, height: 580, top: 23, radius: 11 },
            }}
          >
            <p>
              At the top sits a summary generated for the student reading it, pulled from their
              course history Academic Trajectory already surfaced.
            </p>
            <p>
              The summary says how this specific course connects to where they&apos;re already
              headed.
            </p>
          </MediaRow>
          <MediaRow
            title="Peer Insights"
            imageSide="left"
            media={{
              src: "/new-salesforce/galileo/course-details-peer-insights.avif",
              alt: "Peer Insights panel with course ratings, workload and difficulty tags, and professor reviews",
              image: { width: 630, height: 331, top: -10 },
            }}
          >
            <p>
              This information can help students understand course difficulty, workload
              expectations, and overall experiences with professors and classes.
            </p>
            <p>
              The tags above each review provide a quick understanding of what the professor or
              course may be like.
            </p>
          </MediaRow>
        </div>
      </section>

      <section id="academic-trajectory" className="flex flex-col gap-12">
        <SectionHeader eyebrow="Solution" title="Academic Trajectory">
          <p>
            Academic Trajectory takes the same course history and asks four different questions
            of it.
          </p>
        </SectionHeader>
        <CardRow
          cards={[
            {
              label: "By Year",
              text: "Tracks pace by semester, credits completed against credits left, so a slow one gets caught early.",
            },
            {
              label: "By Potential Major",
              text: "Checks whether coursework already points toward a major, grouped so the pattern is visible.",
            },
            {
              label: "By Career Pathways",
              text: "Shows how coursework connects to different careers so a student can choose to go deep into one.",
            },
            {
              label: "By Course Themes",
              text: "For students not ready to choose yet, groups courses around a broader interest so they can still explore.",
            },
          ]}
        />
        {/* Same video as the hero. */}
        <AutoPauseVideo
          src={SALESFORCE_HERO_VIDEO}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Galileo Academic Trajectory across its four lenses"
          className="block w-full rounded-[var(--ds-radius-container)] border border-border"
        />
        <div className="flex flex-col gap-12">
          <MediaRow
            title="Overview"
            media={{
              src: "/new-salesforce/galileo/trajectory-overview-cards.avif",
              alt: "Your Emerging Academic Interests and Where these paths could lead cards, each marked as AI-generated",
              image: { width: 1024, height: 341, top: 23, left: 23 },
            }}
          >
            <p>
              The majors/careers cards are the actual AI-generated read on a student&apos;s
              direction, so that&apos;s where transparency has to show up.
            </p>
            <p>
              A summarize icon marks each card as AI-generated, and disclosure copy underneath
              states what the suggestion is based on.
            </p>
          </MediaRow>
          <MediaRow
            title="How can this section help me?"
            imageSide="left"
            media={{
              src: "/new-salesforce/galileo/trajectory-how-can-this-help.avif",
              alt: "The How can this section help me? prompt expanded with guidance on using the section as a checkpoint",
              frame: { width: 668, height: 350 },
              image: { width: 822, height: 357, top: 23, right: 23 },
            }}
          >
            <p>
              The &ldquo;How can this section help me?&rdquo; prompt reframes the whole thing as a
              thinking tool instead of a verdict on who the student is.
            </p>
          </MediaRow>
          <MediaRow
            title="By Potential Major and By Career Pathways"
            media={{
              src: "/new-salesforce/galileo/trajectory-major-career-lenses.avif",
              alt: "Your Academic Progress viewed By Potential Majors, with courses grouped under Education, Occupational Therapy and Child Psychology",
              image: { width: 924, height: 399, top: 23, left: 23 },
            }}
          >
            <p>
              Both lenses run the same AI logic as the cards above, applied at the course level.
            </p>
            <p>
              Each lens reads a student&apos;s coursework and places it under a major or a career
              and a single course can surface under more than one lens since the logic isn&apos;t
              sorting into a single fixed bucket.
            </p>
          </MediaRow>
        </div>
      </section>

      <section id="reflections">
        <SectionHeader eyebrow="Reflections" title="Setting boundaries for AI across the product" looseBody>
          <p>
            AI suggestions can still come off as prescriptive, as copy alone doesn&apos;t guarantee
            behavior change. If I extended this project, I&apos;d want to test whether the
            disclosure language actually changes how a student weighs a recommendation.
          </p>
          <div className="flex flex-col gap-2">
            <p>
              One student we interviewed worked part-time for the university&rsquo;s Advising
              office. They pushed hardest on keeping a person in that relationship.
            </p>
            <p>
              It&apos;s part of why we considered a standalone Advisor section and chose not to
              build it, with AI already taking over so many jobs, that judgment felt too important
              to risk.
            </p>
          </div>
        </SectionHeader>
      </section>
    </CaseStudyLayout>
  );
}
