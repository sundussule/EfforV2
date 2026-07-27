import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { accountRouter } from './account.routes'
import { authRouter } from './auth.routes'
import { cartRouter } from './cart.routes'
import { categoriesRouter } from './categories.routes'
import { contactRouter } from './contact.routes'
import { newsletterRouter } from './newsletter.routes'
import { ordersRouter } from './orders.routes'
import { productsRouter } from './products.routes'
import { wishlistRouter } from './wishlist.routes'

export const apiRouter = Router()

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }))

apiRouter.use('/auth', authRateLimit, authRouter)
apiRouter.use('/products', productsRouter)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/cart', cartRouter)
apiRouter.use('/wishlist', wishlistRouter)
apiRouter.use('/orders', ordersRouter)
apiRouter.use('/account', accountRouter)
apiRouter.use('/contact', contactRouter)
apiRouter.use('/newsletter', newsletterRouter)
