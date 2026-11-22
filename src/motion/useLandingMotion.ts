import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { branches } from '../lotusGuides'
import { bendLotus, lotusPaths, naturalLotusMotion, prepareLotusWind } from '../lotusWind'
import { ambientPendulum, ornamentWindSwing, varyDepartureWind, type DepartureWind } from './wind'
import type { PortfolioAudio } from '../audio/PortfolioAudio'

export type LandingDeparture = {
  timeline: gsap.core.Timeline
  travelAt: number
  travelDuration: number
}
type LandingMotion = { depart: () => LandingDeparture; sync: () => void }

export default function useLandingMotion(rootRef: RefObject<HTMLElement | null>, active: boolean, audio: RefObject<PortfolioAudio | null>) {
  const motionRef = useRef<LandingMotion | null>(null)
  const activeRef = useRef(active)

  useLayoutEffect(() => {
    activeRef.current = active
    motionRef.current?.sync()
  }, [active])

  useLayoutEffect(() => {
    const root = rootRef.current
    const sound = audio.current
    if (!root) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', context => {
      const styles = getComputedStyle(root)
      const token = (name: string) => Number.parseFloat(styles.getPropertyValue(name))
      const period = token('--breeze-period')
      const angle = token('--ornament-sway-angle')
      const clock = { phase: 0, ambientWeight: 1 }
      const gust: DepartureWind = {
        time: -1,
        mediumDuration: token('--discover-medium-duration'),
        highStart: token('--discover-high-start'),
        highDuration: token('--discover-high-duration'),
        mediumPressure: token('--discover-medium-pressure'),
        highPressure: token('--discover-high-pressure'),
        branchDeflection: token('--discover-branch-deflection'),
      }
      const baseWind = { ...gust }
      let entered = false
      let departing = false
      let departure: gsap.core.Timeline | null = null
      const hangings = [
        { selector: '.hanging--left img', gain: -1, lag: 0 },
        { selector: '.hanging--center img', gain: -0.65, lag: 0.08 },
        { selector: '.hanging--right img', gain: 0.85, lag: 0.16 },
      ].map(({ selector, ...response }) => ({
        ...response,
        rotate: gsap.quickSetter(root.querySelector(selector), 'rotation', 'deg'),
      }))
      const vines = Array.from(root.querySelectorAll('.lotus__art')).map(lotus => ({
        mirrored: Boolean(lotus.closest('.lotus--right')),
        paths: Array.from(lotus.querySelectorAll('.lotus__bend')),
      }))
      if (naturalLotusMotion) prepareLotusWind(branches)

      const render = () => {
        if (document.hidden || !activeRef.current) return
        const wind = gust.time >= 0 ? gust : undefined
        if (!entered && !wind) return
        hangings.forEach(({ rotate, gain, lag }) => {
          const swing = wind ? ornamentWindSwing(wind, wind.time - lag) : 0
          rotate(angle * gain * (ambientPendulum(clock.phase - lag, period) * clock.ambientWeight + swing))
        })
        if (naturalLotusMotion) vines.forEach(({ mirrored, paths }) => paths.forEach((path, index) => {
          path.setAttribute('d', bendLotus(lotusPaths[index], clock.phase, mirrored, wind, clock.ambientWeight))
        }))
      }
      const ambient = gsap.to(clock, { phase: period, duration: period, ease: 'none', repeat: -1, paused: true })
      const entrance = gsap.timeline({ onComplete: () => { entered = true; sync() } })
      entrance.fromTo(root.querySelectorAll('.hanging img'), { yPercent: -110 }, {
        yPercent: 0, duration: token('--ornament-entrance-duration'), stagger: 0.12, ease: 'back.out(1.15)',
      }, 0)
      root.querySelectorAll<SVGSVGElement>('.lotus__art').forEach((lotus, side) => {
        const offset = token('--ornament-entrance-duration') + 0.24 + token('--landing-stage-gap') + side * 0.15
        gsap.set(lotus.querySelector('.lotus__reveal-finish'), { opacity: 0 })
        lotus.querySelectorAll<SVGPathElement>('.lotus__reveal').forEach(path => {
          const length = path.getTotalLength() + Number(path.getAttribute('stroke-width')) + 2
          gsap.set(path, { opacity: 0, strokeDasharray: length, strokeDashoffset: length })
          entrance.set(path, { opacity: 1 }, offset + Number(path.dataset.growAt))
          entrance.to(path, { strokeDashoffset: 0, duration: Number(path.dataset.growDuration), ease: 'sine.inOut' },
            offset + Number(path.dataset.growAt))
        })
        entrance.to(lotus.querySelector('.lotus__reveal-finish'), { opacity: 1, duration: 0.35 }, offset + 3.05)
      })

      entrance.fromTo(root.querySelector('.discover-button'), { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: token('--discover-entrance-duration'), ease: 'sine.inOut',
      }, token('--discover-entrance-start'))
      entrance.to({}, { duration: token('--landing-idle-delay') })

      function sync() {
        const paused = document.hidden || !activeRef.current
        if (!entered) entrance.paused(paused)
        ambient.paused(paused || !entered || departing)
      }

      motionRef.current = {
        sync,
        depart: () => {
          departure?.kill()
          sound?.stopWind()
          departing = true
          ambient.pause()
          if (!entered) clock.ambientWeight = 0
          const settle = token('--discover-ambient-settle-duration')
          const travelAt = token('--discover-travel-start')
          const travelDuration = token('--discover-travel-duration')
          const windDuration = token('--discover-travel-start') + travelDuration
          Object.assign(gust, varyDepartureWind(baseWind))
          // Register click-created animation with the media context for cleanup.
          context.add(() => {
            departure = gsap.timeline()
              .set(gust, { time: 0 }, 0)
              .to(clock, { ambientWeight: 0, duration: settle, ease: 'sine.inOut' }, 0)
              .to(gust, {
                time: windDuration,
                duration: windDuration,
                ease: 'none',
                onUpdate: () => sound?.syncWind(gust),
              }, 0)
              .call(() => sound?.settleWind(token('--wind-audio-settle-duration')))
              .set(gust, { time: -1 })
              .call(() => { departing = false; clock.phase = 0; clock.ambientWeight = 1; sync() })
          })
          return {
            timeline: departure!,
            travelAt,
            travelDuration,
          }
        },
      }
      gsap.ticker.add(render)
      document.addEventListener('visibilitychange', sync)
      sync()
      return () => {
        motionRef.current = null
        sound?.stopWind()
        gsap.ticker.remove(render)
        document.removeEventListener('visibilitychange', sync)
        vines.forEach(({ paths }) => paths.forEach((path, index) => path.setAttribute('d', lotusPaths[index].join(' '))))
      }
    }, root)
    return () => media.revert()
  }, [rootRef, audio])

  return motionRef
}
