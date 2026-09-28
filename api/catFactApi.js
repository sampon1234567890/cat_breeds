// api/catFactApi.js — third-party public API integration (Part 2 of the midterm).
// Cat Facts API — https://catfact.ninja — free, no API key required.
const CAT_FACT_API_URL = 'https://catfact.ninja/fact';

// Fetches one random cat fact.
// Response shape: { fact: string, length: number }
export async function getRandomCatFact() {
  let response;
  try {
    response = await fetch(CAT_FACT_API_URL);
  } catch {
    throw new Error('Network error — check your internet connection.');
  }

  if (!response.ok) {
    throw new Error(`Cat Facts API responded with ${response.status}`);
  }

  const data = await response.json().catch(() => null);
  if (!data || typeof data.fact !== 'string' || !data.fact.trim()) {
    throw new Error('Unexpected response from Cat Facts API.');
  }
  return data.fact;
}