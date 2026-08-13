/**
 * Shared machinery for localising an injected HTML body.
 *
 * The v2 marketing pages each inject a hand-tuned `v2-*-body.html` whole, via
 * `set:html`. Those files' classes and ids are load-bearing for per-page
 * animation, so a translated COPY of the markup would have to be kept correct
 * twice, forever, with nothing to catch it when the two drift. Instead the
 * English body stays the single source of structure and a per-page map supplies
 * only the words.
 *
 * These two functions were written for the homepage and are now shared, because
 * every page after it needs the same pair and the second one is easy to forget:
 * `localizeBody` deliberately cannot see an href, so without `localizeHrefs` a
 * page renders Korean labels that navigate to English pages. That shipped once
 * (fixed in 8fe83ff) and is the reason both live here together rather than
 * being re-derived per page.
 *
 * Per-page copy maps live beside the page in `src/lib/ko/<page>.ts`.
 */

import { DEFAULT_LOCALE, TRANSLATED_PATHS, localizePath, type Locale } from "./i18n";

export type CopyMap = Readonly<Record<string, string>>;

/**
 * Swap English text nodes for Korean ones, leaving markup untouched.
 *
 * Matches only the text BETWEEN two tags (`>…<`), so a phrase that also occurs
 * inside a class name, id, url or data attribute is never touched — the thing a
 * naive whole-document replace gets wrong, silently and structurally.
 *
 * Anything with no entry renders in English. That is the intended failure mode:
 * a half-finished translation should look half-finished, not broken.
 *
 * Call once at module scope, not per request — the result is identical for
 * every visitor, and these bodies are up to 43KB.
 */
export function localizeBody(html: string, copy: CopyMap, attrs: CopyMap = {}): string {
  let out = html.replace(/>([^<>]+)</g, (whole, inner: string) => {
    const trimmed = inner.trim();
    if (!trimmed) return whole;
    const ko = copy[trimmed];
    if (ko === undefined) return whole;
    // Preserve the original surrounding whitespace so inline layout — and the
    // spacing between adjacent inline elements — is unchanged.
    return ">" + inner.replace(trimmed, ko) + "<";
  });

  for (const [en, ko] of Object.entries(attrs)) {
    for (const name of ["aria-label", "alt", "placeholder", "title"]) {
      out = out.split(`${name}="${en}"`).join(`${name}="${ko}"`);
    }
  }
  return out;
}

/**
 * Point internal links at their locale versions, where those exist.
 *
 * Gated on TRANSLATED_PATHS rather than rewriting every href: a page with no
 * Korean version must keep its English link, or the fix trades a language
 * switch for a 404. Because the gate is the registry, this extends itself as
 * pages land — the same rule the nav and footer use, so all three agree.
 *
 * Longest path first, so a short path cannot partially match a longer route
 * that shares its prefix.
 */
export function localizeHrefs(html: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return html;
  let out = html;
  const paths = [...TRANSLATED_PATHS].sort((a, b) => b.length - a.length);
  for (const path of paths) {
    // Bare href="/" is the logo; the chrome handles it, and rewriting it here
    // would also catch every href="/…" prefix.
    if (path === "/") continue;
    const localized = localizePath(path, locale);
    if (localized === path) continue;
    out = out.split(`href="${path}"`).join(`href="${localized}"`);
  }
  return out;
}

/** Localise a body end to end: words first, then destinations. */
export function localizePage(
  html: string,
  copy: CopyMap,
  locale: Locale,
  attrs: CopyMap = {},
): string {
  return localizeHrefs(localizeBody(html, copy, attrs), locale);
}
