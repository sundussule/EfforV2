function toNum(value: unknown): number {
  return Number(value)
}

interface CategoryRow {
  id: number
  slug: string
  name: string
  description: string
  image: string
}

export function toCategoryDto(category: CategoryRow) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    image: category.image,
  }
}

interface ProductRow {
  id: number
  slug: string
  name: string
  brand: string
  price: unknown
  compareAtPrice: unknown
  currency: string
  imagesJson: string
  imageBg: string
  colorsJson: string
  sizesJson: string
  rating: number
  reviewCount: number
  description: string
  featuresJson: string
  tagsJson: string
  isNew: boolean
  inStock: boolean
  category: { slug: string }
}

export function toProductDto(product: ProductRow) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    categorySlug: product.category.slug,
    price: toNum(product.price),
    compareAtPrice: product.compareAtPrice ? toNum(product.compareAtPrice) : undefined,
    currency: product.currency,
    images: JSON.parse(product.imagesJson) as string[],
    imageBg: product.imageBg,
    colors: JSON.parse(product.colorsJson) as { name: string; hex: string }[],
    sizes: JSON.parse(product.sizesJson) as string[],
    rating: product.rating,
    reviewCount: product.reviewCount,
    description: product.description,
    features: JSON.parse(product.featuresJson) as string[],
    tags: JSON.parse(product.tagsJson) as string[],
    isNew: product.isNew,
    inStock: product.inStock,
  }
}

interface UserRow {
  id: number
  firstName: string
  lastName: string
  email: string
}

export function toUserDto(user: UserRow) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  }
}

interface AddressRow {
  fullName: string
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export function toAddressDto(address: AddressRow) {
  return {
    fullName: address.fullName,
    line1: address.line1,
    line2: address.line2 ?? undefined,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone,
  }
}

interface OrderItemRow {
  productId: number
  name: string
  image: string
  imageBg: string
  price: unknown
  quantity: number
  size: string
  color: string
}

interface OrderRow {
  id: string
  createdAt: Date
  status: string
  subtotal: unknown
  shipping: unknown
  tax: unknown
  total: unknown
  paymentMethod: string
  shippingFullName: string
  shippingLine1: string
  shippingLine2: string | null
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  shippingPhone: string
  items: OrderItemRow[]
}

export function toOrderDto(order: OrderRow) {
  return {
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      imageBg: item.imageBg,
      price: toNum(item.price),
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    })),
    subtotal: toNum(order.subtotal),
    shipping: toNum(order.shipping),
    tax: toNum(order.tax),
    total: toNum(order.total),
    shippingAddress: {
      fullName: order.shippingFullName,
      line1: order.shippingLine1,
      line2: order.shippingLine2 ?? undefined,
      city: order.shippingCity,
      state: order.shippingState,
      postalCode: order.shippingPostalCode,
      country: order.shippingCountry,
      phone: order.shippingPhone,
    },
    paymentMethod: order.paymentMethod,
  }
}

interface CartItemRow {
  productId: number
  quantity: number
  size: string
  color: string
}

export function toCartItemDto(item: CartItemRow) {
  return {
    productId: item.productId,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
  }
}
