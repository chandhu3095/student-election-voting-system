import { useState } from 'react'
import { api } from '../api'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await api.login(form)
      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const demo = (username, password) => setForm({ username, password })

  return (
    <section className="login-page">
      <div className="login-decoration">
        <span className="petal petal-a">✿</span>
        <span className="petal petal-b">❀</span>
        <span className="petal petal-c">✾</span>
      </div>

      <div className="login-card">
        <div className="login-logo">✿</div>
        <p className="eyebrow">WELCOME TO BLOOMVOTE</p>
        <h1>Every voice<br /><span>counts.</span></h1>
        <p className="login-subtitle">
          A simple digital space for transparent student council elections.
        </p>

        <form onSubmit={submit} className="form-stack">
          <label>
            Username
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </label>

          {error && <div className="alert error">{error}</div>}

          <button className="btn btn-primary big" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="demo-box">
          <strong>Quick demo</strong>
          <div className="demo-actions">
            <button onClick={() => demo('student1', 'student123')}>Student demo</button>
            <button onClick={() => demo('admin', 'admin123')}>Admin demo</button>
          </div>
        </div>
      </div>
    </section>
  )
}
