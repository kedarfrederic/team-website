/**
 * Seed Sanity with the current live marketing copy.
 *
 * Why: until Sanity has documents, every page falls back to the hardcoded
 * Astro-side copy and editors open Studio to an empty CMS. Running this
 * script once populates every page singleton + collection with the same
 * copy that's currently live, so editors land in a fully-editable Studio
 * mirroring the production site.
 *
 * Usage:
 *   cd team-website
 *   SANITY_WRITE_TOKEN=<editor-or-write-token> npx tsx scripts/seed-sanity.ts
 *
 * Get a write token: https://www.sanity.io/manage → team-website-cms →
 * API → Tokens → Add API token → Editor permissions.
 *
 * Idempotent: every doc is `createOrReplace` so running the script twice
 * produces the same result. Editor changes are NOT preserved on rerun —
 * only run again when you want to reset to the seeded baseline.
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = "g1olb5am";
const DATASET = "production";
const API_VERSION = "2024-12-01";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN env var.");
  console.error("  → https://www.sanity.io/manage → team-website-cms → API → Tokens");
  console.error("  → Add API token → Editor → copy → re-run with SANITY_WRITE_TOKEN=<token>");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

const docs: any[] = [];

// ─── helpers ────────────────────────────────────────────────────────────
//
// CRITICAL: Sanity's visual-editing overlay constructs GROQ queries with the
// `_key` of array items embedded as string literals (e.g.
// `painSection.rows[_key=="..."]`). Periods, quotes, slashes, and other
// special chars in `_key` values break that parser. So every `_key` we
// generate is a sanitized slug — alphanumeric + dashes only.
function safeKey(seed: string, prefix = "k"): string {
  const slug = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug ? `${prefix}-${slug}` : `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
function cta(label: string, href: string) {
  return { label, href };
}
function role(title: string, description: string, href: string) {
  return { _key: safeKey(href, "role"), _type: "roleCard", title, description, href };
}
function painRow(metadataPill: string, headline: string, body: string) {
  return { _key: safeKey(headline, "row"), _type: "painRow", metadataPill, headline, body };
}
function step(num: string, title: string, description: string) {
  return { _key: safeKey(`${num}-${title}`, "step"), _type: "stepItem", number: num, title, description };
}
function feat(title: string, description: string) {
  return { _key: safeKey(title, "feat"), _type: "featureCard", title, description };
}
function spotFeat(title: string, description: string) {
  return { _key: safeKey(title, "spot"), _type: "spotlightFeature", title, description };
}
function partnerFeat(title: string, description: string) {
  return { _key: safeKey(title, "ptr"), _type: "partnerTabFeature", title, description };
}
// Sanity portable-text blocks REQUIRE _key on every array item including
// the span children inside `children[]`. Missing _keys cause Studio to
// silently render the field as empty (no error, just blank).
let _blockSeq = 0;
function block(text: string) {
  const id = `b${++_blockSeq}`;
  return {
    _key: id,
    _type: "block",
    style: "normal",
    children: [{ _key: `${id}s`, _type: "span", text, marks: [] }],
    markDefs: [],
  };
}
const ROLES_GRID_DEFAULT = {
  eyebrow: "Designed for",
  headlineTop: "Designed for",
  headlineBottom: "how you work",
  headline: "how you work",
  cards: [
    role("For Artists", "Your release, structured. No more winging it.", "/for-artists"),
    role("For Managers", "Every artist's rollout. One dashboard.", "/for-managers"),
    role("For Labels", "Scale your release process. Not your headcount.", "/for-labels"),
    role("For Partners", "See your deliverables. Hit your deadlines.", "/for-partners"),
  ],
};

// ─── siteSettings ───────────────────────────────────────────────────────
docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  brandLogo: {
    url: "/logos/team-logo.svg",
    alt: "Team",
  },
  teammateAvatar: {
    url: "/assets/teammate-avatar-round.png",
  },
  navGroups: [
    {
      _key: "product",
      _type: "navGroup",
      label: "Product",
      columns: [
        { _key: "platform", _type: "navColumn", label: "Platform", links: [
          { _key: "orchestration", _type: "navLink", label: "Release Orchestration", description: "Plan, coordinate, and execute every release.", href: "/orchestration" },
          { _key: "intelligence", _type: "navLink", label: "Release Intelligence", description: "AI-powered insights across your release cycle.", href: "/intelligence" },
        ]},
        { _key: "extend", _type: "navColumn", label: "Extend", links: [
          { _key: "integrations", _type: "navLink", label: "Integrations", description: "Connect Team to your existing tools.", href: "/integrations" },
          { _key: "security", _type: "navLink", label: "Security", description: "Your data protected. Your music safe.", href: "/security" },
        ]},
      ],
      promoCard: {
        kicker: "Get started",
        headline: "See Team in action.",
        body: "Watch a guided walkthrough with one of our specialists — tailored to your workflow.",
        ctaLabel: "Book a demo",
        ctaHref: "/demo",
      },
    },
    {
      _key: "solutions",
      _type: "navGroup",
      label: "Solutions",
      columns: [
        { _key: "byrole", _type: "navColumn", label: "By role", links: [
          { _key: "labels", _type: "navLink", label: "For Labels", description: "Manage every release across your roster.", href: "/for-labels" },
          { _key: "managers", _type: "navLink", label: "For Managers", description: "One view of every artist's rollout.", href: "/for-managers" },
          { _key: "artists", _type: "navLink", label: "For Artists", description: "Stay in the loop on your release.", href: "/for-artists" },
        ]},
        { _key: "ecosystem", _type: "navColumn", label: "Ecosystem", links: [
          { _key: "partners", _type: "navLink", label: "For Partners", description: "Marketing, distributors, and service providers.", href: "/for-partners" },
          { _key: "enterprise", _type: "navLink", label: "For Enterprise", description: "Custom deployments for major labels and large rosters.", href: "/enterprise" },
        ]},
      ],
      promoCard: {
        kicker: "Try it free",
        headline: "Start free for 30 days.",
        body: "No credit card required. Full access to Team on your first three releases.",
        ctaLabel: "Start free",
        ctaHref: "/pricing",
      },
    },
    {
      _key: "resources",
      _type: "navGroup",
      label: "Resources",
      columns: [
        { _key: "learn", _type: "navColumn", label: "Learn", links: [
          { _key: "insights", _type: "navLink", label: "Insights", description: "Release strategy, playbooks, and deep dives.", href: "/insights" },
          { _key: "changelog", _type: "navLink", label: "Changelog", description: "What's new and shipping in Team.", href: "/changelog" },
          { _key: "about", _type: "navLink", label: "About Team", description: "Why we built the OS for music releases.", href: "/about" },
        ]},
        { _key: "connect", _type: "navColumn", label: "Connect", links: [
          { _key: "demo", _type: "navLink", label: "Book a Demo", description: "Walk through Team with a specialist.", href: "/demo" },
          { _key: "contact", _type: "navLink", label: "Contact Us", description: "Talk to sales, support, or partnerships.", href: "/contact" },
        ]},
      ],
      promoCard: {
        kicker: "Questions?",
        headline: "Talk to the team.",
        body: "We reply to every message personally — usually within a few hours during business days.",
        ctaLabel: "Get in touch",
        ctaHref: "/contact",
      },
    },
  ],
  navStatus: { label: "Operational", href: "#status" },
  navPricingLink: { label: "Pricing", href: "/pricing" },
  navLogin: { label: "Login", href: "https://app.teamrollouts.com/sign-in" },
  navPrimaryCta: cta("Start free", "/pricing"),
  navSecondaryCta: cta("Login", "https://app.teamrollouts.com/sign-in"),

  footerNewsletter: {
    headlineTop: "Get release intel",
    headlineBottom: "in your inbox",
    body: "Monthly insights on rollout strategy, industry trends, and how the best teams ship releases. No spam.",
    placeholder: "you@yourlabel.com",
    buttonLabel: "Subscribe",
    successMessage: "Thanks for joining us on this wild ride!",
  },
  footerBrandDescription: "The operating system for music releases. Plan, coordinate, and execute your entire rollout from one platform.",
  footerWordmark: "team",
  footerColumns: [
    {
      _key: "platform",
      _type: "footerColumn",
      heading: "Platform",
      links: [
        { _key: "orch", _type: "footerLink", label: "Release Orchestration", href: "/orchestration" },
        { _key: "intel", _type: "footerLink", label: "Release Intelligence", href: "/intelligence" },
        { _key: "ent", _type: "footerLink", label: "Enterprise", href: "/enterprise" },
        { _key: "sec", _type: "footerLink", label: "Security", href: "/security" },
        { _key: "int", _type: "footerLink", label: "Integrations", href: "/integrations" },
      ],
    },
    {
      _key: "byrole",
      _type: "footerColumn",
      heading: "By Role",
      links: [
        { _key: "art", _type: "footerLink", label: "For Artists", href: "/for-artists" },
        { _key: "mgr", _type: "footerLink", label: "For Managers", href: "/for-managers" },
        { _key: "lbl", _type: "footerLink", label: "For Labels", href: "/for-labels" },
        { _key: "ptr", _type: "footerLink", label: "For Partners", href: "/for-partners" },
      ],
    },
    {
      _key: "learn",
      _type: "footerColumn",
      heading: "Learn",
      links: [
        { _key: "ins", _type: "footerLink", label: "Insights", href: "/insights" },
        { _key: "chg", _type: "footerLink", label: "Changelog", href: "/changelog" },
        { _key: "abt", _type: "footerLink", label: "About", href: "/about" },
        { _key: "prc", _type: "footerLink", label: "Pricing", href: "/pricing" },
      ],
    },
    {
      _key: "connect",
      _type: "footerColumn",
      heading: "Connect",
      links: [
        { _key: "demo", _type: "footerLink", label: "Book a demo", href: "/demo" },
        { _key: "ctc", _type: "footerLink", label: "Contact", href: "/contact" },
        { _key: "prv", _type: "footerLink", label: "Privacy", href: "/privacy" },
        { _key: "trm", _type: "footerLink", label: "Terms", href: "/terms" },
      ],
    },
  ],
  socialLinks: [
    { _key: "ig", _type: "socialLink", platform: "instagram", href: "https://instagram.com/teamrollouts" },
    { _key: "x", _type: "socialLink", platform: "twitter", href: "https://x.com/teamrollouts" },
    { _key: "li", _type: "socialLink", platform: "linkedin", href: "https://linkedin.com/company/teamrollouts" },
  ],
  footerLegal: "© 2026 Team Rollouts. All rights reserved.",
  defaultSeo: {
    metaTitle: "Team — The Operating System for Music Releases",
    metaDescription: "Stop juggling spreadsheets, Slack threads, and email chains. One platform for your entire rollout.",
  },
});

// ─── homepage ───────────────────────────────────────────────────────────
docs.push({
  _id: "homepage",
  _type: "homepage",
  hero: {
    eyebrow: "The operating system for music releases",
    typewriterWords: ["Command Center", "Strategy hub", "Single source of truth"],
    headlineSuffix: "for your music releases",
    subhead: "Stop juggling spreadsheets, Slack threads, and email chains.\nOne platform for your entire rollout.",
    primaryCta: cta("Book demo", "/demo"),
    secondaryCta: { ...cta("See the platform", "#"), type: "video" },
    tileLabels: { left: "Single", center: "EP", right: "Album" },
  },
  uploadSection: {
    headlineTop: "One platform.",
    headlineBottom: "One team.",
    headline: "One platform. One team.",
    body: "Whether you're rolling out a single, EP, or Album, every task, every asset, and every conversation needs a single home.",
    cta: { ...cta("See how it works", "#"), type: "video" },
  },
  rolesTabs: {
    label: "Built for every role",
    headlineSuffixA: "independent artists",
    headlineSuffixB: "major labels",
    headlineTop: "Built for",
    headlineBottom: "every role",
    headline: "Built for every role",
    subhead: "Whether you manage one artist or a roster of fifty, Team adapts to how you work.",
    tabs: [
      {
        _key: "artist",
        _type: "rolesTab",
        label: "Artists",
        roleKey: "artist",
        featuredHeading: "Run your own rollout",
        featuredBody: "Plan your release, keep collaborators aligned, and stay on top of every deadline — without needing a label behind you.",
        stackRows: [
          { _key: "art2", _type: "stackRow", number: "02", title: "Creative asset hub", description: "Keep artwork, videos, masters, and promo assets in one place for every release." },
          { _key: "art3", _type: "stackRow", number: "03", title: "Fan engagement playbook", description: "Schedule socials, pre-saves, and fan moments connected to your timeline." },
          { _key: "art4", _type: "stackRow", number: "04", title: "Collaborator coordination", description: "Bring producers, managers, and PR into a shared workspace — no Slack chaos." },
        ],
        learnMoreLabel: "Learn more about Team for Artists",
        learnMoreHref: "/for-artists",
      },
      {
        _key: "manager",
        _type: "rolesTab",
        label: "Managers",
        roleKey: "manager",
        featuredHeading: "One view across every artist",
        featuredBody: "Timeline, budget, assets, comms — everything you need to run multiple artists' releases side by side.",
        stackRows: [
          { _key: "mgr2", _type: "stackRow", number: "02", title: "Stakeholder updates in one click", description: "Generate status reports for artists, labels, and partners automatically." },
          { _key: "mgr3", _type: "stackRow", number: "03", title: "Deadline tracking", description: "Smart notifications before pitches, assets, or approvals are late." },
          { _key: "mgr4", _type: "stackRow", number: "04", title: "Cross-functional coordination", description: "Keep PR, social, paid, and distribution aligned without being the human glue." },
        ],
        learnMoreLabel: "Learn more about Team for Managers",
        learnMoreHref: "/for-managers",
      },
      {
        _key: "label",
        _type: "rolesTab",
        label: "Labels",
        roleKey: "label",
        featuredHeading: "Cross-roster visibility",
        featuredBody: "See every release across every artist in one view. Know what's on track, what's at risk, and where to focus today.",
        stackRows: [
          { _key: "lbl2", _type: "stackRow", number: "02", title: "Budget oversight", description: "Track spend across releases and artists in real time. No more end-of-quarter surprises." },
          { _key: "lbl3", _type: "stackRow", number: "03", title: "Team performance", description: "Understand who's delivering, what's bottlenecking — with data, not gut feel." },
          { _key: "lbl4", _type: "stackRow", number: "04", title: "Strategic planning", description: "Map your release calendar against market windows, competitor drops, and cultural moments." },
        ],
        learnMoreLabel: "Learn more about Team for Labels",
        learnMoreHref: "/for-labels",
      },
      {
        _key: "marketing",
        _type: "rolesTab",
        label: "Marketing & A&R",
        roleKey: "marketing",
        featuredHeading: "Campaign planning that sticks",
        featuredBody: "Build multi-channel marketing plans connected to your release timeline. Social, paid, email — all in sync.",
        stackRows: [
          { _key: "mk2", _type: "stackRow", number: "02", title: "Content production", description: "Brief, draft, review, and approve assets without leaving the platform. TeamMate handles first drafts." },
          { _key: "mk3", _type: "stackRow", number: "03", title: "Release readiness", description: "Know where every release stands — masters delivered, metadata confirmed, artwork approved." },
          { _key: "mk4", _type: "stackRow", number: "04", title: "Playlist & press strategy", description: "Track pitch windows, submission deadlines, and editorial contacts. Never miss an opportunity." },
        ],
        learnMoreLabel: "Learn more about Team for Partners",
        learnMoreHref: "/for-partners",
      },
    ],
  },
  engineSection: {
    headlineTop: "Find your personal",
    headlineMid: "release companion in",
    headlineItalic: "TeamMate",
    subhead: "Converse, plan, and execute plays with AI-powered release intelligence.",
    searchPlaceholder: "Ask TeamMate anything...",
    buttonLabel: "Ask TeamMate",
    searchDialog: "To try the search, book a demo",
    ponderingLabel: "TeamMate is pondering",
    resultLabels: [
      "Portrait_01.jpg",
      "Campaign_hero.png",
      "Product_shot.jpg",
      "Team_photo.png",
      "Banner_v2.jpg",
      "Social_post.png",
    ],
  },
  featureSpotlight: {
    headlineTop: "The all-in-one",
    headlineBottom: "release platform",
    headline: "The all-in-one release platform",
    subhead: "Every tool your team needs to plan, coordinate, and launch — in one place.",
    cards: [
      feat("Intuitive Timeline", "Plan and visualize your entire release schedule with a drag-and-drop timeline that keeps everyone aligned."),
      feat("AI TeamMate", "Your AI assistant that understands your artist, drafts marketing copy, and handles repetitive rollout tasks."),
      feat("Artist Intelligence", "Deep research on your artist's market position, audience demographics, and competitive landscape."),
      feat("Rollout Plans", "Pre-built and customizable rollout templates that adapt to your release type and team workflow."),
      feat("Budget Tracking", "Track spend across marketing, production, and promotion with real-time budget dashboards."),
      feat("Team Collaboration", "Built-in chat, file sharing, and task assignments keep your entire team connected and productive."),
    ],
  },
  guidelinesSection: {
    interactive: true,
    iframeSrc: "/dashboard-tour",
    sidebar: {
      searchPlaceholder: "Search releases...",
      navCommandCenter: "Command Center",
      navRecents: "Recents",
      navArtists: "Artists",
      navPressRuns: "Press Runs",
      navTouring: "Touring",
      yourReleasesLabel: "Your Releases",
      allReleasesLabel: "All Releases",
      allReleasesCount: "99",
      inProgressLabel: "In Progress",
      inProgressCount: "61",
      releasedLabel: "Released",
      releasedCount: "38",
    },
    contentHeader: {
      title: "Releases",
      addArtistLabel: "+ Add Artist",
      newReleaseLabel: "+ New Release",
      tabAll: "All Releases",
      tabInProgress: "In Progress",
      tabReleased: "Released",
    },
    demoReleases: [
      { _key: "rel1", _type: "demoRelease", title: "Arcadia", artist: "Marlowe Sky", releaseDate: "29 May 2026", status: "In Progress", progressPercent: 35 },
      { _key: "rel2", _type: "demoRelease", title: "Velvet Static", artist: "Kite Harlan", releaseDate: "12 Jun 2026", status: "Promo", progressPercent: 60 },
      { _key: "rel3", _type: "demoRelease", title: "Cedar & Honey", artist: "Orra Lane", releaseDate: "12 Jun 2026", status: "Planning", progressPercent: 60 },
      { _key: "rel4", _type: "demoRelease", title: "Deadreckon", artist: "Juno Palm", releaseDate: "2 May 2026", status: "Released", progressPercent: 100 },
      { _key: "rel5", _type: "demoRelease", title: "Ember Pact", artist: "Sable Roux", releaseDate: "5 Jul 2026", status: "Active", progressPercent: 45 },
      { _key: "rel6", _type: "demoRelease", title: "Lowtide", artist: "Nine Twenty", releaseDate: "14 Aug 2026", status: "Planning", progressPercent: 10 },
      { _key: "rel7", _type: "demoRelease", title: "Analog Soul", artist: "Petra Vox", releaseDate: "28 Jun 2026", status: "Promo", progressPercent: 70 },
      { _key: "rel8", _type: "demoRelease", title: "Runaway Signal", artist: "Blythe Orson", releaseDate: "9 Jul 2026", status: "Active", progressPercent: 50 },
      { _key: "rel9", _type: "demoRelease", title: "Marigold", artist: "West Canyon", releaseDate: "21 Aug 2026", status: "Planning", progressPercent: 20 },
    ],
    chat: {
      online: "ONLINE",
      userTimestamp: "You · 2m ago",
      userMessage: "Plan a comprehensive pre-release strategy focused on fan engagement",
      aiTimestamp: "TeamMate · just now",
      aiPrefix: "Done. I've added",
      aiTaskCount: "6 tasks",
      aiSuffix: "to the Arcadia timeline covering social teasers, playlist pitch, press run, and launch week.",
      categoryPills: [
        { _key: "p1", _type: "categoryPill", label: "+ Social · 2", color: "pink" },
        { _key: "p2", _type: "categoryPill", label: "+ A&R · 1", color: "green" },
        { _key: "p3", _type: "categoryPill", label: "+ Marketing · 2", color: "orange" },
        { _key: "p4", _type: "categoryPill", label: "+ Events · 1", color: "orange" },
      ],
      replyPlaceholder: "Reply to TeamMate...",
    },
    timelineRelease: { title: "Arcadia", meta: "Marlowe Sky · Release · 29 May 2026" },
    timelineFilters: [
      { _key: "f1", _type: "timelineFilter", label: "All tasks · 11", active: true },
      { _key: "f2", _type: "timelineFilter", label: "Marketing · 3", active: false },
      { _key: "f3", _type: "timelineFilter", label: "Social · 2", active: false },
      { _key: "f4", _type: "timelineFilter", label: "+ 4", active: false },
    ],
    timelineWeekLabel: "Week of 13 Mar",
    timelineWeekSummary: "11 tasks · 1 late · 3 done",
    timelineDays: [
      { _key: "d1", _type: "timelineDay", dayNumber: "13", dayLabel: "Fri", tasks: [
        { _key: "d1t1", _type: "timelineTask", status: "done", time: "9 AM", title: "Finalise cover artwork v4", category: "Marketing", categoryColor: "marketing", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "JR", color: "orangeRed" }] },
        { _key: "d1t2", _type: "timelineTask", status: "done", time: "2 PM", title: "Pre-save link QA across DSPs", category: "Distribution", categoryColor: "distribution", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "SL", color: "blueIndigo" }] },
        { _key: "d1t3", _type: "timelineTask", status: "done", time: "5 PM", title: "Brief press photographer", category: "PR", categoryColor: "pr", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "MK", color: "pinkViolet" }] },
      ]},
      { _key: "d2", _type: "timelineDay", dayNumber: "14", dayLabel: "Sat", tasks: [
        { _key: "d2t1", _type: "timelineTask", status: "active", time: "11 AM", title: "Instagram teaser #1", category: "Social", categoryColor: "social", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "AK", color: "cyanBlue" }] },
        { _key: "d2t2", _type: "timelineTask", status: "active", time: "4 PM", title: "TikTok challenge launch", category: "Social", categoryColor: "social", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "TB", color: "orangeBurst" }] },
      ]},
      { _key: "d3", _type: "timelineDay", dayNumber: "15", dayLabel: "Sun", badge: "TODAY", badgeStyle: "today", tasks: [
        { _key: "d3t1", _type: "timelineTask", status: "late", statusLabel: "LATE · 2 DAYS", time: "10 AM", title: "Spotify playlist pitch", category: "A&R", categoryColor: "ar", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "DR", color: "greenEmerald" }] },
        { _key: "d3t2", _type: "timelineTask", status: "active", time: "3 PM", title: "Upload Spotify Canvas", category: "Content", categoryColor: "content", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "NL", color: "purplePink" }] },
        { _key: "d3t3", _type: "timelineTask", status: "active", time: "6 PM", title: "Send fan newsletter", subtitle: "28,430 subscribers", category: "Marketing", categoryColor: "marketing", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "JR", color: "orangeRed" }] },
      ]},
      { _key: "d4", _type: "timelineDay", dayNumber: "16", dayLabel: "Mon", tasks: [
        { _key: "d4t1", _type: "timelineTask", status: "pending", time: "8 AM", title: "Press embargo lifts", category: "PR", categoryColor: "pr", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "MK", color: "pinkViolet" }] },
        { _key: "d4t2", _type: "timelineTask", status: "pending", time: "12 PM", title: "Radio plugger follow-up", category: "Radio", categoryColor: "radio", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "RV", color: "skyCyan" }] },
        { _key: "d4t3", _type: "timelineTask", status: "pending", time: "3 PM", title: "Merch store go-live", category: "Commerce", categoryColor: "commerce", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "EO", color: "lime" }] },
      ]},
      { _key: "d5", _type: "timelineDay", dayNumber: "17", dayLabel: "Tue", badge: "RELEASE", badgeStyle: "release", tasks: [
        { _key: "d5t1", _type: "timelineTask", status: "pending", time: "10 AM", title: "Lyric video premiere", category: "Video", categoryColor: "video", assignees: [{ _key: "a1", _type: "timelineAssignee", initials: "NL", color: "purplePink" }] },
        { _key: "d5t2", _type: "timelineTask", status: "pending", time: "7 PM", title: "Launch party · Brooklyn", subtitle: "Baby's All Right · 180 RSVPs", category: "Events", categoryColor: "events", assignees: [
          { _key: "a1", _type: "timelineAssignee", initials: "AK", color: "cyanBlue" },
          { _key: "a2", _type: "timelineAssignee", initials: "JR", color: "orangeRed" },
        ]},
      ]},
    ],
  },
  brainSection: {
    headlineTop: "Every rollout",
    headlineBottom: "builds a brain",
    headline: "Every rollout",
    body: "Each contact, task, observation, and decision becomes a living memory — only ever accessible to you and your team.",
    interactive: true,
    video: { src: "/assets/brain-1-web.mp4" },
  },
  integrationsMarquee: {
    headlineTop: "These weren't built for",
    headlineBottom: "your release stack",
    headline: "These weren't built for your release stack",
    subhead: "General-purpose tools weren't built for how we run releases.",
    ctaLabel: "Try it for free",
    ctaHref: "https://app.teamrollouts.com/onboarding?plan=pro&period=yearly",
    logos: [
      { _key: "asana", _type: "marqueeLogo", name: "Asana", logoUrl: "https://cdn.simpleicons.org/asana" },
      { _key: "jira", _type: "marqueeLogo", name: "Jira", logoUrl: "https://cdn.simpleicons.org/jira" },
      { _key: "trello", _type: "marqueeLogo", name: "Trello", logoUrl: "https://cdn.simpleicons.org/trello" },
      { _key: "notion", _type: "marqueeLogo", name: "Notion", logoUrl: "https://cdn.simpleicons.org/notion/111111" },
      { _key: "clickup", _type: "marqueeLogo", name: "ClickUp", logoUrl: "https://cdn.simpleicons.org/clickup" },
      { _key: "linear", _type: "marqueeLogo", name: "Linear", logoUrl: "https://cdn.simpleicons.org/linear/5E6AD2" },
      { _key: "monday", _type: "marqueeLogo", name: "Monday.com", logoUrl: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/monday.svg" },
      { _key: "confluence", _type: "marqueeLogo", name: "Confluence", logoUrl: "https://cdn.simpleicons.org/confluence" },
      { _key: "slack", _type: "marqueeLogo", name: "Slack", logoUrl: "https://svgl.app/library/slack.svg" },
      { _key: "msteams", _type: "marqueeLogo", name: "Microsoft Teams", logoUrl: "https://svgl.app/library/microsoft-teams.svg" },
      { _key: "discord", _type: "marqueeLogo", name: "Discord", logoUrl: "https://cdn.simpleicons.org/discord" },
      { _key: "zoom", _type: "marqueeLogo", name: "Zoom", logoUrl: "https://cdn.simpleicons.org/zoom" },
      { _key: "gmail", _type: "marqueeLogo", name: "Gmail", logoUrl: "https://cdn.simpleicons.org/gmail" },
      { _key: "outlook", _type: "marqueeLogo", name: "Outlook", logoUrl: "https://svgl.app/library/microsoft-outlook.svg" },
      { _key: "gdrive", _type: "marqueeLogo", name: "Google Drive", logoUrl: "https://cdn.simpleicons.org/googledrive" },
      { _key: "dropbox", _type: "marqueeLogo", name: "Dropbox", logoUrl: "https://cdn.simpleicons.org/dropbox" },
      { _key: "onedrive", _type: "marqueeLogo", name: "OneDrive", logoUrl: "https://svgl.app/library/microsoft-onedrive.svg" },
      { _key: "msword", _type: "marqueeLogo", name: "Word", logoUrl: "https://svgl.app/library/microsoft-word.svg" },
      { _key: "msexcel", _type: "marqueeLogo", name: "Excel", logoUrl: "https://svgl.app/library/microsoft-excel.svg" },
      { _key: "msppt", _type: "marqueeLogo", name: "PowerPoint", logoUrl: "https://svgl.app/library/microsoft-powerpoint.svg" },
      { _key: "figma", _type: "marqueeLogo", name: "Figma", logoUrl: "https://cdn.simpleicons.org/figma" },
    ],
  },
  faq: {
    headlineTop: "Straight answers",
    headlineBottom: "no spin.",
    headline: "Straight answers",
    subhead: "Everything you need to know about Team before you give it a try. Still stuck? Our founders answer demos personally.",
    footerCta: { label: "Talk to a founder", href: "/demo" },
    items: [
      { _key: "q1", _type: "faqItem", question: "What exactly is Team?", answer: [
        block("Team is the operating system for music releases. It replaces the patchwork of spreadsheets, Slack threads, and Notion docs that most release teams stitch together with one connected workspace — timelines, tasks, budgets, assets, comms, and AI, all in a single view."),
        block("Whether you're an independent artist shipping your first single or a major label managing hundreds of releases a year, Team adapts to how you actually work."),
      ]},
      { _key: "q2", _type: "faqItem", question: "Who is Team built for?", answer: [
        block("Three tiers, three workflows: Artists — solo artists and small teams shipping singles and EPs (free tier, built for you). Team — independent labels, managers, and mid-sized operations running multiple active rollouts. Enterprise — major labels and large management companies with hundreds of releases, multiple rosters, and complex approval flows."),
        block("Every plan is free for 30 days, no credit card required."),
      ]},
      { _key: "q3", _type: "faqItem", question: "How is this different from Notion, Asana, or Monday?", answer: [
        block("Generic project tools don't know what a playlist pitch is, what a DSP window is, or how a release cycle flows. You end up customising templates and rebuilding the same workflows every time."),
        block("Team is built exclusively for music. Every timeline template, every AI prompt, every integration, every metric — all shaped by how labels, managers, and artists actually ship music."),
      ]},
      { _key: "q4", _type: "faqItem", question: "What does TeamMate (the AI) actually do?", answer: [
        block("TeamMate is your release co-pilot. It plans rollouts from a brief, drafts social copy in your artist's voice, flags overdue tasks and risk before they become fires, generates status updates for stakeholders, and answers questions about any release in plain language."),
        block("It learns from your team's patterns over time, so the longer you use it, the sharper its suggestions become."),
      ]},
      { _key: "q5", _type: "faqItem", question: "Can I connect Team to tools I already use?", answer: [
        block("Yes. Team connects to Spotify for Artists, Apple Music for Artists, distributors, social platforms, Slack, Google Workspace, Dropbox, and more. Pull streaming data, push release updates, sync calendars, bring assets in — all without leaving Team."),
        block("Enterprise plans include custom integrations and API access."),
      ]},
      { _key: "q6", _type: "faqItem", question: "What's the 30-day free trial catch?", answer: [
        block("None. No credit card required, full feature access on every plan for 30 days. Most teams decide within the first week — we give you 30 days because we know release cycles can take time to coordinate, and we want you to ship one on Team before you pay a cent."),
        block("At the end of the trial, you pick the plan that fits — or walk away with your data exportable in a single click."),
      ]},
      { _key: "q7", _type: "faqItem", question: "How long does onboarding take?", answer: [
        block("Artists and small teams are usually up and running within 15 minutes. Mid-sized teams import their existing workflows and roster in a day. Enterprise rollouts come with dedicated onboarding — typically 1–2 weeks to migrate data, configure approvals, and train the team."),
      ]},
      { _key: "q8", _type: "faqItem", question: "Is my data secure?", answer: [
        block("Yes. SOC 2 Type II compliant, end-to-end encryption in transit and at rest, role-based access controls, and full audit logs. Enterprise customers get SSO, custom data residency, and dedicated support."),
        block("Unreleased music and assets are protected — watermarking, access logs, and expirable share links come standard."),
      ]},
      { _key: "q9", _type: "faqItem", question: "Can I talk to a real person?", answer: [
        block("Always. Book a demo and you'll meet one of the founders — not a sales rep. We want to understand your workflow, show you exactly where Team fits, and answer anything this FAQ didn't cover."),
        block("Or email us directly at hello@teamrollouts.com."),
      ]},
    ],
  },
  chrome: {
    sideNav: {
      dots: [
        { _key: "n1", _type: "sideNavDot", label: "Overview", target: "uploadSection" },
        { _key: "n2", _type: "sideNavDot", label: "TeamMate", target: "engineSection" },
        { _key: "n3", _type: "sideNavDot", label: "Dashboard", target: "guidelinesSection" },
        { _key: "n4", _type: "sideNavDot", label: "Features", target: "featuresSection" },
        { _key: "n5", _type: "sideNavDot", label: "The Brain", target: "brainSection" },
        { _key: "n6", _type: "sideNavDot", label: "FAQ", target: "faqSection" },
        { _key: "n7", _type: "sideNavDot", label: "Get started", target: "storiesSection" },
      ],
    },
    floatingCta: { label: "Start a free trial", href: "/pricing" },
    videoModal: { videoSrc: "/assets/demo.mp4", closeAriaLabel: "Close video" },
  },
  stories: {
    headlineTop: "Ready to transform",
    headlineBottom: "your next release?",
    headline: "Ready to transform your next release?",
    subhead: "Experience first-hand how Team eliminates the chaos and brings clarity to your workflow.",
    ctaLabel: "Start a free trial",
    ctaHref: "/pricing",
    note: "No credit card required.",
    slides: [
      { _key: "s1", _type: "testimonialSlide", tier: "enterprise", name: "Amara Johnson", role: "Head of Marketing · Major Label", quote: "Team gave our A&R and marketing teams a shared view we never had before." },
      { _key: "s2", _type: "testimonialSlide", tier: "artist", name: "Marcus Okafor", role: "Independent Artist", quote: "Finally one place to plan my release instead of ten different apps." },
      { _key: "s3", _type: "testimonialSlide", tier: "team", name: "Priya Sharma", role: "Artist Manager · Management Company", quote: "I manage six artists — Team is the only way I stay on top of it all." },
      { _key: "s4", _type: "testimonialSlide", tier: "enterprise", name: "James Liu", role: "VP Operations · Major Label", quote: "Release planning across 40+ artists used to be chaos. Now it's visible." },
      { _key: "s5", _type: "testimonialSlide", tier: "artist", name: "Emma Fontaine", role: "Singer-Songwriter", quote: "My whole release workflow in one place. Feels like having a tour manager in my pocket." },
      { _key: "s6", _type: "testimonialSlide", tier: "team", name: "David Harlan", role: "Label Head · Indie Label", quote: "Our roster has doubled and our ops team is the same size. Team made that possible." },
      { _key: "s7", _type: "testimonialSlide", tier: "enterprise", name: "Sofia Reyes", role: "A&R Director · Major Label", quote: "Artist Intelligence changed how we approach signings and release strategy." },
      { _key: "s8", _type: "testimonialSlide", tier: "artist", name: "Theo Walsh", role: "Producer / Artist", quote: "The AI Teammate drafts my socials in my voice. I don't dread release week anymore." },
      { _key: "s9", _type: "testimonialSlide", tier: "team", name: "Nadia Kim", role: "Day-to-Day Manager · Management Company", quote: "Stakeholder updates that used to take hours now generate in a click." },
      { _key: "s10", _type: "testimonialSlide", tier: "enterprise", name: "Marcus Vaughn", role: "Head of Distribution · Major Label", quote: "Delivery tracking across our global catalogue — all in one dashboard." },
    ],
  },
});

// ─── about ──────────────────────────────────────────────────────────────
docs.push({
  _id: "aboutPage",
  _type: "aboutPage",
  hero: {
    pillLabel: "About",
    headlineTop: "Built by people who",
    headlineBottom: "ship music for a living",
    subhead: "Team was founded by people who've lived the chaos of release management firsthand — and decided to fix it.",
  },
  mission: {
    headlineTop: "The operating system",
    headlineBottom: "for music releases",
    body: [
      block("Every day, thousands of releases ship across every platform, every genre, every market. Behind each one is a team of people coordinating timelines, chasing assets, managing budgets, and hoping nothing falls through the cracks."),
      block("We built Team because we believe that process shouldn't be held together by spreadsheets, group chats, and calendar reminders. Music deserves its own operating system — one that understands releases, not just projects."),
    ],
  },
  story: {
    headlineTop: "Why we",
    headlineBottom: "started Team",
    body: [
      block("We've been on both sides of the release. As artists trying to get music out. As managers juggling rosters. As label teams coordinating across departments. And every time, the same problem: the tools weren't built for this."),
      block("Project management tools are great for software teams. CRMs are great for sales teams. But nobody had built something specifically for the people who ship music. So we did."),
      block("Team combines release orchestration with AI-powered intelligence to give every artist, manager, and label a structured, visible, and intelligent way to run their releases — from first demo to post-release analysis."),
    ],
  },
  valuesSection: {
    headlineTop: "What drives",
    headlineBottom: "how we build",
    values: [
      { _key: "music", _type: "valueCard", title: "Music first", body: "Every feature starts with a release. We don't build generic tools and bolt on music features. We start with the way music actually ships and work backwards from there." },
      { _key: "ai", _type: "valueCard", title: "AI as an enabler", body: "We use AI to make people better at what they do — not to replace them. Every recommendation, every insight, every suggestion is there to inform your decisions, not make them for you." },
      { _key: "data", _type: "valueCard", title: "Your data, your rules", body: "Your releases, your strategy, your audience data — it's yours. We don't train our models on your data, we don't share it across accounts, and we never will." },
    ],
  },
  contactCta: {
    headlineTop: "Want to",
    headlineBottom: "get in touch?",
    body: "Whether you want to learn more about Team, explore a partnership, or just say hello — we'd love to hear from you. Our founders answer every message personally.",
    linkLabel: "Contact us",
    linkHref: "/contact",
  },
  rolesGrid: ROLES_GRID_DEFAULT,
});

// ─── contact ────────────────────────────────────────────────────────────
docs.push({
  _id: "contactPage",
  _type: "contactPage",
  headlineTop: "Get in",
  headlineBottom: "touch",
  headline: "Get in touch",
  subhead: "Have a question, want to learn more, or just want to say hello?\nWe'd love to hear from you.",
  submitLabel: "Send message",
  emailFallbackText: "Or email us directly at",
  interestOptions: [
    { _key: "art", _type: "interestOption", label: "Team for Artists", value: "artists" },
    { _key: "mgr", _type: "interestOption", label: "Team for Managers", value: "managers" },
    { _key: "lbl", _type: "interestOption", label: "Team for Labels", value: "labels" },
    { _key: "ent", _type: "interestOption", label: "Team for Enterprise", value: "enterprise" },
  ],
});

// ─── demo ───────────────────────────────────────────────────────────────
docs.push({
  _id: "demoPage",
  _type: "demoPage",
  headlineTop: "Book",
  headlineBottom: "a demo",
  headline: "Book a demo",
  subhead: "See how Team can streamline your release workflow.\nMeet a founder — not a sales rep.",
  submitLabel: "Continue to pick a time",
  formHint: "You'll be redirected to our calendar to choose a time slot.",
  emailFallbackText: "Or email us directly at",
  backgroundVideo: { src: "/assets/brain-1-web.mp4" },
});

// ─── pricing (abridged: see schema for full structure) ─────────────────
docs.push({
  _id: "pricingPage",
  _type: "pricingPage",
  hero: {
    headlineTop: "Start free.",
    headlineBottom: "Upgrade when you're ready.",
    headline: "Start free.",
    subhead: "Start using it with no commitment. Free forever for one artist, or unlock the full platform with Pro — 30 days free.",
    cta: cta("Try Pro free for 30 days", "https://app.teamrollouts.com/onboarding?plan=pro&period=yearly"),
  },
  billingToggle: { yearlyLabel: "Yearly", monthlyLabel: "Monthly", yearlySaveTag: "Save ~20%" },
  tiers: [
    {
      _key: "free",
      _type: "pricingTier",
      tierKey: "free",
      name: "Free",
      who: "For solo artists getting started",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      period: "forever",
      thenText: "No catch. That's a promise.",
      ctaLabel: "Get started free",
      ctaHref: "https://app.teamrollouts.com/onboarding?plan=free&period=yearly",
      includesLabel: "Includes:",
      features: ["1 artist", "Unlimited releases", "1 seat", "1 collaborator", "1 workspace", "Unlimited stacks", "TeamMate AI included", "Intelligence (Basic)", "Rollout Plan", "Budget Management"],
      compareLink: "#compare",
    },
    {
      _key: "pro",
      _type: "pricingTier",
      tierKey: "pro",
      name: "Pro",
      who: "For artists, managers, indie labels & teams",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      priceMonthlyValue: "24.99",
      priceYearlyValue: "19.99",
      priceUnit: "seat",
      period: "/month per seat",
      trialNote: "for 30 days",
      thenText: "Then $19.99/month per seat",
      billingNote: "billed yearly",
      ctaLabel: "Start your free trial",
      ctaHref: "https://app.teamrollouts.com/onboarding?plan=pro&period=yearly",
      includesLabel: "Everything in Free, plus:",
      badge: "Limited time pricing",
      features: ["Unlimited artists", "2 premium seats", "Unlimited collaborators (Timeline access)", "Unlimited workspaces", "TeamMate AI included", "Intelligence (Comprehensive)", "TeamMate Email & Text", "Press Tour", "Tour Management", "Document Ingestion", "Team Chat", "Reports & Sharing", "Command Center", "Priority support"],
      compareLink: "#compare",
    },
  ],
  comparisonTable: {
    heading: "Compare plans",
    columns: ["Free", "Pro"],
    rows: [
      { _key: "r1", _type: "comparisonRow", label: "# of artists", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "text", text: "1" },
        { _key: "b", _type: "comparisonCell", type: "text", text: "Unlimited" },
      ]},
      { _key: "r2", _type: "comparisonRow", label: "# of releases per year", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "text", text: "Unlimited" },
        { _key: "b", _type: "comparisonCell", type: "text", text: "Unlimited" },
      ]},
      { _key: "r3", _type: "comparisonRow", label: "TeamMate AI", tooltip: "An AI built for music releases — understands the industry, learns your patterns, works 24/7.", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "check" },
        { _key: "b", _type: "comparisonCell", type: "check" },
      ]},
      { _key: "r4", _type: "comparisonRow", label: "Intelligence", tooltip: "Pro gets full reasoning against your timeline, proactive insights, and a memory that learns your release.", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "text", text: "Basic" },
        { _key: "b", _type: "comparisonCell", type: "text", text: "Comprehensive" },
      ]},
      { _key: "r5", _type: "comparisonRow", label: "# of seats", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "text", text: "1" },
        { _key: "b", _type: "comparisonCell", type: "text", text: "2 (premium)" },
      ]},
      { _key: "r6", _type: "comparisonRow", label: "Collaborator type", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "text", text: "1" },
        { _key: "b", _type: "comparisonCell", type: "text", text: "Unlimited (Timeline access)" },
      ]},
      { _key: "r7", _type: "comparisonRow", label: "# of workspaces", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "text", text: "1" },
        { _key: "b", _type: "comparisonCell", type: "text", text: "Unlimited" },
      ]},
      { _key: "r8", _type: "comparisonRow", label: "TeamMate Email", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "dash" },
        { _key: "b", _type: "comparisonCell", type: "check" },
      ]},
      { _key: "r9", _type: "comparisonRow", label: "TeamMate Text", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "dash" },
        { _key: "b", _type: "comparisonCell", type: "check" },
      ]},
      { _key: "r10", _type: "comparisonRow", label: "Press Tour", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "dash" },
        { _key: "b", _type: "comparisonCell", type: "check" },
      ]},
      { _key: "r11", _type: "comparisonRow", label: "Tour Management", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "dash" },
        { _key: "b", _type: "comparisonCell", type: "check" },
      ]},
      { _key: "r12", _type: "comparisonRow", label: "Document Ingestion", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "dash" },
        { _key: "b", _type: "comparisonCell", type: "check" },
      ]},
      { _key: "r13", _type: "comparisonRow", label: "Team Chat", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "dash" },
        { _key: "b", _type: "comparisonCell", type: "check" },
      ]},
      { _key: "r14", _type: "comparisonRow", label: "Reports & Sharing", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "dash" },
        { _key: "b", _type: "comparisonCell", type: "check" },
      ]},
      { _key: "r15", _type: "comparisonRow", label: "Command Center", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "dash" },
        { _key: "b", _type: "comparisonCell", type: "check" },
      ]},
      { _key: "r16", _type: "comparisonRow", label: "Customer support", tooltip: "Pro accounts get a dedicated email channel with priority response.", valueByColumn: [
        { _key: "a", _type: "comparisonCell", type: "text", text: "Standard" },
        { _key: "b", _type: "comparisonCell", type: "text", text: "Priority (dedicated email)" },
      ]},
    ],
  },
  faq: {
    eyebrow: "Pricing",
    headlineTop: "Questions?",
    headlineBottom: "We've got answers.",
    headline: "Questions? We've got answers.",
    subhead: "Everything you need to know about plans, billing, and what happens when your trial ends.",
    footerCta: { label: "Talk to a founder →", href: "/demo" },
    items: [
      { _key: "p-q1", _type: "faqItem", question: "What happens after my 30-day trial?", answer: [
        block("You choose a plan. All your data is preserved. If you downgrade, excess items become read-only — nothing is ever deleted."),
      ]},
      { _key: "p-q2", _type: "faqItem", question: "What happens to my data if I downgrade?", answer: [
        block("Nothing is deleted. Items beyond your plan's limits become read-only. You can still view and export them. You choose which items stay active."),
      ]},
      { _key: "p-q3", _type: "faqItem", question: "Can I change plans anytime?", answer: [
        block("Yes. Upgrade or downgrade at any time. Changes take effect on your next billing cycle."),
      ]},
      { _key: "p-q4", _type: "faqItem", question: "Is there an annual discount?", answer: [
        block("Yes. The prices shown are annual billing. Monthly billing is also available at a slightly higher rate."),
      ]},
    ],
  },
  finalCta: {
    headlineTop: "Ready to run",
    headlineBottom: "your next release?",
    headline: "Ready to run your next release?",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
    footnote: "30-day free trial.",
  },
});

// ─── for-artists / for-managers / for-labels (ICP) ──────────────────────
// ICP feature spotlight — same 6 cards across all 3 ICPs
const ICP_FEATURE_CARDS = [
  feat("Release Timeline", "Plan your release step by step. See every deadline at a glance and adjust as things change."),
  feat("Task Management", "Know exactly what you need to do and when. Check off tasks as you go."),
  feat("TeamMate AI", "Ask questions about your release, get suggestions on timing, and let AI draft your press bio."),
  feat("Rollout Plan", "Auto-generate a release plan based on your genre, timeline, and goals."),
  feat("Pre-save & Smart Links", "Create pre-save campaigns and smart links that drive fans to your music everywhere."),
  feat("Collaboration", "Working with a manager or designer? Invite them in. They see what they need — nothing more, nothing less."),
];

docs.push({
  _id: "forArtistsPage",
  _type: "icpPage",
  icpKey: "artists",
  hero: {
    headlineTop: "Focus on your music.",
    headlineBottom: "Team handles the rest.",
    subhead: "Releases are overwhelming. Between pitching playlists, managing socials, and hitting deadlines, it's easy to lose focus on what matters. Team keeps everything on track so you can create.",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  painSection: {
    headlineTop: "Stop juggling everything.",
    headlineBottom: "Start releasing properly.",
    rows: [
      painRow("Your release, simplified", "One place for everything instead of scattered notes and apps", "Stop juggling spreadsheets, notes apps, and calendar reminders. Team keeps your timeline, tasks, and assets in one place — so nothing gets forgotten."),
      painRow("AI-powered guidance", "Not sure what to do next? Let AI guide you", "Not sure when to post, what to say, or how to pitch? TeamMate AI gives you data-driven recommendations and even writes your press bio, social captions, and rollout plan."),
      painRow("Never miss a deadline", "Automated reminders that keep you on track", "Submission deadlines, marketing milestones, release dates — Team reminds you before things slip. And if you do work with a manager or collaborators, they can see exactly what's needed too."),
    ],
  },
  featureSpotlight: {
    headlineTop: "Everything you need",
    headlineBottom: "to release with confidence",
    headline: "Everything you need to release with confidence",
    subhead: "From first idea to release day and beyond",
    cards: ICP_FEATURE_CARDS,
  },
  stepsBlock: {
    headlineTop: "Up and running",
    headlineBottom: "in minutes",
    headline: "Up and running in minutes",
    steps: [
      step("1", "Sign up for free", "Create your account in 30 seconds. No credit card, no commitment. Full access for 30 days."),
      step("2", "Set up your release", "Add your track details, upload artwork, and set your release date."),
      step("3", "Launch your rollout", "Follow the plan, check off tasks, and release with confidence."),
    ],
  },
  finalCta: {
    headlineTop: "Ready to take control of",
    headlineBottom: "your next release?",
    headline: "Ready to take control of your next release?",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
    footnote: "30-day free trial. No credit card required.",
  },
  rolesGrid: {
    eyebrow: "Designed for",
    headlineTop: "Designed for",
    headlineBottom: "how you work",
    headline: "how you work",
    cards: [
      role("For Managers", "A single command center for every rollout across your entire roster.", "/for-managers"),
      role("For Labels", "Manage every release across your entire catalog from one central hub.", "/for-labels"),
      role("For Partners", "Marketing agencies, distributors, and service providers — connected to the releases that matter.", "/for-partners"),
    ],
  },
});
docs.push({
  _id: "forManagersPage",
  _type: "icpPage",
  icpKey: "managers",
  hero: {
    headlineTop: "One dashboard for every artist,",
    headlineBottom: "every release, every detail.",
    subhead: "Stop chasing your roster across spreadsheets, group chats, and email threads. Team gives you one command center for every artist, every rollout, and every deliverable.",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  painSection: {
    headlineTop: "Stop juggling rosters.",
    headlineBottom: "Start running them.",
    rows: [
      painRow("Roster overview", "See every artist, every release, every status — at a glance", "No more switching between tools to check who's where. Team gives you a unified view of every rollout your roster has in flight."),
      painRow("Built-in collaboration", "Bring artists and partners into the same workspace", "No more forwarding spreadsheets and copy-pasting updates. Artists, designers, distributors, and labels work alongside you in the same place."),
      painRow("Reports made simple", "Performance summaries that write themselves", "Send labels and artists clean weekly digests with streaming, social, and rollout progress — automatically generated and ready to share."),
    ],
  },
  featureSpotlight: {
    headlineTop: "Everything a manager needs",
    headlineBottom: "to scale a roster",
    headline: "Everything a manager needs to scale a roster",
    subhead: "From day-of-release coordination to long-term roster strategy",
    cards: ICP_FEATURE_CARDS,
  },
  stepsBlock: {
    headlineTop: "From chaos",
    headlineBottom: "to clarity in days",
    headline: "From chaos to clarity in days",
    steps: [
      step("1", "Add your artists", "Bring your full roster into one workspace. Each artist gets their own space; you stay in control."),
      step("2", "Build their rollouts", "Set up release timelines, tasks, and budgets in minutes. Templates make it fast."),
      step("3", "Run the show", "Coordinate every release, answer every question, deliver every report — all from one place."),
    ],
  },
  finalCta: {
    headlineTop: "Ready to manage your roster",
    headlineBottom: "without the chaos?",
    headline: "Ready to manage your roster without the chaos?",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
    footnote: "30-day free trial. No credit card required.",
  },
  rolesGrid: {
    eyebrow: "Designed for",
    headlineTop: "Designed for",
    headlineBottom: "how you work",
    headline: "how you work",
    cards: [
      role("For Artists", "Your release, structured. No more winging it.", "/for-artists"),
      role("For Labels", "Manage every release across your entire catalog from one central hub.", "/for-labels"),
      role("For Partners", "Marketing agencies, distributors, and service providers — connected to the releases that matter.", "/for-partners"),
    ],
  },
});
docs.push({
  _id: "forLabelsPage",
  _type: "icpPage",
  icpKey: "labels",
  hero: {
    headlineTop: "Scale your release process.",
    headlineBottom: "Not your headcount.",
    subhead: "Run every release across every artist on a single platform — with the controls, reporting, and integrations a label needs.",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  painSection: {
    headlineTop: "Run more releases.",
    headlineBottom: "With less coordination tax.",
    rows: [
      painRow("Full catalog visibility", "Every artist, every release, every status — in one view", "Stop reconciling spreadsheets across departments. Team gives you a live, filterable view of your entire pipeline."),
      painRow("Department coordination", "A&R, marketing, finance — all on the same release", "Each team works in their own lane while staying aligned on what's shipping when. No more cross-department surprise."),
      painRow("Reports built for execs", "Roll-ups for leadership without the manual work", "Performance, budget burn, milestone status — Team rolls them up automatically into the dashboards your execs already expect."),
    ],
  },
  featureSpotlight: {
    headlineTop: "Everything a label needs",
    headlineBottom: "to run a roster at scale",
    headline: "Everything a label needs to run a roster at scale",
    subhead: "From release planning to portfolio reporting, in one place",
    cards: ICP_FEATURE_CARDS,
  },
  stepsBlock: {
    headlineTop: "From sprawl",
    headlineBottom: "to a single source of truth",
    headline: "From sprawl to a single source of truth",
    steps: [
      step("1", "Bring your catalog in", "Import your artists and active releases. We migrate from spreadsheets, Asana, Notion — whatever you're on today."),
      step("2", "Set up your standards", "Templates for release types, departments, approvals. Every release ships on a consistent process."),
      step("3", "Run the operation", "Coordinate across A&R, marketing, finance, and analytics — and report up to leadership effortlessly."),
    ],
  },
  finalCta: {
    headlineTop: "Ready to scale your label",
    headlineBottom: "without the chaos?",
    headline: "Ready to scale your label without the chaos?",
    primaryCta: cta("Book a demo", "/demo"),
    secondaryCta: cta("Talk to us", "/contact?interest=enterprise"),
    footnote: "Talk to us about enterprise pricing.",
  },
  rolesGrid: {
    eyebrow: "Designed for",
    headlineTop: "Designed for",
    headlineBottom: "how you work",
    headline: "how you work",
    cards: [
      role("For Artists", "Your release, structured. No more winging it.", "/for-artists"),
      role("For Managers", "A single command center for every rollout across your entire roster.", "/for-managers"),
      role("For Partners", "Marketing agencies, distributors, and service providers — connected to the releases that matter.", "/for-partners"),
    ],
  },
});

// ─── for-partners ───────────────────────────────────────────────────────
docs.push({
  _id: "forPartnersPage",
  _type: "partnerPage",
  hero: {
    headlineTop: "Your clients are already on Team.",
    headlineBottom: "Now you can be too.",
    subhead: "Whether you run PR campaigns, manage distribution, or handle marketing — Team gives you a seat at the table on every release you're part of.",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  painSection: {
    headlineTop: "Working across clients is messy.",
    headlineBottom: "Team cleans it up.",
    rows: [
      painRow("One login, every client", "See every release you're involved in from one dashboard", "No more logging into separate tools for each client. Team gives you a single view of every release you're contributing to — with the context you need to do your job."),
      painRow("Context, not chaos", "Get briefs, assets, and deadlines without the email chain", "When a client invites you into a release, you see the timeline, the assets, and exactly what's expected of you. No more digging through inboxes for that brief they sent last Tuesday."),
      painRow("Deliver on time", "Track your deliverables across every client", "See what's due, what's done, and what's at risk — across all your clients. Team keeps you accountable without the micromanagement."),
    ],
  },
  tabbedFeatures: {
    headlineTop: "Built for every",
    headlineBottom: "kind of partner",
    headline: "Built for every kind of partner",
    subhead: "Whatever your role in the release, Team has you covered",
    tabs: [
      { _key: "marketing", _type: "partnerTab", label: "Marketing & PR", tabKey: "marketing", features: [
        partnerFeat("Campaign Scheduling", "Sync your campaigns to release milestones"),
        partnerFeat("Press Outreach", "Track pitches, coverage, and media relationships"),
        partnerFeat("Social Planning", "Plan content across platforms, aligned to the rollout"),
        partnerFeat("Budget Visibility", "See what's allocated and what's been spent"),
      ]},
      { _key: "distribution", _type: "partnerTab", label: "Distribution", tabKey: "distribution", features: [
        partnerFeat("DSP Submissions", "Track delivery status across every platform"),
        partnerFeat("Metadata Check", "Validate metadata before submission"),
        partnerFeat("Status Updates", "Real-time delivery status for every release"),
        partnerFeat("Asset Ingestion", "Bulk upload and organise release assets"),
      ]},
      { _key: "ar", _type: "partnerTab", label: "A&R", tabKey: "ar", features: [
        partnerFeat("Demo Pipeline", "Review and rate incoming demos in one place"),
        partnerFeat("Artist Development", "Track development milestones for each artist"),
        partnerFeat("Release Analytics", "Understand performance across your roster"),
        partnerFeat("Market Intelligence", "Discover trends and competitive positioning"),
      ]},
      { _key: "creative", _type: "partnerTab", label: "Creative Services", tabKey: "creative", features: [
        partnerFeat("Asset Briefs", "Get clear specs and creative direction for every deliverable"),
        partnerFeat("Version Tracking", "Upload revisions and track approval history"),
        partnerFeat("Approval Workflows", "Submit work and get sign-off without the email thread"),
        partnerFeat("Deadline Reminders", "Never miss a delivery date"),
      ]},
    ],
  },
  stepsBlock: {
    headlineTop: "Up and running",
    headlineBottom: "in minutes",
    headline: "Up and running in minutes",
    steps: [
      step("1", "Get invited", "A client adds you to their release on Team. You get an email with instant access."),
      step("2", "See what's needed", "Your dashboard shows every release you're involved in, with your tasks and deadlines."),
      step("3", "Deliver and track", "Complete your work, upload assets, and track progress — all in one place."),
    ],
  },
  finalCta: {
    headlineTop: "Ready to work smarter",
    headlineBottom: "with your clients?",
    headline: "Ready to work smarter with your clients?",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
    footnote: "30-day free trial. No credit card required.",
  },
  rolesGrid: {
    eyebrow: "Designed for",
    headlineTop: "Designed for",
    headlineBottom: "how you work",
    headline: "how you work",
    cards: [
      role("For Artists", "Tools for independent artists to plan and execute releases on their own terms.", "/for-artists"),
      role("For Managers", "A single command center for every rollout across your entire roster.", "/for-managers"),
      role("For Labels", "Manage every release across your entire catalog from one central hub.", "/for-labels"),
    ],
  },
});

// ─── intelligence + orchestration ───────────────────────────────────────
docs.push({
  _id: "intelligencePage",
  _type: "verticalProductPage",
  verticalKey: "intelligence",
  hero: {
    headlineTop: "The smartest person",
    headlineBottom: "in the room.",
    subhead: "Team doesn't replace your instincts. It sharpens them. Context-aware intelligence layer helps you make better decisions, faster, keeping you in the driver's seat.",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  problemSection: {
    headlineTop: "AI that works for you.",
    headlineBottom: "Not instead of you.",
    paragraphs: [
      "The music industry has a complicated relationship with AI. We get it. That's why TeamMate was built with a simple principle: every decision is yours. TeamMate surfaces the context, the data, the options. You decide what to do with them.",
      "It won't write your songs. It won't replace your A&R instincts. It won't automate away the relationships that make this industry work. What it will do is make sure you never walk into a meeting uninformed, never miss a trend, and never launch a release without a strategy.",
      "Think of it as the smartest colleague you've ever had. One who's read every brief, tracked every number, and remembered every detail of every release you've ever done.",
    ],
  },
  painSection: {
    headlineTop: "What TeamMate",
    headlineBottom: "actually does",
    rows: [
      painRow("Contextual intelligence", "Recommendations that know your roster", "TeamMate doesn't give generic advice. It knows your artists, your release history, your audience, and your market. Every recommendation is specific to you — your release, your timeline, your goals."),
      painRow("Market awareness", "Know your landscape before you launch", "Understand your competitive positioning. See what similar artists are doing, when they're releasing, and where the gaps are. Launch with confidence, not guesswork."),
      painRow("From data to decisions", "Analytics that help you decide what to do next, not just what happened", "Most analytics tools show you charts. Team's intelligence shows you what they mean for your next move. So every insight can be turned into actions you can take right now."),
    ],
  },
  tabbedSpotlight: {
    headlineTop: "TeamMate",
    headlineBottom: "in action",
    subhead: "See how intelligence shapes every stage of a release",
    tabs: [
      { _key: "plan", _type: "spotlightTab", label: "Planning", tabKey: "plan", features: [
        spotFeat("Release Timing", "When should I drop this?"),
        spotFeat("Audience Analysis", "Who's going to listen?"),
        spotFeat("Competitive Scan", "What else is releasing?"),
        spotFeat("Strategy Generation", "Build me a rollout plan"),
      ]},
      { _key: "mid", _type: "spotlightTab", label: "Mid-Campaign", tabKey: "mid", features: [
        spotFeat("Performance Pulse", "How am I tracking?"),
        spotFeat("Playlist Intelligence", "Which playlists should I pitch?"),
        spotFeat("Campaign Optimisation", "What should I adjust?"),
        spotFeat("Real-time Alerts", "What needs my attention?"),
      ]},
      { _key: "post", _type: "spotlightTab", label: "Post-Release", tabKey: "post", features: [
        spotFeat("Release Retrospective", "What worked?"),
        spotFeat("Audience Growth", "Who found me?"),
        spotFeat("Revenue Insights", "Where's the money?"),
        spotFeat("Next Release Brief", "What should I do differently?"),
      ]},
      { _key: "scale", _type: "spotlightTab", label: "At Scale", tabKey: "scale", features: [
        spotFeat("Portfolio Overview", "How's my roster doing?"),
        spotFeat("Trend Analysis", "What's moving?"),
        spotFeat("Resource Allocation", "Where should I invest?"),
        spotFeat("Board Reporting", "Show me the numbers"),
      ]},
    ],
  },
  trustCallout: {
    headlineTop: "Your data",
    headlineBottom: "stays yours",
    body: "TeamMate learns your context to give better advice. But your data never leaves your account, never trains our models, and is never shared with anyone else.",
    ctaLabel: "Read more about our security",
    ctaHref: "/security",
  },
  bridgeSection: {
    headlineTop: "Intelligence without action",
    headlineBottom: "is just information",
    body: "Release Intelligence gives you the context to make brilliant decisions. Release Orchestration gives you the tools to execute them. Together, they're the complete operating system for music releases.",
    ctaLabel: "Explore Release Orchestration",
    ctaHref: "/orchestration",
  },
  finalCta: {
    headlineTop: "Ready to release",
    headlineBottom: "with intelligence?",
    headline: "Ready to release with intelligence?",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
    footnote: "30-day free trial. No credit card required.",
  },
  rolesGrid: ROLES_GRID_DEFAULT,
  // ── Pain section mocks (3 panels) ─────────────────────────
  painMocks: [
    { _key: "p0", _type: "mockPanel", kind: "chat", chatInputPlaceholder: "Ask TeamMate anything...",
      chatRows: [
        { _key: "u", _type: "mockChatRow", side: "user", text: "When should I release the new single?" },
        { _key: "a", _type: "mockChatRow", side: "ai", text: "Based on your audience patterns and the competitive landscape, I'd recommend April 18. Here's why:\n\n- Your core audience is most active Fri-Sun\n- No major releases from similar artists that week\n- Your last single peaked when released mid-April" },
      ],
    },
    { _key: "p1", _type: "mockPanel", kind: "dashboard",
      dashboardCards: [
        { _key: "1", _type: "mockDashboardCard", title: "Genre Trend", value: "+14%", pillLabel: "Rising", pillTone: "green" },
        { _key: "2", _type: "mockDashboardCard", title: "Similar Releases", value: "8", pillLabel: "This Month", pillTone: "blue" },
        { _key: "3", _type: "mockDashboardCard", title: "Best Window", value: "Apr 18-25", pillLabel: "Low Competition", pillTone: "green" },
        { _key: "4", _type: "mockDashboardCard", title: "Audience Peak", value: "Fri 6pm", pillLabel: "Optimal", pillTone: "green" },
      ],
    },
    { _key: "p2", _type: "mockPanel", kind: "budget",
      budgetSuggestionPrefix: "Suggested:",
      budgetSuggestion: "Your save rate is 2x above average. Consider pushing a fan-exclusive pre-order for the deluxe.",
      budgetBars: [
        { _key: "b1", _type: "mockBudgetBar", label: "Streams", value: "2.4M", percent: 80, color: "blue" },
        { _key: "b2", _type: "mockBudgetBar", label: "Saves", value: "18k", percent: 45, color: "purple" },
        { _key: "b3", _type: "mockBudgetBar", label: "Playlists", value: "342", percent: 55, color: "green" },
        { _key: "b4", _type: "mockBudgetBar", label: "Reach", value: "890k", percent: 70, color: "orange" },
      ],
    },
  ],
  // ── Tabbed spotlight mocks (16 panels: 4 tabs × 4 features) ─
  tabbedMocks: [
    // Plan tab
    { _key: "t-p1", _type: "mockPanel", kind: "chat", chatInputPlaceholder: "Ask TeamMate anything...",
      chatRows: [
        { _key: "u", _type: "mockChatRow", side: "user", text: "When should I release this single?" },
        { _key: "a", _type: "mockChatRow", side: "ai", text: "I'd recommend Friday April 18. Your audience peaks on Fridays, there's low competition that week, and your last single performed best with a mid-April release." },
      ],
    },
    { _key: "t-p2", _type: "mockPanel", kind: "dashboard",
      dashboardCards: [
        { _key: "1", _type: "mockDashboardCard", title: "Age 18-24", value: "42%", pillLabel: "Primary", pillTone: "green" },
        { _key: "2", _type: "mockDashboardCard", title: "Age 25-34", value: "31%", pillLabel: "Secondary", pillTone: "blue" },
        { _key: "3", _type: "mockDashboardCard", title: "Age 35-44", value: "16%", pillLabel: "Tertiary", pillTone: "amber" },
        { _key: "4", _type: "mockDashboardCard", title: "Age 45+", value: "11%", pillLabel: "Minor", pillTone: "amber" },
      ],
    },
    { _key: "t-p3", _type: "mockPanel", kind: "timeline",
      timelineRows: [
        { _key: "1", _type: "mockTimelineRow", label: "Luma", leftPct: 10, widthPct: 25, color: "orange" },
        { _key: "2", _type: "mockTimelineRow", label: "Kira Nova", leftPct: 30, widthPct: 20, color: "blue" },
        { _key: "3", _type: "mockTimelineRow", label: "Ash Velo", leftPct: 55, widthPct: 30, color: "purple" },
        { _key: "4", _type: "mockTimelineRow", label: "DJ Prism", leftPct: 20, widthPct: 35, color: "pink" },
        { _key: "5", _type: "mockTimelineRow", label: "Solace", leftPct: 70, widthPct: 20, color: "green" },
      ],
    },
    { _key: "t-p4", _type: "mockPanel", kind: "checklist",
      checklistItems: [
        "Set up pre-save campaign (4 weeks out)",
        "Submit to editorial playlists (3 weeks out)",
        "Send press release to 12 outlets (2 weeks out)",
        "Launch social teaser campaign (10 days out)",
        "Activate ad spend on Meta + TikTok (release day)",
      ],
    },
    // Mid-Campaign tab
    { _key: "t-m1", _type: "mockPanel", kind: "budget",
      budgetTotalLeft: "vs Target", budgetTotalRight: "Week 2 of 4",
      budgetBars: [
        { _key: "1", _type: "mockBudgetBar", label: "Streams", value: "72%", percent: 72, color: "blue" },
        { _key: "2", _type: "mockBudgetBar", label: "Saves", value: "88%", percent: 88, color: "green" },
        { _key: "3", _type: "mockBudgetBar", label: "Reach", value: "55%", percent: 55, color: "orange" },
      ],
    },
    { _key: "t-m2", _type: "mockPanel", kind: "tasks",
      tasksRows: [
        { _key: "1", _type: "mockTaskRow", label: "New Music Friday", status: "Added", statusTone: "green" },
        { _key: "2", _type: "mockTaskRow", label: "Indie Chill", status: "Added", statusTone: "green" },
        { _key: "3", _type: "mockTaskRow", label: "Fresh Finds", status: "Pitched", statusTone: "blue" },
        { _key: "4", _type: "mockTaskRow", label: "Discover Weekly", status: "Pitched", statusTone: "blue" },
        { _key: "5", _type: "mockTaskRow", label: "Release Radar", status: "Pending", statusTone: "amber" },
      ],
    },
    { _key: "t-m3", _type: "mockPanel", kind: "chat", chatInputPlaceholder: "Ask TeamMate anything...",
      chatRows: [
        { _key: "a", _type: "mockChatRow", side: "ai", text: "Your Instagram reach is 3x your TikTok. Consider shifting 20% of ad spend from TikTok to Instagram Reels for the remaining campaign period." },
      ],
    },
    { _key: "t-m4", _type: "mockPanel", kind: "alerts",
      alertItems: [
        { _key: "1", _type: "mockAlert", text: "Mara — artwork deadline tomorrow", dotTone: "amber" },
        { _key: "2", _type: "mockAlert", text: "Ash Velo — added to New Music Friday", dotTone: "green" },
        { _key: "3", _type: "mockAlert", text: "Golden Hour — ad spend 40% under-utilised", dotTone: "amber" },
        { _key: "4", _type: "mockAlert", text: "Kira Nova — save rate above target", dotTone: "green" },
      ],
    },
    // Post-Release tab
    { _key: "t-po1", _type: "mockPanel", kind: "report",
      reportTitle: "Release Retrospective — Golden Hour", reportDateLabel: "Final",
      reportStats: [
        { _key: "1", _type: "mockReportStat", value: "2.4M", label: "Streams" },
        { _key: "2", _type: "mockReportStat", value: "18k", label: "Saves" },
        { _key: "3", _type: "mockReportStat", value: "342", label: "Playlists" },
      ],
    },
    { _key: "t-po2", _type: "mockPanel", kind: "dashboard",
      dashboardCards: [
        { _key: "1", _type: "mockDashboardCard", title: "New Followers", value: "+12k", pillLabel: "Growth", pillTone: "green" },
        { _key: "2", _type: "mockDashboardCard", title: "Top Market", value: "London", pillLabel: "Primary", pillTone: "blue" },
        { _key: "3", _type: "mockDashboardCard", title: "Source", value: "Playlist 64%", pillLabel: "Top Channel", pillTone: "green" },
        { _key: "4", _type: "mockDashboardCard", title: "Retention", value: "78%", pillLabel: "Strong", pillTone: "green" },
      ],
    },
    { _key: "t-po3", _type: "mockPanel", kind: "budget",
      budgetTotalLeft: "Total Revenue", budgetTotalRight: "$4.4k",
      budgetBars: [
        { _key: "1", _type: "mockBudgetBar", label: "Streaming", value: "$2.4k", percent: 65, color: "blue" },
        { _key: "2", _type: "mockBudgetBar", label: "Sync", value: "$800", percent: 22, color: "purple" },
        { _key: "3", _type: "mockBudgetBar", label: "Merch", value: "$1.2k", percent: 33, color: "green" },
      ],
    },
    { _key: "t-po4", _type: "mockPanel", kind: "chat", chatInputPlaceholder: "Ask TeamMate anything...",
      chatRows: [
        { _key: "a", _type: "mockChatRow", side: "ai", text: "Based on Golden Hour's performance, your next single should target playlist curators early — you saw 3x the saves from editorial vs algorithmic. Start pitching 4 weeks before release." },
      ],
    },
    // At Scale tab
    { _key: "t-s1", _type: "mockPanel", kind: "command",
      commandCards: [
        { _key: "1", _type: "mockCommandCard", artist: "Mara", release: "Golden Hour", status: "On Track", statusTone: "green" },
        { _key: "2", _type: "mockCommandCard", artist: "Ash Velo", release: "Neon Drift EP", status: "On Track", statusTone: "green" },
        { _key: "3", _type: "mockCommandCard", artist: "Kira Nova", release: "Midnight Signal", status: "At Risk", statusTone: "amber" },
        { _key: "4", _type: "mockCommandCard", artist: "DJ Prism", release: "Spectrum Vol. 2", status: "On Track", statusTone: "green" },
        { _key: "5", _type: "mockCommandCard", artist: "Solace", release: "Still Water", status: "Planning", statusTone: "blue" },
        { _key: "6", _type: "mockCommandCard", artist: "Luma", release: "First Light", status: "On Track", statusTone: "green" },
      ],
    },
    { _key: "t-s2", _type: "mockPanel", kind: "dashboard",
      dashboardCards: [
        { _key: "1", _type: "mockDashboardCard", title: "Hip-Hop", value: "+18%", pillLabel: "Rising", pillTone: "green" },
        { _key: "2", _type: "mockDashboardCard", title: "Indie Pop", value: "+8%", pillLabel: "Rising", pillTone: "green" },
        { _key: "3", _type: "mockDashboardCard", title: "R&B", value: "-3%", pillLabel: "Declining", pillTone: "red" },
        { _key: "4", _type: "mockDashboardCard", title: "Electronic", value: "+12%", pillLabel: "Rising", pillTone: "green" },
      ],
    },
    { _key: "t-s3", _type: "mockPanel", kind: "budget",
      budgetTotalLeft: "Top ROI", budgetTotalRight: "Mara ($4.2 per $1)",
      budgetBars: [
        { _key: "1", _type: "mockBudgetBar", label: "Mara", value: "$4.2:$1", percent: 85, color: "green" },
        { _key: "2", _type: "mockBudgetBar", label: "Ash Velo", value: "$3.1:$1", percent: 68, color: "blue" },
        { _key: "3", _type: "mockBudgetBar", label: "DJ Prism", value: "$2.4:$1", percent: 52, color: "purple" },
        { _key: "4", _type: "mockBudgetBar", label: "Kira", value: "$0.8:$1", percent: 20, color: "red" },
      ],
    },
    { _key: "t-s4", _type: "mockPanel", kind: "report",
      reportTitle: "Q2 2026 Portfolio Report", reportDateLabel: "Apr-Jun",
      reportStats: [
        { _key: "1", _type: "mockReportStat", value: "12", label: "Releases" },
        { _key: "2", _type: "mockReportStat", value: "94%", label: "On Time" },
        { _key: "3", _type: "mockReportStat", value: "$193k", label: "Revenue" },
      ],
    },
  ],
});
docs.push({
  _id: "orchestrationPage",
  _type: "verticalProductPage",
  verticalKey: "orchestration",
  hero: {
    headlineTop: "No more",
    headlineBottom: "square pegs, round holes",
    subhead: "Every tool used to manage releases today was created for something else. Team was designed specifically for rollouts. Every feature, every workflow, every view, built from the ground up for the way music actually ships.",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  problemSection: {
    headlineTop: "You've been using",
    headlineBottom: "the wrong tools",
    paragraphs: [
      "Spreadsheets weren't built for release timelines. Notion wasn't built for DSP submissions. Monday.com doesn't know what a rollout plan is. You've spent years forcing general-purpose tools to do a music-specific job.",
      "The result? Missed deadlines. Lost assets. Release day panic. And a whole lot of time wasted on tool management instead of release management.",
      "Team is different. Not because we bolted music features onto a project management tool. But because we started with the release and built everything around it.",
    ],
  },
  painSection: {
    eyebrow: "The Release Lifecycle",
    headlineTop: "One platform.",
    headlineBottom: "Every phase.",
    subhead: "From first demo to post-release analytics — every step lives in Team",
    rows: [
      painRow("Pre-Release", "Set your release date. Team builds your plan", "Team generates your timeline, assigns tasks, and tracks every deliverable. Templates built for singles, EPs, and albums. No more wondering what needs to happen next."),
      painRow("Release Week", "The most critical 7 days. Fully coordinated", "DSPs, social, press, ads — every channel running in sync. Team keeps the chaos organised so your launch day is a launch, not a scramble."),
      painRow("Post-Release", "The release is live. Now learn from it", "Track performance, generate reports for your team or your label, and feed insights into your next release. Every campaign makes the next one smarter."),
    ],
  },
  featureSpotlight: {
    headlineTop: "Built for releases.",
    headlineBottom: "Nothing else.",
    subhead: "Every feature exists because a release needs it",
    cards: [
      feat("Release Timeline", "Your entire rollout mapped visually. Drag, drop, adjust. See every deadline across every phase."),
      feat("Task Management", "Not generic tasks. Release tasks. Pre-populated templates, role-based assignments, and deadline tracking that knows the difference between a playlist pitch and a press release."),
      feat("Rollout Plan", "AI-generated strategy documents tailored to your genre, audience, and goals. Not a blank page — a blueprint."),
      feat("Budget Tracking", "Track spend across production, marketing, PR, and distribution. Per-release, per-artist, or across your entire roster."),
      feat("Asset Library", "Every file, every version, every approval — in one place. AI-parsed contracts, searchable metadata, version history."),
      feat("Collaboration", "Invite anyone into a release. They see what they need — their tasks, their deadlines, their assets. Nothing more, nothing less."),
    ],
  },
  bridgeSection: {
    headlineTop: "A plan is only as good as",
    headlineBottom: "the thinking behind it",
    body: "Release Orchestration gives you the tools to execute. Release Intelligence gives you the context to execute brilliantly. Together, they're the complete operating system for music releases.",
    ctaLabel: "Explore Release Intelligence",
    ctaHref: "/intelligence",
  },
  finalCta: {
    headlineTop: "Ready to run your releases",
    headlineBottom: "the right way?",
    headline: "Ready to run your releases the right way?",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
    footnote: "30-day free trial. No credit card required.",
  },
  rolesGrid: ROLES_GRID_DEFAULT,
});

// ─── enterprise ─────────────────────────────────────────────────────────
docs.push({
  _id: "enterprisePage",
  _type: "enterprisePage",
  hero: {
    pillLabel: "Enterprise",
    headlineTop: "Scale without compromise.",
    headlineBottom: "Security without sacrifice.",
    subhead: "For major labels, distributors, and music companies that need enterprise-grade controls, dedicated support, and the confidence that their IP is protected at every level.",
    primaryCta: cta("Book a demo", "/demo"),
    secondaryCta: cta("Talk to us", "/contact?interest=enterprise"),
  },
  whySection: {
    headlineTop: "Built for the complexity",
    headlineBottom: "of scale",
    body: "When you're managing hundreds of releases across dozens of artists, you need more than a project management tool. You need infrastructure that scales with your operation and doesn't slow you down.",
  },
  painSection: {
    headlineTop: "Unlock your releases",
    headlineBottom: "with Enterprise",
    rows: [
      painRow("Authentication", "Single sign-on that works with your existing systems", "SAML 2.0 SSO integration with your identity provider. SCIM provisioning for automated user management. Your IT team controls access — Team handles the rest."),
      painRow("Governance", "Complete visibility and control over every action", "Comprehensive audit logs, role-based access controls with granular permissions per release, and multi-tiered approval workflows. Know who did what, when, and on which release."),
      painRow("Flexibility", "Configure Team to match how your organization works", "Custom approval flows, release templates per team or department, configurable notification rules, and flexible billing. Enterprise that's flexible and customized to you."),
    ],
  },
  securityCallout: {
    headlineTop: "Enterprise-grade",
    headlineBottom: "security",
    body: "AES-256 encryption and per-account data isolation. TeamMate AI learns your context to get smarter for you — but your data is never shared across accounts or used to train models for anyone else. Your unreleased content is protected by design.",
    ctaLabel: "Read more about our security",
    ctaHref: "/security",
  },
  includedSection: {
    headlineTop: "Everything in Team",
    headlineBottom: "plus so much more",
    blocks: [
      { _key: "ds", _type: "includedBlock", title: "Dedicated Support", description: "A named account manager who knows your operation. Priority response times and quarterly business reviews." },
      { _key: "co", _type: "includedBlock", title: "Custom Onboarding", description: "White-glove setup for your team. Data migration, workflow configuration, and training sessions." },
      { _key: "sla", _type: "includedBlock", title: "SLA Guarantee", description: "99.9% uptime SLA with proactive monitoring and incident response." },
      { _key: "cb", _type: "includedBlock", title: "Custom Billing", description: "Annual contracts, volume pricing, and flexible payment terms. We'll build a plan that works for your organization." },
      { _key: "api", _type: "includedBlock", title: "API Access", description: "Connect Team to your existing tools and data pipelines. RESTful API with comprehensive documentation." },
      { _key: "pf", _type: "includedBlock", title: "Priority Features", description: "Influence the roadmap. Enterprise customers get early access to new features and direct input on development priorities." },
    ],
  },
  bridgeSection: {
    headlineTop: "Ready to see Team",
    headlineBottom: "in action?",
    body: "Explore how Release Orchestration and Release Intelligence work together to power your entire operation.",
    links: [
      { _key: "orch", _type: "bridgeLink", label: "Explore Release Orchestration", href: "/orchestration" },
      { _key: "intel", _type: "bridgeLink", label: "Explore Release Intelligence", href: "/intelligence" },
    ],
  },
  finalCta: {
    headlineTop: "Let's build a plan",
    headlineBottom: "that works for you",
    headline: "Let's build a plan that works for you",
    body: "Customized setup, dedicated support, and security protocols that meets your unique requirements.",
    primaryCta: cta("Book a demo", "/demo"),
    secondaryCta: cta("Contact us", "/contact?interest=enterprise"),
    footnote: "Talk to a founder, not a sales rep.",
  },
  rolesGrid: ROLES_GRID_DEFAULT,
});

// ─── security ───────────────────────────────────────────────────────────
docs.push({
  _id: "securityPage",
  _type: "securityPage",
  hero: {
    pillLabel: "Security",
    headlineTop: "Your releases. Your data.",
    headlineBottom: "Your rules.",
    subhead: "Team is built with security at its core. Your release, content, data, strategy, and execution are protected by design, not as an afterthought.",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Talk to us", "/demo"),
  },
  pillarsSection: {
    headlineTop: "Security",
    headlineBottom: "you can trust",
    headline: "Security you can trust",
    pillars: [
      { _key: "enc", _type: "securityPillar", title: "Encrypted at rest and in transit", body: "All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Your unreleased masters, contracts, and business data are protected at every stage.", tag: "AES-256 + TLS 1.3" },
      { _key: "rbac", _type: "securityPillar", title: "Role-based access and 2FA", body: "Control exactly who sees what with granular permissions per release, per artist, per team. Two-factor authentication adds an extra layer of protection.", tag: "Granular permissions" },
      { _key: "infra", _type: "securityPillar", title: "Enterprise-grade infrastructure", body: "Hosted on industry-leading cloud infrastructure with 99.9% uptime SLA, automated backups, and geo-redundant data storage.", tag: "99.9% uptime SLA" },
      { _key: "data", _type: "securityPillar", title: "Your data is yours. Always.", body: "Export your data at any time in standard formats. No lock-in, no hostage-taking. If you leave, your data leaves with you.", tag: "Full data export" },
    ],
  },
  aiPrivacySection: {
    metadataPill: "AI & Data Privacy",
    headlineTop: "TeamMate AI works for you.",
    headlineBottom: "Only you.",
    paragraphs: [
      "TeamMate AI learns about your artists, releases, and workflows to give you smarter, more context-aware recommendations. But that knowledge is strictly yours.",
      "Your data is never used to train our models. It is never shared with other users or companies. It is never accessible to anyone outside your account.",
      "Every Team account operates in its own isolated environment. TeamMate's intelligence about your roster, your release history, and your strategies stays within your account boundary — always.",
    ],
    trustPills: [
      "Your data never trains our AI",
      "Zero cross-account data sharing",
      "Per-account data isolation",
      "Full data export anytime",
      "No third-party data access",
    ],
  },
  enterpriseSection: {
    headlineTop: "Enterprise-grade",
    headlineBottom: "controls",
    headline: "Enterprise-grade controls",
    subhead: "For teams that need advanced security and compliance.",
    blocks: [
      { _key: "auth", _type: "enterpriseBlock", tag: "Authentication", title: "SSO & SAML", body: "Single sign-on integration with your existing identity provider. SAML 2.0 supported." },
      { _key: "audit", _type: "enterpriseBlock", tag: "Visibility", title: "Audit Logs", body: "Full activity history across your account. See who did what, when, and on which release." },
      { _key: "scim", _type: "enterpriseBlock", tag: "Automation", title: "SCIM Provisioning", body: "Automate user management at scale. Add, remove, and update team members from your identity provider." },
    ],
    enterpriseCta: {
      headline: "Need specific security measures?",
      body: "Talk to the team to see how we can meet your unique security needs.",
      ctaLabel: "Book a demo",
      ctaHref: "/demo",
    },
  },
  complianceSection: {
    headlineTop: "Compliance",
    headlineBottom: "& certifications",
    cards: [
      { _key: "soc2", _type: "complianceCard", title: "SOC 2 Type II", body: "SOC 2 Type II certified for security, availability, and confidentiality trust service criteria. Independently audited and verified.", status: "active" },
      { _key: "dpa", _type: "complianceCard", title: "Data Processing Agreement", body: "Custom DPA available for enterprise customers covering data handling, sub-processors, and breach notification procedures.", status: "on_request" },
      { _key: "gdpr", _type: "complianceCard", title: "GDPR Compliant", body: "Full compliance with the EU General Data Protection Regulation. Data subject rights, lawful processing, and privacy by design built into every layer of the platform.", status: "coming_soon" },
    ],
  },
  faq: {
    eyebrow: "Security",
    headlineTop: "Questions about security?",
    headlineBottom: "We've got answers.",
    headline: "Questions about security?",
    subhead: "Your unreleased music and business data deserve the highest level of protection.",
    footerCta: { label: "Talk to a founder →", href: "/demo" },
    items: [
      { _key: "sec-q1", _type: "faqItem", question: "Is my unreleased music safe on Team?", answer: [
        block("Yes. All files are encrypted at rest (AES-256) and in transit (TLS 1.3). Access is controlled by role-based permissions, and you can restrict who sees what at the release level."),
      ]},
      { _key: "sec-q2", _type: "faqItem", question: "Does TeamMate AI use my data to train its models?", answer: [
        block("No. Your data is never used for model training. TeamMate learns your context to give better recommendations, but that knowledge stays strictly within your account and is never shared."),
      ]},
      { _key: "sec-q3", _type: "faqItem", question: "Can other companies see my data?", answer: [
        block("Absolutely not. Every Team account operates in complete isolation. There is no cross-account data sharing, no shared intelligence, and no way for another user to access your information."),
      ]},
      { _key: "sec-q4", _type: "faqItem", question: "What happens to my data if I cancel?", answer: [
        block("Your data remains accessible for 30 days after cancellation, during which you can export everything. After that, it's permanently deleted from our systems. We don't hold your data hostage."),
      ]},
      { _key: "sec-q5", _type: "faqItem", question: "Do you support SSO and enterprise security?", answer: [
        block("Yes. We support SAML-based SSO, SCIM provisioning for automated user management, and comprehensive audit logs. Contact us for enterprise security requirements."),
      ]},
    ],
  },
  finalCta: {
    headlineTop: "Ready to protect your releases",
    headlineBottom: "from day one?",
    headline: "Ready to protect your releases from day one?",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
    footnote: "30-day free trial. No credit card required.",
  },
});

// ─── integrations / changelog / insights index pages ───────────────────
docs.push({
  _id: "integrationsPage",
  _type: "integrationsPage",
  hero: {
    pillLabel: "Coming soon",
    headlineTop: "Every signal",
    headlineBottom: "into one strategy",
    subhead: "Team turns the data flowing through your stack — DSPs, social, analytics, ads — into a single coordinated rollout. Native integrations are coming online over the next few months. Here's what's lined up, and how the platform uses each signal.",
    primaryCta: cta("Start your free trial", "/pricing"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  gridSection: {
    headlineTop: "Every tool you already use",
    headlineBottom: "feeding one rollout",
    subhead: "Each integration below maps to a specific moment in the rollout — distribution timing, save velocity, fan engagement, ops handoff. As they come online they become part of the strategy automatically.",
    searchPlaceholder: "Search integrations...",
    filters: [
      { _key: "f-all", _type: "integrationFilter", label: "All", filterKey: "all" },
      { _key: "f-dist", _type: "integrationFilter", label: "Distribution", filterKey: "distribution" },
      { _key: "f-soc", _type: "integrationFilter", label: "Social & Marketing", filterKey: "social" },
      { _key: "f-an", _type: "integrationFilter", label: "Analytics", filterKey: "analytics" },
      { _key: "f-prod", _type: "integrationFilter", label: "Productivity", filterKey: "productivity" },
      { _key: "f-soon", _type: "integrationFilter", label: "Coming Soon", filterKey: "coming-soon" },
    ],
    emptyState: {
      lead: "Looks like we don't have that one yet.",
      ctaQuestion: "Need something bespoke?",
      ctaLabel: "Talk to us",
      ctaSuffix: "about an enterprise integration.",
      ctaHref: "/contact?interest=enterprise",
    },
  },
  apiSection: {
    headlineTop: "Need something bespoke?",
    headlineBottom: "Built for enterprise teams.",
    body: "Major labels, distributors, and management groups often run on internal data warehouses, custom CRMs, and proprietary release tooling. We build dedicated connectors and private endpoints into Team for enterprise customers — including secure SSO, custom data flows, and tailored intelligence pipelines.",
    ctaLabel: "Talk to us",
    ctaHref: "/contact?interest=enterprise",
  },
  rolesGrid: ROLES_GRID_DEFAULT,
});

docs.push({
  _id: "changelogPage",
  _type: "changelogPage",
  hero: { headlineTop: "What's", headlineBottom: "new in Team", subhead: "Every feature, improvement, and fix — shipped fast and built for music teams" },
  search: { placeholder: "Search updates..." },
});

docs.push({
  _id: "insightsIndexPage",
  _type: "insightsIndexPage",
  hero: { headlineTop: "Insights", headlineBottom: "& ideas", subhead: "Strategy, industry trends, and how the best teams ship releases" },
  search: { placeholder: "Search posts..." },
});

// ─── insightCategory × 4 ────────────────────────────────────────────────
const CATEGORIES = [
  { id: "cat-strategy", title: "Strategy", slug: "strategy" },
  { id: "cat-product", title: "Product", slug: "product" },
  { id: "cat-industry", title: "Industry", slug: "industry" },
  { id: "cat-guides", title: "Guides", slug: "guides" },
];
for (const c of CATEGORIES) {
  docs.push({
    _id: c.id,
    _type: "insightCategory",
    title: c.title,
    slug: { _type: "slug", current: c.slug },
  });
}

// ─── insightPost × 7 ────────────────────────────────────────────────────
const POSTS = [
  { id: "post-checklist", title: "The Ultimate Release Day Checklist for Independent Artists", slug: "release-day-checklist", excerpt: "Release day is the most critical 24 hours of your campaign. Everything you've been building toward comes down to execution. Here's everything you need to do, broken down by timing.", date: "2026-02-25T09:00:00Z", read: 10, cat: "cat-guides" },
  { id: "post-dsp", title: "When to Pitch to DSPs: A Timeline Guide", slug: "dsp-pitch-timeline-guide", excerpt: "Getting on an editorial playlist can transform a release. But timing your pitch wrong means your track never gets heard by the curators who matter. Here's exactly when and how to pitch.", date: "2026-02-20T09:00:00Z", read: 8, cat: "cat-guides" },
  { id: "post-ai", title: "Why the music industry's relationship with AI is more nuanced than you think", slug: "ai-music-industry-nuanced", excerpt: "AI isn't replacing A&R instincts. It's giving them context. Here's how the smartest teams are using AI without losing the human touch.", date: "2026-04-14T09:00:00Z", read: 6, cat: "cat-industry" },
  { id: "post-teammate", title: "Introducing TeamMate: your AI-powered release companion", slug: "introducing-teammate", excerpt: "TeamMate is now live for all Team users. Here's what it does, how it works, and why we built it the way we did.", date: "2026-04-05T09:00:00Z", read: 5, cat: "cat-product" },
  { id: "post-stop", title: "Stop treating your release like a project", slug: "stop-treating-release-as-project", excerpt: "Release management isn't project management with a music skin. Here's why the distinction matters and what to do about it.", date: "2026-03-28T09:00:00Z", read: 7, cat: "cat-strategy" },
  { id: "post-indie-2026", title: "The independent label playbook for 2026", slug: "independent-label-playbook-2026", excerpt: "What's changed for indie labels this year, and how the smartest operators are adapting their release strategies.", date: "2026-03-22T09:00:00Z", read: 9, cat: "cat-industry" },
  { id: "post-playlist", title: "Playlist pitching: what actually works in 2026", slug: "playlist-pitching-2026", excerpt: "Editorial, algorithmic, and independent playlists each require different approaches. Here's what curators actually respond to.", date: "2026-03-15T09:00:00Z", read: 8, cat: "cat-guides" },
];
// Fetch existing posts so re-seeding doesn't blow away article bodies that
// were populated via scripts/import-insight-bodies.mjs (256 blocks total).
// Without this guard, every `npm run seed` resets bodies to placeholders.
const existingPosts = await client.fetch<{ _id: string; body?: unknown[] }[]>(
  `*[_type == "insightPost" && _id in $ids]{ _id, body }`,
  { ids: POSTS.map((p) => p.id) },
);
const existingBodyById = new Map(existingPosts.map((p) => [p._id, p.body]));

for (const p of POSTS) {
  const existingBody = existingBodyById.get(p.id);
  // A "real" body has more than the 2 placeholder blocks we seed initially.
  const hasRealBody = Array.isArray(existingBody) && existingBody.length > 2;
  docs.push({
    _id: p.id,
    _type: "insightPost",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    excerpt: p.excerpt,
    publishDate: p.date,
    readMinutes: p.read,
    authorName: "Team",
    category: { _type: "reference", _ref: p.cat },
    body: hasRealBody
      ? (existingBody as unknown[])
      : [block(p.excerpt), block("Full article body to be added in Sanity Studio.")],
  });
}

// ─── changelogEntry × ~50 (abridged from public changelog data) ────────
const CHANGELOG = [
  { date: "2026-03-17", group: "Public API, Intelligence Engine & Security Hardening", entries: [
    ["new", "Public Data Ingestion API", "A fully documented REST API with CSV import, streaming, marketing, and touring endpoints."],
    ["new", "API Key Management", "Generate and manage API keys from Settings, powered by Unkey for enterprise-grade rate limiting."],
    ["new", "Music Industry Knowledge Graph", "Entity Resolution Engine and 300-term music glossary — your Teammate now understands industry terminology natively."],
    ["new", "Interactive Knowledge Base", "Redesigned knowledge base with live component demos rendered inline."],
    ["improved", "AI Teammate hardening", "Permission-gated context, tool filtering, auto-RAG, PII sanitization, and cross-tenant access checks."],
    ["fixed", "Voice note transcription", "Fixed Whisper transcription failing on Apple .caf format and relative R2 URLs."],
    ["fixed", "SEO improvements", "Added missing pages to sitemap.xml and robots.txt."],
  ]},
  { date: "2026-03-16", group: "Billing, Onboarding & SMS Groups", entries: [
    ["new", "In-app Stripe billing", "Upgrade, downgrade, and manage your subscription directly inside Team with embedded Stripe checkout."],
    ["new", "Onboarding redesign", "New signup flow with 30-day free trial, no credit card required, and post-signup consultation booking."],
    ["new", "SMS group messaging", "Create groups via text, share updates, and receive daily briefings through conversational commands."],
    ["new", "Cross-release portfolio search", "Your Teammate can now search across all your releases at once."],
    ["improved", "Feature gating", "Comprehensive tier enforcement audit with new feature flags for every plan."],
    ["improved", "Marketing CTAs", "All feature and solution pages now use signup-first CTAs."],
  ]},
  { date: "2026-03-13", group: "Briefs v2 — Section Builder & AI Fields", entries: [
    ["new", "AI-powered brief fields", "Generate field content with AI, import from documents, and animate step-by-step."],
    ["new", "Section-based brief builder", "A v2 builder with grouped collapsible sections, custom brief types, and QuickCreate dialog."],
    ["new", "Canva-style share modal", "Auto-generated passwords, per-recipient email delivery, and group-scoped portal visibility."],
    ["improved", "Brief card design", "Dark plum folder-style cards with hover animations, colored headers, and account dropdown."],
    ["fixed", "Enterprise hardening", "Security audit — input validation, rate limiting, encryption, and briefs-only user gating."],
  ]},
  { date: "2026-03-12", group: "Briefs Collaboration & Portal Polish", entries: [
    ["new", "Two-way collaboration workspace", "Recipients can comment, upload files, and collaborate directly inside the brief portal."],
    ["new", "Per-recipient channels", "Each share link gets its own isolated channel for comments, uploads, and activity."],
    ["improved", "Portal media experience", "Waveform audio player, animations, image carousel, and YouTube embed support."],
    ["fixed", "Safari compatibility", "Auto-reload on chunk load errors after deploys, plus audio crossOrigin fixes."],
  ]},
  { date: "2026-03-11", group: "Briefs by Team & Show Discovery", entries: [
    ["new", "Briefs by Team", "A complete standalone product for creating, sending, and tracking operational briefs."],
    ["new", "AI-powered show discovery", "Discover upcoming shows with venue geocoding and map integration in the touring module."],
    ["new", "Task departments", "Assign tasks to Marketing, A&R, Legal, Business Affairs, or Finance departments."],
    ["fixed", "Notification reliability", "Fixed phantom unread badges, double toast notifications, and subtask routing."],
  ]},
  { date: "2026-03-10", group: "Text Your Release & Demo Booking", entries: [
    ["new", "Text Your Release (SMS)", "Manage releases via text message. Send updates, attach media, create tasks, and get proactive notifications."],
    ["new", "Book a Demo", "Streamlined demo booking flow so you can see Team in action before you commit."],
    ["improved", "Pricing overhaul", "Redesigned pricing page with a clear comparison matrix."],
    ["improved", "Social sharing previews", "Rich previews with correct image and description on Twitter, LinkedIn, and iMessage."],
  ]},
  { date: "2026-03-09", group: "Templates, Email Ingestion & Calendar Views", entries: [
    ["new", "Release & Task Templates", "Save any release as a reusable template. Browse, edit, and apply with a single click."],
    ["new", "Email Ingestion", "Forward emails to your release — they appear in a dedicated Emails tab and your AI Teammate can reference them."],
    ["new", "Calendar & List view toggle", "Switch between Calendar and List views on your timeline with a single toggle."],
    ["improved", "AI Teammate context", "Access to rollout plans, email threads, and full release context for more accurate answers."],
    ["improved", "Mobile experience", "Major responsiveness improvements across dashboard, task panels, and rollout tabs."],
  ]},
  { date: "2026-03-06", group: "Task Library & Performance Boost", entries: [
    ["new", "Task Library", "Browse pre-built task templates organized by category. Add them to any release to jumpstart your rollout."],
    ["improved", "Smarter AI intent routing", "LLM-based router that understands what you mean — no more rigid keyword matching."],
    ["performance", "Faster page loads", "Parallelized database queries and optimized asset loading for snappier navigation."],
  ]},
  { date: "2026-03-01", group: "Press Runs, Reports & Dark Mode", entries: [
    ["new", "Press Runs", "Plan press runs with an interactive map, Google Places search, and per-stop detail modals."],
    ["new", "Release Reports", "Generate PDF reports with strategy overviews, DSP priorities, territories, and timeline."],
    ["new", "Dark mode", "ADA-compliant dark theme with a toggle in settings."],
    ["new", "Guided product tour", "Step-by-step interactive tour for new users. Restart anytime from the help menu."],
    ["improved", "Task list view", "Sortable, expandable task list with columns for status, assignee, dates, and subtasks."],
  ]},
  { date: "2026-02-28", group: "Market Intelligence & Smarter Dashboard", entries: [
    ["new", "AI Market Intelligence", "Deep research-powered briefings on market position, competitor landscape, and audience insights."],
    ["new", "Specialized task cards", "Category-specific fields — social posts show platforms, playlisting shows curators, PR shows outlets."],
    ["improved", "Dashboard sorting", "Releases sort by recently viewed and newest created."],
  ]},
  { date: "2026-02-26", group: "AI Agent Power-Up & Artist Intelligence", entries: [
    ["new", "Artist Intelligence", "Automatic artist research — market position, audience demographics, comparable artists, and detailed profile sections."],
    ["new", "AI rollout planning engine", "Generate full phased rollout plans, manage content and budgets, and remember preferences across releases."],
    ["improved", "Mobile experience", "Full mobile UX overhaul — unified navigation, compact release cards, and bottom tab bar."],
  ]},
  { date: "2025-12-09", group: "Team Pilot Launches", entries: [
    ["new", "Team Pilot MVP", "The first version of Team — release management with timeline views, task management, authentication, and an AI-powered Teammate."],
    ["new", "Timeline & Canvas views", "Visual timeline for scheduling tasks and a canvas view for spatial release planning."],
    ["new", "Mobile-first design", "Responsive sidebar, timeline, bottom navigation, and touch-friendly interactions from day one."],
  ]},
];
let entryIdx = 0;
for (const day of CHANGELOG) {
  for (let i = 0; i < day.entries.length; i++) {
    const [type, title, description] = day.entries[i];
    docs.push({
      _id: `chg-${entryIdx++}`,
      _type: "changelogEntry",
      releaseDate: day.date,
      groupHeadline: i === 0 ? day.group : undefined,
      type,
      title,
      description,
      sortWithinDate: i,
    });
  }
}

// ─── integration × 20 ──────────────────────────────────────────────────
const INTEGRATIONS = [
  { name: "Spotify", desc: "Deliver and track releases on the world's largest streaming platform", cat: "distribution" },
  { name: "Apple Music", desc: "Submit and manage releases across the Apple ecosystem", cat: "distribution" },
  { name: "Amazon Music", desc: "Reach listeners on Amazon's streaming platform", cat: "distribution" },
  { name: "YouTube Music", desc: "Distribute music and videos to YouTube's audience", cat: "distribution" },
  { name: "Instagram", desc: "Plan and schedule content aligned to your release timeline", cat: "social" },
  { name: "TikTok", desc: "Coordinate TikTok campaigns with your rollout", cat: "social" },
  { name: "Meta Ads", desc: "Run and track ad campaigns across Facebook and Instagram", cat: "social" },
  { name: "X", desc: "Schedule posts and track engagement around releases", cat: "social" },
  { name: "Spotify for Artists", desc: "Pull streaming data directly into your release dashboard", cat: "analytics" },
  { name: "Chartmetric", desc: "Track playlist adds, chart positions, and audience growth", cat: "analytics" },
  { name: "Soundcharts", desc: "Monitor cross-platform performance in real-time", cat: "analytics" },
  { name: "Google Analytics", desc: "Track smart link and pre-save campaign performance", cat: "analytics" },
  { name: "Slack", desc: "Get release notifications and updates in your team channels", cat: "productivity" },
  { name: "Google Workspace", desc: "Sync calendars, docs, and assets with your release timeline", cat: "productivity" },
  { name: "Dropbox", desc: "Connect your asset library for seamless file management", cat: "productivity" },
  { name: "Zapier", desc: "Build custom automations between Team and 5,000+ apps", cat: "productivity" },
  { name: "Bandcamp", desc: "Manage Bandcamp releases alongside your DSP strategy", cat: "distribution", soon: true },
  { name: "SoundCloud", desc: "Coordinate SoundCloud uploads with your rollout", cat: "distribution", soon: true },
  { name: "Mailchimp", desc: "Sync fan data and automate release email campaigns", cat: "social", soon: true },
  { name: "HubSpot", desc: "Connect your CRM for deeper fan relationship management", cat: "social", soon: true },
];
INTEGRATIONS.forEach((i, idx) => {
  const slug = i.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  docs.push({
    _id: `int-${slug}`,
    _type: "integration",
    name: i.name,
    slug: { _type: "slug", current: slug },
    description: i.desc,
    category: i.cat,
    comingSoon: !!i.soon,
    sortOrder: idx,
  });
});

// ─── push everything ───────────────────────────────────────────────────
//
// Sanity stores documents in two states: the published version (id =
// "forArtistsPage") and the draft (id = "drafts.forArtistsPage"). Studio's
// Structure view shows the DRAFT by default. When an editor opens a doc
// before the seed has run, Studio auto-creates an empty draft. After we
// `createOrReplace` the published version, the empty draft still wins in
// Studio's view — making the page look empty even though the seed
// succeeded.
//
// Fix: every seed operation is a single transaction that replaces the
// published version AND deletes any existing draft. Studio then has only
// the seeded published content to show.
async function seed() {
  console.log(`Seeding ${docs.length} documents to ${PROJECT_ID}/${DATASET}...`);
  let success = 0;
  let failed = 0;
  for (const doc of docs) {
    try {
      await client
        .transaction()
        .createOrReplace(doc)
        .delete(`drafts.${doc._id}`)
        .commit();
      success++;
      process.stdout.write(`  ✓ ${doc._id} (${doc._type})\n`);
    } catch (err: any) {
      failed++;
      console.error(`  ✗ ${doc._id} failed:`, err?.message ?? err);
    }
  }
  console.log(`\nDone. ${success} succeeded, ${failed} failed.`);
}

seed().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
