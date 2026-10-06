import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import FlowerLoader from '../components/FlowerLoader'

export default function AdminElection() {
  const { id } = useParams()
  const [election, setElection] = useState(null)
  const [postName, setPostName] = useState('')
  const [candidateForms, setCandidateForms] = useState({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = () =>
    api.getElection(id)
      .then(setElection)
      .catch(err => setError(err.message))

  useEffect(() => { load() }, [id])

  const addPost = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      await api.addPost(id, { name: postName })
      setPostName('')
      setMessage('Post added successfully.')
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const addCandidate = async (postId) => {
    const form = candidateForms[postId] || { name: '', manifesto: '' }
    setError('')
    setMessage('')

    try {
      await api.addCandidate(postId, form)
      setCandidateForms({
        ...candidateForms,
        [postId]: { name: '', manifesto: '' }
      })
      setMessage('Candidate added successfully.')
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!election) return <FlowerLoader label="Loading election..." />

  return (
    <section>
      <div className="admin-detail-hero">
        <div>
          <Link className="back-link" to="/admin">← Back to dashboard</Link>
          <p className="eyebrow">ELECTION MANAGEMENT</p>
          <h1>{election.title}</h1>
          <p>{election.description}</p>
        </div>

        {election.closed && (
          <Link className="btn btn-primary" to={`/admin/results/${id}`}>
            View results
          </Link>
        )}
      </div>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      {!election.closed && (
        <form className="panel inline-form" onSubmit={addPost}>
          <div>
            <p className="eyebrow">ADD POST</p>
            <h2>Create a position</h2>
          </div>
          <input
            value={postName}
            onChange={e => setPostName(e.target.value)}
            placeholder="e.g. President"
            required
          />
          <button className="btn btn-primary">Add post</button>
        </form>
      )}

      <div className="management-list">
        {election.posts.map((post, index) => {
          const form = candidateForms[post.id] || { name: '', manifesto: '' }

          return (
            <article className="management-card" key={post.id}>
              <div className="management-heading">
                <div className="post-number">{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <p className="eyebrow">POST</p>
                  <h2>{post.name}</h2>
                </div>
              </div>

              <div className="admin-candidates">
                {post.candidates.map(candidate => (
                  <div className="admin-candidate" key={candidate.id}>
                    <span className="candidate-flower">✿</span>
                    <div>
                      <strong>{candidate.name}</strong>
                      <small>{candidate.manifesto || 'No manifesto provided.'}</small>
                    </div>
                  </div>
                ))}
              </div>

              {!election.closed && (
                <div className="candidate-form">
                  <input
                    placeholder="Candidate name"
                    value={form.name}
                    onChange={e =>
                      setCandidateForms({
                        ...candidateForms,
                        [post.id]: { ...form, name: e.target.value }
                      })
                    }
                  />
                  <input
                    placeholder="Short manifesto / description"
                    value={form.manifesto}
                    onChange={e =>
                      setCandidateForms({
                        ...candidateForms,
                        [post.id]: { ...form, manifesto: e.target.value }
                      })
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addCandidate(post.id)}
                  >
                    + Candidate
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
