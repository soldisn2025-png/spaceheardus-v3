export const EVENTS_CONTENT_PATH = 'content/events.json'

export type EventItem = {
  id: string
  title: string
  date: string
  time: string
  location: string
  locationDetail?: string
  description: string
  type: 'performance' | 'rehearsal' | 'community' | 'other'
  rsvpLink?: string
  rsvpLabel?: string
  isComingSoon?: boolean
}

export type EventsContent = {
  page: {
    badge: string
    title: string
    intro: string
    rehearsalLabel: string
    rehearsalTitle: string
    rehearsalTime: string
    performancesTitle: string
    performancesIntro: string
    volunteerTitle: string
    volunteerText: string
  }
  events: EventItem[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function readBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function readEventType(value: unknown): EventItem['type'] {
  return value === 'performance' || value === 'rehearsal' || value === 'community' || value === 'other'
    ? value
    : 'performance'
}

function normalizeEventItem(value: unknown, index: number): EventItem {
  const event = isRecord(value) ? value : {}

  return {
    id: readString(event.id, `event-${index + 1}`),
    title: readString(event.title),
    date: readString(event.date),
    time: readString(event.time),
    location: readString(event.location),
    locationDetail: readString(event.locationDetail),
    description: readString(event.description),
    type: readEventType(event.type),
    rsvpLink: readString(event.rsvpLink),
    rsvpLabel: readString(event.rsvpLabel),
    isComingSoon: readBoolean(event.isComingSoon),
  }
}

export function normalizeEventsContent(value: unknown): EventsContent {
  const root = isRecord(value) ? value : {}
  const page = isRecord(root.page) ? root.page : {}
  const events = Array.isArray(root.events) ? root.events : []

  return {
    page: {
      badge: readString(page.badge, 'Schedule'),
      title: readString(page.title, 'Rehearsals & Events'),
      intro: readString(page.intro, 'Here is our current rehearsal and performance schedule in English.'),
      rehearsalLabel: readString(page.rehearsalLabel, 'Rehearsal Schedule'),
      rehearsalTitle: readString(page.rehearsalTitle, 'Every 2nd and 4th Sunday'),
      rehearsalTime: readString(page.rehearsalTime, '11:15 AM - 12:00 PM'),
      performancesTitle: readString(page.performancesTitle, 'Upcoming Performances'),
      performancesIntro: readString(page.performancesIntro, 'Dates marked as TBD will be updated as details are confirmed.'),
      volunteerTitle: readString(page.volunteerTitle, 'Want to Help at Our Next Event?'),
      volunteerText: readString(page.volunteerText, 'We are always looking for volunteers.'),
    },
    events: events.map((event, index) => normalizeEventItem(event, index)),
  }
}
