export default function StatusBadge({ election }) {
  const now = new Date()
  const start = new Date(election.startTime)
  const end = new Date(election.endTime)

  let status = 'Upcoming'
  let className = 'upcoming'

  if (now >= start && now <= end) {
    status = 'Live'
    className = 'live'
  } else if (now > end) {
    status = 'Closed'
    className = 'closed'
  }

  return <span className={`status-badge ${className}`}>{status}</span>
}
