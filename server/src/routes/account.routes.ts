import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { AppError } from '../utils/AppError'
import { toAddressDto, toUserDto } from '../utils/mappers'

export const accountRouter = Router()
accountRouter.use(requireAuth)

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
})

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

accountRouter.put('/profile', async (req, res) => {
  const input = updateProfileSchema.parse(req.body)

  if (input.email) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } })
    if (existing && existing.id !== req.userId) {
      throw new AppError(409, 'An account with this email already exists')
    }
  }

  const user = await prisma.user.update({ where: { id: req.userId! }, data: input })
  res.json(toUserDto(user))
})

accountRouter.get('/addresses', async (req, res) => {
  const addresses = await prisma.address.findMany({ where: { userId: req.userId! } })
  res.json(addresses.map(toAddressDto))
})

accountRouter.post('/addresses', async (req, res) => {
  const input = addressSchema.parse(req.body)
  await prisma.address.create({ data: { ...input, userId: req.userId! } })
  const addresses = await prisma.address.findMany({ where: { userId: req.userId! } })
  res.status(201).json(addresses.map(toAddressDto))
})
