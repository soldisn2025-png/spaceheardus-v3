import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

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
        {children}
      </body>
    </html>
  )
}
