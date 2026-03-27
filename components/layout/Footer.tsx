import Link from 'next/link';
import { site } from '@/content/site';
import { navigation } from '@/content/navigation';
import { links } from '@/content/links';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-stone-800">{site.name}</p>
            <p className="mt-1 text-sm text-stone-600">{site.tagline}</p>
            <p className="mt-2 text-xs text-stone-500">{site.nonprofitNotice}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Contact</h3>
            <ul className="mt-3 space-y-1 text-sm text-stone-600">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded">
                  {site.email}
                </a>
              </li>
              {site.phone && (
                <li>
                  <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="hover:text-amber-600">{site.phone}</a>
                </li>
              )}
              {site.address && <li>{site.address}</li>}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Get involved</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/donation" className="text-sm font-medium text-amber-700 hover:text-amber-800">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/connect#volunteer" className="text-sm font-medium text-amber-700 hover:text-amber-800">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/connect" className="text-sm font-medium text-amber-700 hover:text-amber-800">
                  Connect With Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Follow</h3>
            <ul className="mt-3 flex gap-4 text-sm">
              {links.social.facebook && (
                <li>
                  <a href={links.social.facebook} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-600" aria-label="Facebook">
                    Facebook
                  </a>
                </li>
              )}
              {links.social.instagram && (
                <li>
                  <a href={links.social.instagram} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-600" aria-label="Instagram">
                    Instagram
                  </a>
                </li>
              )}
              {links.social.youtube && (
                <li>
                  <a href={links.social.youtube} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-600" aria-label="YouTube">
                    YouTube
                  </a>
                </li>
              )}
              {(!links.social.facebook && !links.social.instagram && !links.social.youtube) && (
                <li className="text-stone-400">Add social links in content/links.ts</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-sm text-stone-500">© {year} {site.name}. All rights reserved.</p>
            <a href="mailto:admin@spaceheardus.org" className="text-sm text-stone-500 hover:text-amber-600">admin@spaceheardus.org</a>
          </div>
          <div className="flex gap-6 text-sm text-stone-500">
            {navigation.main.map((item) => {
              const isExternal = 'external' in item && item.external && 'linkKey' in item;
              const href = isExternal && item.linkKey ? links[item.linkKey] : ('href' in item ? item.href : '#');
              if (isExternal) {
                return (
                  <a key={item.label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-stone-700">
                    {item.label}
                  </a>
                );
              }
              return (
                <Link key={item.label} href={href} className="hover:text-stone-700">
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
