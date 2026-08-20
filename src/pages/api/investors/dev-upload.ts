import type { APIRoute } from "astro";

/**
 * DEV-ONLY asset drop. Accepts a base64 body and writes it to the scratch
 * file named in the query, under .dev-uploads/ at the repo root. Compiled
 * out of production builds entirely (the DEV guard is statically false),
 * and never registered anywhere else. Used for one-off asset transfers
 * during design work (e.g. pulling a headshot out of a browser session).
 */
export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  if (!import.meta.env.DEV) return new Response("not found", { status: 404 });
  const name = (url.searchParams.get("name") || "upload.bin").replace(/[^a-zA-Z0-9._-]/g, "");
  const b64 = (await request.text()).replace(/^data:[^,]*,/, "");
  const fs = await import(/* @vite-ignore */ "node:" + "fs");
  fs.mkdirSync(".dev-uploads", { recursive: true });
  fs.writeFileSync(`.dev-uploads/${name}`, Buffer.from(b64, "base64"));
  return new Response(JSON.stringify({ ok: true, name, bytes: b64.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
