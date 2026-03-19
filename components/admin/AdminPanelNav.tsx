import Link from 'next/link'

type AdminPanelNavProps = {
  current: 'gallery' | 'homepage' | 'schedule'
}

const NAV_ITEMS = [
  {
    href: '/admin-panel/dashboard',
    id: 'homepage',
    label: 'Homepage',
  },
  {
    href: '/admin-panel/dashboard/schedule',
    id: 'schedule',
    label: 'Schedule',
  },
  {
    href: '/admin-panel/dashboard/gallery',
    id: 'gallery',
    label: 'Gallery',
  },
] as const

export function AdminPanelNav({ current }: AdminPanelNavProps) {
  return (
    <div className="mt-6 grid gap-3 md:grid-cols-3">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === current

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
              isActive
                ? 'border-amber-400 bg-amber-50 shadow-sm'
                : 'border-amber-100 bg-[#fffaf0] hover:border-amber-300 hover:bg-white'
            }`}
          >
            <p className="text-base font-semibold text-stone-900">{item.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">
              {item.label === 'Homepage' ? 'Hero image, statement, and featured video' : null}
              {item.label === 'Schedule' ? 'Rehearsal details and upcoming events' : null}
              {item.label === 'Gallery' ? 'Gallery title, videos, and photo uploads' : null}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
