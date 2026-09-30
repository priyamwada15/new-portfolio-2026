import type { Metadata } from "next";
import { HOME_V2_PAGE_BG } from "@/design-system";
import { HomeV2CardLink } from "../home-v2/HomeV2CardLink";
import { PriyamwadaNameLink } from "../home-v2/PriyamwadaNameLink";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { AdtuaSnapshot } from "./AdtuaSnapshot";
import styles from "./sandbox.module.css";

/** Private homepage layout sandbox: not linked anywhere, kept out of search. */
export const metadata: Metadata = {
  title: "Homepage sandbox",
  robots: { index: false, follow: false },
};

type CaseStudy = {
  href: string;
  ariaLabel: string;
  logos: { src: string; alt: string }[];
  title: string;
  tags: string[];
};

const CASE_STUDIES: CaseStudy[] = [
  {
    href: "/rocket-mortgage",
    ariaLabel: "Read Rocket Mortgage case study",
    logos: [
      { src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" },
      { src: "/logos/rocket-assist-full.svg", alt: "Rocket Assist" },
    ],
    title: "Personalizing AI guidance across 6.8M+ client conversations",
    tags: ["B2C Fintech", "AI Assistant", "Trust Design"],
  },
  {
    href: "/tars-asimov",
    ariaLabel: "Read Asimov for Tars case study",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    title: "Designing the agent configuration platform and design system for Asimov as its founding designer",
    tags: ["B2B SaaS", "0→1", "Workflow Design"],
  },
  {
    href: "/tars-debug-mode",
    ariaLabel: "Read Tars Debug Mode case study",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    title: "Designing an internal debugger that cut troubleshooting time by ~70%",
    tags: ["B2B SaaS", "Complex Workflows", "Internal Tools"],
  },
  {
    href: "/salesforce",
    ariaLabel: "Read Salesforce case study",
    logos: [{ src: "/logos/salesforce.svg", alt: "Salesforce" }],
    title: "Designing a 0→1 AI platform for fragmented academic data",
    tags: ["B2B2C", "0→1", "AI Product Design"],
  },
];

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <HomeV2CardLink href={study.href} ariaLabel={study.ariaLabel} className={`cursor-hover-dark ${styles.card}`}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardLogos}>
            {study.logos.map((logo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={logo.src} src={logo.src} alt={logo.alt} />
            ))}
          </div>
          <h3 className={styles.cardTitle}>{study.title}</h3>
        </div>
        <div className={styles.cardTags}>
          {study.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
      {/* Video placeholder */}
      <div className={styles.cardMedia} aria-hidden="true" />
    </HomeV2CardLink>
  );
}

export default function HomeSandboxPage() {
  return (
    <div className={styles.page} style={{ backgroundColor: HOME_V2_PAGE_BG }}>
      <div className={styles.layout}>
        <section className={styles.hero}>
          <ScrollReveal revealOnMount className={styles.intro}>
            <p className={styles.introLead}>
              Hi, I&apos;m <PriyamwadaNameLink />. I design AI and B2B products at early-stage teams,
              usually as the first designer in the room, next to founders and engineers. At Tars I was
              the founding designer on Asimov, an AI agent for Slack, and shipped 5 releases in 5 months.
              I trained as an architect before I moved into product.
            </p>
            <p className={styles.introBody}>
              Outside of work, I tinker and try to build something every now and then to exercise my
              design muscles. You can explore some of my recent experiments{" "}
              <a href="/playground" className={`cursor-hover-pointer ${styles.introLink}`}>here</a>.
            </p>
          </ScrollReveal>

          <ScrollReveal revealOnMount className={styles.current}>
            <p className={styles.currentLabel}>
              <span className={styles.currentDot} aria-hidden="true" />
              <span>
                <strong>Currently</strong> · Product Designer @ Heartland Community Network
              </span>
            </p>
            <AdtuaSnapshot />
          </ScrollReveal>
        </section>

        <section className={styles.work} aria-labelledby="selected-work">
          <h2 id="selected-work" className={styles.sectionLabel}>Selected work</h2>
          {CASE_STUDIES.map((study) => (
            <ScrollReveal key={study.href}>
              <CaseStudyCard study={study} />
            </ScrollReveal>
          ))}
        </section>
      </div>
    </div>
  );
}
