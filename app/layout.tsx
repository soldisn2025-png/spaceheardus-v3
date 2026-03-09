import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Space Heard Us | Youth Nonprofit Band',
  description: 'A youth nonprofit band using music to spread joy and support communities.',
  metadataBase: new URL('https://spaceheardus.org'),
  openGraph: {
    title: 'Space Heard Us',
    description: 'Music That Moves Hearts',
    images: ['/images/group.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#fffdf6] text-stone-900 antialiased">
        <Header />
        <main className="pt-16">{children}</main>
        <footer className="border-t border-amber-200 py-10 text-center text-stone-600 text-sm font-inter">
          <p>© {new Date().getFullYear()} Space Heard Us · Youth Nonprofit Band · All Rights Reserved</p>
        </footer>
      </body>
    </html>
  )
}
