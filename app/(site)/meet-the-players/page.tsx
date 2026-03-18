import Image from 'next/image'
import { teamMembers } from '@/content/team'

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
            Three talented young musicians united by a passion for music and making a difference.
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
                <p className="text-stone-600 font-inter text-lg leading-relaxed">{player.shortBio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
