import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Category, Product } from '@/types'
import { getAllProducts, type ProductQuery } from '@/services/productService'
import { getAllCategories } from '@/services/categoryService'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilters, PRICE_RANGES, type PriceRange } from '@/components/product/ProductFilters'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageSpinner } from '@/components/ui/Spinner'

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const category = searchParams.get('category') ?? ''
  const sort = searchParams.get('sort') ?? ''
  const priceLabel = searchParams.get('price') ?? PRICE_RANGES[0].label

  useEffect(() => {
    getAllCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    const range = PRICE_RANGES.find((r) => r.label === priceLabel) ?? PRICE_RANGES[0]
    getAllProducts({
      category: category || undefined,
      minPrice: range.min,
      maxPrice: range.max,
      sort: (sort || undefined) as ProductQuery['sort'],
    }).then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [category, sort, priceLabel])

  const activeCategory = useMemo(() => categories.find((c) => c.slug === category), [categories, category])

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          ...(activeCategory ? [{ label: activeCategory.name }] : []),
        ]}
      />

      <h1 className="mb-6 mt-3 text-3xl font-semibold tracking-tight text-ink-950">
        {activeCategory ? activeCategory.name : 'All Products'}
      </h1>

      <ProductFilters
        categories={categories}
        selectedCategory={category}
        onCategoryChange={(slug) => updateParam('category', slug)}
        priceLabel={priceLabel}
        onPriceChange={(range: PriceRange) => updateParam('price', range.label)}
        sort={sort}
        onSortChange={(value) => updateParam('sort', value)}
        resultCount={products.length}
      />

      <div className="pt-8">{loading ? <PageSpinner /> : <ProductGrid products={products} />}</div>
    </div>
  )
}
