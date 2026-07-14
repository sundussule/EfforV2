import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getOrderHistory } from '@/services/orderService'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSpinner } from '@/components/ui/Spinner'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

const STATUS_TONE: Record<OrderStatus, 'muted' | 'accent' | 'success'> = {
  processing: 'muted',
  shipped: 'accent',
  delivered: 'success',
}

export function AccountPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    getOrderHistory().then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [isAuthenticated])

  if (authLoading) return <PageSpinner />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/account' }} replace />

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Account' }]} />

      <div className="mb-8 mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink-950">
            Hi, {user?.firstName}
          </h1>
          <p className="mt-1 text-sm text-ink-500">{user?.email}</p>
        </div>
        <Button variant="secondary" onClick={() => logout()}>
          Log Out
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link to="/wishlist" className="rounded-2xl border border-ink-200 p-6 transition-colors hover:border-ink-950">
          <h3 className="text-sm font-semibold text-ink-950">Wishlist</h3>
          <p className="mt-1 text-xs text-ink-500">View your saved items</p>
        </Link>
        <Link to="/shop" className="rounded-2xl border border-ink-200 p-6 transition-colors hover:border-ink-950">
          <h3 className="text-sm font-semibold text-ink-950">Continue Shopping</h3>
          <p className="mt-1 text-xs text-ink-500">Browse the full catalog</p>
        </Link>
        <Link to="/contact" className="rounded-2xl border border-ink-200 p-6 transition-colors hover:border-ink-950">
          <h3 className="text-sm font-semibold text-ink-950">Need Help?</h3>
          <p className="mt-1 text-xs text-ink-500">Contact support</p>
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-ink-950">Order History</h2>

        {loading ? (
          <PageSpinner />
        ) : orders.length === 0 ? (
          <EmptyState title="No orders yet" description="Your past orders will show up here once you check out." />
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/order-confirmation/${order.id}`}
                className="flex flex-col gap-4 rounded-2xl border border-ink-200 p-5 transition-colors hover:border-ink-950 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((item, i) => (
                      <ImageWithFallback
                        key={i}
                        src={item.image}
                        alt=""
                        className="h-12 w-12 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-950">{order.id}</p>
                    <p className="text-xs text-ink-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge tone={STATUS_TONE[order.status]}>{order.status}</Badge>
                  <span className="text-sm font-semibold text-ink-950">{formatCurrency(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
