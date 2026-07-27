import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const contactRouter = Router()

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
})

contactRouter.post('/', async (req, res) => {
  const input = contactSchema.parse(req.body)
  await prisma.contactMessage.create({ data: input })
  res.json({ success: true })
})
