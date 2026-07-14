import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('demo@effor.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = (location.state as { from?: string })?.from ?? '/account'

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      showToast('Welcome back!', 'success')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-500">Log in to view your orders, wishlist and saved details.</p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <Input id="email" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            id="password"
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error || undefined}
          />
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log In'}
          </Button>
        </form>

        <p className="mt-4 text-xs text-ink-400">
          Demo credentials are pre-filled. This is a mock login — no real authentication occurs.
        </p>

        <p className="mt-8 text-center text-sm text-ink-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-ink-950 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
