export type Mock = { title: string; rows: { l: string; s?: string; tag?: string; tone?: 'lime'|'orange'|'ink' }[]; foot?: string };
export type Product = {
  slug: string; name: string; pro: boolean; title: string; h1: [string, string]; lead: string;
  cta: { label: string; href: string }; cta2: { label: string; href: string }; note: string;
  problem: [string, string]; problemBody: string;
  demos: { h: string; d: string; mock: Mock }[];
  tm: { h: string; d: string; log: { t: string; m: string; ok: boolean }[] };
  related: string[];
};

const app = 'https://app.teamrollouts.com/onboarding';

export const products: Product[] = [
  {
    slug: 'rollouts', name: 'Rollouts', pro: false, title: 'Rollouts — plan and run every release',
    h1: ['Every release,', 'planned and run.'],
    lead: 'Rollouts is where a release goes from idea to live. The timeline, the tracks, the artwork, the budget, the territories and the pitches in one place, with TeamMate keeping it all moving.',
    cta: { label: 'Start a release, free', href: app + '?plan=free' }, cta2: { label: 'Book a demo', href: '/demo' }, note: 'Free forever. No card.',
    problem: ['A release is a dozen moving parts.', 'Give it one shape.'],
    problemBody: 'Masters, artwork, budget, the plan, the pitch, the territories, the people. On most releases they live in ten tools and one person\'s head. A rollout puts every part in one place, so the whole release has a shape you can actually see.',
    demos: [
      { h: 'A real plan, with real dates.', d: 'Every task from announce to release day, with an owner, a date and what it depends on. Move the release date and TeamMate re-cuts the whole plan, then tells everyone who needs to know.', mock: { title: 'Timeline · Midnight Static', rows: [ { l: 'Teaser clip goes live', s: 'Mon 22 · Marketing', tag: 'Done', tone: 'lime' }, { l: 'Pitch editorial playlists', s: 'Wed 24 · TeamMate drafted', tag: 'Today' }, { l: 'Vinyl PO sign-off', s: 'Fri 26 · Ops', tag: 'Needs you', tone: 'orange' }, { l: 'Pre-save push', s: 'Fri 26 · Marketing', tag: 'Scheduled' } ], foot: '22 tasks · 14 done · release in 41 days' } },
      { h: 'The money, tracked live.', d: 'Spend by category, against the plan. A material change gets flagged for your approval before it touches anything, so there are no surprise six-figure shifts.', mock: { title: 'Budget · $15,050 of $18,000', rows: [ { l: 'Advertising', s: '62%', tag: '$9,400' }, { l: 'Content', s: '21% · changed 14:02', tag: '$3,100', tone: 'orange' }, { l: 'PR', s: '10%', tag: '$1,500' }, { l: 'Vinyl', s: '7%', tag: '$1,050' } ], foot: 'Content went from $2,500 to $3,100 in Sheets. The one-sheet was updated to match.' } },
      { h: 'Nothing ships until it is ready.', d: 'Ready to roll is the pre-flight check. Masters delivered, metadata clean, artwork at spec, distributor confirmed, pitch out. Every box green, or it waits.', mock: { title: 'Ready to roll', rows: [ { l: 'Masters delivered to distributor', tag: '✓', tone: 'lime' }, { l: 'Metadata and ISRCs clean', tag: '✓', tone: 'lime' }, { l: 'Artwork at spec, all sizes', tag: '✓', tone: 'lime' }, { l: 'Distributor confirmed the window', tag: 'Waiting', tone: 'orange' } ], foot: '5 of 6 green' } },
    ],
    tm: { h: 'TeamMate runs the rollout overnight.', d: 'Open the release in the morning and the admin is done: the plan re-cut, the partner briefed, the missing file chased. You get the two or three calls that are actually yours.', log: [ { t: '23:41', m: 'Re-cut the timeline around the new date. 11 tasks moved.', ok: true }, { t: '02:57', m: 'Re-briefed the press list on the new embargo.', ok: true }, { t: '06:05', m: 'Vinyl PO #1042 needs your sign-off before Friday.', ok: false } ] },
    related: ['assets', 'teammate', 'tours'],
  },
  {
    slug: 'assets', name: 'Assets', pro: false, title: 'Assets — every file for the release, release-ready',
    h1: ['Every file,', 'release-ready.'],
    lead: 'Assets is the creative library for the release. Artwork, audio, video, documents and links in one place, versioned so the final is always the final, and shareable so no one sends a zip again.',
    cta: { label: 'Open a library, free', href: app + '?plan=free' }, cta2: { label: 'Book a demo', href: '/demo' }, note: 'Free forever. No card.',
    problem: ['The creative lives in ten places.', 'Give it one home.'],
    problemBody: 'The master\'s in Dropbox, the artwork\'s in Drive, the video\'s in a WeTransfer that expired, and the "final" everyone is using is three versions old. Assets pulls every creative file for a release into one library, with the version that is actually final front and centre.',
    demos: [
      { h: 'Versioned by default.', d: 'Every bounce and every cut is kept, with who approved which. The final is unambiguous, and last month\'s version is still there if you need it.', mock: { title: 'Master · Midnight Static', rows: [ { l: 'Master_v10.wav', s: 'Approved by Maya · Tue', tag: 'Final', tone: 'lime' }, { l: 'Master_v9.wav', s: 'Superseded', tag: 'v9' }, { l: 'Master_v8.wav', s: 'Superseded', tag: 'v8' } ], foot: '9 earlier versions kept. Everyone pulls from the same one.' } },
      { h: 'Share a link, not a 4GB zip.', d: 'Send a single asset or the whole library, with the access you choose. Press, partners and DSPs get what they need and nothing expires.', mock: { title: 'Shared · press kit', rows: [ { l: 'Cover_3000.png', s: 'Artwork · PNG', tag: 'Final', tone: 'lime' }, { l: 'One-sheet.pdf', s: 'Document', tag: 'Shared' }, { l: 'Teaser_15s.mp4', s: 'Video · MP4', tag: 'Approved', tone: 'lime' }, { l: 'Pre-save link', s: 'Link', tag: 'Live' } ], foot: 'Shared with 4 people · view only · no expiry' } },
      { h: 'Wired into the release.', d: 'Assets attach to the tasks and dates that use them, so the artwork is where the timeline needs it, not in someone\'s inbox. Deliverables land in the library as tasks get done.', mock: { title: 'Attached to tasks', rows: [ { l: 'Pitch editorial playlists', s: 'uses Cover_3000.png, Master_v10.wav', tag: 'Ready', tone: 'lime' }, { l: 'Video final delivered', s: 'uses Teaser_15s.mp4', tag: 'In review' }, { l: 'Press one-sheet to list', s: 'uses One-sheet.pdf', tag: 'Done', tone: 'lime' } ] } },
    ],
    tm: { h: 'TeamMate keeps the library honest.', d: 'It knows what is in the library and what is not, so "did the final artwork ever land?" has an answer, and missing assets get flagged before they bite.', log: [ { t: '23:50', m: 'Locked v10 as the approved master and flagged v9 everywhere it was still referenced.', ok: true }, { t: '04:12', m: 'The feature stem from Juno Vale landed. Filed under Tracks.', ok: true }, { t: '06:10', m: 'Canvas 9x16 is still v3 and unapproved. Needs you before Friday.', ok: false } ] },
    related: ['rollouts', 'teammate', 'connectors'],
  },
  {
    slug: 'tours', name: 'Tours', pro: true, title: 'Tours — take the release on the road',
    h1: ['Take the release', 'on the road.'],
    lead: 'Tours is where a release becomes a run of shows. Build the routing, advance every date, run the day sheets, and keep holds, on-sales, guarantees and settlement in one place, with TeamMate across all of it.',
    cta: { label: 'Start a 14-day Pro trial', href: app + '?plan=pro' }, cta2: { label: 'Book a demo', href: '/demo' }, note: 'Pro · cancel any time.',
    problem: ['A tour is a hundred details', 'that all move at once.'],
    problemBody: 'Holds and offers, routing that has to make sense on a map, advances with every venue, day sheets the crew will actually read, guarantees and settlement. Tours holds all of it in one run, so a change in one place updates everywhere it touches.',
    demos: [
      { h: 'Routing that makes sense.', d: 'Build a run that works on the map and on the spreadsheet. A routing score flags backtracking and dead days before they cost you a guarantee.', mock: { title: 'The Static Tour · 8 shows · routing 82/100', rows: [ { l: 'London · O2 Academy Brixton', s: 'Sep 12', tag: 'On sale', tone: 'lime' }, { l: 'Paris · La Cigale', s: 'Sep 18', tag: 'On sale', tone: 'lime' }, { l: 'Berlin · Astra', s: 'Sep 24', tag: 'Offer out' }, { l: 'Amsterdam · Paradiso', s: 'Oct 3', tag: 'Confirmed' } ], foot: 'Tightening Berlin to Paris cuts 400 miles and saves a day off.' } },
      { h: 'Advance once, day sheet writes itself.', d: 'Every venue\'s details, tech, hospitality and timings in one advance. The crew\'s day sheet is generated from it and stays current when the plan changes.', mock: { title: 'Day sheet · Paris · Sep 18', rows: [ { l: 'Load-in', s: '14:00 · stage door, Rue Rochechouart', tag: '' }, { l: 'Soundcheck', s: '17:00 · 45 min', tag: '' }, { l: 'Doors', s: '19:30', tag: '' }, { l: 'Set', s: '21:00 · 75 min · curfew 23:00', tag: '' } ], foot: 'Generated from the advance · updated 2 hours ago' } },
      { h: 'The money, as clear as the calendar.', d: 'Guarantees, expenses and settlement tracked per show and across the run. Tickets and capacity fill in date by date.', mock: { title: 'Run totals', rows: [ { l: 'Confirmed', tag: '6 of 8' }, { l: 'Tickets sold', tag: '12.4k of 18k' }, { l: 'Guaranteed', tag: '$340k' }, { l: 'Settled', s: '2 shows outstanding', tag: '$92k', tone: 'orange' } ] } },
    ],
    tm: { h: 'TeamMate watches the run overnight.', d: 'A soft on-sale, a routing gap, a settlement that is late. It hands you the calls that need a human and handles the rest.', log: [ { t: '23:12', m: 'Paris on-sale is tracking 30% behind London. Suggested a second promoter push.', ok: true }, { t: '03:40', m: 'Berlin offer accepted. Day sheet and advance created.', ok: true }, { t: '06:30', m: 'Amsterdam settlement is 9 days late. Needs you to chase.', ok: false } ] },
    related: ['rollouts', 'teammate', 'connectors'],
  },
  {
    slug: 'teammate', name: 'TeamMate', pro: true, title: 'TeamMate — the AI that does the admin',
    h1: ['The AI that', 'does the admin.'],
    lead: 'TeamMate is AI, inside Team. It reads the whole release, remembers every version, thread and decision, does the admin that eats your week, and asks you only when it needs you. And it shows its work.',
    cta: { label: 'Start a 14-day Pro trial', href: app + '?plan=pro' }, cta2: { label: 'Book a demo', href: '/demo' }, note: 'Pro · cancel any time.',
    problem: ['The answer to "where do we stand?"', 'should be one question away.'],
    problemBody: 'Every master version, every thread, every budget change, every approval, every deadline. TeamMate holds the whole history of a release in one place, so nothing has to live in someone\'s memory until they are on holiday.',
    demos: [
      { h: 'It remembers everything.', d: 'Masters, conversations, people, money and dates, across the whole release and the ones before it. Ask a question and it answers from the whole operation, not from what you pasted in.', mock: { title: 'TeamMate remembers · Midnight Static', rows: [ { l: 'Masters', s: 'every bounce, who approved which', tag: '9 versions' }, { l: 'Conversations', s: 'decisions buried in threads', tag: '14 decisions' }, { l: 'People', s: 'who owns what, right now', tag: 'mix · a&r · distro' }, { l: 'Money', s: 'budget, POs, splits, changes', tag: 'live' } ] } },
      { h: 'It does the work, and shows it.', d: 'Updates the sheet, re-briefs the partner, drafts the post, chases the stem, files the deliverable. Every action logged with where it came from and what it touched.', mock: { title: 'Overnight · 4 actions', rows: [ { l: 'Re-cut the release timeline around the new date', s: '23:41 · Timeline', tag: 'Done', tone: 'lime' }, { l: 'Updated the budget in Notion and the one-sheet', s: '23:43 · Sheets → Notion, Docs', tag: 'Done', tone: 'lime' }, { l: 'Re-briefed the press list on the new embargo', s: '02:57 · Gmail', tag: 'Done', tone: 'lime' }, { l: 'Vinyl PO needs your sign-off before Friday', s: '06:05', tag: 'Needs you', tone: 'orange' } ] } },
      { h: 'It asks before it matters.', d: 'Money, dates and anything that touches a partner wait for you. TeamMate brings the decision, the context and a button. Approving runs exactly the change it proposed, nothing more.', mock: { title: 'Needs you · 1', rows: [ { l: 'Vinyl PO #1042 · quote up $140 to $1,190', s: 'Due Friday · the budget can absorb it', tag: 'Approve', tone: 'lime' }, { l: 'Move the release to Nov 6?', s: 'Theo suggested it · 11 tasks would move', tag: 'Decide' } ] } },
    ],
    tm: { h: 'On your terms, and only yours.', d: 'TeamMate reads your release to help you run it, and for nothing else. Never trains a model. Permissioned tool by tool and revocable in a click. Everything you build is yours to keep.', log: [ { t: '', m: 'Never used to train a model. Not ours, not our providers\'.', ok: true }, { t: '', m: 'Permissioned and revocable, tool by tool.', ok: true }, { t: '', m: 'Portable and exportable. No lock-in.', ok: true } ] },
    related: ['rollouts', 'connectors', 'security'],
  },
  {
    slug: 'connectors', name: 'Connectors', pro: true, title: 'Connectors — works with the tools you already use',
    h1: ['Works with the tools', 'you already use.'],
    lead: 'Connectors feed every file, message, plan and number from the tools you already run on into Team, and write back. Nothing to migrate, nothing to rip out, no new habits to learn.',
    cta: { label: 'Start a 14-day Pro trial', href: app + '?plan=pro' }, cta2: { label: 'See the catalogue', href: '#catalogue' }, note: 'Pro · cancel any time.',
    problem: ['Not an export.', 'A live wire.'],
    problemBody: 'Most tools let you export. Team stays connected. It sees a new file, thread or number the moment it lands, works out what changed, and updates the doc, the budget or the partner, and tells you what it did.',
    demos: [
      { h: 'It reads, live.', d: 'A new master in Dropbox, a decision in Slack, a number in Sheets. Team sees it the moment it lands and works out what it means for the release.', mock: { title: 'Dropbox · connected', rows: [ { l: 'New file in /Masters', s: 'Single_Master_v10.wav · 23:41', tag: 'Read' }, { l: 'Recognised as the new master', s: 'supersedes v9 · referenced by one-sheet and distro brief', tag: 'Reasoned' } ] } },
      { h: 'It writes back.', d: 'Two-way, not read-only. Team updates the doc, syncs the budget and re-briefs the partner inside the tools they already use.', mock: { title: 'Wrote back · 2', rows: [ { l: 'Updated the one-sheet to reference v10', s: 'Google Docs · 23:41', tag: 'Done', tone: 'lime' }, { l: 'Re-briefed the distributor on the change', s: 'Gmail · 23:42', tag: 'Done', tone: 'lime' } ] } },
      { h: 'You stay in control.', d: 'Every connection is permissioned, scoped and revocable in a click. Team only ever reads the scopes you have granted.', mock: { title: 'Permissions', rows: [ { l: 'Dropbox', s: '/Masters, /Artwork · read + write', tag: 'On', tone: 'lime' }, { l: 'Slack', s: '#audio, #release-ops · read', tag: 'On', tone: 'lime' }, { l: 'Gmail', s: 'label: Midnight Static · read + send', tag: 'On', tone: 'lime' }, { l: 'Notion', s: 'not connected', tag: 'Off' } ] } },
    ],
    tm: { h: 'The catalogue.', d: 'We add connectors constantly and prioritise by what people ask for. Tell us what you run on and we will wire it up.', log: [] },
    related: ['teammate', 'rollouts', 'security'],
  },
];
export const byId = (s: string) => products.find(p => p.slug === s)!;
