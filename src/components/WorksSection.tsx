import { useRef, useState } from 'react'
import WorkScroll, { type Work } from './WorkScroll'
import { workCategories } from '../data/workCategories'
import './WorksSection.scss'

export default function WorksSection({ works = workCategories }: { works?: Work[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const revealSelected = () => {
    const track = trackRef.current
    const tile = track?.querySelector<HTMLElement>('.work-scroll--expanded')
    if (!track || !tile || track.scrollWidth <= track.clientWidth) return
    const left = tile.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft
    track.scrollTo({ left: left - (track.clientWidth - tile.offsetWidth) / 2,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return (
    <section className="works-section" aria-labelledby="works-title">

      <div className="works-section__inner">
        <h2 id="works-title" tabIndex={-1}>The Art of Creating</h2>
        <div className="works-section__track" ref={trackRef} data-expanded={selected !== null}
          onKeyDown={event => { if (event.key === 'Escape') setSelected(null) }}
          onTransitionEnd={event => { if (event.propertyName === 'flex-basis') revealSelected() }}>
          {works.map((work, index) => <WorkScroll key={work.id} work={work} index={index}
            expanded={selected === work.id}
            onToggle={() => setSelected(current => current === work.id ? null : work.id)} />)}
        </div>
      </div>

    </section>
  )
}
