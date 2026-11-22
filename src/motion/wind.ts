export type DepartureWind = {
  time: number
  mediumDuration: number
  highStart: number
  highDuration: number
  mediumPressure: number
  highPressure: number
  branchDeflection?: number
}

export function varyDepartureWind(wind: DepartureWind, random = Math.random): DepartureWind {
  return {
    ...wind,
    time: -1,
    mediumPressure: wind.mediumPressure * (0.94 + random() * 0.12),
    highPressure: wind.highPressure * (0.9 + random() * 0.2),
  }
}

export function windArrivalDelay(x: number, mirrored: boolean, lag = 0) {
  const screenX = mirrored ? 467 - x : x
  return screenX / 467 * 0.35 + (mirrored ? 0.25 : 0) + lag
}

export type FragmentKind = 'petal' | 'twig' | 'branch'

export function fractureThreshold(kind: FragmentKind, area: number, lever: number, random = Math.random) {
  const exposure = Math.min(1.4, Math.max(0.75, (area / 600) ** 0.25 * (lever / 80) ** 0.3))
  const strength = { petal: 2, twig: 3.2, branch: 5.2 }[kind]
  return strength / exposure * (0.86 + random() * 0.29)
}

export function accumulateFracture(damage: number, pressure: number, threshold: number, dt: number) {
  return Math.max(0, damage + (pressure > threshold ? (pressure / threshold - 1) * 6 : -0.25) * dt)
}

function pulse(time: number, start: number, duration: number) {
  const progress = (time - start) / duration
  if (progress <= 0 || progress >= 1) return 0
  return Math.sin(Math.PI * progress) ** 2
}

function heldPulse(time: number, start: number, duration: number) {
  const progress = (time - start) / duration
  if (progress <= 0 || progress >= 1) return 0
  const ease = (value: number) => (1 - Math.cos(Math.PI * value)) / 2
  if (progress < 0.2) return ease(progress / 0.2)
  if (progress <= 0.8) return 1
  return 1 - ease((progress - 0.8) / 0.2)
}

// The second wave builds, holds its load, and releases smoothly. The hold
// gives the branches time to show the weight of the wind before camera travel.
export function departurePressure(wind: DepartureWind, time = wind.time) {
  return wind.mediumPressure * pulse(time, 0, wind.mediumDuration)
    + wind.highPressure * heldPulse(time, wind.highStart, wind.highDuration)
}

// The early gust can recoil; the final push loads everything in the travel
// direction. Approach its crest smoothly instead of swinging back mid-crossing.
// Both ornaments and branches share this response, with material delays.
function directionalLoad(wind: DepartureWind, time: number, lag: number) {
  const medium = wind.mediumPressure * (pulse(time, 0, wind.mediumDuration)
    - 0.4 * pulse(time - 0.65, 0, wind.mediumDuration))
  const high = wind.highPressure * heldPulse(time, wind.highStart, wind.highDuration)
  const elapsed = Math.max(0, time - wind.highStart)
  const cycle = 2.2
  const responseTime = elapsed <= cycle ? elapsed
    : cycle + cycle / 4 * Math.tanh((elapsed - cycle) / (cycle / 4))
  const pendulum = 0.4 + 0.9 * Math.sin(responseTime * Math.PI * 2 / cycle - lag * 0.4)
  return { medium, high: high * pendulum }
}

export function branchWindLoad(wind: DepartureWind, time: number, lag: number) {
  const load = directionalLoad(wind, time, lag)
  const force = load.medium * 8 + load.high * (wind.branchDeflection ?? 10)
  // Stems stiffen progressively under load. Bound bending smoothly instead of
  // spreading deformation across unrelated branches to accommodate more force.
  return 55 * Math.tanh(force / 55)
}

export function ornamentWindSwing(wind: DepartureWind, time: number) {
  const load = directionalLoad(wind, time, 0)
  return load.medium + load.high * 1.25
}

export function ambientPendulum(phase: number, period: number) {
  const t = ((phase % period) + period) % period / period
  const ease = (value: number) => (1 - Math.cos(Math.PI * value)) / 2
  if (t < 0.27) return ease(t / 0.27)
  if (t < 0.64) return 1 - 1.45 * ease((t - 0.27) / 0.37)
  if (t < 0.9) return -0.45 + 0.45 * ease((t - 0.64) / 0.26)
  return 0
}
