'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// Simple password protection
const ADMIN_PASSWORD = 'spaceheardus2025'

type SiteContent = {
  site: {
    name: string
    tagline: string
    description: string
    volunteerUrl: string
  }
  home: {
    heroTitle: string
    heroSubtitle: string
    missionTitle: string
    missionText: string
  }
  players: Array<{
    id: string
    name: string
    role: string
    photo: string
    bio: string
  }>
  events: {
    pageTitle: string
    pageSubtitle: string
    groupPhotoCaption: string
    videos: Array<{
      id: string
      title: string
      description: string
      src: string
      poster: string
    }>
    upcomingEvents: Array<{
      id: string
      title: string
      date: string
      location: string
      description: string
    }>
  }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [content, setContent] = useState<SiteContent | null>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'players' | 'events' | 'settings'>('home')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authed) {
      fetch('/api/admin/content')
        .then(r => r.json())
        .then(setContent)
        .catch(() => {
          // Fallback: load from static file info
          import('@/content/site-content.json').then(m => setContent(m.default as SiteContent))
        })
    }
  }, [authed])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password. Try again.')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      alert('Save failed. Make sure the API route is set up.')
    }
    setLoading(false)
  }

  const updatePlayer = (id: string, field: string, value: string) => {
    if (!content) return
    setContent({
      ...content,
      players: content.players.map(p => p.id === id ? { ...p, [field]: value } : p)
    })
  }

  const updateEvent = (id: string, field: string, value: string) => {
    if (!content) return
    setContent({
      ...content,
      events: {
        ...content.events,
        upcomingEvents: content.events.upcomingEvents.map(e =>
          e.id === id ? { ...e, [field]: value } : e
        )
      }
    })
  }

  const addEvent = () => {
    if (!content) return
    const newEvent = {
      id: `evt${Date.now()}`,
      title: 'New Event',
      date: 'June 1, 2025',
      location: 'Location TBD',
      description: 'Event description here.'
    }
    setContent({
      ...content,
      events: {
        ...content.events,
        upcomingEvents: [...content.events.upcomingEvents, newEvent]
      }
    })
  }

  const removeEvent = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      events: {
        ...content.events,
        upcomingEvents: content.events.upcomingEvents.filter(e => e.id !== id)
      }
    })
  }

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="font-playfair text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-white/40 font-inter text-sm">Space Heard Us · Content Manager</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <label className="block text-white/60 text-sm font-inter mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-inter text-sm focus:outline-none focus:border-amber-400/50 mb-4"
            />
            {error && <p className="text-red-400 text-sm font-inter mb-4">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-300 transition-colors"
            >
              Login
            </button>
          </div>
          <p className="text-center text-white/30 text-xs font-inter mt-4">
            Default password: spaceheardus2025<br/>Change it in /app/admin/page.tsx
          </p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/40 font-inter">Loading content...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'home', label: '🏠 Home', },
    { id: 'players', label: '🎵 Players', },
    { id: 'events', label: '📅 Events', },
    { id: 'settings', label: '⚙️ Settings', },
  ] as const

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <div className="sticky top-16 z-40 bg-[#0a0a0f]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-xl font-bold">Admin Panel</h1>
            <p className="text-white/40 text-xs font-inter">Edit site content without touching code</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-amber-400 text-black hover:bg-amber-300'
            }`}
          >
            {loading ? 'Saving...' : saved ? '✅ Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 pb-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-inter transition-all ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold mb-6">Home Page Content</h2>
            <Field label="Hero Title" value={content.home.heroTitle} onChange={v => setContent({...content, home: {...content.home, heroTitle: v}})} />
            <Field label="Hero Subtitle" value={content.home.heroSubtitle} onChange={v => setContent({...content, home: {...content.home, heroSubtitle: v}})} multiline />
            <Field label="Mission Title" value={content.home.missionTitle} onChange={v => setContent({...content, home: {...content.home, missionTitle: v}})} />
            <Field label="Mission Text" value={content.home.missionText} onChange={v => setContent({...content, home: {...content.home, missionText: v}})} multiline />
          </div>
        )}

        {/* PLAYERS TAB */}
        {activeTab === 'players' && (
          <div className="space-y-10">
            <h2 className="font-playfair text-2xl font-bold">Player Profiles</h2>
            {content.players.map((player) => (
              <div key={player.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                    <Image src={player.photo} alt={player.name} fill className="object-cover object-top" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-bold">{player.name}</h3>
                    <p className="text-amber-400 text-sm font-inter">{player.role}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Field label="Name" value={player.name} onChange={v => updatePlayer(player.id, 'name', v)} />
                  <Field label="Role" value={player.role} onChange={v => updatePlayer(player.id, 'role', v)} />
                  <Field label="Bio" value={player.bio} onChange={v => updatePlayer(player.id, 'bio', v)} multiline />
                  <div>
                    <label className="block text-white/60 text-xs font-inter mb-1">Photo Path</label>
                    <div className="flex gap-3">
                      <input
                        value={player.photo}
                        onChange={e => updatePlayer(player.id, 'photo', e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                    <p className="text-white/30 text-xs font-inter mt-1">
                      Place photo in /public/images/ and enter path like /images/filename.jpg
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <h2 className="font-playfair text-2xl font-bold">Events Page</h2>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-inter font-semibold text-white/70 text-sm uppercase tracking-wider">Page Header</h3>
              <Field label="Page Title" value={content.events.pageTitle} onChange={v => setContent({...content, events: {...content.events, pageTitle: v}})} />
              <Field label="Page Subtitle" value={content.events.pageSubtitle} onChange={v => setContent({...content, events: {...content.events, pageSubtitle: v}})} />
              <Field label="Group Photo Caption" value={content.events.groupPhotoCaption} onChange={v => setContent({...content, events: {...content.events, groupPhotoCaption: v}})} />
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-inter font-semibold text-white/70 text-sm uppercase tracking-wider">Videos</h3>
              {content.events.videos.map((video, i) => (
                <div key={video.id} className="border border-white/5 rounded-xl p-4 space-y-3">
                  <p className="text-white/50 text-xs font-inter">Video {i + 1}</p>
                  <Field label="Title" value={video.title} onChange={v => {
                    const videos = [...content.events.videos]
                    videos[i] = {...videos[i], title: v}
                    setContent({...content, events: {...content.events, videos}})
                  }} />
                  <Field label="Description" value={video.description} onChange={v => {
                    const videos = [...content.events.videos]
                    videos[i] = {...videos[i], description: v}
                    setContent({...content, events: {...content.events, videos}})
                  }} />
                  <Field label="Video File Path (e.g. /videos/performance1.mp4)" value={video.src} onChange={v => {
                    const videos = [...content.events.videos]
                    videos[i] = {...videos[i], src: v}
                    setContent({...content, events: {...content.events, videos}})
                  }} />
                </div>
              ))}
              <p className="text-white/30 text-xs font-inter">Place MP4 files in /public/videos/ folder</p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-inter font-semibold text-white/70 text-sm uppercase tracking-wider">Upcoming Events</h3>
                <button onClick={addEvent} className="px-4 py-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full text-xs font-bold hover:bg-amber-400/20 transition-colors">
                  + Add Event
                </button>
              </div>
              {content.events.upcomingEvents.map((event) => (
                <div key={event.id} className="border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <Field label="Event Title" value={event.title} onChange={v => updateEvent(event.id, 'title', v)} />
                    <button onClick={() => removeEvent(event.id)} className="ml-4 mt-5 text-red-400/60 hover:text-red-400 text-sm">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date" value={event.date} onChange={v => updateEvent(event.id, 'date', v)} />
                    <Field label="Location" value={event.location} onChange={v => updateEvent(event.id, 'location', v)} />
                  </div>
                  <Field label="Description" value={event.description} onChange={v => updateEvent(event.id, 'description', v)} multiline />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold">Site Settings</h2>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
              <Field label="Site Name" value={content.site.name} onChange={v => setContent({...content, site: {...content.site, name: v}})} />
              <Field label="Tagline" value={content.site.tagline} onChange={v => setContent({...content, site: {...content.site, tagline: v}})} />
              <Field label="Site Description" value={content.site.description} onChange={v => setContent({...content, site: {...content.site, description: v}})} multiline />
              <Field
                label="🔗 Volunteer SignupGenius URL"
                value={content.site.volunteerUrl}
                onChange={v => setContent({...content, site: {...content.site, volunteerUrl: v}})}
              />
              <p className="text-white/30 text-xs font-inter">⚠️ After changing the volunteer URL here, you'll also need to update it in Header.tsx and page.tsx manually (or ask your developer)</p>
            </div>

            <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-6">
              <h3 className="font-inter font-semibold text-amber-400 mb-3">📸 How to Swap Photos</h3>
              <ol className="text-white/60 text-sm font-inter space-y-2 list-decimal list-inside">
                <li>Add your new photo to <code className="text-amber-400/80">/public/images/</code> in your project</li>
                <li>Go to the Players tab above</li>
                <li>Update the "Photo Path" field to <code className="text-amber-400/80">/images/your-new-photo.jpg</code></li>
                <li>Click "Save Changes" and redeploy</li>
              </ol>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h3 className="font-inter font-semibold text-white/70 mb-3">🔐 Change Admin Password</h3>
              <p className="text-white/40 text-sm font-inter">
                Open <code className="text-amber-400/80">/app/admin/page.tsx</code> and change the <code className="text-amber-400/80">ADMIN_PASSWORD</code> constant at the top of the file.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Reusable field component
function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
}) {
  return (
    <div className="w-full">
      <label className="block text-white/60 text-xs font-inter mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-amber-400/50 resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-amber-400/50"
        />
      )}
    </div>
  )
}
