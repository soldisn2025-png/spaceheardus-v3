import eventsJson from './events.json'
import { type EventItem, normalizeEventsContent } from '@/lib/eventsContent'

export type { EventItem }

export const events = normalizeEventsContent(eventsJson).events
