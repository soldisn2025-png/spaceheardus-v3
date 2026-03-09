'use client'

import Image from 'next/image'
import { useState } from 'react'
import { eventHighlights } from '@/content/events-media'

export function EventHighlights() {
  const [groupPhotoError, setGroupPhotoError] = useState(false)

  return (
    <section className="mt-16 border-t border-amber-200 pt-16">
      <h2 className="font-playfair text-3xl text-stone-900 font-bold mb-4">Event Highlights</h2>
      <p className="text-stone-600 mb-8 max-w-2xl">
        Add your real group photo at <code className="rounded bg-amber-50 border border-amber-200 px-1 text-sm">public/images/events/group-photo.jpg</code>.
      </p>

      <div className="relative aspect-video max-w-4xl overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
        {!groupPhotoError ? (
          <Image
            src={eventHighlights.groupPhoto.src}
            alt={eventHighlights.groupPhoto.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
            onError={() => setGroupPhotoError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-amber-50 text-stone-500 text-sm p-4 text-center">
            Add group-photo.jpg to public/images/events/
          </div>
        )}

        {eventHighlights.groupPhoto.caption && !groupPhotoError && (
          <p className="absolute bottom-0 left-0 right-0 bg-black/55 text-white text-sm py-2 px-4 text-center">
            {eventHighlights.groupPhoto.caption}
          </p>
        )}
      </div>
    </section>
  )
}
