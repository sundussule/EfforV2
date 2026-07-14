import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartLine, CartLineDetailed, Product } from '@/types'
import { getAllProducts } from '@/services/productService'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface CartContextValue {
  lines: CartLineDetailed[]
  rawLineCount: number
  itemCount: number
  subtotal: number
  loading: boolean
  addItem: (product: Product, size: string, color: string, quantity?: number) => void
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void
  removeItem: (productId: number, size: string, color: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function sameLine(a: CartLine, b: Omit<CartLine, 'quantity'>) {
  return a.productId === b.productId && a.size === b.size && a.color === b.color
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartLines, setCartLines] = useLocalStorage<CartLine[]>('effor_cart', [])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cart lines only store productId/size/color/quantity; the full product
    // catalog is loaded once here so cart UI can display name/price/image.
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])

  const lines: CartLineDetailed[] = useMemo(
    () =>
      cartLines
        .map((line) => {
          const product = productMap.get(line.productId)
          return product ? { ...line, product } : null
        })
        .filter((l): l is CartLineDetailed => l !== null),
    [cartLines, productMap],
  )

  const addItem = (product: Product, size: string, color: string, quantity = 1) => {
    setCartLines((prev) => {
      const existing = prev.find((l) => sameLine(l, { productId: product.id, size, color }))
      if (existing) {
        return prev.map((l) =>
          sameLine(l, { productId: product.id, size, color })
            ? { ...l, quantity: l.quantity + quantity }
            : l,
        )
      }
      return [...prev, { productId: product.id, size, color, quantity }]
    })
  }

  const updateQuantity = (productId: number, size: string, color: string, quantity: number) => {
    setCartLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => !sameLine(l, { productId, size, color }))
        : prev.map((l) => (sameLine(l, { productId, size, color }) ? { ...l, quantity } : l)),
    )
  }

  const removeItem = (productId: number, size: string, color: string) => {
    setCartLines((prev) => prev.filter((l) => !sameLine(l, { productId, size, color })))
  }

  const clearCart = () => setCartLines([])

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0)
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        lines,
        rawLineCount: cartLines.length,
        itemCount,
        subtotal,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
