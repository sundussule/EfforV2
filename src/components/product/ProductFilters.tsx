import type { Category } from '@/types'

export interface PriceRange {
  label: string
  min?: number
  max?: number
}

export const PRICE_RANGES: PriceRange[] = [
  { label: 'All prices' },
  { label: 'Under $50', max: 49 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100 – $150', min: 100, max: 150 },
  { label: '$150+', min: 150 },
]

export const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
] as const

interface ProductFiltersProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (slug: string) => void
  priceLabel: string
  onPriceChange: (range: PriceRange) => void
  sort: string
  onSortChange: (sort: string) => void
  resultCount: number
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceLabel,
  onPriceChange,
  sort,
  onSortChange,
  resultCount,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-ink-200 pb-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange('')}
          className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
            selectedCategory === ''
              ? 'border-ink-950 bg-ink-950 text-white'
              : 'border-ink-200 text-ink-700 hover:border-ink-950'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => onCategoryChange(cat.slug)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              selectedCategory === cat.slug
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-ink-200 text-ink-700 hover:border-ink-950'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-500">{resultCount} {resultCount === 1 ? 'result' : 'results'}</p>
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by price"
            value={priceLabel}
            onChange={(e) => {
              const range = PRICE_RANGES.find((r) => r.label === e.target.value) ?? PRICE_RANGES[0]
              onPriceChange(range)
            }}
            className="rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-medium text-ink-700 outline-none focus:border-ink-950"
          >
            {PRICE_RANGES.map((r) => (
              <option key={r.label} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-medium text-ink-700 outline-none focus:border-ink-950"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
