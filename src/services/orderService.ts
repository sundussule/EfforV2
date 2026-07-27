import type { Address, CartLineDetailed, Order } from '@/types'
import { API } from '@/config/api.config'
import { apiFetch, withParams } from '@/lib/apiClient'

const SHIPPING_FLAT_RATE = 8
const FREE_SHIPPING_THRESHOLD = 150
const TAX_RATE = 0.08

/** Client-side preview only — the backend recomputes authoritative totals on order creation. */
export function calculateOrderTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + shipping + tax) * 100) / 100
  return { shipping, tax, total }
}

export async function createOrder(
  lines: CartLineDetailed[],
  shippingAddress: Address,
  paymentMethod: string,
): Promise<Order> {
  return apiFetch<Order>(API.orders.create.endpoint, {
    method: 'POST',
    body: JSON.stringify({
      items: lines.map((l) => ({
        productId: l.product.id,
        quantity: l.quantity,
        size: l.size,
        color: l.color,
      })),
      shippingAddress,
      paymentMethod,
    }),
  })
}

export async function getOrderHistory(): Promise<Order[]> {
  return apiFetch<Order[]>(API.orders.getAll.endpoint)
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  try {
    return await apiFetch<Order>(withParams(API.orders.getById.endpoint, { id }))
  } catch {
    return undefined
  }
}
