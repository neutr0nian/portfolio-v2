import { readFileSync } from 'node:fs'
import test from 'node:test'
import assert from 'node:assert/strict'
import { accumulateFracture, ambientPendulum, branchWindLoad, departurePressure, ornamentWindSwing, fractureThreshold, varyDepartureWind, windArrivalDelay } from '../src/motion/wind.ts'

const wind = {
  time: 0,
  mediumDuration: 1.65,
  highStart: 1.8,
  highDuration: 5.4,
  mediumPressure: 1.65,
  highPressure: 4.3,
}

test('two waves remain separate, and the stronger second wave holds before travel', () => {
  assert.equal(departurePressure(wind, (wind.mediumDuration + wind.highStart) / 2), 0)
  assert.equal(departurePressure(wind, wind.mediumDuration / 2), wind.mediumPressure)
  for (const time of [3, 4, 4.9]) assert.equal(departurePressure(wind, time), wind.highPressure)
  assert.ok(departurePressure(wind, 7) < wind.highPressure)
})

test('branches swing both ways with a stronger rightward push and smooth recovery', () => {
  const samples = Array.from({ length: 211 }, (_, i) => branchWindLoad(wind, 3.1 + i * 0.01, 0.1))
  assert.ok(Math.max(...samples) > 40)
  assert.ok(Math.min(...samples) < -10)
  assert.ok(Math.max(...samples) > Math.abs(Math.min(...samples)) * 2)
  for (let i = 1; i < samples.length; i++) assert.ok(Math.abs(samples[i] - samples[i - 1]) < 2)
})

test('gust pressure starts and ends calmly, without an abrupt velocity change', () => {
  const epsilon = 0.0001
  for (const time of [0, wind.mediumDuration, wind.highStart, wind.highStart + wind.highDuration]) {
    assert.equal(departurePressure(wind, time), 0)
    assert.ok(departurePressure(wind, time + epsilon) / epsilon < 0.01)
    assert.ok(departurePressure(wind, time - epsilon) / epsilon < 0.01)
  }
  assert.equal(departurePressure(wind, -1), 0)
  assert.equal(departurePressure(wind, 9), 0)
})

test('traveling gust samples preserve their shape and delay their arrival', () => {
  const lag = 0.4
  const peak = wind.highStart + wind.highDuration * 0.2
  const delayed = time => departurePressure(wind, time - lag)
  assert.equal(delayed(lag / 2), 0)
  assert.ok(departurePressure(wind, lag / 2) > 0)
  assert.ok(delayed(wind.highStart + lag) < 1e-12)
  assert.equal(delayed(peak + lag), departurePressure(wind, peak))
  assert.ok(delayed(peak) < departurePressure(wind, peak))
})

test('wind stays within its intended force bounds', () => {
  for (let time = -1; time <= 9; time += 0.005) {
    const pressure = departurePressure(wind, time)
    assert.ok(pressure >= 0 && pressure <= wind.highPressure)
  }
})

test('ambient pendulum returns to rest and remains continuous across cycles', () => {
  assert.equal(ambientPendulum(0, 3), 0)
  assert.equal(ambientPendulum(3, 3), 0)
  assert.equal(ambientPendulum(2.95, 3), 0)
  assert.ok(ambientPendulum(0.81, 3) > 0.99)
  assert.ok(ambientPendulum(1.92, 3) < -0.44)
  for (const time of [0.1, 0.7, 1.2, 2.1]) {
    assert.ok(Math.abs(ambientPendulum(time, 3) - ambientPendulum(time + 3, 3)) < 1e-12)
  }
})

test('gust variation is bounded and never shifts the two-wave choreography', () => {
  const low = varyDepartureWind(wind, () => 0)
  const high = varyDepartureWind(wind, () => 1)
  assert.equal(low.highPressure, wind.highPressure * 0.9)
  assert.equal(high.highPressure, wind.highPressure * 1.1)
  assert.equal(low.mediumPressure, wind.mediumPressure * 0.94)
  for (const variation of [low, high]) {
    assert.equal(variation.highStart, wind.highStart)
    assert.equal(variation.highDuration, wind.highDuration)
    assert.equal(variation.time, -1)
  }
  assert.equal(wind.highPressure, 4.3)
})

