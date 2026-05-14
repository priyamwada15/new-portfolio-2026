"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

type Logo = { src: string; alt: string; cls?: string };

type FeaturedProject = {
  href: string;
  logos: Logo[];
  tagParts: readonly string[];
  description: string;
  image: string;
  /** Gap (px) between logo row and hero image inside the grey panel */
  innerPanelGapPx: 24 | 32;
  /** Salesforce: round top corners of hero only (bottom corners square). */
  heroImageCorners?: "top";
  /** Padding (px) inside the hero clip (optional; e.g. other cards). */
  heroImageInsetPx?: number;
  /** Hover scale on the hero; default 1.03 in CSS (Tars / Debug uses 1.02 for comparison). */
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

/** Meta row: uppercase tags + * separators, Figtree 10/12, #555555 */
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

export default function AnimatedCards() {
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  }, []);

  return (
    <section
      className="mx-auto flex w-[86%] max-w-[1008px] flex-col"
      style={{ gap: "96px" }}
    >
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
    </section>
  );
}
