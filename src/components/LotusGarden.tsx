import { lotusPaths } from '../lotusWind'
import { gardenExtensions, gardenLeafForms, lotusGardens, type GardenPlant } from '../artwork/lotusGarden'
import './LotusGarden.scss'

const bloomContours = [4, 5, 6, 8, 9, 11, 12]

function Plant({ plant, index }: { plant: GardenPlant; index: number }) {
  return (
    <g className="lotus-garden__plant" data-plant={index}>
      <g transform={`translate(${plant.x} ${plant.y}) rotate(${plant.angle}) scale(${plant.scale})`}>
        {plant.kind === 'leaf' ? (
          <g className={`lotus-garden__leaf lotus-garden__leaf--${plant.tone}`}>
            <path d={gardenLeafForms[plant.form].silhouette} />
            {plant.form === 'fold' && <path className="lotus-garden__fold" d={gardenLeafForms.fold.fold} />}
            <path className="lotus-garden__veins" d={gardenLeafForms[plant.form].veins} />
          </g>
        ) : plant.kind === 'bud' ? (
          <g className={`lotus-garden__bloom${plant.pale ? ' lotus-garden__bloom--pale' : ''}`}>
            <path d="M0 1 C-14-8-14-22-1-38 C12-25 16-11 0 1Z" />
            <path className="lotus-garden__petal-line" d="M0 0 Q-6-16-1-35 M0 0 Q8-14 5-26" />
            <path className="lotus-garden__calyx" d="M0 2 Q-10-2-12-12 Q-4-8 0-3 Q6-8 12-12 Q10-2 0 2Z" />
          </g>
        ) : (
          <g className={`lotus-garden__bloom${plant.pale ? ' lotus-garden__bloom--pale' : ''}`} transform="translate(-325 -174)">
            {bloomContours.map(path => <path key={path} d={lotusPaths[path].join(' ')} />)}
          </g>
        )}
      </g>
    </g>
  )
}

function Planting({ plants, offset = 0 }: { plants: GardenPlant[]; offset?: number }) {
  return (
    <g transform={`translate(${offset} 0)`}>
      <g className="lotus-garden__stems">
        {plants.map((plant, i) => <path key={i} data-plant={i} className="lotus-garden__stem" d={plant.stem} />)}
      </g>
      {plants.map((plant, i) => <Plant key={i} plant={plant} index={i} />)}
    </g>
  )
}

export default function LotusGarden({ index, className = '' }: { index: number; className?: string }) {
  const composition = index % lotusGardens.length
  const { left, right } = gardenExtensions[composition]
  const anchor = left && right ? 'xMidYMax' : left ? 'xMaxYMax' : 'xMinYMax'

  // The viewBox fits the original garden. The side plantings extend beyond
  // it in the same units and become visible as the paper widens.
  return (
    <svg className={`lotus-garden ${className}`} viewBox="0 0 300 420"
      preserveAspectRatio={`${anchor} meet`} aria-hidden="true" focusable="false">
      {left && <Planting plants={left.plants} offset={-left.width} />}
      {right && <Planting plants={right.plants} offset={300} />}
      <Planting plants={lotusGardens[composition]} />
    </svg>
  )
}
