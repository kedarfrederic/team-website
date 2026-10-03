export const translatedPaths = ['', 'pricing', 'rollouts', 'teammate', 'assets', 'tours', 'connectors', 'contact', 'security', 'about', 'for-artists', 'for-managers', 'for-labels', 'for-partners', 'enterprise', 'demo'] as const;
export type Locale = 'en' | 'ko';
export function localeFromPath(path: string): Locale { return /^\/ko(?:\/|$)/.test(path) ? 'ko' : 'en'; }
export function stripLocale(path: string) { const plain = path.replace(/^\/ko(?=\/|$)/, '') || '/'; return plain.replace(/\/+$/, '') || '/'; }
export function hasTranslation(path: string) { return translatedPaths.includes(stripLocale(path).slice(1) as typeof translatedPaths[number]); }
export function localePath(path: string, locale: Locale) { const plain = stripLocale(path); return locale === 'ko' && hasTranslation(plain) ? `/ko${plain === '/' ? '/' : plain}` : plain; }
export const productionAppOrigin = 'https://app.teamrollouts.com';
export const stagingAppOrigin = 'https://team-pilot-staging-new.onrender.com';
/** Only this site's Cloudflare branch/hash previews hand visitors to staging. */
export function appOriginForWebsite(hostname: string) { return hostname.toLowerCase().endsWith('.team-website-6ur.pages.dev') ? stagingAppOrigin : productionAppOrigin; }
export function appLink(href: string, locale: Locale, appOrigin = productionAppOrigin) { const url = new URL(href); const target = new URL(appOrigin); url.protocol = target.protocol; url.host = target.host; url.searchParams.set('lang', locale); return url.href; }
export function localizedLink(href: string, locale: Locale, appOrigin = productionAppOrigin) {
 if(href.startsWith('https://app.teamrollouts.com/'))return appLink(href,locale,appOrigin);
 if(/^https:\/\/(?:www\.)?teamrollouts\.com(?:[/?#]|$)/i.test(href)){const url=new URL(href);href=url.pathname+url.search+url.hash;}
 if(!href.startsWith('/') || href.startsWith('//'))return href;
 const url=new URL(href,'https://teamrollouts.com'); url.pathname=localePath(url.pathname,locale); return url.pathname+url.search+url.hash;
}

export function canonicalLocalePath(path: string, locale: Locale) { return localePath(path,locale); }
