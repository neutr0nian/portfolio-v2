import cloud from '../assets/journey/cloud.png'
import sun from '../assets/journey/sun.png'
import fuji from '../assets/journey/fuji.png'
import blossom from '../assets/journey/blossom.png'
import torii from '../assets/journey/torii.png'
import cat from '../assets/journey/cat.png'
import fan from '../assets/journey/fan.png'
import koi from '../assets/journey/koi.png'
import daruma from '../assets/journey/daruma.png'
import type { JourneyMotif as Motif } from '../data/journeyEntries'

const motifs = { cloud, sun, fuji, blossom, torii, cat, fan, koi, daruma }

export default function JourneyMotif({ motif }: { motif: Motif }) {
  return <img className="journey-motif" src={motifs[motif]} width="512" height="512" alt="" draggable="false" />
}
