import type { User } from '@/types'
import { API } from '@/config/api.config'
import { apiFetch, setAuthToken } from '@/lib/apiClient'

const SESSION_KEY = 'effor_session_user'

interface AuthResponse {
  token: string
  user: User
}

export async function login(email: string, password: string): Promise<User> {
  const { token, user } = await apiFetch<AuthResponse>(API.auth.login.endpoint, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setAuthToken(token)
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export async function register(input: {
  firstName: string
  lastName: string
  email: string
  password: string
}): Promise<User> {
  const { token, user } = await apiFetch<AuthResponse>(API.auth.register.endpoint, {
    method: 'POST',
    body: JSON.stringify(input),
  })
  setAuthToken(token)
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>(API.auth.logout.endpoint, { method: 'POST' })
  } finally {
    setAuthToken(null)
    localStorage.removeItem(SESSION_KEY)
  }
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}
