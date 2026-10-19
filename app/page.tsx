import Image from "next/image";
import { HOME_V2_PAGE_BG } from "@/design-system";
import { HomeV2CardLink } from "./home-v2/HomeV2CardLink";
import { CardLogos } from "./home-v2/CardLogos";
import { PriyamwadaNameLink } from "./home-v2/PriyamwadaNameLink";
import { HcnCube } from "./home-v2/HcnCube";
import { FunThingsLink } from "./home-v2/FunThingsLink";
import { GutterPixels } from "./home-v2/GutterPixels";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { SiteAnchor } from "@/app/components/SiteLink";
import styles from "./home-v2/home.module.css";

type CaseStudy = {
  href: string;
  ariaLabel: string;
  logos: { src: string; alt: string; tall?: boolean }[];
  title: string;
  tags: string[];
  /** Solarpunk illustration behind the card, fine-dithered (lossless WebP). The coded UI will sit in its calm centre. */
  scene: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    href: "/rocket-mortgage",
    ariaLabel: "Read Rocket Mortgage case study",
    logos: [{ src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" }],
    title: "Personalizing AI guidance across 6.8M+ client conversations",
    tags: ["B2C Fintech", "AI Assistant", "Trust Design"],
    scene: "/case-study-scenes/rocket-mortgage-scene.webp",
  },
  {
    href: "/tars-asimov",
    ariaLabel: "Read Asimov for Tars case study",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    title: "Designing the agent configuration platform and design system for Asimov",
    tags: ["B2B SaaS", "0→1", "Workflow Design"],
    scene: "/case-study-scenes/asimov-scene.webp",
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
      <div className={styles.cardMedia}>
        {/* Unoptimized: re-encoding would blur the dither dots, so the lossless file is served as is. */}
        <Image src={study.scene} alt="" fill unoptimized className={styles.cardScene} />
      </div>
    </HomeV2CardLink>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page} style={{ backgroundColor: HOME_V2_PAGE_BG }}>
      <div className={styles.layout}>
        <section className={styles.hero}>
          <div className={`${styles.intro} ${styles.heroIn}`} data-pixel-block>
            <p className={styles.introPara}>
              Hi, I&apos;m <PriyamwadaNameLink hoverPreview />. I design AI and B2B products for early-stage teams,
              usually as the first designer in the room.
            </p>
            <p className={styles.introPara}>
              Outside of work, I build{" "}
              <FunThingsLink className={`cursor-hover-pointer ${styles.introLink}`} />.
              You can explore some of my recent experiments{" "}
              <SiteAnchor href="/playground" className={`cursor-hover-pointer ${styles.introLink}`}>here</SiteAnchor>.
            </p>
            <p className={styles.currentLabel}>
              <HcnCube />
              <span>
                Currently · <span className={styles.currentRole}>Product Designer @ Heartland Community Network</span>
              </span>
            </p>
          </div>
          {/* The Adtua snapshot card (AdtuaSnapshot) is off the homepage for now; it'll move to a "currently working on" section. */}
        </section>

        <section className={styles.work} aria-label="Case studies" data-pixel-blocks>
          {CASE_STUDIES.map((study) => (
            <ScrollReveal key={study.href}>
              <CaseStudyCard study={study} />
            </ScrollReveal>
          ))}
        </section>
      </div>
      <GutterPixels />
    </div>
  );
}
