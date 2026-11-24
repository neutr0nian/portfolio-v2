import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import patternSquare from '../assets/pattern-square.svg'
import { cornerStrandEnds } from '../artwork/patternStrands'
import HistoryContent, { type HistoryEntry } from './HistoryContent'
import './ScrollArtwork.scss'

const corners = [
  { name: 'top-left', x: 0, y: 0, turn: 270 },
  { name: 'top-right', x: 337, y: 0, turn: 0 },
  { name: 'bottom-left', x: 0, y: 337, turn: 180 },
  { name: 'bottom-right', x: 337, y: 337, turn: 90 },
] as const

function cornerTargets(width: number, height: number, preferredSize: number, inset: number) {
  const size = Math.min(preferredSize, (width - inset * 2) / 2)
  return corners.map(corner => ({
    x: corner.x === 0 ? inset : width - size - inset,
    y: corner.y === 0 ? inset : height - size - inset,
    width: size,
    height: size,
    viewBox: `${corner.x === 0 ? 137 : 337} ${corner.y === 0 ? 137 : 337} 200 200`,
  }))
}

function contentHeight(surface: HTMLElement) {
  const content = surface.querySelector<HTMLElement>('.history-content')!
  const entries = content.querySelector<HTMLElement>('.history-content__entries')!
  const styles = getComputedStyle(content)
  return Math.ceil(entries.offsetHeight + Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom))
}

