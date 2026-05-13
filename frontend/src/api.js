const bridge = window.campusCompany;
const API = bridge?.apiBase || 'http://localhost:4521/api';
let token = localStorage.getItem('cce_token');
export function setToken(next) { token = next; localStorage.setItem('cce_token', next); }
export async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
export const dataApi = table => ({ list: q => request(`/data/${table}${q ? `?q=${encodeURIComponent(q)}` : ''}`), create: row => request(`/data/${table}`, { method: 'POST', body: row }), update: (id,row) => request(`/data/${table}/${id}`, { method: 'PUT', body: row }), remove: id => request(`/data/${table}/${id}`, { method: 'DELETE' }) });
