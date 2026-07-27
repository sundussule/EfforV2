import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { signToken } from '../lib/jwt'
import { AppError } from '../utils/AppError'
import { toUserDto } from '../utils/mappers'

export const authRouter = Router()

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

authRouter.post('/register', async (req, res) => {
  const input = registerSchema.parse(req.body)

  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) {
    throw new AppError(409, 'An account with this email already exists')
  }

  const passwordHash = await bcrypt.hash(input.password, 10)
  const user = await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash,
    },
  })

  const token = signToken({ userId: user.id })
  res.status(201).json({ token, user: toUserDto(user) })
})

authRouter.post('/login', async (req, res) => {
  const input = loginSchema.parse(req.body)

  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) {
    throw new AppError(401, 'Invalid email or password')
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) {
    throw new AppError(401, 'Invalid email or password')
  }

  const token = signToken({ userId: user.id })
  res.json({ token, user: toUserDto(user) })
})

authRouter.post('/logout', (_req, res) => {
  res.status(200).json({ success: true })
})

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } })
  if (!user) {
    throw new AppError(404, 'User not found')
  }
  res.json(toUserDto(user))
})
