import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createOrder } from '@/services/orderService'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CartSummary } from '@/components/cart/CartSummary'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type { Address } from '@/types'

const initialAddress: Address = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  phone: '',
}

export function CheckoutPage() {
  const { lines, subtotal, clearCart, loading } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState<Address>({
    ...initialAddress,
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
  })
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  if (!loading && !orderPlaced && lines.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const order = await createOrder(lines, address, `Card ending in ${card.number.slice(-4) || '0000'}`)
      setOrderPlaced(true)
      clearCart()
      navigate(`/order-confirmation/${order.id}`, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  const field = (key: keyof Address) => ({
    id: key,
    value: address[key] ?? '',
    onChange: (e: ChangeEvent<HTMLInputElement>) => setAddress((a) => ({ ...a, [key]: e.target.value })),
    required: key !== 'line2',
  })

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mb-8 mt-3 text-3xl font-semibold tracking-tight text-ink-950">Checkout</h1>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-10 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-ink-950">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Full Name" placeholder="Jordan Reyes" {...field('fullName')} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Address Line 1" placeholder="Street address" {...field('line1')} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Address Line 2 (optional)" placeholder="Apt, suite, etc." {...field('line2')} />
              </div>
              <Input label="City" {...field('city')} />
              <Input label="State / Province" {...field('state')} />
              <Input label="Postal Code" {...field('postalCode')} />
              <Input label="Country" {...field('country')} />
              <div className="sm:col-span-2">
                <Input label="Phone" type="tel" placeholder="555-123-4567" {...field('phone')} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-ink-950">Payment</h2>
            <p className="mb-4 text-xs text-ink-500">
              This is a demo checkout — no real payment is processed and no card data is transmitted.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  id="cardName"
                  label="Name on Card"
                  required
                  value={card.name}
                  onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  id="cardNumber"
                  label="Card Number"
                  required
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  maxLength={19}
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                />
              </div>
              <Input
                id="cardExpiry"
                label="Expiry"
                required
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
              />
              <Input
                id="cardCvc"
                label="CVC"
                required
                placeholder="123"
                inputMode="numeric"
                maxLength={4}
                value={card.cvc}
                onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))}
              />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-ink-200 p-6">
            <h3 className="mb-4 text-sm font-semibold text-ink-950">{lines.length} Items</h3>
            <ul className="flex flex-col gap-3">
              {lines.map((l) => (
                <li key={`${l.productId}-${l.size}-${l.color}`} className="flex items-center gap-3">
                  <ImageWithFallback
                    src={l.product.images[0]}
                    alt=""
                    className="h-14 w-12 shrink-0 rounded-lg border border-ink-100 object-contain"
                    style={{ backgroundColor: l.product.imageBg }}
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-ink-950 line-clamp-1">{l.product.name}</p>
                    <p className="text-xs text-ink-500">
                      Qty {l.quantity} &middot; {l.size}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <CartSummary subtotal={subtotal}>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Placing Order…' : 'Place Order'}
            </Button>
          </CartSummary>
        </div>
      </form>
    </div>
  )
}
