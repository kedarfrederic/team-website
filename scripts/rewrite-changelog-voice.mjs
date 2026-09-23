/**
 * Rewrite every changelog entry in the house voice.
 *
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/rewrite-changelog-voice.mjs          # dry run, prints a diff
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/rewrite-changelog-voice.mjs --write  # apply
 *
 * WHY: the collection had grown three voices — the original March entries
 * (feature-list shorthand), the July/August backfill, and the September one
 * (commit-message phrasing: "Money is said as money"). Owner asked for one
 * professional register, comparable to a modern company changelog.
 *
 * THE RULES, so a later entry matches:
 *   1. NO EM DASHES. Anywhere. Use a full stop, a comma, or rewrite the
 *      sentence. Enforced below: the script refuses to write if one survives.
 *   2. Titles name the thing, as a noun phrase, in sentence case. "Offline file
 *      access on iOS", not "Files you've opened work offline". No inversions,
 *      no rhetorical titles, no quoted UI strings in the title.
 *   3. Descriptions are one or two declarative sentences saying what changed
 *      and what it means for the reader. Second person where it helps.
 *   4. Fixes state the symptom, then that it is resolved. No jokes, no blame.
 *   5. Product names only: Team, TeamMate, Pulse, the Rundown, Briefs,
 *      Formation, Team Pilot (the Dec 2025 entry, kept at the owner's request).
 *      Internal shorthand — "the brain", "the door", "the spine" — never ships;
 *      it is "memory" or "the memory graph" to a reader.
 *   6. "and", not "&", outside proper names (P&L, A&R).
 *
 * SCOPE: all 166 entries, titles, descriptions and group headlines. No
 * meaning changes — this pass is voice only, and any entry whose facts I would
 * have had to alter was left saying exactly what it said before.
 *
 * IDEMPOTENT: patches by _id, so re-running is a no-op once applied.
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

/* ── group headlines, by date ──────────────────────────────────────────── */
const HEADLINES = {
  "2026-09-17": "Fact ledger and roster-wide signals",
  "2026-09-15": "Instant interactions and task reliability",
  "2026-09-10": "Touring permissions and map fixes",
  "2026-09-07": "Faster first load",
  "2026-09-03": "Performance and live updates",
  "2026-08-31": "iOS development and mobile fixes",
  "2026-08-29": "Brand deals and the Daily Brief",
  "2026-08-26": "Creator campaigns",
  "2026-08-21": "Release Intelligence hub",
  "2026-08-20": "Release sequencing and industry lead times",
  "2026-08-19": "Document intelligence and memory",
  "2026-08-14": "Work extracted from email and documents",
  "2026-08-11": "TeamMate on the Free plan",
  "2026-08-10": "iOS app and self-service billing",
  "2026-08-07": "Large uploads and connector scopes",
  "2026-08-06": "Listening rooms and memory sources",
  "2026-07-30": "Archive, delete, and restore",
  "2026-07-29": "Help centre and localisation",
  "2026-07-17": "New pricing and single-screen signup",
  "2026-07-14": "Touring settlements, calendars, and the memory graph",
  "2026-07-10": "Recipes and full-scope connectors",
  "2026-07-08": "Audit trail",
  "2026-07-02": "Reconciliation and actionable answers",
  "2026-06-22": "Creator workspaces and release units",
  "2026-06-21": "Roster home and streaming analytics",
  "2026-06-18": "Boards and a new editorial interface",
  "2026-06-14": "Living strategy model and proactive monitoring",
  "2026-06-13": "Chat as a canvas",
  "2026-06-12": "Connect your tools",
  "2026-06-10": "Tour crew portal",
  "2026-05-15": "SMS rebuilt and consent-based support",
  "2026-05-05": "Live updates",
  "2026-05-01": "Nine languages and cross-language chat",
  "2026-04-30": "Localisation and Brand Kit v1.0",
  "2026-04-27": "The full touring suite",
  "2026-04-22": "Pulse and a clearer timeline",
  "2026-04-21": "Asset sharing and live status",
  "2026-04-16": "Two-way email and the knowledge graph",
  "2026-04-14": "DDEX-aligned track metadata",
  "2026-03-26": "The Rundown and an interface refresh",
  "2026-03-24": "Chartmetric as the primary data source",
  "2026-03-21": "Asset version control",
  "2026-03-19": "Formation",
  "2026-03-17": "Public API, intelligence engine, and security hardening",
  "2026-03-16": "Billing, onboarding, and SMS groups",
  "2026-03-13": "Briefs v2: section builder and AI fields",
  "2026-03-12": "Briefs collaboration and portal polish",
  "2026-03-11": "Briefs by Team and show discovery",
  "2026-03-10": "Text Your Release and demo booking",
  "2026-03-09": "Templates, email ingestion, and calendar views",
  "2026-03-06": "Task library and performance",
  "2026-03-01": "Press runs, reports, and dark mode",
  "2026-02-28": "Market intelligence and dashboard improvements",
  "2026-02-26": "Artist intelligence and rollout planning",
  "2025-12-09": "Team Pilot launches",
};

/* ── the rewrite, by document id ───────────────────────────────────────── */
const R = (title, description) => ({ title, description });

