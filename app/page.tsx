import Image from 'next/image'
import Link from 'next/link'
import siteContent from '@/content/site-content.json'
import { teamMembers } from '@/content/team'
import { links } from '@/content/links'

export default function HomePage() {
  const { home } = siteContent

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background group photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/group.jpg"
            alt="Space Heard Us"
            fill
            className="object-cover object-top opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
        </div>

        {/* Decorative glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-fade-up animate-fade-up-delay-1">
            <span className="inline-block px-4 py-1.5 rounded-full border border-amber-400/40 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-8">
              Youth Nonprofit Band
            </span>
          </div>
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 animate-fade-up animate-fade-up-delay-2">
            Music That<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Moves Hearts
            </span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-inter leading-relaxed animate-fade-up animate-fade-up-delay-3">
            {home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-fade-up-delay-4">
            <Link
              href="/schedule"
              className="px-8 py-4 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              Watch Us Perform
            </Link>
            <Link
              href="/team"
              className="px-8 py-4 border border-white/20 text-white rounded-full hover:bg-white/5 transition-all"
            >
              Meet the Players
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs">
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            {home.missionTitle}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-8 rounded-full" />
          <p className="text-white/60 text-lg md:text-xl leading-relaxed font-inter">
            {home.missionText}
          </p>
        </div>
      </section>

      {/* Players Preview */}
      <section className="py-16 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">The Band</h2>
            <p className="text-white/50 font-inter">Three young musicians, one powerful mission</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((player) => (
              <div key={player.id} className="group text-center">
                <div className="relative w-44 h-44 mx-auto mb-5 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-amber-400/50 transition-all duration-300">
                  <Image
                    src={player.image}
                    alt={player.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold mb-1">{player.name}</h3>
                <p className="text-amber-400 text-sm font-semibold font-inter mb-3">{player.role}</p>
                <p className="text-white/50 text-sm font-inter leading-relaxed px-4 line-clamp-3">{player.shortBio}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/team"
              className="inline-block px-8 py-3 border border-white/20 rounded-full text-white/70 hover:text-white hover:border-white/40 transition-all font-inter text-sm"
            >
              Read Their Full Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* Group Photo Feature */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden aspect-video">
            <Image
              src="/images/group.jpg"
              alt="Space Heard Us together"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-playfair text-2xl font-bold">Holiday Concert 2024</p>
              <p className="text-white/60 text-sm font-inter mt-1">Performing for our community with joy and purpose</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            Want to Help?
          </h2>
          <p className="text-white/60 mb-10 font-inter text-lg">
            Join our team of volunteers and be part of something meaningful.
          </p>
          <a
            href={links.volunteer}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
          >
            Sign Up to Volunteer ↗
          </a>
        </div>
      </section>
    </>
  )
}
