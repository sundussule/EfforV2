import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { AppError } from '../utils/AppError'
import { toOrderDto } from '../utils/mappers'

export const ordersRouter = Router()
ordersRouter.use(requireAuth)

const SHIPPING_FLAT_RATE = 8
const FREE_SHIPPING_THRESHOLD = 150
const TAX_RATE = 0.08

function calculateOrderTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + shipping + tax) * 100) / 100
  return { shipping, tax, total }
}

function generateOrderId() {
  return `EFF-${Math.floor(100000 + Math.random() * 899999)}`
}

const addressSchema = z.object({
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(1),
})

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int(),
        quantity: z.number().int().positive(),
        size: z.string().min(1),
        color: z.string().min(1),
      }),
    )
    .min(1),
  shippingAddress: addressSchema,
  paymentMethod: z.string().min(1),
})

const orderInclude = { items: true } as const

ordersRouter.post('/', async (req, res) => {
  const input = createOrderSchema.parse(req.body)
  const userId = req.userId!

  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((item) => item.productId) } },
  })
  const productById = new Map(products.map((p) => [p.id, p]))

  const orderItemsData = input.items.map((item) => {
    const product = productById.get(item.productId)
    if (!product) {
      throw new AppError(400, `Product ${item.productId} not found`)
    }
    const images = JSON.parse(product.imagesJson) as string[]
    return {
      productId: product.id,
      name: product.name,
      image: images[0] ?? '',
      imageBg: product.imageBg,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }
  })

  const subtotal = orderItemsData.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const { shipping, tax, total } = calculateOrderTotals(subtotal)

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        id: generateOrderId(),
        status: 'processing',
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: input.paymentMethod,
        shippingFullName: input.shippingAddress.fullName,
        shippingLine1: input.shippingAddress.line1,
        shippingLine2: input.shippingAddress.line2,
        shippingCity: input.shippingAddress.city,
        shippingState: input.shippingAddress.state,
        shippingPostalCode: input.shippingAddress.postalCode,
        shippingCountry: input.shippingAddress.country,
        shippingPhone: input.shippingAddress.phone,
        userId,
        items: { create: orderItemsData },
      },
      include: orderInclude,
    })
    await tx.cartItem.deleteMany({ where: { userId } })
    return created
  })

  res.status(201).json(toOrderDto(order))
})

ordersRouter.get('/', async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId! },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  })
  res.json(orders.map(toOrderDto))
})

ordersRouter.get('/:id', async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.userId! },
    include: orderInclude,
  })
  if (!order) {
    throw new AppError(404, 'Order not found')
  }
  res.json(toOrderDto(order))
})
