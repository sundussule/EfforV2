import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '@/types'
import { getAllCategories } from '@/services/categoryService'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageSpinner } from '@/components/ui/Spinner'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCategories().then((data) => {
      setCategories(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
      <h1 className="mb-8 mt-3 text-3xl font-semibold tracking-tight text-ink-950">Shop by Category</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-ink-100"
          >
            <ImageWithFallback
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6">
              <h2 className="text-xl font-semibold text-white">{cat.name}</h2>
              <p className="text-sm text-white/80">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