export default function ScrollArtwork({ history, active }: { history: HistoryEntry[]; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const artworkRef = useRef<HTMLDivElement>(null)
  const rotatorRef = useRef<HTMLSpanElement>(null)
  const railsRef = useRef<SVGSVGElement>(null)
  const centerCutRef = useRef<SVGGElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const entranceRef = useRef<gsap.core.Timeline | null>(null)
  const openingRef = useRef<gsap.core.Timeline | null>(null)
  const clipId = useId().replaceAll(':', '')
  const [phase, setPhase] = useState<'idle' | 'opening' | 'revealing' | 'open'>('idle')

  useLayoutEffect(() => {
    const container = containerRef.current
    const rotator = rotatorRef.current
    if (!container || !rotator) return

    gsap.set(rotator, { rotation: -45, transformOrigin: '50% 50%' })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.set(rotator, { autoAlpha: 0, scale: 0.62 })
    return () => { entranceRef.current?.kill() }
  }, [])

  // Arrival owns the entrance: never start the motif while the camera moves.
  useLayoutEffect(() => {
    const container = containerRef.current
    const rotator = rotatorRef.current
    if (!active || phase !== 'idle' || !container || !rotator || entranceRef.current
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const duration = Number.parseFloat(getComputedStyle(container).getPropertyValue('--journey-art-entrance-duration'))
    entranceRef.current = gsap.timeline()
      .to(rotator, { autoAlpha: 1, duration: 0.65, ease: 'sine.out' })
      .to(rotator, { scale: 1, duration, ease: 'sine.inOut' }, 0)
  }, [active, phase])

  useEffect(() => () => {
    openingRef.current?.kill()
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    const surface = surfaceRef.current
    const rails = railsRef.current
    if ((phase !== 'revealing' && phase !== 'open') || !container || !surface || !rails) return
    let previousWidth = 0
    const observer = new ResizeObserver(() => {
      const width = container.clientWidth
      if (width === previousWidth) return
      previousWidth = width
      const styles = getComputedStyle(container)
      const height = contentHeight(surface)
      container.style.minHeight = `${height}px`
      container.style.height = `${height}px`
      const targets = cornerTargets(width, height,
        Number.parseFloat(styles.getPropertyValue('--journey-corner-size')),
        Number.parseFloat(styles.getPropertyValue('--journey-corner-inset')))
      rails.querySelectorAll('.scroll-artwork__piece').forEach((piece, index) => {
        gsap.set(piece, { attr: targets[index] })
      })
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [phase])

  const openScroll = useCallback(() => {
    const container = containerRef.current
    const artwork = artworkRef.current
    const rotator = rotatorRef.current
    const rails = railsRef.current
    const centerCut = centerCutRef.current
    const surface = surfaceRef.current
    const paper = paperRef.current
    if (!container || !artwork || !rotator || !rails || !centerCut || !surface || !paper || phase !== 'idle') return

    setPhase('opening')
    entranceRef.current?.kill()
    entranceRef.current = null

    const styles = getComputedStyle(container)
    const token = (name: string) => Number.parseFloat(styles.getPropertyValue(name))
    const openingScale = token('--journey-art-opening-scale')
    const artWidth = artwork.offsetWidth
    const artHeight = artwork.offsetHeight
    const stageWidth = container.clientWidth
    const scrollHeight = contentHeight(surface)
    const originalTop = artwork.getBoundingClientRect().top
    container.style.minHeight = `${scrollHeight}px`
    container.style.height = `${scrollHeight}px`
    const layoutOffset = originalTop - artwork.getBoundingClientRect().top
    const pieces = [...rails.querySelectorAll<SVGSVGElement>('.scroll-artwork__piece')]
    const tails = [...rails.querySelectorAll<SVGGElement>('.scroll-artwork__tails')]
    // The split pieces must match the enlarged motif exactly at the handoff.
    const splitWidth = artWidth * openingScale
    const splitHeight = artHeight * openingScale
    const startX = (stageWidth - splitWidth) / 2
    const startY = (artHeight - splitHeight) / 2
    pieces.forEach((piece, index) => gsap.set(piece, {
      attr: {
        x: startX + (corners[index].x === 0 ? 0 : splitWidth / 2),
        y: startY + (corners[index].y === 0 ? 0 : splitHeight / 2),
        width: splitWidth / 2,
        height: splitHeight / 2,
      },
    }))
    gsap.set(centerCut, { attr: { opacity: 0 } })
    gsap.set(tails, { attr: { opacity: 0 } })
    gsap.set(artwork, { y: layoutOffset })
    gsap.set(rails, { y: layoutOffset })
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const entries = Array.from(surface.querySelectorAll<HTMLElement>('.history-content__entry'))
    gsap.set(entries, { autoAlpha: 0 })
    gsap.set(surface, { autoAlpha: 1, y: layoutOffset, scaleX: 1, scaleY: 1 })
    gsap.set(paper, { autoAlpha: 0,
      scaleX: mobile ? 1 : 0.8, scaleY: mobile ? 0.8 : 1 })

    const targets = cornerTargets(stageWidth, scrollHeight,
      token('--journey-corner-size'), token('--journey-corner-inset'))

    const finish = () => {
      gsap.set(rotator, { rotation: 0, scale: openingScale, autoAlpha: 1 })
      gsap.set(centerCut, { attr: { opacity: 1 } })
      gsap.set(tails, { attr: { opacity: 1 } })
      gsap.set(rails, { autoAlpha: 1, y: 0 })
      gsap.set(surface, { autoAlpha: 1, y: 0, scaleX: 1, scaleY: 1 })
      gsap.set(paper, { autoAlpha: 1, scaleX: 1, scaleY: 1 })
      gsap.set(entries, { autoAlpha: 1 })
      gsap.set(artwork, { autoAlpha: 0, y: 0 })
      pieces.forEach((piece, index) => gsap.set(piece, { attr: targets[index] }))
      setPhase('open')
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return }

    const revealContent = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return }
      // Measure the real flex rows only after the paper and corners settle.
      // Entries retain their final layout and typography throughout the reveal.
      const ordered = [...entries].sort((a, b) => a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft)
      const rows: HTMLElement[][] = []
      ordered.forEach(entry => {
        const row = rows.at(-1)
        if (row && Math.abs(row[0].offsetTop - entry.offsetTop) < 2) row.push(entry)
        else rows.push([entry])
      })
      const reveal = gsap.timeline({ paused: true, onComplete: finish })
      rows.forEach((row, index) => {
        reveal.to(row, {
          autoAlpha: 1,
          duration: token('--journey-entry-fade-duration'),
          stagger: token('--journey-entry-stagger'),
          ease: 'sine.inOut',
        }, index === 0 ? token('--journey-content-delay') : `>+=${token('--journey-row-delay')}`)
      })
      openingRef.current = reveal
      setPhase('revealing')
    }

    // Four clipped views exactly reconstruct the original artwork before they move.
    const timeline = gsap.timeline({ onComplete: revealContent })
      .to(rotator, { rotation: 0, scale: openingScale, autoAlpha: 1, duration: 1.65, ease: 'sine.inOut' })
      .set(rails, { autoAlpha: 1 })
      .set(artwork, { autoAlpha: 0 })
      .to(centerCut, { attr: { opacity: 1 }, duration: 1.15, ease: 'sine.inOut' })
      .to(tails, { attr: { opacity: 1 }, duration: 0.5, ease: 'sine.inOut' }, '-=0.5')
      .to([pieces[0], pieces[1]], { attr: { y: startY - 14 }, duration: 1, ease: 'sine.inOut' })
      .to([pieces[2], pieces[3]], { attr: { y: startY + splitHeight / 2 + 14 }, duration: 1, ease: 'sine.inOut' }, '<')
    pieces.forEach((piece, index) => {
      timeline.to(piece, { attr: targets[index], duration: 2.4, ease: 'sine.inOut' }, index === 0 ? '>' : '<')
    })
    timeline.timeScale(1.2)
    openingRef.current = timeline
      .to([rails, surface], { y: 0, duration: 2.4, ease: 'sine.inOut' }, '<')
      .to(paper, { autoAlpha: 1, scaleX: 1, scaleY: 1, duration: 1.5, ease: 'sine.inOut' }, '-=1.5')
  }, [phase])

  useEffect(() => {
    if (!active || phase !== 'idle') return
    const container = containerRef.current
    if (!container) return
    const delay = Number.parseFloat(getComputedStyle(container).getPropertyValue('--journey-reveal-delay'))
    const timer = gsap.delayedCall(delay, openScroll)
    const syncVisibility = () => timer.paused(document.hidden)
    document.addEventListener('visibilitychange', syncVisibility)
    syncVisibility()
    return () => {
      timer.kill()
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [active, phase, openScroll])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      const paused = !active || document.hidden
      entranceRef.current?.paused(paused)
      openingRef.current?.paused(paused)
    }
    const syncPreference = () => {
      if (reduced.matches && (phase === 'opening' || phase === 'revealing')) openingRef.current?.progress(1)
    }
    document.addEventListener('visibilitychange', syncMotion)
    reduced.addEventListener('change', syncPreference)
    syncMotion()
    syncPreference()
    return () => {
      document.removeEventListener('visibilitychange', syncMotion)
      reduced.removeEventListener('change', syncPreference)
    }
  }, [active, phase])

  return (
    <div className={`scroll-artwork${phase !== 'idle' ? ' scroll-artwork--opening' : ''}${phase === 'open' ? ' scroll-artwork--open' : ''}`} ref={containerRef} data-phase={phase} aria-busy={phase === 'opening' || phase === 'revealing'}>
      <div className="scroll-artwork__surface" ref={surfaceRef}>
        <div className="scroll-artwork__paper" ref={paperRef} aria-hidden="true" />
        <HistoryContent data={history} />
      </div>
      <svg className="scroll-artwork__rails" ref={railsRef} aria-hidden="true">
        <defs>
          {corners.map(corner => (
            <clipPath key={corner.name} id={`${clipId}-${corner.name}`} clipPathUnits="userSpaceOnUse">
              <rect x={corner.x} y={corner.y} width="337" height="337" />
            </clipPath>
          ))}
          <mask id={`${clipId}-center`} maskUnits="userSpaceOnUse" x="0" y="0" width="674" height="674">
            <rect width="674" height="674" fill="white" />
            <g ref={centerCutRef} opacity="0">
              <rect width="674" height="674" fill="black" />
              <g transform="rotate(45 337 337) translate(93 105)" fill="white">
                {[0, 90, 180, 270].map(angle => (
                  <path key={angle} d="M182 18 H306 V88 L244 150 L182 88 Z"
                    transform={`rotate(${angle} 244 232)`} />
                ))}
              </g>
            </g>
          </mask>
        </defs>
        {corners.map(corner => (
          <svg key={corner.name} className="scroll-artwork__piece" viewBox={`${corner.x} ${corner.y} 337 337`} preserveAspectRatio="xMidYMid meet">
            <g clipPath={`url(#${clipId}-${corner.name})`}>
              <g mask={`url(#${clipId}-center)`}>
                <image href={patternSquare} x="93" y="105" width="488" height="464" transform="rotate(45 337 337)" />
              </g>
              <g className="scroll-artwork__tails" opacity="0" transform={`rotate(${corner.turn} 337 337)`}>
                {cornerStrandEnds.map(d => <path key={d} d={d} fill="var(--color-warli)" />)}
              </g>
            </g>
          </svg>
        ))}
      </svg>
      <div className="scroll-artwork__motif" ref={artworkRef} role="img"
        aria-label="Interlaced lotus pattern" aria-hidden={phase !== 'idle'}>
        <span className="scroll-artwork__rotator" ref={rotatorRef}>
          <svg viewBox="0 0 674 674" aria-hidden="true">
            <image href={patternSquare} x="93" y="105" width="488" height="464" transform="rotate(45 337 337)" />
          </svg>
        </span>
      </div>
      {phase === 'open' && <span className="scroll-artwork__complete" role="status">Journey scroll opened</span>}
    </div>
  )
}
