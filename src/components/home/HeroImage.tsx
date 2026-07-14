import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export function HeroImage({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-hero-float">
        <ImageWithFallback
          src="/images/hero/main.jpg"
          alt="Effor new season collection"
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl"
        />
      </div>
      <div className="animate-hero-shadow mx-auto mt-4 h-6 w-2/3 rounded-full bg-black/50 blur-xl" aria-hidden="true" />
    </div>
  )
}
