"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

type DebugState = "idle" | "playing" | "paused" | "stopped" | "error";

const STEP_DELAY            = 2400;
const REWARDS_SELECT_DELAY  = 900;
const AFTER_REWARDS_DELAY   = 700;
const ERROR_AFTER_LAST      = 2000;

const STATUS_TEXT: Record<DebugState, string> = {
  idle:    "Debug Mode",
  playing: "Debugging Ongoing",
  paused:  "Debugging Paused",
  stopped: "Debugging Stopped",
  error:   "Error Encountered",
};

const F: React.CSSProperties = { fontFamily: "var(--font-inter, 'Inter', sans-serif)" };

// ── Easing ────────────────────────────────────────────────────────────────────
const EASE_OUT = [0.23, 1, 0.32, 1] as [number, number, number, number];
const SPRING   = { type: "spring", stiffness: 500, damping: 30, mass: 0.8 } as const;

// ── Icons ─────────────────────────────────────────────────────────────────────

function BugIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#6D33AA">
      <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F5F5F">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}
function PlayCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#59B655" />
      <path d="M10 7.5l7 4.5-7 4.5V7.5z" fill="white" />
    </svg>
  );
}
function PauseCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#59B655" />
      <rect x="8" y="7" width="2.5" height="10" rx="0.75" fill="white" />
      <rect x="13.5" y="7" width="2.5" height="10" rx="0.75" fill="white" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#555555">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}
function StopSquareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#555555">
      <path d="M6 6h12v12H6z" />
    </svg>
  );
}
function DotsThreeVertical() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#555555">
      <circle cx="8" cy="3" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="8" cy="13" r="1.25" />
    </svg>
  );
}
function LightningBolt() {
  return (
    <svg width="6" height="9" viewBox="0 0 6 9" fill="#FFC83D">
      <path d="M3.8 0L0 5h2.5L2.2 9 6 4H3.5L5 0z" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#979797">
      <path d="M1.5 1l13 7-13 7V9.5l8.5-1.5L1.5 6.5V1z" />
    </svg>
  );
}

// ── Shared chip style ─────────────────────────────────────────────────────────

const chipBase: React.CSSProperties = {
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "8px 10px",
  height: 28,
  border: "1px solid rgba(109, 51, 170, 0.1)",
  borderRadius: 8,
};

// ── Component ─────────────────────────────────────────────────────────────────

