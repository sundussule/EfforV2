import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Product } from '@/types'
import { getProductBySlug, getRelatedProducts } from '@/services/productService'
import { formatCurrency } from '@/lib/format'
import { Rating } from '@/components/ui/Rating'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { AccordionItem } from '@/components/ui/Accordion'
import { PageSpinner } from '@/components/ui/Spinner'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useToast } from '@/context/ToastContext'

export function ProductDetailsPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { showToast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProductBySlug(slug).then((data) => {
      if (!data) {
        setLoading(false)
        return
      }
      setProduct(data)
      setSelectedColor(data.colors[0]?.name ?? '')
      setSelectedSize('')
      setActiveImage(0)
      setQuantity(1)
      setSizeError(false)
      setLoading(false)
      getRelatedProducts(slug).then(setRelated)
    })
  }, [slug])

  if (loading) return <PageSpinner />

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-semibold text-ink-950">Product not found</h1>
        <Button as="link" to="/shop" className="mt-6">
          Back to Shop
        </Button>
      </div>
    )
  }

  const onSale = product.compareAtPrice && product.compareAtPrice > product.price
  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    addItem(product, selectedSize, selectedColor, quantity)
    showToast(`${product.name} added to cart`, 'success')
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    addItem(product, selectedSize, selectedColor, quantity)
    navigate('/cart')
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div
            className="overflow-hidden rounded-2xl border border-ink-100"
            style={{ backgroundColor: product.imageBg }}
          >
            <ImageWithFallback
              src={product.images[activeImage]}
              alt={product.name}
              className="aspect-[3/4] w-full object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? 'border-ink-950' : 'border-ink-100'
                  }`}
                  style={{ backgroundColor: product.imageBg }}
                >
                  <ImageWithFallback src={img} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase tracking-wide text-ink-500">{product.brand}</span>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Rating value={product.rating} reviewCount={product.reviewCount} size="md" />
            {product.isNew && <Badge tone="accent">New</Badge>}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-ink-950">{formatCurrency(product.price)}</span>
            {onSale && (
              <span className="text-base text-ink-400 line-through">{formatCurrency(product.compareAtPrice!)}</span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-ink-600">{product.description}</p>

          {product.colors.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-ink-800">
                Color: <span className="font-normal text-ink-500">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    aria-pressed={selectedColor === c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? 'border-ink-950 scale-110' : 'border-ink-200'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-ink-800">
              Size {sizeError && <span className="font-normal text-red-600">— please select a size</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={selectedSize === size}
                  onClick={() => {
                    setSelectedSize(size)
                    setSizeError(false)
                  }}
                  className={`min-w-11 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'border-ink-950 bg-ink-950 text-white'
                      : 'border-ink-200 text-ink-700 hover:border-ink-950'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-950"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 ${wishlisted ? 'fill-accent-600 stroke-accent-600' : 'fill-none stroke-ink-950'}`}
                strokeWidth={1.6}
              >
                <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.58 3 20 5.42 20 8.5C20 13.5 12 21 12 21Z" />
              </svg>
              {wishlisted ? 'Saved' : 'Save'}
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" disabled={!product.inStock} onClick={handleAddToCart}>
              {product.inStock ? 'Add to Cart' : 'Sold Out'}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="flex-1"
              disabled={!product.inStock}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>

          <div className="mt-2">
            <AccordionItem title="Features" defaultOpen>
              <ul className="list-inside list-disc space-y-1">
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Shipping & Returns">
              Free standard shipping on orders over $150. Unworn items may be returned within 30 days of
              delivery for a full refund.
            </AccordionItem>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-ink-950">You May Also Like</h2>
          <ProductGrid products={related} />
        </section>
      )}

      <div className="mt-10">
        <Link to="/shop" className="text-sm font-medium text-ink-600 hover:text-ink-950">
          &larr; Back to all products
        </Link>
      </div>
    </div>
  )
}
