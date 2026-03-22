'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field } from '@/components/admin/AdminFormFields'
import { AdminPanelNav } from '@/components/admin/AdminPanelNav'
import { DEFAULT_HERO_IMAGE, type SiteContent } from '@/lib/siteContent'

type ContentResponse = {
  error?: string
  siteContent?: {
    content: SiteContent
    sha: string
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Could not read the selected file.'))
    }

    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.readAsDataURL(file)
  })
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [fileSha, setFileSha] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [localImagePreview, setLocalImagePreview] = useState('')

  const loadContent = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/content', { cache: 'no-store' })

      if (response.status === 401) {
        router.replace('/admin-panel')
        return
      }

      const data = await response.json() as ContentResponse

      if (!response.ok || !data.siteContent) {
        setError(data.error ?? 'Could not load the homepage settings.')
        return
      }

      setContent(data.siteContent.content)
      setFileSha(data.siteContent.sha)
    } catch {
      setError('Could not load the homepage settings.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void loadContent()
  }, [loadContent])

  async function handleImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file || !content) {
      return
    }

    setError('')
    setSuccess('')
    setUploadingImage(true)

    try {
      const dataUrl = await readFileAsDataUrl(file)
      const base64 = dataUrl.split(',')[1] ?? ''
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64,
          fileName: file.name,
        }),
      })
      const data = await response.json() as { error?: string; path?: string }

      if (!response.ok || !data.path) {
        setError(data.error ?? 'Image upload failed.')
        return
      }

      setLocalImagePreview(dataUrl)
      setContent({
        ...content,
        home: {
          ...content.home,
          heroImage: data.path,
        },
      })
      setSuccess('Image uploaded. Click Save & Publish to update the live homepage.')
    } catch {
      setError('Image upload failed.')
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  async function handleSave() {
    if (!content || !fileSha) {
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
          content,
          file: 'site-content',
          sha: fileSha,
        }),
      })
      const data = await response.json() as { error?: string }

      if (!response.ok) {
        setError(data.error ?? 'Could not save the homepage settings.')
        return
      }

      setSuccess('Saved to GitHub. The live site should update on refresh in a few seconds.')
      await loadContent()
    } catch {
      setError('Could not save the homepage settings.')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin-panel')
    router.refresh()
  }

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-[#fffdf6] px-6 py-12">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-amber-200 bg-white p-10 text-center text-sm text-stone-500 shadow-[0_24px_80px_rgba(120,53,15,0.08)]">
          Loading homepage settings...
        </div>
      </section>
    )
  }

  if (!content) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-[#fffdf6] px-6 py-12">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-red-200 bg-white p-10 text-center text-sm text-red-700 shadow-[0_24px_80px_rgba(120,53,15,0.08)]">
          {error || 'Could not load the admin content.'}
        </div>
      </section>
    )
  }

  const heroPreview = localImagePreview || content.home.heroImage || DEFAULT_HERO_IMAGE

  return (
    <section className="bg-[#fffdf6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-amber-200 bg-white px-6 py-6 shadow-[0_24px_80px_rgba(120,53,15,0.08)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Admin Menu</p>
            <h1 className="mt-2 font-playfair text-4xl font-bold text-stone-900">Homepage Controls</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
              Update the homepage picture, text, volunteer button link, and form routing from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-amber-200 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-400 hover:bg-amber-50"
            >
              View Site
            </a>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:border-stone-400 hover:text-stone-900"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="mb-8">
          <AdminPanelNav current="homepage" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">Homepage Picture</h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Upload a new hero image or paste a saved image path.
                  </p>
                </div>
                <label className="cursor-pointer rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                    onChange={(event) => void handleImageSelected(event)}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              <div className="relative overflow-hidden rounded-[1.5rem] border border-amber-100 bg-[#fdf6df]">
                <div
                  className="aspect-[16/10] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${heroPreview}")` }}
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Image path"
                  type="text"
                  value={content.home.heroImage}
                  onChange={(value) =>
                    {
                      setLocalImagePreview('')
                      setContent({
                        ...content,
                        home: { ...content.home, heroImage: value },
                      })
                    }
                  }
                  hint="Example: /images/admin/your-image.jpg"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <h2 className="text-lg font-semibold text-stone-900">Statements</h2>
              <p className="mt-1 text-sm text-stone-500">
                These are the main homepage text blocks visitors see first.
              </p>

              <div className="mt-5 space-y-4">
                <Field
                  label="Hero statement"
                  type="text"
                  value={content.home.heroSubtitle}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      home: { ...content.home, heroSubtitle: value },
                    })
                  }
                  multiline
                />

                <Field
                  label="Mission statement"
                  type="text"
                  value={content.home.missionText}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      home: { ...content.home, missionText: value },
                    })
                  }
                  multiline
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <h2 className="text-lg font-semibold text-stone-900">Featured YouTube Link</h2>
              <p className="mt-1 text-sm text-stone-500">
                Paste the YouTube video URL you want to show on the homepage.
              </p>

              <div className="mt-5 space-y-4">
                <Field
                  label="Section title"
                  type="text"
                  value={content.home.featuredVideoTitle}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      home: { ...content.home, featuredVideoTitle: value },
                    })
                  }
                />

                <Field
                  label="YouTube URL"
                  type="url"
                  value={content.home.featuredVideoUrl}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      home: { ...content.home, featuredVideoUrl: value },
                    })
                  }
                  hint="Example: https://www.youtube.com/watch?v=abc123"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <h2 className="text-lg font-semibold text-stone-900">Volunteer & Form Routing</h2>
              <p className="mt-1 text-sm text-stone-500">
                Control the top volunteer button plus where each public form notification email is sent.
              </p>

              <div className="mt-5 space-y-4">
                <Field
                  label="Volunteer form URL"
                  type="url"
                  value={content.settings.volunteerFormUrl}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      settings: { ...content.settings, volunteerFormUrl: value },
                    })
                  }
                  hint="Example: https://www.signupgenius.com/go/..."
                />

                <Field
                  label="Landing page form recipient"
                  type="email"
                  value={content.settings.landingFormRecipientEmail}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      settings: { ...content.settings, landingFormRecipientEmail: value },
                    })
                  }
                  hint="Receives messages from the homepage Contact Us form."
                />

                <Field
                  label="Book Us form recipient"
                  type="email"
                  value={content.settings.bookingFormRecipientEmail}
                  onChange={(value) =>
                    setContent({
                      ...content,
                      settings: { ...content.settings, bookingFormRecipientEmail: value },
                    })
                  }
                  hint="Receives messages from the Book a Performance page."
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-[#fff7dd] via-white to-[#fff1cf] p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <h2 className="text-lg font-semibold text-stone-900">Publish</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Saving writes the updated content to GitHub. The live site reads this content directly, so homepage changes should show up on refresh without a redeploy.
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
                disabled={saving || uploadingImage}
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
