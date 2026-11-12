/**
 * Plans and prices, in one place. The pricing page, the home page ladder and the
 * structured data all read from here, so a price can never disagree with itself.
 * Prices are US dollars per seat per month. A seat is a member who edits, admins included.
 */
export type PlanId = 'free' | 'pro' | 'ultra' | 'enterprise';
export type PaidPlanId = 'pro' | 'ultra';

export const app = 'https://app.teamrollouts.com/onboarding';

export const plans = {
  free: { name: 'Free', monthly: 0, yearly: 0, seats: '1' },
  pro: { name: 'Pro', monthly: 15, yearly: 12, seats: 'Any number' },
  ultra: { name: 'Ultra', monthly: 25, yearly: 20, seats: 'Up to 20' },
  enterprise: { name: 'Enterprise', monthly: null, yearly: null, seats: '21 or more' },
} as const;

/** The yearly saving, worked out from the prices rather than typed by hand. */
export const yearlySaving = Math.round((1 - plans.pro.yearly / plans.pro.monthly) * 100);

/** Free trials (Kedar, 12 Nov 2026): Pro 30 days with no card; Ultra 14 days with a card at checkout. */
export const trials = { pro: 30, ultra: 14 } as const;

/** App handoff for a paid plan. The billing toggle rewrites `period=` in place. */
export const planLink = (plan: PaidPlanId, period: 'yearly' | 'monthly' = 'yearly') => `${app}?plan=${plan}&period=${period}`;
export const freeLink = `${app}?plan=free`;
