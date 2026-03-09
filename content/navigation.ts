/**
 * Main navigation and CTA links.
 * Volunteer Form uses links.volunteer (SignupGenius URL) from content/links.ts.
 */
export const navigation = {
  main: [
    { label: 'Home', href: '/' },
    { label: 'Team', href: '/team' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Schedule', href: '/schedule' },
    { label: 'Donation', href: '/donation' },
    { label: 'Volunteer Form', external: true, linkKey: 'volunteer' as const },
  ],
  cta: {
    donate: { label: 'Donate', href: '/donation' },
    connect: { label: 'Connect With Us', href: '/connect' },
    volunteer: { label: 'Volunteer', href: '/connect#volunteer' },
    schedule: { label: 'View Schedule', href: '/schedule' },
  },
} as const;
