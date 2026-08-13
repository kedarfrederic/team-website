import { defineMiddleware } from "astro:middleware";
import { localeFromPath, stripLocale } from "./lib/i18n";

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
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LOCALE (added for the Korean launch)
 *
 * This middleware resolves locale from the URL PATH and puts it on `locals` for
 * layouts to read. It deliberately does NOT look at the visitor's country,
 * their Accept-Language header, or any cookie.
 *
 * That restraint is the design, for two independent reasons:
 *
 *  - Redirecting a visitor to a different language version by IP is the thing
 *    Google's multi-regional guidance explicitly tells you not to do, and it
 *    would hide the Korean pages from a crawler that reaches this site almost
 *    entirely from US addresses.
 *  - Any per-visitor variation in the response makes the Cloudflare edge cache
 *    unsafe, because a cached response is shared by definition.
 *
 * The country-based OFFER lives client-side (see src/pages/api/geo.ts and
 * LocaleSuggestionBanner.astro), where it can vary per visitor without making
 * the HTML vary per visitor. If you are ever tempted to add a redirect here,
 * read those two files first.
 */
export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);

  if (url.hostname === "www.teamrollouts.com") {
    url.hostname = "teamrollouts.com";
    return context.redirect(url.toString(), 301);
  }

  // Derived purely from the path, so a given URL renders identically for every
  // visitor and the response stays cacheable.
  context.locals.locale = localeFromPath(url.pathname);
  context.locals.basePath = stripLocale(url.pathname);

  return next();
});
