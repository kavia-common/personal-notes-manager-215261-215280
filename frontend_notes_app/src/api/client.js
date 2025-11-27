 /**
  * API client targeting backend.
  * - Uses REACT_APP_API_BASE as the base URL (no trailing slash).
  * - Health check path defaults to /api/health to match backend OpenAPI.
  * - All note routes are under /api/notes.
  */
const BASE_URL = (process.env.REACT_APP_API_BASE || 'http://localhost:3001').replace(/\/*$/, '');
const HEALTH_PATH = process.env.REACT_APP_HEALTHCHECK_PATH || '/api/health';

function buildUrl(path) {
  // Normalize leading/trailing slashes on both base and path
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalized}`;
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  let body = null;
  if (contentType.includes('application/json')) {
    body = await res.json().catch(() => null);
  } else {
    const txt = await res.text().catch(() => '');
    try {
      body = JSON.parse(txt);
    } catch {
      body = txt || null;
    }
  }
  if (!res.ok) {
    const message = body && body.message ? body.message : `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body;
}

// PUBLIC_INTERFACE
export async function getNotes({ q, include_archived } = {}) {
  /** Fetch list of notes with optional query and include_archived flag */
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (typeof include_archived !== 'undefined') params.set('include_archived', include_archived ? 'true' : 'false');
  const query = params.toString() ? `?${params.toString()}` : '';
  const url = buildUrl(`/api/notes${query}`);
  const res = await fetch(url, { method: 'GET' });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Fetch a single note by id */
  const res = await fetch(buildUrl(`/api/notes/${encodeURIComponent(id)}`), { method: 'GET' });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /** Create a new note */
  const res = await fetch(buildUrl('/api/notes'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update a note by id. Payload may include title/content/archived/etc. */
  const res = await fetch(buildUrl(`/api/notes/${encodeURIComponent(id)}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {})
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id */
  const res = await fetch(buildUrl(`/api/notes/${encodeURIComponent(id)}`), { method: 'DELETE' });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function health() {
  /** Call health endpoint to verify connectivity */
  const res = await fetch(buildUrl(HEALTH_PATH), { method: 'GET' });
  return handleResponse(res);
}

export default {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  health,
};
