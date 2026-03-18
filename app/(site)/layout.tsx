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
      <footer className="border-t border-amber-200 py-10 text-center text-stone-600 text-sm font-inter">
        <p>© {new Date().getFullYear()} Space Heard Us · Youth Nonprofit Band · Fairfax, VA · All Rights Reserved</p>
      </footer>
    </>
  )
}
