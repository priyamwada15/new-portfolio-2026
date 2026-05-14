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

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

const DEFAULT_PLAY_MEDIA_ASPECT = "16 / 9" as const;

const playCardButtonClass =
  "group box-border inline-flex shrink-0 cursor-pointer flex-col items-stretch gap-1 no-underline";

type Logo = { src: string; alt: string; cls?: string };

type FeaturedProject = {
  href: string;
  logos: Logo[];
  tagParts: readonly string[];
  description: string;
  image: string;
  innerPanelGapPx: 24 | 32;
  heroImageCorners?: "top";
  heroImageInsetPx?: number;
  heroHoverScale?: number;
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
    image: "/New%20Rocket%20Case%20Study%20Card.png",
    innerPanelGapPx: 24,
  },
  {
    href: "/tars-debug-mode",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    tagParts: ["Developer-centric", "Internal tool", "Product Design"],
    description:
      "An internal tool that automatically runs enterprise chatbots end-to-end and stops the moment something breaks. I shipped it in a month and it cut the debugging time by 50%.",
    image: "/Debug%20new%20case%20study%20image.png?v=2",
    innerPanelGapPx: 32,
    heroHoverScale: 1.02,
  },
  {
    href: "/salesforce",
    logos: [{ src: "/logos/salesforce.svg", alt: "Salesforce", cls: "h-12 w-[68px]" }],
    tagParts: ["AI Planning", "Systems Design", "Product Design"],
    description:
      "A 0→1 AI planning system that helps students figure out what to study and why. I co-led the design and drove information architecture across the product.",
    image: "/Salesforce%20new%20case%20study%20image.png?v=1",
    innerPanelGapPx: 32,
    heroImageCorners: "top",
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
  const metaStyle = {
    ...figtree,
    color: "#555555",
    fontSize: "10px",
    lineHeight: "12px",
  } as const;

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
}: {
  label: string;
  href: string;
  ariaLabel: string;
}) {
  const internal = href.startsWith("/");
  const inner = (
    <>
      <span
        className="font-medium text-[14px] leading-[17px] text-[#333333]"
        style={figtree}
      >
        {label}
      </span>
      <span
        className="h-px w-full origin-left scale-x-0 bg-[#333333] transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-100"
        aria-hidden
      />
    </>
  );

  if (internal) {
    return (
      <Link href={href} className={playCardButtonClass} aria-label={ariaLabel}>
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
      className={playCardButtonClass}
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
}: {
  href: string;
  ariaLabel: string;
  label: string;
  icon: "github" | "arrow" | "x";
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

function PlayGitHubLiquidButton({ href, ariaLabel }: { href: string; ariaLabel: string }) {
  return (
    <PlayLiquidPillButton
      href={href}
      ariaLabel={ariaLabel}
      label="View on GitHub"
      icon="github"
    />
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
  /** Pivot at inboard edge so scale grows toward the video and closes the gutter. */
  const flankLeftImageClass = cn(
    flankImageMotion,
    "max-sm:scale-[1.2] scale-[1.26] object-right origin-right"
  );
  const flankRightImageClass = cn(
    "motion-reduce:scale-100 max-sm:scale-[1.2] scale-[1.28] object-cover object-left origin-left"
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
            ? "flex h-full min-h-0 items-center justify-center overflow-hidden rounded-2xl [transform:translateZ(0)]"
            : "flex h-full min-h-0 items-stretch justify-start")
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
          className="object-cover"
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
  const hasRight =
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
            hasRight ? "justify-between" : "justify-start"
          )}
        >
          <div className="min-w-0 flex-1">
            <CaseStudyMetaTagsRow parts={item.tagParts} />
          </div>
          {hasRight ? (
            <div className="flex shrink-0 flex-row flex-wrap items-center justify-end gap-4">
              {item.githubLiquidCta ? (
                <PlayGitHubLiquidButton
                  href={item.githubLiquidCta.href}
                  ariaLabel={item.githubLiquidCta.ariaLabel}
                />
              ) : null}
              {item.filledCta ? (
                <PlayLiquidPillButton
                  href={item.filledCta.href}
                  ariaLabel={item.filledCta.ariaLabel}
                  label={item.filledCta.label}
                  icon={item.filledCta.icon}
                />
              ) : null}
              {item.experienceCta ? (
                <PlayProjectCardButton
                  label={item.experienceCta.label}
                  href={item.experienceCta.href}
                  ariaLabel={item.experienceCta.ariaLabel}
                />
              ) : null}
            </div>
          ) : null}
        </div>
        <p
          className="w-full cursor-default text-base font-normal"
          style={{ ...figtree, color: "#333333", lineHeight: "150%" }}
        >
          {body}
        </p>
      </div>

      {hasMedia ? (
        <div
          className={cn(
            "relative w-full min-w-0 overflow-hidden rounded-2xl p-0",
            item.mediaPanelFixedHeightPx != null &&
              "featured-grey-panel min-h-0",
            item.mediaPanelOmitGradient && "isolate [transform:translateZ(0)]"
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
              className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(to right, rgb(233, 233, 233) 0%, rgba(233, 233, 233, 0.2) 100%)",
              }}
            />
          )}
          {item.mediaPanelOmitGradient ? (
            <div className="relative z-[1] h-full min-h-0 w-full overflow-hidden rounded-2xl [transform:translateZ(0)]">
              <PlayProjectCardMedia item={item} />
            </div>
          ) : (
            <PlayProjectCardMedia item={item} />
          )}
        </div>
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
                    <p
                      className="w-full text-base font-normal"
                      style={{ ...figtree, color: "#333333", lineHeight: "150%" }}
                    >
                      {project.description}
                    </p>
                  </div>

                  <div
                    className="featured-grey-panel relative flex h-[500px] w-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl px-8 pt-8 pb-0"
                    style={{
                      gap: project.innerPanelGapPx,
                      ...(project.heroHoverScale != null
                        ? { "--featured-hero-hover-scale": String(project.heroHoverScale) }
                        : {}),
                    }}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
                      style={{
                        background:
                          "linear-gradient(to right, rgb(233, 233, 233) 0%, rgba(233, 233, 233, 0.2) 100%)",
                      }}
                    />
                    <div className="relative z-[2] flex shrink-0 flex-row items-center gap-3">
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
                    <div
                      className="relative z-[1] min-h-0 w-full flex-1 overflow-visible"
                      style={
                        project.heroImageInsetPx != null
                          ? { padding: project.heroImageInsetPx }
                          : undefined
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt=""
                        className={
                          project.heroImageCorners === "top"
                            ? "featured-case-hero-img h-full w-full rounded-t-2xl object-cover object-top"
                            : "featured-case-hero-img h-full w-full object-cover object-top"
                        }
                      />
                    </div>
                  </div>
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