const REWRITES = {
  // ── September 2026 ──
  "chg-2026-09-17-every-insight-cites-the-facts-behind-it": R(
    "Insights cite their sources",
    "Documents, chat, and connected tools now write into a single fact ledger, and every insight names the facts it was built from. You can check the reasoning behind a card rather than taking it on trust.",
  ),
  "chg-2026-09-17-today-covers-the-whole-roster": R(
    "Today covers every release",
    "Today reads a single ranked feed across the whole workspace, so it reflects every release rather than a subset. New signals on mobile reads the same feed.",
  ),
  "chg-2026-09-17-teammate-settles-which-task-you-mean-first": R(
    "Clearer task resolution in TeamMate",
    "When a task name is ambiguous, TeamMate asks which one you mean before acting. A question asked twice still resumes the request it interrupted, and a new request is never attached to an unanswered clarification.",
  ),
  "chg-2026-09-17-money-is-said-as-money": R(
    "Correct currency formatting on cards",
    "Monetary values are formatted as currency rather than raw minor units, and a payment milestone is treated as a receivable rather than a key date. A card clears once its underlying issue is resolved, and returns if the issue recurs.",
  ),
  "chg-2026-09-17-a-connection-that-stops-feeding-a-release-says-s": R(
    "Disconnection alerts for connected tools",
    "When a connection stops feeding a release, a nightly check raises an alert on that release instead of retrying silently in the background.",
  ),

  "chg-2026-09-15-opening-a-task-crashed-the-timeline": R(
    "Crash when opening a task from the timeline",
    "Opening a task from the timeline could crash the page. This is resolved, and the underlying rule is now enforced in CI to prevent a repeat.",
  ),
  "chg-2026-09-15-your-clicks-paint-instantly": R(
    "Immediate feedback on every action",
    "Task updates and changes made by TeamMate appear instantly on web and mobile, and a change the server rejects is rolled back on screen. Open now keeps you inside the release you are working in.",
  ),
  "chg-2026-09-15-task-requests-keep-the-date-you-wrote": R(
    "Dates and subjects preserved in task requests",
    "A request such as “create a task on the 14th for the video edit” keeps both its date and its subject. An existing task with the same title is no longer reported as newly created, and a release chat keeps its first question and answer in one conversation.",
  ),

  "chg-2026-09-10-tour-financials-follow-permission": R(
    "Financial permissions in touring",
    "Guarantees, ticket prices, and settlement figures are hidden from members without financial access, both in what they can read and in what they can edit.",
  ),
  "chg-2026-09-10-the-touring-map-lost-its-basemap": R(
    "Touring map tiles",
    "The touring map's tile provider retired the free tiles it used, leaving an error message across the map. The map renders correctly again.",
  ),

  "chg-2026-09-07-less-weight-on-first-load": R(
    "Smaller initial page weight",
    "The sign-in page was loading a 4.9 MB logo, and artist avatars were loading full-size originals into 24-pixel circles. Both now load appropriately sized assets, and two development-only tools no longer ship to production.",
  ),
  "chg-2026-09-07-write-paths-that-answer-immediately": R(
    "Faster inline edits",
    "Inline roster edits, the venue thread, and other frequently used actions update immediately rather than waiting for the server to respond.",
  ),

  "chg-2026-09-03-the-workspace-opens-in-one-read": R(
    "Faster workspace loading",
    "The workspace loads its initial data in a single request, and heavy panels and charts load after first paint. Switching workspaces no longer discards data you have already loaded.",
  ),
  "chg-2026-09-03-typing-filtering-and-searching-keep-up": R(
    "Responsive search and filtering",
    "Typing in search re-renders the list rather than every card in it, filter changes keep the current rows visible while the new ones load, and the message composer responds to each keystroke immediately.",
  ),
  "chg-2026-09-03-live-updates-actually-land": R(
    "Reliable live updates",
    "Changes made by your teammates now reach your page reliably, and a single change no longer triggers repeated refreshes of the same release.",
  ),
  "chg-2026-09-03-edits-that-looked-saved-and-werent": R(
    "Edits that failed to save",
    "Subtask checkboxes save reliably, a failed subtask write no longer discards other edits, a second edit to the same touring section no longer overwrites the first, and a message returns to the composer if the send fails.",
  ),

  // ── August 2026 ──
  "chg-2026-08-31-files-youve-opened-work-offline": R(
    "Offline file access on iOS",
    "Files you have opened are available without a connection, and background refresh adapts to network conditions. The iOS app is in internal testing ahead of its App Store release.",
  ),
  "chg-2026-08-31-mobile-navigation-rebuilt": R(
    "Redesigned mobile navigation",
    "Core navigation has been rebuilt, release workflows can be driven visually, notification taps open the correct screen, and Today groups repeated decisions rather than listing them again.",
  ),
  "chg-2026-08-31-teammate-asks-before-destructive-changes": R(
    "Confirmation before destructive changes",
    "TeamMate asks for explicit confirmation before deleting or overwriting anything, rather than acting on a single instruction.",
  ),
  "chg-2026-08-31-key-dates-were-a-day-early": R(
    "Key dates in US time zones",
    "TeamMate and SMS reported key dates one day earlier than the actual date for readers in US time zones. This is resolved.",
  ),

  "chg-2026-08-29-brand-collaboration-proposals-end-to-end": R(
    "Brand collaboration proposals",
    "A deal desk for brand partnerships covering compensation, rights, exclusivity, and compliance, with version history, change orders, invoice and delivery records, and a secure conversation for each recipient.",
  ),
  "chg-2026-08-29-one-daily-brief-per-person": R(
    "One Daily Brief per person",
    "A single morning brief covers every workspace you belong to, scoped to what you have permission to see, and includes your overdue and upcoming tasks. It has a personalised subject line, a working unsubscribe, and no longer sends twice.",
  ),
  "chg-2026-08-29-budget-answers-you-can-look-at": R(
    "Visual budget breakdowns over SMS",
    "A budget answer sent over SMS links to a visual breakdown that requires no login, and budget summaries in chat report planned totals correctly alongside their line items.",
  ),

  "chg-2026-08-26-a-campaign-native-creator-workspace": R(
    "Campaign workspaces for creators",
    "Creators work in campaigns rather than releases, with briefs created automatically, deliverables linked to work on the timeline, and platform priorities expressed in posts and clips rather than streaming services.",
  ),
  "chg-2026-08-26-the-money-side-of-a-campaign": R(
    "Campaign finances",
    "Track receivable milestones and cash activity for each campaign, with a clear distinction between payments that are owed and payments that are only expected.",
  ),
  "chg-2026-08-26-evidence-behind-the-results": R(
    "Performance evidence on deliverables",
    "Each deliverable links to the published post it became, carries the performance figures behind it, and keeps its own review history.",
  ),

  "chg-2026-08-21-a-release-intelligence-hub": R(
    "Release Intelligence hub",
    "Proposals and knowledge share a single tab on web and mobile. Proposals are grouped by category so a long queue stays readable, release documents sit alongside them, and counts match across both platforms.",
  ),
  "chg-2026-08-21-turn-a-signal-into-an-action": R(
    "Turn a signal into an action",
    "A high-confidence signal can be converted into a draft action you review and apply in one tap, and “Add to brain” saves anything worth keeping as a memory TeamMate can recall later.",
  ),
  "chg-2026-08-21-teammate-knows-a-upc-from-an-isrc": R(
    "Catalogue identifiers in TeamMate",
    "TeamMate understands that a UPC identifies a release and an ISRC identifies a track, and lead single is now a role you can set on an individual track.",
  ),

  "chg-2026-08-20-the-release-sequence-knows-what-comes-before-wha": R(
    "Release sequencing",
    "A dated, ordered view of the steps in a rollout. A missing step is flagged along with the reason it matters and the work it blocks.",
  ),
  "chg-2026-08-20-lead-times-that-match-the-artists-stage": R(
    "Lead times by career stage",
    "Sequence lead times are drawn from sourced, human-reviewed industry norms and adjust to an artist's career stage, rather than applying one generic schedule to everyone.",
  ),

  "chg-2026-08-19-upload-a-document-get-proposals-you-can-review": R(
    "Proposals from uploaded documents",
    "Documents are read on upload and turned into proposals you approve or dismiss. Nothing is written to your workspace without review.",
  ),
  "chg-2026-08-19-see-every-source-the-brain-reads": R(
    "Source index",
    "A source index on web and mobile lists everything that has been ingested, where it came from, and how current it is, with automatic flagging of sources that have gone stale.",
  ),
  "chg-2026-08-19-what-the-brain-remembers-and-how-much-to-trust-i": R(
    "Memory authority and age",
    "Stored facts carry an authority level and a timestamp, a newer fact supersedes the one it contradicts, and TeamMate states how old a memory is when it uses one.",
  ),

  "chg-2026-08-14-one-email-one-piece-of-work": R(
    "One email, one piece of work",
    "An event described in a single email becomes one task with its components underneath, rather than several unrelated tasks, and proposals from the same email are grouped together.",
  ),
  "chg-2026-08-14-extractions-have-the-work-behind-them": R(
    "Extraction summaries link to the work",
    "A summary such as “1 task extracted, $2,700 budget update” opens onto the actual changes, and deleting the source document withdraws the drafts it produced.",
  ),
  "chg-2026-08-14-insights-show-the-grain-behind-the-number": R(
    "Source and granularity on insights",
    "Insight and budget cards name the documents they came from and the granularity of the figures they quote, whether daily or weekly and one platform or all of them. Where sources disagree, both figures are shown.",
  ),

  "chg-2026-08-11-teammate-ai-on-the-free-plan": R(
    "TeamMate on the Free plan",
    "The Free plan includes a metered daily TeamMate allowance once the trial ends.",
  ),
  "chg-2026-08-10-team-on-ios": R(
    "Team for iOS, in internal testing",
    "The iOS app is built and in internal testing ahead of its App Store release. It covers account creation, setting up a release end to end, working through tasks, browsing files, and continuing a TeamMate conversation from where you left it.",
  ),
  "chg-2026-08-10-manage-your-own-plan-and-card": R(
    "Self-service plan and payment management",
    "Change your plan, update or remove a payment card, and see your current plan in the header, on web and mobile.",
  ),
  "chg-2026-08-09-roster-moved-into-settings": R(
    "Roster moved into Settings",
    "Artist administration now lives at Settings → Workspace → Roster.",
  ),
  "chg-2026-08-07-large-file-uploads-that-survive-a-bad-network": R(
    "Resumable large file uploads",
    "Masters and other large assets upload in parts, resume after an interruption, and are checksum-verified, through the same pipeline on web and mobile.",
  ),
  "chg-2026-08-07-point-teammate-at-exactly-the-files-you-mean": R(
    "Scoped file access for connections",
    "Choose a focus folder, or select the specific files a connection may read. The selection limits what any read can return, not only what it asks for.",
  ),
  "chg-2026-08-07-waveforms-load-instantly": R(
    "Faster waveform rendering",
    "Waveform peaks are calculated once on upload rather than decoded each time a track is played.",
  ),
  "chg-2026-08-06-share-a-listening-room-not-a-link": R(
    "Listening rooms",
    "Share a set of tracks as a listening room, with one link for each recipient. Recipients identify themselves, leave notes pinned to a moment in a track, and can play from any comment.",
  ),
  "chg-2026-08-06-the-brain-shows-its-sources": R(
    "Sources in the memory graph",
    "The memory graph can show where it learned something, and TeamMate records the actions it takes in your connected tools.",
  ),
  "chg-2026-08-06-connected-tools-moved-to-the": R(
    "Connected tools in the composer menu",
    "Your connected tools appear in the composer's “+” menu rather than behind “@”.",
  ),
  "chg-2026-08-03-undo-a-deleted-release": R(
    "Restore a deleted release",
    "A deleted release can be found and restored.",
  ),

  // ── July 2026 ──
  "chg-2026-07-30-archive-delete-and-restore": R(
    "Archive, delete, and restore",
    "Archive or delete a release or artist, browse what you have archived, and restore it, with the state surviving a page reload. Deleted releases no longer appear in search, the memory graph, or email answers.",
  ),
  "chg-2026-07-29-help-centre": R(
    "Help centre",
    "A searchable help centre covering accounts, security, API keys, billing, connection scopes, and the Rundown, with its own language and theme controls and full support on mobile.",
  ),
  "chg-2026-07-29-localised-throughout": R(
    "Localised dates, numbers, and currency",
    "Dates, numbers, and currency follow your chosen language, with coverage checks that customer content cannot skew.",
  ),
  "chg-2026-07-18-tasks-under-budget-line-items": R(
    "Tasks under budget line items",
    "Nest tasks beneath a budget line, roll their costs up to it, and attach files to each task.",
  ),
  "chg-2026-07-17-new-pricing-and-signup-in-one-screen": R(
    "New pricing and single-screen signup",
    "Pro moves to base-plus-seat pricing, Free includes unlimited collaborators, every signup includes a 14-day Pro trial, and choosing a plan and creating an account happen on one screen.",
  ),
  "chg-2026-07-14-touring-settlements-p-l-and-contracts": R(
    "Settlements, P&L, and contracts",
    "Export a settlement as a PDF and a per-tour P&L as an XLSX, set contract fields and upload the signed copy, and reorder shows by dragging them in the builder.",
  ),
  "chg-2026-07-14-put-your-tour-in-your-calendar": R(
    "Tour calendar feeds",
    "Download a tour as an iCal file, or subscribe to a live webcal feed that updates as the routing changes.",
  ),
  "chg-2026-07-14-the-memory-graph-is-a-real-page": R(
    "The memory graph as a full page",
    "Browse what TeamMate knows, open a node to see the underlying facts and their sources, review pre-computed dependency chains, and manage reconciliation anchors.",
  ),
  "chg-2026-07-14-connectors-ask-before-they-read": R(
    "Explicit approval for connector reads",
    "Shared-workspace providers default to deny, and each release asks you to confirm which pages feed it.",
  ),
  "chg-2026-07-13-every-releases-assets-in-one-place": R(
    "All release assets in one place",
    "The artist Assets page collects assets from every release, grouped by release, in a grid you can upload into directly.",
  ),
  "chg-2026-07-11-teammate-can-start-a-release-or-add-an-artist": R(
    "Create releases and artists from TeamMate",
    "TeamMate can open a new rollout or add an artist workspace, not only work inside existing ones.",
  ),
  "chg-2026-07-10-ask-teammate-to-build-the-document": R(
    "Document recipes",
    "New recipes let TeamMate compose a Notion database, a financial model, or a document, optionally modelled on one you already use, and remember your format for next time.",
  ),
  "chg-2026-07-10-notion-airtable-and-drive-go-full-scope": R(
    "Expanded Notion, Airtable, and Drive support",
    "Notion gains five reads and two writes, Airtable three reads and seven writes, and Drive eight collaboration writes. Calendar can now move events and remove attendees.",
  ),
  "chg-2026-07-08-audit-trail": R(
    "Audit trail",
    "Every change records who made it, what it affected, and the previous and new values, in a readable history scoped to your workspace with personal data redacted at the source.",
  ),
  "chg-2026-07-02-facts-reconcile-from-wherever-you-said-them": R(
    "Reconciliation across every source",
    "An ISRC typed into chat weeks ago, a value in a connected Notion page, or a figure in an email all feed reconciliation, checked against the releases they are relevant to.",
  ),
  "chg-2026-07-02-answers-you-can-act-on": R(
    "Actionable answers in chat",
    "TeamMate replies render metadata and track cards rather than prose, completed actions link directly to what they changed, clarifying questions arrive as selectable cards, and working steps stream as they happen.",
  ),

  // ── June 2026 ──
  "chg-2026-06-23-asset-version-control": R(
    "Asset version control",
    "Update an asset while keeping its history, restore an earlier version, and link or unlink versions to one another.",
  ),
  "chg-2026-06-22-creator-workspaces": R(
    "Creator workspaces",
    "Add a creator as well as an artist, with terminology adapted throughout, DNA research run on creation, and social footprint discovered automatically.",
  ),
  "chg-2026-06-22-add-a-single-to-an-existing-ep-or-album": R(
    "Add a single to an existing EP or album",
    "A release-unit model means a single can join a release you have already started, and creating an album or EP builds its structure for you.",
  ),
  "chg-2026-06-22-rename-and-delete-a-release": R(
    "Rename and delete a release",
    "Releases can be renamed and deleted, and creation is idempotent, so a double submission cannot produce a duplicate.",
  ),
  "chg-2026-06-21-roster-is-the-home": R(
    "Roster as the home screen",
    "An artist-first home with your roster front and centre, richer artist cards with hover snapshots, starred talent, context-aware search, and a workspace scoped to each artist.",
  ),
  "chg-2026-06-21-streaming-analytics": R(
    "Streaming analytics",
    "Stream metrics are consolidated into a purpose-built analytics store, with per-track trends, historical backfill when an artist is added, and grounded cohort benchmarks.",
  ),
  "chg-2026-06-21-proposals-tell-you-what-happened": R(
    "Receipts when a proposal is applied",
    "Applying a proposal returns an in-page receipt naming the change and where it landed, for successes and failures alike, and the review queue supports bulk accept and dismiss.",
  ),
  "chg-2026-06-18-show-me-on-the-board": R(
    "Boards in chat",
    "TeamMate can compose a live board to answer a substantive question, including territories on a real map, comparisons, and plans. Boards are versioned, so you can open any earlier revision.",
  ),
  "chg-2026-06-18-a-new-editorial-interface": R(
    "New editorial interface",
    "Content, Budget, Timeline, Assets, Pulse, the Rundown, DSP Priorities, and the workspace shell have all been rebuilt in the new editorial design.",
  ),
  "chg-2026-06-17-territories-that-know-their-places": R(
    "City-level territories",
    "464 major cities across 110 countries, with disambiguation when two places share a name.",
  ),
  "chg-2026-06-14-a-living-strategy-model": R(
    "Living strategy model",
    "Team derives your audience rather than asking you to define it, then closes the loop by proposing, confirming, and reflecting. Reports can be generated at any scope and stay current as the picture changes.",
  ),
  "chg-2026-06-14-the-brain-watches-and-proposes": R(
    "Proactive monitoring and proposals",
    "Change capture across your rollout feeds an engine that drafts proposals with their provenance, raises questions when something looks wrong, and texts you when it matters. You control how proactive it is.",
  ),
  "chg-2026-06-13-the-chat-became-a-canvas": R(
    "Chat as a canvas",
    "Answers carry source citations, render charts from real figures, drill down into the underlying panel, and queue proposals you can apply in one tap. The canvas survives a page reload.",
  ),
  "chg-2026-06-13-brain-briefing": R(
    "Memory briefing",
    "A periodic digest of what TeamMate has learned, deduplicated and linked to a shareable briefing page.",
  ),
  "chg-2026-06-13-the-insight-engine-got-sharper": R(
    "Expanded insight engine",
    "Eight analytical lenses, including streaming momentum, DSP editorial coverage, and audience gaps, with charts attached and budget insights surfaced in chat.",
  ),
  "chg-2026-06-12-connect-your-tools": R(
    "Connect your tools",
    "A Sources page and an in-chat connect flow bring Notion, Drive, Slack, Airtable, and others into the workspace, with per-connection health and one-click disconnect.",
  ),
  "chg-2026-06-12-everything-you-feed-it-reaches-the-brain": R(
    "A single ingestion path",
    "Uploads, email attachments, and connector content all travel one ingestion path into memory with full lineage, so anything you add is traceable to its source.",
  ),
  "chg-2026-06-10-tour-crew-portal": R(
    "Tour crew portal",
    "Invite tour crew and external collaborators by email, run an advance thread with the venue, share a full-fidelity day sheet, and roll settlements up for each tour, with role-aware access throughout.",
  ),
  "chg-2026-06-10-sms-understands-which-release-you-mean": R(
    "Release matching over SMS",
    "SMS matches release names approximately, offers a numbered list when it is unsure, and returns a clear message rather than silence when an audio attachment cannot be handled.",
  ),

  // ── May 2026 ──
  "chg-2026-05-15-sms-rebuilt": R(
    "SMS rebuilt",
    "A hybrid engine uses language understanding for questions and deterministic paths for changes, on a durable outbound queue with delivery receipts, explicit release switching, and relative dates resolved before anything runs.",
  ),
  "chg-2026-05-15-support-can-see-your-screen-if-you-let-it": R(
    "Consent-based support access",
    "Support access requires your explicit approval and is fully audited, with live screen co-browsing included in the same permission flow.",
  ),
  "chg-2026-05-15-trials-and-plans": R(
    "Trials and plans",
    "A universal 30-day Pro trial, alignment between the Free and Pro plans, tier gating, and self-service billing through the Stripe portal.",
  ),
  "chg-2026-05-10-sign-in-and-signup-match-the-brand": R(
    "Redesigned sign-in and signup",
    "The authentication screens and onboarding panels have been redesigned to match the rest of the product.",
  ),
  "chg-2026-05-05-live-updates": R(
    "Live updates",
    "The timeline, chat history, notification bell, and activity strip update as things change, without a refresh.",
  ),
  "chg-2026-05-01-nine-languages-and-cross-language-chat": R(
    "Nine languages and cross-language chat",
    "German, Hindi, Mandarin, and Arabic join the supported languages, and messages translate automatically for whoever is reading, so a single thread can span languages.",
  ),

  // ── April 2026 ──
  "chg-2026-04-30-automatic-translation-everywhere": R(
    "Interface-wide translation",
    "The whole interface translates, and TeamMate answers in your language.",
  ),
  "chg-2026-04-30-brand-kit-v1-0-across-the-platform": R(
    "Brand Kit v1.0",
    "Design tokens, buttons, cards, and dialogs aligned across the platform, with accessibility hardening and dark-mode corrections throughout.",
  ),
  "chg-2026-04-27-the-full-touring-suite": R(
    "The full touring suite",
    "Advance view, day sheets with pack mode and distribution, pipeline, deals, settlements, documents, technical and catering specifications, guest lists, and marketing, including full backline detail.",
  ),
  "chg-2026-04-24-feed-it-a-screenshot": R(
    "Screenshots read on upload",
    "Images and screenshots are read when uploaded, so a chart you paste in becomes something TeamMate can use.",
  ),
  "chg-2026-04-23-more-streaming-sources": R(
    "More streaming sources",
    "Apple Music streams, daily Shazam data, and chart positions join the picture, with metric time series and completeness scoring.",
  ),
  "chg-2026-04-22-pulse": R(
    "Pulse",
    "A live data intelligence hub replacing the previous Intelligence tab, leading with insights and adding dependency chains, references, interactive multi-platform charts, and reasoning you can run on demand.",
  ),
  "chg-2026-04-22-the-timeline-tells-you-where-you-are": R(
    "A clearer timeline",
    "A live countdown that changes colour as release day approaches, singles shown as date bars, milestone flags, asset thumbnails on task cards, and search and filtering.",
  ),
  "chg-2026-04-21-share-assets-properly": R(
    "Asset sharing",
    "Share links with per-recipient access, inline previews, per-asset comments and threaded replies, passcode protection, a download toggle you control, and notifications when someone comments.",
  ),
  "chg-2026-04-21-live-status-dashboard": R(
    "Live Status dashboard",
    "A shareable, full-page live dashboard with interactive tasks and comments, in a new editorial design.",
  ),
  "chg-2026-04-21-video-plays-in-the-browser": R(
    "In-browser video playback",
    "MOV, AVI, and MKV files are transcoded to MP4 on upload, and uploads go directly to storage using presigned URLs.",
  ),
  "chg-2026-04-17-team-mode-for-sms": R(
    "Team Mode for SMS",
    "Group messaging with TeamMate in the thread, quiet unless addressed, plus action receipts, persistent context, and asset retrieval and share links over text.",
  ),
  "chg-2026-04-16-email-that-works-both-ways": R(
    "Two-way email",
    "Inbound email appears in chat as a notification card, and TeamMate composes outbound email on your behalf with a draft, confirm, and send step. Address it with @teammate to have it act.",
  ),
  "chg-2026-04-16-the-knowledge-graph": R(
    "The knowledge graph",
    "Team's memory moves onto a purpose-built graph of entities, relationships, and memories, with a full-screen visualisation you can open from chat.",
  ),
  "chg-2026-04-16-chat-conversations": R(
    "Named conversations",
    "Persistent, named conversations with a history switcher, a New Chat button, and a Stop button to cancel a running response.",
  ),
  "chg-2026-04-15-feed-the-knowledge-base": R(
    "Feed the knowledge base",
    "Upload documents from the release panel, ingest from a URL, and have chat attachments vectorised automatically, with permissions and traceability throughout.",
  ),
  "chg-2026-04-14-ddex-aligned-track-metadata": R(
    "DDEX-aligned track metadata",
    "Full track metadata with publishing and rights contributors, a Spotify featured-artist picker, subgenre search, and shareable track links.",
  ),

  // ── March 2026 ──
  "chg-2026-03-26-the-rundown": R(
    "The Rundown",
    "Auto-generated artist press kits covering achievements, press, RIYL, contacts, and platform logos, in animated templates, with a full editor and a discography pulled from Chartmetric.",
  ),
  "chg-2026-03-26-a-warmer-glassier-interface": R(
    "Interface refresh",
    "Artist Intelligence, Budget, DSP Priorities, Ready to Roll, the Asset Library, Command Center, Content and Tracks, and the Release Pipeline have all been visually rebuilt.",
  ),
  "chg-2026-03-24-chartmetric-as-the-data-spine": R(
    "Chartmetric as the primary data source",
    "Chartmetric replaces the previous providers, with multi-platform streaming sync, a live stats header, and cross-platform track statistics.",
  ),
  "chg-2026-03-24-actionable-intelligence": R(
    "Actionable intelligence",
    "Anomaly detection, written insights with full context rather than templates, web mining, daily deltas, comparables, and a Release Performance tab with per-track sparklines.",
  ),
  "chg-2026-03-21-asset-version-control": R(
    "Asset version control",
    "Automatic versioning with manual linking, a full audit trail for every asset operation, and file conversion on download with per-platform presets.",
  ),
  "chg-2026-03-21-the-brain-sees-every-change": R(
    "Attribution on every change",
    "Every data change is captured and attributed, so TeamMate can answer who did what, and what it learns carries across releases.",
  ),
  "chg-2026-03-21-faster-asset-library": R(
    "Faster asset library",
    "Cursor pagination, server-side filtering, and WebP thumbnails.",
  ),
  "chg-2026-03-20-strategy-that-knows-your-stage": R(
    "Stage-aware strategy",
    "Strategy intelligence keyed to career stage, genre, and budget, with proactive alerts and a “remember this” command.",
  ),
  "chg-2026-03-19-formation": R(
    "Formation",
    "An interactive artist-management learning platform with 13 courses and 82 lessons, including interactive modules and personalised scenarios.",
  ),

  // ── the original March entries ──
  "chg-0": R(
    "Public data ingestion API",
    "A fully documented REST API with CSV import, streaming, marketing, and touring endpoints.",
  ),
  "chg-1": R(
    "API key management",
    "Generate and manage API keys from Settings, with rate limiting and usage tracking provided by Unkey.",
  ),
  "chg-2": R(
    "Music industry knowledge graph",
    "An entity resolution engine and a 300-term music glossary, so TeamMate understands industry terminology natively.",
  ),
  "chg-3": R(
    "Interactive knowledge base",
    "A redesigned knowledge base with live component demos rendered inline.",
  ),
  "chg-4": R(
    "TeamMate security hardening",
    "Permission-gated context, tool filtering, automatic retrieval, PII sanitisation, and cross-tenant access checks.",
  ),
  "chg-5": R(
    "Voice note transcription",
    "Transcription failed on Apple .caf files and on relative storage URLs. This is resolved.",
  ),
  "chg-6": R(
    "SEO improvements",
    "Missing pages have been added to sitemap.xml and robots.txt.",
  ),
  "chg-7": R(
    "In-app Stripe billing",
    "Upgrade, downgrade, and manage your subscription inside Team with embedded Stripe checkout.",
  ),
  "chg-8": R(
    "Redesigned onboarding",
    "A new signup flow with a 30-day free trial, no credit card required, and consultation booking after signup.",
  ),
  "chg-9": R(
    "SMS group messaging",
    "Create groups by text, share updates, and receive daily briefings through conversational commands.",
  ),
  "chg-10": R(
    "Cross-release portfolio search",
    "TeamMate can search across all of your releases at once.",
  ),
  "chg-11": R(
    "Feature gating",
    "A full tier enforcement audit, with feature flags covering every plan.",
  ),
  "chg-12": R(
    "Signup-first calls to action",
    "All feature and solution pages now lead with signup.",
  ),
  "chg-13": R(
    "AI-generated brief fields",
    "Generate field content with AI, import it from documents, and build a brief step by step.",
  ),
  "chg-14": R(
    "Section-based brief builder",
    "A new builder with grouped collapsible sections, custom brief types, and a quick-create dialog.",
  ),
  "chg-15": R(
    "Redesigned share modal",
    "Automatically generated passwords, per-recipient email delivery, and group-scoped portal visibility.",
  ),
  "chg-16": R(
    "Brief card design",
    "Folder-style cards with hover animations, coloured headers, and an account dropdown.",
  ),
  "chg-17": R(
    "Security hardening for Briefs",
    "A security audit covering input validation, rate limiting, encryption, and access gating for briefs-only users.",
  ),
  "chg-18": R(
    "Two-way collaboration workspace",
    "Recipients can comment, upload files, and collaborate inside the brief portal.",
  ),
  "chg-19": R(
    "Per-recipient channels",
    "Each share link has its own isolated channel for comments, uploads, and activity.",
  ),
  "chg-20": R(
    "Portal media experience",
    "A waveform audio player, animations, an image carousel, and YouTube embed support.",
  ),
  "chg-21": R(
    "Safari compatibility",
    "Pages reload automatically after a deploy rather than failing to load their assets, and audio playback issues in Safari are resolved.",
  ),
  "chg-22": R(
    "Briefs by Team",
    "A standalone product for creating, sending, and tracking operational briefs.",
  ),
  "chg-23": R(
    "Show discovery",
    "Find upcoming shows with venue geocoding and map integration in the touring module.",
  ),
  "chg-24": R(
    "Task departments",
    "Assign tasks to Marketing, A&R, Legal, Business Affairs, or Finance.",
  ),
  "chg-25": R(
    "Notification reliability",
    "Resolved phantom unread badges, duplicate toast notifications, and incorrect subtask routing.",
  ),
  "chg-26": R(
    "Text Your Release",
    "Manage releases by text message: send updates, attach media, create tasks, and receive proactive notifications.",
  ),
  "chg-27": R(
    "Book a demo",
    "A streamlined booking flow for seeing Team in action before committing.",
  ),
  "chg-28": R(
    "Pricing page redesign",
    "A redesigned pricing page with a clear comparison matrix.",
  ),
  "chg-29": R(
    "Social sharing previews",
    "Rich previews with the correct image and description on Twitter, LinkedIn, and iMessage.",
  ),
  "chg-30": R(
    "Release and task templates",
    "Save any release as a reusable template, then browse, edit, and apply it in one click.",
  ),
  "chg-31": R(
    "Email ingestion",
    "Forward emails to a release and they appear in a dedicated Emails tab, where TeamMate can reference them.",
  ),
  "chg-32": R(
    "Calendar and list views",
    "Switch between calendar and list views on the timeline with a single toggle.",
  ),
  "chg-33": R(
    "Expanded TeamMate context",
    "Access to rollout plans, email threads, and full release context, for more accurate answers.",
  ),
  "chg-34": R(
    "Mobile responsiveness",
    "Responsiveness improvements across the dashboard, task panels, and rollout tabs.",
  ),
  "chg-35": R(
    "Task library",
    "Browse pre-built task templates by category and add them to any release to start a rollout quickly.",
  ),
  "chg-36": R(
    "Improved intent routing",
    "TeamMate routes requests by understanding intent rather than matching keywords.",
  ),
  "chg-37": R(
    "Faster page loads",
    "Parallelised database queries and optimised asset loading for faster navigation.",
  ),
  "chg-38": R(
    "Press runs",
    "Plan press runs with an interactive map, Google Places search, and a detail view for each stop.",
  ),
  "chg-39": R(
    "Release reports",
    "Generate PDF reports covering strategy, DSP priorities, territories, and the timeline.",
  ),
  "chg-40": R(
    "Dark mode",
    "An accessible dark theme, with a toggle in settings.",
  ),
  "chg-41": R(
    "Guided product tour",
    "A step-by-step interactive tour for new users, which can be restarted at any time from the help menu.",
  ),
  "chg-42": R(
    "Task list view",
    "A sortable, expandable task list with columns for status, assignee, dates, and subtasks.",
  ),
  "chg-43": R(
    "Market intelligence",
    "Research-backed briefings on market position, competitor landscape, and audience insights.",
  ),
  "chg-44": R(
    "Specialised task cards",
    "Category-specific fields, so social posts show platforms, playlisting shows curators, and PR shows outlets.",
  ),
  "chg-45": R(
    "Dashboard sorting",
    "Releases sort by recently viewed and by newest created.",
  ),
  "chg-46": R(
    "Artist intelligence",
    "Automatic artist research covering market position, audience demographics, comparable artists, and detailed profile sections.",
  ),
  "chg-47": R(
    "Rollout planning engine",
    "Generate full phased rollout plans, manage content and budgets, and carry preferences across releases.",
  ),
  "chg-48": R(
    "Mobile experience",
    "A full mobile redesign with unified navigation, compact release cards, and a bottom tab bar.",
  ),
  "chg-49": R(
    "Team Pilot MVP",
    "The first version of Team, covering release management with timeline views, task management, authentication, and TeamMate.",
  ),
  "chg-50": R(
    "Timeline and canvas views",
    "A visual timeline for scheduling tasks, and a canvas view for spatial release planning.",
  ),
  "chg-51": R(
    "Mobile-first design",
    "A responsive sidebar, timeline, bottom navigation, and touch-friendly interactions from the start.",
  ),
};

