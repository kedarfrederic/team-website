/**
 * FAQ copy, shared by the page that renders it and the FAQPage structured data,
 * so what search engines read is always exactly what a visitor sees.
 */
export type Faq = [question: string, answer: string];

export const homeFaq: Faq[] = [
  ['What is Team?', 'Team is the home of a music release. The plan, the files, the money, the dates and the people in one place, built for artists, managers, labels and the partners who work releases with them. It is free to use, and on Pro, TeamMate does the admin for you.'],
  ['What does TeamMate actually do?', 'TeamMate is AI inside Team. It reads the whole release, keeps the plan current, chases what is missing, drafts what is next, updates the sheet and the one-sheet, and briefs the partner. It changes things only where it is safe to, asks you before anything that touches money, dates or a partner, and shows its work.'],
  ['Do I have to move everything into Team?', 'No. Team works alongside the tools you already use. On Pro, Connectors read from Dropbox, Drive, Slack, Gmail, Sheets, Notion and more, and write back. Nothing to migrate, nothing to rip out, no new habits to learn.'],
  ['Can my manager, label and distributor use it with me?', 'Yes. One release, each person with their part of it. Outside collaborators are free on every plan, so invite anyone who works the release. When one person moves something, the people it touches find out without anyone writing an email.'],
  ['Is my data used to train AI?', 'Never. TeamMate reads your release to help you run it, and for nothing else. Neither Team nor its model providers train on your data, every connection is permissioned and revocable in a click, and everything you build is portable and yours to keep.'],
  ['Is Team free to try?', 'Yes. Free costs nothing for one person and one artist, with no card. Every new account also starts with 14 days of Ultra, so you can try everything before you choose Pro or Ultra.'],
];

export const pricingFaq: Faq[] = [
  ['Is Free really free?', 'Yes. One person and one artist, with no card and no end date. Releases, the rollout plan, files, budget, Day to day, document intake, drop links and the iPhone app (Android is coming soon) are all in it, with TeamMate for 10 messages a day.'],
  ['What counts as a seat?', 'A seat is a member who edits, admins included. Outside collaborators on a release, view-only people and anyone you send a link or report to are free on every plan. With Ultra touring, crew, venue and portal links never need a seat either.'],
  ['What is the difference between Pro and Ultra?', 'Pro is for a small team running a few artists: up to 5 artists, with all of TeamMate, Team Chat, reports, Connectors and A&R prospects. Pro has no seat limit, so move to Ultra when you need touring, more artists or sub-labels, or the roster view. Ultra is for a management company or label: up to 20 seats, unlimited artists and sub-labels, touring, the A&R pipeline and one view across every artist.'],
  ['How does the trial work?', 'Every new account starts with 14 days of Ultra. When it ends, choose a plan, or carry on with Free.'],
  ['Do I need a card?', 'Not for Free, ever. You add a card when you choose Pro or Ultra, and you can cancel any time.'],
  ['How much does yearly billing save?', '20%. Pro is $12 a seat a month billed yearly, or $15 monthly. Ultra is $20 a seat a month billed yearly, or $25 monthly.'],
  ['Is my data mine?', 'Always. It is never used to train models, every connection is permissioned and revocable, and everything you build is portable and exportable.'],
  ['We need more than 20 seats. Is there an enterprise plan?', 'Yes. Enterprise is for 21 seats or more and custom needs, with SSO, API access and dedicated support. Talk to us and we will scope it with you.'],
];
