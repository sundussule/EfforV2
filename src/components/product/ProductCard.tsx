import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/format'
import { Rating } from '@/components/ui/Rating'
import { Badge } from '@/components/ui/Badge'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { useWishlist } from '@/context/WishlistContext'

export function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <div className="group relative flex flex-col">
      <Link
        to={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-2xl border border-ink-100"
        style={{ backgroundColor: product.imageBg }}
      >
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="aspect-[3/4] w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge tone="accent">New</Badge>}
          {onSale && <Badge tone="muted">Sale</Badge>}
          {!product.inStock && <Badge tone="muted">Sold Out</Badge>}
        </div>
      </Link>

      <button
        type="button"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wishlisted}
        onClick={(e) => {
          e.preventDefault()
          toggleWishlist(product.id)
        }}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-950 shadow-sm backdrop-blur transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className={`h-4.5 w-4.5 ${wishlisted ? 'fill-accent-600 stroke-accent-600' : 'fill-none stroke-ink-950'}`} strokeWidth={1.6}>
          <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.58 3 20 5.42 20 8.5C20 13.5 12 21 12 21Z" />
        </svg>
      </button>

      <Link to={`/products/${product.slug}`} className="mt-3 flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-ink-500">{product.brand}</span>
        <h3 className="text-sm font-medium text-ink-950 line-clamp-2">{product.name}</h3>
        <Rating value={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-ink-950">{formatCurrency(product.price)}</span>
          {onSale && (
            <span className="text-xs text-ink-400 line-through">{formatCurrency(product.compareAtPrice!)}</span>
          )}
        </div>
      </Link>
    </div>
  )
}
