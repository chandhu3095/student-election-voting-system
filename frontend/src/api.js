const API_URL = import.meta.env.VITE_API_URL || 'https://student-election-voting-system-1.onrender.com/api'
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  const text = await response.text()
  let data = {}

  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { message: text }
  }

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const api = {
  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getElections: () => request('/elections'),

  getElection: (id) => request(`/elections/${id}`),

  createElection: (payload) =>
    request('/elections', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  addPost: (electionId, payload) =>
    request(`/elections/${electionId}/posts`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  addCandidate: (postId, payload) =>
    request(`/posts/${postId}/candidates`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  castVote: (payload) =>
    request('/votes', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getResults: (electionId) =>
    request(`/elections/${electionId}/results`)
}
