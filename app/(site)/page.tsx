import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ContactForm } from '@/components/forms/ContactForm'
import { getLiveSiteContent, getLiveTeamMembers } from '@/lib/liveContent'

export const metadata: Metadata = {
  title: 'Space Heard Us | Inclusive Youth Nonprofit Band in Fairfax, VA',
  description:
    'Space Heard Us is an inclusive youth nonprofit band in Fairfax, Virginia. Eric and Kaden perform at churches, hospitals, daycares, and community events across Northern Virginia.',
  alternates: {
    canonical: 'https://spaceheardus.org',
  },
}

const BRAND_LOGO = '/images/branding/yellow-logo.png'

const TEAM_IMAGE_OVERRIDES: Record<string, string> = {
  'courtney-lee': '/images/team/courtney-lee-2026.jpeg',
  'eric-kim': '/images/team/eric-kim-2026.jpg',
  'kaden-joo': '/images/team/kaden-joo-2026.jpeg',
}

const HERO_PHOTOS = [
  {
    alt: 'Space Heard Us members smiling together in front of holiday lights.',
    caption: 'Joyful, welcoming performances',
    className: 'col-span-2 row-span-2',
    sizes: '(min-width: 1024px) 34vw, 100vw',
    src: '/images/home/group-picture.jpg',
  },
  {
    alt: 'A Space Heard Us performance on stage during a holiday program.',
    caption: 'Community concerts',
    className: 'row-span-2',
    sizes: '(min-width: 1024px) 18vw, 50vw',
    src: '/images/home/winter-performance.jpg',
  },
  {
    alt: 'Three young musicians performing together with a piano and violin.',
    caption: 'Ensemble moments',
    className: '',
    sizes: '(min-width: 1024px) 16vw, 50vw',
    src: '/images/home/holiday-trio.jpg',
  },
  {
    alt: 'A violin and vocal performance in a recital room.',
    caption: 'Music in every setting',
    className: '',
    sizes: '(min-width: 1024px) 16vw, 50vw',
    src: '/images/home/rehearsal-duo.png',
  },
]

const STORY_PHOTOS = [
  {
    alt: 'A Space Heard Us performance in a church or community hall.',
    caption: 'Sharing music with the community',
    src: '/images/home/performance-stage.jpg',
  },
  {
    alt: 'A young musician performing piano in a recital room.',
    caption: 'Building confidence through performance',
    src: '/images/home/recital-room.png',
  },
]

const PERFORMANCE_FEATURE = {
  alt: 'A holiday performance by Space Heard Us on a decorated stage.',
  copy:
    'From churches to community halls, each performance is designed to feel warm, inviting, and full of heart.',
  label: 'Featured moment',
  src: '/images/home/winter-performance.jpg',
  title: 'Music that meets people where they are',
}

const PERFORMANCE_MOMENTS = [
  {
    alt: 'Courtney and Eric performing together during a recital.',
    copy: 'Small settings let every audience member feel close to the music and the story behind it.',
    src: '/images/home/rehearsal-duo.png',
    title: 'Intimate recitals',
  },
  {
    alt: 'Young performers sharing a trio performance with piano and violin.',
    copy: 'Each performance creates room for confidence, collaboration, and delight.',
    src: '/images/home/holiday-trio.jpg',
    title: 'Growing together',
  },
]

const IMPACT_POINTS = ['Sensory-friendly spirit', 'Youth-led mission', 'Performances across Northern Virginia']

const STORY_STATS = [
  { label: 'Who we serve', value: 'Churches, hospitals, daycares, and community events' },
  { label: 'What we believe', value: 'Every child deserves to be seen, valued, and heard' },
  { label: 'What people feel', value: 'Warmth, hope, and connection through music' },
]

const VOLUNTEER_ROLES = ['Event setup and welcome', 'Photography and media support', 'Encouragement for families and guests']

