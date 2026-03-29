import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { getLiveSiteContent } from '@/lib/liveContent'

function getVolunteerHref(url: string) {
  if (!url || url.includes('your-actual-form')) {
    return '/#volunteer'
  }

  return url
}

function isExternalLink(url: string) {
  return /^https?:\/\//i.test(url)
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteContent = await getLiveSiteContent()
  const volunteerHref = getVolunteerHref(siteContent.settings.volunteerFormUrl)
  const volunteerIsExternal = isExternalLink(volunteerHref)

  return (
    <>
      <Header
        logoSrc={siteContent.site.logo}
        siteName={siteContent.site.name}
        siteTagline={siteContent.site.tagline}
        volunteerFormUrl={siteContent.settings.volunteerFormUrl}
      />
      <main className="pt-16">{children}</main>
      <footer className="border-t border-black/10 bg-[#1f1a13] text-stone-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] lg:px-10">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#fff7dc] p-2">
                <Image
                  src={siteContent.site.logo || '/images/branding/yellow-logo.png'}
                  alt={`${siteContent.site.name} logo`}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              </div>
              <div>
                <p className="font-playfair text-3xl font-bold text-white">{siteContent.site.name}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.24em] text-amber-200">{siteContent.site.tagline}</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-stone-300">{siteContent.site.description}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">Explore</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-stone-300">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/team" className="transition hover:text-white">
                Team
              </Link>
              <Link href="/gallery" className="transition hover:text-white">
                Gallery
              </Link>
              <Link href="/schedule" className="transition hover:text-white">
                Schedule
              </Link>
              <Link href="/book" className="transition hover:text-white">
                Book Us
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">Connect</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-stone-300">
              <a href="mailto:admin@spaceheardus.org" className="transition hover:text-white">
                admin@spaceheardus.org
              </a>
              <Link href="/donation" className="transition hover:text-white">
                Support the mission
              </Link>
              {volunteerIsExternal ? (
                <a href={volunteerHref} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  Volunteer with us
                </a>
              ) : (
                <Link href={volunteerHref} className="transition hover:text-white">
                  Volunteer with us
                </Link>
              )}
              <Link href="/admin-panel" className="text-stone-500 transition hover:text-stone-300">
                Admin
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-5 text-center text-sm text-stone-400">
          Copyright {new Date().getFullYear()} Space Heard Us. All rights reserved.
        </div>
      </footer>
    </>
  )
}
