/**
 * api.js
 * ──────────────────────────────────────────────────────────────
 * Abstraction layer for API calls.
 * 
 * Currently defaults to local mock implementations (via progressService)
 * but is structured to seamlessly switch to REST calls once the backend
 * is fully integrated.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper for REST API calls
 */
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('ai-roadmap-token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth endpoints (Future)
  auth: {
    login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (data) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => fetchAPI('/auth/me'),
  },

  // Progress endpoints
  progress: {
    get: () => fetchAPI('/progress'),
    update: (data) => fetchAPI('/progress', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Assignment endpoints
  assignments: {
    getAll: () => fetchAPI('/assignments'),
    submit: (id, data) => fetchAPI(`/assignments/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  },

  // Project endpoints
  projects: {
    getAll: () => fetchAPI('/projects'),
    submit: (id, data) => fetchAPI(`/projects/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  },
};
