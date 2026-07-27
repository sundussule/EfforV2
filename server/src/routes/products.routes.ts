import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../utils/AppError'
import { toProductDto } from '../utils/mappers'

export const productsRouter = Router()

const productInclude = { category: true } as const

const listQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(['price-asc', 'price-desc', 'newest', 'rating']).optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
})

function buildWhere(query: z.infer<typeof listQuerySchema>) {
  const where: Record<string, unknown> = {}
  if (query.category) {
    where.category = { slug: query.category }
  }
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
    }
  }
  if (query.q) {
    where.OR = [
      { name: { contains: query.q } },
      { brand: { contains: query.q } },
      { tagsJson: { contains: query.q } },
    ]
  }
  return where
}

function buildOrderBy(sort: z.infer<typeof listQuerySchema>['sort']) {
  switch (sort) {
    case 'price-asc':
      return { price: 'asc' as const }
    case 'price-desc':
      return { price: 'desc' as const }
    case 'rating':
      return { rating: 'desc' as const }
    case 'newest':
      return { isNew: 'desc' as const }
    default:
      return { id: 'asc' as const }
  }
}

productsRouter.get('/', async (req, res) => {
  const query = listQuerySchema.parse(req.query)
  const where = buildWhere(query)
  const orderBy = buildOrderBy(query.sort)

  const page = query.page ?? 1
  const pageSize = query.pageSize
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: productInclude,
    ...(pageSize ? { skip: (page - 1) * pageSize, take: pageSize } : {}),
  })

  res.json(products.map(toProductDto))
})

productsRouter.get('/search', async (req, res) => {
  const query = listQuerySchema.parse(req.query)
  const where = buildWhere(query)
  const products = await prisma.product.findMany({ where, include: productInclude })
  res.json(products.map(toProductDto))
})

productsRouter.get('/:slug/related', async (req, res) => {
  const current = await prisma.product.findUnique({ where: { slug: req.params.slug } })
  if (!current) {
    res.json([])
    return
  }
  const related = await prisma.product.findMany({
    where: { categoryId: current.categoryId, slug: { not: req.params.slug } },
    include: productInclude,
    take: 4,
  })
  res.json(related.map(toProductDto))
})

productsRouter.get('/:slug', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: productInclude,
  })
  if (!product) {
    throw new AppError(404, 'Product not found')
  }
  res.json(toProductDto(product))
})
