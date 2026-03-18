import Image from 'next/image'
import galleryContent from '@/content/gallery-page.json'

function toYouTubeEmbed(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  const videoId = match?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-6xl text-stone-900 font-bold mb-4">{galleryContent.title}</h1>
          <p className="text-stone-600 text-lg">{galleryContent.subtitle}</p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleryContent.videos.map((video) => {
            const embedUrl = toYouTubeEmbed(video.url)
            return (
              <article key={video.id} className="rounded-2xl border border-amber-100 bg-white overflow-hidden shadow-sm">
                <div className="relative w-full aspect-video bg-black">
                  {embedUrl ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={embedUrl}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm">Invalid YouTube URL</div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-playfair text-2xl text-stone-900 font-bold">{video.title}</h2>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryContent.photos.map((photo) => (
            <figure key={photo.id} className="rounded-2xl overflow-hidden border border-amber-100 bg-white shadow-sm">
              <div className="relative w-full aspect-square">
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
              </div>
              <figcaption className="px-4 py-3 text-sm text-stone-600">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
