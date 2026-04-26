"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────

const CUTTING_MAT: React.CSSProperties = {
  backgroundColor: "#2C4A22",
  backgroundImage: [
    "repeating-linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
    "repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "44px 44px",
};

const PLACEHOLDER_BORDER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='rgba(255,255,255,0.18)' stroke-width='1.5' stroke-dasharray='8 8' stroke-linecap='round'/%3E%3C/svg%3E")`;

// Fixed footer height — used to shrink the content area so nothing hides behind it
const FOOTER_H = 60;

// ── Data ──────────────────────────────────────────────────────────────────────

const projects = [
  {
    id: 1,
    date: "Mar 19, 2026",
    title: "I wanted to look at the stars. I built a scanner instead.",
    body: "A constellation scanner built to explore what physical computing can do when you point it at the sky.",
    tags: ["Arduino", "Physical Computing"],
  },
  {
    id: 2,
    date: "Mar 18, 2026",
    title: "I picked up chess. It started talking back about design.",
    body: "Six pieces. Six design truths. The King is the user goal. The Queen is range — the ability to move across constraints. The Rook is foundational systems. The Bishop is specialization. The Knight is non-linear problem solving. The Pawn is learning.",
    tags: ["Design Thinking", "Framer"],
  },
  {
    id: 3,
    date: "Mar 12, 2026",
    title: "I wanted to read AI news without opening twelve tabs.",
    body: "A newspaper-style AI widget that aggregates and surfaces what matters — built as a personal tool that got out of hand.",
    tags: ["AI", "Interface Design"],
  },
  {
    id: 4,
    date: "Apr 16, 2025",
    title: "Two robot arms. One questionable tune.",
    body: "An Arduino experiment in coordinated motion. The goal was a duet. The result was closer to jazz — unpredictable but interesting.",
    tags: ["Arduino", "Physical Prototyping"],
  },
];

const TOTAL_SLIDES = projects.length + 2;

// ── Sub-components ────────────────────────────────────────────────────────────

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5"
      style={{
        border: "1px solid rgba(255,255,255,0.15)",
        backgroundColor: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.45)",
        borderRadius: "4px",
      }}
    >
      {children}
    </span>
  );
}

