export type DissolveState = {
  progress: number;
  target: number;
};

export type DissolveParams = {
  rate: number;
};

export const DEFAULT_DISSOLVE_PARAMS: DissolveParams = {
  rate: 2,
};

export function stepDissolve(
  state: DissolveState,
  dt: number,
  params: DissolveParams = DEFAULT_DISSOLVE_PARAMS,
): DissolveState {
  const lerpFactor = Math.min(params.rate * dt, 1);
  const progress = state.progress + (state.target - state.progress) * lerpFactor;
  return { progress, target: state.target };
}
