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
  events: ({ page = 0, size = 20, search = '', category = 'ALL', status = 'ALL' } = {}) => {
    const params = new URLSearchParams({ page, size, status, category })
    if (search.trim()) params.set('search', search.trim())
    return request(`/api/events?${params.toString()}`)
  },
  event: (id) => request(`/api/events/${id}`),
  me: () => request('/api/auth/me'),
  login: (data) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  registrations: () => request('/api/registrations/me'),
  register: (id, data) => request(`/api/events/${id}/registrations`, { method: 'POST', body: JSON.stringify(data) }),
  cancel: (id) => request(`/api/events/${id}/registrations`, { method: 'DELETE' }),
  createEvent: (data) => request('/api/admin/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/api/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/api/admin/events/${id}`, { method: 'DELETE' }),
  attendees: (id) => request(`/api/admin/events/${id}/attendees`),
  checkIn: (eventId, ticketCode) => request(`/api/staff/events/${eventId}/check-in`, { method: 'POST', body: JSON.stringify({ ticketCode }) }),
  staffAttendees: (eventId) => request(`/api/staff/events/${eventId}/attendees`),
  recentCheckIns: (eventId) => request(`/api/staff/events/${eventId}/recent-check-ins`),
  analytics: () => request('/api/admin/analytics'),
  trackVisit: (data) => request('/api/analytics/visit', { method: 'POST', body: JSON.stringify(data) }),
  uploadImage: async (file) => { const form = new FormData(); form.append('file', file); const response = await fetch('/api/admin/uploads', { method: 'POST', credentials: 'include', body: form }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.message || 'Image upload failed'); return body.url },
}
