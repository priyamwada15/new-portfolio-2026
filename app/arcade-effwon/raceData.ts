export type Team = {
  name: string;
  /** primary body color */
  p: string;
  /** accent/cockpit color */
  a: string;
};

export const TEAMS: Team[] = [
  { name: "CRIMSON RACING", p: "#d81f26", a: "#ffffff" },
  { name: "SILVER ARROWS", p: "#b8bcc2", a: "#1a1a1a" },
  { name: "AZURE PERFORMANCE", p: "#1a5fd8", a: "#ffe000" },
  { name: "EMERALD GP", p: "#1a8f3c", a: "#ffffff" },
  { name: "SUNBURST RACING", p: "#ff7a1a", a: "#101010" },
  { name: "ONYX MOTORSPORT", p: "#1a1a1a", a: "#d81f26" },
  { name: "COBALT WOLVES", p: "#123a6b", a: "#29e0e0" },
  { name: "VIPER YELLOW", p: "#f1c40f", a: "#101010" },
  { name: "AMETHYST RACING", p: "#7b2fd6", a: "#ffffff" },
  { name: "STEEL HAWKS", p: "#5c6670", a: "#ff7a1a" },
  { name: "CORAL VELOCITY", p: "#ff5c7a", a: "#16b3a0" },
];

export type Corner = { d: number; s: number; w: number };

export type TrackTheme = {
  grassA: string;
  grassB: string;
  buildingP: string;
  buildingA: string;
  tree: string;
  road: string;
};

export type Track = {
  length: number;
  corners: Corner[];
  theme: TrackTheme;
  map: [number, number][];
};

export const TRACK: Track = {
  length: 3200,
  corners: [
    { d: 700, s: -1.0, w: 170 },
    { d: 1500, s: 0.75, w: 70 },
    { d: 1680, s: -0.75, w: 70 },
    { d: 1860, s: 0.75, w: 70 },
    { d: 2500, s: 1.0, w: 170 },
  ],
  theme: {
    grassA: "#2f7a2f",
    grassB: "#276927",
    buildingP: "#8a4a2c",
    buildingA: "#c0392b",
    tree: "#1e4a1a",
    road: "#232323",
  },
  map: [
    [0.78, 0.95], [0.9, 0.9], [0.9, 0.68], [0.78, 0.6], [0.55, 0.53],
    [0.68, 0.45], [0.9, 0.38], [0.9, 0.12], [0.78, 0.05], [0.3, 0.05],
    [0.18, 0.12], [0.18, 0.38], [0.4, 0.45], [0.28, 0.53], [0.1, 0.6],
    [0.1, 0.9], [0.22, 0.95], [0.78, 0.95],
  ],
};

/** Hardcoded — the prototype exposed this as a Claude-Design editor prop; this site has no such editor. */
export const DIFFICULTY_MULTIPLIER = 1;
/** Hardcoded — prototype default (of an editable 6–10 range). */
export const STARTING_GRID_SIZE = 10;
/** Hardcoded — prototype default (of an editable 2–5 range). */
export const MIN_RIVALS = 3;
export const TOTAL_LAPS = 8;

export const BEST_SCORE_STORAGE_KEY = "arcade_effwon_best";
