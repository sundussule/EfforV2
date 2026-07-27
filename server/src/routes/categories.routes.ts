import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../utils/AppError'
import { toCategoryDto } from '../utils/mappers'

export const categoriesRouter = Router()

categoriesRouter.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } })
  res.json(categories.map(toCategoryDto))
})

categoriesRouter.get('/:slug', async (req, res) => {
  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } })
  if (!category) {
    throw new AppError(404, 'Category not found')
  }
  res.json(toCategoryDto(category))
})
