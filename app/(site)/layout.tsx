import Link from 'next/link'
import Header from '@/components/Header'
import { getLiveSiteContent } from '@/lib/liveContent'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteContent = await getLiveSiteContent()

  return (
    <>
      <Header
        logoSrc={siteContent.site.logo}
        siteName={siteContent.site.name}
        volunteerFormUrl={siteContent.settings.volunteerFormUrl}
      />
      <main className="pt-16">{children}</main>
      <footer className="border-t border-amber-200 py-10 text-center text-sm text-stone-600 font-inter">
        <p>Copyright {new Date().getFullYear()} Space Heard Us | Youth Nonprofit Band | Fairfax, VA | All Rights Reserved</p>
        <p className="mt-2">
          <a href="mailto:hello@spaceheardus.org" className="hover:text-amber-600 transition">hello@spaceheardus.org</a>
        </p>
        <p className="mt-2">
          <Link href="/admin-panel" className="text-stone-400 transition hover:text-stone-700">
            Admin
          </Link>
        </p>
      </footer>
    </>
  )
}
