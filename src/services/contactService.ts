export interface ContactFormInput {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactMessage(_input: ContactFormInput): Promise<{ success: boolean }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true }
}

export async function subscribeToNewsletter(_email: string): Promise<{ success: boolean }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true }
}