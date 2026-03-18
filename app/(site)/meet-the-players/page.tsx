import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { teamMembers } from '@/content/team'

export const metadata: Metadata = {
  title: 'Meet the Band | Space Heard Us — Inclusive Youth Musicians in Fairfax, VA',
  description:
    'Meet Eric Kim and Kaden Joo — young musicians with autism who perform across Northern Virginia — alongside band leader Courtney Lee. Their stories inspire families and communities.',
}

const instruments: Record<string, string> = {
  'courtney-lee': 'Violin',
  'kaden-joo': 'Piano',
  'eric-kim': 'Vocal',
}

export default function MeetThePlayersPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-300 text-amber-800 text-xs font-semibold tracking-widest uppercase mb-6 bg-white/70">
            The Musicians
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl text-stone-900 font-bold mb-4">Meet the Players</h1>
          <p className="text-stone-600 font-inter text-lg max-w-xl mx-auto">
            Three young musicians in Fairfax, VA — united by a passion for music and a mission to show what kids with disabilities can do.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          {teamMembers.map((player, index) => (
            <div
              key={player.id}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 items-center bg-white border border-amber-100 rounded-3xl p-6 md:p-8 shadow-sm`}
            >
              <div className="flex-shrink-0">
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden ring-1 ring-amber-200">
                  <Image src={player.image} alt={player.name} fill className="object-cover object-top" />
                  <div className="absolute top-4 right-4 bg-white/85 backdrop-blur rounded-full px-3 py-1.5 text-xs font-semibold text-stone-700 border border-amber-200">
                    {instruments[player.id] ?? 'Band'}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {index === 0 && (
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold tracking-wider uppercase mb-4">
                    Band Leader
                  </span>
                )}
                <h2 className="font-playfair text-4xl md:text-5xl text-stone-900 font-bold mb-2">{player.name}</h2>
                <p className="text-amber-700 font-semibold font-inter mb-6">{player.role}</p>
                <div className="w-12 h-0.5 bg-amber-400/60 mb-6 rounded-full" />
                <p className="text-stone-600 font-inter text-lg leading-relaxed">
                  {player.extendedStory || player.shortBio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-amber-50/60 border-t border-amber-200 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl text-stone-900 font-bold mb-4">
            Bring Their Story to Your Community
          </h2>
          <p className="text-stone-600 font-inter text-lg mb-8">
            We perform at churches, hospitals, daycares, and community events across Fairfax, VA and Northern Virginia.
          </p>
          <Link
            href="/book"
            className="inline-block px-10 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/25"
          >
            Request a Performance
          </Link>
        </div>
      </section>
    </div>
  )
}
