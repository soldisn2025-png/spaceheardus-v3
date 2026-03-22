import { getLiveSiteContent } from '@/lib/liveContent'

const RESEND_API_URL = 'https://api.resend.com/emails'
const DEFAULT_FROM_EMAIL = 'Space Heard Us <onboarding@resend.dev>'

type SendEmailInput = {
  subject: string
  text: string
  to: string
}

export async function getFormSettings() {
  return (await getLiveSiteContent()).settings
}

export async function sendEmail({ subject, text, to }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY ?? ''

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY env var')
  }

  const from = process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      subject,
      text,
      to: [to],
    }),
  })

  if (!response.ok) {
    const bodyText = await response.text()

    throw new Error(bodyText || 'Could not send email.')
  }
}
