const DEFAULT_GITHUB_BRANCH = 'main'
const DEFAULT_GITHUB_REPO = 'soldisn2025-png/spaceheardus-v3'
const GITHUB_USER_AGENT = 'SpaceHeardUsAdmin/1.0 (+https://spaceheardus.org)'

type GitHubFileResponse = {
  content: string
  message?: string
  sha: string
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function decodeBase64(value: string) {
  const binary = atob(value.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))

  return new TextDecoder().decode(bytes)
}

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN ?? ''
  const repo = process.env.GITHUB_REPO ?? DEFAULT_GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH ?? DEFAULT_GITHUB_BRANCH

  if (!token) {
    throw new Error('Missing GITHUB_TOKEN env var')
  }

  return { branch, repo, token }
}

async function readGitHubError(response: Response) {
  const bodyText = await response.text()

  try {
    const data = JSON.parse(bodyText) as { message?: string }
    return data.message ?? `GitHub request failed with status ${response.status}`
  } catch {
    if (bodyText.trim()) {
      return bodyText.trim()
    }

    return `GitHub request failed with status ${response.status}`
  }
}

async function githubRequest(path: string, init: RequestInit = {}) {
  const { branch, repo, token } = getGitHubConfig()
  const url = `https://api.github.com/repos/${repo}/contents/${path}${init.method === 'PUT' ? '' : `?ref=${encodeURIComponent(branch)}`}`

  return fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': GITHUB_USER_AGENT,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers ?? {}),
    },
  })
}

export async function getJsonFile<T>(path: string) {
  const response = await githubRequest(path)

  if (!response.ok) {
    throw new Error(await readGitHubError(response))
  }

  const data = await response.json() as GitHubFileResponse

  return {
    content: JSON.parse(decodeBase64(data.content)) as T,
    sha: data.sha,
  }
}

export async function updateJsonFile(path: string, content: unknown, sha: string, message: string) {
  const { branch } = getGitHubConfig()
  const response = await githubRequest(path, {
    method: 'PUT',
    body: JSON.stringify({
      branch,
      content: encodeBase64(`${JSON.stringify(content, null, 2)}\n`),
      message,
      sha,
    }),
  })

  if (!response.ok) {
    throw new Error(await readGitHubError(response))
  }
}

export async function uploadBase64File(path: string, base64Content: string, message: string) {
  const { branch } = getGitHubConfig()
  const response = await githubRequest(path, {
    method: 'PUT',
    body: JSON.stringify({
      branch,
      content: base64Content,
      message,
    }),
  })

  if (!response.ok) {
    throw new Error(await readGitHubError(response))
  }
}
