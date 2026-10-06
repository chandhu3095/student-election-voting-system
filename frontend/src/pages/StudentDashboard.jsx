import { useEffect, useState } from 'react'
import { api } from '../api'
import ElectionCard from '../components/ElectionCard'
import FlowerLoader from '../components/FlowerLoader'

export default function StudentDashboard({ user }) {
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getElections()
      .then(setElections)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <div className="hero">
        <div>
          <p className="eyebrow">STUDENT DASHBOARD</p>
          <h1>Hello, {user.fullName.split(' ')[0]} <span className="wave">✿</span></h1>
          <p>Choose an election and make your voice count.</p>
        </div>
        <div className="hero-art">❀</div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="section-heading">
        <div>
          <p className="eyebrow">ELECTIONS</p>
          <h2>Current & upcoming</h2>
        </div>
      </div>

      {loading ? (
        <FlowerLoader label="Finding elections..." />
      ) : elections.length ? (
        <div className="card-grid">
          {elections.map(election => (
            <ElectionCard key={election.id} election={election} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>✿</span>
          <h3>No elections yet</h3>
          <p>Your administrator has not created an election.</p>
        </div>
      )}
    </section>
  )
}
