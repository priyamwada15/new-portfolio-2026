/** Ordered wheel — counter always steps forward through this sequence. */
export const COUNTER_CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'";

function normalize(char: string): string {
  if (!char || char === " ") return " ";
  if (char === "'") return "'";
  const upper = char.toUpperCase();
  return COUNTER_CHARSET.includes(upper) ? upper : " ";
}

/**
 * Builds an odometer strip: each row is the next character on the wheel.
 * Always counts forward from `fromChar` to `toChar` (no random picks).
 */
export function buildCounterStrip(
  fromChar: string,
  toChar: string,
  options?: { extraFullRotations?: number },
): string[] {
  const from = normalize(fromChar);
  const to = normalize(toChar);
  const fromIdx = COUNTER_CHARSET.indexOf(from);
  const toIdx = COUNTER_CHARSET.indexOf(to);

  if (fromIdx < 0 || toIdx < 0) {
    return [to];
  }

  const rotations = options?.extraFullRotations ?? 1;
  const dist = (toIdx - fromIdx + COUNTER_CHARSET.length) % COUNTER_CHARSET.length;
  const totalSteps = rotations * COUNTER_CHARSET.length + dist;

  const strip: string[] = [];
  for (let i = 0; i <= totalSteps; i += 1) {
    strip.push(COUNTER_CHARSET[(fromIdx + i) % COUNTER_CHARSET.length]!);
  }
  return strip;
}

export function randomGibberishChar(): string {
  const visible = COUNTER_CHARSET.replace(/ /g, "");
  const idx = Math.floor(Math.random() * visible.length);
  return visible[idx] ?? "Z";
}
