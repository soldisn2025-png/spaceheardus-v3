'use client'

import { FormEvent, useState } from 'react'

const venueTypes = [
  'Church / House of worship',
  'Hospital / Healthcare facility',
  'Daycare / Preschool',
  'School or educational program',
  'Community event or festival',
  'Senior living or assisted care',
  'Other',
]

type Status = {
  message: string
  type: 'error' | 'success'
} | null

export function BookingRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      contactName: String(formData.get('contact_name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
      organization: String(formData.get('organization') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      preferredDates: String(formData.get('preferred_dates') ?? ''),
      venueType: String(formData.get('venue_type') ?? ''),
    }

    try {
      const response = await fetch('/api/forms/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json() as { error?: string; success?: boolean }

      if (!response.ok || !data.success) {
        setStatus({
          message: data.error ?? 'We could not send your booking request right now.',
          type: 'error',
        })
        return
      }

      form.reset()
      setStatus({
        message: 'Your booking request was sent. We will follow up within a few days.',
        type: 'success',
      })
    } catch {
      setStatus({
        message: 'We could not send your booking request right now.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="grid grid-cols-1 gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-stone-700 font-inter text-sm font-semibold mb-1.5">
            Your Name <span className="text-amber-600">*</span>
          </label>
          <input
            type="text"
            name="contact_name"
            required
            placeholder="Jane Smith"
            className="w-full rounded-xl bg-[#fffdf6] border border-amber-200 px-4 py-3 outline-none focus:border-amber-500 font-inter text-sm"
          />
        </div>
        <div>
          <label className="block text-stone-700 font-inter text-sm font-semibold mb-1.5">
            Organization / Venue <span className="text-amber-600">*</span>
          </label>
          <input
            type="text"
            name="organization"
            required
            placeholder="Fairfax Community Church"
            className="w-full rounded-xl bg-[#fffdf6] border border-amber-200 px-4 py-3 outline-none focus:border-amber-500 font-inter text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-stone-700 font-inter text-sm font-semibold mb-1.5">
            Email <span className="text-amber-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="jane@example.org"
            className="w-full rounded-xl bg-[#fffdf6] border border-amber-200 px-4 py-3 outline-none focus:border-amber-500 font-inter text-sm"
          />
        </div>
        <div>
          <label className="block text-stone-700 font-inter text-sm font-semibold mb-1.5">
            Phone (optional)
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="(703) 555-0000"
            className="w-full rounded-xl bg-[#fffdf6] border border-amber-200 px-4 py-3 outline-none focus:border-amber-500 font-inter text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-stone-700 font-inter text-sm font-semibold mb-1.5">
          Venue Type <span className="text-amber-600">*</span>
        </label>
        <select
          name="venue_type"
          required
          className="w-full rounded-xl bg-[#fffdf6] border border-amber-200 px-4 py-3 outline-none focus:border-amber-500 font-inter text-sm text-stone-700"
        >
          <option value="">Select a venue type...</option>
          {venueTypes.map((venueType) => (
            <option key={venueType} value={venueType}>
              {venueType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-stone-700 font-inter text-sm font-semibold mb-1.5">
          Preferred Date(s)
        </label>
        <input
          type="text"
          name="preferred_dates"
          placeholder="e.g. any Saturday in May, or April 12"
          className="w-full rounded-xl bg-[#fffdf6] border border-amber-200 px-4 py-3 outline-none focus:border-amber-500 font-inter text-sm"
        />
      </div>

      <div>
        <label className="block text-stone-700 font-inter text-sm font-semibold mb-1.5">
          Tell us about your event <span className="text-amber-600">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Describe the event, expected audience size, any special considerations..."
          className="w-full rounded-xl bg-[#fffdf6] border border-amber-200 px-4 py-3 outline-none focus:border-amber-500 font-inter text-sm"
        />
      </div>

      {status ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border border-green-200 bg-green-50 text-green-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex justify-center px-8 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Sending...' : 'Send Booking Request'}
      </button>
    </form>
  )
}
