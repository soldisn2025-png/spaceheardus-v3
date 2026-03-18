import { NextRequest, NextResponse } from 'next/server'
import {
  createAdminSessionToken,
  getAdminAuthConfig,
  setAdminSessionCookie,
} from '@/lib/adminSession'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      email?: string
      id?: string
      password?: string
    }
    const { adminId, adminPassword, sessionSecret } = getAdminAuthConfig()
    const providedId = body.id ?? body.email ?? ''
    const providedPassword = body.password ?? ''

    if (providedId !== adminId || providedPassword !== adminPassword) {
      return NextResponse.json({ error: 'Invalid admin ID or password.' }, { status: 401 })
    }

    const token = await createAdminSessionToken(adminId, sessionSecret)
    const response = NextResponse.json({ success: true })

    setAdminSessionCookie(response, token)

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
