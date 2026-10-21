import type { ReactNode } from "react";
import { HOME_V2_PAGE_BG } from "@/design-system";
import { HomeV2CardLink } from "./home-v2/HomeV2CardLink";
import { CompanyLogos } from "./home-v2/CompanyLogos";
import { CloudsHero } from "./home-v2/CloudsHero";
import { RocketAssistEmbed } from "./home-v2/RocketAssistEmbed";
import { AsimovKnowledgeEmbed } from "./home-v2/AsimovKnowledgeEmbed";
import { DebugModeEmbed } from "./home-v2/DebugModeEmbed";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { backdropStyle, CASE_BACKDROPS, type CaseBackdrop } from "@/app/components/caseBackdrop";
import backdrop from "@/app/components/CaseBackdrop.module.css";
import styles from "./home-v2/home.module.css";

type CaseStudy = {
  href: string;
  ariaLabel: string;
  logos: { src: string; alt: string }[];
  title: string;
  /** Where the backdrop's olive centre sits and how far its rose reaches, varied a little per card */
  backdrop: CaseBackdrop;
  /** Coded UI floating on the card. It sits outside the card link, so its controls aren't nested in the link. */
  embed: ReactNode;
};

const ROCKET = [{ src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" }];
const TARS = [{ src: "/logos/tars.svg", alt: "Tars" }];

// Salesforce is hidden until it's reworked; its page still lives at app/salesforce.
const CASE_STUDIES: CaseStudy[] = [
  {
    href: "/rocket-mortgage",
    ariaLabel: "Read Rocket Mortgage case study",
    logos: ROCKET,
    title: "Personalizing AI guidance across 6.8M+ client conversations",
    backdrop: CASE_BACKDROPS.rocket,
    embed: <RocketAssistEmbed />,
  },
  {
    href: "/tars-asimov",
    ariaLabel: "Read Asimov for Tars case study",
    logos: TARS,
    title: "Designing the agent configuration platform and design system for Asimov",
    backdrop: CASE_BACKDROPS.asimov,
    embed: <AsimovKnowledgeEmbed />,
  },
  {
    href: "/tars-debug-mode",
    ariaLabel: "Read Tars Debug Mode case study",
    logos: TARS,
    title: "Designing an internal debugger that cut troubleshooting time by ~70%",
    backdrop: CASE_BACKDROPS.debugMode,
    embed: <DebugModeEmbed />,
  },
];

/** One case study: logo, title, then the card with its coded demo. The whole case study is the link. */
function CaseStudyRow({ study }: { study: CaseStudy }) {
  return (
    <div className={styles.row} data-study-row>
      <HomeV2CardLink href={study.href} ariaLabel={`${study.title}. ${study.ariaLabel}`} className={`cursor-hover-dark ${styles.card}`}>
        <div className={styles.cardText}>
          <CompanyLogos className={styles.cardLogos}>
            {study.logos.map((logo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={logo.src} src={logo.src} alt={logo.alt} />
            ))}
          </CompanyLogos>
          <h3 className={styles.cardTitle}>{study.title}</h3>
        </div>
        {/* Olive and rose backdrop for the coded UI */}
        <div
          className={`${styles.cardMedia} ${backdrop.backdrop}`}
          data-card-media
          style={backdropStyle(study.backdrop)}
        />
      </HomeV2CardLink>
      <div className={styles.embed}>{study.embed}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page} style={{ backgroundColor: HOME_V2_PAGE_BG }}>
      <CloudsHero />
      {/* The Adtua snapshot card (AdtuaSnapshot) is off the homepage for now; it'll move to a "currently working on" section. */}
      <div className={styles.layout}>
        <section id="work" className={styles.work} aria-label="Case studies" data-pixel-blocks>
          {CASE_STUDIES.map((study) => (
            <ScrollReveal key={study.href}>
              <CaseStudyRow study={study} />
            </ScrollReveal>
          ))}
        </section>
      </div>
      {/* The gutter pixel trail (home-v2/GutterPixels) is switched off for now. */}
    </div>
  );
}
