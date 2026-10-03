const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('ai-roadmap-token');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }
  return response.json();
}

export const api = {
  auth: {
    login: credentials => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: data => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => fetchAPI('/auth/me'),
  },
  progress: {
    get: () => fetchAPI('/progress'),
    update: data => fetchAPI('/progress', { method: 'POST', body: JSON.stringify(data) }),
  },
  assignments: {
    list: () => fetchAPI('/assignments'),
    submit: (id, githubUrl) => fetchAPI(`/assignments/${encodeURIComponent(id)}/submit`, {
      method: 'POST',
      body: JSON.stringify({ githubUrl }),
    }),
  },
  projects: {
    list: () => fetchAPI('/projects'),
    submit: (id, githubUrl, liveUrl = '') => fetchAPI(`/projects/${encodeURIComponent(id)}/submit`, {
      method: 'POST',
      body: JSON.stringify({ githubUrl, liveUrl }),
    }),
  },
  admin: {
    // Users
    getUsers:   ()              => fetchAPI('/admin/users'),
    getUser:    (id)            => fetchAPI(`/admin/users/${id}`),
    updateRole: (id, role)      => fetchAPI(`/admin/users/${id}/role`,   { method: 'PATCH', body: JSON.stringify({ role }) }),
    deleteUser: (id)            => fetchAPI(`/admin/users/${id}`,        { method: 'DELETE' }),
    // Stats
    getStats:   ()              => fetchAPI('/admin/stats'),
    // Submissions
    getSubmissions: ()          => fetchAPI('/admin/submissions'),
    reviewSubmission: (id, status) => fetchAPI(`/admin/submissions/${id}/review`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
};

