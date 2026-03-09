import { links } from '@/content/links'

export default function DonationPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6">Support Our Mission</h1>
          <p className="text-white/60 text-lg mb-10">
            Your donation helps us create inclusive performances and community events for families.
          </p>
          <a
            href={links.donate}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
          >
            Donate Now
          </a>
        </div>
      </section>
    </div>
  )
}
