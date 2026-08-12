export type Ripple = {
  x: number;
  y: number;
  startTime: number;
  hit: Uint8Array;
};

export type RippleParams = {
  waveSpeed: number;
  impulseStrength: number;
  maxAge: number;
};

export const DEFAULT_RIPPLE_PARAMS: RippleParams = {
  waveSpeed: 8,
  impulseStrength: 12,
  maxAge: 4,
};

export function createRipple(
  x: number,
  y: number,
  startTime: number,
  plateCount: number,
): Ripple {
  return { x, y, startTime, hit: new Uint8Array(plateCount) };
}

export function hasRippleReachedPlate(
  ripple: Ripple,
  platePosition: { x: number; y: number },
  elapsedTime: number,
  params: RippleParams = DEFAULT_RIPPLE_PARAMS,
): boolean {
  const dx = platePosition.x - ripple.x;
  const dy = platePosition.y - ripple.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const waveRadius = (elapsedTime - ripple.startTime) * params.waveSpeed;
  return waveRadius >= distance;
}

export function isRippleExpired(
  ripple: Ripple,
  elapsedTime: number,
  params: RippleParams = DEFAULT_RIPPLE_PARAMS,
): boolean {
  return elapsedTime - ripple.startTime > params.maxAge;
}
