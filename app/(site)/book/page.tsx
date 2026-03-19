import type { Metadata } from 'next'
import Link from 'next/link'
import { BookingRequestForm } from '@/components/forms/BookingRequestForm'

export const metadata: Metadata = {
  title: 'Book a Performance | Space Heard Us - Fairfax, VA',
  description:
    'Request a performance from Space Heard Us - an inclusive youth nonprofit band in Fairfax, VA. We perform at churches, hospitals, daycares, and community events across Northern Virginia.',
}

export default function BookPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-300 text-amber-800 text-xs font-semibold tracking-widest uppercase mb-6 bg-white/70">
            Fairfax, VA - Northern Virginia
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl text-stone-900 font-bold mb-4">
            Book a Performance
          </h1>
          <p className="text-stone-600 font-inter text-lg max-w-xl mx-auto">
            Bring the joy of inclusive music to your community. We perform at churches, hospitals, daycares,
            and events across Northern Virginia - free or by donation.
          </p>
        </div>
      </section>

      <section className="pb-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { label: 'Churches & Houses of Worship', desc: 'Special services, holiday events, community gatherings' },
            { label: 'Hospitals & Healthcare', desc: 'Patient care floors, waiting areas, staff appreciation events' },
            { label: 'Daycares & Schools', desc: 'Inclusive education programs, recitals, community days' },
          ].map((venue) => (
            <div key={venue.label} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
              <h3 className="font-playfair text-lg text-stone-900 font-bold mb-2">{venue.label}</h3>
              <p className="text-stone-500 font-inter text-sm">{venue.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-amber-200 p-8 shadow-sm">
            <h2 className="font-playfair text-3xl text-stone-900 font-bold mb-2">Performance Request</h2>
            <p className="text-stone-500 font-inter text-sm mb-8">
              Fill out the form below and we&apos;ll be in touch within a few days.
            </p>

            <BookingRequestForm />
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-amber-50/60 border-t border-amber-200 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-stone-600 font-inter mb-2">
            Have a quick question? Reach us directly at{' '}
            <a href="mailto:hello@spaceheardus.org" className="text-amber-700 font-semibold hover:underline">
              hello@spaceheardus.org
            </a>
          </p>
          <p className="text-stone-500 font-inter text-sm">
            Space Heard Us is based in Fairfax, VA and serves the greater Northern Virginia / DC metro area.
          </p>
          <div className="mt-8">
            <Link href="/team" className="text-stone-500 font-inter text-sm hover:text-stone-700 underline">
              Learn more about our musicians
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
