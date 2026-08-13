/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /**
     * Locale for the current request, derived from the URL path by
     * src/middleware.ts. Never from geography — see src/lib/i18n.ts for why.
     */
    locale: import("./lib/i18n").Locale;
    /**
     * The path with its locale prefix removed: `/ko/pricing` → `/pricing`.
     * This is the key both locales' versions of a page share, so it is what
     * hreflang alternates and language switching are computed from.
     */
    basePath: string;
  }
}
