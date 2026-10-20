/**
 * RLG API Service — centralized fetch wrapper for all backend calls.
 * All functions return { success, data?, message?, error? }
 */

const BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
             (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
             '';

async function post(endpoint, body) {
  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || json.errors?.[0]?.msg || 'Server error');
    return json;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function get(endpoint) {
  try {
    const res  = await fetch(`${BASE}${endpoint}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Server error');
    return json;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export const api = {
  /** Contact form */
  contact: (data) => post('/api/contact', data),

  /** Get Started / Free Trial */
  getStarted: (data) => post('/api/get-started', data),

  /** Driver job application */
  applyJob: (data) => post('/api/apply-job', data),

  /** Website design inquiry */
  websiteInquiry: (data) => post('/api/website-inquiry', data),

  /** Fleet owner — hire drivers */
  hireDrivers: (data) => post('/api/hire-drivers', data),

  /** DOT / MC number lookup */
  dotLookup: (query) => get(`/api/dot-lookup/${encodeURIComponent(query)}`),

  /** Admin: all submissions */
  submissions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/api/submissions${qs ? '?' + qs : ''}`);
  },

  /** Admin: dashboard stats */
  stats: () => get('/api/stats'),

  /** Health check */
  health: () => get('/api/health')
};
