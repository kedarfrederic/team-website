import type { APIRoute } from "astro";
import { toHTML } from "@portabletext/to-html";
import { getInsightPosts, getInsightPostBySlug } from "../lib/queries";
import { sanityClient } from "../lib/sanity";

/**
 * RSS feed — built primarily for Naver.
 *
 * WHY THIS EXISTS. Naver Search Advisor asks for an XML sitemap *and* an RSS
 * feed. The RSS is a Naver-specific requirement with no Google equivalent, and
 * its guide asks for the FULL article body rather than an excerpt — the feed is
 * treated as a content source, not just a change notification. Naver is ~60%+
 * of Korean search by the dominant domestic measurement, so for the Korean
 * launch this is not an optional nicety.
 *
 * Hand-written rather than pulling in @astrojs/rss: full-body content and the
 * `content:encoded` element Naver reads are easier to control directly than to
 * coax out of a helper, and it avoids a dependency for one route.
 *
 * FULL BODY, not excerpt. That costs one extra Sanity query per post, which is
 * why this route is generated at build time (`prerender = true`) rather than
 * per request — a crawler hitting it should never fan out N queries.
 *
 * ENGLISH POSTS ONLY, deliberately. /insights has no Korean translation yet
 * (it is long-form editorial, and machine-translating it would be worse than
 * leaving it English). Advertising Korean URLs that do not exist is the
 * failure this codebase has already been bitten by; when Korean posts land,
 * add them here with their own <link> and the feed can carry both.
 */
export const prerender = true;

const SITE = "https://teamrollouts.com";

/** XML text escaping. Content goes in CDATA, so this is for attributes/titles. */
const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** CDATA cannot contain the terminator; split it so the body survives intact. */
const cdata = (s: string) => `<![CDATA[${String(s ?? "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

export const GET: APIRoute = async () => {
  const posts = (await getInsightPosts(sanityClient)) as Array<{
    title?: string;
    slug?: { current?: string };
    excerpt?: string;
    publishDate?: string;
    authorName?: string;
    category?: { title?: string };
  }>;

  const items = await Promise.all(
    (posts ?? [])
      .filter((p) => p?.slug?.current)
      .map(async (p) => {
        const url = `${SITE}/insights/${p.slug!.current}`;

        // Full body per Naver's guide. Failing to fetch one post must not take
        // the whole feed down — fall back to the excerpt for that item only.
        let body = "";
        try {
          const full = (await getInsightPostBySlug(p.slug!.current!, sanityClient)) as {
            body?: unknown;
          };
          if (Array.isArray(full?.body)) body = toHTML(full.body as never);
        } catch {
          body = "";
        }
        if (!body) body = `<p>${esc(p.excerpt ?? "")}</p>`;

        const date = p.publishDate ? new Date(p.publishDate).toUTCString() : "";

        return [
          "    <item>",
          `      <title>${cdata(p.title ?? "")}</title>`,
          `      <link>${esc(url)}</link>`,
          `      <guid isPermaLink="true">${esc(url)}</guid>`,
          date ? `      <pubDate>${esc(date)}</pubDate>` : "",
          p.authorName ? `      <dc:creator>${cdata(p.authorName)}</dc:creator>` : "",
          p.category?.title ? `      <category>${cdata(p.category.title)}</category>` : "",
          `      <description>${cdata(p.excerpt ?? "")}</description>`,
          `      <content:encoded>${cdata(body)}</content:encoded>`,
          "    </item>",
        ]
          .filter(Boolean)
          .join("\n");
      }),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"',
    '     xmlns:content="http://purl.org/rss/1.0/modules/content/"',
    '     xmlns:dc="http://purl.org/dc/elements/1.1/"',
    '     xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Team — Insights</title>",
    `    <link>${SITE}/insights</link>`,
    "    <description>Playbooks and release strategy for music operations.</description>",
    "    <language>en</language>",
    `    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
