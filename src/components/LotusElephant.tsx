import profile from '../assets/elephant-profile.svg'
import lotus from '../assets/elephant-lotus.png'

export default function LotusElephant({ side }: { side: 'left' | 'right' }) {
  return (
    <svg className={`lotus-elephant lotus-elephant--${side}`} viewBox="0 0 600 900" aria-hidden="true" focusable="false">
      <use href={`${profile}#profile`} />
      <image href={lotus} x="287.7" y="3.2" width="302.6" height="217.5" />
    </svg>
  )
}
