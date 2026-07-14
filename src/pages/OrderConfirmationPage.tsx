import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Order } from '@/types'
import { getOrderById } from '@/services/orderService'
import { formatCurrency, formatDate } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export function OrderConfirmationPage() {
  const { orderId = '' } = useParams()
  const [order, setOrder] = useState<Order | null | undefined>(undefined)

  useEffect(() => {
    getOrderById(orderId).then(setOrder)
  }, [orderId])

  if (order === undefined) return <PageSpinner />

  if (!order) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-semibold text-ink-950">Order not found</h1>
        <p className="mt-2 text-sm text-ink-500">We couldn't find an order with ID {orderId}.</p>
        <Button as="link" to="/shop" className="mt-6">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="container-page max-w-3xl py-16">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink-950">Order Confirmed</h1>
        <p className="mt-2 max-w-md text-sm text-ink-600">
          Thank you! Your order has been placed successfully. A confirmation email would be sent to you in a
          production environment.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="text-ink-500">Order Number</span>
            <p className="font-semibold text-ink-950">{order.id}</p>
          </div>
          <div>
            <span className="text-ink-500">Date</span>
            <p className="font-semibold text-ink-950">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <span className="text-ink-500">Total</span>
            <p className="font-semibold text-ink-950">{formatCurrency(order.total)}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-ink-200 p-6">
        <h2 className="mb-4 text-sm font-semibold text-ink-950">Order Details</h2>
        <ul className="flex flex-col gap-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-4">
              <ImageWithFallback
                src={item.image}
                alt=""
                className="h-16 w-14 rounded-lg border border-ink-100 object-contain"
                style={{ backgroundColor: item.imageBg }}
              />
              <div className="flex-1 text-sm">
                <p className="font-medium text-ink-950">{item.name}</p>
                <p className="text-xs text-ink-500">
                  Qty {item.quantity} &middot; Size {item.size} &middot; {item.color}
                </p>
              </div>
              <span className="text-sm font-semibold text-ink-950">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2 border-t border-ink-200 pt-4 text-sm">
          <div className="flex justify-between text-ink-600">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-600">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-ink-600">
            <span>Tax</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between border-t border-ink-200 pt-2 text-base font-semibold text-ink-950">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 p-6">
          <h3 className="mb-2 text-sm font-semibold text-ink-950">Shipping Address</h3>
          <p className="text-sm text-ink-600">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>
        <div className="rounded-2xl border border-ink-200 p-6">
          <h3 className="mb-2 text-sm font-semibold text-ink-950">Payment Method</h3>
          <p className="text-sm text-ink-600">{order.paymentMethod}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button as="link" to="/shop" size="lg">
          Continue Shopping
        </Button>
        <Button as="link" to="/account" variant="secondary" size="lg">
          View Order History
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-ink-400">
        <Link to="/" className="hover:text-ink-950">
          Back to Home
        </Link>
      </p>
    </div>
  )
}
