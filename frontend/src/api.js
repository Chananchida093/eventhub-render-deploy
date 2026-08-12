async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (response.status === 204) return null
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.message || 'Something went wrong. Please try again.')
  return body
}

export const api = {
  events: () => request('/api/events'),
  me: () => request('/api/auth/me'),
  login: (data) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  registrations: () => request('/api/registrations/me'),
  register: (id) => request(`/api/events/${id}/registrations`, { method: 'POST' }),
  cancel: (id) => request(`/api/events/${id}/registrations`, { method: 'DELETE' }),
  createEvent: (data) => request('/api/admin/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/api/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/api/admin/events/${id}`, { method: 'DELETE' }),
  attendees: (id) => request(`/api/admin/events/${id}/attendees`),
}

