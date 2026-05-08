import type { APIRoute } from "astro";

/**
 * Toggle preview/draft mode on for the current browser session.
 *
 * Called by the Studio Presentation tool when an editor opens a document for
 * live preview. Sets the `sanity-preview` cookie that `getClient()` looks at
 * to switch into the draft-aware client with stega encoding.
 *
 * Auth: requires a `secret` query param matching `SANITY_PREVIEW_SECRET` so
 * arbitrary visitors can't flip themselves into preview mode and see drafts.
 *
 * Redirect: `?redirect=<path>` so Studio can drop the editor straight onto
 * the matching marketing page after enabling preview.
 */
export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const secret = url.searchParams.get("secret");
  const expected = import.meta.env.SANITY_PREVIEW_SECRET;

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
