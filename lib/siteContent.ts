export const DEFAULT_HERO_IMAGE = '/images/group.jpg'
export const SITE_CONTENT_PATH = 'content/site-content.json'

export type SiteContent = {
  site: {
    description: string
    logo: string
    name: string
    tagline: string
  }
  home: {
    contactText: string
    contactTitle: string
    featuredVideoTitle: string
    featuredVideoUrl: string
    heroImage: string
    heroSubtitle: string
    heroTitle: string
    missionText: string
    missionTitle: string
    volunteerText: string
    volunteerTitle: string
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

export function normalizeSiteContent(value: unknown): SiteContent {
  const root = isRecord(value) ? value : {}
  const site = isRecord(root.site) ? root.site : {}
  const home = isRecord(root.home) ? root.home : {}

  return {
    site: {
      description: readString(site.description),
      logo: readString(site.logo),
      name: readString(site.name),
      tagline: readString(site.tagline),
    },
    home: {
      contactText: readString(home.contactText),
      contactTitle: readString(home.contactTitle),
      featuredVideoTitle: readString(home.featuredVideoTitle),
      featuredVideoUrl: readString(home.featuredVideoUrl),
      heroImage: readString(home.heroImage, DEFAULT_HERO_IMAGE),
      heroSubtitle: readString(home.heroSubtitle),
      heroTitle: readString(home.heroTitle),
      missionText: readString(home.missionText),
      missionTitle: readString(home.missionTitle),
      volunteerText: readString(home.volunteerText),
      volunteerTitle: readString(home.volunteerTitle),
    },
  }
}
