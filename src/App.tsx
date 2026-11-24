import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import LandingSection from './components/LandingSection'
import JourneySection from './components/JourneySection'
import WorksSection from './components/WorksSection'
import SocialSection from './components/SocialSection'
import InkCursor from './components/InkCursor'
import SceneNavigation from './components/SceneNavigation'
import useLandingMotion from './motion/useLandingMotion'
import usePortfolioAudio from './audio/usePortfolioAudio'
import './App.scss'

const views = ['landing', 'journey', 'works', 'social'] as const
type View = typeof views[number]
const titles: Record<View, string> = { landing: 'landing-title', journey: 'journey-title', works: 'works-title', social: 'social-title' }

export default function App() {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const landingRef = useRef<HTMLElement>(null)
  const transitionRef = useRef<gsap.core.Timeline | null>(null)
  const navigatingRef = useRef(false)
  const focusRequestedRef = useRef(false)
  const [view, setView] = useState<View>('landing')
  const [navigating, setNavigating] = useState(false)
  const audio = usePortfolioAudio()
  const motion = useLandingMotion(landingRef, view === 'landing', audio)

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      if (reduced.matches && navigatingRef.current) transitionRef.current?.progress(1)
    }
    const updateVisibility = () => {
      if (navigatingRef.current) transitionRef.current?.paused(document.hidden)
    }
    reduced.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      transitionRef.current?.kill()
      reduced.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  useLayoutEffect(() => {
    if (!focusRequestedRef.current) return
    focusRequestedRef.current = false
    rootRef.current?.querySelector<HTMLElement>(`#${titles[view]}`)?.focus({ preventScroll: true })
  }, [view])

  const navigate = (destination: View, withWind = false) => {
    const track = trackRef.current
    if (!track || destination === view || navigatingRef.current) return
    navigatingRef.current = true
    setNavigating(true)
    audio.current?.stopWind()
    const arrive = () => {
      focusRequestedRef.current = true
      navigatingRef.current = false
      setView(destination)
      setNavigating(false)
    }
    const xPercent = -views.indexOf(destination) * 100
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(track, { xPercent })
      arrive()
      return
    }

    transitionRef.current?.kill()
    const transition = gsap.timeline({ paused: true, onComplete: arrive })
    const departure = withWind ? motion.current?.depart() : undefined
    if (departure) {
      transition.add(departure.timeline, 0)
    }
    transition.to(track, {
      xPercent,
      duration: departure?.travelDuration ?? 1.25,
      ease: 'sine.inOut',
    }, departure?.travelAt ?? 0)
    transitionRef.current = transition
    transition.play()
  }

  return (
    <main className="portfolio" ref={rootRef} data-view={view} data-transitioning={navigating} aria-busy={navigating}
      onClickCapture={event => {
        const button = (event.target as Element).closest('button')
        if (button && !button.disabled && button.getAttribute('aria-disabled') !== 'true') audio.current?.playClick()
      }}>
      <InkCursor />
      <div className="portfolio__track" ref={trackRef}>
        <div className="portfolio__view portfolio__view--landing" inert={navigating || view !== 'landing'} aria-hidden={view !== 'landing'}>
          <LandingSection rootRef={landingRef} onDiscover={() => navigate('journey', true)} departing={navigating && view === 'landing'} />
        </div>
        <div className="portfolio__view portfolio__view--journey" id="journey-view" inert={navigating || view !== 'journey'} aria-hidden={view !== 'journey'}>
          <SceneNavigation back={{ label: 'Back', onClick: () => navigate('landing') }}
            next={{ label: 'Explore', onClick: () => navigate('works') }} />
          <JourneySection active={view === 'journey' && !navigating} />
        </div>
        <div className="portfolio__view" id="works-view" inert={navigating || view !== 'works'} aria-hidden={view !== 'works'}>
          <SceneNavigation back={{ label: 'My journey', onClick: () => navigate('journey') }}
            next={{ label: 'Elsewhere', onClick: () => navigate('social') }} />
          <WorksSection />
        </div>
        <div className="portfolio__view" id="social-view" inert={navigating || view !== 'social'} aria-hidden={view !== 'social'}>
          <SceneNavigation back={{ label: 'My works', onClick: () => navigate('works') }}
            next={{ label: 'Back to nature', onClick: () => navigate('landing') }} />
          <SocialSection />
        </div>
      </div>
    </main>
  )
}
