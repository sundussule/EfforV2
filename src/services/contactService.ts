import { mockDelay } from './mockDelay'

export interface ContactFormInput {
  name: string
  email: string
  subject: string
  message: string
}

// TODO: Replace with POST /api/contact (see API.contact.sendMessage)
// Request Payload: { name, email, subject, message }
// Expected Response: { success: boolean }
export async function sendContactMessage(_input: ContactFormInput): Promise<{ success: boolean }> {
  return mockDelay({ success: true }, 500)
}

// TODO: Replace with POST /api/newsletter/subscribe (see API.newsletter.subscribe)
// Request Payload: { email: string }
// Expected Response: { success: boolean }
export async function subscribeToNewsletter(_email: string): Promise<{ success: boolean }> {
  return mockDelay({ success: true }, 400)
}
