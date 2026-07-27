import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../lib/prisma'

export const wishlistRouter = Router()
wishlistRouter.use(requireAuth)

const productIdSchema = z.object({ productId: z.number().int() })

async function getWishlistIds(userId: number) {
  const items = await prisma.wishlistItem.findMany({ where: { userId }, select: { productId: true } })
  return items.map((item) => item.productId)
}

wishlistRouter.get('/', async (req, res) => {
  res.json(await getWishlistIds(req.userId!))
})

wishlistRouter.post('/add', async (req, res) => {
  const { productId } = productIdSchema.parse(req.body)
  const userId = req.userId!

  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
  })

  res.json(await getWishlistIds(userId))
})

wishlistRouter.delete('/remove', async (req, res) => {
  const { productId } = productIdSchema.parse(req.body)
  const userId = req.userId!

  await prisma.wishlistItem.deleteMany({ where: { userId, productId } })

  res.json(await getWishlistIds(userId))
})
