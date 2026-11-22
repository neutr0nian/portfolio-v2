import type { RefObject } from 'react'
import LotusArt from '../LotusArt'
import Button from './Button'
import lantern from '../assets/Lantern.svg'
import ornament from '../assets/Ornament.svg'

type LandingSectionProps = {
  rootRef: RefObject<HTMLElement | null>
  onDiscover: () => void
  departing: boolean
}

export default function LandingSection({ rootRef, onDiscover, departing }: LandingSectionProps) {
  return (
    <section className="landing" ref={rootRef} aria-labelledby="landing-title">
      <div className="landing__art" aria-hidden="true">


        <span className="lotus lotus--left"><LotusArt /></span>
        <span className="lotus lotus--right"><LotusArt /></span>
        <div className="hangings">
          <span className="hanging hanging--left"><img src={lantern} alt="" /></span>
          <span className="hanging hanging--center"><img src={ornament} alt="" /></span>
          <span className="hanging hanging--right"><img src={lantern} alt="" /></span>
        </div>
      </div>
      <div className="landing__content">
        <div className="identity">
          <h1 id="landing-title" tabIndex={-1}>Hi, I’m Pratik Chavan</h1>
          <p>I engineer beautiful interfaces</p>
          <Button variant="outline" className="discover-button" onClick={onDiscover} disabled={departing} aria-controls="journey-view">
            Experience
          </Button>
        </div>
      </div>
    </section>
  )
}
