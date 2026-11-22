import source from './assets/Lotus-vine.svg?raw'
import { lotusInfluence, type Influence, type Stem } from './motion/lotusField'
import { ambientPendulum, branchWindLoad, windArrivalDelay, type DepartureWind } from './motion/wind'

// Normalize the trace into its existing 467 × 701 coordinate space.
// Every path uses absolute M/C/Z commands; refuse unfamiliar geometry.
export const lotusPaths = [...source.matchAll(/<path\b[^>]*d="([^"]+)"[^>]*transform="translate\(([^)]+)\)"/g)].map(match => {
  const [tx, ty] = match[2].split(',').map(Number)
  const commands = match[1].match(/[MCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi)!
  let axis = 0
  return commands.map(value => {
    if (/^[MCZ]$/.test(value)) { axis = 0; return value }
    return (Number(value) + (axis++ % 2 === 0 ? tx : ty)) / 4
  })
})

// The physics-driven bend is the default landing behavior.
export const naturalLotusMotion = true

const influences = new Map<(string | number)[], Map<number, Influence>>()
let stems: Stem[] = []

export function prepareLotusWind(guides: { d: string }[]) {
  if (stems.length) return
  stems = guides.map(({ d }) => {
    const curve = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    curve.setAttribute('d', d)
    const length = curve.getTotalLength()
    const samples = Array.from({ length: 41 }, (_, i) => curve.getPointAtLength(length * i / 40))
    const start = samples[0], end = samples[40]
    const dx = end.x - start.x, dy = end.y - start.y
    const magnitude = Math.hypot(dx, dy) || 1
    return { length, samples, nx: -dy / magnitude, ny: dx / magnitude }
  })
  registerLotusShapes(lotusPaths)
}

// Tear boundaries follow the same material field as the artwork they cut.
export function registerLotusShapes(paths: (string | number)[][]) {
  for (const path of paths) {
    if (influences.has(path)) continue
    const field = new Map<number, Influence>()
    for (let i = 0; i < path.length; i++) {
      if (typeof path[i] !== 'number') continue
      const x = path[i] as number, y = path[i + 1] as number
      field.set(i, lotusInfluence(stems, x, y))
      i++
    }
    influences.set(path, field)
  }
}

export function releaseLotusShapes(paths: (string | number)[][]) {
  paths.forEach(path => { if (!lotusPaths.includes(path)) influences.delete(path) })
}

// A single continuous displacement field keeps neighboring outlines together.
// This is a restrained bending prototype, not a per-petal physics simulation.
export function bendLotus(path: (string | number)[], phase: number, mirrored: boolean, gust?: DepartureWind, ambientWeight = gust ? 0 : 1) {
  const direction = mirrored ? -1 : 1
  return path.map((value, index) => {
    if (typeof value === 'string') return value
    // Coordinates occur in x/y pairs between command letters.
    const previous = path[index - 1]
    let start = index
    while (start > 0 && typeof path[start - 1] === 'number') start--
    const isX = (index - start) % 2 === 0
    const x = isX ? value : previous as number
    const response = influences.get(path)?.get(isX ? index : index - 1)
    if (!response) return value
    const delay = windArrivalDelay(x, mirrored, response.lag)
    const envelope = ambientPendulum(phase - delay, 3)
    // Gust pressure uses the same branch field, anchors and propagation delay.
    // Increasing force never separates a flower from its connected stem.
    const load = (envelope * 8 * ambientWeight) + (gust ? branchWindLoad(gust, gust.time - delay, response.lag) : 0)
    return (value + load * (isX ? direction * response.gain : direction * response.vertical)).toFixed(3)
  }).join(' ')
}
