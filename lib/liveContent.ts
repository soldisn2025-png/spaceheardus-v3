import { cache } from 'react'
import localEventsContent from '@/content/events.json'
import localGalleryPageContent from '@/content/gallery-page.json'
import localLinksContent from '@/content/links.json'
import localSiteContent from '@/content/site-content.json'
import localTeamContent from '@/content/team.json'
import { EVENTS_CONTENT_PATH, normalizeEventsContent, type EventsContent } from '@/lib/eventsContent'
import { GALLERY_PAGE_CONTENT_PATH, normalizeGalleryPageContent, type GalleryPageContent } from '@/lib/galleryPageContent'
import { normalizeSiteContent, SITE_CONTENT_PATH, type SiteContent } from '@/lib/siteContent'

const DEFAULT_GITHUB_BRANCH = 'main'
const DEFAULT_GITHUB_REPO = 'soldisn2025-png/spaceheardus-v3'
const LINKS_CONTENT_PATH = 'content/links.json'
const TEAM_CONTENT_PATH = 'content/team.json'

export type LiveSiteLinks = {
  donate: string
  paypalDonate: string
  social: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
  }
  volunteer: string
  zeffy: string
}

export type LiveTeamMember = {
  extendedStory?: string
  id: string
  image: string
  name: string
  order: number
  role: string
  shortBio: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function getPublicGitHubConfig() {
  return {
    branch: process.env.GITHUB_BRANCH ?? DEFAULT_GITHUB_BRANCH,
    repo: process.env.GITHUB_REPO ?? DEFAULT_GITHUB_REPO,
  }
}

function buildRawGitHubUrl(path: string) {
  const { branch, repo } = getPublicGitHubConfig()
  return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`
}

export function resolveRepoAssetUrl(path: string) {
  if (!path || /^https?:\/\//i.test(path)) {
    return path
  }

  if (path.startsWith('/images/')) {
    return buildRawGitHubUrl(`public${path}`)
  }

  return path
}

async function fetchLiveJson<T>(path: string, fallback: unknown, normalize: (value: unknown) => T) {
  try {
    const response = await fetch(buildRawGitHubUrl(path), {
      cache: 'no-store',
      headers: {
        'User-Agent': 'SpaceHeardUsLiveContent/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Could not load ${path}`)
    }

    return normalize(await response.json())
  } catch {
    return normalize(fallback)
  }
}

function normalizeLinksContent(value: unknown): LiveSiteLinks {
  const root = isRecord(value) ? value : {}
  const social = isRecord(root.social) ? root.social : {}

  return {
    donate: readString(root.donate),
    paypalDonate: readString(root.paypalDonate),
    social: {
      facebook: readString(social.facebook),
      instagram: readString(social.instagram),
      twitter: readString(social.twitter),
      youtube: readString(social.youtube),
    },
    volunteer: readString(root.volunteer),
    zeffy: readString(root.zeffy),
  }
}

function normalizeTeamMembers(value: unknown): LiveTeamMember[] {
  const root = isRecord(value) ? value : {}
  const members = Array.isArray(root.members) ? root.members : []

  return members
    .map((member, index) => {
      const entry = isRecord(member) ? member : {}

      return {
        extendedStory: readString(entry.extendedStory),
        id: readString(entry.id, `member-${index + 1}`),
        image: resolveRepoAssetUrl(readString(entry.image)),
        name: readString(entry.name),
        order: typeof entry.order === 'number' ? entry.order : index + 1,
        role: readString(entry.role),
        shortBio: readString(entry.shortBio),
      }
    })
    .sort((first, second) => first.order - second.order)
}

export const getLiveSiteContent = cache(async (): Promise<SiteContent> => {
  const content = await fetchLiveJson(SITE_CONTENT_PATH, localSiteContent, normalizeSiteContent)

  return {
    ...content,
    home: {
      ...content.home,
      heroImage: resolveRepoAssetUrl(content.home.heroImage),
    },
    site: {
      ...content.site,
      logo: resolveRepoAssetUrl(content.site.logo),
    },
  }
})

export const getLiveEventsContent = cache(async (): Promise<EventsContent> => {
  return fetchLiveJson(EVENTS_CONTENT_PATH, localEventsContent, normalizeEventsContent)
})

export const getLiveGalleryPageContent = cache(async (): Promise<GalleryPageContent> => {
  const content = await fetchLiveJson(GALLERY_PAGE_CONTENT_PATH, localGalleryPageContent, normalizeGalleryPageContent)

  return {
    ...content,
    photos: content.photos.map((photo) => ({
      ...photo,
      src: resolveRepoAssetUrl(photo.src),
    })),
  }
})

export const getLiveLinks = cache(async (): Promise<LiveSiteLinks> => {
  return fetchLiveJson(LINKS_CONTENT_PATH, localLinksContent, normalizeLinksContent)
})

export const getLiveTeamMembers = cache(async (): Promise<LiveTeamMember[]> => {
  return fetchLiveJson(TEAM_CONTENT_PATH, localTeamContent, normalizeTeamMembers)
})
