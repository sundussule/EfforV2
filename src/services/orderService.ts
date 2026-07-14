import type { Address, CartLineDetailed, Order } from '@/types'
import ordersData from '@/data/orders.json'
import { mockDelay } from './mockDelay'

const ORDERS_KEY = 'effor_orders'

function readStoredOrders(): Order[] {
  const raw = localStorage.getItem(ORDERS_KEY)
  return raw ? (JSON.parse(raw) as Order[]) : []
}

function writeStoredOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

const SHIPPING_FLAT_RATE = 8
const FREE_SHIPPING_THRESHOLD = 150
const TAX_RATE = 0.08

export function calculateOrderTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + shipping + tax) * 100) / 100
  return { shipping, tax, total }
}

// TODO: Replace with POST /api/orders (see API.orders.create)
// Request Payload: { items: CartItemDto[], shippingAddress: AddressDto, paymentMethod: string }
// Expected Response: OrderDto
export async function createOrder(
  lines: CartLineDetailed[],
  shippingAddress: Address,
  paymentMethod: string,
): Promise<Order> {
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0)
  const { shipping, tax, total } = calculateOrderTotals(subtotal)

  const order: Order = {
    id: `EFF-${Math.floor(100000 + Math.random() * 899999)}`,
    createdAt: new Date().toISOString(),
    status: 'processing',
    items: lines.map((l) => ({
      productId: l.product.id,
      name: l.product.name,
      image: l.product.images[0],
      imageBg: l.product.imageBg,
      price: l.product.price,
      quantity: l.quantity,
      size: l.size,
      color: l.color,
    })),
    subtotal,
    shipping,
    tax,
    total,
    shippingAddress,
    paymentMethod,
  }

  writeStoredOrders([order, ...readStoredOrders()])
  return mockDelay(order, 600)
}

// TODO: Replace with GET /api/orders (see API.orders.getAll)
// Expected Response: OrderDto[]
export async function getOrderHistory(): Promise<Order[]> {
  const seeded = ordersData as Order[]
  const created = readStoredOrders()
  return mockDelay([...created, ...seeded])
}

// TODO: Replace with GET /api/orders/{id} (see API.orders.getById)
// Expected Response: OrderDto
export async function getOrderById(id: string): Promise<Order | undefined> {
  const all = await getOrderHistory()
  return all.find((o) => o.id === id)
}
