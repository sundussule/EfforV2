import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { toCartItemDto } from '../utils/mappers'

export const cartRouter = Router()
cartRouter.use(requireAuth)

const cartLineSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().positive(),
  size: z.string().min(1),
  color: z.string().min(1),
})

const cartLineKeySchema = z.object({
  productId: z.number().int(),
  size: z.string().min(1),
  color: z.string().min(1),
})

async function getCartDto(userId: number) {
  const items = await prisma.cartItem.findMany({ where: { userId } })
  return items.map(toCartItemDto)
}

cartRouter.get('/', async (req, res) => {
  res.json(await getCartDto(req.userId!))
})

cartRouter.post('/add', async (req, res) => {
  const input = cartLineSchema.parse(req.body)
  const userId = req.userId!

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId_size_color: {
        userId,
        productId: input.productId,
        size: input.size,
        color: input.color,
      },
    },
  })

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + input.quantity },
    })
  } else {
    await prisma.cartItem.create({ data: { ...input, userId } })
  }

  res.json(await getCartDto(userId))
})

cartRouter.put('/update', async (req, res) => {
  const input = cartLineSchema.parse(req.body)
  const userId = req.userId!

  await prisma.cartItem.updateMany({
    where: { userId, productId: input.productId, size: input.size, color: input.color },
    data: { quantity: input.quantity },
  })

  res.json(await getCartDto(userId))
})

cartRouter.delete('/remove', async (req, res) => {
  const input = cartLineKeySchema.parse(req.body)
  const userId = req.userId!

  await prisma.cartItem.deleteMany({
    where: { userId, productId: input.productId, size: input.size, color: input.color },
  })

  res.json(await getCartDto(userId))
})

cartRouter.delete('/clear', async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.userId! } })
  res.status(200).end()
})
