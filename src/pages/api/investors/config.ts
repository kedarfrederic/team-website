import type { APIRoute } from "astro";
import {
  getEnv,
  getStore,
  getAdminEmail,
  sha256Hex,
  json,
  sameOriginOk,
  defaultConfig,
  type DeckConfig,
} from "../../../lib/investor-deck/runtime";

/**
 * Gate settings (admin only).
 *
 * GET -> {gate: {enabled, hasPassword}}
 * PUT -> {gateEnabled: boolean, password?: string}
 *        Setting a password stores salt + SHA-256 and bumps the gate version
 *        (revoking every previously-issued visitor cookie). Enabling the gate
 *        requires a password to exist.
 */
export const prerender = false;

export const GET: APIRoute = async ({ locals, cookies }) => {
  const env = getEnv(locals);
  if (!(await getAdminEmail(cookies, env))) return json({ error: "unauthorized" }, 401);
  const store = getStore(locals);
  if (!store) return json({ error: "storage_unconfigured" }, 503);
  const config: DeckConfig = (await store.get("config")) ?? defaultConfig();
  return json({ gate: { enabled: config.gate.enabled, hasPassword: !!config.gate.hash } });
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

  const config: DeckConfig = (await store.get("config")) ?? defaultConfig();

  if (typeof body.password === "string" && body.password.length > 0) {
    if (body.password.length < 6) return json({ error: "password_too_short" }, 400);
    const salt = crypto.randomUUID();
    config.gate.salt = salt;
    config.gate.hash = await sha256Hex(salt + body.password);
    config.gate.v = (config.gate.v || 1) + 1;
  }

  if (typeof body.gateEnabled === "boolean") {
    if (body.gateEnabled && !config.gate.hash)
      return json({ error: "no_password_set" }, 400);
    config.gate.enabled = body.gateEnabled;
  }

  await store.put("config", config);
  return json({ gate: { enabled: config.gate.enabled, hasPassword: !!config.gate.hash } });
};
