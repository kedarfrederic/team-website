/**
 * Append a build-time version stamp to static-asset URLs so the browser
 * treats every deploy as a fresh resource and never serves stale CSS/JS
 * out of disk cache, ISP proxy, or open-tab memory.
 *
 * Source of truth: Cloudflare Pages exposes the deploy commit SHA as
 * CF_PAGES_COMMIT_SHA at build time. We read it via import.meta.env so
 * Vite inlines a literal string into the SSR bundle. Outside CF Pages
 * (local dev, ad-hoc builds) we fall back to a per-build random stamp.
 */
const VERSION: string =
  (import.meta.env.CF_PAGES_COMMIT_SHA as string | undefined)?.slice(0, 8) ??
  (import.meta.env.PUBLIC_BUILD_VERSION as string | undefined) ??
  Date.now().toString(36);

export function v(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${VERSION}`;
}
