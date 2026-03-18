import { NextRequest, NextResponse } from 'next/server'

const GITHUB_REPO = process.env.GITHUB_REPO || 'soldisn2025-png/spaceheardus-v3'
const GITHUB_BRANCH = 'main'

async function githubFetch(path: string, options: RequestInit = {}) {
  const token = process.env.GITHUB_TOKEN
  return fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers ?? {}),
    },
  })
}

async function getFile(path: string) {
  const res = await githubFetch(path)
  if (!res.ok) return null
  const data = await res.json() as { content: string; sha: string }
  return {
    content: JSON.parse(atob(data.content.replace(/\n/g, ''))),
    sha: data.sha,
  }
}

async function putFile(path: string, content: unknown, sha: string, message: string) {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2) + '\n')))
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, content: encoded, sha, branch: GITHUB_BRANCH }),
  })
  return res.ok
}

export async function GET() {
  const [siteContent, galleryPage] = await Promise.all([
    getFile('content/site-content.json'),
    getFile('content/gallery-page.json'),
  ])
  return NextResponse.json({ siteContent, galleryPage })
}

export async function PUT(request: NextRequest) {
  const body = await request.json() as { file: string; content: unknown; sha: string }
  const { file, content, sha } = body

  const allowedFiles: Record<string, string> = {
    'site-content': 'content/site-content.json',
    'gallery-page': 'content/gallery-page.json',
  }

  const path = allowedFiles[file]
  if (!path) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
  }

  const ok = await putFile(path, content, sha, `admin: update ${file}`)
  if (!ok) {
    return NextResponse.json({ error: 'GitHub update failed — check GITHUB_TOKEN' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
