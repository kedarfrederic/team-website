/**
 * Move the changelog into Sanity and backfill 18 Mar – 11 Aug 2026.
 *
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/import-changelog-backfill.mjs          # dry run
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/import-changelog-backfill.mjs --write  # apply
 *
 * The page reads `changelogEntry` from Sanity and only renders its hardcoded
 * FALLBACK_ENTRIES if that collection comes back empty. It does not, so adding
 * documents here is immediately live. No page change.
 *
 * SCOPE: the 77 backfill entries below ONLY, distilled from 1,127 `feat` commits
 * in the gap (the live changelog stopped at 17 March 2026).
 *
 * It does NOT import the pre-existing 52 — they are already in Sanity as
 * `chg-0`…`chg-51`, which is why the page has been rendering Sanity all along.
 * `FALLBACK_ENTRIES` in changelog.astro is a redundant mirror of them, not the
 * source. Importing them again under different ids would have duplicated every
 * one in production content; the pre-flight check below is what caught that.
 *
 * IDEMPOTENT: ids are derived deterministically from date + title, so re-running
 * updates in place instead of duplicating. Safe to run twice.
 *
 * DATES are commit dates — when the work shipped to staging. If the changelog is
 * meant to mean "available to you in production", these need shifting; that is a
 * single decision, applied here, not per entry.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const WRITE = process.argv.includes("--write");
const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (WRITE && !TOKEN) {
  console.error("SANITY_WRITE_TOKEN is required with --write");
  process.exit(1);
}

const client = createClient({
  projectId: "g1olb5am",
  dataset: "production",
  apiVersion: "2024-12-01",
  token: TOKEN,
  useCdn: false,
});

/* ── 1. the existing 52, lifted verbatim from the page ─────────────────── */
function parseExisting() {
  const src = readFileSync(join(HERE, "../src/pages/changelog.astro"), "utf8");
  const decl = "const FALLBACK_ENTRIES: Entry[] = [";
  const start = src.indexOf(decl);
  if (start === -1) throw new Error("FALLBACK_ENTRIES not found — did the page change?");
  // Anchor on the LAST character of the declaration, not `indexOf("[")`: the
  // first `[` after `start` is the one in the `Entry[]` type annotation, so
  // walking from there matches its `]` immediately and yields an empty array.
  const open = start + decl.length - 1;
  // Walk brackets so a nested array or a `]` inside a string can't end it early.
  let depth = 0, end = -1, inStr = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i], p = src[i - 1];
    if (inStr) { if (c === inStr && p !== "\\") inStr = null; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error("could not find the end of FALLBACK_ENTRIES");
  // eslint-disable-next-line no-new-func
  const rows = new Function(`return ${src.slice(open, end + 1)}`)();
  if (!Array.isArray(rows) || rows.length === 0) throw new Error("parsed no entries");
  for (const r of rows) {
    if (!r.releaseDate || !r.type || !r.title || !r.description)
      throw new Error(`incomplete existing entry: ${JSON.stringify(r).slice(0, 120)}`);
  }
  return rows;
}

/* ── 2. the backfill ───────────────────────────────────────────────────── */
// Headline per date group. The page renders it on the first entry of a date.
const HEADLINES = {
  "2026-08-11": "TeamMate AI on the Free plan",
  "2026-08-10": "Team on iOS, and self-service billing",
  "2026-08-07": "Large uploads, and tighter connector scopes",
  "2026-08-06": "Listening rooms, and a brain that shows its sources",
  "2026-07-30": "Archive, delete, restore",
  "2026-07-29": "Help centre, and localisation throughout",
  "2026-07-17": "New pricing, and signup in one screen",
  "2026-07-14": "Touring settlements, calendars and the memory graph",
  "2026-07-10": "Recipes, and full-scope connectors",
  "2026-07-08": "Audit trail",
  "2026-07-02": "Reconciliation, and answers you can act on",
  "2026-06-22": "Creator workspaces, and release units",
  "2026-06-21": "Roster is the home, with real streaming analytics",
  "2026-06-18": "Boards, and a new editorial interface",
  "2026-06-14": "A living strategy model, and a brain that watches",
  "2026-06-13": "The chat became a canvas",
  "2026-06-12": "Connect your tools",
  "2026-06-10": "Tour crew portal",
  "2026-05-15": "SMS rebuilt, and consent-based support",
  "2026-05-05": "Live updates",
  "2026-05-01": "Nine languages, and cross-language chat",
  "2026-04-27": "The full touring suite",
  "2026-04-22": "Pulse, and a timeline that tells you where you are",
  "2026-04-21": "Share assets properly",
  "2026-04-30": "Localisation, and Brand Kit v1.0",
  "2026-04-16": "Email both ways, and the knowledge graph",
  "2026-04-14": "DDEX-aligned track metadata",
  "2026-03-26": "The Rundown, and a warmer interface",
  "2026-03-24": "Chartmetric as the data spine",
  "2026-03-21": "Asset version control",
  "2026-03-19": "Formation",
};

