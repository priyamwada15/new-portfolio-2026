import { Metadata } from "next";
import CaseStudyLayout from "../components/CaseStudyLayout";
import SectionLabel from "../components/SectionLabel";

export const metadata: Metadata = {
  title: "Asimov for Tars | Priyamwada Pandey",
  description:
    "I designed the system that taught an AI what to know, who to trust and what to do — and 82% of pilot teams adopted it.",
};

export default function AsimovPage() {
  return (
    <CaseStudyLayout
      accentDark="#6D33AA"
      accentLight="#E2D6EE"
      logos={[
        { src: "/logos/tars.svg", alt: "TARS" },
      ]}
      projectName="Asimov for Tars"
      headline="I designed the system that taught an AI what to know, who to trust and what to do — and 82% of pilot teams adopted it."
      context="Asimov is an AI assistant that lives inside team Slack workspaces. The core design challenge was what Asimov could access, who could use it and what it was allowed to do."
      contribution="I led 0→1 design for Asimov's knowledge management system, permissions architecture and external integrations hub — shipping incrementally across a 4-month engagement. Components I designed became the foundation for Tars' product suite."
      meta={{
        timeline: "Dec 2023 – Mar 2024",
        industry: "B2B SaaS",
        role: "Product Designer",
        team: "Founders, Engineers, Me",
      }}
      nextProject={{
        href: "/rocket-mortgage",
        tags: "Product Design · 2025 · Rocket Mortgage",
        title:
          "I introduced interaction patterns to Rocket's AI assistant that made it to the product roadmap.",
      }}
      toc={[
        { id: "section-01", label: "01" },
        { id: "section-02", label: "02" },
        { id: "section-03", label: "03" },
        { id: "constraint", label: "Constraint" },
        { id: "craft", label: "Craft" },
        { id: "reflection", label: "Reflection" },
      ]}
    >
      <div className="grid md:grid-cols-3 gap-8 py-8 border-y border-border">
        {[
          { stat: "82.3%", label: "Adoption in early pilot teams" },
          { stat: "~74%", label: "Reduction in task-related queries" },
          { stat: "86%", label: "Positive feedback from teams" },
        ].map((item) => (
          <div key={item.stat}>
            <p className="font-sans text-3xl md:text-4xl font-medium text-ink mb-1">{item.stat}</p>
            <p className="font-mono text-[11px] font-medium tracking-tight uppercase text-muted">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Section 01 */}
      <section id="section-01">
        <SectionLabel>01</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          What the system needs to know
        </h2>
        <div className="space-y-5">
          <p>
            We started with Slack as the only knowledge source. During early
            interviews, a CXO asked whether Asimov could pull from their Notion
            wiki. That question was the first signal that a single source
            wasn&apos;t going to work for how teams actually store information.
          </p>
          <p>
            The pivot meant rethinking the knowledge base from a channel list
            into something closer to a management system. I designed a dashboard
            where admins could connect multiple sources, set sync frequency and
            see metadata on what Asimov had ingested from each one.
          </p>
          <p>
            Admins needed to know what the AI was learning from, so I made that
            information visible rather than something teams had to assume was
            working.
          </p>
        </div>
      </section>

      {/* Section 02 */}
      <section id="section-02">
        <SectionLabel>02</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          How the admins stay in control
        </h2>
        <div className="space-y-5">
          <p>
            Teams were excited that Asimov could find information fast. What
            they needed alongside that was confidence that it couldn&apos;t
            access the wrong things.
          </p>
          <p>
            Early designs had integration settings scattered across individual
            feature sections. That worked when there were two or three
            connections, but teams were asking for more. A unified hub meant
            admins had one place to audit the system&apos;s external reach,
            which turned out to be important for teams dealing with internal
            compliance requirements.
          </p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              label: "Connect",
              desc: "Link external tools like Google Drive, HubSpot and Notion as live sources.",
            },
            {
              label: "Permission",
              desc: "Control what Asimov can read and act on per integration.",
            },
            {
              label: "Disconnect",
              desc: "Revoke access at any time without disrupting the rest of the system.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="border border-border p-5 rounded-sm"
            >
              <p className="font-mono text-[11px] font-semibold tracking-tight uppercase text-secondary mb-2">
                {item.label}
              </p>
              <p className="font-sans text-sm text-secondary leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 03 */}
      <section id="section-03">
        <SectionLabel>03</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          From retrieval to execution
        </h2>
        <div className="space-y-5">
          <p>
            Once integrations were in place, teams started asking whether Asimov
            could do things inside those tools — not just read from them.
          </p>
          <p>
            I looked at how GPT Builder was handling this in early 2024 and used
            it as a reference point for what configurability at this level
            actually required. The design constraint was making schema
            configuration and authentication setup usable for someone who
            wasn&apos;t technical.
          </p>
          <p>
            The first version let teams add custom tools by configuring a schema
            and authentication method. It was functional but it assumed a level
            of technical comfort most admins didn&apos;t have. The next
            iteration connected actions directly to the integrations hub, so
            teams could authorize Asimov to perform specific tasks within tools
            they had already connected.
          </p>
        </div>
      </section>

      {/* Constraint */}
      <section id="constraint">
        <SectionLabel>The constraint I didn&apos;t anticipate</SectionLabel>
        <h2 className="font-mono text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink mb-10">
          Access control became urgent before the backend was ready for it.
        </h2>
        <div className="space-y-5">
          <p>
            As teams connected more data sources, it became clear that not
            everyone should have the same access to what Asimov knew. A full
            role-based access system at the dashboard level needed deeper
            backend work than we had runway for at the time.
          </p>
          <p>
            I designed a workaround through Asimov&apos;s Slack settings that
            let admins control who had access and introduced multiple instances
            so teams could deploy Asimov at different organizational levels.
          </p>
        </div>
      </section>

      {/* Craft */}
      <section id="craft">
        <SectionLabel>Craft</SectionLabel>
        <p className="font-sans text-lg text-secondary leading-relaxed">
          Components designed for Asimov became the foundation for Tars&apos;
          product suite. I designed these to work consistently across desktop
          and mobile surfaces so each new feature could be assembled from
          existing parts rather than built from scratch.
        </p>
      </section>

      {/* Reflection */}
      <section id="reflection">
        <SectionLabel>Reflection</SectionLabel>
        <div className="space-y-8">
          {[
            {
              title: "Ship small, ship quick, learn fast",
              body: "Breaking work into shippable features meant learning from real usage before the next decision was locked in. Asimov got better because teams were using it, not because we anticipated everything upfront.",
            },
            {
              title: "Constraints surface on their own schedule",
              body: "RBAC felt like a future problem until teams started connecting sensitive data sources. The gap between 'we'll deal with that later' and 'we need this now' closed faster than the roadmap expected.",
            },
            {
              title: "Sequence is a design decision",
              body: "What gets built first shapes what's possible afterward. Focusing on RBAC earlier would have made enterprise adoption easier. Designers should be in the conversation about what gets prioritized, not just how it gets designed.",
            },
          ].map((item, i) => (
            <div key={i} className="border-l-2 border-border pl-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-tight mb-2">
                {item.title}
              </p>
              <p className="font-sans text-base text-secondary leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </CaseStudyLayout>
  );
}
