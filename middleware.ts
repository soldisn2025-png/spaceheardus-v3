import { NextRequest, NextResponse } from 'next/server'

async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [header, body, sig] = parts
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const sigBytes = Uint8Array.from(
      atob(sig.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    )
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(`${header}.${body}`)
    )
    if (!valid) return false
    const payload = JSON.parse(atob(body)) as { exp?: number }
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin-panel/dashboard')) {
    const token = request.cookies.get('admin_session')?.value
    const secret = process.env.ADMIN_JWT_SECRET || 'change-this-secret'
    if (!token || !(await verifyJWT(token, secret))) {
      return NextResponse.redirect(new URL('/admin-panel', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/admin-panel/dashboard/:path*',
}
