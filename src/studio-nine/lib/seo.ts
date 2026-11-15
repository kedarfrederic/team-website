/**
 * Structured data helpers.
 *
 * Everything is generated from the same data files the pages render from, so the markup
 * search engines and language models read can never drift from what a visitor sees.
 */
import { plans, type PlanId } from '../data/plans';

export const SITE = 'https://teamrollouts.com';
export const ORG_ID = `${SITE}/#organization`;

const abs = (path: string) => new URL(path, SITE).href;

/** The publisher. Referenced by id from every other block rather than repeated. */
export function organisation() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Team',
    legalName: 'Team Rollouts, Inc.',
    url: SITE,
    logo: { '@type': 'ImageObject', url: abs('/studio-nine/logo/favicon-512.png'), width: 512, height: 512 },
    description:
      'Team is the home of the release: the plan, the files, the money, the dates and the people in one place.',
    sameAs: [
      'https://www.instagram.com/teamrollouts',
      'https://www.linkedin.com/company/teamrollouts',
      'https://x.com/teamrollouts',
    ],
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: 'Team',
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

/** One schema.org Offer per plan, priced per seat per month, monthly and billed yearly. */
export function planOffer(id: Exclude<PlanId, 'enterprise'>) {
  const p = plans[id];
  if (id === 'free') return { '@type': 'Offer', name: p.name, category: p.name, price: '0', priceCurrency: 'USD', url: abs('/pricing') };
  return {
    '@type': 'Offer',
    name: p.name,
    category: p.name,
    price: String(p.monthly),
    priceCurrency: 'USD',
    url: abs('/pricing'),
    priceSpecification: [
      { '@type': 'UnitPriceSpecification', price: String(p.monthly), priceCurrency: 'USD', unitText: 'per seat a month, billed monthly' },
      { '@type': 'UnitPriceSpecification', price: String(p.yearly), priceCurrency: 'USD', unitText: 'per seat a month, billed yearly' },
    ],
  };
}

/** Product pages: a SaaS product, offered on the plans that include it. */
export function software(p: { name: string; description: string; url: string; plans: Exclude<PlanId, 'enterprise'>[] }) {
  return {
    '@type': 'SoftwareApplication',
    name: `Team ${p.name}`,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Music release management',
    operatingSystem: 'Web',
    url: abs(p.url),
    description: p.description,
    publisher: { '@id': ORG_ID },
    offers: p.plans.map(planOffer),
  };
}

/** The pricing page: Team itself, on every self-serve plan. Enterprise is priced on a call. */
export function pricing(description: string) {
  return {
    '@type': 'SoftwareApplication',
    name: 'Team',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Music release management',
    operatingSystem: 'Web, iOS',
    url: abs('/pricing'),
    description,
    publisher: { '@id': ORG_ID },
    offers: (['free', 'pro', 'ultra'] as const).map(planOffer),
  };
}

export function article(a: {
  title: string; description: string; url: string; date: string; image?: string; words?: number;
}) {
  return {
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    url: abs(a.url),
    mainEntityOfPage: abs(a.url),
    datePublished: a.date,
    dateModified: a.date,
    wordCount: a.words,
    image: a.image ? abs(a.image) : undefined,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isAccessibleForFree: true,
  };
}

export function faq(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function webpage(w: { name: string; description: string; url: string }) {
  return {
    '@type': 'WebPage',
    name: w.name,
    description: w.description,
    url: abs(w.url),
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

export function collection(c: { name: string; description: string; url: string; items: { title: string; url: string }[] }) {
  return {
    '@type': 'CollectionPage',
    name: c.name,
    description: c.description,
    url: abs(c.url),
    isPartOf: { '@id': `${SITE}/#website` },
    publisher: { '@id': ORG_ID },
    hasPart: c.items.map((i) => ({ '@type': 'BlogPosting', headline: i.title, url: abs(i.url) })),
  };
}

export function breadcrumbs(trail: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.url),
    })),
  };
}

/** Wrap blocks into one graph so each page emits a single script tag. */
export function graph(...nodes: unknown[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });
}
