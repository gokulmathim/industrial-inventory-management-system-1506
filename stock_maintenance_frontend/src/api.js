const API_ROOT =
  process.env.REACT_APP_BACKEND_API_URL || "http://localhost:8000";

/**
 * Wrapper for backend API requests.
 * Use this function for all GET/POST/PUT/DELETE requests to the backend.
 * @param {string} endpoint - API endpoint (e.g. '/items')
 * @param {object} options - fetch API options (method, headers, body)
 */
export async function apiRequest(endpoint, options = {}) {
  const url = API_ROOT + endpoint;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };
  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export { API_ROOT };
