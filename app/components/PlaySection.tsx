"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { PLAY_SURFACE_BG, PLAY_SURFACE_GRAIN } from "../lib/playSurface";

// ── Design tokens ─────────────────────────────────────────────────────────────

const PLACEHOLDER_BORDER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='rgba(255,255,255,0.18)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`;

const NAV_H   = 80;
const PLAY_SECTION_PAD_TOP_PX = 96;
const PLAY_VIEWPORT_HEIGHT = "100svh";
const PLAY_CONTENT_V_CENTER = `calc(${PLAY_SECTION_PAD_TOP_PX}px + (${PLAY_VIEWPORT_HEIGHT} - ${PLAY_SECTION_PAD_TOP_PX}px) / 2)`;
const NAV_ROW_EDGE_INSET = "calc((100% - min(86%, 1238px)) / 2)";
const GREEN   = "#7DB87A";
const DIVIDER = "rgba(255,255,255,0.08)";
const PLAY_OUTRO_LINKEDIN_HREF = "https://www.linkedin.com/in/priyamwadapandey";
const PLAY_OUTRO_EMAIL_HREF = "mailto:priyamwada.dzn@gmail.com";

// ── Collage images (intro slide) ──────────────────────────────────────────────

const COLLAGE = [
  { src: "/constellation.png", alt: "Constellation",            width: 143, height: 182, left: "calc(50vw - 71.5px)", top: "3.97%"  },
  { src: "/Chess.png",         alt: "Chess project",            width: 136, height: 192, left: "11.25vw",             top: "6.11%",  rotate: "-15.99deg" },
  { src: "/Intelligencer.png", alt: "AI Intelligencer project", width: 165, height: 216, left: "76.875vw",            top: "8.33%",  rotate: "8.79deg",  opacity: 0.9 },
  { src: "/Arduino.png",       alt: "Arduino project",          width: 189, height: 253, left: "7.36vw",              top: "53.61%", rotate: "6.02deg",  opacity: 0.9 },
  { src: "/RMoney Lisa.png",   alt: "RMoney Lisa project",      width: 175, height: 215, left: "76.57vw",             top: "59.62%", rotate: "-11.47deg" },
];

// ── Project data ──────────────────────────────────────────────────────────────

type Status = "SHIPPED" | "PROTOTYPE";

type Project = {
  id: number; status: Status; date: string; title: string; hook: string;
  idea: string; whatIDid: string; whereItGotHard: string;
  workflow: string[]; type: string;
  cta?: string; ctaHref?: string;
  videoSrc?: string;
  /** Live site shown in the left panel (desktop) inside a framed iframe */
  embedSrc?: string;
  /** When this slide is active, left embed uses this fixed height (px). Optional per project. */
  embedPanelHeightPx?: number;
};

