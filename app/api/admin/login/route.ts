import { NextRequest, NextResponse } from 'next/server'

async function signJWT(payload: object, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }))
  const data = encoder.encode(`${header}.${body}`)
  const sig = await crypto.subtle.sign('HMAC', key, data)
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return `${header}.${body}.${sigB64}`
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, googleToken } = body as {
    email?: string
    password?: string
    googleToken?: string
  }

  const secret = process.env.ADMIN_JWT_SECRET || 'change-this-secret'
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  let authenticated = false

  if (googleToken && googleClientId) {
    try {
      const res = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`
      )
      if (res.ok) {
        const tokenData = await res.json() as { aud: string; email: string }
        if (tokenData.aud === googleClientId && tokenData.email === adminEmail) {
          authenticated = true
        }
      }
    } catch {
      // Google token verification failed
    }
  } else if (email && password) {
    if (email === adminEmail && password === adminPassword) {
      authenticated = true
    }
  }

  if (!authenticated) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await signJWT({ email: adminEmail }, secret)

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return response
}
