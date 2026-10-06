import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { api } from './api'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import ElectionPage from './pages/ElectionPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminElection from './pages/AdminElection'
import ResultsPage from './pages/ResultsPage'

function Layout({ user, onLogout, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to={user ? (user.role === 'ADMIN' ? '/admin' : '/student') : '/'} className="brand">
          <span className="brand-flower">✿</span>
          <span>
            <strong>BloomVote</strong>
            <small>Student Elections</small>
          </span>
        </Link>

        {user && (
          <div className="nav-user">
            <span className="user-pill">{user.fullName}</span>
            <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
          </div>
        )}
      </header>

      <main className="page-wrap">{children}</main>

      <footer className="footer">
        <span>BloomVote</span>
        <span>•</span>
        <span>Student Council Election System</span>
      </footer>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bloomvote_user')
    return stored ? JSON.parse(stored) : null
  })

  const navigate = useNavigate()

  const login = (loggedUser) => {
    localStorage.setItem('bloomvote_user', JSON.stringify(loggedUser))
    setUser(loggedUser)
    navigate(loggedUser.role === 'ADMIN' ? '/admin' : '/student')
  }

  const logout = () => {
    localStorage.removeItem('bloomvote_user')
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem('bloomvote_user')
      setUser(stored ? JSON.parse(stored) : null)
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <Layout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Login onLogin={login} />} />
        <Route
          path="/student"
          element={user?.role === 'STUDENT' ? <StudentDashboard user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/student/election/:id"
          element={user?.role === 'STUDENT' ? <ElectionPage user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/student/results/:id"
          element={user?.role === 'STUDENT' ? <ResultsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/election/:id"
          element={user?.role === 'ADMIN' ? <AdminElection /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/results/:id"
          element={user?.role === 'ADMIN' ? <ResultsPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

export default App
