import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

import categoriesData from '../../src/data/categories.json'
import productsData from '../../src/data/products.json'
import usersData from '../../src/data/users.json'
import ordersData from '../../src/data/orders.json'

interface SeedCategory {
  id: number
  slug: string
  name: string
  description: string
  image: string
}

interface SeedProduct {
  id: number
  slug: string
  name: string
  brand: string
  categorySlug: string
  price: number
  compareAtPrice?: number
  currency: string
  images: string[]
  imageBg: string
  colors: { name: string; hex: string }[]
  sizes: string[]
  rating: number
  reviewCount: number
  description: string
  features: string[]
  tags: string[]
  isNew?: boolean
  inStock: boolean
}

interface SeedUser {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
}

interface SeedOrderItem {
  productId: number
  name: string
  image: string
  imageBg: string
  price: number
  quantity: number
  size: string
  color: string
}

interface SeedOrder {
  id: string
  createdAt: string
  status: string
  items: SeedOrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    fullName: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  paymentMethod: string
}

async function main() {
  console.log('Clearing existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.address.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.newsletterSubscriber.deleteMany()

  console.log('Seeding categories...')
  const categorySlugToId = new Map<string, number>()
  for (const category of categoriesData as SeedCategory[]) {
    const created = await prisma.category.create({
      data: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        image: category.image,
      },
    })
    categorySlugToId.set(category.slug, created.id)
  }

  console.log('Seeding products...')
  const productIdMap = new Map<number, number>()
  for (const product of productsData as SeedProduct[]) {
    const categoryId = categorySlugToId.get(product.categorySlug)
    if (!categoryId) {
      throw new Error(`Unknown categorySlug "${product.categorySlug}" for product "${product.slug}"`)
    }
    const created = await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        currency: product.currency,
        imagesJson: JSON.stringify(product.images),
        imageBg: product.imageBg,
        colorsJson: JSON.stringify(product.colors),
        sizesJson: JSON.stringify(product.sizes),
        rating: product.rating,
        reviewCount: product.reviewCount,
        description: product.description,
        featuresJson: JSON.stringify(product.features),
        tagsJson: JSON.stringify(product.tags),
        isNew: product.isNew ?? false,
        inStock: product.inStock,
        categoryId,
      },
    })
    productIdMap.set(product.id, created.id)
  }

  console.log('Seeding users...')
  const userIdMap = new Map<number, number>()
  for (const user of usersData as SeedUser[]) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const created = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash,
      },
    })
    userIdMap.set(user.id, created.id)
  }

  console.log('Seeding orders...')
  const demoUserId = userIdMap.get(1)
  if (!demoUserId) {
    throw new Error('Demo user (id 1) not found after seeding users')
  }
  for (const order of ordersData as SeedOrder[]) {
    await prisma.order.create({
      data: {
        id: order.id,
        createdAt: new Date(order.createdAt),
        status: order.status,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        paymentMethod: order.paymentMethod,
        shippingFullName: order.shippingAddress.fullName,
        shippingLine1: order.shippingAddress.line1,
        shippingLine2: order.shippingAddress.line2,
        shippingCity: order.shippingAddress.city,
        shippingState: order.shippingAddress.state,
        shippingPostalCode: order.shippingAddress.postalCode,
        shippingCountry: order.shippingAddress.country,
        shippingPhone: order.shippingAddress.phone,
        userId: demoUserId,
        items: {
          create: order.items.map((item) => {
            const productId = productIdMap.get(item.productId)
            if (!productId) {
              throw new Error(`Unknown productId ${item.productId} in order ${order.id}`)
            }
            return {
              name: item.name,
              image: item.image,
              imageBg: item.imageBg,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              productId,
            }
          }),
        },
      },
    })
  }

  console.log('Seeding also creates a saved address for the demo user...')
  const firstOrder = (ordersData as SeedOrder[])[0]
  if (firstOrder) {
    await prisma.address.create({
      data: {
        fullName: firstOrder.shippingAddress.fullName,
        line1: firstOrder.shippingAddress.line1,
        line2: firstOrder.shippingAddress.line2,
        city: firstOrder.shippingAddress.city,
        state: firstOrder.shippingAddress.state,
        postalCode: firstOrder.shippingAddress.postalCode,
        country: firstOrder.shippingAddress.country,
        phone: firstOrder.shippingAddress.phone,
        userId: demoUserId,
      },
    })
  }

  console.log(
    `Done: ${categorySlugToId.size} categories, ${productIdMap.size} products, ${userIdMap.size} users, ${(ordersData as SeedOrder[]).length} orders.`,
  )
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
