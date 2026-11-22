import { useEffect, useRef } from 'react'
import './InkCursor.scss'

const surfaces = '.work-scroll__paper, .button, .scene-navigation__link, .social-icon-button'

export default function InkCursor() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dot = ref.current
    if (!dot) return
    const root = document.documentElement
    const allowed = matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)')
    let surface: HTMLElement | null = null
    let frame = 0
    let x = 0, y = 0, tailX = 0, tailY = 0, previousTime = 0

    function clear() {
      cancelAnimationFrame(frame)
      frame = 0
      delete root.dataset.inkCursor
      surface?.removeAttribute('data-ink-contact')
      surface = null
    }

    function draw(time: number) {
      const follow = 1 - Math.exp(-Math.min(64, time - previousTime) / 42)
      previousTime = time
      tailX += (x - tailX) * follow
      tailY += (y - tailY) * follow
      const distance = Math.hypot(x - tailX, y - tailY)
      dot!.style.transform = `translate3d(${tailX}px, ${tailY}px, 0) translate(-50%, -50%)`
      frame = distance > 0.12 ? requestAnimationFrame(draw) : 0
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !allowed.matches) {
        if (root.dataset.inkCursor) clear()
        return
      }
      x = event.clientX
      y = event.clientY
      if (!root.dataset.inkCursor) {
        tailX = x
        tailY = y
        root.dataset.inkCursor = 'active'
      }
      if (!frame) {
        previousTime = performance.now()
        frame = requestAnimationFrame(draw)
      }
      const target = event.target instanceof Element ? event.target : null
      const next = target?.closest<HTMLElement>(surfaces) ?? null
      const enabled = next?.closest('[inert], :disabled, [aria-disabled="true"]') ? null : next
      if (enabled === surface) return
      surface?.removeAttribute('data-ink-contact')
      surface = enabled
      if (surface) {
        const bounds = surface.getBoundingClientRect()
        surface.style.setProperty('--ink-x', `${x - bounds.left}px`)
        surface.style.setProperty('--ink-y', `${y - bounds.top}px`)
        surface.dataset.inkContact = ''
      }
    }

    const leave = (event: PointerEvent) => { if (!event.relatedTarget) clear() }
    const events = new AbortController()
    const options = { passive: true, signal: events.signal }
    window.addEventListener('pointermove', move, options)
    window.addEventListener('pointerover', move, options)
    window.addEventListener('pointerout', leave, options)
    window.addEventListener('blur', clear, options)
    document.addEventListener('visibilitychange', clear, options)
    allowed.addEventListener('change', clear, options)
    return () => { events.abort(); clear() }
  }, [])

  return <span ref={ref} className="ink-cursor" aria-hidden="true" />
}
