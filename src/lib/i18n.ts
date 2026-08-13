/**
 * Locale plumbing for the Korean launch.
 *
 * ARCHITECTURE — the one thing to understand before changing anything here:
 *
 *   Locale comes from the URL PATH. Geography only ever produces a SUGGESTION.
 *
 * Those two facts are separated on purpose, and the separation is load-bearing
 * twice over:
 *
 *  1. SEO. Google crawls this site almost entirely from US IP addresses and
 *     states plainly: "Don't use IP analysis to adapt your content" and "avoid
 *     automatically redirecting users from one language version of a site to a
 *     different language version". If Korean content were served by IP on the
 *     same URL, Googlebot would only ever see English and the Korean pages
 *     could never rank for Korean queries. That is not a penalty — it is
 *     invisibility, which is worse, because nothing reports it.
 *
 *  2. Caching. This site is output:"server" behind Cloudflare, which caches the
 *     Worker response for cookie-less visitors. Any HTML that varies by country
 *     is a cache-poisoning bug waiting to happen: the first Korean visitor's
 *     response gets served to everyone, or vice versa. Deriving locale from the
 *     path keeps a given URL's HTML byte-identical for every visitor.
 *
 * So: the server renders per-URL (cacheable, deterministic). The geo suggestion
 * is fetched client-side from /api/geo (uncached, tiny). Nothing on the render
 * path ever reads the country.
 *
 * Adding a locale is: add it to LOCALES, add a display entry to LOCALE_LABELS,
 * point the country at it in SUGGESTED_LOCALE_BY_COUNTRY, and add the paths you
 * have actually translated to TRANSLATED_PATHS.
 */

export const LOCALES = ["en", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/**
 * Cookie holding an explicit user choice. Read client-side only (see the
 * architecture note — the server must not vary on it). Scoped to
 * `.teamrollouts.com` when written so the app at app.teamrollouts.com can
 * honour the same preference instead of asking again.
 */
export const LOCALE_COOKIE = "preferred_locale";

/**
 * Which locale to OFFER a visitor from a given country. Offering is all this
 * does — there is no code path that acts on it without a click.
 */
export const SUGGESTED_LOCALE_BY_COUNTRY: Readonly<Record<string, Locale>> = {
  KR: "ko",
};

export const LOCALE_LABELS: Readonly<Record<Locale, { name: string; hreflang: string }>> = {
  // `hreflang` is deliberately NOT the same string as the locale. Google
  // requires ISO 639-1 language with an optional ISO 3166-1 Alpha-2 region,
  // and a bare region code ("KR") is invalid. "ko-KR" is what we want indexed
  // for Korea, while the URL segment stays the shorter "ko".
  en: { name: "English", hreflang: "en" },
  ko: { name: "한국어", hreflang: "ko-KR" },
};

/**
 * English paths that have a real, published translation.
 *
 * hreflang is emitted ONLY for paths listed here. That is the whole point of
 * the list: an hreflang alternate pointing at a URL that 404s is worse than no
 * hreflang at all, because Google drops the entire annotation cluster and you
 * get no signal instead of a partial one.
 *
 * INVARIANT: every entry must have a matching file under src/pages/<locale>/.
 * `pnpm check:i18n` enforces this — it walks src/pages and fails if a
 * registered path has no file. Add the page first, then the entry.
 *
 * Paths are stored in their canonical English form, with a leading slash and
 * no trailing slash except for the root.
 */
export const TRANSLATED_PATHS: ReadonlySet<string> = new Set<string>([
  "/",
  "/pricing",
  "/rollouts",
  "/teammate",
  "/assets",
  "/tours",
  "/connections",
  "/contact",
  "/security",
  "/about",
  "/for-artists",
  "/for-managers",
  "/for-labels",
  "/for-partners",
  "/enterprise",
  // Add an entry only once the page file exists — `pnpm check:i18n` fails
  // otherwise, because an hreflang alternate that 404s costs the whole cluster.
]);

const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/** Matches a leading locale segment, and ONLY a whole segment. */
const LOCALE_PREFIX_RE = new RegExp(`^/(${NON_DEFAULT_LOCALES.join("|")})(?=/|$)`, "i");

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Normalise a pathname: guarantee a leading slash and strip a trailing one
 * (except for the root, which stays "/"). Query and hash are not handled here
 * because every caller passes `URL.pathname`, which never contains them.
 */
export function normalizePath(pathname: string): string {
  const withLeading = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (withLeading === "/") return "/";

  // Linear scan, NOT `replace(/\/+$/, "")`. That regex has no start anchor, so
  // the engine retries the greedy `\/+` run at every offset and backtracks the
  // whole run each time — quadratic in the length of a slash run. Measured:
  // 1k slashes 0.6ms, 16k slashes 115ms, against ~0.004ms flat for this loop.
  //
  // That was harmless while nothing called it. It stopped being harmless when
  // middleware started calling it on EVERY request, before route matching, so
  // even a 404 pays — and 404.astro renders through BaseLayout, which calls it
  // several more times. Cloudflare accepts URLs up to 16KB, so one anonymous
  // GET could burn most of a second of Worker CPU. Keep this a plain scan.
  let end = withLeading.length;
  while (end > 1 && withLeading.charCodeAt(end - 1) === 47 /* "/" */) end--;

  const withoutTrailing = withLeading.slice(0, end);
  return withoutTrailing === "" ? "/" : withoutTrailing;
}

/**
 * The locale a URL addresses. Path is the ONLY input — see the architecture
 * note. `/korean-market` is English: the regex matches whole segments, so a
 * path that merely starts with the letters "ko" is not Korean.
 */
export function localeFromPath(pathname: string): Locale {
  const match = LOCALE_PREFIX_RE.exec(normalizePath(pathname));
  if (!match) return DEFAULT_LOCALE;
  const candidate = match[1].toLowerCase();
  return isLocale(candidate) ? candidate : DEFAULT_LOCALE;
}

/** `/ko/pricing` → `/pricing`; `/ko` → `/`; `/pricing` → `/pricing`. */
export function stripLocale(pathname: string): string {
  const normalized = normalizePath(pathname);
  const stripped = normalized.replace(LOCALE_PREFIX_RE, "");
  return stripped === "" ? "/" : normalizePath(stripped);
}

/**
 * Project an English path into a locale.
 * `("/pricing", "ko")` → `/ko/pricing`; `("/", "ko")` → `/ko`.
 *
 * Idempotent: passing an already-localised path re-projects it rather than
 * stacking prefixes, so `("/ko/pricing", "ko")` is `/ko/pricing`, not
 * `/ko/ko/pricing`.
 *
 * The locale root is `/ko`, NOT `/ko/`. It has to match what normalizePath
 * produces, because BaseLayout builds the canonical URL through normalizePath
 * and the hreflang alternates through this function. When they disagreed, the
 * Korean homepage declared its canonical as /ko while declaring its own ko-KR
 * alternate as /ko/ — a different URL, so the self-reference Google requires
 * was missing and the whole annotation cluster is discarded. Every other page
 * agreed; only the root was wrong, which is exactly the kind of single-case
 * inconsistency that survives a page-by-page check.
 */
export function localizePath(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  if (locale === DEFAULT_LOCALE) return base;
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
}

/** Does this English path have a published translation in `locale`? */
export function hasTranslation(pathname: string, locale: Locale): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  return TRANSLATED_PATHS.has(stripLocale(pathname));
}

