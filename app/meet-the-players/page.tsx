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
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-400/40 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-6">
            The Musicians
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-4">Meet the Players</h1>
          <p className="text-white/50 font-inter text-lg max-w-xl mx-auto">
            Three talented young musicians united by a passion for music and making a difference.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-20">
          {teamMembers.map((player, index) => (
            <div
              key={player.id}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
            >
              <div className="flex-shrink-0">
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden ring-1 ring-white/10">
                  <Image src={player.image} alt={player.name} fill className="object-cover object-top" />
                  <div className="absolute top-4 right-4 bg-[#0a0a0f]/80 backdrop-blur rounded-full px-3 py-1.5 text-xs font-semibold">
                    {instruments[player.id] ?? 'Band'}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {index === 0 && (
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold tracking-wider uppercase mb-4">
                    Band Leader
                  </span>
                )}
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-2">{player.name}</h2>
                <p className="text-amber-400 font-semibold font-inter mb-6">{player.role}</p>
                <div className="w-12 h-0.5 bg-amber-400/50 mb-6 rounded-full" />
                <p className="text-white/65 font-inter text-lg leading-relaxed">{player.shortBio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