function SocialLinks() {
  const iconFill = "rgba(255,255,255,0.55)";
  return (
    <div className="flex items-center gap-3">
      <a href="https://x.com/PriymwadaPandey" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:opacity-60 transition-opacity">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M20.6722 20.6758C20.6184 20.7738 20.5392 20.8556 20.443 20.9126C20.3469 20.9696 20.2371 20.9998 20.1253 21H16.3753C16.2701 21 16.1666 20.9734 16.0745 20.9227C15.9823 20.8721 15.9044 20.7989 15.848 20.7102L12.6847 15.7391L8.0878 20.7953C7.97574 20.9157 7.82075 20.987 7.65643 20.9939C7.49211 21.0008 7.33171 20.9426 7.21 20.832C7.08829 20.7214 7.01508 20.5673 7.00625 20.403C6.99741 20.2388 7.05366 20.0777 7.1628 19.9547L11.9886 14.6422L7.09796 6.96094C7.03773 6.86644 7.00401 6.75749 7.00034 6.64548C6.99666 6.53348 7.02317 6.42255 7.07708 6.32431C7.131 6.22607 7.21033 6.14413 7.30678 6.08708C7.40323 6.03002 7.51324 5.99995 7.6253 6H11.3753C11.4805 6.00003 11.584 6.02661 11.6762 6.07728C11.7683 6.12795 11.8462 6.20106 11.9026 6.28984L15.0659 11.2609L19.6628 6.20469C19.7749 6.08431 19.9299 6.01296 20.0942 6.00609C20.2585 5.99923 20.4189 6.0574 20.5406 6.16801C20.6623 6.27862 20.7355 6.43275 20.7444 6.59697C20.7532 6.7612 20.6969 6.92228 20.5878 7.04531L15.762 12.3539L20.6526 20.0398C20.7125 20.1344 20.746 20.2433 20.7494 20.3551C20.7528 20.467 20.7262 20.5777 20.6722 20.6758Z" fill={iconFill} />
        </svg>
      </a>
      <a href="https://www.linkedin.com/in/priyamwadapandey" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-60 transition-opacity">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M20.875 5.875H7.125C6.79348 5.875 6.47554 6.0067 6.24112 6.24112C6.0067 6.47554 5.875 6.79348 5.875 7.125V20.875C5.875 21.2065 6.0067 21.5245 6.24112 21.7589C6.47554 21.9933 6.79348 22.125 7.125 22.125H20.875C21.2065 22.125 21.5245 21.9933 21.7589 21.7589C21.9933 21.5245 22.125 21.2065 22.125 20.875V7.125C22.125 6.79348 21.9933 6.47554 21.7589 6.24112C21.5245 6.0067 21.2065 5.875 20.875 5.875ZM11.5 17.75C11.5 17.9158 11.4342 18.0747 11.3169 18.1919C11.1997 18.3092 11.0408 18.375 10.875 18.375C10.7092 18.375 10.5503 18.3092 10.4331 18.1919C10.3158 18.0747 10.25 17.9158 10.25 17.75V12.75C10.25 12.5842 10.3158 12.4253 10.4331 12.3081C10.5503 12.1908 10.7092 12.125 10.875 12.125C11.0408 12.125 11.1997 12.1908 11.3169 12.3081C11.4342 12.4253 11.5 12.5842 11.5 12.75V17.75ZM10.875 11.5C10.6896 11.5 10.5083 11.445 10.3542 11.342C10.2 11.239 10.0798 11.0926 10.0089 10.9213C9.93791 10.75 9.91934 10.5615 9.95551 10.3796C9.99169 10.1977 10.081 10.0307 10.2121 9.89959C10.3432 9.76848 10.5102 9.67919 10.6921 9.64301C10.874 9.60684 11.0625 9.62541 11.2338 9.69636C11.4051 9.76732 11.5515 9.88748 11.6545 10.0417C11.7575 10.1958 11.8125 10.3771 11.8125 10.5625C11.8125 10.8111 11.7137 11.0496 11.5379 11.2254C11.3621 11.4012 11.1236 11.5 10.875 11.5ZM18.375 17.75C18.375 17.9158 18.3092 18.0747 18.1919 18.1919C18.0747 18.3092 17.9158 18.375 17.75 18.375C17.5842 18.375 17.4253 18.3092 17.3081 18.1919C17.1908 18.0747 17.125 17.9158 17.125 17.75V14.9375C17.125 14.5231 16.9604 14.1257 16.6674 13.8326C16.3743 13.5396 15.9769 13.375 15.5625 13.375C15.1481 13.375 14.7507 13.5396 14.4576 13.8326C14.1646 14.1257 14 14.5231 14 14.9375V17.75C14 17.9158 13.9342 18.0747 13.8169 18.1919C13.6997 18.3092 13.5408 18.375 13.375 18.375C13.2092 18.375 13.0503 18.3092 12.9331 18.1919C12.8158 18.0747 12.75 17.9158 12.75 17.75V12.75C12.7508 12.5969 12.8077 12.4494 12.91 12.3355C13.0123 12.2216 13.1529 12.1492 13.305 12.1321C13.4571 12.115 13.6102 12.1542 13.7353 12.2425C13.8604 12.3308 13.9488 12.4619 13.9836 12.6109C14.4064 12.3241 14.8993 12.1579 15.4095 12.1301C15.9196 12.1023 16.4277 12.214 16.8792 12.4532C17.3306 12.6924 17.7084 13.05 17.972 13.4877C18.2355 13.9254 18.3748 14.4266 18.375 14.9375V17.75Z" fill={iconFill} />
        </svg>
      </a>
      <a href="https://github.com/priyamwada15" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:opacity-60 transition-opacity">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M20.875 12.125V12.75C20.8737 13.8075 20.4898 14.8288 19.7942 15.6254C19.0986 16.4219 18.1383 16.9399 17.0906 17.0836C17.5183 17.6308 17.7504 18.3055 17.75 19V22.125C17.75 22.2908 17.6842 22.4497 17.5669 22.567C17.4497 22.6842 17.2908 22.75 17.125 22.75H12.125C11.9592 22.75 11.8003 22.6842 11.6831 22.567C11.5658 22.4497 11.5 22.2908 11.5 22.125V20.875H9.625C8.7962 20.875 8.00134 20.5458 7.41529 19.9597C6.82924 19.3737 6.5 18.5788 6.5 17.75C6.5 17.2527 6.30246 16.7758 5.95083 16.4242C5.59919 16.0726 5.12228 15.875 4.625 15.875C4.45924 15.875 4.30027 15.8092 4.18306 15.692C4.06585 15.5747 4 15.4158 4 15.25C4 15.0842 4.06585 14.9253 4.18306 14.8081C4.30027 14.6909 4.45924 14.625 4.625 14.625C5.03538 14.625 5.44174 14.7058 5.82089 14.8629C6.20003 15.0199 6.54453 15.2501 6.83471 15.5403C7.12489 15.8305 7.35508 16.175 7.51212 16.5541C7.66917 16.9333 7.75 17.3396 7.75 17.75C7.75 18.2473 7.94754 18.7242 8.29917 19.0758C8.65081 19.4275 9.12772 19.625 9.625 19.625H11.5V19C11.4996 18.3055 11.7317 17.6308 12.1594 17.0836C11.1117 16.9399 10.1514 16.4219 9.4558 15.6254C8.76021 14.8288 8.37632 13.8075 8.375 12.75V12.125C8.38278 11.3483 8.58963 10.5865 8.97578 9.91251C8.78474 9.29626 8.72346 8.64711 8.7958 8.00599C8.86815 7.36487 9.07254 6.7457 9.39609 6.18751C9.45096 6.09248 9.52988 6.01357 9.62492 5.95871C9.71996 5.90385 9.82777 5.87499 9.9375 5.87501C10.6655 5.87349 11.3837 6.04225 12.0348 6.36781C12.686 6.69337 13.2519 7.16671 13.6875 7.75001H15.5625C15.9981 7.16671 16.564 6.69337 17.2151 6.36781C17.8663 6.04225 18.5845 5.87349 19.3125 5.87501C19.4222 5.87499 19.53 5.90385 19.6251 5.95871C19.7201 6.01357 19.799 6.09248 19.8539 6.18751C20.1775 6.74569 20.3819 7.3649 20.4541 8.00604C20.5263 8.64719 20.4648 9.29634 20.2734 9.91251C20.6603 10.5862 20.8675 11.3481 20.875 12.125Z" fill={iconFill} />
        </svg>
      </a>
      <a href="mailto:priyamwada.dzn@gmail.com" aria-label="Email" className="hover:opacity-60 transition-opacity">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M12.125 15.875C12.125 16.0408 12.0592 16.1997 11.9419 16.3169C11.8247 16.4342 11.6658 16.5 11.5 16.5H8.375C8.20924 16.5 8.05027 16.4342 7.93306 16.3169C7.81585 16.1997 7.75 16.0408 7.75 15.875C7.75 15.7092 7.81585 15.5503 7.93306 15.4331C8.05027 15.3158 8.20924 15.25 8.375 15.25H11.5C11.6658 15.25 11.8247 15.3158 11.9419 15.4331C12.0592 15.5503 12.125 15.7092 12.125 15.875ZM17.125 6.5H19C19.1658 6.5 19.3247 6.43415 19.4419 6.31694C19.5592 6.19973 19.625 6.04076 19.625 5.875C19.625 5.70924 19.5592 5.55027 19.4419 5.43306C19.3247 5.31585 19.1658 5.25 19 5.25H16.5C16.3342 5.25 16.1753 5.31585 16.0581 5.43306C15.9408 5.55027 15.875 5.70924 15.875 5.875V8.375H17.125V6.5ZM22.75 13.0625V17.75C22.75 18.0815 22.6183 18.3995 22.3839 18.6339C22.1495 18.8683 21.8315 19 21.5 19H14.625V21.5C14.625 21.6658 14.5592 21.8247 14.4419 21.9419C14.3247 22.0592 14.1658 22.125 14 22.125C13.8342 22.125 13.6753 22.0592 13.5581 21.9419C13.4408 21.8247 13.375 21.6658 13.375 21.5V19H6.5C6.16848 19 5.85054 18.8683 5.61612 18.6339C5.3817 18.3995 5.25 18.0815 5.25 17.75V13.0625C5.25145 11.8197 5.74577 10.6283 6.62454 9.74954C7.5033 8.87077 8.69474 8.37645 9.9375 8.375H15.875V15.25C15.875 15.4158 15.9408 15.5747 16.0581 15.6919C16.1753 15.8092 16.3342 15.875 16.5 15.875C16.6658 15.875 16.8247 15.8092 16.9419 15.6919C17.0592 15.5747 17.125 15.4158 17.125 15.25V8.375H18.0625C19.3053 8.37645 20.4967 8.87077 21.3755 9.74954C22.2542 10.6283 22.7486 11.8197 22.75 13.0625ZM13.375 13.0625C13.375 12.1508 13.0128 11.2765 12.3682 10.6318C11.7235 9.98716 10.8492 9.625 9.9375 9.625C9.02582 9.625 8.15148 9.98716 7.50682 10.6318C6.86216 11.2765 6.5 12.1508 6.5 13.0625V17.75H13.375V13.0625Z" fill={iconFill} />
        </svg>
      </a>
    </div>
  );
}

