import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { branches } from '../src/lotusGuides.ts'
import { lotusInfluence } from '../src/motion/lotusField.ts'
import { branchWindLoad, windArrivalDelay } from '../src/motion/wind.ts'

// Sample the real growth guides without a browser SVG dependency.
const stems = branches.map(({ d }) => {
  const numbers = d.match(/-?\d*\.?\d+/g).map(Number)
  let start = { x: numbers[0], y: numbers[1] }
  const points = [start]
  for (let i = 2; i < numbers.length; i += 6) {
    const [x1, y1, x2, y2, x3, y3] = numbers.slice(i, i + 6)
    for (let j = 1; j <= 100; j++) {
      const t = j / 100, u = 1 - t
      points.push({ x: u ** 3 * start.x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3,
        y: u ** 3 * start.y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3 })
    }
    start = { x: x3, y: y3 }
  }
  const lengths = [0]
  points.slice(1).forEach((p, i) => lengths.push(lengths[i] + Math.hypot(p.x - points[i].x, p.y - points[i].y)))
  const length = lengths.at(-1)
  const samples = Array.from({ length: 41 }, (_, i) => {
    const target = length * i / 40
    const index = Math.max(1, lengths.findIndex(value => value >= target))
    const a = points[index - 1], b = points[index]
    const t = (target - lengths[index - 1]) / (lengths[index] - lengths[index - 1])
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
  })
  const dx = samples[40].x - samples[0].x, dy = samples[40].y - samples[0].y
  const magnitude = Math.hypot(dx, dy)
  return { samples, length, nx: -dy / magnitude, ny: dx / magnitude }
})

const art = readFileSync(new URL('../src/assets/Lotus-vine.svg', import.meta.url), 'utf8')
const paths = [...art.matchAll(/<path\b[^>]*d="([^"]+)"[^>]*transform="translate\(([^)]+)\)"/g)].map(match => {
  const [tx, ty] = match[2].split(',').map(Number)
  const values = match[1].match(/-?\d*\.?\d+(?:e[-+]?\d+)?/g).map(Number)
  return Array.from({ length: values.length / 2 }, (_, i) => {
    const x = (values[i * 2] + tx) / 4, y = (values[i * 2 + 1] + ty) / 4
    return { x, y, response: lotusInfluence(stems, x, y) }
  })
})

test('actual lotus contours resist local pinching and stretching throughout maximum gusts', () => {
  const wind = { time: 0, mediumDuration: 1.65, highStart: 1.8, highDuration: 6.4,
    mediumPressure: 1.85 * 1.06, highPressure: 6 * 1.1, branchDeflection: 10 }
  let checked = 0
  for (const mirrored of [false, true]) {
    const direction = mirrored ? -1 : 1
    for (let time = 0; time < 10.3; time += 0.23) {
      for (const path of paths) {
        const moved = path.map(({ x, y, response }) => {
          const delay = windArrivalDelay(x, mirrored, response.lag)
          const load = branchWindLoad(wind, time - delay, response.lag)
          return { x: x + direction * load * response.gain, y: y + direction * load * response.vertical }
        })
        for (let i = 1; i < path.length; i++) {
          const original = Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y)
          if (original < 0.2 || original > 3) continue
          const changed = Math.hypot(moved[i].x - moved[i - 1].x, moved[i].y - moved[i - 1].y)
          assert.ok(changed / original > 0.75 && changed / original < 1.25,
            `Local contour distorted at ${time}s: scale ${changed / original}`)
          checked++
        }
      }
    }
  }
  assert.ok(checked > 10000)
})

test('root anchors stay fixed under load', () => {
  for (const y of [200, 260, 325]) assert.equal(lotusInfluence(stems, 0, y).gain, 0)
})
