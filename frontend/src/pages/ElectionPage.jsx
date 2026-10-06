import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import FlowerLoader from '../components/FlowerLoader'

export default function ElectionPage({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [election, setElection] = useState(null)
  const [selected, setSelected] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => api.getElection(id).then(setElection).catch(err => setError(err.message))

  useEffect(() => { load() }, [id])

  const allSelected = useMemo(
    () => election?.posts?.every(post => selected[post.id]),
    [election, selected]
  )

  const submitVotes = async () => {
    if (!allSelected) {
      setError('Please select one candidate for every post.')
      return
    }

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      for (const post of election.posts) {
        await api.castVote({
          studentId: user.id,
          postId: post.id,
          candidateId: Number(selected[post.id])
        })
      }

      setSuccess('Your votes were submitted successfully!')
      setTimeout(() => navigate('/student'), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!election) return <FlowerLoader label="Opening election..." />

  if (!election.open) {
    return (
      <div className="empty-state">
        <span>❀</span>
        <h2>Voting is not open</h2>
        <p>This election is either upcoming or has already closed.</p>
        {election.closed && (
          <button className="btn btn-primary" onClick={() => navigate(`/student/results/${id}`)}>
            View results
          </button>
        )}
      </div>
    )
  }

  return (
    <section>
      <div className="election-hero">
        <div>
          <p className="eyebrow">LIVE ELECTION</p>
          <h1>{election.title}</h1>
          <p>{election.description}</p>
        </div>
        <div className="live-orb">
          <span></span>
          LIVE
        </div>
      </div>

      <div className="notice">
        <span>✿</span>
        You can vote <strong>once per post</strong>. Review your choices before submitting.
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="voting-list">
        {election.posts.map((post, index) => (
          <article className="vote-card" key={post.id}>
            <div className="post-number">{String(index + 1).padStart(2, '0')}</div>
            <div className="vote-content">
              <p className="eyebrow">POST {index + 1}</p>
              <h2>{post.name}</h2>

              <div className="candidate-list">
                {post.candidates.map(candidate => (
                  <label
                    className={`candidate-option ${String(selected[post.id]) === String(candidate.id) ? 'selected' : ''}`}
                    key={candidate.id}
                  >
                    <input
                      type="radio"
                      name={`post-${post.id}`}
                      value={candidate.id}
                      checked={String(selected[post.id]) === String(candidate.id)}
                      onChange={(e) => setSelected({ ...selected, [post.id]: e.target.value })}
                    />
                    <span className="radio-dot"></span>
                    <span className="candidate-info">
                      <strong>{candidate.name}</strong>
                      <small>{candidate.manifesto || 'Candidate for student council.'}</small>
                    </span>
                    <span className="flower-check">✿</span>
                  </label>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="submit-bar">
        <div>
          <strong>Ready to cast your vote?</strong>
          <span>{allSelected ? 'All posts selected.' : 'Select one candidate for each post.'}</span>
        </div>
        <button
          className="btn btn-primary big"
          disabled={!allSelected || submitting}
          onClick={submitVotes}
        >
          {submitting ? 'Submitting...' : 'Cast my vote ✿'}
        </button>
      </div>
    </section>
  )
}
