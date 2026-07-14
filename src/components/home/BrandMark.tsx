export function BrandMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M15 14h18v4.6H20.2v5.4h11.4v4.6H20.2v5.8H33V39H15V14z" fill="currentColor" />
    </svg>
  )
}
