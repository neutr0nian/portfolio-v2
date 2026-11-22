import ScrollArtwork from './ScrollArtwork'
import './JourneySection.scss'

const historyData = [
  { year: '2019', place: 'Tomato Tech', role: 'Frontend Engineer', description: 'Utilizing NodeJs, ReactJs, Css to create stunning web experiences for clients' },
  { year: '2020', place: 'Sportz Interactive', role: 'Associate Software Engineer', description: 'Utilizing NodeJs, ReactJs, Css to create stunning web experiences for clients' },
  { year: '2021', place: 'SUNY Buffalo, NY, US', role: 'Masters Student', description: 'Utilizing NodeJs, ReactJs, Css to create stunning web experiences for clients' },
  { year: '2023', place: 'Your Online Marketplace, NY, US', role: 'Software Development Engineer Intern', description: 'Utilizing NodeJs, ReactJs, Css to create stunning web experiences for clients' },
  { year: '2023', place: 'Tesla, CA, US', role: 'Software Engineer', description: 'Utilizing NodeJs, ReactJs, Css to create stunning web experiences for clients' },
  { year: '2023', place: 'Tesla, CA, US', role: 'Senior Software Engineer', description: 'Utilizing NodeJs, ReactJs, Css to create stunning web experiences for clients' },
]

export default function JourneySection({ active }: { active: boolean }) {
  return (
    <section className="journey-section" aria-labelledby="journey-title">
      <h2 className="journey-section__title" id="journey-title" tabIndex={-1}>Journey so far</h2>
      <div className="journey-section__body">
        <div className="journey-section__grid">
          <ScrollArtwork history={historyData} active={active} />
        </div>
      </div>
    </section>
  )
}
