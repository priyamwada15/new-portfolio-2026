export type PlatePosition = { x: number; y: number };

export type WindFieldParams = {
  radius: number;
  strength: number;
};

export const DEFAULT_WIND_FIELD_PARAMS: WindFieldParams = {
  radius: 2.5,
  strength: 25,
};

export function computeWindTorque(
  platePosition: PlatePosition,
  pointerPosition: PlatePosition | null,
  params: WindFieldParams = DEFAULT_WIND_FIELD_PARAMS,
): number {
  if (!pointerPosition) return 0;

  const dx = platePosition.x - pointerPosition.x;
  const dy = platePosition.y - pointerPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= params.radius) return 0;

  const falloff = 1 - distance / params.radius;
  return params.strength * falloff * falloff;
}
