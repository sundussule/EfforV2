import type { User } from '@/types'

const SESSION_KEY = 'effor_session_user'

export async function login(email: string, _password?: string): Promise<User> {
  const dummyUser: User = {
    id: '1',
    email,
    firstName: email.split('@')[0] || 'User',
    lastName: 'Demo',
  } as unknown as User

  localStorage.setItem(SESSION_KEY, JSON.stringify(dummyUser))
  return dummyUser
}

export async function register(input: {
  firstName: string
  lastName: string
  email: string
  password: string
}): Promise<User> {
  const dummyUser: User = {
    id: '1',
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
  } as unknown as User

  localStorage.setItem(SESSION_KEY, JSON.stringify(dummyUser))
  return dummyUser
}

export async function logout(): Promise<void> {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}