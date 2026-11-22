import { useId } from 'react'
import LotusGarden from './LotusGarden'

export type Work = { id: string; title: string; description: string }

type WorkScrollProps = {
  work: Work
  index: number
  expanded: boolean
  onToggle: () => void
}

export default function WorkScroll({ work, index, expanded, onToggle }: WorkScrollProps) {
  const panelId = useId()
  return (
    <article className={`work-scroll${expanded ? ' work-scroll--expanded' : ''}`}>
      <div className="work-scroll__paper">
        <LotusGarden index={index} className="works-lotus" />
        <div className="work-scroll__content">
          <button className="work-scroll__toggle" aria-label={work.title}
            aria-expanded={expanded} aria-controls={panelId} onClick={onToggle}>
            <span className="work-scroll__title">
              {work.title}
            </span>
            <span className="work-scroll__summary">{work.description}</span>
          </button>
          <div className="work-scroll__details" id={panelId} hidden={!expanded}>
            <div className="work-scroll__preview" role="img" aria-label={`${work.title} preview placeholder`}>
              <span>Preview coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
