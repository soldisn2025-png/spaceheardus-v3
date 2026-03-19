'use client';

import { useState } from 'react';
import Image from 'next/image';
import galleryContentJson from '@/content/gallery-page.json';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CTA } from '@/components/ui/CTA';
import { normalizeGalleryPageContent } from '@/lib/galleryPageContent';

export function GalleryPreview() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const preview = normalizeGalleryPageContent(galleryContentJson).photos.slice(0, 6);

  return (
    <section className="bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Gallery"
          subtitle="Moments from performances and community."
          className="mb-10"
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {preview.map((img) => (
            <button
              key={img.id}
              type="button"
              className="group relative aspect-square overflow-hidden rounded-xl bg-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              onClick={() => setLightbox(img.src)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>
          ))}
        </div>
        <div className="mt-8 text-center">
          <CTA href="/gallery" variant="outline">View full gallery</CTA>
        </div>
      </div>

      {lightbox && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 focus:outline-none"
          onClick={() => setLightbox(null)}
          aria-label="Close"
        >
          <Image src={lightbox} alt="" fill className="object-contain" />
        </button>
      )}
    </section>
  );
}
