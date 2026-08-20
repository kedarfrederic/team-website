import type { APIRoute } from "astro";
import { getEnv, getSecret, signToken, noStoreHeaders } from "../../../lib/investor-deck/runtime";

/**
 * Start the Google sign-in for deck admins.
 *
 * Standard authorization-code flow. The state parameter is an HMAC-signed,
 * 10-minute token so the callback can reject forged or replayed states
 * without any server-side session storage.
 */
export const prerender = false;

export const GET: APIRoute = async ({ url, locals, redirect }) => {
  const env = getEnv(locals);
  const clientId = env.INVESTOR_GOOGLE_CLIENT_ID;
  const secret = getSecret(env);
  if (!clientId || !secret) {
    return new Response(
      "Sign-in is not configured yet. Set INVESTOR_GOOGLE_CLIENT_ID, INVESTOR_GOOGLE_CLIENT_SECRET and INVESTOR_SESSION_SECRET (see INVESTOR-DECK.md).",
      { status: 503, headers: noStoreHeaders({ "Content-Type": "text/plain" }) }
    );
  }

  const state = await signToken(
    { n: crypto.randomUUID(), x: Math.floor(Date.now() / 1000) + 600 },
    secret
  );
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.searchParams.set("client_id", clientId);
  auth.searchParams.set("redirect_uri", `${url.origin}/api/investors/callback`);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", "openid email");
  auth.searchParams.set("state", state);
  auth.searchParams.set("prompt", "select_account");
  return redirect(auth.toString(), 302);
};
