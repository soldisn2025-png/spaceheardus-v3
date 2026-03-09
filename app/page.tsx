import Image from 'next/image'
import Link from 'next/link'
import siteContent from '@/content/site-content.json'
import { teamMembers } from '@/content/team'
import { links } from '@/content/links'

function toYouTubeEmbed(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  const videoId = match?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

export default function HomePage() {
  const { home } = siteContent
  const homeVideo = toYouTubeEmbed(home.featuredVideoUrl)

  return (
    <>
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/group.jpg" alt="Space Heard Us" fill className="object-cover object-top opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
        </div>

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-400/40 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-8">
            Youth Nonprofit Band
          </span>
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            Music That
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Moves Hearts</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-inter leading-relaxed">{home.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schedule"
              className="px-8 py-4 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              View Schedule
            </Link>
            <Link href="/team" className="px-8 py-4 border border-white/20 text-white rounded-full hover:bg-white/5 transition-all">
              Meet the Players
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">{home.missionTitle}</h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-8 rounded-full" />
          <p className="text-white/60 text-lg md:text-xl leading-relaxed font-inter">{home.missionText}</p>
        </div>
      </section>

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
                  <Image src={player.image} alt={player.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-playfair text-xl font-bold mb-1">{player.name}</h3>
                <p className="text-amber-400 text-sm font-semibold font-inter mb-3">{player.role}</p>
                <p className="text-white/50 text-sm font-inter leading-relaxed px-4 line-clamp-3">{player.shortBio}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/team" className="inline-block px-8 py-3 border border-white/20 rounded-full text-white/70 hover:text-white hover:border-white/40 transition-all font-inter text-sm">
              Read Their Full Stories
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6 text-center">{home.featuredVideoTitle}</h2>
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 aspect-video bg-black">
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
              <div className="absolute inset-0 flex items-center justify-center text-white/50">Set a valid YouTube URL in content/site-content.json</div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">{home.volunteerTitle}</h2>
          <p className="text-white/60 mb-10 font-inter text-lg">{home.volunteerText}</p>
          <a
            href={links.volunteer}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
          >
            Sign Up to Volunteer
          </a>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-center">{home.contactTitle}</h2>
          <p className="text-white/60 font-inter text-center mb-10">{home.contactText}</p>

          <form action={links.contactForm} method="POST" className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Your name"
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-amber-400"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-amber-400"
            />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Your message"
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="mt-2 inline-flex justify-center px-6 py-3 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-300 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
