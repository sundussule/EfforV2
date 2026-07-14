import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product } from '@/types'
import { getProductsByIds } from '@/services/productService'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface WishlistContextValue {
  productIds: number[]
  products: Product[]
  loading: boolean
  isWishlisted: (productId: number) => boolean
  toggleWishlist: (productId: number) => void
  removeFromWishlist: (productId: number) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useLocalStorage<number[]>('effor_wishlist', [])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    getProductsByIds(productIds)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [productIds])

  const idSet = useMemo(() => new Set(productIds), [productIds])

  const isWishlisted = (productId: number) => idSet.has(productId)

  const toggleWishlist = (productId: number) => {
    setProductIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const removeFromWishlist = (productId: number) => {
    setProductIds((prev) => prev.filter((id) => id !== productId))
  }

  return (
    <WishlistContext.Provider
      value={{ productIds, products, loading, isWishlisted, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
