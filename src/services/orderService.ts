import type { Address, CartLineDetailed, Order } from '@/types'

const SHIPPING_FLAT_RATE = 8
const FREE_SHIPPING_THRESHOLD = 150
const TAX_RATE = 0.08

export function calculateOrderTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + shipping + tax) * 100) / 100
  return { shipping, tax, total }
}

const ORDERS_KEY = 'effor_mock_orders'

function getStoredOrders(): Order[] {
  const raw = localStorage.getItem(ORDERS_KEY)
  return raw ? JSON.parse(raw) : []
}

export async function createOrder(
  lines: CartLineDetailed[],
  shippingAddress: Address,
  paymentMethod: string,
): Promise<Order> {
  const subtotal = lines.reduce((acc, line) => acc + line.product.price * line.quantity, 0)
  const { shipping, tax, total } = calculateOrderTotals(subtotal)

  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    items: lines.map((l) => ({
      product: l.product,
      quantity: l.quantity,
      size: l.size,
      color: l.color,
      price: l.product.price,
    })),
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee: shipping,
    tax,
    total,
  } as unknown as Order

  const orders = getStoredOrders()
  orders.unshift(newOrder)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))

  return newOrder
}

export async function getOrderHistory(): Promise<Order[]> {
  return getStoredOrders()
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = getStoredOrders()
  return orders.find((o) => o.id === id)
}