const B = (releaseDate, type, title, description) => ({ releaseDate, type, title, description });

const BACKFILL = [
  // ── August ──
  B("2026-08-11", "new", "TeamMate AI on the Free plan", "Free now includes a metered daily TeamMate allowance after the trial, instead of nothing."),
  B("2026-08-10", "new", "Team on iOS", "The mobile app arrives: create an account, set up a release end to end, work your tasks, browse files, and pick up an agent conversation where you left it."),
  B("2026-08-10", "new", "Manage your own plan and card", "Change plan, update or remove a payment card, and see which plan you're on in the header — on web and mobile."),
  B("2026-08-07", "new", "Large file uploads that survive a bad network", "Multipart uploads for masters and large assets, resumable and checksum-verified, through the same pipeline on web and mobile."),
  B("2026-08-07", "new", "Point TeamMate at exactly the files you mean", "Pick a focus folder, or multi-select the files a connection may read. The selection bounds what a read can return, not just what it's asked for."),
  B("2026-08-07", "performance", "Waveforms load instantly", "Waveform peaks are stored once on upload instead of being decoded every time a track is played."),
  B("2026-08-06", "new", "Share a listening room, not a link", "One link per recipient, carrying the tracks you choose. Recipients identify themselves, leave notes pinned to the moment in the track, and can play straight from a comment."),
  B("2026-08-06", "improved", "The brain shows its sources", "The memory graph can say where it learned something, and the agent remembers actions it took in your connected tools."),
  B("2026-08-06", "improved", "Connected tools moved to the “+”", "Your connected tools are in the composer's “+” menu, not hidden behind “@”."),
  B("2026-08-09", "improved", "Roster moved into Settings", "Artist administration now lives at Settings → Workspace → Roster."),
  B("2026-08-03", "improved", "Undo a deleted release", "A deleted release can be found and restored."),

  // ── July ──
  B("2026-07-30", "new", "Archive, delete and restore", "Archive or delete a release or artist, browse what you've archived, and restore it — surviving a page reload. Deleted releases stop appearing in search, the graph and email answers."),
  B("2026-07-29", "new", "Help centre", "A searchable help centre covering account, security, API keys, billing, connection scopes and the Rundown — with its own language and theme controls, and usable on a phone."),
  B("2026-07-29", "improved", "Localised throughout", "Dates, numbers and currency follow your chosen language, with coverage checks that customer content can't fool."),
  B("2026-07-17", "new", "New pricing, and signup in one screen", "Pro moves to base-plus-seat pricing, Free gets unlimited collaborators, every signup gets a 14-day Pro trial, and choosing a plan and creating an account happen on one screen."),
  B("2026-07-14", "new", "Touring: settlements, P&L and contracts", "Export a settlement as PDF and a per-tour P&L as XLSX, set contract fields and upload the signed copy, and drag to reorder shows in the builder."),
  B("2026-07-14", "new", "Put your tour in your calendar", "Download a tour as iCal, or subscribe to a live webcal feed that updates itself as the routing changes."),
  B("2026-07-14", "new", "The memory graph is a real page", "Browse what the brain knows, click a node for the underlying facts and where they came from, see pre-computed dependency chains, and manage reconciliation anchors."),
  B("2026-07-14", "improved", "Connectors ask before they read", "Shared-workspace providers default to deny, and each release asks you to confirm which pages feed it."),
  B("2026-07-13", "improved", "Every release's assets in one place", "The artist Assets page rolls up assets from every release, grouped by release, in a rich grid you can upload straight into."),
  B("2026-07-18", "improved", "Tasks under budget line items", "Nest tasks beneath a budget line, roll their costs up, and attach files per task."),
  B("2026-07-10", "new", "Ask TeamMate to build the document", "New recipes compose a Notion database, a financial model, or a document — and can model the result on a database, sheet or doc you already use, remembering your format for next time."),
  B("2026-07-10", "new", "Notion, Airtable and Drive go full-scope", "Notion gains five reads and two writes, Airtable three reads and seven writes, Drive eight collaboration writes, and Calendar can move events and remove attendees."),
  B("2026-07-11", "new", "TeamMate can start a release or add an artist", "The agent can open a new rollout or add an artist workspace, not just work inside existing ones."),
  B("2026-07-08", "new", "Audit trail", "Every change records who did it, to what, and the old and new value — with a history you can read, scoped to your workspace, and personal data redacted at the source."),
  B("2026-07-02", "improved", "Facts reconcile from wherever you said them", "An ISRC typed into chat weeks ago, a value in a connected Notion page, or a number in an email now feed reconciliation — checked against the releases they're actually relevant to."),
  B("2026-07-02", "improved", "Answers you can act on", "Agent replies render metadata and track cards instead of prose, completed actions deep-link to the thing they changed, clarifying questions arrive as tappable cards, and working steps stream live."),

  // ── June ──
  B("2026-06-12", "new", "Connect your tools", "A Sources page and an in-chat connect flow bring Notion, Drive, Slack, Airtable and the rest into the workspace, with per-connection health, real logos and one-click disconnect."),
  B("2026-06-12", "new", "Everything you feed it reaches the brain", "A single ingestion path takes uploads, email attachments and connector content into the brain with full lineage, so what you feed it is traceable to where it came from."),
  B("2026-06-13", "new", "The chat became a canvas", "Answers now carry source citations, render charts from real numbers, drill down into the underlying panel, and queue proposals you can apply in one tap — and the canvas survives a reload."),
  B("2026-06-13", "new", "Brain briefing", "A periodic digest of what the brain has learned, deduplicated and linked to a shareable briefing page."),
  B("2026-06-13", "improved", "The insight engine got sharper", "Eight analytical lenses now, including streaming momentum, DSP-editorial and audience gaps, with charts attached and budget insights surfaced in chat."),
  B("2026-06-18", "new", "“Show me on the board”", "TeamMate composes a live board to answer a substantive question — territories on a real map, comparisons, plans — and boards version as they change, so you can open any earlier revision."),
  B("2026-06-18", "improved", "A new editorial interface", "Content, Budget, Timeline, Assets, Pulse, the Rundown, DSP Priorities and the workspace shell were all rebuilt to the new editorial design."),
  B("2026-06-14", "new", "A living strategy model", "Team derives your audience rather than asking for it, then closes the loop: propose, confirm, reflect. Reports at any scope, kept current as the picture changes."),
  B("2026-06-14", "new", "The brain watches, and proposes", "Change capture across your rollout feeds a grounded reaction engine that drafts proposals with provenance, asks vigilance questions when something looks off, and texts you when it matters. You set how forward it is."),
  B("2026-06-21", "new", "Roster is the home", "An artist-first home: your roster front and centre, richer artist cards with hover snapshots, starred talent, context-aware search, and a workspace scoped per artist."),
  B("2026-06-21", "new", "Streaming analytics", "Stream metrics consolidated into a purpose-built analytics store, with per-track trends, deep historical backfill on artist add, and grounded cohort benchmarks."),
  B("2026-06-21", "improved", "Proposals tell you what happened", "Applying a proposal gives a real in-page receipt naming the change and where it landed — successes and failures both — plus bulk accept and dismiss in the review queue."),
  B("2026-06-22", "new", "Creator workspaces", "Add a creator as well as an artist, with talent-aware language throughout, DNA research on create, and social footprint auto-discovery."),
  B("2026-06-22", "new", "Add a single to an existing EP or album", "A release-unit model underneath means a single can join a release you've already started, and creating an album or EP builds its shell for you."),
  B("2026-06-22", "improved", "Rename and delete a release", "The missing edit affordances, plus create is now idempotent so a double-submit can't duplicate a release."),
  B("2026-06-10", "new", "Tour crew portal", "Invite tour team and external collaborators by email, run a real advance-to-venue thread, share a full-fidelity day sheet, and roll settlements up per tour — with role-aware access."),
  B("2026-06-10", "improved", "SMS understands which release you mean", "Fuzzy matching on release names, numbered disambiguation when it's unsure, and audio attachments get a friendly refusal rather than silence."),
  B("2026-06-23", "improved", "Asset version control", "Update an asset, keep its history, restore an earlier version, and link or unlink versions to each other."),
  B("2026-06-17", "improved", "Territories that know their places", "464 major cities across 110 countries, with disambiguation when two places share a name."),

  // ── May ──
  B("2026-05-15", "new", "SMS, rebuilt", "A hybrid engine — language understanding for questions, deterministic paths for changes — on a durable outbound queue with delivery receipts, explicit release switching, and relative dates resolved before anything runs."),
  B("2026-05-15", "new", "Support can see your screen, if you let it", "Access requests you approve explicitly, with a full audit trail, and live screen co-browsing folded into the same permission flow."),
  B("2026-05-15", "improved", "Trials and plans", "A universal 30-day Pro trial, Free/Pro alignment, tier gating, and self-service billing through the Stripe portal."),
  B("2026-05-05", "new", "Live updates", "The timeline, chat history, notification bell and activity strip update themselves as things change, without a refresh."),
  B("2026-05-01", "new", "Nine languages, and cross-language chat", "German, Hindi, Mandarin and Arabic join the set, and messages auto-translate for whoever is reading, so a thread can span languages."),
  B("2026-05-10", "improved", "Sign-in and signup match the brand", "The auth screens and onboarding panels were redesigned to the marketing aesthetic."),

  // ── April ──
  B("2026-04-21", "new", "Share assets properly", "Share links with per-recipient access, inline previews, per-asset comments and threaded replies, passcode gates, a download toggle you control, and notifications when someone comments."),
  B("2026-04-21", "new", "Live Status dashboard", "A shareable, full-page live dashboard with interactive tasks and comments, in a new editorial design."),
  B("2026-04-21", "improved", "Video plays in the browser", "MOV, AVI and MKV are transcoded to MP4 on upload, and uploads go straight to storage with presigned URLs."),
  B("2026-04-17", "new", "Team Mode for SMS", "Group messaging with TeamMate in the thread — quiet unless addressed — plus action receipts, sticky context, and asset retrieval and share links over text."),
  B("2026-04-16", "new", "Email that works both ways", "Inbound email surfaces in chat as a notification card, and TeamMate composes outbound email on your behalf with a draft-confirm-send step. Address it with @teammate to have it act."),
  B("2026-04-16", "new", "The knowledge graph", "Team's memory moves onto a purpose-built graph of entities, relationships and memories, with a fullscreen visualisation you can open from chat."),
  B("2026-04-16", "improved", "Chat conversations", "Named, persistent conversations with a history switcher, a New Chat button, and a Stop button to cancel a running response."),
  B("2026-04-15", "new", "Feed the knowledge base", "Upload documents from the release panel, ingest from a URL, and have chat attachments vectorised automatically — with permissions and traceability throughout."),
  B("2026-04-22", "new", "Pulse", "A live data intelligence hub replacing the old Intelligence tab: insights first, dependency chains and references, interactive multi-platform charts, and reasoning you can trigger on demand."),
  B("2026-04-22", "improved", "The timeline tells you where you are", "A live countdown that shifts colour as release day approaches, singles as date bars, milestone flags, asset thumbnails on task cards, and search and filtering."),
  B("2026-04-27", "new", "The full touring suite", "Advance view, day sheets with pack mode and distribution, pipeline, deals, settlements, documents, technical and catering specs, guest lists and marketing — with full backline detail."),
  B("2026-04-14", "new", "DDEX-aligned track metadata", "Proper track metadata with publishing and rights contributors, a Spotify featured-artist picker, subgenre search, and shareable track links."),
  B("2026-04-30", "improved", "Automatic translation, everywhere", "Whole-interface translation with the agent answering in your language."),
  B("2026-04-30", "improved", "Brand Kit v1.0 across the platform", "Design tokens, buttons, cards and dialogs aligned to the brand, with accessibility hardening and dark-mode fixes throughout."),
  B("2026-04-24", "improved", "Feed it a screenshot", "Images and screenshots are read on upload, so a chart you paste in becomes something the brain can use."),
  B("2026-04-23", "improved", "More streaming sources", "Apple Music streams, daily Shazam data and chart positions join the picture, with metric time-series and completeness scoring."),

  // ── March (18–31); the live changelog already covers up to the 17th ──
  B("2026-03-26", "new", "The Rundown", "Auto-generated artist press kits — achievements, press, RIYL, contacts and platform logos — in motion-animated templates, with a full editor and discography pulled from Chartmetric."),
  B("2026-03-26", "improved", "A warmer, glassier interface", "Artist Intelligence, Budget, DSP Priorities, Ready to Roll, the Asset Library, Command Center, Content & Tracks and the Release Pipeline were all visually rebuilt."),
  B("2026-03-24", "new", "Chartmetric as the data spine", "Chartmetric replaces the previous providers as the primary data source, with multi-platform streaming sync, a live stats header and cross-platform track stats."),
  B("2026-03-24", "new", "Actionable intelligence", "Anomaly detection, LLM-written insights with full context rather than templates, web mining, daily deltas, comparables and a Release Performance tab with per-track sparklines."),
  B("2026-03-21", "new", "Asset version control", "Auto-versioning with manual linking, a full audit trail for every asset operation, and file conversion on download with per-platform presets."),
  B("2026-03-21", "improved", "The brain sees every change", "Every data change is captured and attributed, so TeamMate can answer “who did what” — and learnings carry across releases."),
  B("2026-03-21", "performance", "Faster asset library", "Cursor pagination, server-side filtering and WebP thumbnails."),
  B("2026-03-20", "improved", "Strategy that knows your stage", "Strategy intelligence keyed to career stage, genre and budget, with proactive alerts and a “remember this” command."),
  B("2026-03-19", "new", "Formation", "An interactive artist-management learning platform — 13 courses and 82 lessons with interactive modules and personalised scenarios."),
];

