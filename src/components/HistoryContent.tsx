import './HistoryContent.scss'

export type HistoryEntry = {
  year: string
  place: string
  role: string
  description: string
}

type HistoryContentProps = {
  data: HistoryEntry[]
}

export default function HistoryContent({ data }: HistoryContentProps) {
  return (
    <div className="history-content">
      <div className="history-content__entries">
        {data.map(entry => (
          <article className="history-content__entry" key={`${entry.year}-${entry.place}-${entry.role}`}>
            <h4>{entry.year} - {entry.place}</h4>
            <p className="history-content__role">{entry.role}</p>
            <p>{entry.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