/* ── apply ─────────────────────────────────────────────────────────────── */
const live = await client.fetch(
  `*[_type=="changelogEntry"]|order(releaseDate desc, sortWithinDate asc){_id,releaseDate,groupHeadline,type,title,description}`,
);

// Every entry must have a rewrite. A missed one is an entry left in the old
// voice on a page the owner asked to be consistent, so this is fatal, not a
// warning: the whole point is that no reader can tell which pass wrote what.
const missing = live.filter((e) => !REWRITES[e._id]);
if (missing.length) {
  console.error(`\n  ${missing.length} live entries have no rewrite:`);
  for (const m of missing) console.error(`    ${m._id}  (${m.releaseDate})  ${m.title}`);
  process.exit(1);
}
const orphans = Object.keys(REWRITES).filter((id) => !live.some((e) => e._id === id));
if (orphans.length) console.log(`  NOTE ${orphans.length} rewrites match no live entry: ${orphans.join(", ")}`);

const patches = [];
for (const e of live) {
  const r = REWRITES[e._id];
  const set = {};
  if (r.title !== e.title) set.title = r.title;
  if (r.description !== e.description) set.description = r.description;
  // Only the entry that already carries a headline carries the new one, since
  // that is the one the page reads.
  if (e.groupHeadline) {
    const gh = HEADLINES[e.releaseDate];
    if (gh && gh !== e.groupHeadline) set.groupHeadline = gh;
  }
  if (Object.keys(set).length) patches.push({ id: e._id, before: e, set });
}

