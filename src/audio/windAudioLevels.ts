import { departurePressure, ornamentWindSwing, type DepartureWind } from '../motion/wind.ts'

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t) }

/** Gains for levelled wind textures, driven by the same force as the artwork. */
export function windAudioLevels(wind: DepartureWind) {
  const time = wind.time
  if (time < 0) return { breeze: 0, heavy: 0 }
  const medium = time < wind.mediumDuration
    ? wind.mediumPressure / 1.85 * Math.sin(Math.PI * time / wind.mediumDuration) ** 2 : 0
  // Keep a soft air bed across the boundary while the heavier wind builds.
  const bridge = 0.3 * smooth((time - wind.mediumDuration * 0.6) / 0.35)
    * (1 - smooth((time - wind.highStart) / 0.65))
  const breeze = 0.3 * clamp(Math.max(medium, bridge))
  if (time < wind.highStart) return { breeze, heavy: 0 }
  const pressure = departurePressure(wind) / 6
  // Average the hanging responses so the audible push follows their propagation
  // rather than jumping to one branch's phase. Recovery remains audible, softer.
  const movement = [0, 0.08, 0.16].reduce((sum, lag) =>
    sum + Math.abs(ornamentWindSwing(wind, time - lag)), 0) / (3 * 6 * 1.25 * 1.3)
  return { breeze, heavy: 0.68 * clamp(0.18 * pressure + 0.82 * movement) }
}