export function DebugChatPreview() {
  const [state, setState]                     = useState<DebugState>("idle");
  const [visibleCount, setVisibleCount]       = useState(0);
  const [sessionId, setSessionId]             = useState(0);
  const [hasError, setHasError]               = useState(false);
  const [rewardsSelected, setRewardsSelected] = useState(false);
  const [hoveredControl, setHoveredControl]   = useState<"play" | "restart" | "stop" | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  function getAudioCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      try {
        const Ctor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        audioCtxRef.current = new Ctor();
      } catch { return null; }
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }

  function playPop() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.07);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  function playError() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  function playTap() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // ── Sequencing ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (state !== "playing") return;
    if (visibleCount < 3) {
      const delay = visibleCount === 0 ? 0 : STEP_DELAY;
      const id = setTimeout(() => setVisibleCount((c) => c + 1), delay);
      return () => clearTimeout(id);
    }
    if (visibleCount === 3 && !rewardsSelected) {
      const id = setTimeout(() => setRewardsSelected(true), REWARDS_SELECT_DELAY);
      return () => clearTimeout(id);
    }
    if (visibleCount === 3 && rewardsSelected) {
      const id = setTimeout(() => setVisibleCount(4), AFTER_REWARDS_DELAY);
      return () => clearTimeout(id);
    }
    if (visibleCount === 4) {
      const id = setTimeout(() => setVisibleCount(5), STEP_DELAY);
      return () => clearTimeout(id);
    }
    if (visibleCount === 5) {
      const id = setTimeout(() => { playError(); setHasError(true); setState("error"); }, ERROR_AFTER_LAST);
      return () => clearTimeout(id);
    }
  }, [state, visibleCount, sessionId, rewardsSelected]);

  // ── Pop sound on each bubble appearance ───────────────────────────────────
  useEffect(() => {
    if (visibleCount === 0) return;
    playPop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handlePlay() {
    playTap();
    if (state === "paused") { setState("playing"); return; }
    setVisibleCount(0);
    setHasError(false);
    setRewardsSelected(false);
    setSessionId((s) => s + 1);
    setState("playing");
  }
  function handlePause()   { playTap(); if (state === "playing") setState("paused"); }
  function handleRestart() {
    playTap();
    setVisibleCount(0);
    setHasError(false);
    setRewardsSelected(false);
    setSessionId((s) => s + 1);
    setState("playing");
  }
  function handleStop() { playTap(); setState("stopped"); }

  const isPlaying    = state === "playing";
  const showDot      = state !== "idle";
  const dotColor     = state === "error" ? "#EF4444" : state === "stopped" ? "#9CA3AF" : "#3B82F6";
  const isPulsing    = state === "playing";
  const stopDisabled = state === "idle" || state === "stopped" || state === "error";
  const playDisabled = state === "error";

  // ── (1) Bubble animation — scale 0.96→1 + fade ───────────────────────────
  const bv = (i: number) => ({
    initial:    { opacity: 0, scale: 0.96 },
    animate:    { opacity: visibleCount > i ? 1 : 0, scale: visibleCount > i ? 1 : 0.96 },
    transition: { duration: 0.38, ease: EASE_OUT },
  });

  // ── Hover colors ──────────────────────────────────────────────────────────
  const playBg    = hoveredControl === "play"    && !playDisabled  ? "#EFEFEF" : "#FFFFFF";
  const restartBg = hoveredControl === "restart"                   ? "#EFEFEF" : "#F9F9F9";
  const stopBg    = hoveredControl === "stop"    && !stopDisabled  ? "#EFEFEF" : "#F9F9F9";

  return (
    <div
      style={{
        width: 368, height: 760,
        background: "#FFFFFF", borderRadius: 12,
        overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* ── Title bar ──────────────────────────────────────────────── */}
      <div
        style={{
          boxSizing: "border-box", display: "flex", flexDirection: "row",
          alignItems: "center", padding: "16px", justifyContent: "space-between",
          width: 368, height: 72, borderBottom: "1px solid #E9EAEB", flexShrink: 0,
        }}
      >
        <span style={{ ...F, fontWeight: 500, fontSize: 14, lineHeight: "150%", color: "#373E43", flexShrink: 0 }}>
          Chatbot Preview
        </span>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: 80, height: 40, flexShrink: 0 }}>
          <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center", padding: 10,
              position: "absolute", width: 40, height: 40, left: 0, top: 0,
              background: "rgba(109, 51, 170, 0.1)", border: "1px solid rgba(109, 51, 170, 0.1)", borderRadius: 8,
            }}>
              <BugIcon />
            </div>
          </div>
          <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CloseIcon />
          </div>
        </div>
      </div>

      {/* ── Controls bar ───────────────────────────────────────────── */}
      <div
        style={{
          boxSizing: "border-box", display: "flex", flexDirection: "row",
          justifyContent: "space-between", alignItems: "center",
          padding: "16px", width: 368, height: 60,
          borderBottom: "1px solid #E9EAEB", flexShrink: 0,
        }}
      >
        {/* Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
            {/* (3) Dot — backgroundColor animated via motion */}
            <AnimatePresence>
              {showDot && (
                <motion.div
                  key="dot"
                  initial={{ opacity: 0, scale: 0.5, backgroundColor: dotColor }}
                  animate={{
                    opacity: 1,
                    scale: isPulsing ? [1, 1.25, 1] : 1,
                    backgroundColor: dotColor,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={isPulsing ? {
                    scale:           { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                    opacity:         { duration: 0.2 },
                    backgroundColor: { duration: 0.35 },
                  } : {
                    scale:           { duration: 0.2 },
                    opacity:         { duration: 0.2 },
                    backgroundColor: { duration: 0.35 },
                  }}
                  style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0 }}
                />
              )}
            </AnimatePresence>

            {/* (2) Status text — slide out up, slide in from below */}
            <div style={{ overflow: "hidden", height: 21 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={state}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0,  opacity: 1 }}
                  exit={{    y: -14, opacity: 0 }}
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                  style={{ ...F, fontWeight: 500, fontSize: 12, lineHeight: "160%", color: "#5F5F5F", display: "block" }}
                >
                  {STATUS_TEXT[state]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* DebugModeControls — 122×28 grouped pill */}
        <div
          style={{
            boxSizing: "border-box", display: "flex", flexDirection: "row",
            alignItems: "center", width: 122, height: 28,
            border: "1px solid #E2E4E6", borderRadius: 6, overflow: "hidden", flexShrink: 0,
          }}
        >
          {/* (6)(7) Play / Pause */}
          <motion.button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={playDisabled}
            whileTap={!playDisabled ? { scale: 0.92 } : undefined}
            transition={SPRING}
            onMouseEnter={() => setHoveredControl("play")}
            onMouseLeave={() => setHoveredControl(null)}
            style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              padding: "4px 10px", width: 40, height: 28,
              background: playBg, border: "none",
              cursor: playDisabled ? "not-allowed" : "pointer",
              opacity: playDisabled ? 0.4 : 1, flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            {/* (6) icon crossfades on swap */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isPlaying ? "pause" : "play"}
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1,    opacity: 1 }}
                exit={{    scale: 0.75, opacity: 0 }}
                transition={{ duration: 0.12, ease: EASE_OUT }}
                style={{ display: "flex" }}
              >
                {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <div style={{ width: 1, height: 26, background: "#E2E4E6", flexShrink: 0 }} />

          {/* (7) Replay */}
          <motion.button
            onClick={handleRestart}
            whileTap={{ scale: 0.92 }}
            transition={SPRING}
            onMouseEnter={() => setHoveredControl("restart")}
            onMouseLeave={() => setHoveredControl(null)}
            style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              padding: "4px 10px", width: 40, height: 28,
              background: restartBg, border: "none", cursor: "pointer", flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            <RefreshIcon />
          </motion.button>

          <div style={{ width: 1, height: 26, background: "#E2E4E6", flexShrink: 0 }} />

          {/* (7) Stop */}
          <motion.button
            onClick={handleStop}
            disabled={stopDisabled}
            whileTap={!stopDisabled ? { scale: 0.92 } : undefined}
            transition={SPRING}
            onMouseEnter={() => setHoveredControl("stop")}
            onMouseLeave={() => setHoveredControl(null)}
            style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              padding: "4px 10px", width: 40, height: 28,
              background: stopBg, border: "none",
              cursor: stopDisabled ? "not-allowed" : "pointer",
              opacity: stopDisabled ? 0.4 : 1, flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            <StopSquareIcon />
          </motion.button>
        </div>
      </div>

      {/* ── Frame 68 — chat container ───────────────────────────────── */}
      <div
        style={{
          boxSizing: "border-box", display: "flex", flexDirection: "row",
          justifyContent: "center", alignItems: "flex-start",
          padding: "44px 44px 8px", width: 368, flex: 1,
        }}
      >
        {/* Chat window — 280×476 */}
        <div
          style={{
            boxSizing: "border-box", width: 280, height: 476,
            background: "#FFFFFF", border: "1px solid #E9EAEB",
            borderRadius: 16, position: "relative", flexShrink: 0,
          }}
        >
          {/* Header */}
          <div
            style={{
              boxSizing: "border-box", display: "flex", flexDirection: "column",
              alignItems: "center", padding: "0px 12px 8px", gap: 2,
              position: "absolute", width: 278, height: 49, left: 1, top: 1,
              background: "linear-gradient(0deg, rgba(109, 51, 170, 0.03), rgba(109, 51, 170, 0.03)), #FFFFFF",
              borderBottom: "1px solid #E9EAEB", borderRadius: "15px 15px 0 0",
            }}
          >
            <div
              style={{
                display: "flex", flexDirection: "row", justifyContent: "center",
                alignItems: "center", padding: "3px 5px", gap: 2,
                width: 62, height: 15, background: "#FFFFFF", borderRadius: "0px 0px 4px 4px",
              }}
            >
              <span style={{ ...F, fontWeight: 500, fontSize: 6.32, lineHeight: "140%", color: "#979797" }}>Chatbot</span>
              <LightningBolt />
              <span style={{ ...F, fontWeight: 500, fontSize: 6.32, lineHeight: "140%", color: "#979797" }}>TARS</span>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: 254, height: 24 }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Image src="/logos/Tars Logo.svg" width={24} height={24} alt="Tars" />
                <span style={{ ...F, fontWeight: 500, fontSize: 10, lineHeight: "12px", color: "#333333" }}>
                  Tars Technologies
                </span>
              </div>
              <DotsThreeVertical />
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────────────────── */}
          <div
            key={sessionId}
            style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start",
              padding: 0, gap: 12, position: "absolute",
              width: 256, height: 304, left: "calc(50% - 128px)", top: 62,
            }}
          >
            {/* One — bot */}
            <motion.div
              {...bv(0)}
              style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 4, width: 256, height: 52, flexShrink: 0 }}
            >
              <Image src="/logos/Tars Logo.svg" width={20} height={20} alt="" style={{ flexShrink: 0 }} />
              <div style={{
                boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center",
                padding: "8px 12px", width: 180, height: 52,
                background: "rgba(109, 51, 170, 0.03)", border: "1px solid rgba(109, 51, 170, 0.05)",
                borderRadius: "8px 8px 8px 2px",
              }}>
                <span style={{ ...F, fontWeight: 500, fontSize: 10.15, lineHeight: "12px", color: "#333333" }}>
                  Hi! I can help you with your credit card requests. What would you like to do today?
                </span>
              </div>
            </motion.div>

            {/* Two — user */}
            <motion.div
              {...bv(1)}
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: 256, height: 30, flexShrink: 0 }}
            >
              <div style={{
                boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center",
                padding: "8px 11px 7px 13px", width: "fit-content", maxWidth: 180, height: 30,
                background: "#511f85cc", border: "0.635px solid rgba(109, 51, 170, 0.3)",
                borderRadius: "8px 8px 2px 8px",
              }}>
                <span style={{ ...F, fontWeight: 400, fontSize: 10.15, lineHeight: "12px", color: "#FFFFFF", whiteSpace: "nowrap" }}>
                  Increase my credit limit
                </span>
              </div>
            </motion.div>

            {/* Three — bot + cards */}
            <motion.div
              {...bv(2)}
              style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 4, width: 220, height: 104, flexShrink: 0 }}
            >
              <Image src="/logos/Tars Logo.svg" width={20} height={20} alt="" style={{ flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 196, height: 104 }}>
                <div style={{
                  boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center",
                  padding: "8px 10px", width: 180, height: 40,
                  background: "rgba(109, 51, 170, 0.03)", border: "1px solid rgba(109, 51, 170, 0.05)",
                  borderRadius: "8px 8px 8px 2px",
                }}>
                  <span style={{ ...F, fontWeight: 500, fontSize: 10.15, lineHeight: "12px", color: "#333333" }}>
                    Sure, I can help with that. Please select your card:
                  </span>
                </div>

                {/* Card chips */}
                <div style={{ position: "relative", width: 181, height: 60, flexShrink: 0 }}>
                  <div style={{ ...chipBase, position: "absolute", left: 0, top: 0, background: "rgba(109, 51, 170, 0.03)" }}>
                    <span style={{ ...F, fontWeight: 400, fontSize: 10.15, lineHeight: "12px", color: "#333333", whiteSpace: "nowrap" }}>
                      Platinum Card
                    </span>
                  </div>

                  {/* (4) Rewards Card — color + scale pulse on activation */}
                  <motion.div
                    animate={{
                      backgroundColor: rewardsSelected ? "rgba(109, 51, 170, 0.2)" : "rgba(109, 51, 170, 0.03)",
                      scale:           rewardsSelected ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      backgroundColor: { duration: 0.35, ease: "easeOut" },
                      scale:           { duration: 0.28, ease: EASE_OUT },
                    }}
                    style={{ ...chipBase, position: "absolute", left: 93, top: 0 }}
                  >
                    <span style={{ ...F, fontWeight: 400, fontSize: 10.15, lineHeight: "12px", color: "#333333", whiteSpace: "nowrap" }}>
                      Rewards Card
                    </span>
                  </motion.div>

                  <div style={{ ...chipBase, position: "absolute", left: 0, top: 32, background: "rgba(109, 51, 170, 0.03)" }}>
                    <span style={{ ...F, fontWeight: 400, fontSize: 10.15, lineHeight: "12px", color: "#333333", whiteSpace: "nowrap" }}>
                      Business Card
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Four — user */}
            <motion.div
              {...bv(3)}
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: 256, height: 30, flexShrink: 0 }}
            >
              <div style={{
                boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center",
                padding: "8px 11px 7px 13px", width: "fit-content", maxWidth: 180, height: 30,
                background: "#511f85cc", border: "0.635px solid rgba(109, 51, 170, 0.3)",
                borderRadius: "8px 8px 2px 8px",
              }}>
                <span style={{ ...F, fontWeight: 400, fontSize: 10.15, lineHeight: "12px", color: "#FFFFFF", whiteSpace: "nowrap" }}>
                  Rewards Card
                </span>
              </div>
            </motion.div>

            {/* Five — bot (error target) */}
            <motion.div
              {...bv(4)}
              style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 4, width: 256, height: 40, flexShrink: 0 }}
            >
              <Image src="/logos/Tars Logo.svg" width={20} height={20} alt="" style={{ flexShrink: 0 }} />
              {/* (5) Error: fill + border color + horizontal shake */}
              <motion.div
                animate={{
                  x:               hasError ? [0, -5, 5, -3, 0] : 0,
                  backgroundColor: hasError ? "#e5484d1a" : "rgba(109, 51, 170, 0.03)",
                  borderColor:     hasError ? "#ef44444d" : "rgba(109, 51, 170, 0.05)",
                }}
                transition={{
                  x:               { duration: 0.42, ease: "easeInOut" },
                  backgroundColor: { duration: 0.4 },
                  borderColor:     { duration: 0.4 },
                }}
                style={{
                  boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center",
                  padding: "8px 12px", width: 180, height: 40,
                  backgroundColor: "rgba(109, 51, 170, 0.03)",
                  borderWidth: 1, borderStyle: "solid", borderColor: "rgba(109, 51, 170, 0.05)",
                  borderRadius: "8px 8px 8px 2px",
                }}
              >
                <span style={{ ...F, fontWeight: 500, fontSize: 10.15, lineHeight: "12px", color: "#333333" }}>
                  Got it. Let me check your eligibility.
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* ── User Input ────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex", flexDirection: "row", alignItems: "center", gap: 8,
              position: "absolute", width: 262, height: 36, left: 8, top: 430,
            }}
          >
            <div style={{
              boxSizing: "border-box", display: "flex", alignItems: "center", padding: 12,
              flex: 1, height: 36,
              background: "linear-gradient(0deg, rgba(109,51,170,0.06), rgba(109,51,170,0.06)), #FFFFFF",
              border: "1px solid rgba(109, 51, 170, 0.05)", borderRadius: 8,
            }}>
              <span style={{ ...F, fontWeight: 400, fontSize: 10, lineHeight: "140%", color: "#979797" }}>
                Type your message
              </span>
            </div>
            <div style={{
              boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center",
              padding: 10, width: 36, height: 36,
              background: "linear-gradient(0deg, rgba(109,51,170,0.06), rgba(109,51,170,0.06)), #FFFFFF",
              border: "1px solid rgba(109, 51, 170, 0.05)", borderRadius: 8, flexShrink: 0,
            }}>
              <SendIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
