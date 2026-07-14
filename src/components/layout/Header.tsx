import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { itemCount } = useCart()
  const { productIds } = useWishlist()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchOpen(false)
      setMobileOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
            {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <Link to="/" className="text-lg font-semibold tracking-tight text-ink-950">
          EFFOR
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-ink-950' : 'text-ink-500 hover:text-ink-950'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center text-ink-700 hover:text-ink-950"
            onClick={() => setSearchOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>

          <Link
            to={isAuthenticated ? '/account' : '/login'}
            aria-label="Account"
            className="hidden h-9 w-9 items-center justify-center text-ink-700 hover:text-ink-950 sm:flex"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20c1.5-3.8 4.8-6 7.5-6s6 2.2 7.5 6" />
            </svg>
          </Link>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative flex h-9 w-9 items-center justify-center text-ink-700 hover:text-ink-950"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.58 3 20 5.42 20 8.5C20 13.5 12 21 12 21Z" />
            </svg>
            {productIds.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-600 text-[10px] font-semibold text-white">
                {productIds.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center text-ink-700 hover:text-ink-950"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M3 5h2l1.2 11.5A2 2 0 0 0 8.2 18.5h9a2 2 0 0 0 2-1.7L20.5 9H6" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="17" cy="21" r="1" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink-950 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-ink-200 bg-white">
          <form onSubmit={submitSearch} className="container-page flex items-center gap-3 py-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-400" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              autoFocus
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, brands, categories…"
              className="w-full bg-transparent text-sm text-ink-950 outline-none placeholder:text-ink-400"
            />
          </form>
        </div>
      )}

      {mobileOpen && (
        <nav className="border-t border-ink-200 bg-white lg:hidden">
          <div className="container-page flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `border-b border-ink-100 py-3 text-sm font-medium last:border-0 ${isActive ? 'text-ink-950' : 'text-ink-600'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm font-medium text-ink-600"
            >
              {isAuthenticated ? 'My Account' : 'Login / Register'}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
