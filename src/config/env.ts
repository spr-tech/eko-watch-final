// Environment settings, read once at start-up. There is no mock toggle: every request
// goes to the deployed backend.

// VITE_API_BASE_URL is the backend address including /api/v1 once, e.g.
// https://ekowatch-backend.onrender.com/api/v1. Returns it without a trailing slash.
export function parseApiBaseUrl(value: string | undefined): string {
  if (!value) {
    throw new Error(
      'VITE_API_BASE_URL is not set. Copy .env.example to .env (or set it in the deploy settings) and restart the dev server.',
    )
  }
  const url = value.trim().replace(/\/+$/, '')
  if (!url.endsWith('/api/v1')) {
    throw new Error(`VITE_API_BASE_URL must end with /api/v1 (endpoint paths never repeat it). Got: ${url}`)
  }
  return url
}

export const env = {
  apiBaseUrl: parseApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
} as const
