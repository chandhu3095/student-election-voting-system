import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import ElectionCard from '../components/ElectionCard'
import FlowerLoader from '../components/FlowerLoader'

export default function AdminDashboard() {
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  })

  const load = () => {
    setLoading(true)
    api.getElections()
      .then(setElections)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const create = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await api.createElection(form)
      setForm({ title: '', description: '', startTime: '', endTime: '' })
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <div className="hero admin-hero">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Election control center</h1>
          <p>Create elections, manage posts and candidates, and view results.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close form' : '+ Create election'}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {showForm && (
        <form className="panel form-grid" onSubmit={create}>
          <div className="form-title">
            <span>✿</span>
            <div>
              <p className="eyebrow">NEW ELECTION</p>
              <h2>Create an election</h2>
            </div>
          </div>

          <label>
            Election title
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Student Council Election 2026"
              required
            />
          </label>

          <label className="full-field">
            Description
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the election..."
              rows="3"
            />
          </label>

          <label>
            Start time
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={e => setForm({ ...form, startTime: e.target.value })}
              required
            />
          </label>

          <label>
            End time
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={e => setForm({ ...form, endTime: e.target.value })}
              required
            />
          </label>

          <div className="full-field">
            <button className="btn btn-primary">Create election</button>
          </div>
        </form>
      )}

      <div className="section-heading">
        <div>
          <p className="eyebrow">MANAGEMENT</p>
          <h2>All elections</h2>
        </div>
        <span className="count-badge">{elections.length}</span>
      </div>

      {loading ? (
        <FlowerLoader label="Loading elections..." />
      ) : (
        <div className="card-grid">
          {elections.map(election => (
            <ElectionCard key={election.id} election={election} role="ADMIN" />
          ))}
        </div>
      )}
    </section>
  )
}
