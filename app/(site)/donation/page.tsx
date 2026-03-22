import { getLiveLinks } from '@/lib/liveContent'

export default async function DonationPage() {
  const links = await getLiveLinks()
  const zeffyUrl = links.zeffy || links.donate
  const paypalUrl = links.paypalDonate

  return (
    <div className="min-h-screen">
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-5xl md:text-6xl text-stone-900 font-bold mb-6">Support Our Mission</h1>
            <p className="text-stone-600 text-lg">
              Choose your preferred donation method. Both options open in a secure new tab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="bg-white border border-amber-100 rounded-3xl p-8 shadow-sm">
              <h2 className="font-playfair text-3xl text-stone-900 font-bold mb-3">Donate with Zeffy</h2>
              <p className="text-stone-600 mb-8">
                Best option for minimizing nonprofit fees.
              </p>
              <a
                href={zeffyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-colors"
              >
                Open Zeffy
              </a>
            </article>

            <article className="bg-white border border-amber-100 rounded-3xl p-8 shadow-sm">
              <h2 className="font-playfair text-3xl text-stone-900 font-bold mb-3">Donate with PayPal</h2>
              <p className="text-stone-600 mb-8">
                Familiar and convenient for many donors.
              </p>
              <a
                href={paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-stone-900 text-white font-bold rounded-full hover:bg-stone-800 transition-colors"
              >
                Open PayPal
              </a>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
