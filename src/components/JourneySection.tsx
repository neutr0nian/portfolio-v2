import { useState } from 'react'
import { journeyEntries } from '../data/journeyEntries'
import corner from '../assets/journey/corner.svg'
import ExperienceDialog from './ExperienceDialog'
import JourneyMotif from './JourneyMotif'
import './JourneySection.scss'

export default function JourneySection({ active }: { active: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = journeyEntries.find(entry => entry.id === selectedId)

  return (
    <section className="journey-section" aria-labelledby="journey-title">
      <h2 className="journey-section__title" id="journey-title" tabIndex={-1}>Journey so far</h2>
      <div className="journey-section__body">
        <div className="journey-section__corners" aria-hidden="true">
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(position =>
            <img key={position} className={`journey-section__corner journey-section__corner--${position}`} src={corner} alt="" />,
          )}
        </div>
        <div className="journey-section__grid">
          {journeyEntries.map(entry => (
            <button key={entry.id} type="button" className="experience-card" onClick={() => setSelectedId(entry.id)}
              aria-label={`${entry.year}, ${entry.company}, ${entry.role}. View experience`} aria-haspopup="dialog">
              <span className="experience-card__top">
                <span className="experience-card__year">{entry.year}</span>
              </span>
              <span className="experience-card__art"><JourneyMotif motif={entry.motif} /></span>
              <span className="experience-card__text">
                <span className="experience-card__company">{entry.company}</span>
                <span className="experience-card__role">{entry.role}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      {active && selected && <ExperienceDialog entry={selected} onClose={() => setSelectedId(null)} />}
    </section>
  )
}
