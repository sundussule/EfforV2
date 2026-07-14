import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { CartItemRow } from '@/components/cart/CartItemRow'
import { CartSummary } from '@/components/cart/CartSummary'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export function CartPage() {
  const { lines, subtotal, loading } = useCart()
  const navigate = useNavigate()

  if (loading) return <PageSpinner />

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <h1 className="mb-8 mt-3 text-3xl font-semibold tracking-tight text-ink-950">Shopping Cart</h1>

      {lines.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Explore the shop to find your next favorite pair."
          action={
            <Button as="link" to="/shop">
              Continue Shopping
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {lines.map((line) => (
              <CartItemRow key={`${line.productId}-${line.size}-${line.color}`} line={line} />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <CartSummary subtotal={subtotal}>
              <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </CartSummary>
            <Link to="/shop" className="text-center text-sm font-medium text-ink-600 hover:text-ink-950">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
