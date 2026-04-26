"use client";

import { useRef, useEffect, useCallback, useState } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────

const PLACEHOLDER_BORDER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='rgba(255,255,255,0.18)' stroke-width='1.5' stroke-dasharray='8 8' stroke-linecap='round'/%3E%3C/svg%3E")`;

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

const NAV_H   = 80;
const GREEN   = "#7DB87A";
const DIVIDER = "rgba(255,255,255,0.08)";

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
  },
  {
    id: 2, status: "SHIPPED", date: "03/18/2026",
    title: "Six Pieces. Six Design Truths.",
    hook: "I picked up chess and kept seeing design in it.",
    idea: "The more I learned chess the more I kept mapping each piece to something I think about at work. The king's single-step constraint felt like user goals. The knight's unpredictable movement felt like edge cases. At some point I stopped taking notes and started building.",
    whatIDid: "Built a six-card carousel where one chess piece is one design principle, one honest connection between them. Spent more time on the writing than the build. The checkerboard background was the last thing I added and probably the decision I'm most happy with.",
    whereItGotHard: "Writing the connections without them feeling forced. Some pieces mapped naturally. Others took a few attempts to find an angle that was actually true.",
    workflow: ["Claude", "Framer Code Component"],
    type: "Vibe-coded widget",
  },
  {
    id: 3, status: "SHIPPED", date: "03/12/2026",
    title: "AI Intelligencer",
    hook: "I wanted to read AI news without opening twelve tabs.",
    idea: "I kept opening the same five sites every morning to piece together what was happening in AI. At some point it made more sense to just build the thing I wanted to exist.",
    whatIDid: "Designed and built a newspaper-style widget that pulls live AI news into a vintage broadsheet layout. Most of the decisions were getting it to feel like a publication rather than a feed which took longer than the build itself.",
    whereItGotHard: "Retro aesthetics are easy to overdo. A lot of the time went into restraint, removing flourishes that looked interesting but made it feel like a theme rather than a design.",
    workflow: ["Claude", "Framer Code Component"],
    type: "Vibe-coded web app",
    embedSrc: "https://ai-intelligencer.vercel.app/",
  },
  {
    id: 4, status: "PROTOTYPE", date: "04/16/2025",
    title: "Robot Arm Duet",
    hook: "Two robot arms, two laptops, one questionable tune.",
    idea: "Built for an Arduino prototyping class. Two people each control one arm from a laptop touchpad, left, right, up, down. Six switch buttons on a shared board: four piano notes, two drum beats. The idea was that two people who'd never played music together could make something without any prior knowledge required.",
    whatIDid: "Built the entire system across three environments, Arduino handling the hardware, Python bridging the communication and audio output, Processing handling the touch input. This was more about getting the whole system to actually work end to end and it did.",
    whereItGotHard: "Getting three different environments to talk to each other reliably. Any one of them misbehaving broke everything else. Most of the debugging time was figuring out which layer the problem was actually coming from.",
    workflow: ["Arduino IDE", "Python", "Processing"],
    type: "Arduino Prototype",
    videoSrc: "/robot-arm-duet.mp4",
  },
];

const TOTAL_SLIDES = projects.length + 2; // intro + 4 projects + outro

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

// Arrow nav — desktop only via .play-arrow class
function NavArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="play-arrow"
      style={{
        position: "absolute", [direction]: "20px", top: "50%",
        transform: "translateY(-50%)", zIndex: 10,
        width: "44px", height: "44px", borderRadius: "50%",
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.45)", cursor: "pointer",
        alignItems: "center", justifyContent: "center",
        fontSize: "18px", transition: "background 200ms, color 200ms", flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "rgba(255,255,255,0.12)";
        el.style.color = "rgba(255,255,255,0.8)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "rgba(255,255,255,0.06)";
        el.style.color = "rgba(255,255,255,0.45)";
      }}
    >
      {direction === "left" ? "←" : "→"}
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

  const [current, setCurrent] = useState(0);

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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section
      id="play"
      ref={sectionRef}
      style={{ position: "relative", height: "100dvh", backgroundColor: "#111111" }}
    >
      {/* Grain */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "200px 200px",
          opacity: 0.07, pointerEvents: "none", zIndex: 1,
        }}
      />

      {/* ── Desktop: CSS transform carousel ──────────────────────────────────
          Outer div clips adjacent slides. Track translates to show current.
          Images are inside slide 0 — they physically slide away with the track,
          producing the natural horizontal slide the opacity overlay could not. */}
      <div
        className="hidden md:block"
        style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden" }}
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
          <div style={{ width: "100vw", height: "100%", flexShrink: 0, position: "relative" }}>
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
              <GhostButton label="→ Explore" onClick={() => goToSlide(1)} />
            </div>
          </div>

          {/* ── Project slides ───────────────────────────────────────────────── */}
          {projects.map((project, i) => (
            <div
              key={project.id}
              style={{ width: "100vw", height: "100%", flexShrink: 0, display: "flex", alignItems: "stretch" }}
            >
              {/* Left: visual */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
                {project.videoSrc ? (
                  <video
                    src={project.videoSrc}
                    autoPlay muted loop playsInline
                    style={{
                      width: "100%", maxWidth: "480px",
                      maxHeight: "calc(100dvh - 96px)",
                      borderRadius: "20px", objectFit: "cover", display: "block",
                    }}
                  />
                ) : project.embedSrc ? (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "480px",
                      aspectRatio: "4 / 3",
                      maxHeight: "calc(100dvh - 96px)",
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
                        height: "100%",
                        border: "none",
                        display: "block",
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

              {/* Divider */}
              <div style={{ width: "1px", flexShrink: 0, backgroundColor: DIVIDER }} />

              {/* Right panel — vertically centered */}
              <div style={{
                flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "28px 36px", overflow: "hidden",
              }}>
                <div>
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
          ))}

          {/* ── Outro slide ──────────────────────────────────────────────────── */}
          <div style={{
            width: "100vw", height: "100%", flexShrink: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px",
          }}>
            <h1 style={{
              fontFamily: "var(--font-ovo), serif", fontSize: "48px", lineHeight: "55px",
              fontWeight: 400, color: "#FAFAFA", letterSpacing: "-0.3px", textAlign: "center",
              textWrap: "balance" as React.CSSProperties["textWrap"], maxWidth: "560px",
            }}>
              Ideas I couldn&apos;t stop thinking about.
            </h1>
            <GhostButton label="← Start over" onClick={() => goToSlide(0)} />
          </div>
        </div>
      </div>

      {/* Desktop arrow navigation */}
      {current > 0 && <NavArrow direction="left" onClick={() => goToSlide(current - 1)} />}
      {current < TOTAL_SLIDES - 1 && <NavArrow direction="right" onClick={() => goToSlide(current + 1)} />}

      {/* ── Mobile: full-width horizontal snap carousel ────────────────────── */}
      <div
        className="flex md:hidden h-full overflow-x-auto overflow-y-hidden play-hscroll"
        style={{ position: "relative", zIndex: 2, scrollSnapType: "x mandatory" } as React.CSSProperties}
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
            className="shrink-0 h-full flex flex-col justify-start"
            style={{ width: "100vw", padding: "28px 24px", gap: "10px", scrollSnapAlign: "start", overflowY: "auto", scrollbarWidth: "none" } as React.CSSProperties}
          >
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
      </div>

      <style>{`
        .play-hscroll::-webkit-scrollbar { display: none; }
        .play-arrow { display: none; }
        @media (min-width: 768px) { .play-arrow { display: flex; } }
      `}</style>
    </section>
  );
}
