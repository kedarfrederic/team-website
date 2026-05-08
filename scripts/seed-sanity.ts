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
function cta(label: string, href: string) {
  return { label, href };
}
function role(title: string, description: string, href: string) {
  return { _key: href, _type: "roleCard", title, description, href };
}
function painRow(metadataPill: string, headline: string, body: string) {
  return { _key: headline.slice(0, 24), _type: "painRow", metadataPill, headline, body };
}
function step(num: string, title: string, description: string) {
  return { _key: num, _type: "stepItem", number: num, title, description };
}
function feat(title: string, description: string) {
  return { _key: title.slice(0, 24), _type: "featureCard", title, description };
}
function spotFeat(title: string, description: string) {
  return { _key: title.slice(0, 24), _type: "spotlightFeature", title, description };
}
function partnerFeat(title: string, description: string) {
  return { _key: title.slice(0, 24), _type: "partnerTabFeature", title, description };
}
function block(text: string) {
  return {
    _key: text.slice(0, 24),
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text, marks: [] }],
    markDefs: [],
  };
}
const ROLES_GRID_DEFAULT = {
  eyebrow: "Designed for",
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
  navGroups: [
    {
      _key: "platform",
      _type: "navGroup",
      label: "Platform",
      links: [
        { _key: "orchestration", _type: "navLink", label: "Release Orchestration", description: "Plan, coordinate, ship every release", href: "/orchestration" },
        { _key: "intelligence", _type: "navLink", label: "Release Intelligence", description: "AI-powered context for every decision", href: "/intelligence" },
        { _key: "enterprise", _type: "navLink", label: "Enterprise", description: "For labels and music companies at scale", href: "/enterprise" },
        { _key: "security", _type: "navLink", label: "Security", description: "How we protect your IP", href: "/security" },
      ],
    },
    {
      _key: "extend",
      _type: "navGroup",
      label: "Extend",
      links: [
        { _key: "integrations", _type: "navLink", label: "Integrations", description: "Connect Team to your existing tools", href: "/integrations" },
      ],
    },
    {
      _key: "byrole",
      _type: "navGroup",
      label: "By Role",
      links: [
        { _key: "artists", _type: "navLink", label: "For Artists", description: "Solo artists shipping their own releases", href: "/for-artists" },
        { _key: "managers", _type: "navLink", label: "For Managers", description: "Roster-wide rollout coordination", href: "/for-managers" },
        { _key: "labels", _type: "navLink", label: "For Labels", description: "Scale your catalog without scaling headcount", href: "/for-labels" },
        { _key: "partners", _type: "navLink", label: "For Partners", description: "PR, distribution, marketing agencies", href: "/for-partners" },
      ],
    },
    {
      _key: "learn",
      _type: "navGroup",
      label: "Learn",
      links: [
        { _key: "insights", _type: "navLink", label: "Insights", description: "Strategy, product, industry takes", href: "/insights" },
        { _key: "changelog", _type: "navLink", label: "Changelog", description: "What's new in Team", href: "/changelog" },
        { _key: "about", _type: "navLink", label: "About", description: "The team behind Team", href: "/about" },
      ],
    },
    {
      _key: "connect",
      _type: "navGroup",
      label: "Connect",
      links: [
        { _key: "demo", _type: "navLink", label: "Book a demo", description: "See Team in action", href: "/demo" },
        { _key: "contact", _type: "navLink", label: "Contact", description: "Talk to the team", href: "/contact" },
      ],
    },
  ],
  navPrimaryCta: cta("Start free", "https://www.teamrollouts.com/sign-up?plan=pro&period=yearly"),
  navSecondaryCta: cta("Login", "https://www.teamrollouts.com/sign-in"),

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
    typewriterWords: ["Command Center", "Strategy hub", "Single source of truth"],
    headlineSuffix: "for your music releases",
    subhead: "Stop juggling spreadsheets, Slack threads, and email chains.\nOne platform for your entire rollout.",
    primaryCta: cta("Book demo", "/demo"),
    secondaryCta: { ...cta("See the platform", "#"), type: "video" },
    tileLabels: { left: "Single", center: "EP", right: "Album" },
  },
  uploadSection: {
    headline: "One platform. One team.",
    body: "Whether you're rolling out a single, EP, or Album, every task, every asset, and every conversation needs a single home.",
    cta: { ...cta("See how it works", "#"), type: "video" },
  },
  rolesTabs: {
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
  brainSection: {
    headline: "Every rollout",
    body: "Each contact, task, observation, and decision becomes a living memory — only ever accessible to you and your team.",
    video: { src: "/assets/brain-1-web.mp4" },
  },
  faq: {
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
  stories: {
    headline: "Ready to transform your next release?",
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
    headline: "Start free.",
    subhead: "Start using it with no commitment. Free forever for one artist, or unlock the full platform with Pro — 30 days free.",
    cta: cta("Try Pro free for 30 days", "https://www.teamrollouts.com/sign-up?plan=pro&period=yearly"),
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
      ctaHref: "https://www.teamrollouts.com/sign-up?plan=free&period=yearly",
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
      ctaHref: "https://www.teamrollouts.com/sign-up?plan=pro&period=yearly",
      includesLabel: "Everything in Free, plus:",
      badge: "Limited time pricing",
      features: ["Unlimited artists", "2 premium seats", "Unlimited collaborators (Timeline access)", "Unlimited workspaces", "TeamMate AI included", "Intelligence (Comprehensive)", "TeamMate Email & Text", "Press Tour", "Tour Management", "Document Ingestion", "Team Chat", "Reports & Sharing", "Command Center", "Priority support"],
      compareLink: "#compare",
    },
  ],
  finalCta: {
    headline: "Ready to run your next release?",
    primaryCta: cta("Start your free trial", "https://www.teamrollouts.com/sign-up"),
    secondaryCta: cta("Book a demo", "/demo"),
    footnote: "30-day free trial.",
  },
});

