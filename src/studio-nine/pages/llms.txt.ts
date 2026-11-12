import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { products } from '../data/products';
import { audiences } from '../data/audiences';
import { posts } from '../data/insights';

/**
 * llms.txt — a plain-text map of the site for language models.
 *
 * Generated from the same data files the pages render from, so it cannot fall out of date.
 * Everything listed here is a real, public page; nothing is hidden from human visitors.
 */
const SITE = 'https://teamrollouts.com';
const line = (label: string, path: string, note: string) => `- [${label}](${SITE}${path}): ${note}`;

export const GET: APIRoute = () => {
  const body = `# Team

> ${site.tagline} Team is the home of the release: the plan, the files, the money, the dates and the people in one place. Free covers one person and one artist. Pro ($15 a seat a month, $12 billed yearly, any number of seats) adds all of TeamMate, Team Chat, reports and Connectors. Ultra ($25 a seat a month, $20 billed yearly, up to 20 seats) adds touring, the A&R pipeline and one view across every artist. Enterprise is custom, for 21 seats or more.

Team is made by Team Rollouts, Inc. This site is designed and built by Studio Nine (https://studionine.agency).

## Product
${products.map((p) => line(p.name, `/${p.slug}`, p.lead)).join('\n')}
${line('Security', '/security', 'How your data is handled: never used to train a model, permissioned tool by tool, revocable, exportable.')}

## Who it is for
${audiences.map((a) => line(a.name, `/${a.slug}`, a.lead)).join('\n')}
${line('Enterprise', '/enterprise', 'Deploy Team across every imprint and team, with SSO, API access and dedicated support. Audit history is coming soon.')}

## Plans
${line('Pricing', '/pricing', 'Free, Pro, Ultra and Enterprise side by side. Pro has a 30-day free trial with no card; Ultra has a 14-day free trial with a card. Collaborators, view-only people, share links and drop links are free on every plan.')}

## Company
${line('About', '/about', 'Why Team exists, what we believe, and the people building it.')}
${line('Contact', '/contact', 'Talk to the team.')}
${line('Book a demo', '/demo', 'A walkthrough with someone who runs releases on Team.')}
${line('Changelog', '/changelog', 'What shipped, month by month.')}

## Insights
${posts.map((p) => line(p.title, `/insights/${p.slug}`, p.dek)).join('\n')}

## Legal
${line('Privacy', '/privacy', 'What we collect and why.')}
${line('Terms', '/terms', 'Terms of service.')}
${line('Cookies', '/cookies', 'Cookie policy.')}
${line('SMS terms', '/sms-terms', 'Terms for text messages.')}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
