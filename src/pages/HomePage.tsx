import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category, Product } from '@/types'
import { getAllProducts } from '@/services/productService'
import { getAllCategories } from '@/services/categoryService'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { HeroImage } from '@/components/home/HeroImage'
import { BrandMark } from '@/components/home/BrandMark'

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllProducts(), getAllCategories()]).then(([p, c]) => {
      setProducts(p)
      setCategories(c)
      setLoading(false)
    })
  }, [])

  if (loading) return <PageSpinner />

  const newArrivals = products.filter((p) => p.isNew)
  const featured =
    newArrivals.length >= 8
      ? newArrivals.slice(0, 8)
      : [...newArrivals, ...products.filter((p) => !p.isNew)].slice(0, 8)
  const bestSellers = products.filter((p) => p.tags.includes('bestseller')).slice(0, 4)

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <ImageWithFallback
          src="/images/hero/background.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" aria-hidden="true" />

        <BrandMark className="absolute left-5 top-6 z-10 h-8 w-8 text-white/70 sm:left-8 sm:top-8 sm:h-10 sm:w-10" />

        <div className="container-page relative z-10 grid grid-cols-1 items-center gap-8 pb-14 pt-24 lg:grid-cols-2 lg:gap-4 lg:pb-24 lg:pt-28">
          <div className="order-2 flex justify-center lg:order-1">
            <HeroImage className="w-full max-w-xs lg:max-w-sm" />
          </div>

          <div className="animate-hero-in order-1 flex flex-col items-start gap-5 lg:order-2 lg:items-end lg:text-right">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
              New Season Collection
            </span>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Wear It.
              <br />
              <span className="relative inline-block">
                Own It.
                <span className="absolute -bottom-2 left-0 h-[3px] w-full origin-left animate-underline bg-accent-500" />
              </span>
            </h1>
            <p className="max-w-md text-base text-white/70 lg:ml-auto">
              Dresses, outerwear and everyday essentials, designed with considered fabrics and a clean fit.
              Free shipping on orders over $150.
            </p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button as="link" to="/shop" variant="light" size="lg">
                Shop Now
              </Button>
              <Button as="link" to="/categories" variant="outlineLight" size="lg">
                Browse Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-950">Shop by Category</h2>
          <Link to="/categories" className="text-sm font-medium text-ink-600 hover:text-ink-950">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-ink-100">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-xs font-medium text-ink-800 sm:text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950">New Arrivals</h2>
            <Link to="/shop?sort=newest" className="text-sm font-medium text-ink-600 hover:text-ink-950">
              View all
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-950">Best Sellers</h2>
          <Link to="/shop" className="text-sm font-medium text-ink-600 hover:text-ink-950">
            View all
          </Link>
        </div>
        <ProductGrid products={bestSellers} />
      </section>

      <section className="border-t border-ink-200">
        <div className="container-page grid grid-cols-1 gap-6 py-14 sm:grid-cols-3">
          {[
            { title: 'Free Shipping', desc: 'On all orders over $150, delivered in 3-5 business days.' },
            { title: '30-Day Returns', desc: 'Not the right fit? Return unworn items within 30 days.' },
            { title: 'Secure Checkout', desc: 'Your payment details are encrypted and never stored.' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-2 rounded-2xl border border-ink-200 p-6">
              <h3 className="text-sm font-semibold text-ink-950">{item.title}</h3>
              <p className="text-sm text-ink-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
