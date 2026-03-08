import { EventHighlights } from '@/components/sections/EventHighlights'
import { events } from '@/content/events'
import { links } from '@/content/links'

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-400/40 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-6">
            Schedule
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-white/50 font-inter text-lg max-w-xl mx-auto">
            Come see us perform live and support our mission.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-all"
              >
                <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-amber-400/10 border border-amber-400/20 flex flex-col items-center justify-center text-center">
                  <span className="text-amber-400 font-bold text-sm font-inter leading-tight">
                    {event.date}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-playfair text-xl font-bold mb-1">{event.title}</h3>
                  <p className="text-amber-400/80 text-sm font-inter mb-1">{event.time}</p>
                  <p className="text-amber-400/80 text-sm font-inter mb-2">{event.location}</p>
                  <p className="text-white/50 font-inter text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>

          <EventHighlights />
        </div>
      </section>

      <section className="py-16 px-6 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold mb-4">Want to Help at Our Next Event?</h2>
          <p className="text-white/50 font-inter mb-8">We are always looking for volunteers.</p>
          <a
            href={links.volunteer}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
          >
            Volunteer Form
          </a>
        </div>
      </section>
    </div>
  )
}
