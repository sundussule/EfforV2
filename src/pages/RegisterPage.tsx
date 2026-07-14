import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function RegisterPage() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await register(form)
      showToast('Account created. Welcome to Effor!', 'success')
      navigate('/account', { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Create your account</h1>
        <p className="mt-1 text-sm text-ink-500">Track orders, save favorites, and check out faster.</p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="firstName" label="First Name" required value={form.firstName} onChange={update('firstName')} />
            <Input id="lastName" label="Last Name" required value={form.lastName} onChange={update('lastName')} />
          </div>
          <Input id="email" label="Email" type="email" required value={form.email} onChange={update('email')} />
          <Input
            id="password"
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update('password')}
          />
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ink-950 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
