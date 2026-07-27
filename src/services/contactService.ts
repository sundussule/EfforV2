import { API } from '@/config/api.config'
import { apiFetch } from '@/lib/apiClient'

export interface ContactFormInput {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactMessage(input: ContactFormInput): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(API.contact.sendMessage.endpoint, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(API.newsletter.subscribe.endpoint, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}
