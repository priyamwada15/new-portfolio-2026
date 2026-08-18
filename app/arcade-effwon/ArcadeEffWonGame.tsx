"use client";

import "./arcadeEffwon.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BEST_SCORE_STORAGE_KEY,
  DIFFICULTY_MULTIPLIER,
  MIN_RIVALS,
  STARTING_GRID_SIZE,
  TEAMS,
  TOTAL_LAPS,
  TRACK,
} from "./raceData";
import {
  buildMinimapCache,
  curveOffset,
  makeCar,
  pad,
  type Car,
  type MinimapCache,
} from "./raceMath";
import { createBeeper } from "./raceAudio";
import {
  TeamSelectOverlay,
  CountdownOverlay,
  PausedOverlay,
  GameOverOverlay,
  FinishedOverlay,
  HudSidebar,
} from "./ArcadeEffWonOverlays";

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

type Dims = { W: number; H: number; roadHW: number; CX: number; playerY: number };

type GameRuntime = {
  worldScroll: number;
  playerOffset: number;
  speed: number;
  time: number;
  damage: number;
  rank: number;
  invuln: number;
  shakeT: number;
  cars: Car[];
  retireTimer: number;
  countdownT: number;
  minRivals: number;
  totalLaps: number;
  lap: number;
  scoreAcc: number;
};

type PodiumSlot = { label: string; name: string; isPlayer: boolean };

