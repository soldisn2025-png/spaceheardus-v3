import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/adminSession'
import { getJsonFile, updateJsonFile } from '@/lib/githubContent'
import {
  normalizeSiteContent,
  SITE_CONTENT_PATH,
} from '@/lib/siteContent'

export async function GET(request: NextRequest) {
  const unauthorizedResponse = await requireAdminSession(request)

  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const siteContent = await getJsonFile(SITE_CONTENT_PATH)

    return NextResponse.json({
      siteContent: {
        content: normalizeSiteContent(siteContent.content),
        sha: siteContent.sha,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load content.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const unauthorizedResponse = await requireAdminSession(request)

  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const body = await request.json() as {
      content?: unknown
      file?: string
      sha?: string
    }

    if (body.file !== 'site-content') {
      return NextResponse.json({ error: 'Invalid file selection.' }, { status: 400 })
    }

    if (!body.sha) {
      return NextResponse.json({ error: 'Missing file version.' }, { status: 400 })
    }

    const normalizedContent = normalizeSiteContent(body.content)

    await updateJsonFile(
      SITE_CONTENT_PATH,
      normalizedContent,
      body.sha,
      'admin: update homepage content',
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save content.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
