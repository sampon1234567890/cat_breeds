// api/breedApi.js — talks to the Freehostia PHP API
const API_BASE_URL = 'http://sev123.mooo.com'; // HTTP only — .mooo.com subdomains have no SSL (port 443 times out)
const API_TOKEN = 'Y29kZXg6cmVzdF9hcGlfdGVzdAo='; // must match backend auth.php

async function apiRequest(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error('Network error — check your connection and that the API is online.');
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data && data.error) || `Request failed (${response.status})`);
  }
  return data;
}

// READ
export const getBreeds = () => apiRequest('/cat_breeds');
export const getBreed = (id) => apiRequest(`/cat_breeds/${id}`);
// CREATE
export const saveBreed = (breed) => apiRequest('/cat_breeds', { method: 'POST', body: breed });
// UPDATE
export const updateBreed = (id, updates) => apiRequest(`/cat_breeds/${id}`, { method: 'PUT', body: updates });
// DELETE
export const deleteBreed = (id) => apiRequest(`/cat_breeds/${id}`, { method: 'DELETE' });