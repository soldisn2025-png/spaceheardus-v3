'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type HeaderProps = {
  logoSrc: string
  siteName: string
  siteTagline: string
  volunteerFormUrl: string
}

const DEFAULT_LOGO = '/images/branding/yellow-logo.png'

function getVolunteerLink(volunteerFormUrl: string) {
  if (!volunteerFormUrl || volunteerFormUrl.includes('your-actual-form')) {
    return { external: false, href: '/#volunteer' }
  }

  return {
    external: /^https?:\/\//i.test(volunteerFormUrl),
    href: volunteerFormUrl,
  }
}

export default function Header({ logoSrc, siteName, siteTagline, volunteerFormUrl }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const pathname = usePathname()
  const volunteerLink = getVolunteerLink(volunteerFormUrl)
  const resolvedLogoSrc = logoError ? DEFAULT_LOGO : logoSrc || DEFAULT_LOGO
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/team', label: 'Team' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/book', label: 'Book Us' },
    { href: '/donation', label: 'Donate' },
    { external: volunteerLink.external, href: volunteerLink.href, label: 'Volunteer' },
  ]

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-[rgba(255,249,233,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group" aria-label={`${siteName} home`}>
          <div className="relative h-11 w-11 overflow-hidden rounded-[1rem] border border-black/10 bg-[#ffe17c] shadow-[0_10px_24px_rgba(72,54,8,0.12)]">
            <Image
              src={resolvedLogoSrc}
              alt={`${siteName} logo`}
              fill
              className="object-cover scale-[1.15]"
              sizes="44px"
              style={{ objectPosition: 'center 23%' }}
              onError={() => setLogoError(true)}
            />
          </div>

          <div className="leading-tight">
            <p className="font-playfair text-xl font-bold tracking-tight text-stone-950 transition group-hover:text-amber-800">
              {siteName}
            </p>
            <p className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-stone-600 sm:block">
              {siteTagline}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = !link.external && pathname === link.href

            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 inline-flex items-center rounded-full bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  {link.label}
                </a>
              )
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-700 hover:bg-white/80 hover:text-stone-950'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          className="text-stone-700 transition hover:text-stone-950 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className="flex h-5 w-6 flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-black/5 bg-[rgba(255,249,233,0.98)] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              if (link.external) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-[1rem] bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    {link.label}
                  </a>
                )
              }

              const isActive = pathname === link.href

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-white text-stone-950' : 'text-stone-700 hover:bg-white/80 hover:text-stone-950'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
