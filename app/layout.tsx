import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

export const metadata: Metadata = {
  title: "Space Heard Us | Youth Nonprofit Band",
  description: "A youth nonprofit band using music to spread joy and support communities.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#0a0a0f] text-white antialiased">
        <Header />
        <main className="pt-16">{children}</main>
        <footer className="border-t border-white/10 py-10 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Space Heard Us · Youth Nonprofit Band
        </footer>
      </body>
    </html>
  )
}
