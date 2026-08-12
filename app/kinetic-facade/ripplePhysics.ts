export type RippleDirection = "outward" | "inward";

export type Ripple = {
  x: number;
  y: number;
  startTime: number;
  toActive: boolean;
  direction: RippleDirection;
  maxDistance: number;
  hit: Uint8Array;
};

export type RippleParams = {
  waveSpeed: number;
  liftAngle: number;
  maxAge: number;
};

export const DEFAULT_RIPPLE_PARAMS: RippleParams = {
  waveSpeed: 8,
  liftAngle: Math.PI / 2.2,
  maxAge: 4,
};

export function createRipple(
  x: number,
  y: number,
  startTime: number,
  plateCount: number,
  toActive: boolean,
  direction: RippleDirection = "outward",
  maxDistance = 0,
): Ripple {
  return {
    x,
    y,
    startTime,
    toActive,
    direction,
    maxDistance,
    hit: new Uint8Array(plateCount),
  };
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
  const effectiveDistance =
    ripple.direction === "inward" ? ripple.maxDistance - distance : distance;
  const waveRadius = (elapsedTime - ripple.startTime) * params.waveSpeed;
  return waveRadius >= effectiveDistance;
}

export function isRippleExpired(
  ripple: Ripple,
  elapsedTime: number,
  params: RippleParams = DEFAULT_RIPPLE_PARAMS,
): boolean {
  return elapsedTime - ripple.startTime > params.maxAge;
}
