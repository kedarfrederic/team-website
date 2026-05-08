import type { APIRoute } from "astro";

/**
 * Exit preview mode — clears the `sanity-preview` cookie. Called by the
 * "Exit preview" button in the Visual Editing toolbar, or hit manually if
 * an editor's session is sticky.
 */
export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  cookies.delete("sanity-preview", { path: "/" });
  const target = url.searchParams.get("redirect") ?? "/";
  return redirect(target, 307);
};
