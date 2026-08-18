"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TEAMS } from "./raceData";
import { createBeeper } from "./raceAudio";
import { TeamSelectOverlay, CountdownOverlay, HudSidebar } from "./ArcadeEffWonOverlays";

type Screen = "select" | "countdown" | "playing" | "gameover" | "finished";

type HudState = {
  screen: Screen;
  teamIndex: number;
  score: number;
  best: number;
  speed: number;
  pos: string;
  time: number;
  damage: number;
  paused: boolean;
  lightsLit: number;
  lap: number;
};

const INITIAL_HUD: HudState = {
  screen: "select",
  teamIndex: 0,
  score: 0,
  best: 0,
  speed: 0,
  pos: "",
  time: 0,
  damage: 0,
  paused: false,
  lightsLit: 0,
  lap: 1,
};

export default function ArcadeEffWonGame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hud, setHudState] = useState<HudState>(INITIAL_HUD);
  const hudRef = useRef<HudState>(INITIAL_HUD);
  const setHud = useCallback(
    (update: Partial<HudState> | ((s: HudState) => Partial<HudState>)) => {
      setHudState((prev) => {
        const patch = typeof update === "function" ? update(prev) : update;
        const next = { ...prev, ...patch };
        hudRef.current = next;
        return next;
      });
    },
    [],
  );

  const countdownTRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const beepRef = useRef(createBeeper());

  const startRace = useCallback(() => {
    countdownTRef.current = 0;
    setHud({
      screen: "countdown",
      lightsLit: 0,
      score: 0,
      speed: 0,
      pos: "",
      time: 0,
      damage: 0,
      lap: 1,
    });
  }, [setHud]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const el = wrapRef.current;
    function layout() {
      if (!el || !canvas) return;
      const rect = el.getBoundingClientRect();
      canvas.width = Math.max(200, Math.round(rect.width));
      canvas.height = Math.max(200, Math.round(rect.height));
    }
    layout();
    window.addEventListener("resize", layout);

    const onKeyDown = (e: KeyboardEvent) => {
      const screen = hudRef.current.screen;
      if (screen === "select") {
        if (e.key === "ArrowRight")
          setHud((s) => ({ teamIndex: Math.min(TEAMS.length - 1, s.teamIndex + 1) }));
        if (e.key === "ArrowLeft")
          setHud((s) => ({ teamIndex: Math.max(0, s.teamIndex - 1) }));
        if (e.key === "ArrowDown")
          setHud((s) => ({ teamIndex: Math.min(TEAMS.length - 1, s.teamIndex + 4) }));
        if (e.key === "ArrowUp")
          setHud((s) => ({ teamIndex: Math.max(0, s.teamIndex - 4) }));
        if (e.key === "Enter") startRace();
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key))
        e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", layout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [setHud, startRace]);

  const updateCountdown = useCallback(
    (dt: number) => {
      countdownTRef.current += dt;
      const lit = Math.min(5, Math.floor(countdownTRef.current / 0.55));
      if (lit !== hudRef.current.lightsLit) {
        if (lit > 0 && lit <= 5) beepRef.current(500, 0.08, "square", 0.05);
        setHud({ lightsLit: lit });
      }
      if (countdownTRef.current > 3.4) {
        beepRef.current(700, 0.2, "sine", 0.08);
        beepRef.current(900, 0.2, "sine", 0.06);
        lastTsRef.current = performance.now();
        setHud({ screen: "playing" });
      }
    },
    [setHud],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#2f7a2f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const loop = (t: number) => {
      if (lastTsRef.current === null) lastTsRef.current = t;
      let dt = (t - lastTsRef.current) / 1000;
      lastTsRef.current = t;
      dt = Math.max(0, Math.min(dt, 0.05));

      if (hudRef.current.screen === "countdown") updateCountdown(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateCountdown, draw]);

  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-[#0a0a0a] text-white"
      style={{ fontFamily: "var(--font-press-start-2p), monospace" }}
    >
      <div ref={wrapRef} className="relative h-full flex-1">
        <canvas ref={canvasRef} className="block h-full w-full [image-rendering:pixelated]" />

        {hud.screen === "select" && (
          <TeamSelectOverlay
            teamIndex={hud.teamIndex}
            onSelect={(i) => setHud({ teamIndex: i })}
            onStart={startRace}
          />
        )}

        {hud.screen === "countdown" && <CountdownOverlay lightsLit={hud.lightsLit} />}
      </div>

      <HudSidebar hud={hud} />
    </div>
  );
}
