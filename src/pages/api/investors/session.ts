import type { APIRoute } from "astro";
import {
  getEnv,
  getSecret,
  verifyToken,
  signToken,
  cookieHeader,
  ADMIN_COOKIE,
  noStoreHeaders,
} from "../../../lib/investor-deck/runtime";

/**
 * Admin sign-in via platform handoff.
 *
 * The platform (app.teamrollouts.com) exposes an admin-only launcher —
 * GET /api/investor-deck/edit, linked from the Admin sidebar — which mints a
 * 2-minute HMAC token for the signed-in super_admin and redirects here. We
 * verify it with the shared secret (INVESTOR_SESSION_SECRET here ==
 * INVESTOR_DECK_HANDOFF_SECRET on the platform) and set the same admin
 * session cookie the rest of the deck API trusts. Being a platform
 * super_admin IS the credential — there is no separate sign-in for the deck.
 */
export const prerender = false;

const TOKEN_AUDIENCE = "investor-deck-handoff";

const fail = (msg: string, status = 403) =>
  new Response(msg, { status, headers: noStoreHeaders({ "Content-Type": "text/plain" }) });

export const GET: APIRoute = async ({ url, locals }) => {
  const env = getEnv(locals);
  const secret = getSecret(env);
  if (!secret) {
    return fail(
      "Deck sign-in is not configured: set INVESTOR_SESSION_SECRET on the Pages project (see INVESTOR-DECK.md).",
      503
    );
  }

  const payload = await verifyToken(url.searchParams.get("token"), secret);
  if (!payload || payload.aud !== TOKEN_AUDIENCE || typeof payload.e !== "string") {
    return fail(
      "This edit link expired or is invalid. Go back to the app's Admin sidebar and click Investor Deck again."
    );
  }

  const session = await signToken(
    { e: payload.e, x: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 },
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
