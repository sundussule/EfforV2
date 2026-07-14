import type { User } from '@/types'
import usersData from '@/data/users.json'
import { mockDelay } from './mockDelay'

interface StoredUser extends User {
  password: string
}

const USERS = usersData as StoredUser[]
const SESSION_KEY = 'effor_session_user'

// TODO: Replace with POST /api/auth/login (see API.auth.login)
// Request Payload: { email: string, password: string }
// Expected Response: AuthResponseDto { token, user }
export async function login(email: string, password: string): Promise<User> {
  await mockDelay(null)
  const match = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  if (!match) {
    throw new Error('Invalid email or password')
  }
  const { password: _password, ...user } = match
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

// TODO: Replace with POST /api/auth/register (see API.auth.register)
// Request Payload: { firstName, lastName, email, password }
// Expected Response: AuthResponseDto { token, user }
export async function register(input: {
  firstName: string
  lastName: string
  email: string
  password: string
}): Promise<User> {
  const user: User = {
    id: Date.now(),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return mockDelay(user)
}

// TODO: Replace with POST /api/auth/logout (see API.auth.logout)
export async function logout(): Promise<void> {
  localStorage.removeItem(SESSION_KEY)
  return mockDelay(undefined)
}

// TODO: Replace with GET /api/auth/me (see API.auth.me)
// Expected Response: UserDto
export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}
