import { useEffect, useState } from 'react'
import type { FaqItem } from '@/types'
import faqsData from '@/data/faqs.json'
import { AccordionItem } from '@/components/ui/Accordion'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

// TODO: Replace with GET /api/faqs if FAQ content should be manageable from the backend.
// For now this is treated as static content and imported directly.
const FAQS = faqsData as FaqItem[]

export function FaqPage() {
  const [grouped, setGrouped] = useState<Record<string, FaqItem[]>>({})

  useEffect(() => {
    const groups: Record<string, FaqItem[]> = {}
    for (const faq of FAQS) {
      groups[faq.category] = groups[faq.category] ?? []
      groups[faq.category].push(faq)
    }
    setGrouped(groups)
  }, [])

  return (
    <div className="container-page max-w-3xl py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
      <h1 className="mb-2 mt-3 text-3xl font-semibold tracking-tight text-ink-950">Frequently Asked Questions</h1>
      <p className="mb-10 text-sm text-ink-500">Answers to the most common questions about orders, shipping and returns.</p>

      <div className="flex flex-col gap-10">
        {Object.entries(grouped).map(([category, faqs]) => (
          <div key={category}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent-600">{category}</h2>
            <div>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} title={faq.question}>
                  {faq.answer}
                </AccordionItem>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