const projects: Project[] = [
  {
    id: 1, status: "SHIPPED", date: "03/19/2026",
    title: "Stellar Scan",
    hook: "I wanted to see what shipping end-to-end in one sitting actually felt like.",
    idea: "One sentence into Google Stitch, a retro-futuristic star mapping tool. Enter a date, get the dominant constellation, download a playing card.",
    whatIDid: "Used Stitch for the design system, AI Studio to build. Spent most of the time pulling the tool back, removing things it added, fixing layout, adding the card export myself.",
    whereItGotHard: "The responsive layout. Fix mobile, break web. Fix web, break mobile.",
    workflow: ["Google Stitch", "Google AI Studio", "Vercel"],
    type: "~2 hours · Vibe-coded web app",
    cta: "Open Project", ctaHref: "https://stellar-scan-eta.vercel.app",
    embedSrc: "https://stellar-scan-eta.vercel.app/",
    embedPanelHeightPx: 450,
  },
  {
    id: 2, status: "SHIPPED", date: "03/12/2026",
    title: "AI Intelligencer",
    hook: "I wanted to read AI news without opening twelve tabs.",
    idea: "I kept opening the same five sites every morning to piece together what was happening in AI. At some point it made more sense to just build the thing I wanted to exist.",
    whatIDid: "Designed and built a newspaper-style widget that pulls live AI news into a vintage broadsheet layout. Most of the decisions were getting it to feel like a publication rather than a feed which took longer than the build itself.",
    whereItGotHard: "Retro aesthetics are easy to overdo. A lot of the time went into restraint, removing flourishes that looked interesting but made it feel like a theme rather than a design.",
    workflow: ["Claude"],
    type: "Vibe-coded web app",
    embedSrc: "https://ai-intelligencer.vercel.app/",
  },
  {
    id: 3, status: "PROTOTYPE", date: "04/16/2025",
    title: "Robot Arm Duet",
    hook: "Two robot arms, two laptops, one questionable tune.",
    idea: "Built for an Arduino prototyping class. Two people each control one arm from a laptop touchpad, left, right, up, down. Six switch buttons on a shared board: four piano notes, two drum beats. The idea was that two people who'd never played music together could make something without any prior knowledge required.",
    whatIDid: "Built the entire system across three environments, Arduino handling the hardware, Python bridging the communication and audio output, Processing handling the touch input. This was more about getting the whole system to actually work end to end and it did.",
    whereItGotHard: "Getting three different environments to talk to each other reliably. Any one of them misbehaving broke everything else. Most of the debugging time was figuring out which layer the problem was actually coming from.",
    workflow: ["Arduino IDE", "Python", "Processing"],
    type: "Arduino Prototype",
    videoSrc:
      "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952719/20250416_201134_2_vimbv1.mp4",
  },
];

const TOTAL_SLIDES = projects.length + 2; // intro + projects + outro

// ── Shared text styles ────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-hind), sans-serif",
  fontSize: "10px", fontWeight: 700, letterSpacing: "0.7px",
  textTransform: "uppercase", color: GREEN,
  lineHeight: "1.5", paddingTop: "1px", flexShrink: 0, width: "120px",
};

const bodyTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-hind), sans-serif",
  fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.55)",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const shipped = status === "SHIPPED";
  return (
    <span style={{
      fontFamily: "var(--font-hind), sans-serif", fontSize: "10px", fontWeight: 700,
      letterSpacing: "0.6px", textTransform: "uppercase", padding: "3px 8px",
      borderRadius: "4px",
      backgroundColor: shipped ? "rgba(125,184,122,0.12)" : "rgba(200,160,80,0.12)",
      border: `1px solid ${shipped ? "rgba(125,184,122,0.3)" : "rgba(200,160,80,0.3)"}`,
      color: shipped ? GREEN : "#C8A060",
    }}>
      {status}
    </span>
  );
}

function WorkflowPill({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: "var(--font-hind), sans-serif", fontSize: "10px", fontWeight: 600,
      letterSpacing: "0.5px", textTransform: "uppercase", padding: "4px 10px",
      border: "1px solid rgba(125,184,122,0.3)", color: GREEN,
      borderRadius: "4px", display: "inline-block",
    }}>
      {label}
    </span>
  );
}

function GhostButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-hind), sans-serif", fontSize: "11px",
        letterSpacing: "0.55px", textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)", background: "none", border: "none",
        cursor: "pointer", padding: 0, transition: "color 200ms",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)"; }}
    >
      {label}
    </button>
  );
}

function PlayOutroCopy({ compact }: { compact: boolean }) {
  return (
    <>
      <h1
        style={{
          fontFamily: "var(--font-ovo), serif",
          fontSize: compact ? "28px" : "48px",
          lineHeight: compact ? 1.25 : "55px",
          fontWeight: 400,
          color: "#FAFAFA",
          letterSpacing: "-0.3px",
          margin: 0,
          textAlign: "center",
          textWrap: "balance" as React.CSSProperties["textWrap"],
        }}
      >
        Still here? Perfect.
      </h1>
      <p
        style={{
          fontFamily: "var(--font-hind), sans-serif",
          fontSize: compact ? "14px" : "16px",
          lineHeight: compact ? "22px" : "26px",
          color: "rgba(255,255,255,0.5)",
          margin: 0,
          textAlign: "center",
        }}
      >
        Drop me a note if you want to dig into the work, I&apos;m exploring full-time opportunities.
      </p>
    </>
  );
}

