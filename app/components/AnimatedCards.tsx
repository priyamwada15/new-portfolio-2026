"use client";

import { ArrowRight, Barbell, DiscoBall, GithubLogo, XLogo } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Tabs,
  TabsHighlight,
  TabsHighlightItem,
  TabsList,
  TabsTrigger,
  useTabs,
} from "@/components/animate-ui/primitives/animate/tabs";
import { LiquidButton } from "./animate-ui/liquid-button";
import { cn } from "@/lib/utils";
import { getHomePlayTabItems, type PlayPortfolioItem } from "@/app/lib/playPortfolio";
import {
  ROCKET_MORTGAGE_CARD_VIDEOS,
  SALESFORCE_HERO_VIDEO,
  TARS_DEBUG_MODE_HERO_VIDEO,
  fontStyle,
  homeCardMediaBgStyle,
  homePlayLinkLabelClass,
  homePlayLinkUnderlineClass,
  homeWorkCardDescriptionClass,
  homeWorkMetaTagStyle,
} from "@/design-system";
import { CursorFollowTooltip } from "@/app/about/CursorFollowTooltip";
import { RocketMortgageTripleVideos } from "@/app/components/RocketMortgageTripleVideos";

const DEFAULT_PLAY_MEDIA_ASPECT = "16 / 9" as const;

/** 12px on mobile, 16px (`rounded-2xl`) from `md` up. */
const CARD_SHELL_RADIUS_CLASS = "rounded-xl md:rounded-2xl";

const playCardButtonClass =
  "group box-border inline-flex shrink-0 cursor-pointer flex-col items-stretch gap-1 no-underline";

type Logo = { src: string; alt: string; cls?: string };

type FeaturedProject = {
  href: string;
  logos: Logo[];
  tagParts: readonly string[];
  description: string;
  innerPanelGapPx: 24 | 32;
  /** Single full-width video below logos. */
  video?: string;
  /** Multiple videos in a horizontal row (e.g. Rocket Mortgage card). */
  videos?: readonly string[];
};

