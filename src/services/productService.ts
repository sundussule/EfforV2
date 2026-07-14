import type { Product } from '@/types'
import productsData from '@/data/products.json'
import { mockDelay } from './mockDelay'

const PRODUCTS = productsData as Product[]

export interface ProductQuery {
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'rating'
  q?: string
}

// TODO: Replace with GET /api/products (see API.products.getAll in src/config/api.config.ts)
// Query params: category, minPrice, maxPrice, sort, q, page, pageSize
// Expected Response: ProductDto[]
export async function getAllProducts(query: ProductQuery = {}): Promise<Product[]> {
  let results = [...PRODUCTS]

  if (query.category) {
    results = results.filter((p) => p.categorySlug === query.category)
  }
  if (query.minPrice !== undefined) {
    results = results.filter((p) => p.price >= query.minPrice!)
  }
  if (query.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= query.maxPrice!)
  }
  if (query.q) {
    const term = query.q.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term)),
    )
  }

  switch (query.sort) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      results.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      results.sort((a, b) => Number(b.isNew) - Number(a.isNew))
      break
  }

  return mockDelay(results)
}

// TODO: Replace with GET /api/products/{slug} (see API.products.getBySlug)
// Expected Response: ProductDto
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return mockDelay(PRODUCTS.find((p) => p.slug === slug))
}

// TODO: Replace with GET /api/products/search?q= (see API.products.search)
// Expected Response: ProductDto[]
export async function searchProducts(term: string): Promise<Product[]> {
  return getAllProducts({ q: term })
}

// TODO: Replace with GET /api/products/{slug}/related (see API.products.getRelated)
// Expected Response: ProductDto[]
export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  const current = PRODUCTS.find((p) => p.slug === slug)
  if (!current) return mockDelay([])
  const related = PRODUCTS.filter((p) => p.categorySlug === current.categorySlug && p.slug !== slug).slice(
    0,
    limit,
  )
  return mockDelay(related)
}

// TODO: Replace with GET /api/products (filtered client-side by id, or add a
// dedicated GET /api/products/by-ids?ids= batch endpoint on the backend)
// Expected Response: ProductDto[]
export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  return mockDelay(PRODUCTS.filter((p) => ids.includes(p.id)))
}
