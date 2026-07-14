import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'

export function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />
      <h1 className="mb-6 mt-3 text-3xl font-semibold tracking-tight text-ink-950">About Effor</h1>

      <div className="flex flex-col gap-5 text-sm leading-relaxed text-ink-600">
        <p>
          Effor was founded on a simple idea: getting dressed shouldn't force a trade-off between how
          something feels and how it looks. We design dresses, tops, bottoms, outerwear and accessories for
          women who move through a full day — not just one occasion.
        </p>
        <p>
          Every piece in our catalog goes through the same lens: considered fabrics, a clean silhouette, and
          quality that holds up to everyday wear. We keep our supply chain small and our quality bar high.
        </p>
        <p>
          This storefront is a frontend demo built to showcase a complete shopping experience — browsing,
          filtering, cart, checkout and account management — backed entirely by mock data. It's structured to
          plug into a real ASP.NET Core Web API with minimal changes when the backend is ready.
        </p>
      </div>

      <div className="mt-10">
        <Button as="link" to="/shop" size="lg">
          Shop the Collection
        </Button>
      </div>
    </div>
  )
}
