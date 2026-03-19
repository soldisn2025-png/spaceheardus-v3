import { NextRequest, NextResponse } from 'next/server'
import { getFormSettings, sendEmail } from '@/lib/formEmail'

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      email?: unknown
      message?: unknown
      name?: unknown
    }
    const name = readString(body.name)
    const email = readString(body.email)
    const message = readString(body.message)

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please fill out all required fields.' }, { status: 400 })
    }

    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const { landingFormRecipientEmail } = getFormSettings()

    await sendEmail({
      subject: `Space Heard Us contact form: ${name}`,
      text: [
        'New homepage contact form submission',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      to: landingFormRecipientEmail,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not send your message.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
