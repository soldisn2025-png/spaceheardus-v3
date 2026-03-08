import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const contentPath = path.join(process.cwd(), 'content', 'site-content.json')

export async function GET() {
  try {
    const content = fs.readFileSync(contentPath, 'utf-8')
    return NextResponse.json(JSON.parse(content))
  } catch {
    return NextResponse.json({ error: 'Could not read content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    fs.writeFileSync(contentPath, JSON.stringify(body, null, 2), 'utf-8')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Could not save content' }, { status: 500 })
  }
}
