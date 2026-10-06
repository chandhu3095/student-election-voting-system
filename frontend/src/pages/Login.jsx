import { useState } from 'react'
import { api } from '../api'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('choose')
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    studentId: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setForm({
      username: '',
      password: '',
      fullName: '',
      studentId: '',
      confirmPassword: ''
    })
    setError('')
  }

  const selectMode = (newMode) => {
    resetForm()
    setMode(newMode)
  }

  const submitLogin = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await api.login({
        username: form.username,
        password: form.password
      })

      if (mode === 'student' && user.role !== 'STUDENT') {
        throw new Error('This is not a student account.')
      }

      if (mode === 'admin' && user.role !== 'ADMIN') {
        throw new Error('This is not an admin account.')
      }

      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const submitRegistration = async (event) => {
    event.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const user = await api.register({
        fullName: form.fullName,
        studentId: form.studentId,
        password: form.password
      })

      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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

        <h1>
          Every voice<br />
          <span>counts.</span>
        </h1>

        <p className="login-subtitle">
          A simple digital space for transparent student council elections.
        </p>

        {/* ROLE SELECTION */}
        {mode === 'choose' && (
          <div className="form-stack">
            <p className="eyebrow">SELECT YOUR ROLE</p>

            <button
              type="button"
              className="btn btn-primary big"
              onClick={() => selectMode('student')}
            >
              Student Login
            </button>

            <button
              type="button"
              className="btn btn-secondary big"
              onClick={() => selectMode('admin')}
            >
              Admin Login
            </button>
          </div>
        )}

        {/* STUDENT LOGIN */}
        {mode === 'student' && (
          <>
            <p className="eyebrow">STUDENT LOGIN</p>

            <form onSubmit={submitLogin} className="form-stack">
              <label>
                Student ID
                <input
                  value={form.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value
                    })
                  }
                  placeholder="Enter student ID"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  placeholder="Enter password"
                  required
                />
              </label>

              {error && <div className="alert error">{error}</div>}

              <button
                className="btn btn-primary big"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <button
                type="button"
                className="btn btn-ghost full"
                onClick={() => selectMode('register')}
              >
                New student? Create account
              </button>

              <button
                type="button"
                className="btn btn-ghost full"
                onClick={() => selectMode('choose')}
              >
                ← Back
              </button>
            </form>
          </>
        )}

        {/* STUDENT REGISTRATION */}
        {mode === 'register' && (
          <>
            <p className="eyebrow">STUDENT REGISTRATION</p>

            <form onSubmit={submitRegistration} className="form-stack">
              <label>
                Full Name
                <input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fullName: e.target.value
                    })
                  }
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label>
                Student ID
                <input
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      studentId: e.target.value
                    })
                  }
                  placeholder="Enter your student ID"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  placeholder="Minimum 6 characters"
                  required
                />
              </label>

              <label>
                Confirm Password
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value
                    })
                  }
                  placeholder="Confirm your password"
                  required
                />
              </label>

              {error && <div className="alert error">{error}</div>}

              <button
                className="btn btn-primary big"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Student Account'}
              </button>

              <button
                type="button"
                className="btn btn-ghost full"
                onClick={() => selectMode('student')}
              >
                ← Back to Student Login
              </button>
            </form>
          </>
        )}

        {/* ADMIN LOGIN */}
        {mode === 'admin' && (
          <>
            <p className="eyebrow">ADMINISTRATOR LOGIN</p>

            <form onSubmit={submitLogin} className="form-stack">
              <label>
                Admin Username
                <input
                  value={form.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value
                    })
                  }
                  placeholder="Enter admin username"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  placeholder="Enter admin password"
                  required
                />
              </label>

              {error && <div className="alert error">{error}</div>}

              <button
                className="btn btn-primary big"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in as Admin'}
              </button>

              <button
                type="button"
                className="btn btn-ghost full"
                onClick={() => selectMode('choose')}
              >
                ← Back
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}