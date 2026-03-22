'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field } from '@/components/admin/AdminFormFields'
import { AdminPanelNav } from '@/components/admin/AdminPanelNav'
import { type GalleryPageContent, type GalleryPhoto, type GalleryVideo } from '@/lib/galleryPageContent'

type ContentResponse = {
  error?: string
  fileContent?: {
    content: GalleryPageContent
    file: 'gallery-page'
    sha: string
  }
}

function createItemId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
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

export default function AdminGalleryPage() {
  const router = useRouter()
  const [content, setContent] = useState<GalleryPageContent | null>(null)
  const [fileSha, setFileSha] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingTarget, setUploadingTarget] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>({})

  const loadContent = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/content?file=gallery-page', { cache: 'no-store' })

      if (response.status === 401) {
        router.replace('/admin-panel')
        return
      }

      const data = await response.json() as ContentResponse

      if (!response.ok || !data.fileContent) {
        setError(data.error ?? 'Could not load the gallery settings.')
        return
      }

      setContent(data.fileContent.content)
      setFileSha(data.fileContent.sha)
      setPhotoPreviews({})
    } catch {
      setError('Could not load the gallery settings.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void loadContent()
  }, [loadContent])

  async function uploadImage(file: File) {
    const dataUrl = await readFileAsDataUrl(file)
    const base64 = dataUrl.split(',')[1] ?? ''
    const response = await fetch('/api/admin/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64,
        collection: 'gallery',
        fileName: file.name,
      }),
    })
    const data = await response.json() as { error?: string; path?: string }

    if (!response.ok || !data.path) {
      throw new Error(data.error ?? 'Image upload failed.')
    }

    return {
      dataUrl,
      path: data.path,
    }
  }

  function updateVideo(index: number, field: keyof GalleryVideo, value: string) {
    if (!content) {
      return
    }

    setContent({
      ...content,
      videos: content.videos.map((video, videoIndex) =>
        videoIndex === index
          ? {
              ...video,
              [field]: value,
            }
          : video,
      ),
    })
  }

  function addVideo() {
    if (!content) {
      return
    }

    setContent({
      ...content,
      videos: [
        ...content.videos,
        {
          id: createItemId('video'),
          title: 'New video',
          url: '',
        },
      ],
    })
  }

  function removeVideo(index: number) {
    if (!content) {
      return
    }

    setContent({
      ...content,
      videos: content.videos.filter((_, videoIndex) => videoIndex !== index),
    })
  }

  function updatePhoto(index: number, field: keyof GalleryPhoto, value: string) {
    if (!content) {
      return
    }

    const photoId = content.photos[index]?.id ?? ''

    if (field === 'src') {
      setPhotoPreviews((currentPreviews) => {
        const nextPreviews = { ...currentPreviews }
        delete nextPreviews[photoId]
        return nextPreviews
      })
    }

    setContent({
      ...content,
      photos: content.photos.map((photo, photoIndex) =>
        photoIndex === index
          ? {
              ...photo,
              [field]: value,
            }
          : photo,
      ),
    })
  }

  function addPhoto() {
    if (!content) {
      return
    }

    setContent({
      ...content,
      photos: [
        ...content.photos,
        {
          id: createItemId('photo'),
          src: '',
          alt: '',
          caption: '',
        },
      ],
    })
  }

  function removePhoto(index: number) {
    if (!content) {
      return
    }

    const photoId = content.photos[index]?.id ?? ''

    setPhotoPreviews((currentPreviews) => {
      const nextPreviews = { ...currentPreviews }
      delete nextPreviews[photoId]
      return nextPreviews
    })
    setContent({
      ...content,
      photos: content.photos.filter((_, photoIndex) => photoIndex !== index),
    })
  }

  async function handlePhotoSelected(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file || !content) {
      return
    }

    setError('')
    setSuccess('')
    setUploadingTarget(`photo-${index}`)

    try {
      const currentPhoto = content.photos[index]
      const uploadedImage = await uploadImage(file)

      setPhotoPreviews((currentPreviews) => ({
        ...currentPreviews,
        [currentPhoto.id]: uploadedImage.dataUrl,
      }))
      setContent({
        ...content,
        photos: content.photos.map((photo, photoIndex) =>
          photoIndex === index
            ? {
                ...photo,
                alt: photo.alt || file.name.replace(/\.[^.]+$/, ''),
                src: uploadedImage.path,
              }
            : photo,
        ),
      })
      setSuccess('Gallery image uploaded. Click Save & Publish to update the live gallery.')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Image upload failed.')
    } finally {
      setUploadingTarget('')
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
          file: 'gallery-page',
          sha: fileSha,
        }),
      })
      const data = await response.json() as { error?: string }

      if (!response.ok) {
        setError(data.error ?? 'Could not save the gallery settings.')
        return
      }

      setSuccess('Saved to GitHub. The live site should update on refresh in a few seconds.')
      await loadContent()
    } catch {
      setError('Could not save the gallery settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-[#fffdf6] px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-amber-200 bg-white p-10 text-center text-sm text-stone-500 shadow-[0_24px_80px_rgba(120,53,15,0.08)]">
          Loading gallery settings...
        </div>
      </section>
    )
  }

  if (!content) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-[#fffdf6] px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-red-200 bg-white p-10 text-center text-sm text-red-700 shadow-[0_24px_80px_rgba(120,53,15,0.08)]">
          {error || 'Could not load the gallery settings.'}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#fffdf6] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-amber-200 bg-white px-6 py-6 shadow-[0_24px_80px_rgba(120,53,15,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Admin Menu</p>
          <h1 className="mt-2 font-playfair text-4xl font-bold text-stone-900">Gallery Controls</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600">
            Update the gallery title, videos, and photo list from one place, including uploading new gallery images.
          </p>
          <AdminPanelNav current="gallery" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <h2 className="text-lg font-semibold text-stone-900">Gallery Page Text</h2>
              <p className="mt-1 text-sm text-stone-500">
                Update the title and description shown above the gallery.
              </p>

              <div className="mt-5 space-y-4">
                <Field label="Title" value={content.title} onChange={(value) => setContent({ ...content, title: value })} />
                <Field label="Subtitle" value={content.subtitle} onChange={(value) => setContent({ ...content, subtitle: value })} multiline />
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">Gallery Videos</h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Add YouTube clips to show at the top of the gallery page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addVideo}
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Add Video
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {content.videos.map((video, index) => (
                  <div key={video.id} className="rounded-[1.5rem] border border-amber-100 bg-[#fffaf0] p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-stone-900">Video {index + 1}</p>
                        <p className="text-xs text-stone-500">Paste a normal YouTube watch link.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Internal ID" value={video.id} onChange={(value) => updateVideo(index, 'id', value)} />
                      <Field label="Video title" value={video.title} onChange={(value) => updateVideo(index, 'title', value)} />
                      <div className="md:col-span-2">
                        <Field label="YouTube URL" type="url" value={video.url} onChange={(value) => updateVideo(index, 'url', value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">Gallery Photos</h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Upload images or paste image paths for the gallery grid.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addPhoto}
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Add Photo
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {content.photos.map((photo, index) => {
                  const previewImage = photoPreviews[photo.id] || photo.src
                  const uploadKey = `photo-${index}`

                  return (
                    <div key={photo.id} className="rounded-[1.5rem] border border-amber-100 bg-[#fffaf0] p-5">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-stone-900">Photo {index + 1}</p>
                          <p className="text-xs text-stone-500">Upload the image first, then save and publish.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                          <div className="overflow-hidden rounded-[1.25rem] border border-amber-100 bg-[#fdf6df]">
                            {previewImage ? (
                              <div
                                className="aspect-square w-full bg-cover bg-center"
                                style={{ backgroundImage: `url("${previewImage}")` }}
                              />
                            ) : (
                              <div className="flex aspect-square items-center justify-center px-4 text-center text-sm text-stone-500">
                                No image selected yet
                              </div>
                            )}
                          </div>

                          <label className="mt-4 inline-flex cursor-pointer rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
                            {uploadingTarget === uploadKey ? 'Uploading...' : 'Upload Photo'}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                              onChange={(event) => void handlePhotoSelected(index, event)}
                              className="hidden"
                              disabled={uploadingTarget === uploadKey}
                            />
                          </label>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Internal ID" value={photo.id} onChange={(value) => updatePhoto(index, 'id', value)} />
                          <Field label="Alt text" value={photo.alt} onChange={(value) => updatePhoto(index, 'alt', value)} />
                          <div className="md:col-span-2">
                            <Field
                              label="Image path"
                              value={photo.src}
                              onChange={(value) => updatePhoto(index, 'src', value)}
                              hint="Example: /images/gallery/concert-1.jpg"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Field label="Caption" value={photo.caption} onChange={(value) => updatePhoto(index, 'caption', value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-[#fff7dd] via-white to-[#fff1cf] p-6 shadow-[0_24px_80px_rgba(120,53,15,0.06)]">
              <h2 className="text-lg font-semibold text-stone-900">Publish Gallery</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Saving writes the new gallery text, videos, and photo list to GitHub. The public gallery reads this content live, so updates should show up on refresh without a redeploy.
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
                disabled={saving || uploadingTarget.startsWith('photo-')}
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
