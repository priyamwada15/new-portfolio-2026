export type PlateSwingState = {
  angle: number;
  angularVelocity: number;
  targetAngle: number;
};

export type PendulumParams = {
  stiffness: number;
  damping: number;
  maxAngle: number;
};

export const DEFAULT_PENDULUM_PARAMS: PendulumParams = {
  stiffness: 36,
  damping: 6.36,
  maxAngle: Math.PI / 2.2,
};

export function stepPendulum(
  state: PlateSwingState,
  windTorque: number,
  dt: number,
  params: PendulumParams = DEFAULT_PENDULUM_PARAMS,
): PlateSwingState {
  const restoringTorque = -params.stiffness * (state.angle - state.targetAngle);
  const dampingTorque = -params.damping * state.angularVelocity;
  const angularAcceleration = restoringTorque + dampingTorque + windTorque;

  const angularVelocity = state.angularVelocity + angularAcceleration * dt;
  let angle = state.angle + angularVelocity * dt;
  angle = Math.max(-params.maxAngle, Math.min(params.maxAngle, angle));

  return { angle, angularVelocity, targetAngle: state.targetAngle };
}
