'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import siteContent from '@/content/site-content.json'
import { links } from '@/content/links'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/team', label: 'Team' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/donation', label: 'Donation' },
  { href: links.volunteer, label: 'Volunteer Form', external: true },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center overflow-hidden shadow-lg">
            {!logoError ? (
              <Image
                src={siteContent.site.logo}
                alt="Space Heard Us logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-black font-black text-base">S</span>
            )}
          </div>
          <span className="font-bold text-white text-lg tracking-tight group-hover:text-amber-400 transition-colors">
            Space Heard Us
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = !link.external && pathname === link.href
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-amber-400 text-black text-sm font-bold hover:bg-amber-300 transition-colors ml-1"
                >
                  {link.label}
                </a>
              )
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <button
          className="md:hidden text-white/80 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0a0a0f] border-t border-white/10 px-6 py-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl bg-amber-400 text-black font-bold text-center"
                >
                  {link.label}
                </a>
              )
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
