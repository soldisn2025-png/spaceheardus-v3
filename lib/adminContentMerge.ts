import type { EventsContent } from '@/lib/eventsContent'
import type { GalleryPageContent } from '@/lib/galleryPageContent'
import type { SiteContent } from '@/lib/siteContent'

type MergeResult<T> = {
  conflicts: string[]
  content: T
}

type MergeFieldResult<T> = {
  conflict: boolean
  value: T
}

type SupportedAdminContent = EventsContent | GalleryPageContent | SiteContent
type AdminContentFile = 'events' | 'gallery-page' | 'site-content'

function mergeScalar<T>(base: T, local: T, remote: T): MergeFieldResult<T> {
  if (Object.is(local, remote)) {
    return { conflict: false, value: local }
  }

  if (Object.is(remote, base)) {
    return { conflict: false, value: local }
  }

  if (Object.is(local, base)) {
    return { conflict: false, value: remote }
  }

  return { conflict: true, value: local }
}

function mergeObjectFields<T extends Record<string, unknown>>(
  base: T,
  local: T,
  remote: T,
  path: string,
) {
  const conflicts: string[] = []
  const content = { ...remote } as T

  for (const key of Object.keys(local) as Array<keyof T>) {
    const fieldPath = `${path}.${String(key)}`
    const mergedField = mergeScalar(base[key], local[key], remote[key])

    content[key] = mergedField.value

    if (mergedField.conflict) {
      conflicts.push(fieldPath)
    }
  }

  return { conflicts, content }
}

function haveSameIds(items: Array<{ id: string }>, otherItems: Array<{ id: string }>) {
  if (items.length !== otherItems.length) {
    return false
  }

  return items.every((item, index) => item.id === otherItems[index]?.id)
}

function mergeKeyedArray<T extends Record<string, unknown> & { id: string }>(
  base: T[],
  local: T[],
  remote: T[],
  path: string,
) {
  const baseById = new Map(base.map((item) => [item.id, item]))
  const localById = new Map(local.map((item) => [item.id, item]))
  const remoteById = new Map(remote.map((item) => [item.id, item]))

  let orderedIds: string[]

  if (haveSameIds(local, remote)) {
    orderedIds = local.map((item) => item.id)
  } else if (haveSameIds(local, base)) {
    orderedIds = remote.map((item) => item.id)
  } else if (haveSameIds(remote, base)) {
    orderedIds = local.map((item) => item.id)
  } else {
    return {
      conflicts: [`${path} order`],
      content: local,
    }
  }

  const mergedItems: T[] = []
  const conflicts: string[] = []

  for (const id of orderedIds) {
    const baseItem = baseById.get(id)
    const localItem = localById.get(id)
    const remoteItem = remoteById.get(id)

    if (!localItem && remoteItem) {
      if (!baseItem) {
        mergedItems.push(remoteItem)
        continue
      }

      if (remoteItem === baseItem) {
        continue
      }

      conflicts.push(`${path}.${id} deletion`)
      continue
    }

    if (localItem && !remoteItem) {
      if (!baseItem) {
        mergedItems.push(localItem)
        continue
      }

      if (localItem === baseItem) {
        continue
      }

      conflicts.push(`${path}.${id} deletion`)
      mergedItems.push(localItem)
      continue
    }

    if (!localItem || !remoteItem) {
      continue
    }

    if (!baseItem) {
      const sameNewItem = JSON.stringify(localItem) === JSON.stringify(remoteItem)

      mergedItems.push(sameNewItem ? localItem : localItem)

      if (!sameNewItem) {
        conflicts.push(`${path}.${id} addition`)
      }

      continue
    }

    const mergedItem = mergeObjectFields(baseItem, localItem, remoteItem, `${path}.${id}`)

    mergedItems.push(mergedItem.content)
    conflicts.push(...mergedItem.conflicts)
  }

  return {
    conflicts,
    content: mergedItems,
  }
}

function mergeSiteContent(base: SiteContent, local: SiteContent, remote: SiteContent): MergeResult<SiteContent> {
  const site = mergeObjectFields(base.site, local.site, remote.site, 'site')
  const home = mergeObjectFields(base.home, local.home, remote.home, 'home')
  const settings = mergeObjectFields(base.settings, local.settings, remote.settings, 'settings')

  return {
    conflicts: [...site.conflicts, ...home.conflicts, ...settings.conflicts],
    content: {
      site: site.content,
      home: home.content,
      settings: settings.content,
    },
  }
}

function mergeEventsContent(base: EventsContent, local: EventsContent, remote: EventsContent): MergeResult<EventsContent> {
  const page = mergeObjectFields(base.page, local.page, remote.page, 'page')
  const events = mergeKeyedArray(base.events, local.events, remote.events, 'events')

  return {
    conflicts: [...page.conflicts, ...events.conflicts],
    content: {
      page: page.content,
      events: events.content,
    },
  }
}

function mergeGalleryPageContent(base: GalleryPageContent, local: GalleryPageContent, remote: GalleryPageContent): MergeResult<GalleryPageContent> {
  const title = mergeScalar(base.title, local.title, remote.title)
  const subtitle = mergeScalar(base.subtitle, local.subtitle, remote.subtitle)
  const videos = mergeKeyedArray(base.videos, local.videos, remote.videos, 'videos')
  const photos = mergeKeyedArray(base.photos, local.photos, remote.photos, 'photos')
  const conflicts = [...videos.conflicts, ...photos.conflicts]

  if (title.conflict) {
    conflicts.push('title')
  }

  if (subtitle.conflict) {
    conflicts.push('subtitle')
  }

  return {
    conflicts,
    content: {
      title: title.value,
      subtitle: subtitle.value,
      videos: videos.content,
      photos: photos.content,
    },
  }
}

export function mergeAdminContent<T extends SupportedAdminContent>(
  file: AdminContentFile,
  base: T,
  local: T,
  remote: T,
): MergeResult<T> {
  if (file === 'site-content') {
    return mergeSiteContent(base as SiteContent, local as SiteContent, remote as SiteContent) as MergeResult<T>
  }

  if (file === 'gallery-page') {
    return mergeGalleryPageContent(
      base as GalleryPageContent,
      local as GalleryPageContent,
      remote as GalleryPageContent,
    ) as MergeResult<T>
  }

  return mergeEventsContent(base as EventsContent, local as EventsContent, remote as EventsContent) as MergeResult<T>
}
