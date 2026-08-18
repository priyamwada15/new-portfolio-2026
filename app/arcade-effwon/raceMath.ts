import type { Track } from "./raceData";

export type Car = {
  d: number;
  speed: number;
  phase: number;
  weaveSpeed: number;
  weaveAmp: number;
  color: string;
  accent: string;
  name: string;
  hit: number;
  offset: number;
  justReset: boolean;
};

/** Weighted random speed tier for a rival car: 15% fast, 65% mid, 20% slow. */
export function rollTier(): number {
  const r = Math.random();
  if (r < 0.15) return 1.4 + Math.random() * 0.25;
  if (r < 0.8) return 0.85 + Math.random() * 0.3;
  return 0.55 + Math.random() * 0.25;
}

export function makeCar(
  team: { p: string; a: string; name: string },
  d: number,
  offset = 0,
): Car {
  return {
    d,
    speed: 90 * rollTier(),
    phase: Math.random() * 10,
    weaveSpeed: 0.5 + Math.random() * 0.9,
    weaveAmp: 18 + Math.random() * 22,
    color: team.p,
    accent: team.a,
    name: team.name,
    hit: 0,
    offset,
    justReset: true,
  };
}

/** Lateral road-center offset at a given world position, from the track's corner list. */
export function curveOffset(track: Track, pos: number, intensity: number): number {
  let total = 0;
  const L = track.length;
  for (const c of track.corners) {
    let delta = pos - c.d;
    delta -= L * Math.round(delta / L);
    total += c.s * 62 * Math.exp(-(delta * delta) / (2 * c.w * c.w));
  }
  return Math.max(-115, Math.min(115, total * intensity));
}

export type MinimapCache = {
  pts: { x: number; y: number }[];
  cum: number[];
  total: number;
  w: number;
  h: number;
};

export function buildMinimapCache(track: Track): MinimapCache {
  const w = 150;
  const h = 120;
  const pad = 14;
  const pts = track.map.map((p) => ({
    x: pad + p[0] * (w - 2 * pad),
    y: pad + p[1] * (h - 2 * pad),
  }));
  let total = 0;
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    cum.push(total);
  }
  return { pts, cum, total, w, h };
}

export function pad(n: number, width: number): string {
  return String(Math.floor(n)).padStart(width, "0");
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${pad(mins, 2)}:${pad(secs, 2)}`;
}
