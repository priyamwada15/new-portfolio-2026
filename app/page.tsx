import type { ReactNode } from "react";
import {
  ASIMOV_HERO_VIDEO,
  HOME_V2_PAGE_BG,
  TARS_DEBUG_MODE_HERO_VIDEO,
  croppedVideoStyles,
  type CroppedVideo,
} from "@/design-system";
import { HomeV2CardLink } from "./home-v2/HomeV2CardLink";
import { CompanyLogos } from "./home-v2/CompanyLogos";
import { PriyamwadaNameLink } from "./home-v2/PriyamwadaNameLink";
import { LazyVideo } from "./home-v2/LazyVideo";
import { AdtuaSnapshot } from "./home-v2/AdtuaSnapshot";
import { HcnCube } from "./home-v2/HcnCube";
import { FunThingsLink } from "./home-v2/FunThingsLink";
import { GutterPixels } from "./home-v2/GutterPixels";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { RocketMortgageTripleVideos } from "@/app/components/RocketMortgageTripleVideos";
import { SiteAnchor } from "@/app/components/SiteLink";
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
  title: string;
  outcome: string;
  tags: string[];
  media: ReactNode;
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
        media: (
          <div className={styles.mediaTriple}>
            <RocketMortgageTripleVideos className="h-full aspect-auto sm:aspect-auto" />
          </div>
        ),
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
        media: <CroppedCardVideo video={ASIMOV_HERO_VIDEO} ariaLabel="Asimov for Tars preview video" rounded />,
      },
      {
        href: "/tars-debug-mode",
        ariaLabel: "Read Tars Debug Mode case study",
        title: "Designing an internal debugger that cut troubleshooting time by ~70%",
        outcome: "One place for the CS team and developers to see where an agent's flow broke, and why.",
        tags: ["B2B SaaS", "Complex Workflows", "Internal Tool"],
        media: <CroppedCardVideo video={TARS_DEBUG_MODE_HERO_VIDEO} ariaLabel="Tars Debug Mode preview video" />,
      },
    ],
  },
];

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <HomeV2CardLink href={study.href} ariaLabel={`${study.title}. ${study.ariaLabel}`} className={`cursor-hover-dark ${styles.card}`}>
      <div className={styles.cardMedia}>{study.media}</div>
      <div className={styles.cardText}>
        <h4 className={styles.cardTitle}>{study.title}</h4>
        <p className={styles.cardOutcome}>{study.outcome}</p>
        <div className={styles.tags}>
          {study.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </HomeV2CardLink>
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

          <div className={`${styles.heroIn} ${styles.heroInDelayed} ${styles.adtuaSlot}`} data-pixel-block>
            <ScrollReveal>
              <AdtuaSnapshot />
            </ScrollReveal>
          </div>
        </section>

        <section className={styles.work} aria-label="Case studies" data-pixel-blocks>
          {COMPANIES.map((company) => (
            <CompanyGroup key={company.name} company={company} />
          ))}
        </section>
      </div>
      <GutterPixels />
    </div>
  );
}