const projects: FeaturedProject[] = [
  {
    href: "/rocket-mortgage",
    logos: [
      { src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" },
      { src: "/logos/rocket-assist-full.svg", alt: "Rocket Assist" },
    ],
    tagParts: ["AI Assistant", "Fintech", "Product Design"],
    description:
      "An AI assistant that guides first-time homebuyers through one of the most stressful purchases of their life. I introduced interaction patterns that made it to the product roadmap.",
    innerPanelGapPx: 32,
    videos: ROCKET_MORTGAGE_CARD_VIDEOS,
  },
  {
    href: "/salesforce",
    logos: [{ src: "/logos/salesforce.svg", alt: "Salesforce", cls: "h-12 w-[68px]" }],
    tagParts: ["AI Planning", "Systems Design", "Product Design"],
    description:
      "A 0→1 AI planning system that helps students figure out what to study and why. I co-led the design and drove information architecture across the product.",
    innerPanelGapPx: 32,
    video: SALESFORCE_HERO_VIDEO,
  },
  {
    href: "/tars-debug-mode",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    tagParts: ["Developer-centric", "Internal tool", "Product Design"],
    description:
      "Designed a debugging feature that tests enterprise AI assistants and stops the moment something breaks. Shipped in a month and it cut manual debugging efforts by 70%.",
    innerPanelGapPx: 32,
    video: TARS_DEBUG_MODE_HERO_VIDEO,
  },
];

const tiltTransition = "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)" as const;

function useTilt(deg: number) {
  const [hovered, setHovered] = useState(false);
  return {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    iconStyle: {
      display: "inline-flex",
      transform: hovered ? `rotate(${deg}deg)` : "rotate(0deg)",
      transition: tiltTransition,
    } as React.CSSProperties,
  };
}

function CaseStudyMetaTagsRow({ parts }: { parts: readonly string[] }) {
  const metaStyle = homeWorkMetaTagStyle;

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      {parts.map((part, i) => (
        <Fragment key={part}>
          {i > 0 ? (
            <span
              className="flex shrink-0 items-center justify-center self-center"
              style={metaStyle}
              aria-hidden
            >
              *
            </span>
          ) : null}
          <span
            className="flex items-center text-center font-normal uppercase"
            style={metaStyle}
          >
            {part}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

const codeTabsShellClass = "relative w-full flex flex-col";

const codeTabsHighlightClass =
  "absolute z-0 inset-0 rounded-none shadow-none bg-transparent after:content-[''] after:absolute after:inset-x-0 after:h-0.5 after:bottom-0 dark:after:bg-white after:bg-black after:rounded-t-full";

const codeTabsListClass =
  "w-full relative flex shrink-0 items-center rounded-none h-10 text-current py-0 px-0 border-0 bg-transparent";

const codeTabsTriggerClass =
  "text-muted-foreground h-full text-sm font-medium data-[state=active]:text-current data-[state=inactive]:cursor-pointer data-[state=active]:cursor-default px-0 flex items-center gap-2";

function CaseStudyTabTriggers() {
  const { activeValue } = useTabs();
  const workTilt = useTilt(8);
  const playTilt = useTilt(-8);
  const workInactive = activeValue !== "work";
  const playInactive = activeValue !== "play";

  return (
    <TabsHighlight className={codeTabsHighlightClass}>
      <TabsList data-slot="case-study-tabs-list" className={codeTabsListClass}>
        <div className="flex gap-4 h-full">
          <TabsHighlightItem value="work" className="flex items-center justify-center">
            <TabsTrigger
              value="work"
              className={codeTabsTriggerClass}
              onMouseEnter={workInactive ? workTilt.onMouseEnter : undefined}
              onMouseLeave={workInactive ? workTilt.onMouseLeave : undefined}
            >
              <span style={workInactive ? workTilt.iconStyle : undefined}>
                <Barbell size={18} weight="regular" className="shrink-0" aria-hidden />
              </span>
              Work
            </TabsTrigger>
          </TabsHighlightItem>
          <TabsHighlightItem value="play" className="flex items-center justify-center">
            <TabsTrigger
              value="play"
              className={codeTabsTriggerClass}
              onMouseEnter={playInactive ? playTilt.onMouseEnter : undefined}
              onMouseLeave={playInactive ? playTilt.onMouseLeave : undefined}
            >
              <span style={playInactive ? playTilt.iconStyle : undefined}>
                <DiscoBall size={18} weight="regular" className="shrink-0" aria-hidden />
              </span>
              Play
            </TabsTrigger>
          </TabsHighlightItem>
        </div>
      </TabsList>
    </TabsHighlight>
  );
}

function PlayProjectCardButton({
  label,
  href,
  ariaLabel,
  className,
  centered = false,
}: {
  label: string;
  href: string;
  ariaLabel: string;
  className?: string;
  /** Mobile stacked row: center label + underline in flex-1 cell */
  centered?: boolean;
}) {
  const internal = href.startsWith("/");
  const buttonClass = cn(
    playCardButtonClass,
    centered && "items-center text-center",
    className,
  );
  const inner = (
    <>
      <span
        className={cn(homePlayLinkLabelClass, centered && "w-full text-center")}
        style={fontStyle.body}
      >
        {label}
      </span>
      <span
        className={cn(homePlayLinkUnderlineClass, centered ? "origin-center" : "origin-left")}
        aria-hidden
      />
    </>
  );

  if (internal) {
    return (
      <Link href={href} className={buttonClass} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={buttonClass}
    >
      {inner}
    </a>
  );
}

function PlayLiquidPillButton({
  href,
  ariaLabel,
  label,
  icon,
  className,
}: {
  href: string;
  ariaLabel: string;
  label: string;
  icon: "github" | "arrow" | "x";
  className?: string;
}) {
  const isExternalHttp = href.startsWith("http");
  const glyph =
    icon === "github" ? (
      <GithubLogo size={18} weight="regular" className="shrink-0" aria-hidden />
    ) : icon === "x" ? (
      <XLogo size={18} weight="regular" className="shrink-0" aria-hidden />
    ) : (
      <ArrowRight size={18} weight="regular" className="shrink-0" aria-hidden />
    );

  const children =
    icon === "arrow" ? (
      <>
        <span>{label}</span>
        {glyph}
      </>
    ) : (
      <>
        {glyph}
        <span>{label}</span>
      </>
    );

  return (
    <LiquidButton
      href={href}
      className={className}
      {...(isExternalHttp
        ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
        : {})}
      hoverScale={1.04}
      tapScale={0.97}
      aria-label={ariaLabel}
    >
      {children}
    </LiquidButton>
  );
}

function PlayGitHubLiquidButton({
  href,
  ariaLabel,
  className,
  label = "View on GitHub",
}: {
  href: string;
  ariaLabel: string;
  className?: string;
  label?: string;
}) {
  return (
    <PlayLiquidPillButton
      href={href}
      ariaLabel={ariaLabel}
      label={label}
      icon="github"
      className={className}
    />
  );
}

function PlayCardActions({
  item,
  layout,
  className,
}: {
  item: PlayPortfolioItem;
  layout: "inline" | "stacked";
  className?: string;
}) {
  const stacked = layout === "stacked";
  const hasAny =
    item.experienceCta != null ||
    item.githubLiquidCta != null ||
    item.filledCta != null;

  if (!hasAny) return null;

  const actionCount =
    (item.githubLiquidCta ? 1 : 0) +
    (item.filledCta ? 1 : 0) +
    (item.experienceCta ? 1 : 0);
  const mobileRow = stacked && actionCount >= 2;
  const childWidthClass = stacked
    ? mobileRow
      ? "min-w-0 flex-1 flex justify-center"
      : "w-full"
    : undefined;
  const textButtonWidthClass = stacked
    ? mobileRow
      ? "min-w-0 w-full flex-1"
      : "w-full"
    : undefined;

  return (
    <div
      className={cn(
        stacked
          ? cn(
              "flex w-full gap-3",
              mobileRow ? "flex-row items-stretch" : "flex-col",
            )
          : "flex shrink-0 flex-row flex-wrap items-center justify-end gap-4",
        className,
      )}
    >
      {item.githubLiquidCta ? (
        <PlayGitHubLiquidButton
          href={item.githubLiquidCta.href}
          ariaLabel={item.githubLiquidCta.ariaLabel}
          label={stacked ? "GitHub" : "View on GitHub"}
          className={childWidthClass}
        />
      ) : null}
      {item.filledCta ? (
        <PlayLiquidPillButton
          href={item.filledCta.href}
          ariaLabel={item.filledCta.ariaLabel}
          label={item.filledCta.label}
          icon={item.filledCta.icon}
          className={childWidthClass}
        />
      ) : null}
      {item.experienceCta ? (
        <PlayProjectCardButton
          label={item.experienceCta.label}
          href={item.experienceCta.href}
          ariaLabel={item.experienceCta.ariaLabel}
          centered={stacked}
          className={cn(textButtonWidthClass, stacked && "justify-center")}
        />
      ) : null}
    </div>
  );
}

function PlayTabAutoVideo({
  videoSrc,
  posterSrc,
  aspectRatio,
  ariaLabel,
  videoLayout = "aspectBox",
  flankImages,
}: {
  videoSrc: string;
  posterSrc?: string;
  aspectRatio: string;
  ariaLabel: string;
  /** `heightFillStart`: parent sets fixed height; video uses full height, intrinsic width, left-aligned. */
  videoLayout?: "aspectBox" | "heightFillStart";
  /** When set with `heightFillStart`, video is centered with a still on each side (same height treatment). */
  flankImages?: {
    left: { src: string; alt: string };
    right: { src: string; alt: string };
  };
}) {
  const { activeValue } = useTabs();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const activeRef = useRef(activeValue);
  activeRef.current = activeValue;

  const syncPlayback = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (activeRef.current === "play" && visibleRef.current) {
      void v.play();
    } else {
      v.pause();
    }
  }, []);

  useEffect(() => {
    activeRef.current = activeValue;
    syncPlayback();
  }, [activeValue, syncPlayback]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.2, rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [syncPlayback]);

  const fillHeight = videoLayout === "heightFillStart";
  const triptych = Boolean(fillHeight && flankImages);

  const flankColClass =
    "relative h-full w-[min(34vw,320px)] shrink-0 overflow-visible max-sm:w-[min(42vw,240px)]";
  const flankImageMotion = "object-contain motion-reduce:scale-100";
  const flankLeftImageClass = cn(
    flankImageMotion,
    "max-sm:scale-[1.2] scale-[1.26] object-right origin-right",
  );
  const flankRightImageClass = cn(
    "motion-reduce:scale-100 max-sm:scale-[1.2] scale-[1.28] object-cover object-left origin-left",
  );
  const triptychVideoClass =
    "h-full w-auto max-h-full shrink-0 object-contain object-center self-center";

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative z-[1] w-full overflow-hidden",
        fillHeight &&
          (triptych
            ? cn(
                "flex h-full min-h-0 items-center justify-center overflow-hidden [transform:translateZ(0)]",
                CARD_SHELL_RADIUS_CLASS,
              )
            : "flex h-full min-h-0 items-stretch justify-start"),
      )}
      style={fillHeight ? undefined : { aspectRatio }}
    >
      {triptych && flankImages ? (
        <>
          <div className={flankColClass}>
            <Image
              src={flankImages.left.src}
              alt={flankImages.left.alt}
              fill
              sizes="(max-width: 640px) 45vw, 320px"
              className={flankLeftImageClass}
            />
          </div>
          <video
            ref={videoRef}
            className={triptychVideoClass}
            src={videoSrc}
            poster={posterSrc}
            playsInline
            muted
            loop
            preload="none"
            aria-label={ariaLabel}
          />
          <div className={flankColClass}>
            <Image
              src={flankImages.right.src}
              alt={flankImages.right.alt}
              fill
              sizes="(max-width: 640px) 45vw, 320px"
              className={flankRightImageClass}
            />
          </div>
        </>
      ) : (
        <video
          ref={videoRef}
          className={
            fillHeight
              ? "h-full w-auto max-h-full shrink-0 object-contain object-left"
              : "absolute inset-0 h-full w-full object-cover"
          }
          src={videoSrc}
          poster={posterSrc}
          playsInline
          muted
          loop
          preload="none"
          aria-label={ariaLabel}
        />
      )}
    </div>
  );
}

function PlayProjectCardMedia({ item }: { item: PlayPortfolioItem }) {
  const aspect = item.mediaAspectRatio ?? DEFAULT_PLAY_MEDIA_ASPECT;

  if (item.embedSrc) {
    return (
      <div
        className="relative z-[1] w-full overflow-hidden"
        style={{ aspectRatio: aspect }}
      >
        <iframe
          src={item.embedSrc}
          title={item.mediaAlt}
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  if (item.imageSrc) {
    return (
      <div
        className="relative z-[1] w-full overflow-hidden"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={item.imageSrc}
          alt={item.mediaAlt}
          fill
          sizes="(max-width: 1008px) 86vw, 1008px"
          className="object-cover object-center"
        />
      </div>
    );
  }

  if (item.videoSrc) {
    const fixedMediaHeight = item.mediaPanelFixedHeightPx != null;
    return (
      <PlayTabAutoVideo
        videoSrc={item.videoSrc}
        posterSrc={item.posterSrc}
        aspectRatio={aspect}
        ariaLabel={item.mediaAlt}
        videoLayout={fixedMediaHeight ? "heightFillStart" : "aspectBox"}
        flankImages={item.mediaFlankImages}
      />
    );
  }

  return null;
}

function PlayProjectCard({ item }: { item: PlayPortfolioItem }) {
  const body = item.homeDescription ?? item.description;
  const hasActions =
    item.experienceCta != null ||
    item.githubLiquidCta != null ||
    item.filledCta != null;
  const hasMedia = Boolean(item.embedSrc || item.videoSrc || item.imageSrc);
  return (
    <div className="flex w-full max-w-[1008px] flex-col items-start gap-6">
      <div className="flex w-full min-w-0 flex-col items-start gap-4">
        <div
          className={cn(
            "flex w-full min-w-0 flex-row items-center gap-4",
            hasActions ? "justify-between" : "justify-start",
          )}
        >
          <div className="min-w-0 flex-1">
            <CaseStudyMetaTagsRow parts={item.tagParts} />
          </div>
          {hasActions ? (
            <PlayCardActions item={item} layout="inline" className="hidden md:flex" />
          ) : null}
        </div>
        <p className={homeWorkCardDescriptionClass} style={fontStyle.body}>
          {body}
        </p>
      </div>

      {hasMedia ? (
        <div
          className={cn(
            "relative w-full min-w-0 overflow-hidden p-0",
            CARD_SHELL_RADIUS_CLASS,
            item.mediaPanelFixedHeightPx != null &&
              "featured-grey-panel min-h-0",
            item.mediaPanelOmitGradient && "isolate [transform:translateZ(0)]",
          )}
          style={
            item.mediaPanelFixedHeightPx != null
              ? { height: item.mediaPanelFixedHeightPx }
              : undefined
          }
        >
          {item.mediaPanelOmitGradient ? null : (
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 z-0",
                CARD_SHELL_RADIUS_CLASS,
              )}
              style={{
                background:
                  "linear-gradient(to right, rgb(233, 233, 233) 0%, rgba(233, 233, 233, 0.2) 100%)",
              }}
            />
          )}
          <div
            className={cn(
              "relative z-[1] h-full min-h-0 w-full overflow-hidden",
              CARD_SHELL_RADIUS_CLASS,
              item.mediaPanelOmitGradient && "[transform:translateZ(0)]",
            )}
          >
            <PlayProjectCardMedia item={item} />
          </div>
        </div>
      ) : null}

      {hasActions ? (
        <PlayCardActions item={item} layout="stacked" className="md:hidden" />
      ) : null}
    </div>
  );
}

export default function AnimatedCards() {
  const [tab, setTab] = useState<"work" | "play">("work");
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabsRevealRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        tabsRevealRef.current?.classList.add("is-visible");
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  useLayoutEffect(() => {
    const applyHash = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash === "#play") {
        setTab("play");
        requestAnimationFrame(() => {
          document.getElementById("play")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    };
    applyHash();
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash === "#play") {
        setTab("play");
        requestAnimationFrame(() => {
          document.getElementById("play")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    wrapperRefs.current.forEach((el) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.disconnect();
          }
        },
        { threshold: 0.08, rootMargin: "-40px 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [tab]);

  const handleTabChange = (v: string) => {
    const next = v as "work" | "play";
    setTab(next);
    if (typeof window === "undefined") return;
    const { pathname, search } = window.location;
    if (next === "play") {
      window.history.replaceState(null, "", `${pathname}${search}#play`);
    } else {
      window.history.replaceState(null, "", `${pathname}${search}`);
    }
  };

  return (
    <section
      id="play"
      className="mx-auto flex w-[86%] max-w-[1008px] flex-col scroll-mt-28"
    >
      <Tabs
        data-slot="case-study-tabs"
        value={tab}
        onValueChange={handleTabChange}
        className={cn(codeTabsShellClass)}
      >
        <div ref={tabsRevealRef} className="card-reveal w-full shrink-0">
          <CaseStudyTabTriggers />
        </div>

        {tab === "work" ? (
          <div className="mt-8 flex flex-col" style={{ gap: "96px" }}>
            {projects.map((project, i) => (
              <div
                key={project.href}
                className="card-reveal"
                ref={(el) => {
                  wrapperRefs.current[i] = el;
                }}
              >
                <Link
                  href={project.href}
                  className="flex w-full max-w-[1008px] cursor-default flex-col items-start gap-6"
                >
                  <div className="flex w-full cursor-default flex-col items-start gap-4">
                    <CaseStudyMetaTagsRow parts={project.tagParts} />
                    <p className={homeWorkCardDescriptionClass} style={fontStyle.body}>
                      {project.description}
                    </p>
                  </div>

                  <CursorFollowTooltip label="Read Case Study">
                  <div
                    className={cn(
                      "featured-grey-panel relative flex h-auto w-full min-w-0 cursor-pointer flex-col overflow-hidden px-4 pt-6 pb-8 sm:px-8 sm:pt-8 md:min-h-[500px]",
                      CARD_SHELL_RADIUS_CLASS,
                      project.videos ? "gap-0" : project.innerPanelGapPx === 32 ? "gap-8" : "gap-6",
                    )}
                  >
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-0 z-0",
                        CARD_SHELL_RADIUS_CLASS,
                      )}
                      style={homeCardMediaBgStyle}
                    />
                    <div
                      className={cn(
                        "relative z-[2] flex shrink-0 flex-row flex-wrap items-center gap-3",
                        project.videos && "mb-[32px]",
                      )}
                    >
                      {project.logos.map((logo) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={logo.alt}
                          src={logo.src}
                          alt={logo.alt}
                          className={`${logo.cls ?? "h-6 w-auto max-h-6"} object-contain`}
                        />
                      ))}
                    </div>
                    {project.videos ? (
                      <RocketMortgageTripleVideos className="relative z-[1]" />
                    ) : project.video ? (
                      <video
                        src={project.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden
                        className="relative z-[1] mt-auto block h-auto w-full"
                      />
                    ) : null}
                  </div>
                  </CursorFollowTooltip>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col" style={{ gap: "96px" }}>
            {getHomePlayTabItems().map((item, i) => (
              <div
                key={item.id}
                className="card-reveal"
                ref={(el) => {
                  wrapperRefs.current[i] = el;
                }}
              >
                <PlayProjectCard item={item} />
              </div>
            ))}
          </div>
        )}
      </Tabs>
    </section>
  );
}
