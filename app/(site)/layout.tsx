import Link from 'next/link'
import Header from '@/components/Header'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <footer className="border-t border-amber-200 py-10 text-center text-sm text-stone-600 font-inter">
        <p>Copyright {new Date().getFullYear()} Space Heard Us | Youth Nonprofit Band | Fairfax, VA | All Rights Reserved</p>
        <p className="mt-2">
          <Link href="/admin-panel" className="text-stone-400 transition hover:text-stone-700">
            Admin
          </Link>
        </p>
      </footer>
    </>
  )
}
