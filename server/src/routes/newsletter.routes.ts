import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const newsletterRouter = Router()

const subscribeSchema = z.object({ email: z.string().email() })

newsletterRouter.post('/subscribe', async (req, res) => {
  const { email } = subscribeSchema.parse(req.body)
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  })
  res.json({ success: true })
})
