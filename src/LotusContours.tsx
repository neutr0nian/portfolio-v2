import { lotusPaths } from './lotusWind'

/** Shared original contours: landing and work panels use identical botanical detail. */
export default function LotusContours({ className }: { className?: string }) {
  return lotusPaths.map((path, index) => <path key={index} className={className} d={path.join(' ')} />)
}
