import type { ReactNode } from "react";
import {
  ASIMOV_HERO_VIDEO,
  HOME_V2_PAGE_BG,
  SALESFORCE_HERO_VIDEO,
  TARS_DEBUG_MODE_HERO_VIDEO,
  croppedVideoStyles,
  type CroppedVideo,
} from "@/design-system";
import { HomeV2CardLink } from "./home-v2/HomeV2CardLink";
import { PriyamwadaNameLink } from "./home-v2/PriyamwadaNameLink";
import { LazyVideo } from "./home-v2/LazyVideo";
import { AdtuaSnapshot } from "./home-v2/AdtuaSnapshot";
import { HcnCube } from "./home-v2/HcnCube";
import { FunThingsLink } from "./home-v2/FunThingsLink";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { RocketMortgageTripleVideos } from "@/app/components/RocketMortgageTripleVideos";
import styles from "./home-v2/home.module.css";

/** A screen recording cropped to its app window and fitted to the card's height. */
function CroppedCardVideo({ video, ariaLabel, rounded }: { video: CroppedVideo; ariaLabel: string; rounded?: boolean }) {
  const crop = croppedVideoStyles(video);
  return (
    <div className={styles.mediaCrop}>
      <div className={rounded ? styles.cropRounded : undefined} style={{ ...crop.frame, height: "100%" }}>
        <LazyVideo src={video.src} poster={video.poster} ariaLabel={ariaLabel} style={crop.video} />
      </div>
    </div>
  );
}

type CaseStudy = {
  href: string;
  ariaLabel: string;
  logos: { src: string; alt: string; tall?: boolean }[];
  title: string;
  tags: string[];
  media: ReactNode;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    href: "/tars-asimov",
    ariaLabel: "Read Asimov for Tars case study",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    title: "Designing the agent configuration platform and design system for Asimov as its founding designer",
    tags: ["B2B SaaS", "0→1", "Workflow Design"],
    media: <CroppedCardVideo video={ASIMOV_HERO_VIDEO} ariaLabel="Asimov for Tars preview video" rounded />,
  },
  {
    href: "/rocket-mortgage",
    ariaLabel: "Read Rocket Mortgage case study",
    logos: [
      { src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" },
      { src: "/logos/rocket-assist-full.svg", alt: "Rocket Assist" },
    ],
    title: "Personalizing AI guidance across 6.8M+ client conversations",
    tags: ["B2C Fintech", "AI Assistant", "Trust Design"],
    media: (
      <div className={styles.mediaTriple}>
        <RocketMortgageTripleVideos className="h-full aspect-auto sm:aspect-auto" />
      </div>
    ),
  },
  {
    href: "/tars-debug-mode",
    ariaLabel: "Read TARS debug mode case study",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    title: "Designing an internal debugger that cut troubleshooting time by ~70%",
    tags: ["B2B SaaS", "Complex Workflows", "Internal Tool"],
    media: <CroppedCardVideo video={TARS_DEBUG_MODE_HERO_VIDEO} ariaLabel="Tars Debug Mode preview video" />,
  },
  {
    href: "/salesforce",
    ariaLabel: "Read Salesforce case study",
    logos: [{ src: "/logos/salesforce.svg", alt: "Salesforce", tall: true }],
    title: "Designing a 0→1 AI platform for fragmented academic data",
    tags: ["B2B2C", "0→1", "AI Product Design"],
    media: (
      <div className={styles.mediaInset}>
        <LazyVideo
          src={SALESFORCE_HERO_VIDEO}
          poster="/Salesforce Poster.avif"
          ariaLabel="Salesforce case study preview video"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    ),
  },
];

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <HomeV2CardLink href={study.href} ariaLabel={study.ariaLabel} className={`cursor-hover-dark ${styles.card}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <div className={styles.cardLogos}>
            {study.logos.map((logo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={logo.src} src={logo.src} alt={logo.alt} className={logo.tall ? styles.logoTall : undefined} />
            ))}
          </div>
          <div className={styles.tags}>
            {study.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
        <h3 className={styles.cardTitle}>{study.title}</h3>
      </div>
      <div className={styles.cardMedia}>{study.media}</div>
    </HomeV2CardLink>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page} style={{ backgroundColor: HOME_V2_PAGE_BG }}>
      <div className={styles.layout}>
        <section className={styles.hero}>
          <div className={`${styles.intro} ${styles.heroIn}`}>
            <p className={styles.introPara}>
              Hi, I&apos;m <PriyamwadaNameLink hoverPreview />. I design AI and B2B products for early-stage teams,
              usually as the first designer in the room.
            </p>
            <p className={styles.introPara}>
              Outside of work, I build{" "}
              <FunThingsLink className={`cursor-hover-pointer ${styles.introLink}`} />.
              You can explore some of my recent experiments{" "}
              <a href="/playground" className={`cursor-hover-pointer ${styles.introLink}`}>here</a>.
            </p>
            <p className={styles.currentLabel}>
              <HcnCube />
              <span>
                Currently · <span className={styles.currentRole}>Product Designer @ Heartland Community Network</span>
              </span>
            </p>
          </div>

          <div className={`${styles.heroIn} ${styles.heroInDelayed}`}>
            <AdtuaSnapshot />
          </div>
        </section>

        <section className={styles.work} aria-label="Case studies">
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
