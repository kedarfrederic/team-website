/**
 * FAQ copy, shared by the page that renders it and the FAQPage structured data,
 * so what search engines read is always exactly what a visitor sees.
 */
export type Faq = [question: string, answer: string];

export const homeFaq: Faq[] = [
  ['What is Team?', 'Team is the home of a music release. The plan, the files, the money, the dates and the people in one place, built for artists, managers, labels and the partners who work releases with them. It is free to use, and on Pro, TeamMate does the admin for you.'],
  ['What does TeamMate actually do?', 'TeamMate is AI inside Team. It reads the whole release, keeps the plan current, chases what is missing, drafts what is next, updates the sheet and the one-sheet, and briefs the partner. It changes things only where it is safe to, asks you before anything that touches money, dates or a partner, and shows its work.'],
  ['Do I have to move everything into Team?', 'No. Team works alongside the tools you already use. On Pro, Connectors read from Dropbox, Drive, Slack, Gmail, Sheets, Notion and more, and write back. Nothing to migrate, nothing to rip out, no new habits to learn.'],
  ['Can my manager, label and distributor use it with me?', 'Yes. One release, each person with their part of it. Invite anyone as a collaborator on Free, with unlimited collaborators and workspaces. When one person moves something, the people it touches find out without anyone writing an email.'],
  ['Is my data used to train AI?', 'Never. TeamMate reads your release to help you run it, and for nothing else. Neither Team nor its model providers train on your data, every connection is permissioned and revocable in a click, and everything you build is portable and yours to keep.'],
  ['Is Team free to try?', 'Rollouts and Assets are free forever, with unlimited artists, releases and collaborators, and no card. Pro adds TeamMate, Tours and Connectors, with a 14-day trial and beta pricing while we are in early access.'],
];

export const pricingFaq: Faq[] = [
  ['Is Free really free?', 'Yes. Rollouts and Assets are free, with unlimited artists, releases, collaborators and workspaces, and no card. It is the real platform, not a taster.'],
  ['What is in Pro?', 'Everything in Free, plus TeamMate (the AI that does the admin), Tours, Connectors to the tools you already use, TeamMate by email and text, first access to new betas and priority support.'],
  ['What is beta pricing?', 'Team is in early access, so Pro is about half its standard price. Sign up now and you keep that rate. Both plans start with a 14-day trial of Pro.'],
  ['Do I need a card?', 'Not for Free, ever. Pro starts with a 14-day trial and takes a card so it continues seamlessly if you stay. Cancel any time.'],
  ['Is my data mine?', 'Always. It is never used to train models, every connection is permissioned and revocable, and everything you build is portable and exportable.'],
  ['We are a label or distributor. Is there an enterprise plan?', 'Yes. Deployment across the company, SSO and SCIM, audit exports and a named contact. Talk to us and we will scope it with you.'],
];
