import type { Category } from '@/types'
import categoriesData from '@/data/categories.json'
import { mockDelay } from './mockDelay'

const CATEGORIES = categoriesData as Category[]

// TODO: Replace with GET /api/categories (see API.categories.getAll)
// Expected Response: CategoryDto[]
export async function getAllCategories(): Promise<Category[]> {
  return mockDelay(CATEGORIES)
}

// TODO: Replace with GET /api/categories/{slug} (see API.categories.getBySlug)
// Expected Response: CategoryDto
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return mockDelay(CATEGORIES.find((c) => c.slug === slug))
}
