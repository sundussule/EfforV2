import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { subscribeToNewsletter } from '@/services/contactService'
import { useToast } from '@/context/ToastContext'

const FOOTER_LINKS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products', to: '/shop' },
      { label: 'Categories', to: '/categories' },
      { label: 'New Arrivals', to: '/shop?sort=newest' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Order Confirmation', to: '/order-confirmation' },
      { label: 'My Account', to: '/account' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
    ],
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const onSubscribe = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      await subscribeToNewsletter(email.trim())
      showToast('You’re subscribed! Watch your inbox for updates.', 'success')
      setEmail('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="border-t border-ink-200 bg-ink-50">
      <div className="container-page grid grid-cols-2 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
          <Link to="/" className="text-lg font-semibold tracking-tight text-ink-950">
            EFFOR
          </Link>
          <p className="max-w-xs text-sm text-ink-500">
            Considered women's clothing and accessories for everyday wear. Free shipping on orders over $150.
          </p>
          <form onSubmit={onSubscribe} className="flex max-w-sm gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              aria-label="Email for newsletter"
              className="w-full rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-ink-950"
            />
            <button
              type="submit"
              disabled={submitting}
              className="shrink-0 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-800 disabled:opacity-60"
            >
              Join
            </button>
          </form>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.heading} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-ink-950">{group.heading}</h4>
            <ul className="flex flex-col gap-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-ink-500 transition-colors hover:text-ink-950">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-ink-200">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs text-ink-500">&copy; {new Date().getFullYear()} Effor. All rights reserved.</p>
          <p className="text-xs text-ink-400">Demo storefront &mdash; mock data only, no real transactions.</p>
        </div>
      </div>
    </footer>
  )
}
