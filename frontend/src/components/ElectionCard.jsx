import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function formatDate(value) {
  return new Date(value).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

export default function ElectionCard({ election, role = 'STUDENT' }) {
  const closed = new Date() > new Date(election.endTime)
  const href = role === 'ADMIN'
    ? `/admin/election/${election.id}`
    : closed
      ? `/student/results/${election.id}`
      : `/student/election/${election.id}`

  return (
    <article className="election-card">
      <div className="card-top">
        <div className="flower-icon">❀</div>
        <StatusBadge election={election} />
      </div>

      <h3>{election.title}</h3>
      <p>{election.description || 'Student council election.'}</p>

      <div className="date-row">
        <span>Starts</span>
        <strong>{formatDate(election.startTime)}</strong>
      </div>
      <div className="date-row">
        <span>Ends</span>
        <strong>{formatDate(election.endTime)}</strong>
      </div>

      <Link className="btn btn-primary full" to={href}>
        {role === 'ADMIN' ? 'Manage Election' : closed ? 'View Results' : 'Open Election'}
      </Link>
    </article>
  )
}
