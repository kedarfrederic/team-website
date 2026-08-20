import type { APIRoute } from "astro";
import {
  getEnv,
  getStore,
  getAdminEmail,
  sanitizeFragment,
  json,
  sameOriginOk,
  SLOT_SLUGS,
  MAX_SLOT_LENGTH,
  slotDefault,
  type DeckDoc,
} from "../../../lib/investor-deck/runtime";

/**
 * Draft content for the investor deck.
 *
 * GET  -> the current draft doc (admin only).
 * PUT  -> merge {changes: {slug: htmlFragment}} into the draft. Slugs must
 *         exist in the compiled template; fragments are sanitized to inline
 *         formatting on write (and again on render). A fragment identical to
 *         the template default removes the override instead of storing it.
 */
export const prerender = false;

export const GET: APIRoute = async ({ locals, cookies }) => {
  const env = getEnv(locals);
  const email = await getAdminEmail(cookies, env);
  if (!email) return json({ error: "unauthorized" }, 401);
  const store = getStore(locals);
  if (!store) return json({ error: "storage_unconfigured" }, 503);
  return json({ draft: await store.get("draft") });
};

export const PUT: APIRoute = async ({ locals, cookies, request, url }) => {
  const env = getEnv(locals);
  const email = await getAdminEmail(cookies, env);
  if (!email) return json({ error: "unauthorized" }, 401);
  if (!sameOriginOk(request, url)) return json({ error: "bad_origin" }, 403);
  const store = getStore(locals);
  if (!store) return json({ error: "storage_unconfigured" }, 503);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const changes = body?.changes;
  if (!changes || typeof changes !== "object" || Array.isArray(changes))
    return json({ error: "missing_changes" }, 400);

  const doc: DeckDoc = (await store.get("draft")) ?? {
    content: {},
    updatedAt: "",
    updatedBy: "",
  };

  const rejected: string[] = [];
  let applied = 0;
  for (const [slug, raw] of Object.entries(changes)) {
    if (!SLOT_SLUGS.has(slug) || typeof raw !== "string" || raw.length > MAX_SLOT_LENGTH) {
      rejected.push(slug);
      continue;
    }
    const clean = sanitizeFragment(raw);
    // An edit that lands back on the template default is stored as "no
    // override" — so template updates flow through instead of being pinned
    // by an identical stale copy.
    if (clean === slotDefault(slug)) {
      delete doc.content[slug];
    } else {
      doc.content[slug] = clean;
    }
    applied++;
  }

  const total = JSON.stringify(doc.content).length;
  if (total > 400_000) return json({ error: "draft_too_large" }, 413);

  doc.updatedAt = new Date().toISOString();
  doc.updatedBy = email;
  await store.put("draft", doc);
  return json({ ok: true, applied, rejected, updatedAt: doc.updatedAt });
};