test('the wind reaches the left side before the mirrored right vine', () => {
  assert.ok(windArrivalDelay(100, false) < windArrivalDelay(300, false))
  assert.ok(windArrivalDelay(300, true) < windArrivalDelay(100, true))
  assert.ok(windArrivalDelay(325, false) < windArrivalDelay(325, true))
  assert.equal(windArrivalDelay(0, false), 0)
})

test('larger exposed area and longer leverage raise stress; sturdy branches resist more', () => {
  const random = () => 0.5
  assert.ok(fractureThreshold('petal', 900, 100, random) < fractureThreshold('petal', 400, 30, random))
  assert.ok(fractureThreshold('branch', 900, 100, random) > fractureThreshold('petal', 900, 100, random))
})

test('release requires accumulated overload and does not happen during a weak gust', () => {
  let weak = 0, strong = 0
  for (let i = 0; i < 30; i++) {
    weak = accumulateFracture(weak, 1.65, 2.2, 1 / 60)
    strong = accumulateFracture(strong, 3.5, 2.2, 1 / 60)
  }
  assert.equal(weak, 0)
  assert.ok(strong > 0.15)
  assert.ok(accumulateFracture(0.1, 0, 2.2, 0.1) < 0.1)
})


test('ornaments recoil early, then approach a forward lean without reversing', () => {
  const values = Array.from({ length: 191 }, (_, i) => ornamentWindSwing(wind, 3.3 + i * 0.01))
  assert.ok(Math.max(...values) - Math.min(...values) > 3)
  assert.ok(Math.min(...values) < -1, 'the pendulum crosses rest on its softer recovery')
  assert.ok(Math.max(...values) > Math.abs(Math.min(...values)) * 2)
  const forward = Array.from({ length: 121 }, (_, i) => ornamentWindSwing(wind, 4 + i * 0.01))
  for (let i = 1; i < forward.length; i++) assert.ok(forward[i] >= forward[i - 1])
  assert.ok(forward.at(-1) > forward[0] * 2, 'the final push builds into a loaded lean')
  assert.equal(ornamentWindSwing(wind, 0), 0)
  assert.equal(ornamentWindSwing(wind, 8), 0)
})

test('the shipped strong gust keeps a rightward push and a softer recovery', () => {
  const tokens = readFileSync(new URL('../src/styles/_tokens.scss', import.meta.url), 'utf8')
  const token = name => Number(tokens.match(new RegExp(`${name}: ([0-9.]+)`))[1])
  const actual = { ...wind, highStart: token('--discover-high-start'),
    highDuration: token('--discover-high-duration'),
    mediumPressure: token('--discover-medium-pressure'), highPressure: token('--discover-high-pressure') }
  const start = token('--discover-travel-start')
  assert.ok(departurePressure(actual, start) >= actual.highPressure * 0.95)
  for (const lag of [0, 0.16, 0.6]) {
    const samples = Array.from({ length: 221 }, (_, i) => branchWindLoad(actual, 3.6 + i / 100 - lag, lag))
    assert.ok(Math.max(...samples) > 35)
    assert.ok(Math.min(...samples) < -10, 'branches must recoil, not ripple under a constant push')
    assert.ok(Math.max(...samples) > Math.abs(Math.min(...samples)) * 1.5)
  }
})

test('all delayed branches and hangings lean right for the full shipped crossing', () => {
  const tokens = readFileSync(new URL('../src/styles/_tokens.scss', import.meta.url), 'utf8')
  const token = name => Number(tokens.match(new RegExp(`${name}: ([0-9.]+)`))[1])
  const actual = { ...wind, highStart: token('--discover-high-start'),
    highDuration: token('--discover-high-duration'),
    mediumPressure: token('--discover-medium-pressure'), highPressure: token('--discover-high-pressure') }
  const start = token('--discover-travel-start')
  const end = start + token('--discover-travel-duration')
  for (let time = start; time <= end; time += 0.025) {
    for (const lag of [0, 0.08, 0.16]) {
      assert.ok(ornamentWindSwing(actual, time - lag) > 0)
    }
    for (const mirrored of [false, true]) for (const x of [0, 100, 230, 350, 467]) {
      for (const lag of [0, 0.14, 0.28]) {
        const delay = windArrivalDelay(x, mirrored, lag)
        assert.ok(branchWindLoad(actual, time - delay, lag) > 0,
          `branch reverses during travel at ${time}s, delay ${delay}s`)
      }
    }
  }
})
