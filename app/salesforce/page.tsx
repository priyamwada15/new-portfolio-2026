import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import SectionLabel from "../components/SectionLabel";
import IterationLabel from "../components/IterationLabel";
import VisualCaption from "../components/VisualCaption";
import DarkVideoFrame from "../components/DarkVideoFrame";
import TabbedSections from "./TabbedSections";
import { SITE_DEFAULT_PAGE_BG } from "../lib/caseStudy";

export const metadata: Metadata = {
  title: "Galileo for Salesforce | Priyamwada Pandey",
  description:
    "I co-led the design of a 0→1 AI product that helps students plan their academic future.",
};

export default function SalesforcePage() {
  return (
    <CaseStudyLayout
      accentDark="#032C5F"
      accentLight="#BAD4EB"
      bodyBackgroundColor={SITE_DEFAULT_PAGE_BG}
      headlineFont="figtree"
      headlineColor="#333333"
      contentBodyClassName="text-[14px] text-secondary leading-relaxed"
      sectionBodyClassName="text-[14px]"
      tocLinkFontFamily="var(--font-hind), sans-serif"
      logos={[{ src: "/logos/salesforce.svg", alt: "Salesforce", cls: "h-8" }]}
      reverseHeaderOrder={true}
      heroVisual={
        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Salesforce%20Hero%20Image.png"
            alt="Galileo for Salesforce, hero overview"
            className="w-full"
            style={{ display: "block" }}
          />
        </div>
      }
      contextVisual={
        <>
          <DarkVideoFrame
            src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952378/Dashboard_isvhue.mp4"
            className="w-full rounded-2xl"
          />
          <VisualCaption>The Overview section of Galileo.</VisualCaption>
        </>
      }
      projectName="Galileo for Salesforce"
      headline="I co-led the design of a 0→1 AI product that helps students plan their academic future."
      context="Galileo was a 0→1 concept built in collaboration with the Salesforce Experience Design team as part of a semester-long design studio at IU. This project explored how AI could support academic decision-making for undeclared undergraduates."
      contribution="I co-led design end-to-end, leading the Overview and Academic Trajectory sections specifically. My work centered on interaction design, information architecture and AI interaction patterns, specifically how to make recommendations feel actionable."
      meta={{
        timelineLabel: "Handed Off",
        timeline: "Dec 2025",
        industry: "EdTech / Higher Education",
        role: "Lead Product Designer",
        team: "8 Student Designers, Salesforce Experience Design Team",
      }}
      nextProject={{
        href: "/tars-asimov",
        tags: "Product Design · 2024 · Tars Technologies",
        title:
          "I designed the system that taught an AI what to know, who to trust and what to do, and 82% of pilot teams adopted it.",
      }}
      toc={[
        { id: "interaction-patterns", label: "Interaction patterns" },
        { id: "understanding-problem", label: "Understanding the problem" },
        { id: "how-galileo-works", label: "Five sections, one through-line" },
        { id: "design-decision-01", label: "Overview Dashboard" },
        { id: "design-decision-02", label: "Academic Trajectory" },
        { id: "visual-language", label: "Visual language" },
        { id: "other-sections", label: "The rest of the product" },
        { id: "reflection", label: "Reflection" },
      ]}
    >
      {/* Interaction Patterns */}
      <section id="interaction-patterns">
        <SectionLabel>Interaction patterns</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          The decisions that shaped how Galileo thinks with students
        </h2>
        <p className="font-sans text-[14px] text-secondary leading-relaxed mb-10">
          Galileo had a lot of moving parts. Course discovery, shortlisting,
          scheduling and trajectory planning all had to work as a connected
          system. The decisions that mattered most were about restraint: what to
          show, what to hide, when to let AI speak and when to stay out of the
          way.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Designing%20the%20Details.png"
          alt="Galileo interaction patterns, designing the details"
          className="w-full"
          style={{ display: "block" }}
        />
      </section>

      {/* Problem */}
      <section id="understanding-problem">
        <SectionLabel>Understanding the problem</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          Students didn&apos;t lack information. They lacked a way to make sense of it
        </h2>
        <p className="font-sans text-[14px] text-secondary leading-relaxed mb-6">
          We conducted 16 student interviews, a literature review and a digital
          ethnographic study across Reddit and RateMyProfessor. What kept coming
          up was not a lack of information. Students had degree audits, course
          catalogs and enrollment portals. What they lacked was any way to
          connect that information to their own goals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "High-impact decisions over time",
              desc: "Early course choices shape workload balance, prerequisites and eligibility for majors down the line.",
            },
            {
              label: "Information without interpretation",
              desc: "University tools surface requirements and data but don't help students understand what any of it means for their specific path.",
            },
            {
              label: "Fragmented academic systems",
              desc: "Students piece together their academic picture from degree audits, course catalogs, enrollment portals and peer advice, none of which talk to each other.",
            },
            {
              label: "Decision fatigue and uncertainty",
              desc: "Scattered information forces students to synthesize academic data manually, increasing cognitive load and reducing confidence in their choices.",
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col border border-border"
              style={{ padding: "24px 16px", gap: "24px", borderRadius: "8px" }}
            >
              {/* Number */}
              <span
                style={{
                  fontFamily: "var(--font-hind), sans-serif",
                  fontSize: "40px",
                  lineHeight: "45px",
                  fontWeight: 400,
                  color: "var(--accent-dark)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Text */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-hind), sans-serif",
                    fontSize: "16px",
                    lineHeight: "18px",
                    fontWeight: 400,
                    color: "#111111",
                  }}
                >
                  {item.label}
                </p>
                <p
                  className="font-sans"
                  style={{ fontSize: "12px", lineHeight: "19px", color: "#555555" }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Structure */}
      <section id="how-galileo-works">
        <SectionLabel>Five sections, one through-line</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-6">
          Five sections, one through-line: the student decides, AI informs
        </h2>
        <p className="font-sans text-[14px] text-secondary leading-relaxed mb-4">
          Galileo is built around five connected sections. Students start with an
          Overview that gives them a quick read on where they stand academically.
          From there they can browse and discover courses, shortlist ones
          they&apos;re interested in and plan their semester visually. The final
          section, Academic Trajectory, is where the system steps back and helps
          students reflect on where their academic choices are pointing them.
        </p>
        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/User%20Flow.png"
            alt="Example user flow through Galileo's five sections"
            className="w-full"
            style={{ display: "block" }}
          />
        </div>
        <VisualCaption>Example of a student&apos;s user flow while interacting with Galileo.</VisualCaption>
        <p className="font-sans text-[14px] text-secondary leading-relaxed mt-4">
          The sections are designed to work in sequence but don&apos;t have to
          be used that way. The flow follows the student, not the other way
          around.
        </p>
      </section>

      {/* Overview Dashboard */}
      <section id="design-decision-01">
        <SectionLabel>Overview Dashboard</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          Designing a screen that knows when to stop
        </h2>
        <p className="mb-5">
          The Overview is the first thing a student sees when they open
          Galileo. It had to earn their attention without wasting it.
        </p>
        <DarkVideoFrame src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952378/Dashboard_isvhue.mp4" className="w-full rounded-2xl" />
        <VisualCaption>The Overview section of Galileo.</VisualCaption>

        <p className="mt-5">
          Our early iterations had a lot going on, an academic compass
          visualizing study trajectory, quick links to university apps, advisor
          contact, course suggestions, an onboarding quiz snippet and multiple
          CTAs pulling the student in different directions. It looked thorough
          but it wasn&apos;t useful.
        </p>

        <div
          className="overflow-hidden rounded-2xl mt-5"
          style={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Old-%20Dashboard%20Home.png"
            alt="First iteration of the Overview dashboard"
            className="w-full"
            style={{ display: "block" }}
          />
        </div>
        <VisualCaption>First iteration of the Overview dashboard, with early elements that were later removed.</VisualCaption>

        <div className="flex flex-col min-[1100px]:flex-row gap-6 mt-5">
          <p className="flex-1">
            The Salesforce Experience Design team made that clear in the first
            review. There was no set action a student could take. That reframed
            everything. Our north star became one principle: every section needs
            to offer something actionable.
          </p>
          <p className="flex-1">
            For the Overview that meant cutting almost everything. What stayed
            was GPA, a GenEd requirement tracker and an Academic Progress
            section. The only additional information is enrollment-related
            deadlines that are actually time-sensitive.
          </p>
        </div>
      </section>

      {/* Academic Trajectory */}
      <section id="design-decision-02">
        <SectionLabel>Academic Trajectory</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          The section where AI had the most to say
        </h2>

        <p className="font-sans text-[14px] text-secondary leading-relaxed">
          Academic Trajectory is where Galileo steps back and asks a bigger
          question, not just what courses a student has taken, but what those
          choices might be pointing toward.
        </p>

        <div className="mt-8">
          <IterationLabel className="mb-4">Four ways to read the same data</IterationLabel>
          <div className="space-y-5">
            <p className="font-sans text-[14px] text-secondary leading-relaxed">
              The Academic Progress section gives students four lenses to view
              their course history: by year, by potential major, by course theme
              and by career pathway. The data is identical across all four views.
              What changes is the interpretive frame.
            </p>
            <p className="font-sans text-[14px] text-secondary leading-relaxed">
              This came directly from a research insight, students didn&apos;t
              lack information, they lacked ways to connect it to their own goals.
              A student trying to figure out if they should pursue Education as a
              major sees something very different when their courses are grouped by
              potential major versus grouped by year. Both views are true. They
              just answer different questions.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <DarkVideoFrame src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952448/Academic_Trajectory_jkfdhx.mp4" className="w-full rounded-2xl" />
          <VisualCaption>The Academic Trajectory section, showing four ways to view the same course data.</VisualCaption>
        </div>

        <div className="mt-8">
          <IterationLabel className="mb-4">Designing for AI transparency</IterationLabel>
          <div className="flex flex-col min-[1100px]:flex-row gap-6">
            <p className="font-sans text-[14px] text-secondary leading-relaxed min-[1100px]:flex-1">
              Because the entire Trajectory section is AI-generated, I had to be
              deliberate about how that was communicated. Students in our research
              were clear, they wanted to know when AI was involved and they did
              not want to feel like the system was making decisions for them.
            </p>
            <div className="space-y-4 min-[1100px]:flex-1">
              {[
                "The Summarize AI icon appears on every AI-generated element to identify it as such.",
                "Disclosure copy beneath the major and career suggestions explains what data was used and how.",
                "A contextual tooltip on the page header, 'How can this section help me?', reframes the entire section as a thinking tool rather than a verdict.",
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-xs text-neutral-400 font-mono shrink-0 mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="font-sans text-[14px] text-secondary leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div
              className="overflow-hidden rounded-2xl"
              style={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/AI%20Copy%20and%20Icon.png"
                alt="Summarize icon and disclosure copy on AI-generated content"
                className="w-full"
                style={{ display: "block" }}
              />
            </div>
            <VisualCaption>Summarize icon marking AI-generated content with supporting disclosure copy to inform students how the content was created and how to use it.</VisualCaption>
          </div>
        </div>

        <div className="mt-8">
          <IterationLabel className="mb-4">A radar chart. Then a donut chart. Then neither</IterationLabel>
          <div className="space-y-5 mb-6">
            <p className="font-sans text-[14px] text-secondary leading-relaxed">
              For a long time I was stuck on how to visually represent the
              AI&apos;s major and career suggestions. The first idea was a radar
              chart, it felt like the right format for showing multiple dimensions
              of a student&apos;s academic profile. But we couldn&apos;t fix the
              axes. Every student&apos;s journey is different, which meant the
              chart would look different for every student and there was no
              consistent way to interpret it.
            </p>
            <p className="font-sans text-[14px] text-secondary leading-relaxed">
              We moved to a donut chart. Simpler, more familiar. But the math
              wasn&apos;t adding up. During evaluations, students couldn&apos;t
              figure out how the percentages were being distributed across the
              segments. The visualization was once again creating confusion rather
              than clarity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Radar%20Chart%20iterations.png"
                  alt="Radar chart sketches exploring academic trajectory visualization"
                  className="w-full"
                  style={{ display: "block" }}
                />
              </div>
              <VisualCaption>Iteration Round 1: Sketching out how can radar charts help visualize the academic trajectory of the student.</VisualCaption>
            </div>
            <div>
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Iteration%20Round%202.png"
                  alt="Donut chart explorations for academic trajectory visualization"
                  className="w-full"
                  style={{ display: "block" }}
                />
              </div>
              <VisualCaption>Iteration Round 2: Exploring donut charts for visualizations.</VisualCaption>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Language */}
      <section id="visual-language">
        <SectionLabel>Visual language and cohesion</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          Making the system feel like one product
        </h2>
        <div className="space-y-5">
          <p>
            As one of two lead designers, part of my role was making sure that
            component decisions made in one section translated coherently across
            the whole product.
          </p>
          <p>
            Course cards appear across Browse, Shortlist and Academic Trajectory
            and each surface asks something slightly different from them. The
            component had to be flexible enough to adapt without losing its
            identity. Getting that right at the component level meant the product
            could feel like a system rather than a collection of screens.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Card%202.png"
            alt="Course card adapting its CTAs across different sections of Galileo"
            className="w-full"
            style={{ display: "block" }}
          />
        </div>
        <p className="mt-5">
          The CTAs on the card changed depending on what the student needed to
          do at that point in their journey. On the Course Search page, the
          priority was exploration, so the card offered two options, shortlist
          or view more details. On the Scheduler, the student had already made
          their choice. The only action left was to finalize. So that was the
          only CTA we gave them.
        </p>
      </section>

      {/* Rest of product */}
      <section id="other-sections">
        <SectionLabel>The rest of the product</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-6">
          The rest of the product, and where I handed off
        </h2>
        <p className="font-sans text-[14px] text-secondary leading-relaxed mb-6">
          I contributed to system cohesion across all five sections and the
          three below were led by other team members.
        </p>
        <TabbedSections
          tabs={[
            {
              label: "Browse Courses",
              desc: "Students currently discover courses mostly through word of mouth. The Browse section gives that process structure, surfacing courses based on GenEd requirements, interests and peer popularity, with AI connecting student interests to relevant options without making the choice for them.",
              videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952503/Curated_wl4dzz.mp4",
              caption: "The course discovery flow of Galileo.",
            },
            {
              label: "Shortlisted Courses",
              desc: "Shortlisting works as a consideration set. Students save courses across semesters, compare them side by side and narrow down. We deliberately kept AI out of this section. Feedback from career coaches made it clear that learning to compare and evaluate independently is a skill students need to build, not outsource.",
              videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952559/Scheduler_ts798r.mp4",
              caption: "The Shortlisted Course and Scheduler flow of Galileo.",
            },
            {
              label: "Semester Planner",
              desc: "The Planner is where decisions become commitments. Students drag shortlisted courses into semester slots with GenEd requirements visible at the top, evaluations showed students consistently lose track of pending requirements at the point of finalizing schedules.",
              imageSrc: "/7.%20Plan%20Your%20Semester.png",
              caption: "The Semester Planner section of Galileo.",
            },
          ]}
        />
      </section>

      {/* Reflection */}
      <section id="reflection">
        <SectionLabel>Reflection</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          What I would do differently
        </h2>
        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start">
          <div className="md:flex-1 space-y-5">
            <p>
              Both formal validation points, a heuristic evaluation and a
              Salesforce Experience Design review, came late. By the time we
              were incorporating feedback, most structural decisions were already
              made. The sharpest insight came from peers at our final
              presentation: we had thought carefully about how AI should behave
              in Galileo. We had not thought carefully enough about where a human
              advisor fits in.
            </p>
            <p>
              In hindsight I wish we had used that question to pressure-test our
              AI decisions earlier, not necessarily designed for it, but let it
              challenge our assumptions along the way.
            </p>
          </div>
          <div className="md:w-72 shrink-0">
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/SFimage.avif"
                alt="The SF student team with Scott Pitkin, Director of User Experience at Salesforce"
                className="w-full"
                style={{ display: "block" }}
              />
            </div>
            <VisualCaption>The SF student team with Scott Pitkin, Director of User Experience at Salesforce.</VisualCaption>
          </div>
        </div>
        <div className="mt-8">
          <IterationLabel className="mb-3">What this project taught me</IterationLabel>
          <p className="font-sans text-[14px] text-secondary leading-relaxed">
            This was the first time I designed as part of a design team.
            Keeping visual and interaction language consistent across sections
            that different people were building in parallel is a different kind
            of problem, less individual craft, more communication, shared
            principles and knowing when to push back on a decision that works in
            isolation but breaks the system.
          </p>
        </div>
      </section>
    </CaseStudyLayout>
  );
}