export interface AlternateLink {
  hreflang: string;
  href: string;
}

/**
 * The full hreflang set for a page, or an empty array when the page has no
 * translations.
 *
 * Three rules Google enforces, all of which this satisfies or returns nothing:
 *  - Every version must be listed, INCLUDING a self-reference.
 *  - Return links must be bidirectional. Because each locale's page emits this
 *    same set from the same registry, they always agree.
 *  - URLs must be fully qualified.
 *
 * `x-default` points at the English version: it is the fallback for a visitor
 * whose language matches nothing, which is what English is here.
 */
export function alternateLinks(pathname: string, siteOrigin: string): AlternateLink[] {
  const base = stripLocale(pathname);
  const translated = LOCALES.filter((locale) => hasTranslation(base, locale));

  // Only the default locale exists → no cluster to annotate. Emitting a lone
  // self-referencing hreflang is noise, not signal.
  if (translated.length < 2) return [];

  const links = translated.map((locale) => ({
    hreflang: LOCALE_LABELS[locale].hreflang,
    href: new URL(localizePath(base, locale), siteOrigin).toString(),
  }));

  links.push({
    hreflang: "x-default",
    href: new URL(localizePath(base, DEFAULT_LOCALE), siteOrigin).toString(),
  });

  return links;
}

/**
 * Should this visitor be OFFERED another locale?
 *
 * Returns null — meaning "say nothing" — unless every condition holds:
 *  - the country maps to a locale we support,
 *  - that locale is not the one they are already reading,
 *  - they have not already expressed a preference,
 *  - and the page they are on actually exists in that locale, so the offer
 *    cannot lead to a 404.
 *
 * Runs client-side only.
 */
export function suggestLocale(input: {
  country: string | null | undefined;
  pathname: string;
  storedPreference?: string | null;
}): Locale | null {
  const { country, pathname, storedPreference } = input;

  // An explicit choice ends the conversation, in either direction.
  if (isLocale(storedPreference)) return null;

  if (!country) return null;
  const suggested = SUGGESTED_LOCALE_BY_COUNTRY[country.trim().toUpperCase()];
  if (!suggested) return null;

  if (suggested === localeFromPath(pathname)) return null;
  if (!hasTranslation(pathname, suggested)) return null;

  return suggested;
}
