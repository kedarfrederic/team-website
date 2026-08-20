import type { APIRoute } from "astro";
import {
  getEnv,
  getSecret,
  verifyToken,
  signToken,
  isAllowedEmail,
  cookieHeader,
  ADMIN_COOKIE,
  noStoreHeaders,
} from "../../../lib/investor-deck/runtime";

/**
 * Google OAuth callback for deck admins.
 *
 * The id_token is verified via Google's tokeninfo endpoint (signature,
 * expiry and issuer checked server-side by Google) and then pinned to our
 * client id, verified-email status, and the admin allowlist. On success a
 * 7-day HMAC-signed session cookie is set.
 */
export const prerender = false;

const fail = (msg: string, status = 403) =>
  new Response(msg, { status, headers: noStoreHeaders({ "Content-Type": "text/plain" }) });

export const GET: APIRoute = async ({ url, locals }) => {
  const env = getEnv(locals);
  const clientId = env.INVESTOR_GOOGLE_CLIENT_ID;
  const clientSecret = env.INVESTOR_GOOGLE_CLIENT_SECRET;
  const secret = getSecret(env);
  if (!clientId || !clientSecret || !secret) return fail("Sign-in is not configured.", 503);

  const state = await verifyToken(url.searchParams.get("state"), secret);
  if (!state) return fail("Sign-in state expired or invalid. Start again at /investors.");
  const code = url.searchParams.get("code");
  if (!code) return fail("Google did not return a code.");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${url.origin}/api/investors/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return fail(`Token exchange failed (${tokenRes.status}).`, 502);
  const tokens: any = await tokenRes.json();
  if (!tokens.id_token) return fail("Google returned no id_token.", 502);

  const infoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`
  );
  if (!infoRes.ok) return fail("id_token verification failed.", 502);
  const info: any = await infoRes.json();

  if (info.aud !== clientId) return fail("Token audience mismatch.");
  if (info.email_verified !== "true" && info.email_verified !== true)
    return fail("Google email is not verified.");
  const email = String(info.email || "").toLowerCase();
  if (!email || !isAllowedEmail(email, env)) {
    return fail(
      `${email || "This account"} is not on the deck admin allowlist. Ask the owner to add you (INVESTOR_ADMIN_EMAILS).`
    );
  }

  const session = await signToken(
    { e: email, x: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 },
    secret
  );
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/investors",
      "Set-Cookie": cookieHeader(ADMIN_COOKIE, session, 7 * 24 * 3600),
      "Cache-Control": "private, no-store",
    },
  });
};
