import { EventHighlights } from '@/components/sections/EventHighlights'
import { events } from '@/content/events'
import { links } from '@/content/links'

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-300 text-amber-800 text-xs font-semibold tracking-widest uppercase mb-6 bg-white/70">
            Schedule
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl text-stone-900 font-bold mb-4">Upcoming Events</h1>
          <p className="text-stone-600 font-inter text-lg max-w-xl mx-auto">Come see us perform live and support our mission.</p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6">
            {events.map((event) => (
              <div key={event.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 rounded-2xl bg-white border border-amber-100 shadow-sm">
                <div className="flex-shrink-0 w-24 h-20 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-center">
                  <span className="text-amber-700 font-bold text-sm font-inter leading-tight">{event.date}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-playfair text-xl text-stone-900 font-bold mb-1">{event.title}</h3>
                  <p className="text-amber-700 text-sm font-inter mb-1">{event.time}</p>
                  <p className="text-stone-600 text-sm font-inter mb-2">{event.location}</p>
                  <p className="text-stone-600 font-inter text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>

          <EventHighlights />
        </div>
      </section>

      <section className="py-16 px-6 text-center border-t border-amber-200">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-3xl text-stone-900 font-bold mb-4">Want to Help at Our Next Event?</h2>
          <p className="text-stone-600 font-inter mb-8">We are always looking for volunteers.</p>
          <a
            href={links.volunteer}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/25"
          >
            Volunteer Form
          </a>
        </div>
      </section>
    </div>
  )
}
