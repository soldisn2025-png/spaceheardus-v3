import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ContactForm } from '@/components/forms/ContactForm'
import { DEFAULT_HERO_IMAGE } from '@/lib/siteContent'
import { getLiveSiteContent, getLiveTeamMembers } from '@/lib/liveContent'

export const metadata: Metadata = {
  title: 'Space Heard Us | Inclusive Youth Nonprofit Band in Fairfax, VA',
  description:
    'Space Heard Us is an inclusive youth nonprofit band in Fairfax, Virginia. Eric and Kaden — musicians with autism — perform at churches, hospitals, daycares, and community events across Northern Virginia.',
  alternates: {
    canonical: 'https://spaceheardus.org',
  },
}

function toYouTubeEmbed(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  const videoId = match?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

export default async function HomePage() {
  const [{ home, settings }, teamMembers] = await Promise.all([
    getLiveSiteContent(),
    getLiveTeamMembers(),
  ])
  const homeVideo = toYouTubeEmbed(home.featuredVideoUrl)
  const heroImage = home.heroImage || DEFAULT_HERO_IMAGE

  return (
    <>
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45"
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fff8db]/75 via-[#fffaf0]/85 to-[#fffdf6]" />
        </div>

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[640px] h-[640px] bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-300 text-amber-800 text-xs font-semibold tracking-widest uppercase mb-8 bg-white/70">
            Youth Nonprofit Band
          </span>
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-stone-900 font-bold leading-tight mb-6">
            Music That
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-500">Moves Hearts</span>
          </h1>
          <p className="text-stone-700 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-inter leading-relaxed">{home.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schedule"
              className="px-8 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/25"
            >
              View Schedule
            </Link>
            <Link href="/team" className="px-8 py-4 border border-amber-300 text-stone-900 rounded-full hover:bg-amber-50 transition-all">
              Meet the Players
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl text-stone-900 font-bold mb-6">{home.missionTitle}</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mb-8 rounded-full" />
          <p className="text-stone-700 text-lg md:text-xl leading-relaxed font-inter">{home.missionText}</p>
        </div>
      </section>

      <section className="py-16 px-6 border-b border-amber-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl text-stone-900 font-bold mb-3">How Can We Help You?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl text-stone-900 font-bold mb-3">I&apos;m a Parent or Family</h3>
              <p className="text-stone-600 font-inter leading-relaxed mb-6 flex-1">
                Discover how Eric and Kaden — young musicians with autism — are showing what&apos;s possible.
                Find inspiration and connect with our inclusive community in Northern Virginia.
              </p>
              <Link href="/team" className="inline-block px-6 py-3 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-all text-center">
                Meet the Band
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm flex flex-col">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl text-stone-900 font-bold mb-3">Book a Performance</h3>
              <p className="text-stone-600 font-inter leading-relaxed mb-6 flex-1">
                We perform at churches, hospitals, daycares, and community events across Fairfax, VA and
                Northern Virginia. Bring the joy of inclusive music to your venue.
              </p>
              <Link href="/book" className="inline-block px-6 py-3 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-all text-center">
                Request a Performance
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white/70 border-y border-amber-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-playfair text-4xl md:text-5xl text-stone-900 font-bold mb-4">The Band</h2>
            <p className="text-stone-600 font-inter">Three young musicians, one powerful mission</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((player) => (
              <div key={player.id} className="group text-center bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
                <div className="relative w-44 h-44 mx-auto mb-5 rounded-full overflow-hidden ring-2 ring-amber-200 group-hover:ring-amber-400 transition-all duration-300">
                  <Image src={player.image} alt={player.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-playfair text-xl text-stone-900 font-bold mb-1">{player.name}</h3>
                <p className="text-amber-700 text-sm font-semibold font-inter mb-3">{player.role}</p>
                <p className="text-stone-600 text-sm font-inter leading-relaxed px-2 line-clamp-3">{player.shortBio}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/team" className="inline-block px-8 py-3 border border-amber-300 rounded-full text-stone-700 hover:text-stone-900 hover:bg-amber-50 transition-all font-inter text-sm">
              Read Their Full Stories
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl text-stone-900 font-bold mb-6 text-center">{home.featuredVideoTitle}</h2>
          <div className="relative w-full overflow-hidden rounded-3xl border border-amber-200 aspect-video bg-black shadow-sm">
            {homeVideo ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={homeVideo}
                title="Space Heard Us featured performance"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/70">Set a valid YouTube URL in content/site-content.json</div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center border-t border-amber-200 bg-white/60">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl text-stone-900 font-bold mb-6">{home.volunteerTitle}</h2>
          <p className="text-stone-700 mb-10 font-inter text-lg">{home.volunteerText}</p>
          <a
            href={settings.volunteerFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/25"
          >
            Sign Up to Volunteer
          </a>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-amber-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl text-stone-900 font-bold mb-4 text-center">{home.contactTitle}</h2>
          <p className="text-stone-600 font-inter text-center mb-10">{home.contactText}</p>

          <ContactForm />
        </div>
      </section>
    </>
  )
}
