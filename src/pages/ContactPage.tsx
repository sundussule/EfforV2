import { useState, type FormEvent } from 'react'
import { sendContactMessage } from '@/services/contactService'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await sendContactMessage(form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page max-w-3xl py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />
      <h1 className="mb-2 mt-3 text-3xl font-semibold tracking-tight text-ink-950">Contact Us</h1>
      <p className="mb-8 text-sm text-ink-500">
        Have a question about an order, product fit, or anything else? Send us a message and we'll get back to
        you within one business day.
      </p>

      {sent ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-emerald-800">Message sent</h2>
          <p className="mt-1 text-sm text-emerald-700">Thanks for reaching out — our team will follow up soon.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="name"
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              id="email"
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <Input
            id="subject"
            label="Subject"
            required
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          />
          <Textarea
            id="message"
            label="Message"
            required
            rows={6}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
          <Button type="submit" size="lg" className="self-start" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send Message'}
          </Button>
        </form>
      )}
    </div>
  )
}
