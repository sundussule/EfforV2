//C:\Users\PC\OneDrive\Desktop\Effor\src\components\cart\CartItemRow.tsx//

import { Link } from 'react-router-dom'
import type { CartLineDetailed } from '@/types'
import { formatCurrency } from '@/lib/format'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { useCart } from '@/context/CartContext'

export function CartItemRow({ line }: { line: CartLineDetailed }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-4 border-b border-ink-200 py-6 first:pt-0 last:border-0">
      <Link
        to={`/products/${line.product.slug}`}
        className="shrink-0 overflow-hidden rounded-xl border border-ink-100"
        style={{ backgroundColor: line.product.imageBg }}
      >
        <ImageWithFallback src={line.product.images[0]} alt={line.product.name} className="h-28 w-24 object-contain sm:h-32 sm:w-28" />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/products/${line.product.slug}`} className="text-sm font-medium text-ink-950 hover:underline">
              {line.product.name}
            </Link>
            <p className="mt-1 text-xs text-ink-500">
              Size {line.size} &middot; {line.color}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-ink-950">
            {formatCurrency(line.product.price * line.quantity)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            value={line.quantity}
            onChange={(q) => updateQuantity(line.productId, line.size, line.color, q)}
          />
          <button
            type="button"
            onClick={() => removeItem(line.productId, line.size, line.color)}
            className="text-xs font-medium text-ink-500 underline-offset-2 hover:text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
