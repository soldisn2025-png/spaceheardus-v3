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
  title: 'Space Heard Us | Inclusive Youth Nonprofit Band in Fairfax, VA',
  description:
    'Space Heard Us is an inclusive youth nonprofit band in Fairfax, Virginia. Eric and Kaden — musicians with autism — perform at churches, hospitals, daycares, and community events across Northern Virginia. Book a performance or find inspiration for your family.',
  keywords: [
    'youth band Fairfax VA',
    'inclusive music Fairfax Virginia',
    'autism music program Northern Virginia',
    'book youth band Northern Virginia',
    'kids with autism performing',
    'inclusive youth musicians DC metro',
    'nonprofit band Fairfax',
    'disability inclusion music',
  ],
  metadataBase: new URL('https://spaceheardus.org'),
  openGraph: {
    title: 'Space Heard Us | Inclusive Youth Nonprofit Band in Fairfax, VA',
    description:
      'Eric and Kaden — musicians with autism — perform for communities across Northern Virginia, proving that every voice deserves to be heard.',
    images: [{ url: '/images/group.jpg', width: 1200, height: 630, alt: 'Space Heard Us band performing' }],
    type: 'website',
    locale: 'en_US',
    siteName: 'Space Heard Us',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Space Heard Us | Inclusive Youth Nonprofit Band',
    description:
      'Youth nonprofit band in Fairfax, VA — performing at churches, hospitals, daycares across Northern Virginia.',
    images: ['/images/group.jpg'],
  },
  alternates: {
    canonical: 'https://spaceheardus.org',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'NonprofitOrganization',
      '@id': 'https://spaceheardus.org/#organization',
      name: 'Space Heard Us',
      url: 'https://spaceheardus.org',
      logo: 'https://spaceheardus.org/images/logo.jpg',
      image: 'https://spaceheardus.org/images/group.jpg',
      description:
        'Space Heard Us is an inclusive youth nonprofit band in Fairfax, Virginia. We celebrate the gifts of children with disabilities through the power of music.',
      foundingDate: '2023-12',
      email: 'admin@spaceheardus.org',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Fairfax',
        addressRegion: 'VA',
        addressCountry: 'US',
      },
      areaServed: {
        '@type': 'State',
        name: 'Northern Virginia',
      },
      knowsAbout: ['Inclusive music', 'Autism', 'Youth performance', 'Community outreach'],
    },
    {
      '@type': 'MusicGroup',
      '@id': 'https://spaceheardus.org/#musicgroup',
      name: 'Space Heard Us',
      url: 'https://spaceheardus.org',
      image: 'https://spaceheardus.org/images/group.jpg',
      description: 'An inclusive youth music group featuring musicians with autism based in Fairfax, Virginia.',
      genre: ['Classical', 'Contemporary'],
      foundingLocation: {
        '@type': 'City',
        name: 'Fairfax, Virginia',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-[#fffdf6] text-stone-900 antialiased">
        {children}
      </body>
    </html>
  )
}
