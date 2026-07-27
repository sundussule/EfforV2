import type { Category } from '@/types'
import { API } from '@/config/api.config'
import { apiFetch, withParams } from '@/lib/apiClient'

export async function getAllCategories(): Promise<Category[]> {
  return apiFetch<Category[]>(API.categories.getAll.endpoint)
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    return await apiFetch<Category>(withParams(API.categories.getBySlug.endpoint, { slug }))
  } catch {
    return undefined
  }
}
