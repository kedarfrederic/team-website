/**
 * Backfill the changelog 12 Aug – 18 Sep 2026, and correct the iOS entry.
 *
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/import-changelog-2026-09.mjs          # dry run
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/import-changelog-2026-09.mjs --write  # apply
 *
 * Continues scripts/import-changelog-backfill.mjs, which took the collection to
 * 11 August 2026 and is where the conventions below come from: dot-free ids,
 * deterministic from date + title, one groupHeadline per date on the first
 * entry, sortWithinDate following array order.
 *
 * SCOPE — two things:
 *
 * 1. 37 entries for 14 Aug – 17 Sep 2026, distilled from 2,004 commits in the
 *    gap (165 feat, 898 fix, 50 perf).
 *
 * 2. A correction to `chg-2026-08-10-team-on-ios`, which said "The mobile app
 *    arrives". It has not: the iOS app is built and in TestFlight, awaiting
 *    App Store release. The entry now says built-ahead-of-launch, and the new
 *    mobile entries below are worded the same way.
 *
 * ONLY WHAT IS IN PRODUCTION. `origin/release/prod` is an ancestor of the main
 * line, 150 commits behind, tip 18 Sep — so everything here shipped to
 * customers. The 21–22 Sep work (agent truthfulness fixes out of the TikTok
 * campaign demo) is staging-only and deliberately absent.
 *
 * ALSO DELIBERATELY ABSENT: the Korea localisation work, which is on prod but
 * dark — `tier_prices` carries no KRW rows, so Korean readers still see USD.
 * Announcing won pricing would be announcing something nobody can buy.
 *
 * IDEMPOTENT: ids derive from date + title, so re-running updates in place.
 */
import { createClient } from "@sanity/client";

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

/* ── 1. the correction ─────────────────────────────────────────────────── */
const IOS_FIX = {
  _id: "chg-2026-08-10-team-on-ios",
  groupHeadline: "Team for iOS, and self-service billing",
  title: "Team for iOS, built ahead of launch",
  description:
    "The iOS app is built and in internal testing ahead of its App Store release: create an account, set up a release end to end, work your tasks, browse files, and pick up an agent conversation where you left it.",
};

/* ── 2. the backfill ───────────────────────────────────────────────────── */
const HEADLINES = {
  "2026-09-17": "The brain cites its sources",
  "2026-09-15": "Instant clicks, and a task that opens",
  "2026-09-10": "Tour money, by permission",
  "2026-09-07": "A lighter first load",
  "2026-09-03": "The app answers the click",
  "2026-08-31": "The iOS app, ahead of launch",
  "2026-08-29": "Brand deals, and one Daily Brief",
  "2026-08-26": "Creator campaigns",
  "2026-08-21": "Release Intelligence, in one place",
  "2026-08-20": "The release sequence, with industry lead times",
  "2026-08-19": "A knowledge spine",
  "2026-08-14": "Email and documents become work you can approve",
};

const B = (releaseDate, type, title, description) => ({ releaseDate, type, title, description });

