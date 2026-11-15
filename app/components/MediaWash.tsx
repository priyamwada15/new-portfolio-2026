import type { CSSProperties, ReactNode } from "react";

/**
 * The wash behind a screen, video or dialog on a case study page. Built to the
 * gradient guidance in the intentional-design skill, not as a two-stop sweep:
 *  - several colour sources, placed off-centre and sized differently, so areas
 *    of the wash blend into each other;
 *  - colours drawn from the product's own brand palette: a pale highlight, a
 *    deeper tint of the brand colour, and one warmer and one cooler neighbour;
 *  - a fine grain over it, which hides banding and echoes the speckle already
 *    used on the homepage cards;
 *  - used on one surface only: the container behind a screen. Never behind body
 *    text, since the deeper sources would drop its contrast.
 */

/**
 * Which wash. Only Tars (and so Asimov and Debug Mode) has one so far. A
 * Rocket Mortgage wash and an HCN wash were tried and dropped: neither suited its page.
 * To add one, derive a palette from the brand colour the same way and add it here.
 */
export type WashTone = "tars";

type Palette = {
  /** Soft highlight, top left. */
  pale: string;
  /** Warmer neighbour, small, top right. */
  warm: string;
  /** Deepest tint of the brand colour, bottom right. */
  deep: string;
  /** Cooler neighbour, bottom left. */
  cool: string;
  /** The flat colour the sources blend into. */
  base: string;
  /** Shadow colour for a screen lifted off the wash, as an rgb triple. */
  shadow: string;
};

const PALETTES: Record<WashTone, Palette> = {
  // Tars and Asimov: purple #6D33AA (Asimov's UI is #4F148D).
  tars: { pale: "#F5EEFC", warm: "#EEDDF4", deep: "#B496E6", cool: "#CBD6F6", base: "#DDD0F1", shadow: "40,16,80" },
};

const layers = (p: Palette) =>
  [
    `radial-gradient(52% 68% at 6% 4%, ${p.pale} 0%, rgba(255,255,255,0) 70%)`,
    `radial-gradient(34% 46% at 97% 6%, ${p.warm} 0%, rgba(255,255,255,0) 70%)`,
    `radial-gradient(62% 84% at 94% 102%, ${p.deep} 0%, rgba(255,255,255,0) 72%)`,
    `radial-gradient(40% 58% at 2% 98%, ${p.cool} 0%, rgba(255,255,255,0) 70%)`,
    `linear-gradient(${p.base}, ${p.base})`,
  ].join(", ");

const GRAIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>';
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

/** Soft lift for a screen sitting on the wash: a long shadow below and a hairline of contact shadow. */
export const washShadow = (tone: WashTone = "tars") =>
  `0 24px 48px -24px rgba(${PALETTES[tone].shadow},0.3), 0 2px 8px rgba(0,0,0,0.06)`;

/** The hairline around a screen on the wash. */
export const WASH_SCREEN_EDGE = "1px solid rgba(0,0,0,0.06)";

/** The wash as a CSS background value, for containers that can't be a `MediaWash` themselves. */
export const washBackground = (tone: WashTone = "tars") => layers(PALETTES[tone]);

/** The grain over a wash. Place it before the content so screens sit above it and stay crisp. */
export function WashGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: GRAIN, backgroundSize: "240px 240px", mixBlendMode: "soft-light", opacity: 0.55 }}
    />
  );
}

/**
 * The wash and its grain, at the shared container radius. Children sit above
 * the grain, so screens stay crisp. Give it a size through `style` or
 * `className`.
 */
export function MediaWash({
  tone = "tars",
  children,
  className = "",
  style,
}: {
  tone?: WashTone;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--ds-radius-container)] ${className}`}
      style={{ background: washBackground(tone), ...style }}
    >
      <WashGrain />
      {children}
    </div>
  );
}
