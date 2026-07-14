interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantityStepper({ value, onChange, min = 1, max = 10 }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink-200">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-lg text-ink-700 transition-colors hover:text-ink-950 disabled:opacity-30"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        &minus;
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-lg text-ink-700 transition-colors hover:text-ink-950 disabled:opacity-30"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  )
}
