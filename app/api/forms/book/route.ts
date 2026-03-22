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
      contactName?: unknown
      email?: unknown
      message?: unknown
      organization?: unknown
      phone?: unknown
      preferredDates?: unknown
      venueType?: unknown
    }
    const contactName = readString(body.contactName)
    const organization = readString(body.organization)
    const email = readString(body.email)
    const phone = readString(body.phone)
    const venueType = readString(body.venueType)
    const preferredDates = readString(body.preferredDates)
    const message = readString(body.message)

    if (!contactName || !organization || !email || !venueType || !message) {
      return NextResponse.json({ error: 'Please fill out all required fields.' }, { status: 400 })
    }

    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const { bookingFormRecipientEmail } = await getFormSettings()

    await sendEmail({
      subject: `Space Heard Us booking request: ${organization}`,
      text: [
        'New Book Us form submission',
        '',
        `Contact name: ${contactName}`,
        `Organization / venue: ${organization}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Venue type: ${venueType}`,
        `Preferred dates: ${preferredDates || 'Not provided'}`,
        '',
        'Event details:',
        message,
      ].join('\n'),
      to: bookingFormRecipientEmail,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not send your booking request.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
