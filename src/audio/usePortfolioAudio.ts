import { useLayoutEffect, useRef } from 'react'
import { PortfolioAudio } from './PortfolioAudio'
import click from '../assets/audio/button-click.wav'
import breeze from '../assets/audio/subtle-breeze.wav'
import heavy from '../assets/audio/heavy-wind.wav'

export default function usePortfolioAudio() {
  const audio = useRef<PortfolioAudio | null>(null)

  useLayoutEffect(() => {
    if (!window.AudioContext) return
    const sound = new PortfolioAudio(new AudioContext())
    audio.current = sound
    void sound.load({ click, breeze, heavy })
    const visibility = () => { if (document.hidden) sound.stopAll() }
    document.addEventListener('visibilitychange', visibility)
    return () => {
      document.removeEventListener('visibilitychange', visibility)
      sound.dispose()
      if (audio.current === sound) audio.current = null
    }
  }, [])

  return audio
}
