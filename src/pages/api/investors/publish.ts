import type { APIRoute } from "astro";
import {
  getEnv,
  getStore,
  getAdminEmail,
  json,
  sameOriginOk,
  type DeckDoc,
} from "../../../lib/investor-deck/runtime";

/** Copy the stored draft to published. Save first, then publish. */
export const prerender = false;

export const POST: APIRoute = async ({ locals, cookies, request, url }) => {
  const env = getEnv(locals);
  const email = await getAdminEmail(cookies, env);
  if (!email) return json({ error: "unauthorized" }, 401);
  if (!sameOriginOk(request, url)) return json({ error: "bad_origin" }, 403);
  const store = getStore(locals);
  if (!store) return json({ error: "storage_unconfigured" }, 503);

  const draft: DeckDoc | null = await store.get("draft");
  const published: DeckDoc = {
    content: draft?.content ?? {},
    updatedAt: new Date().toISOString(),
    updatedBy: email,
  };
  await store.put("published", published);
  return json({ ok: true, publishedAt: published.updatedAt });
};
