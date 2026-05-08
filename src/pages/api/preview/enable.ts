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

  cookies.set("sanity-preview", "1", {
    httpOnly: false, // visible to client JS so the overlay can read it
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8h editing session
  });

  const target = url.searchParams.get("redirect") ?? "/";
  return redirect(target, 307);
};
