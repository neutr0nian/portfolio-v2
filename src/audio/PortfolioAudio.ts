import type { DepartureWind } from '../motion/wind'
import { windAudioLevels } from './windAudioLevels.ts'

export type SoundName = 'click' | 'breeze' | 'heavy'
type Voice = { source: AudioBufferSourceNode; gain: GainNode }

/** Sound follows the animation clock, including pauses and interrupted travel. */
export class PortfolioAudio {
  private context: AudioContext
  private buffers = new Map<SoundName, AudioBuffer>()
  private click: Voice | null = null
  private wind = new Map<SoundName, Voice & { expectedTime: number; rate: number }>()
  private disposed = false

  constructor(context: AudioContext) {
    this.context = context
  }

  async load(files: Record<SoundName, string>) {
    await Promise.allSettled(Object.entries(files).map(async ([name, url]) => {
      const response = await fetch(url)
      if (!response.ok) return
      const buffer = await this.context.decodeAudioData(await response.arrayBuffer())
      if (!this.disposed) this.buffers.set(name as SoundName, buffer)
    }))
  }

  /** Call synchronously within a real button activation to unlock browser audio. */
  playClick() {
    if (this.disposed) return
    void this.context.resume().then(() => {
      if (this.disposed) return
      this.stop(this.click)
      this.click = this.play('click', 0, 1, 0.65)
    }).catch(() => { /* Audio restrictions must never block navigation. */ })
  }

  syncWind(wind: DepartureWind) {
    const { time, highStart } = wind
    if (this.disposed || this.context.state !== 'running') return
    if (time < 0) {
      this.stopWind()
      return
    }
    const breeze = this.buffers.get('breeze')
    const levels = windAudioLevels(wind)
    // Let the breeze tail overlap the heavy sample's gentle attack. No silent
    // gap and no hard handoff, while the heavy gust still starts on its cue.
    this.syncVoice('breeze', time, breeze ? breeze.duration / (highStart + 0.65) : 1, levels.breeze)
    this.syncVoice('heavy', time - highStart, 1, levels.heavy)
  }

  private syncVoice(name: SoundName, elapsed: number, rate: number, volume: number) {
    const buffer = this.buffers.get(name)
    const offset = elapsed * rate
    if (!buffer || elapsed < 0 || offset >= buffer.duration) {
      this.stop(this.wind.get(name) ?? null)
      this.wind.delete(name)
      return
    }
    const audioNow = this.context.currentTime
    const previous = this.wind.get(name)
    if (previous && Math.abs(previous.expectedTime - (audioNow - elapsed)) < 0.12) {
      const tail = Math.min(1, (buffer.duration - offset) / rate / 0.08)
      previous.gain.gain.cancelAndHoldAtTime(audioNow)
      previous.gain.gain.setTargetAtTime(volume * tail, audioNow, 0.05)
      return
    }
    this.stop(previous ?? null)
    const voice = this.play(name, offset, rate, volume)
    if (voice) this.wind.set(name, { ...voice, expectedTime: audioNow - elapsed, rate })
  }

  /** Continue the current air texture into the next scene, without restarting it. */
  settleWind(duration: number) {
    const now = this.context.currentTime
    this.wind.forEach((voice, name) => {
      const buffer = this.buffers.get(name)
      const remaining = (buffer?.duration ?? 0) / voice.rate - (now - voice.expectedTime)
      const release = Math.min(duration, remaining - 0.03)
      if (release <= 0) { this.stop(voice); return }
      voice.gain.gain.cancelAndHoldAtTime(now)
      const level = voice.gain.gain.value
      const curve = Float32Array.from({ length: 65 }, (_, i) => {
        const t = i / 64
        return level * (1 - t) ** 2 * (1 + 2 * t)
      })
      voice.gain.gain.setValueCurveAtTime(curve, now, release)
      voice.source.stop(now + release + 0.025)
    })
  }

  stopWind() {
    this.wind.forEach(voice => this.stop(voice))
    this.wind.clear()
  }

  stopAll() {
    this.stopWind()
    this.stop(this.click)
    this.click = null
  }

  dispose() {
    this.disposed = true
    this.stopAll()
    this.buffers.clear()
    void this.context.close().catch(() => {})
  }

  private play(name: SoundName, offset: number, rate: number, volume: number): Voice | null {
    const buffer = this.buffers.get(name)
    if (!buffer || this.context.state !== 'running') return null
    const source = this.context.createBufferSource()
    const gain = this.context.createGain()
    source.buffer = buffer
    source.playbackRate.value = rate
    const now = this.context.currentTime
    const remaining = (buffer.duration - offset) / rate
    // Small fades also make pause/resume and late asset loading click-free.
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(volume, now + Math.min(0.025, remaining / 3))
    gain.gain.setValueAtTime(volume, now + Math.max(remaining / 3, remaining - 0.08))
    gain.gain.linearRampToValueAtTime(0, now + remaining)
    source.connect(gain)
    gain.connect(this.context.destination)
    source.onended = () => { source.disconnect(); gain.disconnect() }
    source.start(now, offset)
    return { source, gain }
  }

  private stop(voice: Voice | null) {
    if (!voice) return
    const now = this.context.currentTime
    voice.gain.gain.cancelAndHoldAtTime(now)
    voice.gain.gain.linearRampToValueAtTime(0, now + 0.02)
    voice.source.stop(now + 0.025)
  }
}

