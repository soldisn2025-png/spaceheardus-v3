export const GALLERY_PAGE_CONTENT_PATH = 'content/gallery-page.json'

export type GalleryVideo = {
  id: string
  title: string
  url: string
}

export type GalleryPhoto = {
  id: string
  src: string
  alt: string
  caption: string
}

export type GalleryPageContent = {
  title: string
  subtitle: string
  videos: GalleryVideo[]
  photos: GalleryPhoto[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalizeGalleryVideo(value: unknown, index: number): GalleryVideo {
  const video = isRecord(value) ? value : {}

  return {
    id: readString(video.id, `video-${index + 1}`),
    title: readString(video.title),
    url: readString(video.url),
  }
}

function normalizeGalleryPhoto(value: unknown, index: number): GalleryPhoto {
  const photo = isRecord(value) ? value : {}

  return {
    id: readString(photo.id, `photo-${index + 1}`),
    src: readString(photo.src),
    alt: readString(photo.alt),
    caption: readString(photo.caption),
  }
}

export function normalizeGalleryPageContent(value: unknown): GalleryPageContent {
  const root = isRecord(value) ? value : {}
  const videos = Array.isArray(root.videos) ? root.videos : []
  const photos = Array.isArray(root.photos) ? root.photos : []

  return {
    title: readString(root.title, 'Gallery'),
    subtitle: readString(root.subtitle, 'Photos and videos from our performances and community moments.'),
    videos: videos.map((video, index) => normalizeGalleryVideo(video, index)),
    photos: photos.map((photo, index) => normalizeGalleryPhoto(photo, index)),
  }
}
