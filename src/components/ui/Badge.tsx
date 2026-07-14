import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  tone?: 'default' | 'accent' | 'success' | 'muted'
}

const TONES = {
  default: 'bg-ink-950 text-white',
  accent: 'bg-accent-600 text-white',
  success: 'bg-emerald-600 text-white',
  muted: 'bg-ink-100 text-ink-700',
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${TONES[tone]}`}>
      {children}
    </span>
  )
}
