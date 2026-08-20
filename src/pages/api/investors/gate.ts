import type { APIRoute } from "astro";
import {
  getEnv,
  getStore,
  getSecret,
  signToken,
  sha256Hex,
  cookieHeader,
  GATE_COOKIE,
  defaultConfig,
  type DeckConfig,
} from "../../../lib/investor-deck/runtime";

/**
 * Visitor passphrase check. Plain form POST from the gate page — on success
 * sets a 30-day signed cookie bound to the gate's password version, so
 * changing the passphrase invalidates every cookie issued before it.
 */
export const prerender = false;

export const POST: APIRoute = async ({ locals, request }) => {
  const env = getEnv(locals);
  const store = getStore(locals);
  const secret = getSecret(env);
  const back = (bad: boolean) =>
    new Response(null, {
      status: 303,
      headers: {
        Location: bad ? "/investors?bad=1" : "/investors",
        "Cache-Control": "private, no-store",
      },
    });

  if (!store || !secret) return back(true);
  const config: DeckConfig = (await store.get("config")) ?? defaultConfig();
  if (!config.gate.enabled || !config.gate.hash || !config.gate.salt) return back(false);

  let password = "";
  try {
    const form = await request.formData();
    password = String(form.get("password") ?? "");
  } catch {
    return back(true);
  }

  const hash = await sha256Hex(config.gate.salt + password);
  // constant-time compare
  let diff = hash.length === config.gate.hash.length ? 0 : 1;
  for (let i = 0; i < hash.length && diff === 0; i++)
    diff |= hash.charCodeAt(i) ^ config.gate.hash.charCodeAt(i);
  if (diff !== 0) return back(true);

  const token = await signToken(
    { v: config.gate.v, x: Math.floor(Date.now() / 1000) + 30 * 24 * 3600 },
    secret
  );
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/investors",
      "Set-Cookie": cookieHeader(GATE_COOKIE, token, 30 * 24 * 3600),
      "Cache-Control": "private, no-store",
    },
  });
};
