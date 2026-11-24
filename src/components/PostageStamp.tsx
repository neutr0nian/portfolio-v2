import { type ReactNode } from 'react'
import './PostageStamp.scss'

const horizontalCuts = Array.from({ length: 8 }, (_, index) => 10 + index * 20)
const verticalCuts = Array.from({ length: 10 }, (_, index) => 14 + index * 20)

const edgePath = [
  'M0 0',
  ...horizontalCuts.map(x => `L${x - 5} 0 A5 5 0 0 0 ${x + 5} 0`),
  'L160 0',
  ...verticalCuts.map(y => `L160 ${y - 5} A5 5 0 0 0 160 ${y + 5}`),
  'L160 208',
  ...[...horizontalCuts].reverse().map(x => `L${x + 5} 208 A5 5 0 0 0 ${x - 5} 208`),
  'L0 208',
  ...[...verticalCuts].reverse().map(y => `L0 ${y + 5} A5 5 0 0 0 0 ${y - 5}`),
  'Z',
].join(' ')

export default function PostageStamp({ icon, label, hindiLabel, value }: { icon: ReactNode; label: string; hindiLabel?: string; value?: string }) {
  return (
    <span className="postage-stamp">
      <svg className="postage-stamp__frame" viewBox="0 0 160 208" aria-hidden="true" focusable="false">
        <path className="postage-stamp__paper" d={edgePath} stroke="currentColor" strokeWidth="0.8" />
        <g className="postage-stamp__border" fill="none" stroke="currentColor">
          <path d="M14 14H146V194H14Z" strokeWidth="1.5" />
          <path d="M20 20H140V188H20Z" strokeWidth=".8" />
        </g>
      </svg>
      {value && <span className="postage-stamp__value" aria-hidden="true">{value}</span>}
      <span className="postage-stamp__art">{icon}</span>
      <span className="postage-stamp__label">
        {hindiLabel && <span lang="hi">{hindiLabel}</span>}
        <span lang="en">{label}</span>
      </span>
    </span>
  )
}