export default function ArcadeEffWonGame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);

  const [hud, setHudState] = useState<HudState>(INITIAL_HUD);
  const [isTouchOrNarrow, setIsTouchOrNarrow] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
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

  const dimsRef = useRef<Dims | null>(null);
  const gameRef = useRef<GameRuntime | null>(null);
  const minimapCacheRef = useRef<MinimapCache | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const steerDirRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const finishRankRef = useRef(1);
  const finishFieldRef = useRef<Car[]>([]);
  const beepRef = useRef(createBeeper());
  const teamSelectMusicRef = useRef<HTMLAudioElement>(null);
  const musicOnRef = useRef(true);

  useEffect(() => {
    musicOnRef.current = musicOn;
  }, [musicOn]);

  useEffect(() => {
    const beeper = beepRef.current;
    return () => beeper.dispose();
  }, []);

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem(BEST_SCORE_STORAGE_KEY) || "0", 10);
      if (!Number.isNaN(stored)) setHud({ best: stored });
    } catch {
      // localStorage unavailable — best stays 0
    }
  }, [setHud]);

  useEffect(() => {
    const audio = teamSelectMusicRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    if (hud.screen === "select" && musicOn) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [hud.screen, musicOn]);

  useEffect(() => {
    const check = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const narrow = window.innerWidth < 768;
      setIsTouchOrNarrow(coarse || narrow);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const layout = useCallback(() => {
    const el = wrapRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const rect = el.getBoundingClientRect();
    const W = Math.max(200, Math.round(rect.width));
    const H = Math.max(200, Math.round(rect.height));
    canvas.width = W;
    canvas.height = H;
    dimsRef.current = {
      W,
      H,
      roadHW: Math.max(80, Math.min(200, W * 0.13)),
      CX: W / 2,
      playerY: H - 130,
    };
  }, []);

  const startRace = useCallback(() => {
    const idx = hudRef.current.teamIndex;
    const roadHW = dimsRef.current?.roadHW ?? 100;
    const rivals = TEAMS.filter((_, i) => i !== idx).slice(0, STARTING_GRID_SIZE);
    const cars = rivals.map((team, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const offset = (col === 0 ? -1 : 1) * roadHW * 0.4;
      return makeCar(team, 90 + row * 75, offset);
    });
    minimapCacheRef.current = buildMinimapCache(TRACK);
    gameRef.current = {
      worldScroll: 0,
      playerOffset: 0,
      speed: 0,
      time: 0,
      damage: 0,
      rank: cars.length + 1,
      invuln: 999,
      shakeT: 0,
      cars,
      retireTimer: 10 + Math.random() * 6,
      countdownT: 0,
      minRivals: MIN_RIVALS,
      totalLaps: TOTAL_LAPS,
      lap: 1,
      scoreAcc: 0,
    };
    setHud({
      screen: "countdown",
      teamIndex: idx,
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
    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
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
        if (musicOnRef.current) teamSelectMusicRef.current?.play().catch(() => {});
      } else if (e.key === "Enter" && (screen === "finished" || screen === "gameover")) {
        setHud({ screen: "select" });
      }
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        if (hudRef.current.screen === "playing") setHud((s) => ({ paused: !s.paused }));
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key))
        e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [layout, setHud, startRace]);

  const updateCountdown = useCallback(
    (dt: number) => {
      const g = gameRef.current;
      if (!g) return;
      g.countdownT += dt;
      const lit = Math.min(5, Math.floor(g.countdownT / 0.55));
      if (lit !== hudRef.current.lightsLit) {
        if (lit > 0 && lit <= 5) beepRef.current(500, 0.08, "square", 0.05);
        setHud({ lightsLit: lit });
      }
      if (g.countdownT > 3.4) {
        beepRef.current(700, 0.2, "sine", 0.08);
        beepRef.current(900, 0.2, "sine", 0.06);
        g.invuln = 0.6;
        lastTsRef.current = performance.now();
        setHud({ screen: "playing" });
      }
    },
    [setHud],
  );

  const finishRace = useCallback(
    (finalScore: number) => {
      const g = gameRef.current;
      const best = Math.max(hudRef.current.best, finalScore);
      try {
        localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(best));
      } catch {
        // localStorage unavailable — best score just won't persist
      }
      beepRef.current(660, 0.15, "sine");
      beepRef.current(880, 0.2, "sine");
      finishRankRef.current = g?.rank ?? 1;
      finishFieldRef.current = g ? g.cars.slice() : [];
      setHud({ screen: "finished", score: finalScore, best, lap: TOTAL_LAPS });
    },
    [setHud],
  );

  const gameOver = useCallback(
    (finalScore: number) => {
      const best = Math.max(hudRef.current.best, finalScore);
      try {
        localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(best));
      } catch {
        // localStorage unavailable — best score just won't persist
      }
      beepRef.current(200, 0.3, "sawtooth");
      beepRef.current(140, 0.4, "sawtooth");
      setHud({ screen: "gameover", score: finalScore, best, damage: 3 });
    },
    [setHud],
  );

  const update = useCallback(
    (dt: number) => {
      const g = gameRef.current;
      const dims = dimsRef.current;
      if (!g || !dims) return;
      const ROAD_HW = dims.roadHW;
      g.time += dt;

      let dir = 0;
      if (keysRef.current.ArrowLeft) dir -= 1;
      if (keysRef.current.ArrowRight) dir += 1;
      steerDirRef.current = dir;
      g.playerOffset += dir * 150 * dt;
      g.playerOffset = Math.max(-ROAD_HW * 2, Math.min(ROAD_HW * 2, g.playerOffset));

      const offRoad = Math.abs(g.playerOffset) > ROAD_HW - 8;
      const braking = keysRef.current.ArrowDown;
      const accel = keysRef.current.ArrowUp;

      const speedRamp = 1 + g.time * 0.012 * DIFFICULTY_MULTIPLIER;
      let baseMax = 240 * speedRamp;
      if (offRoad) baseMax *= 0.5;

      if (accel) g.speed += 220 * dt;
      else g.speed -= 50 * dt;
      if (braking) g.speed -= 200 * dt;
      g.speed = Math.max(0, Math.min(baseMax, g.speed));

      g.worldScroll += g.speed * dt;
      g.lap = Math.min(g.totalLaps, Math.floor(g.worldScroll / TRACK.length) + 1);
      if (g.invuln > 0) g.invuln -= dt;

      let scoreGain = g.speed * dt * 0.12;

      for (let i = 0; i < g.cars.length; i++) {
        const c = g.cars[i];
        const prevD = c.d;
        g.cars[i].d -= (g.speed - c.speed * speedRamp) * dt;
        c.phase += dt * c.weaveSpeed;
        c.offset = Math.max(
          -(ROAD_HW - 14),
          Math.min(ROAD_HW - 14, Math.sin(c.phase) * c.weaveAmp),
        );
        if (c.hit > 0) c.hit -= dt;

        if (!c.justReset) {
          if (prevD >= 0 && c.d < 0) {
            g.rank = Math.max(1, g.rank - 1);
            scoreGain += 60;
            beepRef.current(880, 0.08, "sine", 0.05);
          } else if (prevD <= 0 && c.d > 0) {
            g.rank = Math.min(g.cars.length + 1, g.rank + 1);
            beepRef.current(220, 0.12, "triangle", 0.05);
          }
        }
        c.justReset = false;

        if (
          g.invuln <= 0 &&
          Math.abs(c.d) < 16 &&
          Math.abs(c.offset - g.playerOffset) < 20
        ) {
          g.damage += 1;
          g.invuln = 1.4;
          c.hit = 0.4;
          c.d = 200 + Math.random() * 100;
          c.justReset = true;
          g.speed *= 0.5;
          g.shakeT = 0.3;
          beepRef.current(120, 0.25, "sawtooth", 0.12);
        }
      }

      g.cars = g.cars.filter((c) => {
        if (c.d < -60) {
          if (g.cars.length > g.minRivals) return false;
          Object.assign(
            c,
            makeCar({ p: c.color, a: c.accent, name: c.name }, 300 + Math.random() * 260),
          );
        } else if (c.d > 640) {
          Object.assign(
            c,
            makeCar({ p: c.color, a: c.accent, name: c.name }, 260 + Math.random() * 200),
          );
        }
        return true;
      });
      g.rank = Math.min(g.rank, g.cars.length + 1);

      if (g.cars.length > g.minRivals) {
        g.retireTimer -= dt;
        if (g.retireTimer <= 0) {
          g.retireTimer = 9 + Math.random() * 8;
          const idx = Math.floor(Math.random() * g.cars.length);
          g.cars.splice(idx, 1);
          g.rank = Math.min(g.rank, g.cars.length + 1);
          beepRef.current(300, 0.15, "triangle", 0.04);
        }
      }

      g.shakeT = Math.max(0, g.shakeT - dt);
      g.scoreAcc = Math.max(0, g.scoreAcc + scoreGain);

      if (g.damage >= 3) {
        gameOver(Math.floor(g.scoreAcc));
        return;
      }

      if (g.worldScroll >= TRACK.length * g.totalLaps) {
        finishRace(Math.floor(g.scoreAcc) + 500);
        return;
      }

      setHud({
        score: Math.floor(g.scoreAcc),
        speed: Math.floor(g.speed),
        pos: `${g.rank} / ${g.cars.length + 1}`,
        time: g.time,
        damage: g.damage,
        lap: g.lap,
      });
    },
    [gameOver, finishRace, setHud],
  );

  const drawCar = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      primary: string,
      accent: string,
      invuln: boolean,
      hit: boolean,
      tilt = 0,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      if (tilt) ctx.rotate(tilt);
      if (invuln) ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 60);
      if (hit) {
        ctx.fillStyle = "#ff5a3c";
        ctx.fillRect(-13, -20, 26, 40);
      }
      ctx.fillStyle = "#151515";
      ctx.fillRect(-9, -16, 4, 6);
      ctx.fillRect(5, -16, 4, 6);
      ctx.fillRect(-9, 10, 4, 6);
      ctx.fillRect(5, 10, 4, 6);
      ctx.fillStyle = primary;
      ctx.fillRect(-6, -18, 12, 36);
      ctx.fillRect(-11, -19, 22, 4);
      ctx.fillRect(-9, 15, 18, 4);
      ctx.fillStyle = accent;
      ctx.fillRect(-4, -6, 8, 10);
      ctx.fillStyle = "#151515";
      ctx.fillRect(-3, -4, 6, 5);
      ctx.restore();
    },
    [],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const dims = dimsRef.current;
    if (!canvas || !dims) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const theme = TRACK.theme;
    const { W, H, roadHW: ROAD_HW, CX, playerY: PLAYER_Y } = dims;
    const g = gameRef.current;
    const screen = hudRef.current.screen;
    const inRace = screen === "playing" || screen === "countdown";
    const time = g?.time ?? 0;
    const intensity =
      screen === "countdown" ? 0 : Math.min(1.3, 1 + time * 0.003 * DIFFICULTY_MULTIPLIER);

    ctx.save();
    if (g && g.shakeT > 0) ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);

    ctx.fillStyle = theme.grassA;
    ctx.fillRect(0, 0, W, H);

    if (inRace && g) {
      const rowStep = 4;
      for (let y = 0; y < H; y += rowStep) {
        const absPos = g.worldScroll + (PLAYER_Y - y);
        const center = CX + curveOffset(TRACK, absPos, intensity);
        const seg = Math.floor(absPos / 40);
        ctx.fillStyle = seg % 2 === 0 ? theme.grassA : theme.grassB;
        ctx.fillRect(0, y, W, rowStep);
        ctx.fillStyle = theme.road;
        ctx.fillRect(center - ROAD_HW, y, ROAD_HW * 2, rowStep);
        ctx.fillStyle = seg % 2 === 0 ? "#c0392b" : "#e8e8e8";
        ctx.fillRect(center - ROAD_HW - 3, y, 3, rowStep);
        ctx.fillRect(center + ROAD_HW, y, 3, rowStep);
        if (seg % 2 === 0) {
          ctx.fillStyle = "#e8e8e8";
          ctx.fillRect(center - 2, y, 4, rowStep * 0.6);
        }
        if (seg % 3 === 0 && y % 40 < rowStep) {
          const lv = (Math.sin(seg * 12.9898) * 43758.5453) % 1;
          const rv = (Math.sin(seg * 78.233) * 43758.5453) % 1;
          if (Math.abs(lv) > 0.5) {
            ctx.fillStyle = theme.tree;
            ctx.beginPath();
            ctx.arc(center - ROAD_HW - 16, y, 9, 0, 7);
            ctx.fill();
          } else {
            ctx.fillStyle = theme.buildingP;
            ctx.fillRect(center - ROAD_HW - 26, y - 8, 16, 16);
            ctx.fillStyle = theme.buildingA;
            ctx.fillRect(center - ROAD_HW - 26, y - 8, 16, 4);
          }
          if (Math.abs(rv) > 0.5) {
            ctx.fillStyle = theme.tree;
            ctx.beginPath();
            ctx.arc(center + ROAD_HW + 16, y, 9, 0, 7);
            ctx.fill();
          } else {
            ctx.fillStyle = theme.buildingP;
            ctx.fillRect(center + ROAD_HW + 10, y - 8, 16, 16);
            ctx.fillStyle = theme.buildingA;
            ctx.fillRect(center + ROAD_HW + 10, y - 8, 16, 4);
          }
        }
      }

      const playerCenter = CX + curveOffset(TRACK, g.worldScroll, intensity);
      const sorted = [...g.cars].sort((a, b) => b.d - a.d);
      for (const c of sorted) {
        const cy = PLAYER_Y - c.d;
        if (cy < -30 || cy > H + 30) continue;
        const cc = CX + curveOffset(TRACK, g.worldScroll + c.d, intensity);
        drawCar(ctx, cc + c.offset, cy, c.color, c.accent, false, c.hit > 0);
      }

      const team = TEAMS[hudRef.current.teamIndex];
      drawCar(
        ctx,
        playerCenter + g.playerOffset,
        PLAYER_Y,
        team.p,
        team.a,
        g.invuln > 0,
        false,
        steerDirRef.current * 0.12,
      );
    }

    ctx.restore();

    const mm = minimapRef.current;
    const cache = minimapCacheRef.current;
    if (mm && cache && g && (inRace || screen === "finished")) {
      const mctx = mm.getContext("2d");
      if (mctx) {
        mctx.clearRect(0, 0, cache.w, cache.h);
        mctx.strokeStyle = "#888";
        mctx.lineWidth = 2;
        mctx.beginPath();
        cache.pts.forEach((p, i) => (i === 0 ? mctx.moveTo(p.x, p.y) : mctx.lineTo(p.x, p.y)));
        mctx.stroke();
        mctx.fillStyle = "#fff";
        mctx.fillRect(cache.pts[0].x - 3, cache.pts[0].y - 3, 6, 6);
        const frac = (g.worldScroll % TRACK.length) / TRACK.length;
        const targetLen = frac * cache.total;
        let idx = 0;
        while (idx < cache.cum.length - 1 && cache.cum[idx + 1] < targetLen) idx++;
        const segLen = cache.cum[idx + 1] - cache.cum[idx] || 1;
        const t2 = (targetLen - cache.cum[idx]) / segLen;
        const p0 = cache.pts[idx];
        const p1 = cache.pts[Math.min(idx + 1, cache.pts.length - 1)];
        const px = p0.x + (p1.x - p0.x) * t2;
        const py = p0.y + (p1.y - p0.y) * t2;
        mctx.fillStyle = TEAMS[hudRef.current.teamIndex].p;
        mctx.beginPath();
        mctx.arc(px, py, 4, 0, 7);
        mctx.fill();
      }
    }
  }, [drawCar]);

  useEffect(() => {
    const loop = (t: number) => {
      if (lastTsRef.current === null) lastTsRef.current = t;
      let dt = (t - lastTsRef.current) / 1000;
      lastTsRef.current = t;
      dt = Math.max(0, Math.min(dt, 0.05));

      const screen = hudRef.current.screen;
      if (screen === "countdown") updateCountdown(dt);
      else if (screen === "playing" && !hudRef.current.paused) update(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateCountdown, update, draw]);

  const podium: PodiumSlot[] = useMemo(() => {
    if (hud.screen !== "finished") return [];
    const teamObj = TEAMS[hud.teamIndex];
    const fillers = finishFieldRef.current.map((c) => c.name);
    const rank = finishRankRef.current;
    const slots: PodiumSlot[] = [];
    for (let p = 1; p <= 3; p++) {
      const isPlayer = p === rank;
      slots.push({
        label: `P${p}`,
        name: isPlayer ? `${teamObj.name} (YOU)` : fillers.shift() ?? "RIVAL TEAM",
        isPlayer,
      });
    }
    return slots;
  }, [hud.screen, hud.teamIndex]);

  const showMinimap =
    hud.screen === "playing" || hud.screen === "countdown" || hud.screen === "finished";

  if (isTouchOrNarrow) {
    return (
      <div
        className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-[#0a0a0a] p-8 text-center text-white"
        style={{ fontFamily: "var(--font-press-start-2p), monospace" }}
      >
        <div className="text-[14px] text-[#ffd23f]">ARCADE EFFWON</div>
        <div className="max-w-[320px] text-[9px] leading-[1.8] text-[#aaa]">
          BEST PLAYED ON A DESKTOP WITH A KEYBOARD. COME BACK ON A LARGER SCREEN TO RACE.
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-[#0a0a0a] text-white"
      style={{ fontFamily: "var(--font-press-start-2p), monospace" }}
    >
      <audio ref={teamSelectMusicRef} src="/arcade-effwon/team-select-theme.mp3" loop preload="auto" />

      <div ref={wrapRef} className="relative h-full flex-1">
        <canvas ref={canvasRef} className="block h-full w-full [image-rendering:pixelated]" />

        {showMinimap && (
          <canvas
            ref={minimapRef}
            width={150}
            height={120}
            className="absolute right-4 top-4 rounded border-2 border-[#333] bg-black/55"
          />
        )}

        {hud.screen === "select" && (
          <TeamSelectOverlay
            teamIndex={hud.teamIndex}
            onSelect={(i) => {
              if (musicOn) teamSelectMusicRef.current?.play().catch(() => {});
              setHud({ teamIndex: i });
            }}
            onStart={startRace}
          />
        )}

        {hud.screen === "countdown" && <CountdownOverlay lightsLit={hud.lightsLit} />}

        {hud.screen === "playing" && hud.paused && <PausedOverlay />}

        {hud.screen === "gameover" && (
          <GameOverOverlay score={pad(hud.score, 6)} best={pad(hud.best, 6)} />
        )}

        {hud.screen === "finished" && (
          <FinishedOverlay
            podium={podium}
            resultLine={`YOUR RESULT: P${finishRankRef.current}`}
            score={pad(hud.score, 6)}
            best={pad(hud.best, 6)}
          />
        )}
      </div>

      <HudSidebar hud={hud} musicOn={musicOn} onToggleMusic={() => setMusicOn((m) => !m)} />
    </div>
  );
}
