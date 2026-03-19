'use client'

import { FormEvent, useState } from 'react'

type Status = {
  message: string
  type: 'error' | 'success'
} | null

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
      name: String(formData.get('name') ?? ''),
    }

    try {
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json() as { error?: string; success?: boolean }

      if (!response.ok || !data.success) {
        setStatus({
          message: data.error ?? 'We could not send your message right now.',
          type: 'error',
        })
        return
      }

      form.reset()
      setStatus({
        message: 'Your message was sent. We will get back to you soon.',
        type: 'success',
      })
    } catch {
      setStatus({
        message: 'We could not send your message right now.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="grid grid-cols-1 gap-4">
      <input
        type="text"
        name="name"
        required
        placeholder="Your name"
        className="w-full rounded-xl bg-white border border-amber-200 px-4 py-3 outline-none focus:border-amber-500"
      />
      <input
        type="email"
        name="email"
        required
        placeholder="Your email"
        className="w-full rounded-xl bg-white border border-amber-200 px-4 py-3 outline-none focus:border-amber-500"
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder="Your message"
        className="w-full rounded-xl bg-white border border-amber-200 px-4 py-3 outline-none focus:border-amber-500"
      />

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
        className="mt-2 inline-flex justify-center px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