/* ── build the documents ───────────────────────────────────────────────── */
const slug = (s) =>
  s.toLowerCase().replace(/[’'“”"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

function toDocs(rows, { headlines = false } = {}) {
  // sortWithinDate follows array order within each date, so the ordering here
  // is the ordering on the page.
  const seen = new Map();
  return rows.map((r) => {
    const n = seen.get(r.releaseDate) ?? 0;
    seen.set(r.releaseDate, n + 1);
    const doc = {
      // NO DOT IN THE ID. Sanity treats any document whose `_id` contains a `.`
      // as private — the same mechanism that hides `drafts.`-prefixed docs — so
      // it is readable with a token and INVISIBLE to anonymous readers. The
      // public site reads anonymously, so a `changelogEntry.<date>-<slug>` id
      // published 77 entries that the page could never render: the token saw
      // 129, the site saw 52, and the doc endpoint said `"reason":"permission"`.
      // The pre-existing entries use dot-free `chg-N`; match that.
      _id: `chg-${r.releaseDate}-${slug(r.title)}`,
      _type: "changelogEntry",
      releaseDate: r.releaseDate,
      type: r.type,
      title: r.title,
      description: r.description,
      sortWithinDate: n,
    };
    // Existing rows carry their own groupHeadline; backfill rows get one from
    // the map, and only on the first entry of a date (which is where the page
    // reads it).
    const gh = headlines ? (n === 0 ? HEADLINES[r.releaseDate] : undefined) : r.groupHeadline;
    if (gh) doc.groupHeadline = gh;
    return doc;
  });
}

/* ── pre-flight: what is ALREADY in Sanity ─────────────────────────────────
   The collection is NOT empty and never was. Sanity already holds the 52
   pre-existing entries (ids `chg-0`…), so the live page has been rendering
   Sanity all along and `FALLBACK_ENTRIES` in the page is a redundant mirror,
   not the source. This script therefore ONLY adds the gap; importing the
   existing 52 again under different ids would have duplicated every one of
   them in production content.
   parseExisting() is still used, but as a CHECK: if the page's mirror and the
   collection disagree on how many pre-gap entries exist, something has drifted
   and that is worth knowing before writing. */
const GAP_START = "2026-03-18";
const already = await client.fetch(
  `{"pre": count(*[_type=="changelogEntry" && releaseDate < $g]),
     "inGap": count(*[_type=="changelogEntry" && releaseDate >= $g])}`,
  { g: GAP_START },
);
const mirrored = parseExisting();
console.log(`  already in Sanity before ${GAP_START} : ${already.pre}`);
console.log(`  already in Sanity within the gap      : ${already.inGap}`);
console.log(`  page's fallback mirror holds          : ${mirrored.length}`);
if (already.pre !== mirrored.length) {
  console.log(
    `  ! the collection and the page's fallback disagree (${already.pre} vs ${mirrored.length}).` +
      " Not fatal — the fallback only renders if the collection is empty — but they have drifted.",
  );
}
if (already.inGap > 0) {
  console.log(
    `  ! ${already.inGap} entries already exist on or after ${GAP_START}.` +
      " Re-running is safe (ids are deterministic), but check for near-duplicates from another source.",
  );
}

const docs = toDocs(BACKFILL, { headlines: true });

const ids = new Set();
for (const d of docs) {
  if (ids.has(d._id)) throw new Error(`duplicate id: ${d._id} — two entries share a date + title`);
  ids.add(d._id);
}

const byMonth = {};
for (const d of docs) (byMonth[d.releaseDate.slice(0, 7)] ??= []).push(d);

console.log(`  backfill entries to upsert            : ${docs.length}`);
console.log("  by month:");
for (const m of Object.keys(byMonth).sort()) console.log(`    ${m}  ${byMonth[m].length}`);
const missing = [...new Set(BACKFILL.map((b) => b.releaseDate))].filter((d) => !HEADLINES[d]);
if (missing.length) console.log(`  NOTE dates with no headline: ${missing.join(", ")}`);

if (!WRITE) {
  console.log("\n  dry run — nothing written. Re-run with --write to apply.");
  process.exit(0);
}

/* Clean up the dotted ids from the first, broken run — see the note on `_id`
   above. Deliberately narrow: only ids matching the exact prefix this script
   used, only where a dot-free replacement now exists, and never anything
   `drafts.`-prefixed (deleting a draft for a new id destroyed a real document
   once). Anything unexpected is reported and left alone. */
// Filter in JS, not GROQ: `_id match "changelogEntry.*"` returns NOTHING because
// GROQ's `match` is token-based and a `.` is a token separator, so it never
// behaves as a prefix glob. That silently found 0 stale ids and left 77
// unreadable documents in place on the first attempt.
const allIds = await client.fetch(`*[_type=="changelogEntry"]._id`);
const stale = allIds.filter((id) => id.startsWith("changelogEntry."));
const wanted = new Set(docs.map((d) => d._id));
const removable = stale.filter(
  (id) => id.startsWith("changelogEntry.") && !id.startsWith("drafts.") && wanted.has(`chg-${id.slice("changelogEntry.".length)}`),
);
const skipped = stale.filter((id) => !removable.includes(id));
if (stale.length) {
  console.log(`\n  stale dotted ids found : ${stale.length}`);
  console.log(`  will delete            : ${removable.length}`);
  if (skipped.length) console.log(`  LEFT ALONE (unmatched) : ${skipped.join(", ")}`);
}

const tx = docs.reduce((t, d) => t.createOrReplace(d), client.transaction());
for (const id of removable) tx.delete(id);
await tx.commit();
console.log(`\n  ✓ upserted ${docs.length} changelogEntry documents`);
if (removable.length) console.log(`  ✓ deleted ${removable.length} unreadable dotted-id documents`);

const live = await client.fetch(`count(*[_type == "changelogEntry"])`);
console.log(`  ✓ collection now holds ${live} entries`);
console.log("  The page prefers Sanity over its hardcoded fallback, so this is now live.");
