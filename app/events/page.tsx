import Image from 'next/image'
import siteContent from '@/content/site-content.json'

export default function EventsPage() {
  const { events } = siteContent

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-400/40 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-6">
            Live Performances
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-4">{events.pageTitle}</h1>
          <p className="text-white/50 font-inter text-lg max-w-xl mx-auto">{events.pageSubtitle}</p>
        </div>
      </section>

      {/* Group Photo */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden aspect-video ring-1 ring-white/10">
            <Image
              src="/images/group.jpg"
              alt="Space Heard Us group"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-playfair text-2xl font-bold">{events.groupPhotoCaption}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Videos */}
      <section className="py-16 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-4">Watch Our Performances</h2>
          <p className="text-white/50 font-inter text-center mb-14">Experience the music that moves hearts</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.videos.map((video) => (
              <div key={video.id} className="group">
                <div className="relative rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 group-hover:ring-amber-400/30 transition-all">
                  <video
                    controls
                    preload="metadata"
                    poster={video.poster}
                    className="w-full aspect-video object-cover"
                  >
                    <source src={video.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="mt-4 px-1">
                  <h3 className="font-playfair text-xl font-bold mb-1">{video.title}</h3>
                  <p className="text-white/50 font-inter text-sm">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Video placeholder note */}
          <div className="mt-10 p-4 rounded-xl border border-dashed border-white/20 text-center text-white/40 text-sm font-inter">
            📹 To add your performance videos: place MP4 files in <code className="text-amber-400/70">/public/videos/</code> named <code className="text-amber-400/70">performance1.mp4</code> and <code className="text-amber-400/70">performance2.mp4</code>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-4">Upcoming Events</h2>
          <p className="text-white/50 font-inter text-center mb-14">Come see us perform live!</p>

          <div className="grid gap-6">
            {events.upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-all"
              >
                <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-amber-400/10 border border-amber-400/20 flex flex-col items-center justify-center text-center">
                  <span className="text-amber-400 font-bold text-lg font-inter leading-tight">
                    {event.date.split(' ')[1].replace(',', '')}
                  </span>
                  <span className="text-amber-400/60 text-xs font-inter">
                    {event.date.split(' ')[0].slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-playfair text-xl font-bold mb-1">{event.title}</h3>
                  <p className="text-amber-400/80 text-sm font-inter mb-2">📍 {event.location}</p>
                  <p className="text-white/50 font-inter text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-16 px-6 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold mb-4">Want to Help at Our Next Event?</h2>
          <p className="text-white/50 font-inter mb-8">We're always looking for passionate volunteers to help make our performances possible.</p>
          <a
            href="https://www.signupgenius.com/PLACEHOLDER"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
          >
            Sign Up to Volunteer ↗
          </a>
        </div>
      </section>
    </div>
  )
}
