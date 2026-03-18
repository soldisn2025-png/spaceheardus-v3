'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type SiteContent = {
  site: { name: string; tagline: string; description: string; logo: string }
  home: {
    heroTitle: string
    heroSubtitle: string
    missionTitle: string
    missionText: string
    featuredVideoTitle: string
    featuredVideoUrl: string
    volunteerTitle: string
    volunteerText: string
    contactTitle: string
    contactText: string
  }
}

type GalleryVideo = { id: string; title: string; url: string }
type GalleryPhoto = { id: string; src: string; alt: string; caption: string }
type GalleryPage = {
  title: string
  subtitle: string
  videos: GalleryVideo[]
  photos: GalleryPhoto[]
}

type ContentData = {
  siteContent: { content: SiteContent; sha: string } | null
  galleryPage: { content: GalleryPage; sha: string } | null
}

type TabKey = 'home' | 'videos' | 'photos'

function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-amber-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-amber-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
        />
      )}
      {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const [tab, setTab] = useState<TabKey>('home')

  // Local editable state
  const [homeContent, setHomeContent] = useState<SiteContent['home'] | null>(null)
  const [siteInfo, setSiteInfo] = useState<SiteContent['site'] | null>(null)
  const [videos, setVideos] = useState<GalleryVideo[]>([])
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])

  const loadContent = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/content')
      if (res.status === 401) {
        router.push('/admin-panel')
        return
      }
      const json = await res.json() as ContentData
      setData(json)
      if (json.siteContent) {
        setHomeContent(json.siteContent.content.home)
        setSiteInfo(json.siteContent.content.site)
      }
      if (json.galleryPage) {
        setVideos(json.galleryPage.content.videos)
        setPhotos(json.galleryPage.content.photos)
      }
    } catch {
      // ignore
    }
    setLoading(false)
  }, [router])

  useEffect(() => {
    void loadContent()
  }, [loadContent])

  async function saveHomeContent() {
    if (!data?.siteContent || !homeContent || !siteInfo) return
    setSaving(true)
    const updated: SiteContent = { site: siteInfo, home: homeContent }
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'site-content', content: updated, sha: data.siteContent.sha }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved('home')
      setTimeout(() => setSaved(null), 3000)
      await loadContent()
    } else {
      const err = await res.json() as { error?: string }
      alert(err.error ?? 'Save failed')
    }
  }

  async function saveGallery() {
    if (!data?.galleryPage) return
    setSaving(true)
    const updated: GalleryPage = { ...data.galleryPage.content, videos, photos }
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'gallery-page', content: updated, sha: data.galleryPage.sha }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved('gallery')
      setTimeout(() => setSaved(null), 3000)
      await loadContent()
    } else {
      const err = await res.json() as { error?: string }
      alert(err.error ?? 'Save failed')
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin-panel')
  }

  function updateVideo(index: number, field: keyof GalleryVideo, value: string) {
    setVideos((prev) => prev.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  function addVideo() {
    setVideos((prev) => [...prev, { id: `video-${Date.now()}`, title: 'New Video', url: '' }])
  }

  function removeVideo(index: number) {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  function updatePhoto(index: number, field: keyof GalleryPhoto, value: string) {
    setPhotos((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p))
  }

  function addPhoto() {
    setPhotos((prev) => [...prev, { id: `photo-${Date.now()}`, src: '', alt: '', caption: '' }])
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf6] flex items-center justify-center">
        <p className="text-stone-500 text-sm">Loading content…</p>
      </div>
    )
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: 'Home Text' },
    { key: 'videos', label: 'YouTube Videos' },
    { key: 'photos', label: 'Photos' },
  ]

  return (
    <div className="min-h-screen bg-[#fffdf6]">
      {/* Top bar */}
      <header className="border-b border-amber-200 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-xl text-stone-900 font-bold">Space Heard Us · Admin</h1>
          <p className="text-xs text-stone-400">Content editor — changes commit to GitHub and redeploy automatically</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noopener" className="text-sm text-amber-700 hover:underline">
            View site ↗
          </a>
          <button
            onClick={() => void logout()}
            className="text-sm text-stone-500 hover:text-stone-700 border border-stone-200 rounded-full px-4 py-1.5 hover:border-stone-400 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-amber-100 pb-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-xl border-b-2 transition ${
                tab === t.key
                  ? 'border-amber-500 text-amber-700 bg-amber-50'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Home Text tab */}
        {tab === 'home' && homeContent && siteInfo && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-amber-100 p-6 space-y-5">
              <h2 className="font-semibold text-stone-800 text-base">Site Info</h2>
              <Field label="Site tagline" value={siteInfo.tagline} onChange={(v) => setSiteInfo({ ...siteInfo, tagline: v })} />
              <Field label="Site description" value={siteInfo.description} onChange={(v) => setSiteInfo({ ...siteInfo, description: v })} multiline />
            </div>

            <div className="bg-white rounded-2xl border border-amber-100 p-6 space-y-5">
              <h2 className="font-semibold text-stone-800 text-base">Hero Section</h2>
              <Field label="Hero subtitle" value={homeContent.heroSubtitle} onChange={(v) => setHomeContent({ ...homeContent, heroSubtitle: v })} multiline />
            </div>

            <div className="bg-white rounded-2xl border border-amber-100 p-6 space-y-5">
              <h2 className="font-semibold text-stone-800 text-base">Mission Section</h2>
              <Field label="Mission title" value={homeContent.missionTitle} onChange={(v) => setHomeContent({ ...homeContent, missionTitle: v })} />
              <Field label="Mission text" value={homeContent.missionText} onChange={(v) => setHomeContent({ ...homeContent, missionText: v })} multiline />
            </div>

            <div className="bg-white rounded-2xl border border-amber-100 p-6 space-y-5">
              <h2 className="font-semibold text-stone-800 text-base">Featured Video</h2>
              <Field
                label="Featured video section title"
                value={homeContent.featuredVideoTitle}
                onChange={(v) => setHomeContent({ ...homeContent, featuredVideoTitle: v })}
              />
              <Field
                label="YouTube URL"
                value={homeContent.featuredVideoUrl}
                onChange={(v) => setHomeContent({ ...homeContent, featuredVideoUrl: v })}
                hint="Paste a YouTube video URL, e.g. https://www.youtube.com/watch?v=abc123"
              />
            </div>

            <div className="bg-white rounded-2xl border border-amber-100 p-6 space-y-5">
              <h2 className="font-semibold text-stone-800 text-base">Volunteer Section</h2>
              <Field label="Title" value={homeContent.volunteerTitle} onChange={(v) => setHomeContent({ ...homeContent, volunteerTitle: v })} />
              <Field label="Text" value={homeContent.volunteerText} onChange={(v) => setHomeContent({ ...homeContent, volunteerText: v })} multiline />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => void saveHomeContent()}
                disabled={saving}
                className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save & Publish'}
              </button>
              {saved === 'home' && (
                <span className="text-green-600 text-sm font-medium">Saved! Site will redeploy in ~1 min.</span>
              )}
            </div>
          </div>
        )}

        {/* Videos tab */}
        {tab === 'videos' && (
          <div className="space-y-5">
            {videos.map((video, i) => (
              <div key={video.id} className="bg-white rounded-2xl border border-amber-100 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-stone-700 text-sm">Video {i + 1}</h3>
                  <button
                    onClick={() => removeVideo(i)}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-100 rounded-full px-3 py-1 hover:border-red-300 transition"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Title" value={video.title} onChange={(v) => updateVideo(i, 'title', v)} />
                <Field
                  label="YouTube URL"
                  value={video.url}
                  onChange={(v) => updateVideo(i, 'url', v)}
                  hint="e.g. https://www.youtube.com/watch?v=abc123"
                />
              </div>
            ))}

            <button
              onClick={addVideo}
              className="w-full py-3 border-2 border-dashed border-amber-200 rounded-2xl text-amber-700 text-sm font-medium hover:border-amber-400 hover:bg-amber-50 transition"
            >
              + Add Video
            </button>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => void saveGallery()}
                disabled={saving}
                className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save & Publish'}
              </button>
              {saved === 'gallery' && (
                <span className="text-green-600 text-sm font-medium">Saved! Site will redeploy in ~1 min.</span>
              )}
            </div>
          </div>
        )}

        {/* Photos tab */}
        {tab === 'photos' && (
          <div className="space-y-5">
            <p className="text-sm text-stone-500 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
              Enter the URL or path of each photo. To upload new images, use the{' '}
              <a href="/admin/" className="underline text-amber-700">Decap CMS at /admin/</a> which handles file uploads directly to GitHub.
            </p>

            {photos.map((photo, i) => (
              <div key={photo.id} className="bg-white rounded-2xl border border-amber-100 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-stone-700 text-sm">Photo {i + 1}</h3>
                  <button
                    onClick={() => removePhoto(i)}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-100 rounded-full px-3 py-1 hover:border-red-300 transition"
                  >
                    Remove
                  </button>
                </div>
                <Field
                  label="Image URL or path"
                  value={photo.src}
                  onChange={(v) => updatePhoto(i, 'src', v)}
                  hint="e.g. /images/gallery/my-photo.jpg"
                />
                <Field label="Alt text" value={photo.alt} onChange={(v) => updatePhoto(i, 'alt', v)} hint="Describe the photo for accessibility" />
                <Field label="Caption (optional)" value={photo.caption} onChange={(v) => updatePhoto(i, 'caption', v)} />
              </div>
            ))}

            <button
              onClick={addPhoto}
              className="w-full py-3 border-2 border-dashed border-amber-200 rounded-2xl text-amber-700 text-sm font-medium hover:border-amber-400 hover:bg-amber-50 transition"
            >
              + Add Photo
            </button>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => void saveGallery()}
                disabled={saving}
                className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save & Publish'}
              </button>
              {saved === 'gallery' && (
                <span className="text-green-600 text-sm font-medium">Saved! Site will redeploy in ~1 min.</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
