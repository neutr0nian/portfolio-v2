import Button from './Button'
import './SceneNavigation.scss'

type Action = { label: string; onClick: () => void }

export default function SceneNavigation({ back, next }: { back: Action; next: Action }) {
  return (
    <nav className="scene-navigation" aria-label="Portfolio sections">
      <Button variant="outline" className="scene-navigation__link" type="button" aria-label={back.label} title={back.label} onClick={back.onClick}>
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" /></svg>
      </Button>
      <Button variant="outline" className="scene-navigation__link" type="button" aria-label={next.label} title={next.label} onClick={next.onClick}>
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="m6 3 5 5-5 5" /></svg>
      </Button>
    </nav>
  )
}
