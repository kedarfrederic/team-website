import type { APIRoute } from "astro";

/**
 * Toggle preview/draft mode on for the current browser session.
 *
 * Called by the Studio Presentation tool when an editor opens a document for
 * live preview. Sets the `sanity-preview` cookie that the published pages'
 * stega encoding relies on for click-to-edit overlays.
 *
 * Auth: requires a `secret` query param matching `SANITY_PREVIEW_SECRET` so
 * arbitrary visitors can't flip themselves into preview mode.
 *
 * Cloudflare quirk: encrypted env vars (the secret is encrypted) are NOT
 * exposed via `import.meta.env` at build time. They reach the Worker only
 * through the runtime binding at `Astro.locals.runtime.env.X`. We try the
 * runtime binding first, then fall back to `import.meta.env` so local
 * `astro dev` (which loads `.env` via Vite) keeps working.
 *
 * Redirect: `?redirect=<path>` so Studio can drop the editor straight onto
 * the matching marketing page after enabling preview.
 */
export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect, locals }) => {
  const secret = url.searchParams.get("secret");
  const runtimeEnv = (locals as any)?.runtime?.env ?? {};
  const expected =
    runtimeEnv.SANITY_PREVIEW_SECRET ??
    import.meta.env.SANITY_PREVIEW_SECRET;

  if (!expected || secret !== expected) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  // Cookie set with SameSite=None; Secure so it's sent in cross-site
  // requests (the iframe is third-party from Cloudflare's POV). Firefox now
  // requires the Partitioned attribute for any cross-site cookie — Astro's
  // typed cookies API doesn't expose `partitioned` yet, so we fall through
  // to the response Set-Cookie header directly.
  const cookieValue = [
    "sanity-preview=1",
    "Path=/",
    `Max-Age=${60 * 60 * 8}`, // 8h editing session
    "Secure",
    "SameSite=None",
    "Partitioned",
  ].join("; ");

  const target = url.searchParams.get("redirect") ?? "/";
  // Build a redirect manually so we can attach the Partitioned cookie.
  return new Response(null, {
    status: 307,
    headers: {
      Location: target,
      "Set-Cookie": cookieValue,
    },
  });
};
