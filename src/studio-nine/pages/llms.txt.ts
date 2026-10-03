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

> ${site.tagline} Team is the home of the release: the plan, the files, the money, the dates and the people in one place. Rollouts and Assets are free for artists, managers and labels. Pro adds TeamMate, the AI that does the admin, plus Tours and Connectors.

Team is made by Team Rollouts, Inc. This site is designed and built by Studio Nine (https://studionine.agency).

## Product
${products.map((p) => line(p.name, `/${p.slug}`, p.lead)).join('\n')}
${line('Security', '/security', 'How your data is handled: never used to train a model, permissioned tool by tool, revocable, exportable.')}

## Who it is for
${audiences.map((a) => line(a.name, `/${a.slug}`, a.lead)).join('\n')}
${line('Enterprise', '/enterprise', 'Deploy Team across every imprint and team, with SSO, SCIM, role-based access and an auditable trail.')}

## Plans
${line('Pricing', '/pricing', 'Free and Pro side by side. Rollouts and Assets are free forever with unlimited artists, releases and collaborators. Pro adds TeamMate, Tours and Connectors.')}

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
