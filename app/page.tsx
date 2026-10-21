import type { ReactNode } from "react";
import { HOME_V2_PAGE_BG } from "@/design-system";
import { HomeV2CardLink } from "./home-v2/HomeV2CardLink";
import { CompanyLogos } from "./home-v2/CompanyLogos";
import { CloudsHero } from "./home-v2/CloudsHero";
import { RocketAssistEmbed } from "./home-v2/RocketAssistEmbed";
import { AsimovKnowledgeEmbed } from "./home-v2/AsimovKnowledgeEmbed";
import { DebugModeEmbed } from "./home-v2/DebugModeEmbed";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import styles from "./home-v2/home.module.css";

type CaseStudy = {
  href: string;
  ariaLabel: string;
  title: string;
  outcome: string;
  tags: string[];
  /** Coded UI floating on the card. It sits outside the card link, so its controls aren't nested in the link. */
  embed: ReactNode;
};

type Company = {
  name: string;
  logos: { src: string; alt: string; tall?: boolean }[];
  role: string;
  dates: string;
  summary: string;
  studies: CaseStudy[];
};

// Salesforce is hidden until it's reworked; its page still lives at app/salesforce.
const COMPANIES: Company[] = [
  {
    name: "Rocket Mortgage",
    logos: [{ src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" }],
    role: "Conversational AI Design Intern",
    dates: "Summer 2025",
    summary: "I redesigned Rocket Assist, the AI assistant homebuyers talk to through their loan.",
    studies: [
      {
        href: "/rocket-mortgage",
        ariaLabel: "Read Rocket Mortgage case study",
        title: "Personalizing AI guidance across 6.8M+ client conversations",
        outcome: "In usability testing, 92% of clients found the redesign more helpful and 75% found it more trustworthy.",
        tags: ["B2C Fintech", "AI Assistant", "Trust Design"],
        embed: <RocketAssistEmbed />,
      },
    ],
  },
  {
    name: "Tars",
    logos: [{ src: "/logos/tars.svg", alt: "Tars" }],
    role: "Product Designer",
    dates: "2021 – 2024",
    summary:
      "One of the first design hires at a startup where teams build AI agents. I designed its AI agent for Slack and the tool its teams used to debug agents.",
    studies: [
      {
        href: "/tars-asimov",
        ariaLabel: "Read Asimov for Tars case study",
        title: "Designing the agent configuration platform and design system for Asimov",
        outcome: "~74% fewer repeat questions landing on teammates, with 86% of Asimov's answers rated helpful.",
        tags: ["B2B SaaS", "0→1", "Workflow Design"],
        embed: <AsimovKnowledgeEmbed />,
      },
      {
        href: "/tars-debug-mode",
        ariaLabel: "Read Tars Debug Mode case study",
        title: "Designing an internal debugger that cut troubleshooting time by ~70%",
        outcome: "One place for the CS team and developers to see where an agent's flow broke, and why.",
        tags: ["B2B SaaS", "Complex Workflows", "Internal Tool"],
        embed: <DebugModeEmbed />,
      },
    ],
  },
];

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div className={styles.cardWrap}>
      <HomeV2CardLink href={study.href} ariaLabel={`${study.title}. ${study.ariaLabel}`} className={`cursor-hover-dark ${styles.card}`}>
        {/* Olive and rose backdrop for the coded UI */}
        <div className={styles.cardMedia} data-card-media />
        <div className={styles.cardText}>
          <h4 className={styles.cardTitle}>{study.title}</h4>
          <p className={styles.cardOutcome}>{study.outcome}</p>
          <p className={styles.cardTags}>{study.tags.join(", ")}</p>
        </div>
      </HomeV2CardLink>
      {study.embed}
    </div>
  );
}

/** One company: its logo, role, dates and summary pinned on the left, its case studies on the right. */
function CompanyGroup({ company }: { company: Company }) {
  return (
    <section className={styles.group} aria-label={company.name} data-company-group>
      <div className={styles.company}>
        <h3 className="sr-only">{company.name}</h3>
        <CompanyLogos className={styles.companyLogos}>
          {company.logos.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={logo.src} src={logo.src} alt={logo.alt} className={logo.tall ? styles.logoTall : undefined} />
          ))}
        </CompanyLogos>
        <p className={styles.companyRole}>{company.role}</p>
        <p className={styles.companyDates}>{company.dates}</p>
        <p className={styles.companySummary}>{company.summary}</p>
      </div>
      <div className={styles.studies}>
        {company.studies.map((study) => (
          <ScrollReveal key={study.href}>
            <CaseStudyCard study={study} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page} style={{ backgroundColor: HOME_V2_PAGE_BG }}>
      <CloudsHero />
      {/* The Adtua snapshot card (AdtuaSnapshot) is off the homepage for now; it'll move to a "currently working on" section. */}
      <div className={styles.layout}>
        <section id="work" className={styles.work} aria-label="Case studies" data-pixel-blocks>
          {COMPANIES.map((company) => (
            <CompanyGroup key={company.name} company={company} />
          ))}
        </section>
      </div>
      {/* The gutter pixel trail (home-v2/GutterPixels) is switched off for now. */}
    </div>
  );
}
