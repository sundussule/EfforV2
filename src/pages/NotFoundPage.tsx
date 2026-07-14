import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 py-20 text-center">
      <span className="text-sm font-semibold uppercase tracking-widest text-accent-600">404</span>
      <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Button as="link" to="/" size="lg" className="mt-4">
        Back to Home
      </Button>
    </div>
  )
}
