export const site = {
  name: 'Team',
  domain: 'https://teamrollouts.com',
  tagline: 'Every release needs a Team.',
  cta: {
    primary: { label: 'Start free', href: '/pricing' },
    secondary: { label: 'Book a demo', href: '/demo' },
    signin: { label: 'Sign in', href: 'https://app.teamrollouts.com/sign-in' },
    app: 'https://app.teamrollouts.com/onboarding',
  },
  nav: {
    product: [
      { label: 'Rollouts', desc: 'Plan and run every release', href: '/rollouts', icon: 'rollouts', c: 'var(--team-music)' },
      { label: 'Assets', desc: 'The creative library, release-ready', href: '/assets', icon: 'assets', c: 'var(--team-press)' },
      { label: 'Tours', desc: 'Take the release on the road', href: '/tours', icon: 'tours', pro: true, c: 'var(--team-distro)' },
      { label: 'TeamMate', desc: 'The AI that runs the admin', href: '/teammate', icon: 'teammate', pro: true, c: 'var(--ink)' },
      { label: 'Connectors', desc: 'Works with your tools, both ways', href: '/connectors', icon: 'connectors', pro: true, c: 'var(--team-mgmt)' },
    ],
    who: [
      { label: 'Artists', desc: 'Run a release like a whole team', href: '/for-artists', icon: 'artists', c: 'var(--team-music)' },
      { label: 'Managers', desc: 'Every artist on the roster, one place', href: '/for-managers', icon: 'managers', c: 'var(--team-mgmt)' },
      { label: 'Labels', desc: 'The whole slate, always current', href: '/for-labels', icon: 'labels', c: 'var(--team-mkt)' },
      { label: 'Distributors & partners', desc: 'Your part of every release, in step', href: '/for-partners', icon: 'partners', c: 'var(--team-distro)' },
    ],
    more: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Insights', href: '/insights' },
      { label: 'About', href: '/about' },
    ],
  },
  footer: {
    product: ['Rollouts','Assets','Tours','TeamMate','Connectors','Security'].map(l => ({ label: l, href: '/' + l.toLowerCase() })),
    who: [
      { label: 'Artists', href: '/for-artists' },{ label: 'Managers', href: '/for-managers' },{ label: 'Labels', href: '/for-labels' },{ label: 'Distributors & partners', href: '/for-partners' },{ label: 'Enterprise', href: '/enterprise' },
    ],
    company: [
      { label: 'Pricing', href: '/pricing' },{ label: 'Insights', href: '/insights' },{ label: 'About', href: '/about' },{ label: 'Contact', href: '/contact' },{ label: 'Changelog', href: '/changelog' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },{ label: 'Terms', href: '/terms' },{ label: 'Security', href: '/security' },{ label: 'Cookies', href: '/cookies' },
    ],
  },
};
