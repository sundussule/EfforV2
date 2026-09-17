import type { Category } from '@/types'

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Accessories',
    slug: 'accessories',
    image: '/images/categories/accessories.jpg'
  },
  {
    id: '2',
    name: 'Dresses',
    slug: 'dresses',
    image: '/images/categories/dresses.jpg'
  },
  {
    id: '3',
    name: 'Shirts',
    slug: 'shirts',
    image: '/images/categories/shirts.jpg'
  },
  {
    id: '4',
    name: 'Skirts',
    slug: 'skirts',
    image: '/images/categories/skirts.jpg'
  },
  {
    id: '5',
    name: 'Trousers & Jeans',
    slug: 'trousers-jeans',
    image: '/images/categories/trousers-jeans.jpg'
  }
] as unknown as Category[]

export async function getAllCategories(): Promise<Category[]> {
  return mockCategories
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return mockCategories.find((c) => c.slug === slug)
}