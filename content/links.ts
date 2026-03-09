import linksJson from './links.json'

export type SiteLinks = typeof linksJson

export const links = linksJson as SiteLinks
