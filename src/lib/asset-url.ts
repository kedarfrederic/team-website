/**
 * Append a build-time version stamp to static-asset URLs so the browser
 * treats every deploy as a fresh resource and never serves stale CSS/JS
 * out of disk cache, ISP proxy, or open-tab memory.
 *
 * The stamp itself is resolved in astro.config.mjs and inlined here as a
 * literal by Vite's `define`. That indirection is deliberate — see the comment
 * on `define` there for why it can't be computed in this file.
 *
 * WAS LIVE-BROKEN, and the bug is worth remembering: prod served EVERY asset as
 * `?v=0` — a constant — so this helper busted nothing on any deploy, and a CSS
 * fix that was verifiably present in the served file still didn't apply in
 * already-open pages. The old code read the env var with `??` chaining, which
 * only falls through on null/undefined; the value arriving was the STRING "0",
 * which is truthy, so it passed every fallback untouched and the timestamp
 * branch never ran. (`||` wouldn't have helped either — "0" is truthy.) A stamp
 * has to be validated, not merely defaulted.
 */

/** Injected by Vite `define` in astro.config.mjs — always a validated literal. */
declare const __ASSET_VERSION__: string;

export function v(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${__ASSET_VERSION__}`;
}
