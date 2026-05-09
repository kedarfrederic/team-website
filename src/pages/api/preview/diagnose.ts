import type { APIRoute } from "astro";

/**
 * Diagnostic endpoint — returns what preview detection sees and whether
 * the env vars needed for the preview client are reachable. Does NOT
 * leak any token values; returns booleans only.
 *
 * Curl usage:
 *   curl -s 'https://team-website-6ur.pages.dev/api/preview/diagnose'
 *   curl -s 'https://team-website-6ur.pages.dev/api/preview/diagnose?preview=1'
 *   curl -s 'https://team-website-6ur.pages.dev/api/preview/diagnose' --cookie 'sanity-preview=1'
 */
export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, request, locals }) => {
  const runtimeEnv = (locals as any)?.runtime?.env ?? {};

  const cookieValue = (() => {
    try {
      return cookies.get("sanity-preview")?.value ?? null;
    } catch {
      return null;
    }
  })();

  const rawCookieHeader = request.headers.get("cookie") ?? "";
  const queryParam = url.searchParams.get("preview");

  const previewSignals = {
    cookieValue,
    rawCookieHeader,
    cookieRegexMatch: /(?:^|;\s*)sanity-preview=1(?:;|$)/.test(rawCookieHeader),
    queryParam,
    finalDecision:
      cookieValue === "1" ||
      /(?:^|;\s*)sanity-preview=1(?:;|$)/.test(rawCookieHeader) ||
      queryParam === "1",
  };

  const envReachability = {
    runtimeBindingPresent: Boolean((locals as any)?.runtime?.env),
    SANITY_API_READ_TOKEN_runtime: Boolean(runtimeEnv.SANITY_API_READ_TOKEN),
    SANITY_API_READ_TOKEN_buildtime: Boolean(import.meta.env.SANITY_API_READ_TOKEN),
    SANITY_PREVIEW_SECRET_runtime: Boolean(runtimeEnv.SANITY_PREVIEW_SECRET),
    SANITY_PREVIEW_SECRET_buildtime: Boolean(import.meta.env.SANITY_PREVIEW_SECRET),
    PUBLIC_SANITY_STUDIO_URL_buildtime: import.meta.env.PUBLIC_SANITY_STUDIO_URL ?? null,
  };

  return new Response(
    JSON.stringify(
      {
        url: url.toString(),
        previewSignals,
        envReachability,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    }
  );
};