function toYouTubeEmbed(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  const videoId = match?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

function getVolunteerHref(url: string) {
  if (!url || url.includes('your-actual-form')) {
    return '/#contact'
  }

  return url
}

function isExternalLink(url: string) {
  return /^https?:\/\//i.test(url)
}

export default async function HomePage() {
  const [{ home, settings }, teamMembers] = await Promise.all([getLiveSiteContent(), getLiveTeamMembers()])
  const homeVideo = toYouTubeEmbed(home.featuredVideoUrl)
  const volunteerHref = getVolunteerHref(settings.volunteerFormUrl)
  const volunteerIsExternal = isExternalLink(volunteerHref)

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--brand-yellow)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.3),transparent_24%)]" />
        <div className="absolute left-[-6rem] top-14 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-0 right-[-5rem] h-72 w-72 rounded-full bg-[#f0b839]/25 blur-3xl" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:px-10 xl:py-24">
          <div className="relative z-10">
            <span className="inline-flex rounded-full border border-black/10 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-800">
              Youth nonprofit band | Northern Virginia
            </span>

            <div className="relative mb-8 mt-6 flex w-full max-w-[17rem] items-center justify-center overflow-hidden rounded-[2rem] border border-black/10 bg-[#fff7dc] p-4 shadow-[0_24px_60px_rgba(92,69,8,0.18)]">
              <div className="relative aspect-square w-full">
                <Image
                  src={BRAND_LOGO}
                  alt="Space Heard Us logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(min-width: 1024px) 18rem, 14rem"
                />
              </div>
            </div>

            <h1 className="max-w-3xl font-playfair text-5xl font-bold leading-[0.95] text-stone-950 sm:text-6xl lg:text-7xl">
              {home.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-800 sm:text-xl">{home.heroSubtitle}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Request a Performance
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/70 px-8 py-4 text-sm font-semibold text-stone-900 transition hover:bg-white"
              >
                See the Gallery
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {IMPACT_POINTS.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-medium text-stone-800"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[180px] lg:auto-rows-[170px]">
              {HERO_PHOTOS.map((photo, index) => (
                <figure
                  key={photo.src}
                  className={`group relative overflow-hidden rounded-[1.75rem] border border-white/55 bg-white/25 shadow-[0_18px_45px_rgba(85,60,11,0.15)] ${photo.className}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority={index < 2}
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes={photo.sizes}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 p-4 text-sm font-semibold text-white sm:text-base">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="story" className="border-y border-black/5 bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:px-10">
          <div>
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-900">
              Our story
            </span>
            <h2 className="mt-6 max-w-2xl font-playfair text-4xl font-bold text-stone-950 sm:text-5xl">
              {home.missionTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">{home.missionText}</p>

            <div className="mt-10 grid gap-4">
              {STORY_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.5rem] border border-stone-200 bg-[var(--section-cream)] p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{stat.label}</p>
                  <p className="mt-2 text-base font-medium leading-7 text-stone-800">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {STORY_PHOTOS.map((photo, index) => (
              <figure
                key={photo.src}
                className={`relative overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${
                  index === 0 ? 'sm:col-span-2 aspect-[16/10]' : 'aspect-[4/5]'
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes={index === 0 ? '(min-width: 1024px) 38vw, 100vw' : '(min-width: 1024px) 18vw, 50vw'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 p-4 text-sm font-semibold text-white">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--section-apricot)] px-6 py-20">
        <div className="mx-auto max-w-7xl lg:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
              Meet the musicians
            </span>
            <h2 className="mt-6 font-playfair text-4xl font-bold text-stone-950 sm:text-5xl">
              Three young musicians, one shared mission
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-700">
              These are the young artists behind Space Heard Us. Their performances are full of skill, sincerity, and
              the kind of joy that invites people in.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {teamMembers.map((player) => {
              const playerImage = TEAM_IMAGE_OVERRIDES[player.id] ?? player.image

              return (
                <article
                  key={player.id}
                  className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.07)]"
                >
                  <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-stone-100">
                    <Image
                      src={playerImage}
                      alt={player.name}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1024px) 24vw, (min-width: 768px) 30vw, 100vw"
                    />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">{player.role}</p>
                  <h3 className="mt-3 font-playfair text-3xl font-bold text-stone-950">{player.name}</h3>
                  <p className="mt-4 text-base leading-7 text-stone-700">{player.shortBio}</p>
                </article>
              )
            })}
          </div>

          <div className="mt-10">
            <Link
              href="/team"
              className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
            >
              Read their full stories
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--section-blue)] px-6 py-20">
        <div className="mx-auto max-w-7xl lg:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
              Performance moments
            </span>
            <h2 className="mt-6 font-playfair text-4xl font-bold text-stone-950 sm:text-5xl">
              A landing page filled with the faces and moments that matter
            </h2>
            <p className="mt-5 text-lg leading-8 text-stone-700">
              Their music belongs front and center, so the home page now opens with real performances, real connection,
              and the people who make Space Heard Us special.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <article className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/85 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src={PERFORMANCE_FEATURE.src}
                  alt={PERFORMANCE_FEATURE.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">{PERFORMANCE_FEATURE.label}</p>
                <h3 className="mt-3 font-playfair text-3xl font-bold text-stone-950">{PERFORMANCE_FEATURE.title}</h3>
                <p className="mt-4 text-base leading-7 text-stone-700">{PERFORMANCE_FEATURE.copy}</p>
              </div>
            </article>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {PERFORMANCE_MOMENTS.map((moment) => (
                <article
                  key={moment.title}
                  className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/85 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={moment.src}
                      alt={moment.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-playfair text-2xl font-bold text-stone-950">{moment.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-stone-700">{moment.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="volunteer" className="bg-[var(--section-green)] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-10">
          <div>
            <span className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
              {home.featuredVideoTitle}
            </span>
            <h2 className="mt-6 font-playfair text-4xl font-bold text-stone-950 sm:text-5xl">
              Watch Space Heard Us in motion
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
              Video helps families, volunteers, and community partners feel the heart behind every performance.
            </p>

            <div className="relative mt-8 aspect-video overflow-hidden rounded-[2rem] border border-black/10 bg-stone-950 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              {homeVideo ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={homeVideo}
                  title="Space Heard Us featured performance"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/70">
                  Add a valid YouTube link in content/site-content.json to show a featured performance here.
                </div>
              )}
            </div>
          </div>

          <div className="self-center rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-900">
              Volunteer
            </span>
            <h2 className="mt-6 font-playfair text-4xl font-bold text-stone-950">{home.volunteerTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-stone-700">{home.volunteerText}</p>

            <div className="mt-8 grid gap-3">
              {VOLUNTEER_ROLES.map((role) => (
                <div
                  key={role}
                  className="rounded-[1.25rem] border border-stone-200 bg-[var(--section-cream)] px-4 py-4 text-sm font-medium text-stone-800"
                >
                  {role}
                </div>
              ))}
            </div>

            <div className="mt-8">
              {volunteerIsExternal ? (
                <a
                  href={volunteerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-stone-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Sign up to volunteer
                </a>
              ) : (
                <Link
                  href={volunteerHref}
                  className="inline-flex items-center rounded-full bg-stone-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Ask about volunteering
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[var(--section-cream)] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-10">
          <div>
            <span className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
              Contact
            </span>
            <h2 className="mt-6 font-playfair text-4xl font-bold text-stone-950 sm:text-5xl">{home.contactTitle}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-700">{home.contactText}</p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[1.5rem] border border-black/10 bg-white/75 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Book a performance</p>
                <p className="mt-2 text-base leading-7 text-stone-800">
                  Invite the band to a church, school, community event, hospital, or family-friendly gathering.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-black/10 bg-white/75 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Partner with us</p>
                <p className="mt-2 text-base leading-7 text-stone-800">
                  Reach out for collaborations, support, donations, or ways to help Space Heard Us grow.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