function PlayOutroIconLinks({ iconSize }: { iconSize: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", lineHeight: 0 }}>
      <a href={PLAY_OUTRO_LINKEDIN_HREF} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="play-outro-icon-link">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-linkedin.svg"
          alt=""
          width={iconSize}
          height={iconSize}
          className="play-outro-icon-img"
          style={{ display: "block" }}
        />
      </a>
      <a href={PLAY_OUTRO_EMAIL_HREF} aria-label="Email" className="play-outro-icon-link">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/email-mailbox-close.svg"
          alt=""
          width={iconSize}
          height={iconSize}
          className="play-outro-icon-img"
          style={{ display: "block" }}
        />
      </a>
    </div>
  );
}

/** Muted loop video: plays while intersecting the viewport, pauses when scrolled away. */
function PlayVideoInView({
  src,
  style,
}: {
  src: string;
  style: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: [0, 0.12, 0.25, 0.5], rootMargin: "0px 0px -4px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      style={style}
    />
  );
}

// Arrow nav — visible on all breakpoints (positioned on #play)
function NavArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  const src = direction === "left" ? "/caret-left.svg" : "/caret-right.svg";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="play-arrow"
      style={{
        position: "absolute", [direction]: NAV_ROW_EDGE_INSET, top: PLAY_CONTENT_V_CENTER,
        transform: "translateY(-50%)", zIndex: 10,
        width: "44px", height: "44px", borderRadius: "50%",
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 200ms, opacity 200ms", flexShrink: 0, padding: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "rgba(255,255,255,0.12)";
        const img = el.querySelector("img");
        if (img) img.style.opacity = "0.95";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "rgba(255,255,255,0.06)";
        const img = el.querySelector("img");
        if (img) img.style.opacity = "0.55";
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={20}
        height={20}
        style={{
          display: "block",
          opacity: 0.55,
          filter: "invert(1)",
          transition: "opacity 200ms",
        }}
      />
    </button>
  );
}

// ── Scroll lock helpers ───────────────────────────────────────────────────────

function lockScroll()   { document.documentElement.style.overflowY = "hidden"; }
function unlockScroll() { document.documentElement.style.overflowY = "";       }

// ── Main component ────────────────────────────────────────────────────────────

