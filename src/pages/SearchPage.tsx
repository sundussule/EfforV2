import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product } from '@/types'
import { searchProducts } from '@/services/productService'
import { ProductGrid } from '@/components/product/ProductGrid'
import { PageSpinner } from '@/components/ui/Spinner'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [term, setTerm] = useState(query)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    setTerm(query)
    if (!query) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    searchProducts(query).then((data) => {
      setResults(data)
      setLoading(false)
      setSearched(true)
    })
  }, [query])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSearchParams(term.trim() ? { q: term.trim() } : {})
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-ink-950">Search</h1>

      <form onSubmit={onSubmit} className="mb-8 flex max-w-xl items-center gap-3 rounded-full border border-ink-200 px-5 py-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-400" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search products, brands, categories…"
          className="w-full bg-transparent text-sm text-ink-950 outline-none placeholder:text-ink-400"
        />
        <button type="submit" className="text-sm font-medium text-ink-950">
          Search
        </button>
      </form>

      {loading && <PageSpinner />}

      {!loading && searched && (
        <>
          <p className="mb-4 text-sm text-ink-500">
            {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
          </p>
          <ProductGrid products={results} />
        </>
      )}

      {!loading && !searched && (
        <p className="text-sm text-ink-500">Try searching for “dresses”, “denim”, or “outerwear”.</p>
      )}
    </div>
  )
}
