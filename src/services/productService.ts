import type { Product } from '@/types'
import { API } from '@/config/api.config'
import { apiFetch, withParams } from '@/lib/apiClient'

export interface ProductQuery {
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'rating'
  q?: string
}

function toQueryString(query: object): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value))
  }
  const str = params.toString()
  return str ? `?${str}` : ''
}

export async function getAllProducts(query: ProductQuery = {}): Promise<Product[]> {
  return apiFetch<Product[]>(`${API.products.getAll.endpoint}${toQueryString(query)}`)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    return await apiFetch<Product>(withParams(API.products.getBySlug.endpoint, { slug }))
  } catch {
    return undefined
  }
}

export async function searchProducts(term: string): Promise<Product[]> {
  return apiFetch<Product[]>(`${API.products.search.endpoint}${toQueryString({ q: term })}`)
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  return apiFetch<Product[]>(withParams(API.products.getRelated.endpoint, { slug }))
}

// No dedicated batch-by-id endpoint; filtered client-side as noted in api.config.ts.
export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  const all = await getAllProducts()
  return all.filter((p) => ids.includes(p.id))
}
