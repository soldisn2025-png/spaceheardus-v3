import { EventHighlights } from '@/components/sections/EventHighlights'
import eventsContentJson from '@/content/events.json'
import { events } from '@/content/events'
import { links } from '@/content/links'
import { normalizeEventsContent } from '@/lib/eventsContent'

export default function EventsPage() {
  const scheduleContent = normalizeEventsContent(eventsContentJson)

  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-300 text-amber-800 text-xs font-semibold tracking-widest uppercase mb-6 bg-white/70">
            {scheduleContent.page.badge}
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl text-stone-900 font-bold mb-4">{scheduleContent.page.title}</h1>
          <p className="text-stone-600 font-inter text-lg max-w-2xl mx-auto">
            {scheduleContent.page.intro}
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 rounded-3xl border border-amber-200 bg-gradient-to-r from-[#fff8db] via-white to-[#fff2c7] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">{scheduleContent.page.rehearsalLabel}</p>
            <h2 className="mt-3 font-playfair text-3xl text-stone-900 font-bold">{scheduleContent.page.rehearsalTitle}</h2>
            <p className="mt-2 text-lg font-semibold text-stone-800">{scheduleContent.page.rehearsalTime}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-playfair text-3xl text-stone-900 font-bold mb-2">{scheduleContent.page.performancesTitle}</h2>
            <p className="text-stone-600 font-inter">{scheduleContent.page.performancesIntro}</p>
          </div>

          <div className="grid gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 rounded-2xl bg-white border border-amber-100 shadow-sm"
              >
                <div className="flex-shrink-0 w-28 h-20 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-center px-2">
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
          <h2 className="font-playfair text-3xl text-stone-900 font-bold mb-4">{scheduleContent.page.volunteerTitle}</h2>
          <p className="text-stone-600 font-inter mb-8">{scheduleContent.page.volunteerText}</p>
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