// ── Shared intro content ──────────────────────────────────────────────────────

function IntroContent({ onExplore }: { onExplore?: () => void }) {
  return (
    <>
      <h1
        style={{
          fontFamily: "var(--font-ovo), serif",
          fontSize: "48px",
          lineHeight: 1.15,
          fontWeight: 400,
          color: "#FAFAFA",
          letterSpacing: "-0.3px",
          textWrap: "balance" as React.CSSProperties["textWrap"],
          textAlign: "center",
          maxWidth: "560px",
        }}
      >
        Ideas I couldn&apos;t stop thinking about.
      </h1>
      <p
        className="font-sans text-base leading-relaxed text-center"
        style={{ color: "rgba(255,255,255,0.5)", maxWidth: "460px" }}
      >
        This is where I work without guardrails. Some of these are fully built,
        some are still in that hazy middle ground where I&apos;m not sure where
        they&apos;re headed. You&apos;ll find design-to-execution tools, Arduino
        experiments, and interface ideas that came to me while waiting at the
        bus stop or staring at a tree.
      </p>
      {onExplore && (
        <button
          onClick={onExplore}
          className="font-mono text-[11px] tracking-wider uppercase cursor-pointer"
          style={{
            color: "rgba(255,255,255,0.3)",
            background: "none",
            border: "none",
            padding: 0,
            marginTop: "8px",
            transition: "color 200ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)";
          }}
        >
          → Explore
        </button>
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PlayPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentRef = useRef(0);
  const [current, setCurrent] = useState(0);

  const goToSlide = useCallback((index: number) => {
    const container = containerRef.current;
    const slide = slideRefs.current[index];
    if (!container || !slide) return;
    container.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    currentRef.current = index;
    setCurrent(index);
  }, []);

  // Keyboard navigation (no wheel hijacking — wheel is free on desktop)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goToSlide(Math.min(currentRef.current + 1, TOTAL_SLIDES - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goToSlide(Math.max(currentRef.current - 1, 0));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToSlide]);

  // Paint nav green + hide global footer for this page only
  useEffect(() => {
    document.documentElement.setAttribute("data-play-page", "true");
    return () => document.documentElement.removeAttribute("data-play-page");
  }, []);

  // Height = viewport − nav (~80px) − fixed footer
  const pageH = `calc(100dvh - 80px - ${FOOTER_H}px)`;

  return (
    <>
      <div style={{ ...CUTTING_MAT, height: pageH, overflow: "hidden" }}>

        {/* ── Desktop: keyboard-navigated horizontal carousel ─────────────────── */}
        <div
          ref={containerRef}
          className="hidden md:flex h-full overflow-x-scroll overflow-y-hidden"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {/* Slide 0 — Intro (80vw → first project peeks 20%) */}
          <div
            ref={(el) => { slideRefs.current[0] = el; }}
            className="shrink-0 h-full flex flex-col items-center justify-center gap-6"
            style={{ width: "80vw", padding: "0 10vw" }}
          >
            <IntroContent onExplore={() => goToSlide(1)} />
          </div>

          {/* Slides 1–N — one per project */}
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => { slideRefs.current[i + 1] = el; }}
              className="shrink-0 h-full flex items-stretch"
              style={{ width: "100vw" }}
            >
              {/* Left: visual placeholder */}
              <div className="flex-1 flex items-center justify-center p-12">
                <div
                  className="w-full max-w-[480px]"
                  style={{
                    aspectRatio: "4/3",
                    backgroundImage: PLACEHOLDER_BORDER,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "20px",
                  }}
                />
              </div>

              {/* Divider */}
              <div
                className="shrink-0"
                style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
              />

              {/* Right: text */}
              <div
                className="flex-1 flex flex-col justify-center"
                style={{ padding: "48px 56px" }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {project.date}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                  </div>
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-ovo), serif",
                    fontSize: "clamp(18px, 2vw, 28px)",
                    lineHeight: 1.25,
                    fontWeight: 400,
                    color: "#FAFAFA",
                    marginBottom: "16px",
                    textWrap: "balance" as React.CSSProperties["textWrap"],
                  }}
                >
                  {project.title}
                </h2>

                <p
                  className="font-sans text-base leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)", maxWidth: "420px" }}
                >
                  {project.body}
                </p>

                {/* Progress dots */}
                <div className="flex gap-2 mt-12">
                  {projects.map((_, j) => (
                    <button
                      key={j}
                      onClick={() => goToSlide(j + 1)}
                      aria-label={`Go to project ${j + 1}`}
                      className="h-0.5 rounded-full cursor-pointer"
                      style={{
                        width: j === i ? "24px" : "8px",
                        backgroundColor:
                          j === i ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)",
                        border: "none",
                        transition:
                          "width 300ms cubic-bezier(0.23,1,0.32,1), background-color 300ms",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Final slide — outro */}
          <div
            ref={(el) => { slideRefs.current[TOTAL_SLIDES - 1] = el; }}
            className="shrink-0 h-full flex flex-col items-center justify-center gap-10"
            style={{ width: "100vw", padding: "48px" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-ovo), serif",
                fontSize: "48px",
                lineHeight: 1.15,
                fontWeight: 400,
                color: "#FAFAFA",
                letterSpacing: "-0.3px",
                textAlign: "center",
                textWrap: "balance" as React.CSSProperties["textWrap"],
                maxWidth: "560px",
              }}
            >
              Ideas I couldn&apos;t stop thinking about.
            </h1>
            <button
              onClick={() => goToSlide(0)}
              className="font-mono text-[11px] tracking-wider uppercase cursor-pointer"
              style={{
                color: "rgba(255,255,255,0.3)",
                background: "none",
                border: "none",
                padding: 0,
                transition: "color 200ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)";
              }}
            >
              ← Start over
            </button>
          </div>
        </div>

        {/* ── Mobile: horizontal snap carousel ───────────────────────────────── */}
        <div
          className="flex md:hidden h-full overflow-x-auto overflow-y-hidden"
          style={{
            scrollbarWidth: "none",
            scrollSnapType: "x mandatory",
          } as React.CSSProperties}
        >
          {/* Intro card */}
          <div
            className="shrink-0 h-full flex flex-col items-center justify-center gap-5"
            style={{
              width: "80vw",
              scrollSnapAlign: "start",
              padding: "32px 24px",
            } as React.CSSProperties}
          >
            <h1
              style={{
                fontFamily: "var(--font-ovo), serif",
                fontSize: "32px",
                lineHeight: 1.2,
                fontWeight: 400,
                color: "#FAFAFA",
                textAlign: "center",
                textWrap: "balance" as React.CSSProperties["textWrap"],
              }}
            >
              Ideas I couldn&apos;t stop thinking about.
            </h1>
            <p
              className="font-sans text-sm leading-relaxed text-center"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              This is where I work without guardrails. Experiments, Arduino
              builds, and interface ideas that got out of hand.
            </p>
            <p
              className="font-mono text-[11px] tracking-wider uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              → Swipe to explore
            </p>
          </div>

          {/* Project cards */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="shrink-0 h-full flex flex-col justify-center gap-4"
              style={{
                width: "80vw",
                scrollSnapAlign: "start",
                padding: "24px 20px",
              } as React.CSSProperties}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  backgroundImage: PLACEHOLDER_BORDER,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: "16px",
                }}
              />
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {project.date}
                </p>
                {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-ovo), serif",
                  fontSize: "18px",
                  lineHeight: 1.3,
                  fontWeight: 400,
                  color: "#FAFAFA",
                  textWrap: "balance" as React.CSSProperties["textWrap"],
                }}
              >
                {project.title}
              </h2>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {project.body}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* ── Fixed footer (replaces global footer on this page) ──────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between"
        style={{
          ...CUTTING_MAT,
          height: `${FOOTER_H}px`,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingLeft: "7vw",
          paddingRight: "7vw",
        }}
      >
        <div className="flex flex-col" style={{ gap: "2px" }}>
          <p
            className="text-[13px] uppercase font-medium tracking-wide"
            style={{ fontFamily: "var(--font-hind), sans-serif", color: "rgba(255,255,255,0.5)" }}
          >
            Priyamwada Pandey &nbsp;©&nbsp;2026
          </p>
          <p
            style={{
              fontFamily: "var(--font-hind), sans-serif",
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            ♪ made while listening to the black keys ♪
          </p>
        </div>
        <SocialLinks />
      </div>

      {/* ── Per-page style overrides ─────────────────────────────────────────── */}
      <style>{`
        /* Nav: match the cutting mat */
        html[data-play-page] nav {
          background-color: #2C4A22 !important;
          background-image:
            repeating-linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px) !important;
          background-size: 44px 44px !important;
        }
        html[data-play-page] nav a   { color: rgba(255,255,255,0.75) !important; }
        html[data-play-page] nav span { color: rgba(255,255,255,0.75) !important; }
        html[data-play-page] nav img  { filter: brightness(0) invert(0.9) !important; }
        /* Hamburger bars */
        html[data-play-page] nav button span {
          background-color: rgba(255,255,255,0.75) !important;
        }
        /* Hide global footer — replaced by the fixed one above */
        html[data-play-page] footer { display: none !important; }
        /* Scrollbars */
        html[data-play-page] ::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
