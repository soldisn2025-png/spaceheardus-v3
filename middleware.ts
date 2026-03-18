import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSessionToken } from '@/lib/adminSession'

async function hasValidSession(request: NextRequest) {
  const sessionSecret = process.env.ADMIN_JWT_SECRET ?? ''
  const token = request.cookies.get('admin_session')?.value

  if (!sessionSecret || !token) {
    return false
  }

  return verifyAdminSessionToken(token, sessionSecret)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoggedIn = await hasValidSession(request)

  if (pathname === '/admin-panel' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin-panel/dashboard', request.url))
  }

  if (pathname.startsWith('/admin-panel/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin-panel', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin-panel', '/admin-panel/dashboard/:path*'],
}
