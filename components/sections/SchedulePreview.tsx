import Link from 'next/link';
import { events } from '@/content/events';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CTA } from '@/components/ui/CTA';

function formatDate(dateStr: string) {
  const parsed = new Date(dateStr);

  if (Number.isNaN(parsed.getTime())) {
    return dateStr;
  }

  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function SchedulePreview() {
  const upcoming = events.slice(0, 3);

  return (
    <section className="bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Upcoming events"
          subtitle="Join us at our next performance or rehearsal."
          className="mb-10"
        />
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <p className="text-stone-600">No upcoming events right now. Connect with us to hear about future dates.</p>
            <CTA href="/connect" variant="primary" className="mt-4">Connect With Us</CTA>
          </div>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-amber-700">{e.type}</p>
                  <h3 className="text-lg font-semibold text-stone-900">{e.title}</h3>
                  <p className="text-stone-600">{formatDate(e.date)} | {e.time}</p>
                  <p className="text-stone-500">{e.location}</p>
                </div>
                <Link
                  href={e.rsvpLink || '/connect'}
                  className="shrink-0 rounded-xl border-2 border-amber-500 px-4 py-2 text-center text-sm font-semibold text-amber-700 hover:bg-amber-50"
                >
                  {e.rsvpLabel || 'Details'}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 text-center">
          <CTA href="/schedule" variant="outline">View full schedule</CTA>
        </div>
      </div>
    </section>
  );
}
