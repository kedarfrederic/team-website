import { renderDesignHtml } from "./studio-nine/localize";
import { getDesignContent } from "./studio-nine/cms";
import { localeFromPath } from "./studio-nine/lib/i18n/routes";
import { isPreviewRequest } from "./lib/sanity";
import { defineMiddleware } from "astro:middleware";

/**
 * Canonical host: redirect www.teamrollouts.com → teamrollouts.com.
 *
 * Both hosts served 200 with no redirect, which meant one site on two origins.
 * That is mostly an SEO nuisance (the canonical tag already points at the apex),
 * but it became a correctness problem for cookie consent: browser storage is
 * ORIGIN-scoped, so www and the apex each kept their own consent record and a
 * visitor could be asked twice on the same site. The consent cookie is scoped to
 * `.teamrollouts.com` so it spans both, and this collapses the two origins so
 * everything else — analytics identity, session storage, the intro-once flag —
 * stops forking too.
 *
 * A 301 rather than a 302: this is permanent, and it lets search engines
 * consolidate. Astro's `redirects` config can't express this because it matches
 * on PATH, not host, so it has to be middleware. The site is output:"server", so
 * this runs on every request at the edge.
 *
 * Scoped to the exact production hostname on purpose. Preview deploys
 * (*.pages.dev) and localhost must pass through untouched, or every preview URL
 * would bounce to production — which is exactly the sort of "fix" that silently
 * makes previews untestable.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  if (url.hostname === "www.teamrollouts.com") {
    url.hostname = "teamrollouts.com";
    return context.redirect(url.toString(), 301);
  }

  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = await response.text();
  if (!html.includes('name="team-design" content="studio-nine-v3"')) return new Response(html,response);
  const maps = await getDesignContent(context);
  const output = renderDesignHtml(html,localeFromPath(url.pathname),maps.copy,maps.media,maps.links);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  // All draft responses bypass intermediary caches, including ?preview=1.
  if (isPreviewRequest(context as any)) {
    headers.set('Cache-Control','private, no-store');
    headers.set('X-Robots-Tag','noindex, nofollow');
  }
  return new Response(output,{status:response.status,statusText:response.statusText,headers});
});
