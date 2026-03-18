import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

type AdminSessionPayload = {
  exp: number
  sub: string
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)

  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function encodeJson(value: object) {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(value)))
}

function decodeJson<T>(value: string) {
  const bytes = fromBase64Url(value)
  const json = new TextDecoder().decode(bytes)

  return JSON.parse(json) as T
}

async function getSigningKey(secret: string, usage: KeyUsage) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage],
  )
}

export function getAdminAuthConfig() {
  const adminId = process.env.ADMIN_ID ?? process.env.ADMIN_EMAIL ?? ''
  const adminPassword = process.env.ADMIN_PASSWORD ?? ''
  const sessionSecret = process.env.ADMIN_JWT_SECRET ?? ''
  const missing: string[] = []

  if (!adminId) {
    missing.push('ADMIN_ID')
  }

  if (!adminPassword) {
    missing.push('ADMIN_PASSWORD')
  }

  if (!sessionSecret) {
    missing.push('ADMIN_JWT_SECRET')
  }

  if (missing.length > 0) {
    throw new Error(`Missing admin auth env vars: ${missing.join(', ')}`)
  }

  return { adminId, adminPassword, sessionSecret }
}

export async function createAdminSessionToken(adminId: string, sessionSecret: string) {
  const header = encodeJson({ alg: 'HS256', typ: 'JWT' })
  const payload = encodeJson({
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    sub: adminId,
  })
  const unsignedToken = `${header}.${payload}`
  const key = await getSigningKey(sessionSecret, 'sign')
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(unsignedToken))

  return `${unsignedToken}.${toBase64Url(new Uint8Array(signature))}`
}

export async function verifyAdminSessionToken(token: string, sessionSecret: string) {
  try {
    const [header, payload, signature] = token.split('.')

    if (!header || !payload || !signature) {
      return false
    }

    const key = await getSigningKey(sessionSecret, 'verify')
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(signature),
      new TextEncoder().encode(`${header}.${payload}`),
    )

    if (!isValid) {
      return false
    }

    const parsedPayload = decodeJson<AdminSessionPayload>(payload)

    return parsedPayload.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

export async function requireAdminSession(request: NextRequest) {
  const sessionSecret = process.env.ADMIN_JWT_SECRET ?? ''

  if (!sessionSecret) {
    return NextResponse.json(
      { error: 'Admin auth is not configured. Add ADMIN_JWT_SECRET.' },
      { status: 500 },
    )
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value

  if (!token || !(await verifyAdminSessionToken(token, sessionSecret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}
