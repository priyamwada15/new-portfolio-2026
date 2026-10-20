import type { ReactNode } from "react";
import Image from "next/image";
import { HOME_V2_PAGE_BG } from "@/design-system";
import { HomeV2CardLink } from "./home-v2/HomeV2CardLink";
import { CardLogos } from "./home-v2/CardLogos";
import { CloudsHero } from "./home-v2/CloudsHero";
import { RocketAssistEmbed } from "./home-v2/RocketAssistEmbed";
import { AsimovKnowledgeEmbed } from "./home-v2/AsimovKnowledgeEmbed";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import styles from "./home-v2/home.module.css";

type CaseStudy = {
  href: string;
  ariaLabel: string;
  logos: { src: string; alt: string; tall?: boolean }[];
  title: string;
  tags: string[];
  /** Solarpunk illustration behind the card, fine-dithered (lossless WebP). The coded UI sits in its calm centre. */
  scene: string;
  /** Coded UI floating on the scene. It sits outside the card link, so its controls aren't nested in the link. */
  embed?: ReactNode;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    href: "/rocket-mortgage",
    ariaLabel: "Read Rocket Mortgage case study",
    logos: [{ src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" }],
    title: "Personalizing AI guidance across 6.8M+ client conversations",
    tags: ["B2C Fintech", "AI Assistant", "Trust Design"],
    scene: "/case-study-scenes/rocket-mortgage-scene.webp",
    embed: <RocketAssistEmbed />,
  },
  {
    href: "/tars-asimov",
    ariaLabel: "Read Asimov for Tars case study",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    title: "Designing the agent configuration platform and design system for Asimov",
    tags: ["B2B SaaS", "0→1", "Workflow Design"],
    scene: "/case-study-scenes/asimov-scene.webp",
    embed: <AsimovKnowledgeEmbed />,
  },
  {
    href: "/tars-debug-mode",
    ariaLabel: "Read TARS debug mode case study",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    title: "Designing an internal debugger that cut troubleshooting time by ~70%",
    tags: ["B2B SaaS", "Complex Workflows", "Internal Tool"],
    scene: "/case-study-scenes/debug-mode-scene.webp",
  },
  // Salesforce is hidden until it's reworked; its page still lives at app/salesforce.
];

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div className={styles.cardWrap}>
      <HomeV2CardLink href={study.href} ariaLabel={`${study.title}. ${study.ariaLabel}`} className={`cursor-hover-dark ${styles.card}`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardMeta}>
            <CardLogos className={styles.cardLogos}>
              {study.logos.map((logo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={logo.src} src={logo.src} alt={logo.alt} className={logo.tall ? styles.logoTall : undefined} />
              ))}
            </CardLogos>
            <p className={styles.cardTags}>{study.tags.join(", ")}</p>
          </div>
          <h3 className={styles.cardTitle}>{study.title}</h3>
        </div>
        <div className={styles.cardMedia} data-card-media>
          {/* Unoptimized: re-encoding would blur the dither dots, so the lossless file is served as is. */}
          <Image src={study.scene} alt="" fill unoptimized className={styles.cardScene} />
        </div>
      </HomeV2CardLink>
      {study.embed}
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
              <CaseStudyCard study={study} />
            </ScrollReveal>
          ))}
        </section>
      </div>
      {/* The gutter pixel trail (home-v2/GutterPixels) is switched off for now. */}
    </div>
  );
}
