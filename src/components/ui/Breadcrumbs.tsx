import { Link } from 'react-router-dom'

interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-ink-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {item.to ? (
              <Link to={item.to} className="transition-colors hover:text-ink-950">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink-900">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="text-ink-300">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