// ─── for-artists / for-managers / for-labels (ICP) ──────────────────────
docs.push({
  _id: "forArtistsPage",
  _type: "icpPage",
  icpKey: "artists",
  hero: {
    headlineTop: "Focus on your music.",
    headlineBottom: "Team handles the rest.",
    subhead: "Releases are overwhelming. Between pitching playlists, managing socials, and hitting deadlines, it's easy to lose focus on what matters. Team keeps everything on track so you can create.",
    primaryCta: cta("Start your free trial", "https://www.teamrollouts.com/sign-up?plan=free&period=yearly"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  rolesGrid: {
    eyebrow: "Designed for",
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
    primaryCta: cta("Start your free trial", "https://www.teamrollouts.com/sign-up?plan=free&period=yearly"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  rolesGrid: {
    eyebrow: "Designed for",
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
    primaryCta: cta("Start your free trial", "https://www.teamrollouts.com/sign-up?plan=free&period=yearly"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  rolesGrid: {
    eyebrow: "Designed for",
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
    primaryCta: cta("Start your free trial", "https://www.teamrollouts.com/sign-up?plan=pro&period=yearly"),
    secondaryCta: cta("Book a demo", "/demo"),
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
    primaryCta: cta("Start your free trial", "https://www.teamrollouts.com/sign-up?plan=pro&period=yearly"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
});
docs.push({
  _id: "orchestrationPage",
  _type: "verticalProductPage",
  verticalKey: "orchestration",
  hero: {
    headlineTop: "No more",
    headlineBottom: "square pegs, round holes",
    subhead: "Every tool used to manage releases today was created for something else. Team was designed specifically for rollouts. Every feature, every workflow, every view, built from the ground up for the way music actually ships.",
    primaryCta: cta("Start your free trial", "https://www.teamrollouts.com/sign-up?plan=pro&period=yearly"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
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
    primaryCta: cta("Start your free trial", "https://www.teamrollouts.com/sign-up?plan=pro&period=yearly"),
    secondaryCta: cta("Talk to us", "/demo"),
  },
});

// ─── integrations / changelog / insights index pages ───────────────────
docs.push({
  _id: "integrationsPage",
  _type: "integrationsPage",
  hero: {
    pillLabel: "Integrations",
    headlineTop: "Connect Team to",
    headlineBottom: "the tools you already use",
    subhead: "Team works alongside your existing workflow. Plug in the tools your team relies on — from DSPs to social platforms to analytics — and keep everything in sync.",
    primaryCta: cta("Start your free trial", "https://www.teamrollouts.com/sign-up?plan=pro&period=yearly"),
    secondaryCta: cta("Book a demo", "/demo"),
  },
  gridSection: {
    headlineTop: "Built to fit",
    headlineBottom: "your tech stack",
    subhead: "Team integrates with the platforms that power the music industry",
    searchPlaceholder: "Search integrations...",
  },
  apiSection: {
    headlineTop: "Build your own",
    headlineBottom: "integrations",
    body: "Need something custom? Team's RESTful API gives you full access to releases, tasks, assets, and analytics. Comprehensive documentation, webhook support, and sandbox environments.",
    ctaLabel: "View API documentation",
    ctaHref: "#",
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
for (const p of POSTS) {
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
    body: [block(p.excerpt), block("Full article body to be added in Sanity Studio.")],
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
async function seed() {
  console.log(`Seeding ${docs.length} documents to ${PROJECT_ID}/${DATASET}...`);
  let success = 0;
  let failed = 0;
  for (const doc of docs) {
    try {
      await client.createOrReplace(doc);
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
