import type { ReactNode } from 'react'
import { formatCurrency } from '@/lib/format'
import { calculateOrderTotals } from '@/services/orderService'

interface CartSummaryProps {
  subtotal: number
  children?: ReactNode
}

export function CartSummary({ subtotal, children }: CartSummaryProps) {
  const { shipping, tax, total } = calculateOrderTotals(subtotal)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-200 p-6">
      <h2 className="text-sm font-semibold text-ink-950">Order Summary</h2>

      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between text-ink-600">
          <span>Subtotal</span>
          <span className="text-ink-950">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-600">
          <span>Shipping</span>
          <span className="text-ink-950">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between text-ink-600">
          <span>Estimated Tax</span>
          <span className="text-ink-950">{formatCurrency(tax)}</span>
        </div>
        {subtotal > 0 && subtotal < 150 && (
          <p className="text-xs text-accent-600">
            Add {formatCurrency(150 - subtotal)} more for free shipping.
          </p>
        )}
      </div>

      <div className="flex justify-between border-t border-ink-200 pt-4 text-base font-semibold text-ink-950">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      {children}
    </div>
  )
}
