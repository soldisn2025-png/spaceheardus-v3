import { links } from '@/content/links'

export default function DonationPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-white border border-amber-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <h1 className="font-playfair text-5xl md:text-6xl text-stone-900 font-bold mb-6">Support Our Mission</h1>
          <p className="text-stone-600 text-lg mb-10">
            Your donation helps us create inclusive performances and community events for families.
          </p>
          <a
            href={links.donate}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/25"
          >
            Donate Now
          </a>
        </div>
      </section>
    </div>
  )
}
