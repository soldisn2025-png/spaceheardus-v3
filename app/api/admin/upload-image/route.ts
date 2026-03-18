import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/adminSession'
import { uploadBase64File } from '@/lib/githubContent'

const ALLOWED_EXTENSIONS = new Set(['avif', 'gif', 'jpeg', 'jpg', 'png', 'webp'])

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getSafeFileName(originalName: string) {
  const trimmed = originalName.trim()
  const lastDot = trimmed.lastIndexOf('.')
  const rawName = lastDot > 0 ? trimmed.slice(0, lastDot) : trimmed
  const extension = lastDot > 0 ? trimmed.slice(lastDot + 1).toLowerCase() : ''

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return null
  }

  const safeName = slugify(rawName) || 'homepage-image'

  return `${Date.now()}-${safeName}.${extension}`
}

export async function POST(request: NextRequest) {
  const unauthorizedResponse = await requireAdminSession(request)

  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const body = await request.json() as {
      base64?: string
      fileName?: string
    }
    const fileName = body.fileName ?? ''
    const base64 = body.base64 ?? ''
    const safeFileName = getSafeFileName(fileName)

    if (!safeFileName || !base64) {
      return NextResponse.json(
        { error: 'Upload a JPG, PNG, WEBP, GIF, or AVIF image.' },
        { status: 400 },
      )
    }

    const repoPath = `public/images/admin/${safeFileName}`

    await uploadBase64File(repoPath, base64, `admin: upload homepage image ${safeFileName}`)

    return NextResponse.json({
      path: `/images/admin/${safeFileName}`,
      success: true,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image upload failed.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
