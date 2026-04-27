"use client";

import { useRef, useEffect, useCallback, useState } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────

const PLACEHOLDER_BORDER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='rgba(255,255,255,0.18)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`;

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

const NAV_H   = 80;
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
  const iconFill = "rgba(255,255,255,0.5)";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", lineHeight: 0 }}>
      <a href={PLAY_OUTRO_LINKEDIN_HREF} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="play-outro-icon-link">
        <svg width={iconSize} height={iconSize} viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M20.875 5.875H7.125C6.79348 5.875 6.47554 6.0067 6.24112 6.24112C6.0067 6.47554 5.875 6.79348 5.875 7.125V20.875C5.875 21.2065 6.0067 21.5245 6.24112 21.7589C6.47554 21.9933 6.79348 22.125 7.125 22.125H20.875C21.2065 22.125 21.5245 21.9933 21.7589 21.7589C21.9933 21.5245 22.125 21.2065 22.125 20.875V7.125C22.125 6.79348 21.9933 6.47554 21.7589 6.24112C21.5245 6.0067 21.2065 5.875 20.875 5.875ZM11.5 17.75C11.5 17.9158 11.4342 18.0747 11.3169 18.1919C11.1997 18.3092 11.0408 18.375 10.875 18.375C10.7092 18.375 10.5503 18.3092 10.4331 18.1919C10.3158 18.0747 10.25 17.9158 10.25 17.75V12.75C10.25 12.5842 10.3158 12.4253 10.4331 12.3081C10.5503 12.1908 10.7092 12.125 10.875 12.125C11.0408 12.125 11.1997 12.1908 11.3169 12.3081C11.4342 12.4253 11.5 12.5842 11.5 12.75V17.75ZM10.875 11.5C10.6896 11.5 10.5083 11.445 10.3542 11.342C10.2 11.239 10.0798 11.0926 10.0089 10.9213C9.93791 10.75 9.91934 10.5615 9.95551 10.3796C9.99169 10.1977 10.081 10.0307 10.2121 9.89959C10.3432 9.76848 10.5102 9.67919 10.6921 9.64301C10.874 9.60684 11.0625 9.62541 11.2338 9.69636C11.4051 9.76732 11.5515 9.88748 11.6545 10.0417C11.7575 10.1958 11.8125 10.3771 11.8125 10.5625C11.8125 10.8111 11.7137 11.0496 11.5379 11.2254C11.3621 11.4012 11.1236 11.5 10.875 11.5ZM18.375 17.75C18.375 17.9158 18.3092 18.0747 18.1919 18.1919C18.0747 18.3092 17.9158 18.375 17.75 18.375C17.5842 18.375 17.4253 18.3092 17.3081 18.1919C17.1908 18.0747 17.125 17.9158 17.125 17.75V14.9375C17.125 14.5231 16.9604 14.1257 16.6674 13.8326C16.3743 13.5396 15.9769 13.375 15.5625 13.375C15.1481 13.375 14.7507 13.5396 14.4576 13.8326C14.1646 14.1257 14 14.5231 14 14.9375V17.75C14 17.9158 13.9342 18.0747 13.8169 18.1919C13.6997 18.3092 13.5408 18.375 13.375 18.375C13.2092 18.375 13.0503 18.3092 12.9331 18.1919C12.8158 18.0747 12.75 17.9158 12.75 17.75V12.75C12.7508 12.5969 12.8077 12.4494 12.91 12.3355C13.0123 12.2216 13.1529 12.1492 13.305 12.1321C13.4571 12.115 13.6102 12.1542 13.7353 12.2425C13.8604 12.3308 13.9488 12.4619 13.9836 12.6109C14.4064 12.3241 14.8993 12.1579 15.4095 12.1301C15.9196 12.1023 16.4277 12.214 16.8792 12.4532C17.3306 12.6924 17.7084 13.05 17.972 13.4877C18.2355 13.9254 18.3748 14.4266 18.375 14.9375V17.75Z" fill={iconFill} />
        </svg>
      </a>
      <a href={PLAY_OUTRO_EMAIL_HREF} aria-label="Email" className="play-outro-icon-link">
        <svg width={iconSize} height={iconSize} viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M12.125 15.875C12.125 16.0408 12.0592 16.1997 11.9419 16.3169C11.8247 16.4342 11.6658 16.5 11.5 16.5H8.375C8.20924 16.5 8.05027 16.4342 7.93306 16.3169C7.81585 16.1997 7.75 16.0408 7.75 15.875C7.75 15.7092 7.81585 15.5503 7.93306 15.4331C8.05027 15.3158 8.20924 15.25 8.375 15.25H11.5C11.6658 15.25 11.8247 15.3158 11.9419 15.4331C12.0592 15.5503 12.125 15.7092 12.125 15.875ZM17.125 6.5H19C19.1658 6.5 19.3247 6.43415 19.4419 6.31694C19.5592 6.19973 19.625 6.04076 19.625 5.875C19.625 5.70924 19.5592 5.55027 19.4419 5.43306C19.3247 5.31585 19.1658 5.25 19 5.25H16.5C16.3342 5.25 16.1753 5.31585 16.0581 5.43306C15.9408 5.55027 15.875 5.70924 15.875 5.875V8.375H17.125V6.5ZM22.75 13.0625V17.75C22.75 18.0815 22.6183 18.3995 22.3839 18.6339C22.1495 18.8683 21.8315 19 21.5 19H14.625V21.5C14.625 21.6658 14.5592 21.8247 14.4419 21.9419C14.3247 22.0592 14.1658 22.125 14 22.125C13.8342 22.125 13.6753 22.0592 13.5581 21.9419C13.4408 21.8247 13.375 21.6658 13.375 21.5V19H6.5C6.16848 19 5.85054 18.8683 5.61612 18.6339C5.3817 18.3995 5.25 18.0815 5.25 17.75V13.0625C5.25145 11.8197 5.74577 10.6283 6.62454 9.74954C7.5033 8.87077 8.69474 8.37645 9.9375 8.375H15.875V15.25C15.875 15.4158 15.9408 15.5747 16.0581 15.6919C16.1753 15.8092 16.3342 15.875 16.5 15.875C16.6658 15.875 16.8247 15.8092 16.9419 15.6919C17.0592 15.5747 17.125 15.4158 17.125 15.25V8.375H18.0625C19.3053 8.37645 20.4967 8.87077 21.3755 9.74954C22.2542 10.6283 22.7486 11.8197 22.75 13.0625ZM13.375 13.0625C13.375 12.1508 13.0128 11.2765 12.3682 10.6318C11.7235 9.98716 10.8492 9.625 9.9375 9.625C9.02582 9.625 8.15148 9.98716 7.50682 10.6318C6.86216 11.2765 6.5 12.1508 6.5 13.0625V17.75H13.375V13.0625Z" fill={iconFill} />
        </svg>
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
        position: "absolute", [direction]: "20px", top: "50%",
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
                          : "calc(100dvh - 96px)",
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
                            maxHeight: "calc(100dvh - 96px)",
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
          transition: opacity 180ms ease, transform 180ms ease;
          transform: translateZ(0);
        }
        .play-outro-icon-link:hover {
          opacity: 0.7;
          transform: scale(1.03);
        }
      `}</style>
    </section>
  );
}