export default function PlaySection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const currentRef  = useRef(0);
  const cooldownRef = useRef(false);
  const rightContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileHScrollRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);
  /** Desktop: cap video height to the details column height on the active slide (video projects only) */
  const [videoDetailCapPx, setVideoDetailCapPx] = useState<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    currentRef.current = index;
    setCurrent(index);
    if (index === TOTAL_SLIDES - 1) {
      unlockScroll();
    } else {
      const section = sectionRef.current;
      if (section) {
        const { top, bottom } = section.getBoundingClientRect();
        if (top < window.innerHeight && bottom > 0) lockScroll();
      }
    }
  }, []);

  // Nav theme + scroll lock (page scroll toward section)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const emit = (theme: "dark" | "light") =>
      window.dispatchEvent(new CustomEvent("nav-theme", { detail: theme }));
    const check = () => {
      const { top, bottom } = section.getBoundingClientRect();
      emit(top <= NAV_H && bottom > NAV_H ? "dark" : "light");
      if (window.innerWidth >= 768) {
        if (top <= 0 && bottom > 0 && currentRef.current !== TOTAL_SLIDES - 1) lockScroll();
        else if (top > 0 || bottom <= 0) unlockScroll();
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => { window.removeEventListener("scroll", check); emit("light"); unlockScroll(); };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goToSlide(Math.min(currentRef.current + 1, TOTAL_SLIDES - 1)); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goToSlide(Math.max(currentRef.current - 1, 0)); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToSlide]);

  // Trackpad horizontal swipe — only intercepts deltaX > deltaY
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (cooldownRef.current) return;
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 600);
      if (e.deltaX > 20) goToSlide(Math.min(currentRef.current + 1, TOTAL_SLIDES - 1));
      else if (e.deltaX < -20) goToSlide(Math.max(currentRef.current - 1, 0));
    };
    section.addEventListener("wheel", onWheel, { passive: false });
    return () => section.removeEventListener("wheel", onWheel);
  }, [goToSlide]);

  // Match active project video max-height to the details column (desktop)
  useEffect(() => {
    let cancelled = false;
    let ro: ResizeObserver | null = null;
    let measure: (() => void) | null = null;

    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      const idx = current - 1;
      if (idx < 0 || idx >= projects.length || !projects[idx].videoSrc) {
        setVideoDetailCapPx(null);
        return;
      }
      const el = rightContentRefs.current[idx];
      if (!el) {
        setVideoDetailCapPx(null);
        return;
      }
      measure = () => {
        if (cancelled) return;
        const h = el.scrollHeight;
        const cap = Math.max(200, window.innerHeight - 120);
        setVideoDetailCapPx(Math.min(h, cap));
      };
      measure();
      ro = new ResizeObserver(() => measure?.());
      ro.observe(el);
      window.addEventListener("resize", measure);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      ro?.disconnect();
      if (measure) window.removeEventListener("resize", measure);
    };
  }, [current]);

  // Keep mobile snap-scroller aligned when `current` changes (arrows / keyboard)
  useEffect(() => {
    const el = mobileHScrollRef.current;
    if (!el) return;
    const run = () => {
      if (window.innerWidth >= 768) return;
      const vw = el.clientWidth;
      const mobileLast = projects.length;
      const idx = Math.min(current, mobileLast);
      el.scrollTo({ left: idx * vw, behavior: "smooth" });
    };
    run();
    window.addEventListener("resize", run);
    return () => window.removeEventListener("resize", run);
  }, [current]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section
      id="play"
      ref={sectionRef}
      style={{ position: "relative", height: PLAY_VIEWPORT_HEIGHT, backgroundColor: PLAY_SURFACE_BG }}
    >
      {/* Grain */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          backgroundImage: PLAY_SURFACE_GRAIN, backgroundRepeat: "repeat", backgroundSize: "200px 200px",
          opacity: 0.07, pointerEvents: "none", zIndex: 1,
        }}
      />

      {/* ── Desktop: CSS transform carousel ──────────────────────────────────
          Outer div clips adjacent slides. Track translates to show current.
          Images are inside slide 0 — they physically slide away with the track,
          producing the natural horizontal slide the opacity overlay could not. */}
      <div
        className="hidden md:block"
        style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden", paddingTop: `${PLAY_SECTION_PAD_TOP_PX}px` }}
      >
        <div
          style={{
            display: "flex", height: "100%",
            width: `calc(${TOTAL_SLIDES} * 100vw)`,
            transform: `translateX(calc(-1 * ${current} * 100vw))`,
            transition: "transform 600ms cubic-bezier(0.23, 1, 0.32, 1)",
            willChange: "transform",
          }}
        >
          {/* ── Slide 0: Intro ──────────────────────────────────────────────── */}
          <div
            style={{
              width: "100vw",
              height: "100%",
              flexShrink: 0,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Collage images — absolutely placed within the slide */}
            {COLLAGE.map((img) => (
              <div
                key={img.src}
                style={{
                  position: "absolute", left: img.left, top: img.top,
                  width: img.width, height: img.height,
                  transform: img.rotate ? `rotate(${img.rotate})` : undefined,
                  opacity: img.opacity ?? 1,
                  pointerEvents: "none", userSelect: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src} alt={img.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px", display: "block" }}
                />
              </div>
            ))}

            {/* Centered text */}
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translateX(-50%) translateY(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "24px", width: "560px", maxWidth: "72vw", textAlign: "center",
            }}>
              <h1 style={{
                fontFamily: "var(--font-ovo), serif", fontSize: "48px",
                lineHeight: "55px", fontWeight: 400, color: "#FAFAFA",
                letterSpacing: "-0.3px", textWrap: "balance" as React.CSSProperties["textWrap"],
              }}>
                Ideas I couldn&apos;t stop thinking about.
              </h1>
              <p style={{
                fontFamily: "var(--font-hind), sans-serif", fontSize: "16px",
                lineHeight: "26px", color: "rgba(255,255,255,0.5)",
              }}>
                This is where I work without guardrails. Design-to-execution tools,
                Arduino experiments, and interface ideas that came to me while waiting at the bus stop.
              </p>
              <GhostButton label="Explore" onClick={() => goToSlide(1)} />
            </div>
          </div>

          {/* ── Project slides ───────────────────────────────────────────────── */}
          {projects.map((project, i) => {
            const isActiveProjectSlide = current === i + 1;
            const fixedEmbedPx =
              project.embedPanelHeightPx != null && isActiveProjectSlide
                ? project.embedPanelHeightPx
                : null;

            return (
            <div
              key={project.id}
              style={{
                width: "100vw",
                height: "100%",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              {/* Vertically center the whole row (visual + divider + copy) in the viewport */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                    columnGap: "clamp(24px, 4vw, 56px)",
                    alignItems: "stretch",
                    width: "min(1180px, calc(100vw - 96px))",
                    maxWidth: "100%",
                    margin: "0 auto",
                    maxHeight: "100%",
                  }}
                >
              {/* Left: visual */}
              <div
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px",
                }}
              >
                {project.videoSrc ? (
                  <PlayVideoInView
                    src={project.videoSrc}
                    style={{
                      width: "100%",
                      maxWidth: "480px",
                      maxHeight:
                        isActiveProjectSlide && videoDetailCapPx != null
                          ? `${videoDetailCapPx}px`
                          : `calc(${PLAY_VIEWPORT_HEIGHT} - 96px)`,
                      borderRadius: "20px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : project.embedSrc ? (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "480px",
                      flexShrink: 0,
                      ...(fixedEmbedPx != null
                        ? {
                            height: fixedEmbedPx,
                            display: "flex",
                            flexDirection: "column",
                            minHeight: 0,
                          }
                        : {
                            aspectRatio: "4 / 3",
                            maxHeight: `calc(${PLAY_VIEWPORT_HEIGHT} - 96px)`,
                          }),
                      borderRadius: "20px",
                      overflow: "hidden",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <iframe
                      src={project.embedSrc}
                      title={`${project.title} — live preview`}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{
                        width: "100%",
                        border: "none",
                        display: "block",
                        ...(fixedEmbedPx != null
                          ? { flex: 1, minHeight: 0 }
                          : { height: "100%" }),
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: "100%", maxWidth: "480px", aspectRatio: "4/3",
                    backgroundImage: PLACEHOLDER_BORDER,
                    backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "20px",
                  }} />
                )}
              </div>

              {/* Right panel — copy block centered in column when column is taller than content */}
              <div style={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "28px 96px 28px 36px",
                overflow: "hidden",
                minHeight: 0,
              }}>
                <div
                  ref={(el) => {
                    rightContentRefs.current[i] = el;
                  }}
                >
                  {/* Status + date */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <StatusBadge status={project.status} />
                    <span style={{ fontFamily: "var(--font-hind), sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                      {project.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "var(--font-ovo), serif",
                    fontSize: "clamp(20px, 1.8vw, 26px)", lineHeight: 1.25,
                    fontWeight: 400, color: "#FAFAFA", marginBottom: "6px",
                    textWrap: "balance" as React.CSSProperties["textWrap"],
                  }}>
                    {project.title}
                  </h2>

                  {/* Hook */}
                  <p style={{
                    fontFamily: "var(--font-hind), sans-serif", fontSize: "13px",
                    lineHeight: "20px", color: "rgba(255,255,255,0.4)", marginBottom: "20px",
                  }}>
                    {project.hook}
                  </p>

                  {/* Rows */}
                  <div style={{ borderTop: `1px solid ${DIVIDER}` }}>
                    <div style={{ display: "flex", gap: "20px", padding: "11px 0", borderBottom: `1px solid ${DIVIDER}` }}>
                      <span style={labelStyle}>The Idea</span>
                      <p style={bodyTextStyle}>{project.idea}</p>
                    </div>
                    <div style={{ display: "flex", gap: "20px", padding: "11px 0", borderBottom: `1px solid ${DIVIDER}` }}>
                      <span style={labelStyle}>What I Did</span>
                      <p style={bodyTextStyle}>{project.whatIDid}</p>
                    </div>
                    <div style={{ display: "flex", gap: "20px", padding: "11px 0", borderBottom: `1px solid ${DIVIDER}` }}>
                      <span style={labelStyle}>Where It Got Hard</span>
                      <p style={bodyTextStyle}>{project.whereItGotHard}</p>
                    </div>
                    <div style={{ display: "flex", gap: "20px", padding: "11px 0" }}>
                      <span style={labelStyle}>Workflow</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {project.workflow.map((tool) => <WorkflowPill key={tool} label={tool} />)}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "28px" }}>
                    <span style={{ fontFamily: "var(--font-hind), sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
                      {project.type}
                    </span>
                    {project.ctaHref && (
                      <a
                        href={project.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "var(--font-hind), sans-serif", fontSize: "11px",
                          fontWeight: 600, letterSpacing: "0.6px", textTransform: "uppercase",
                          color: GREEN, textDecoration: "none",
                        }}
                      >
                        {project.cta}
                      </a>
                    )}
                  </div>

                  {/* Progress dots */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    {projects.map((_, j) => (
                      <button
                        key={j}
                        onClick={() => goToSlide(j + 1)}
                        aria-label={`Go to project ${j + 1}`}
                        style={{
                          width: j === i ? "24px" : "8px", height: "2px",
                          backgroundColor: j === i ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)",
                          border: "none", borderRadius: "9999px", cursor: "pointer", padding: 0,
                          transition: "width 300ms cubic-bezier(0.23,1,0.32,1), background-color 300ms",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
            );
          })}

          {/* ── Outro slide ──────────────────────────────────────────────────── */}
          <div style={{
            width: "100vw", height: "100%", flexShrink: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px",
          }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "24px", width: "560px", maxWidth: "72vw", textAlign: "center",
            }}>
              <PlayOutroCopy compact={false} />
              <PlayOutroIconLinks iconSize={40} />
            </div>
            <GhostButton label="Start over" onClick={() => goToSlide(0)} />
          </div>
        </div>
      </div>

      {/* Arrow navigation (desktop + mobile) */}
      {current > 0 && <NavArrow direction="left" onClick={() => goToSlide(current - 1)} />}
      {current < TOTAL_SLIDES - 1 && <NavArrow direction="right" onClick={() => goToSlide(current + 1)} />}

      {/* ── Mobile: full-width horizontal snap carousel ────────────────────── */}
      <div
        ref={mobileHScrollRef}
        className="flex md:hidden h-full overflow-x-auto overflow-y-hidden play-hscroll"
        style={{
          position: "relative",
          zIndex: 2,
          scrollSnapType: "x mandatory",
          paddingTop: `${PLAY_SECTION_PAD_TOP_PX}px`,
          height: `calc(${PLAY_VIEWPORT_HEIGHT} - ${PLAY_SECTION_PAD_TOP_PX}px)`,
        } as React.CSSProperties}
      >
        <div
          className="shrink-0 h-full flex flex-col items-center justify-center"
          style={{ width: "100vw", padding: "32px 24px", gap: "20px", scrollSnapAlign: "start" } as React.CSSProperties}
        >
          <h1 style={{ fontFamily: "var(--font-ovo), serif", fontSize: "28px", lineHeight: 1.25, fontWeight: 400, color: "#FAFAFA", textAlign: "center", textWrap: "balance" as React.CSSProperties["textWrap"] }}>
            Ideas I couldn&apos;t stop thinking about.
          </h1>
          <p style={{ fontFamily: "var(--font-hind), sans-serif", fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
            Experiments, Arduino builds, and interface ideas that got out of hand.
          </p>
          <p style={{ fontFamily: "var(--font-hind), sans-serif", fontSize: "11px", letterSpacing: "0.55px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
            → Swipe to explore
          </p>
        </div>

        {projects.map((project) => (
          <div
            key={project.id}
            className="shrink-0 h-full flex flex-col justify-center min-h-0 overflow-y-auto"
            style={{ width: "100vw", padding: "28px 96px 28px 24px", gap: "10px", scrollSnapAlign: "start", scrollbarWidth: "none" } as React.CSSProperties}
          >
            {project.videoSrc ? (
              <div
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  marginBottom: "10px",
                  maxHeight: "min(48dvh, 420px)",
                }}
              >
                <PlayVideoInView
                  src={project.videoSrc}
                  style={{
                    width: "100%",
                    maxHeight: "min(48dvh, 420px)",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ) : project.embedSrc ? (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  maxHeight: "min(52dvh, 400px)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  marginBottom: "10px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                <iframe
                  src={project.embedSrc}
                  title={`${project.title} — preview`}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  maxHeight: "min(40dvh, 280px)",
                  marginBottom: "10px",
                  backgroundImage: PLACEHOLDER_BORDER,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: "16px",
                }}
              />
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" }}>
              <StatusBadge status={project.status} />
              <span style={{ fontFamily: "var(--font-hind), sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{project.date}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-ovo), serif", fontSize: "20px", lineHeight: 1.3, fontWeight: 400, color: "#FAFAFA", textWrap: "balance" as React.CSSProperties["textWrap"] }}>
              {project.title}
            </h2>
            <p style={{ fontFamily: "var(--font-hind), sans-serif", fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.4)" }}>{project.hook}</p>
            <div style={{ borderTop: `1px solid ${DIVIDER}`, marginTop: "6px" }}>
              <div style={{ padding: "10px 0", borderBottom: `1px solid ${DIVIDER}` }}>
                <p style={{ ...labelStyle, width: "auto", marginBottom: "4px" }}>The Idea</p>
                <p style={{ ...bodyTextStyle, fontSize: "13px", lineHeight: "20px" }}>{project.idea}</p>
              </div>
              <div style={{ padding: "10px 0" }}>
                <p style={{ ...labelStyle, width: "auto", marginBottom: "6px" }}>Workflow</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {project.workflow.map((t) => <WorkflowPill key={t} label={t} />)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div
          className="shrink-0 h-full flex flex-col items-center justify-center"
          style={{ width: "100vw", padding: "32px 24px", gap: "24px", scrollSnapAlign: "start" } as React.CSSProperties}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <PlayOutroCopy compact />
            <PlayOutroIconLinks iconSize={36} />
          </div>
          <GhostButton label="Start over" onClick={() => goToSlide(0)} />
        </div>
      </div>

      <style>{`
        .play-hscroll::-webkit-scrollbar { display: none; }
        .play-arrow { display: flex; }
        .play-outro-icon-link {
          display: flex;
          line-height: 0;
          transition: opacity 180ms ease, transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
          transform: translateZ(0);
        }
        .play-outro-icon-img {
          filter: brightness(0) invert(1);
          opacity: 0.82;
          transition: opacity 180ms ease, filter 180ms ease;
        }
        .play-outro-icon-link:hover {
          opacity: 1;
          transform: scale(0.96);
        }
        .play-outro-icon-link:hover .play-outro-icon-img {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
