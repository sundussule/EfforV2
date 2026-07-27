import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../lib/jwt'
import { AppError } from '../utils/AppError'

declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required')
  }

  const token = header.slice('Bearer '.length)
  try {
    const payload = verifyToken(token)
    req.userId = payload.userId
    next()
  } catch {
    throw new AppError(401, 'Invalid or expired token')
  }
}
