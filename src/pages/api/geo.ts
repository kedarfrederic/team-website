import type { APIRoute } from "astro";

/**
 * The visitor's country, and nothing else.
 *
 * WHY THIS EXISTS AS AN ENDPOINT rather than a value baked into the page:
 *
 * The site is output:"server" behind Cloudflare, which caches the Worker
 * response for cookie-less visitors. If any page's HTML varied by country —
 * even by one hidden banner — the first Korean visitor's response would be
 * cached and served to everyone after them, or the reverse. That class of bug
 * is invisible in development (no edge cache), intermittent in production, and
 * looks like the geo logic "sometimes not working".
 *
 * Keeping country out of the HTML entirely means every page stays byte-identical
 * per URL and fully cacheable, and the one per-visitor bit moves here, to a
 * response small enough that the extra request costs nothing.
 *
 * It also happens to be the SEO-correct arrangement: Googlebot receives exactly
 * the same HTML as every other visitor to that URL, so there is no version of
 * this site that only a crawler sees.
 *
 * Returns `{ country: null }` rather than an error when the country cannot be
 * determined — on localhost, on a preview deploy, or behind a proxy that strips
 * the header. Null means "no suggestion", which is the correct quiet default.
 */
export const prerender = false;

export const GET: APIRoute = ({ request, locals }) => {
  // CF-IPCountry is set by Cloudflare on every request that reaches the Worker.
  // `runtime.cf.country` carries the same value and is read as a fallback for
  // local `wrangler dev` runs, where platformProxy populates cf but the header
  // is not always present.
  const header = request.headers.get("cf-ipcountry");
  const fromRuntime = (locals as { runtime?: { cf?: { country?: unknown } } })?.runtime?.cf?.country;

  const raw = header ?? (typeof fromRuntime === "string" ? fromRuntime : null);

  // Cloudflare sends "XX" for unknown/reserved addresses and "T1" for Tor exit
  // nodes. Neither is a country, and mapping either to a locale would be a
  // guess presented as a fact.
  const country =
    raw && /^[A-Za-z]{2}$/.test(raw) && !["XX", "T1"].includes(raw.toUpperCase())
      ? raw.toUpperCase()
      : null;

  return new Response(JSON.stringify({ country }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Must never be cached — shared caches would hand one visitor's country
      // to the next, which is the exact failure this endpoint exists to avoid.
      "cache-control": "no-store, no-cache, must-revalidate",
      vary: "CF-IPCountry",
    },
  });
};
