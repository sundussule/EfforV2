interface RatingProps {
  value: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export function Rating({ value, reviewCount, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(value)
          return (
            <svg
              key={i}
              viewBox="0 0 20 20"
              className={`${starSize} ${filled ? 'fill-ink-950' : 'fill-ink-200'}`}
              aria-hidden="true"
            >
              <path d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L10 14.7l-5.3 2.9 1.1-5.9L1.5 7.6l5.9-.7z" />
            </svg>
          )
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-ink-500">({reviewCount})</span>
      )}
    </div>
  )
}