// Rule 1 is mechanical, so check it mechanically rather than trusting the prose
// above. Covers the em dash and the two other marks that read as one.
const BANNED = /[—–]|--/;
const violations = [];
for (const e of live) {
  const r = REWRITES[e._id];
  const gh = e.groupHeadline ? (HEADLINES[e.releaseDate] ?? e.groupHeadline) : "";
  for (const [field, text] of [["title", r.title], ["description", r.description], ["groupHeadline", gh]]) {
    if (text && BANNED.test(text)) violations.push(`${e._id}.${field}: ${text}`);
  }
}
if (violations.length) {
  console.error(`\n  ${violations.length} rewrites still contain a dash that rule 1 forbids:`);
  for (const v of violations) console.error(`    ${v}`);
  process.exit(1);
}

console.log(`  live entries              : ${live.length}`);
console.log(`  entries changed by this run: ${patches.length}`);
console.log(`  em dashes after this run   : 0 (checked)`);

if (!WRITE) {
  console.log("\n  ── diff ──");
  for (const p of patches) {
    console.log(`\n  ${p.before.releaseDate}  ${p.id}`);
    if (p.set.groupHeadline) console.log(`    headline  - ${p.before.groupHeadline}\n              + ${p.set.groupHeadline}`);
    if (p.set.title) console.log(`    title     - ${p.before.title}\n              + ${p.set.title}`);
    if (p.set.description) console.log(`    desc      - ${p.before.description}\n              + ${p.set.description}`);
  }
  console.log("\n  dry run — nothing written. Re-run with --write to apply.");
  process.exit(0);
}

const tx = patches.reduce((t, p) => t.patch(p.id, (patch) => patch.set(p.set)), client.transaction());
await tx.commit();
console.log(`\n  ✓ rewrote ${patches.length} entries`);

// NOT `match "*—*"`: GROQ's match is token-based and a dash is a token
// separator, so that pattern matches every document and reports the whole
// collection as dirty. Read the strings back and test them here instead.
const readback = await client.fetch(
  `*[_type=="changelogEntry"]{title, description, groupHeadline}`,
);
const dirty = readback.filter((e) =>
  [e.title, e.description, e.groupHeadline].some((t) => t && BANNED.test(t)),
);
console.log(`  ✓ read back ${readback.length} entries, ${dirty.length} still containing a forbidden dash`);
console.log("  The page reads Sanity directly, so this is live.");
