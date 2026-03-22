'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field, SelectField, ToggleField } from '@/components/admin/AdminFormFields'
import { AdminPanelNav } from '@/components/admin/AdminPanelNav'
import { type EventItem, type EventsContent } from '@/lib/eventsContent'

type ContentResponse = {
  error?: string
  fileContent?: {
    content: EventsContent
    file: 'events'
    sha: string
  }
}

function createItemId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export default function AdminSchedulePage() {
  const router = useRouter()
  const [content, setContent] = useState<EventsContent | null>(null)
  const [baseContent, setBaseContent] = useState<EventsContent | null>(null)
  const [fileSha, setFileSha] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadContent = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/content?file=events', { cache: 'no-store' })

      if (response.status === 401) {
        router.replace('/admin-panel')
        return
      }

      const data = await response.json() as ContentResponse

      if (!response.ok || !data.fileContent) {
        setError(data.error ?? 'Could not load the schedule settings.')
        return
      }

      setContent(data.fileContent.content)
      setBaseContent(data.fileContent.content)
      setFileSha(data.fileContent.sha)
    } catch {
      setError('Could not load the schedule settings.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void loadContent()
  }, [loadContent])

  function updatePageField(field: keyof EventsContent['page'], value: string) {
    if (!content) {
      return
    }

    setContent({
      ...content,
      page: {
        ...content.page,
        [field]: value,
      },
    })
  }

  function updateEvent(index: number, field: keyof EventItem, value: string | boolean) {
    if (!content) {
      return
    }

    setContent({
      ...content,
      events: content.events.map((event, eventIndex) =>
        eventIndex === index
          ? {
              ...event,
              [field]: value,
            }
          : event,
      ),
    })
  }

  function addEvent() {
    if (!content) {
      return
    }

    setContent({
      ...content,
      events: [
        ...content.events,
        {
          id: createItemId('event'),
          title: 'New event',
          date: '',
          time: '',
          location: '',
          locationDetail: '',
          description: '',
          type: 'performance',
          rsvpLink: '/',
          rsvpLabel: 'Get Updates',
          isComingSoon: false,
        },
      ],
    })
  }

  function removeEvent(index: number) {
    if (!content) {
      return
    }

    setContent({
      ...content,
      events: content.events.filter((_, eventIndex) => eventIndex !== index),
    })
  }

  async function handleSave() {
    if (!content || !baseContent || !fileSha) {
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseContent,
          content,
          file: 'events',
          sha: fileSha,
        }),
      })
      const data = await response.json() as { error?: string }

      if (!response.ok) {
        setError(data.error ?? 'Could not save the schedule settings.')
        return
      }

      setSuccess(
        'merged' in data && data.merged
          ? 'Saved to GitHub. Another change was merged automatically, so your schedule edits still went through.'
          : 'Saved to GitHub. The live site should update on refresh in a few seconds.',
      )
      await loadContent()
    } catch {
      setError('Could not save the schedule settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-[#fffdf6] px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-amber-200 bg-white p-10 text-center text-sm text-stone-500 shadow-[0_24px_80px_rgba(120,53,15,0.08)]">
          Loading schedule settings...
        </div>
      </section>
    )
  }

  if (!content) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-[#fffdf6] px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-red-200 bg-white p-10 text-center text-sm text-red-700 shadow-[0_24px_80px_rgba(120,53,15,0.08)]">
          {error || 'Could not load the schedule settings.'}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#fffdf6] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-amber-200 bg-white px-6 py-6 shadow-[0_24px_80px_rgba(120,53,15,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Admin Menu</p>
          <h1 className="mt-2 font-playfair text-4xl font-bold text-stone-900">Schedule Controls</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600">
            Update rehearsal details, schedule page text, and the full list of upcoming events without touching code.
          </p>
          <AdminPanelNav current="schedule" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <h2 className="text-lg font-semibold text-stone-900">Schedule Page Text</h2>
              <p className="mt-1 text-sm text-stone-500">
                Edit the main headings and rehearsal details shown on the schedule page.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Badge" value={content.page.badge} onChange={(value) => updatePageField('badge', value)} />
                <Field label="Page title" value={content.page.title} onChange={(value) => updatePageField('title', value)} />
                <div className="md:col-span-2">
                  <Field label="Intro text" value={content.page.intro} onChange={(value) => updatePageField('intro', value)} multiline />
                </div>
                <Field label="Rehearsal label" value={content.page.rehearsalLabel} onChange={(value) => updatePageField('rehearsalLabel', value)} />
                <Field label="Rehearsal title" value={content.page.rehearsalTitle} onChange={(value) => updatePageField('rehearsalTitle', value)} />
                <Field label="Rehearsal time" value={content.page.rehearsalTime} onChange={(value) => updatePageField('rehearsalTime', value)} />
                <Field label="Performances heading" value={content.page.performancesTitle} onChange={(value) => updatePageField('performancesTitle', value)} />
                <div className="md:col-span-2">
                  <Field label="Performances intro" value={content.page.performancesIntro} onChange={(value) => updatePageField('performancesIntro', value)} multiline />
                </div>
                <Field label="Volunteer heading" value={content.page.volunteerTitle} onChange={(value) => updatePageField('volunteerTitle', value)} />
                <div className="md:col-span-2">
                  <Field label="Volunteer text" value={content.page.volunteerText} onChange={(value) => updatePageField('volunteerText', value)} multiline />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">Upcoming Events</h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Add, remove, and edit the events shown on the schedule page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addEvent}
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Add Event
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {content.events.map((event, index) => (
                  <div key={event.id} className="rounded-[1.5rem] border border-amber-100 bg-[#fffaf0] p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-stone-900">Event {index + 1}</p>
                        <p className="text-xs text-stone-500">Shown on the schedule page in this order.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvent(index)}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Internal ID" value={event.id} onChange={(value) => updateEvent(index, 'id', value)} />
                      <Field label="Title" value={event.title} onChange={(value) => updateEvent(index, 'title', value)} />
                      <Field label="Date" value={event.date} onChange={(value) => updateEvent(index, 'date', value)} />
                      <Field label="Time" value={event.time} onChange={(value) => updateEvent(index, 'time', value)} />
                      <Field label="Location" value={event.location} onChange={(value) => updateEvent(index, 'location', value)} />
                      <Field label="Location detail" value={event.locationDetail ?? ''} onChange={(value) => updateEvent(index, 'locationDetail', value)} />
                      <SelectField
                        label="Type"
                        value={event.type}
                        onChange={(value) => updateEvent(index, 'type', value)}
                        options={[
                          { label: 'Performance', value: 'performance' },
                          { label: 'Rehearsal', value: 'rehearsal' },
                          { label: 'Community', value: 'community' },
                          { label: 'Other', value: 'other' },
                        ]}
                      />
                      <Field label="RSVP Link" type="url" value={event.rsvpLink ?? ''} onChange={(value) => updateEvent(index, 'rsvpLink', value)} />
                      <Field label="RSVP Label" value={event.rsvpLabel ?? ''} onChange={(value) => updateEvent(index, 'rsvpLabel', value)} />
                      <div className="md:col-span-2">
                        <Field label="Description" value={event.description} onChange={(value) => updateEvent(index, 'description', value)} multiline />
                      </div>
                      <div className="md:col-span-2">
                        <ToggleField label="Mark as coming soon" checked={Boolean(event.isComingSoon)} onChange={(value) => updateEvent(index, 'isComingSoon', value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-[#fff7dd] via-white to-[#fff1cf] p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <h2 className="text-lg font-semibold text-stone-900">Publish Schedule</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Saving writes the new schedule page text and events to GitHub. The public schedule reads this content live, so updates should show up on refresh without a redeploy.
              </p>

              {error ? (
                <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="mt-5 w-full rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
