"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const projects = [
  {
    href: "/rocket-mortgage",
    logos: [
      { src: "/logos/rocket-mortgage.svg", alt: "Rocket Mortgage" },
      { src: "/logos/rocket-assist-full.svg", alt: "Rocket Assist" },
    ],
    tags: "AI Assistant · Fintech · Product Design",
    description:
      "An AI assistant that guides first-time homebuyers through one of the most stressful purchases of their life. I introduced interaction patterns that made it to the product roadmap.",
    image: "/rm-hero.avif",
  },
  {
    href: "/tars-debug-mode",
    logos: [{ src: "/logos/tars.svg", alt: "TARS" }],
    tags: "B2B SaaS · Workflow Tooling · Product Design",
    description:
      "An internal tool that automatically runs enterprise chatbots end-to-end and stops the moment something breaks. I shipped it in a month and it cut the debugging time by 50%.",
    image: "/Debug%20Hero%20Image.png",
  },
  {
    href: "/salesforce",
    logos: [
      { src: "/logos/salesforce.svg", alt: "Salesforce", cls: "h-12" },
      { src: "/logos/indiana-university.svg", alt: "Indiana University" },
    ],
    tags: "AI Planning · Systems Design · Product Design",
    description:
      "A 0→1 AI planning system that helps students figure out what to study and why. I co-led the design and drove information architecture across the product.",
    image: "/Salesforce%20Hero%20Image.png",
  },
];

const CARD_BORDER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23E6E6E6' stroke-width='1.5' stroke-dasharray='8 8' stroke-linecap='round'/%3E%3C/svg%3E\")";

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
      className="flex flex-col w-[86%] max-w-[1238px] mx-auto"
      style={{ gap: "96px" }}
    >
      {projects.map((project, i) => (
        <div
          key={i}
          className="card-reveal"
          ref={(el) => {
            wrapperRefs.current[i] = el;
          }}
        >
          <Link
            href={project.href}
            className="project-card-link group block rounded-[24px]"
          >
            <div
              className="overflow-hidden rounded-[24px]"
              style={{
                backgroundColor: "#FBFBFB",
                padding: "40px",
                backgroundImage: CARD_BORDER,
              }}
            >
              {/* Card header: logos left, tags right */}
              <div className="flex flex-col gap-3 mb-16 md:flex-row md:items-start md:justify-between md:gap-y-0">
                <div className="flex items-center gap-3">
                  {project.logos.map((logo) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={logo.alt}
                      src={logo.src}
                      alt={logo.alt}
                      className={`${logo.cls ?? "h-6"} w-auto max-w-[120px] object-contain`}
                    />
                  ))}
                </div>
                <span
                  className="text-[12px] uppercase text-[#111111]"
                  style={{ fontFamily: "var(--font-hind), sans-serif", opacity: 0.7 }}
                >
                  {project.tags}
                </span>
              </div>

              {/* Description */}
              <div className="flex justify-center mb-10">
                <p
                  className="text-center text-[#555555] leading-relaxed"
                  style={{
                    fontFamily: "var(--font-hind), sans-serif",
                    fontSize: "20px",
                    maxWidth: "800px",
                  }}
                >
                  {project.description}
                </p>
              </div>

              {/* Visual */}
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt=""
                  className="card-video w-full rounded-2xl"
                  style={{
                    display: "block",
                    transition: "transform 500ms cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                />
              ) : (
                <div
                  className="card-video w-full rounded-2xl"
                  style={{
                    height: "500px",
                    transition: "transform 500ms cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                />
              )}
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
}