const BACKFILL = [
  // ── September ──
  B("2026-09-17", "new", "Every insight cites the facts behind it",
    "Documents, chat and connected tools write into one fact ledger, and the reasoner names the facts it reasoned from — so a card can be checked rather than believed."),
  B("2026-09-17", "improved", "Today covers the whole roster",
    "One ranked feed across the workspace, so Today reflects every release rather than the handful it happened to read. Mobile's new signals read the same feed."),
  B("2026-09-17", "improved", "TeamMate settles which task you mean first",
    "An ambiguous task name asks which one you meant, a question asked twice still resumes the request it interrupted, and a new request is never attached to a stale clarifying question."),
  B("2026-09-17", "fixed", "Money is said as money",
    "Figures are never shown in raw minor units, a payment milestone is a receivable rather than a key date, and a card clears when its contradiction is fixed — and comes back if it recurs."),
  B("2026-09-17", "new", "A connection that stops feeding a release says so",
    "A nightly pass raises a disconnect card against the release the connection actually feeds, instead of retrying quietly in the background."),

  B("2026-09-15", "fixed", "Opening a task crashed the timeline",
    "Opening a task from the timeline could take the page down. Fixed — and the rule that caused it is now enforced in CI, so the class of bug can't come back."),
  B("2026-09-15", "improved", "Your clicks paint instantly",
    "Task taps and TeamMate's writes appear the moment they're saved, on web and mobile, a refused change comes back off the screen, and “Open” keeps you inside the release you're already in."),
  B("2026-09-15", "fixed", "Task requests keep the date you wrote",
    "“Create a task on the 14th for the video edit” keeps its date and its subject, an existing task with the same title is never reported as newly created, and a release chat keeps its first question and answer in one conversation."),

  B("2026-09-10", "improved", "Tour financials follow permission",
    "Guarantees, ticket prices and settlement figures are hidden from members without financial access — on what they can read and on what they can write."),
  B("2026-09-10", "fixed", "The touring map lost its basemap",
    "The map's tile provider retired the free tiles it used, leaving “API KEY REQUIRED” across the map. It draws again."),

  B("2026-09-07", "performance", "Less weight on first load",
    "The sign-in page was shipping a 4.9 MB logo, artist avatars were shipping a full-size original into a 24-pixel circle, and two developer-only tools were going out to customers on every page load."),
  B("2026-09-07", "performance", "Write paths that answer immediately",
    "Inline roster edits, the venue thread and the hottest write paths paint at once instead of waiting on the round trip."),

  B("2026-09-03", "performance", "The workspace opens in one read",
    "One read serves what the workspace opens with, heavy panels and charts stay out of the first paint, and switching workspace no longer throws away everything already loaded."),
  B("2026-09-03", "performance", "Typing, filtering and searching keep up",
    "A keystroke re-renders the list rather than every card in it, filter changes hold their rows instead of blanking, and the composer echoes what you type straight away."),
  B("2026-09-03", "fixed", "Live updates actually land",
    "Changes your teammates make reach your page — the live updates had been matching nothing — and one change no longer refreshes a release four times over."),
  B("2026-09-03", "fixed", "Edits that looked saved and weren't",
    "Subtask checkboxes save, a failed subtask write no longer discards every edit made since, a second edit to the same touring section no longer drops the first, and a sent message appears immediately — and comes back to you if the send fails."),

  // ── August ──
  B("2026-08-31", "new", "Files you've opened work offline",
    "In the iOS app — built and in internal testing ahead of its App Store release — files you've opened stay available without a connection, and background refresh adapts to the network you're on."),
  B("2026-08-31", "improved", "Mobile navigation, rebuilt",
    "Core navigation redesigned, release workflows you can drive visually, notification taps that land on the right screen, and a Today that groups repeated decisions instead of listing them again."),
  B("2026-08-31", "improved", "TeamMate asks before destructive changes",
    "Deleting or overwriting something now needs a confirmation the agent has to get from you, rather than happening on the strength of one sentence."),
  B("2026-08-31", "fixed", "Key dates were a day early",
    "For readers in US time zones, the agent and SMS recited key dates one day before the real date."),

  B("2026-08-29", "new", "Brand collaboration proposals, end to end",
    "A deal desk carrying compensation, rights, exclusivity and compliance, with version history, change orders, invoice and delivery provenance, and a secure conversation per recipient."),
  B("2026-08-29", "new", "One Daily Brief per person",
    "One editorial brief each morning covering every workspace you're in, scoped to what you're allowed to see, carrying your overdue and due-soon tasks, with a personalised subject and an unsubscribe that works — and no more double sends."),
  B("2026-08-29", "improved", "Budget answers you can look at",
    "A budget answer over SMS links to a visual breakdown that needs no login, and a chat budget summary no longer says “$0 planned” beside real line items."),

  B("2026-08-26", "new", "A campaign-native creator workspace",
    "Creators work in campaigns rather than releases: briefs seeded at creation, deliverables linked to the work on the timeline, and platform priorities that speak in posts and clips rather than DSPs."),
  B("2026-08-26", "new", "The money side of a campaign",
    "Receivable milestones, a cash activity ledger, and payment attention that's honest about what is actually owed versus merely expected."),
  B("2026-08-26", "new", "Evidence behind the results",
    "A deliverable binds to the published post it became, carries the performance numbers behind it, and keeps its own review history."),

  B("2026-08-21", "new", "A release Intelligence hub",
    "Proposals and knowledge in one tab on web and mobile — proposals grouped by category so a long queue stays readable, the release's documents beside them, and counts that agree across both surfaces."),
  B("2026-08-21", "new", "Turn a signal into an action",
    "A high-confidence signal becomes a one-tap draft action you can review and apply, and “Add to brain” keeps something worth remembering as a memory TeamMate recalls later."),
  B("2026-08-21", "improved", "TeamMate knows a UPC from an ISRC",
    "The agent understands the catalogue identifier model — a UPC identifies the release, an ISRC identifies the track — and “lead single” is a real role you can set per track."),

  B("2026-08-20", "new", "The release sequence knows what comes before what",
    "A dated, ordered graph of the steps in a rollout, so a missing step is named along with the reason it matters and the work it holds up."),
  B("2026-08-20", "improved", "Lead times that match the artist's stage",
    "Sequence lead times come from sourced, human-reviewed industry norms and adjust to career stage, instead of one generic calendar for everyone."),

  B("2026-08-19", "new", "Upload a document, get proposals you can review",
    "Anything you upload is read on arrival and turned into proposals you approve or dismiss. Nothing promotes itself into your workspace."),
  B("2026-08-19", "new", "See every source the brain reads",
    "A source index on web and mobile lists what has been ingested, where it came from and how fresh it is, with a sweep that marks what has gone stale."),
  B("2026-08-19", "improved", "What the brain remembers, and how much to trust it",
    "Remembered facts carry an authority level and an age, a newer fact supersedes the one it contradicts, and a recalled memory says how old it is when the agent leans on it."),

  B("2026-08-14", "new", "One email, one piece of work",
    "A release party arriving by email becomes one task with its parts underneath, instead of four unrelated ones, and the proposals from a single email stack as a family rather than four separate pages."),
  B("2026-08-14", "improved", "Extractions have the work behind them",
    "“1 task extracted · $2,700 budget update” now opens onto the actual change, and deleting the document retracts the drafts it produced."),
  B("2026-08-14", "improved", "Insights show the grain behind the number",
    "Insight and drift cards name the documents they came from and the grain of the figures they quote — daily or weekly, one platform or all of them — and carry both figures when they disagree."),
];

