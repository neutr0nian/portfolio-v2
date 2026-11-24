import { useId } from 'react'
import LotusGarden from './LotusGarden'
import ProjectLinkIcon from './ProjectLinkIcon'

export type WorkProject = {
  title: string
  description: string
  detail?: string
  href: string
  action: string
}
export type Work = {
  id: string
  title: string
  description: string
  layout: 'featured' | 'list'
  projects: WorkProject[]
}

type WorkScrollProps = { work: Work; index: number; expanded: boolean; onToggle: () => void }

export default function WorkScroll({ work, index, expanded, onToggle }: WorkScrollProps) {
  const panelId = useId()
  return (
    <article className={`work-scroll${expanded ? ' work-scroll--expanded' : ''}`}>
      <div className="work-scroll__paper">
        <LotusGarden index={index} className="works-lotus" />
        <div className="work-scroll__content">
          <button className="work-scroll__toggle" aria-label={work.title}
            aria-expanded={expanded} aria-controls={panelId} onClick={onToggle}>
            <span className="work-scroll__title">{work.title}</span>
            <span className="work-scroll__summary">{work.description}</span>
          </button>
          <div className="work-scroll__details work-gallery" id={panelId} hidden={!expanded}>
            {expanded && work.projects.map(project => (
              <a key={project.title} className="work-project" href={project.href} target="_blank" rel="noopener noreferrer"
                aria-label={`${project.title}. ${project.action} (opens in a new tab)`}>
                <span className="work-project__copy">
                  <span className="work-project__name">{project.title}</span>
                  <span className="work-project__description">{project.description}</span>
                  {project.detail && <span className="work-project__detail">{project.detail}</span>}
                </span>
                <ProjectLinkIcon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
