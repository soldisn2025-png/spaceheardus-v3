'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    handleGoogleCredential: (response: { credential: string }) => void
  }
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''

  async function login(body: object) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        router.push('/admin-panel/dashboard')
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error ?? 'Login failed. Check your credentials.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void login({ email, password })
  }

  // Called by Google Identity Services script
  if (typeof window !== 'undefined') {
    window.handleGoogleCredential = (response) => {
      void login({ googleToken: response.credential })
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdf6] flex items-center justify-center px-4">
      {googleClientId && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      )}

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl text-stone-900 font-bold mb-1">Space Heard Us</h1>
          <p className="text-stone-500 text-sm">Admin Panel</p>
        </div>

        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-stone-800 mb-6 text-center">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {googleClientId && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-amber-100" />
                <span className="text-xs text-stone-400">or</span>
                <div className="flex-1 h-px bg-amber-100" />
              </div>

              {/* Google Identity Services rendered button */}
              <div
                id="g_id_onload"
                data-client_id={googleClientId}
                data-callback="handleGoogleCredential"
                data-auto_prompt="false"
              />
              <div
                className="g_id_signin"
                data-type="standard"
                data-size="large"
                data-theme="outline"
                data-text="sign_in_with"
                data-shape="rectangular"
                data-width="100%"
              />
            </>
          )}

          {!googleClientId && (
            <p className="mt-4 text-xs text-stone-400 text-center">
              Google login: set <code className="bg-amber-50 px-1 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> env var to enable.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Space Heard Us Admin · <a href="/" className="underline hover:text-stone-600">Back to site</a>
        </p>
      </div>
    </div>
  )
}