/* ── build the documents ───────────────────────────────────────────────── */
const slug = (s) =>
  s.toLowerCase().replace(/[’'“”"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

function toDocs(rows) {
  // sortWithinDate follows array order within each date, so the ordering here
  // is the ordering on the page. No dot in the id: Sanity treats a dotted _id
  // as private and the public site reads anonymously.
  const seen = new Map();
  return rows.map((r) => {
    const n = seen.get(r.releaseDate) ?? 0;
    seen.set(r.releaseDate, n + 1);
    const doc = {
      _id: `chg-${r.releaseDate}-${slug(r.title)}`,
      _type: "changelogEntry",
      releaseDate: r.releaseDate,
      type: r.type,
      title: r.title,
      description: r.description,
      sortWithinDate: n,
    };
    if (n === 0 && HEADLINES[r.releaseDate]) doc.groupHeadline = HEADLINES[r.releaseDate];
    return doc;
  });
}

/* ── pre-flight ────────────────────────────────────────────────────────── */
const GAP_START = "2026-08-12";

const before = await client.fetch(
  `{"total": count(*[_type=="changelogEntry"]),
     "inGap": count(*[_type=="changelogEntry" && releaseDate >= $g]),
     "ios": *[_id == $ios][0]{title, description, groupHeadline}}`,
  { g: GAP_START, ios: IOS_FIX._id },
);

console.log(`  collection currently holds            : ${before.total}`);
console.log(`  already present on or after ${GAP_START}  : ${before.inGap}`);
if (before.inGap > 0) {
  console.log("  ! re-running is safe (ids are deterministic), but check for near-duplicates.");
}
if (!before.ios) {
  // Not fatal: the backfill is the bulk of the value. But say so loudly — a
  // silently-skipped correction is the whole reason this run exists.
  console.log(`  ! ${IOS_FIX._id} NOT FOUND — the iOS wording correction will be SKIPPED.`);
} else {
  console.log(`  iOS entry title now                   : ${before.ios.title}`);
  console.log(`  iOS entry title after                 : ${IOS_FIX.title}`);
}

const docs = toDocs(BACKFILL);

const ids = new Set();
for (const d of docs) {
  if (ids.has(d._id)) throw new Error(`duplicate id: ${d._id} — two entries share a date + title`);
  ids.add(d._id);
}
const undated = [...new Set(BACKFILL.map((b) => b.releaseDate))].filter((d) => !HEADLINES[d]);
if (undated.length) console.log(`  NOTE dates with no headline: ${undated.join(", ")}`);

const byDate = {};
for (const d of docs) (byDate[d.releaseDate] ??= []).push(d);
console.log(`  backfill entries to upsert            : ${docs.length}`);
for (const date of Object.keys(byDate).sort().reverse()) {
  console.log(`    ${date}  ${byDate[date].length}  ${HEADLINES[date] ?? ""}`);
}

if (!WRITE) {
  console.log("\n  dry run — nothing written. Re-run with --write to apply.");
  process.exit(0);
}

/* ── apply ─────────────────────────────────────────────────────────────── */
const tx = docs.reduce((t, d) => t.createOrReplace(d), client.transaction());
// patch, not createOrReplace: keep every field of the iOS entry this run does
// not own (releaseDate, type, sortWithinDate).
if (before.ios) {
  tx.patch(IOS_FIX._id, (p) =>
    p.set({
      title: IOS_FIX.title,
      description: IOS_FIX.description,
      groupHeadline: IOS_FIX.groupHeadline,
    }),
  );
}
await tx.commit();

console.log(`\n  ✓ upserted ${docs.length} changelogEntry documents`);
if (before.ios) console.log("  ✓ corrected the iOS entry — built ahead of launch, not launched");

const after = await client.fetch(
  `{"total": count(*[_type=="changelogEntry"]),
     "newest": *[_type=="changelogEntry"]|order(releaseDate desc)[0].releaseDate,
     "ios": *[_id == $ios][0]{title, description}}`,
  { ios: IOS_FIX._id },
);
console.log(`  ✓ collection now holds ${after.total} entries, newest ${after.newest}`);
if (after.ios) console.log(`  ✓ iOS entry reads: ${after.ios.title}`);
console.log("  The page prefers Sanity over its hardcoded fallback, so this is now live.");
