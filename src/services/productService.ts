import type { Product } from '@/types'

function createMockProducts(): Product[] {
  const items: Product[] = []
  let id = 1

  // Helper to ensure safe defaults for all fields expected by HomePage
  const makeProduct = (
    name: string,
    slug: string,
    price: number,
    category: string,
    imagePath: string,
  ): Product =>
    ({
      id: String(id++),
      name,
      slug,
      price,
      category,
      images: [imagePath],
      image: imagePath,
      description: 'High quality apparel crafted for comfort and daily style.',
      inStock: true,
      featured: true,
      rating: 4.8,
      reviewCount: 12,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White'],
      tags: [category.toLowerCase(), 'new', 'featured'],
      createdAt: new Date().toISOString(),
    } as unknown as Product)

  // Accessories
  items.push(makeProduct('Classic Leather Belt', 'classic-leather-belt', 35, 'Accessories', '/images/products/accessories.jpg'))
  for (let i = 1; i <= 11; i++) {
    items.push(makeProduct(`Accessory Item ${i}`, `accessory-item-${i}`, 20 + i * 5, 'Accessories', `/images/products/accessories${i}.jpg`))
  }

  // Dresses
  for (let i = 1; i <= 11; i++) {
    items.push(makeProduct(`Elegant Dress ${i}`, `elegant-dress-${i}`, 60 + i * 10, 'Dresses', `/images/products/dress${i}.jpg`))
  }

  // Shirts
  items.push(makeProduct('Casual Cotton Shirt', 'casual-cotton-shirt', 40, 'Shirts', '/images/products/shirt.jpg'))
  for (let i = 2; i <= 11; i++) {
    items.push(makeProduct(`Tailored Shirt ${i}`, `tailored-shirt-${i}`, 35 + i * 5, 'Shirts', `/images/products/shirt${i}.jpg`))
  }

  // Skirts
  items.push(makeProduct('Classic A-Line Skirt', 'classic-a-line-skirt', 45, 'Skirts', '/images/products/skirt.jpg'))
  for (let i = 1; i <= 9; i++) {
    items.push(makeProduct(`Modern Skirt ${i}`, `modern-skirt-${i}`, 30 + i * 6, 'Skirts', `/images/products/skirt${i}.jpg`))
  }

  // Trousers & Jeans
  for (let i = 1; i <= 8; i++) {
    items.push(makeProduct(`Denim & Trousers ${i}`, `denim-trouser-${i}`, 50 + i * 8, 'Trousers & Jeans', `/images/products/trouser${i}.jpg`))
  }

  return items
}

const productsList: Product[] = createMockProducts()

export interface ProductQuery {
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'rating'
  q?: string
}

export async function getAllProducts(query: ProductQuery = {}): Promise<Product[]> {
  let filtered = [...productsList]

  if (query.category && query.category.toLowerCase() !== 'all') {
    const target = query.category.toLowerCase().replace(/[^a-z]/g, '')
    filtered = filtered.filter((p) => {
      const pCat = (p.category || '').toLowerCase().replace(/[^a-z]/g, '')
      return pCat.includes(target) || target.includes(pCat)
    })
  }

  if (query.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= query.minPrice!)
  }
  if (query.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= query.maxPrice!)
  }
  if (query.q) {
    const term = query.q.toLowerCase()
    filtered = filtered.filter((p) => (p.name || '').toLowerCase().includes(term))
  }

  if (query.sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (query.sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price)
  }

  return filtered
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return productsList.find((p) => p.slug === slug || String(p.id) === slug)
}

export async function searchProducts(term: string): Promise<Product[]> {
  const lower = term.toLowerCase()
  return productsList.filter((p) => (p.name || '').toLowerCase().includes(lower))
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const current = productsList.find((p) => p.slug === slug || String(p.id) === slug)
  if (!current) return productsList.slice(0, 4)
  return productsList.filter((p) => p.id !== current.id).slice(0, 4)
}

export async function getProductsByIds(ids: (string | number)[]): Promise<Product[]> {
  const strIds = ids.map(String)
  return productsList.filter((p) => strIds.includes(String(p.id)))
}