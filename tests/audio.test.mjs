import test from 'node:test'
import assert from 'node:assert/strict'
import { windAudioLevels } from '../src/audio/windAudioLevels.ts'
import { PortfolioAudio } from '../src/audio/PortfolioAudio.ts'

const gust = time => ({ time, mediumDuration: 1.65, highStart: 1.8, highDuration: 6.4,
  mediumPressure: 1.85, highPressure: 6, branchDeflection: 10 })

async function fixture(t) {
  const voices = []
  const context = {
    state: 'suspended', currentTime: 0, destination: {},
    resume: async () => { context.state = 'running' },
    close: async () => { context.state = 'closed' },
    decodeAudioData: async data => ({ duration: [0.16, 2.2, 7.2][new Uint8Array(data)[0]] }),
    createBufferSource: () => {
      const voice = { playbackRate: { value: 1 }, connect() {}, disconnect() {},
        start: (...args) => { voice.started = args }, stop: at => { voice.stopped = true; voice.stopAt = at } }
      voices.push(voice)
      return voice
    },
    createGain: () => {
      const param = { value: 0, curve: null,
        setValueAtTime(value) { param.value = value }, linearRampToValueAtTime() {},
        cancelAndHoldAtTime() {}, setTargetAtTime(value) { param.value = value },
        setValueCurveAtTime(curve, at, duration) { param.curve = { values: curve, at, duration } },
      }
      const gain = { connect() {}, disconnect() {}, gain: param }
      voices.at(-1).gainNode = gain
      return gain
    },
  }
  const audio = new PortfolioAudio(context)
  t.mock.method(globalThis, 'fetch', async name => ({ ok: true, arrayBuffer: async () => Uint8Array.of(['click', 'breeze', 'heavy'].indexOf(name)).buffer }))
  await audio.load({ click: 'click', breeze: 'breeze', heavy: 'heavy' })
  t.after(() => audio.dispose())
  return { audio, context, voices }
}

test('loading sounds stays silent until a button interaction unlocks audio', async t => {
  const { audio, voices } = await fixture(t)
  audio.syncWind(gust(0.3))
  assert.equal(voices.length, 0)
  audio.playClick()
  await Promise.resolve()
  assert.equal(voices.length, 1)
  assert.equal(voices[0].started[1], 0)
})

test('wind crossfades across the wave boundary without frame-by-frame restarts', async t => {
  const { audio, context, voices } = await fixture(t)
  context.state = 'running'
  audio.syncWind(gust(0.2))
  assert.equal(voices.length, 1)
  assert.equal(voices[0].playbackRate.value, 2.2 / (1.8 + 0.65))
  context.currentTime += 0.3
  audio.syncWind(gust(0.5))
  assert.equal(voices.length, 1)
  context.currentTime = 1.5
  audio.syncWind(gust(1.7))
  assert.equal(voices[0].stopped, undefined)
  context.currentTime = 1.6
  audio.syncWind(gust(1.8))
  assert.equal(voices.length, 2)
  assert.equal(voices[1].playbackRate.value, 1)
  assert.equal(voices[1].started[1], 0)
  assert.equal(voices[0].stopped, undefined, 'breeze remains audible underneath the heavy attack')
  context.currentTime = 2.3
  audio.syncWind(gust(2.5))
  assert.equal(voices[0].stopped, true)
})

test('pausing or interrupting wind stops it; resuming uses the current sample offset', async t => {
  const { audio, context, voices } = await fixture(t)
  context.state = 'running'
  audio.syncWind(gust(2.8))
  audio.stopAll()
  assert.equal(voices[0].stopped, true)
  context.currentTime += 12
  audio.syncWind(gust(2.8))
  assert.equal(voices.length, 2)
  assert.ok(Math.abs(voices[1].started[1] - 1) < 1e-10)
  audio.syncWind(gust(10))
  assert.equal(voices[1].stopped, true)
})

test('disposing audio prevents late button playback or wind restarts', async t => {
  const { audio, context, voices } = await fixture(t)
  audio.playClick()
  audio.dispose()
  await Promise.resolve()
  audio.syncWind(gust(0.5))
  assert.equal(context.state, 'closed')
  assert.equal(voices.length, 0)
})

test('audio peaks follow visible gust forces and soften on branch recovery', () => {
  assert.equal(windAudioLevels(gust(0)).breeze, 0)
  assert.equal(windAudioLevels(gust(0.825)).breeze, 0.3)
  assert.equal(windAudioLevels(gust(1.7)).heavy, 0)
  assert.ok(windAudioLevels(gust(1.7)).breeze > 0, 'retain air under the handoff')
  const push = windAudioLevels(gust(4.65)).heavy
  const recovery = windAudioLevels(gust(3.5)).heavy
  assert.ok(push > recovery * 1.7)
  assert.ok(push > 0.6 && push <= 0.68)
  assert.ok(windAudioLevels({ ...gust(3), highPressure: 6.6 }).heavy
    > windAudioLevels({ ...gust(3), highPressure: 5.4 }).heavy)
  for (let time = 0; time < 9; time += 0.01) {
    const { breeze, heavy } = windAudioLevels(gust(time))
    assert.ok(breeze >= 0 && heavy >= 0 && breeze + heavy <= 0.98)
  }
})

test('arrival keeps the existing wind voice and gently releases it into the next scene', async t => {
  const { audio, context, voices } = await fixture(t)
  context.state = 'running'
  context.currentTime = 6.5
  audio.syncWind(gust(6.5))
  context.currentTime = 6.6
  audio.syncWind(gust(6.6))
  const voice = voices[0]
  const before = voice.gainNode.gain.value
  audio.settleWind(2.2)
  assert.equal(voices.length, 1, 'continue the same texture instead of replaying the gust')
  const { values, duration } = voice.gainNode.gain.curve
  assert.ok(before > 0.1)
  assert.ok(Math.abs(values[0] - before) < 1e-6)
  assert.equal(values.at(-1), 0)
  assert.equal(duration, 2.2)
  for (let i = 1; i < values.length; i++) assert.ok(values[i] <= values[i - 1])
  assert.ok(voice.stopAt > 8.8, 'sound continues beyond the 6.6s slide arrival')
  audio.stopAll()
  assert.ok(voice.stopAt < 6.7, 'hiding or leaving still interrupts the release')
})
