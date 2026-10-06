import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import FlowerLoader from '../components/FlowerLoader'

export default function ResultsPage() {
  const { id } = useParams()
  const [results, setResults] = useState([])
  const [election, setElection] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.getElection(id), api.getResults(id)])
      .then(([electionData, resultData]) => {
        setElection(electionData)
        setResults(resultData)
      })
      .catch(err => setError(err.message))
  }, [id])

  if (error) {
    return <div className="alert error">{error}</div>
  }

  if (!election) return <FlowerLoader label="Calculating results..." />

  const totalVotes = results.reduce(
    (sum, post) => sum + post.candidates.reduce((s, candidate) => s + candidate.votes, 0),
    0
  )

  return (
    <section>
      <div className="results-hero">
        <p className="eyebrow">ELECTION RESULTS</p>
        <h1>{election.title}</h1>
        <p>Voting has closed. Here are the automatically calculated results.</p>
        <div className="total-votes">{totalVotes} <span>total votes</span></div>
      </div>

      <div className="results-grid">
        {results.map(post => {
          const max = Math.max(...post.candidates.map(c => c.votes), 1)

          return (
            <article className="result-card" key={post.postId}>
              <div className="result-title">
                <span>✿</span>
                <div>
                  <p className="eyebrow">POST</p>
                  <h2>{post.postName}</h2>
                </div>
              </div>

              {post.candidates.map(candidate => (
                <div className="result-row" key={candidate.candidateId}>
                  <div className="result-label">
                    <strong>{candidate.candidateName}</strong>
                    <span>{candidate.votes} {candidate.votes === 1 ? 'vote' : 'votes'}</span>
                  </div>
                  <div className="result-track">
                    <div
                      className="result-bar"
                      style={{ width: `${(candidate.votes / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </article>
          )
        })}
      </div>
    </section>
  )
}
