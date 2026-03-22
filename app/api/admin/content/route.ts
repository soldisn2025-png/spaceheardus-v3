import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/adminSession'
import { mergeAdminContent } from '@/lib/adminContentMerge'
import { GitHubContentConflictError, getJsonFile, updateJsonFile } from '@/lib/githubContent'
import {
  EVENTS_CONTENT_PATH,
  normalizeEventsContent,
} from '@/lib/eventsContent'
import {
  GALLERY_PAGE_CONTENT_PATH,
  normalizeGalleryPageContent,
} from '@/lib/galleryPageContent'
import {
  normalizeSiteContent,
  SITE_CONTENT_PATH,
} from '@/lib/siteContent'

const ADMIN_CONTENT_FILES = {
  events: {
    normalize: normalizeEventsContent,
    path: EVENTS_CONTENT_PATH,
  },
  'gallery-page': {
    normalize: normalizeGalleryPageContent,
    path: GALLERY_PAGE_CONTENT_PATH,
  },
  'site-content': {
    normalize: normalizeSiteContent,
    path: SITE_CONTENT_PATH,
  },
} as const

type AdminContentFile = keyof typeof ADMIN_CONTENT_FILES

function readAdminContentFile(value: string | null): AdminContentFile | null {
  if (!value) {
    return 'site-content'
  }

  return value in ADMIN_CONTENT_FILES ? value as AdminContentFile : null
}

export async function GET(request: NextRequest) {
  const unauthorizedResponse = await requireAdminSession(request)

  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  const file = readAdminContentFile(request.nextUrl.searchParams.get('file'))

  if (!file) {
    return NextResponse.json({ error: 'Invalid file selection.' }, { status: 400 })
  }

  try {
    const selectedFile = ADMIN_CONTENT_FILES[file]
    const fileContent = await getJsonFile(selectedFile.path)
    const normalizedContent = selectedFile.normalize(fileContent.content)

    if (file === 'site-content') {
      return NextResponse.json({
        fileContent: {
          content: normalizedContent,
          file,
          sha: fileContent.sha,
        },
        siteContent: {
          content: normalizedContent,
          sha: fileContent.sha,
        },
      })
    }

    return NextResponse.json({
      fileContent: {
        content: normalizedContent,
        file,
        sha: fileContent.sha,
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
      baseContent?: unknown
      content?: unknown
      file?: string
      sha?: string
    }

    const file = readAdminContentFile(body.file ?? null)

    if (!file) {
      return NextResponse.json({ error: 'Invalid file selection.' }, { status: 400 })
    }

    if (!body.sha) {
      return NextResponse.json({ error: 'Missing file version.' }, { status: 400 })
    }

    const selectedFile = ADMIN_CONTENT_FILES[file]
    const normalizedContent = selectedFile.normalize(body.content)

    try {
      await updateJsonFile(
        selectedFile.path,
        normalizedContent,
        body.sha,
        `admin: update ${file} content`,
      )
    } catch (error) {
      if (!(error instanceof GitHubContentConflictError)) {
        throw error
      }

      const latestFile = await getJsonFile(selectedFile.path)
      const latestContent = selectedFile.normalize(latestFile.content)

      if (body.baseContent) {
        const baseContent = selectedFile.normalize(body.baseContent)
        const merged = mergeAdminContent(file, baseContent, normalizedContent, latestContent)

        if (merged.conflicts.length === 0) {
          await updateJsonFile(
            selectedFile.path,
            merged.content,
            latestFile.sha,
            `admin: update ${file} content`,
          )

          return NextResponse.json({ file, merged: true, success: true })
        }

        return NextResponse.json(
          {
            conflict: true,
            error: 'Someone else updated this content while you were editing. Reload the page to review the latest version before saving again.',
            latestContent,
            latestSha: latestFile.sha,
          },
          { status: 409 },
        )
      }

      return NextResponse.json(
        {
          conflict: true,
          error: 'This content changed before your save finished. Reload the page and try again.',
          latestContent,
          latestSha: latestFile.sha,
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ file, success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save content.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
