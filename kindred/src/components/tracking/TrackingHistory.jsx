import TrackingTimelineItem from './TrackingTimelineItem'

function TrackingHistory({ history = [] }) {
  if (!history.length) {
    return <p className="text-sm text-slate-500">No tracking history yet.</p>
  }
  return (
    <ol aria-label="Status history">
      {history.map((entry, index) => (
        <TrackingTimelineItem
          key={`${entry.status}-${index}`}
          entry={entry}
        />
      ))}
    </ol>
  )
}

export default TrackingHistory
