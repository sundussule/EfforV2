export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: number
  slug: string
  name: string
  brand: string
  categorySlug: string
  price: number
  compareAtPrice?: number
  currency: string
  images: string[]
  /** Dominant backdrop color sampled from the product photo, so its display frame can match exactly instead of showing a mismatched card background. */
  imageBg: string
  colors: ProductColor[]
  sizes: string[]
  rating: number
  reviewCount: number
  description: string
  features: string[]
  tags: string[]
  isNew?: boolean
  inStock: boolean
}

export interface Category {
  id: number
  slug: string
  name: string
  description: string
  image: string
}

export interface CartLine {
  productId: number
  quantity: number
  size: string
  color: string
}

export interface CartLineDetailed extends CartLine {
  product: Product
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface Address {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered'

export interface OrderItem {
  productId: number
  name: string
  image: string
  imageBg: string
  price: number
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  createdAt: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: Address
  paymentMethod: string
}

export interface FaqItem {
  id: number
  question: string
  answer: string
  category: string
}
