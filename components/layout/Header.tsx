'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navigation } from '@/content/navigation';
import { site } from '@/content/site';
import rawSiteContent from '@/content/site-content.json';
import { normalizeSiteContent } from '@/lib/siteContent';

const siteContent = normalizeSiteContent(rawSiteContent);
export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-md"
          aria-label={`${site.name} home`}
        >
          {site.name}
        </Link>
        <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Main navigation">
          {navigation.main.map((item) => {
            const isExternal = 'external' in item && item.external && 'linkKey' in item;
            const href = isExternal && item.linkKey ? links[item.linkKey] : ('href' in item ? item.href : '#');
            const isActive = !isExternal && pathname === href;
            if (isExternal) {
              return (
                <a
                  key={item.label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={item.label}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
                  isActive ? 'bg-amber-50 text-amber-800' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex md:items-center md:gap-2">
          <Link
            href={siteContent.settings.volunteerFormUrl || '/connect#volunteer'}
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            Volunteer
          </Link>
          <Link
            href="/donation"
            className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors"
          >
            Donate
          </Link>
          <Link
            href="/admin-panel"
            className="rounded-lg px-2 py-1 text-xs font-medium text-stone-400 hover:text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors"
          >
            Admin
          </Link>
        </div>
        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      <div
        id="mobile-menu"
        className={`md:hidden border-t border-stone-200 bg-white ${mobileOpen ? 'block' : 'hidden'}`}
        role="region"
        aria-label="Mobile menu"
      >
        <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Main navigation">
          {navigation.main.map((item) => {
            const isExternal = 'external' in item && item.external && 'linkKey' in item;
            const href = isExternal && item.linkKey ? links[item.linkKey] : ('href' in item ? item.href : '#');
            const isActive = !isExternal && pathname === href;
            if (isExternal) {
              return (
                <a
                  key={item.label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50"
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={item.label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-3 text-base font-medium ${
                  isActive ? 'bg-amber-50 text-amber-800' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-4 flex flex-col gap-2 border-t border-stone-200 pt-4">
            <Link
              href={siteContent.settings.volunteerFormUrl || '/connect#volunteer'}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50"
            >
              Volunteer
            </Link>
            <Link
              href="/donation"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-amber-500 px-4 py-3 text-center text-base font-semibold text-white"
            >
              Donate
            </Link>
            <Link
              href="/admin-panel"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-stone-400 hover:bg-stone-50"
            >
              Admin
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
