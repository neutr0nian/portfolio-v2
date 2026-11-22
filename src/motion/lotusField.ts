export type Influence = { gain: number; lag: number; vertical: number }
export type Stem = { length: number; samples: { x: number; y: number }[]; nx: number; ny: number }

// Evaluate once per source coordinate, then reuse every animation frame.
export function lotusInfluence(stems: Stem[], x: number, y: number): Influence {
  let total = 0, gain = 0, lag = 0, vertical = 0
  for (const stem of stems) {
    // Blend the whole beam over a broad material neighborhood. Selecting
    // the closest branch (even continuously) creates ridges where ownership
    // switches, which magnifies into wrinkles along thin traced stems.
    const compliance = Math.min(2.5, (stem.length / 180) ** 3)
    const transverse = 0.15 + 0.85 * stem.nx ** 2
    stem.samples.forEach((point, j) => {
      const distance = (x - point.x) ** 2 + (y - point.y) ** 2
      const weight = Math.exp(-distance / (2 * 75 ** 2))
      const along = j / (stem.samples.length - 1)
      const bend = along * along * (3 - along) / 2
      total += weight
      gain += weight * compliance * bend * transverse
      lag += weight * Math.min(0.28, 0.08 * (stem.length / 180) ** 2)
      vertical += weight * compliance * bend * stem.nx * stem.ny * 0.3
    })
  }
  const anchor = Math.min(1, Math.max(0, x / 65)) ** 2
  return { gain: gain / total * anchor, lag: lag / total, vertical: vertical / total * anchor }
}
