import { createRoot } from 'react-dom/client'
import LotusGarden from '../src/components/LotusGarden'
import '../src/styles/_tokens.scss'
import '@fontsource/abhaya-libre/400.css'
import '@fontsource/belanosima/400.css'
import './lotus-garden.scss'

createRoot(document.getElementById('root')!).render(
  <main>
    <header><h1>Lotus garden</h1><p>Four-panel artwork study</p></header>
    <div className="review-screens">
      {[0, 1, 2, 3].map(index => <section className="review-screen" key={index}>
        <span className="review-number">0{index + 1}</span>
        <LotusGarden index={index} />
      </section>)}
    </div>
  </main>,
)
