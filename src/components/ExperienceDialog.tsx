import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { JourneyEntry } from '../data/journeyEntries'
import Button from './Button'
import JourneyMotif from './JourneyMotif'
import './ExperienceDialog.scss'

export default function ExperienceDialog({ entry, onClose }: { entry: JourneyEntry; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const roleId = useId()
  const resourceUrl = entry.credentialUrl ?? entry.programUrl
  const resourceLabel = entry.programUrl ? 'View program' : 'View credential'

  useEffect(() => {
    const dialog = ref.current!
    const trigger = document.activeElement as HTMLElement | null
    dialog.showModal()
    return () => {
      dialog.close()
      if (trigger?.isConnected && !trigger.closest('[inert]')) trigger.focus({ preventScroll: true })
    }
  }, [])

  return createPortal(
    <dialog ref={ref} className="experience-dialog" aria-labelledby={titleId} aria-describedby={roleId}
      onClose={() => {
        // A development remount can deliver an earlier close after the dialog reopens.
        if (!ref.current?.open) onClose()
      }}
      onClick={event => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
          event.currentTarget.close()
        }
      }}>
      <Button className="experience-dialog__close" aria-label="Close experience" onClick={() => ref.current?.close()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </Button>
      <div className="experience-dialog__layout">
        <div className="experience-dialog__art"><JourneyMotif motif={entry.motif} /></div>
        <div className="experience-dialog__content">
          <p className="experience-dialog__meta">{entry.period ?? entry.year}{entry.location && <span>{entry.location}</span>}</p>
          <h2 id={titleId}>{entry.company}</h2>
          <p id={roleId} className="experience-dialog__role">{entry.role}</p>
          {entry.description && <p className="experience-dialog__description">{entry.description}</p>}
          {entry.highlights && (
            <section className="experience-dialog__section" aria-label="Contributions">
              <h3>Contributions</h3>
              <ul>{entry.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
            </section>
          )}
          {entry.sections?.map(section => (
            <section className="experience-dialog__section" key={section.title} aria-label={section.title}>
              <h3>{section.title}</h3>
              {section.period && <p className="experience-dialog__period">{section.period}</p>}
              <ul>{section.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
            </section>
          ))}
          {entry.technologies && (
            <ul className="experience-dialog__technologies" aria-label="Technologies">
              {entry.technologies.map(technology => <li key={technology}>{technology}</li>)}
            </ul>
          )}
          {resourceUrl && (
            <a className="experience-dialog__credential" href={resourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${resourceLabel} (opens in a new tab)`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 4h6v6M20 4 10 14M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
              </svg>
              {resourceLabel}
            </a>
          )}
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
