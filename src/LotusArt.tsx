import { useId } from 'react'
import lotusVine from './assets/Lotus-vine.svg'
import { naturalLotusMotion } from './lotusWind'
import LotusContours from './LotusContours'
import { branches } from './lotusGuides'

const flowers = [
  { x: 325, y: 174, tips: [[282, 138], [304, 121], [329, 115], [356, 125], [372, 145], [380, 174], [369, 200]], width: 29, at: 1.45 },
  { x: 195, y: 94, tips: [[170, 86], [176, 75], [185, 67], [199, 66], [209, 74], [217, 85], [174, 99]], width: 13, at: 1.65 },
  { x: 108, y: 139, tips: [[91, 106], [105, 102], [120, 109], [132, 118], [136, 135], [131, 149], [122, 158]], width: 15, at: 1.2 },
  { x: 146, y: 211, tips: [[150, 196], [159, 204], [157, 213], [151, 222], [139, 222]], width: 9, at: 1.55 },
  { x: 148, y: 379, tips: [[125, 369], [123, 381], [127, 393], [136, 405], [149, 408], [163, 403], [172, 395]], width: 15, at: 1.7 },
]

const leaves = [
  { x: 28, y: 130, tx: 10, ty: 136, at: 1.3 },
  { x: 48, y: 192, tx: 38, ty: 174, at: 1.4 },
  { x: 94, y: 178, tx: 113, ty: 171, at: 1.35 },
  { x: 241, y: 182, tx: 257, ty: 152, at: 1.65 },
  { x: 212, y: 269, tx: 241, ty: 285, at: 1.75 },
  { x: 326, y: 311, tx: 307, ty: 342, at: 2.05 },
]

export default function LotusArt() {
  const maskId = `lotus-growth-${useId().replace(/:/g, '')}`
  return (
    <svg className="lotus__art" viewBox="0 0 467 701" aria-hidden="true" focusable="false">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="467" height="701" style={{ maskType: 'luminance' }}>
          <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
            {branches.map((branch, i) => <path key={`branch-${i}`} className="lotus__reveal" d={branch.d} strokeWidth={branch.width} data-grow-at={branch.at} data-grow-duration="1.2" />)}
            {flowers.flatMap(flower => flower.tips.map(([x, y], i) => (
              <path key={`petal-${flower.x}-${i}`} className="lotus__reveal" d={`M${flower.x} ${flower.y} Q${(flower.x + x) / 2} ${flower.y} ${x} ${y}`} strokeWidth={flower.width} data-grow-at={flower.at + i * 0.07} data-grow-duration="0.8" />
            )))}
            {leaves.map((leaf, i) => <path key={`leaf-${i}`} className="lotus__reveal" d={`M${leaf.x} ${leaf.y} L${leaf.tx} ${leaf.ty}`} strokeWidth="21" data-grow-at={leaf.at} data-grow-duration="0.65" />)}
          </g>
          {/* Full coverage at rest guarantees that every original trace detail survives. */}
          <rect className="lotus__reveal-finish" width="467" height="701" fill="white" />
        </mask>
      </defs>
      {naturalLotusMotion ? (
        <g fill="var(--color-lotus)" mask={`url(#${maskId})`}>
          <LotusContours className="lotus__bend" />
        </g>
      ) : <image href={lotusVine} width="467" height="701" mask={`url(#${maskId})`} />}
    </svg>
  )
}
