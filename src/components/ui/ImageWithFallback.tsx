import { useEffect, useState, type ImgHTMLAttributes } from 'react'

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string
}

/**
 * Drop-in replacement for <img> used everywhere product/category/hero photos
 * render. Until real photography is added under public/images/, these paths
 * 404 — this shows a neutral placeholder instead of a broken-image icon so
 * the storefront still looks intentional.
 */
export function ImageWithFallback({ src, alt = '', className = '', ...rest }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [src])

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-ink-100 text-ink-300 ${className}`} role="img" aria-label={alt}>
        <svg viewBox="0 0 24 24" className="h-1/4 w-1/4 min-h-6 min-w-6" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.75" />
          <path d="M21 16l-5.5-5.5a1.5 1.5 0 0 0-2.1 0L4 19" />
        </svg>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />
}
