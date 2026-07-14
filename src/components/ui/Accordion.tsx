import { useState, type ReactNode } from 'react'

interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-ink-200 py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-medium text-ink-950 sm:text-base">{title}</span>
        <span
          className={`shrink-0 text-xl text-ink-500 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      {open && <div className="animate-fade-in pt-3 text-sm leading-relaxed text-ink-600">{children}</div>}
    </div>
  )
}
