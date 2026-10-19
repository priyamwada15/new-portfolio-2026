/** Hills hero image (public/hero/hills.webp) and its front meadow ridge, in image pixels. */
export const HILLS_W = 1920;
export const HILLS_H = 1072;

/** Top edge of the front meadow, traced from the image and fitted to a parabola. */
export function ridgeY(x: number) {
  return 805 + 0.000133 * (x - 960) ** 2;
}

/** Slope of the ridge at x, in degrees (positive slopes down to the right). */
export function ridgeAngle(x: number) {
  return (Math.atan(2 * 0.000133 * (x - 960)) * 180) / Math.PI;
}

/**
 * clip-path for the front copy of the hills: everything below a line just under
 * the ridge, with a ragged grassy edge, so it covers the feet of the letters.
 */
export function frontGrassClipPath(drop = 3) {
  const pts: string[] = [];
  for (let x = 0; x <= HILLS_W; x += 12) {
    // Deterministic tufts: a few blades poke up a little higher than the rest.
    const tuft = (Math.sin(x * 0.37) + Math.sin(x * 0.113) * 0.6) * 2.2;
    const y = ridgeY(x) + drop - Math.max(0, tuft);
    pts.push(`${((x / HILLS_W) * 100).toFixed(3)}% ${((y / HILLS_H) * 100).toFixed(3)}%`);
  }
  return `polygon(${pts.join(", ")}, 100% 100%, 0% 100%)`;
}
