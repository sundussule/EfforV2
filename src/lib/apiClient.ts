import { BASE_URL } from '@/config/api.config'

const TOKEN_KEY = 'effor_auth_token'

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

/** Substitutes `{param}` placeholders in an api.config.ts endpoint path, e.g. "/api/products/{slug}". */
export function withParams(endpoint: string, params: Record<string, string>): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`{${key}}`, encodeURIComponent(value)),
    endpoint,
  )
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers = new Headers(options.headers)
  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    let message = res.statusText
    try {
      const body = (await res.json()) as { error?: string }
      message = body.error ?? message
    } catch {
      // response had no JSON body
    }
    throw new Error(message)
  }

  const text = await res.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}
