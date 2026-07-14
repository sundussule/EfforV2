import { useWishlist } from '@/context/WishlistContext'
import { ProductGrid } from '@/components/product/ProductGrid'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export function WishlistPage() {
  const { products, loading } = useWishlist()

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <h1 className="mb-8 mt-3 text-3xl font-semibold tracking-tight text-ink-950">Wishlist</h1>

      {loading ? (
        <PageSpinner />
      ) : products.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Tap the heart icon on any product to save it here for later."
          action={
            <Button as="link" to="/shop">
              Explore Products
            </Button>
          }
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
