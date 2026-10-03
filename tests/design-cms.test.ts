import {describe,it,expect,vi} from 'vitest';
import {JSDOM} from 'jsdom';
import {renderDesignHtml} from '../src/studio-nine/localize';
import {contentMaps,pageIdentity,safeDestination} from '../src/studio-nine/cms';
import {isPreviewRequest,getClient} from '../src/lib/sanity';
import {translatedPaths,appLink,appOriginForWebsite,productionAppOrigin,stagingAppOrigin} from '../src/studio-nine/lib/i18n/routes';
import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import Home from '../src/studio-nine/pages/index.astro';
import Pricing from '../src/studio-nine/pages/pricing.astro';
import Contact from '../src/studio-nine/pages/contact.astro';
import Insight from '../src/studio-nine/pages/insights/[slug].astro';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {normalizeCopy} from '../src/studio-nine/lib/i18n/translate';
const pages=import.meta.glob('../src/studio-nine/pages/*.astro',{eager:true,import:'default'});
const dom=(html:string)=>new JSDOM(html).window.document as Document;
describe('Sanity-backed new design',()=>{
 it('uses separate document identities for English and Korean',()=>{
  expect(pageIdentity('/ko/pricing/')).toEqual({locale:'ko',page:'pricing'});
  expect(pageIdentity('/')).toEqual({locale:'en',page:'home'});
 });
 it('merges shared and page edits, excludes unsafe destinations',()=>{
  const maps=contentMaps([{copy:[{sourceText:'Start free',value:'Start today'}]},{copy:[{sourceText:'Start free',value:'Try Team'}],links:[{sourceHref:'/pricing',value:'javascript:alert(1)'}]}]);
  expect(maps.copy['Start free']).toBe('Try Team');expect(maps.links).toEqual({});
  for(const link of ['javascript:alert(1)','//bad.example','/\\bad.example','data:text/html,test'])expect(safeDestination(link)).toBe(false);
  for(const link of ['/pricing','https://app.teamrollouts.com/onboarding?plan=free','#demo','mailto:hello@teamrollouts.com'])expect(safeDestination(link)).toBe(true);
 });
 it('escapes edited HTML, preserves whitespace, selectors and form values',()=>{
  const html=renderDesignHtml('<h1> Start free <em>today</em></h1><input name="role" value="artist"><a href="/pricing">Start free</a>','en',{'Start free':'<script>unsafe</script>'});
  const d=dom(html);expect(d.querySelector('h1')?.textContent).toBe(' <script>unsafe</script> today');expect(d.querySelector('h1 script')).toBeNull();expect(d.querySelector('input')?.value).toBe('artist');
 });
 it('localizes links and JSON without changing structural schema data',()=>{
  const d=dom(renderDesignHtml('<a href="/pricing?period=yearly#pro">Pricing</a><a href="https://app.teamrollouts.com/onboarding?plan=pro&period=yearly">Start free</a><script type="application/ld+json">{"@type":"Organization","url":"https://teamrollouts.com","inLanguage":"en","priceCurrency":"USD"}</script>','ko'));
  expect(d.querySelector('a')?.getAttribute('href')).toBe('/ko/pricing?period=yearly#pro');expect(d.querySelectorAll('a')[1].getAttribute('href')).toContain('lang=ko');
  const json=JSON.parse(d.querySelector('script')!.textContent!);expect(json.url).toBe('https://teamrollouts.com');expect(json.priceCurrency).toBe('USD');expect(json.inLanguage).toBe('ko-KR');
 });
 it('keeps preview account links on Team-owned staging and preserves plan, language and destination',()=>{
  expect(stagingAppOrigin).toBe('https://pilot-staging.teamrollouts.com');
  const html='<a href="https://app.teamrollouts.com/onboarding?plan=free&amp;redirect_url=%2Finvite%2Flaunch#account">Start free</a><a href="https://app.teamrollouts.com/sign-in">Sign in</a><a href="https://example.com/media">Media</a>';
  for(const locale of ['en','ko'] as const)for(const host of ['abc12345.team-website-6ur.pages.dev','preview.teamrollouts.com','PREVIEW.TEAMROLLOUTS.COM']){
   const preview=dom(renderDesignHtml(html,locale,{}, {}, {},appOriginForWebsite(host)));
   const links=[...preview.querySelectorAll('a')];
   const signup=new URL(links[0].href);expect(signup.origin).toBe(stagingAppOrigin);expect(signup.searchParams.get('plan')).toBe('free');expect(signup.searchParams.get('redirect_url')).toBe('/invite/launch');expect(signup.searchParams.get('lang')).toBe(locale);expect(signup.hash).toBe('#account');
   expect(new URL(links[1].href).origin).toBe(stagingAppOrigin);expect(links[2].href).toBe('https://example.com/media');
  }
  for(const host of ['teamrollouts.com','www.teamrollouts.com','team-website-6ur.pages.dev','fake.team-website-6ur.pages.dev.example.com','preview.teamrollouts.com.evil.example','fake-preview.teamrollouts.com'])expect(appOriginForWebsite(host)).toBe(productionAppOrigin);
  const production=dom(renderDesignHtml(html,'en'));
  expect(new URL(production.querySelector('a')!.href).origin).toBe(productionAppOrigin);
 });
 it('keeps absolute legal and home links inside the preview and makes both wordmarks navigable',async()=>{
  const d=dom(renderDesignHtml('<a href="https://teamrollouts.com/terms">Terms</a><a href="https://www.teamrollouts.com/privacy#rights">Privacy</a><a href="https://teamrollouts.com/pricing?period=yearly">Pricing</a><a href="https://teamrollouts.com.evil.example/">External</a>','ko'));
  expect([...d.querySelectorAll('a')].map(a=>a.getAttribute('href'))).toEqual(['/terms','/privacy#rights','/ko/pricing?period=yearly','https://teamrollouts.com.evil.example/']);
  const container=await AstroContainer.create();const home=dom(renderDesignHtml(await container.renderToString(Home),'ko'));
  expect(home.querySelector('.nav__logo')?.getAttribute('href')).toBe('/ko/');
  expect(home.querySelector('.foot__logo')?.parentElement?.getAttribute('href')).toBe('/ko/');
 });
 it('renders article navigation per request instead of baking production account links into previews',async()=>{
  expect(readFileSync('src/pages/insights/[slug].astro','utf8')).toContain('export const prerender=false');
  const container=await AstroContainer.create();
  const html=await container.renderToString(Insight,{params:{slug:'the-88-percent-problem'}});
  const d=dom(renderDesignHtml(html,'en',{}, {}, {},stagingAppOrigin));
  expect(d.querySelector('h1')?.textContent).toContain('88%');
  const accounts=[...d.querySelectorAll('a')].filter(a=>a.href.includes('/sign-in'));
  expect(accounts.length).toBeGreaterThan(0);for(const a of accounts)expect(new URL(a.href).origin).toBe(stagingAppOrigin);
 });
 it('updates dialog image data and social cards alongside page images',()=>{
  const d=dom(renderDesignHtml('<img src="/studio-nine/img/a.webp"><script type="application/json">{"photo":"/studio-nine/img/a.webp"}</script><meta property="og:image" content="https://teamrollouts.com/studio-nine/img/a.webp">','en',{}, {'/studio-nine/img/a.webp':'https://cdn.sanity.io/images/g1olb5am/production/replacement.jpg'}));
  expect(d.querySelector('img')?.src).toContain('cdn.sanity.io');expect(JSON.parse(d.querySelector('script')!.textContent!).photo).toContain('cdn.sanity.io');expect(d.querySelector('meta')?.getAttribute('content')).toContain('cdn.sanity.io');
 });
 it('keeps draft clients inside the current request',()=>{
  const preview:any={locals:{},cookies:{get:()=>({value:'1'})},request:new Request('https://teamrollouts.com'),url:new URL('https://teamrollouts.com')};
  const published:any={locals:{},cookies:{get:()=>undefined},request:new Request('https://teamrollouts.com'),url:new URL('https://teamrollouts.com')};
  expect(isPreviewRequest(preview)).toBe(true);expect(isPreviewRequest(published)).toBe(false);
  expect(getClient(preview)).toBe(getClient(preview));expect(published.locals.__sanityPreviewClient).toBeUndefined();
 });
 it('renders actual English and Korean page templates with consent and app handoff',async()=>{
  const container=await AstroContainer.create();
  const seeds:any[]=[];
  for(const key of translatedPaths){
   const Page=pages[`../src/studio-nine/pages/${key||'index'}.astro`] as typeof Home;
   const path='/'+key;
   for(const locale of ['en','ko'] as const){
    const html=await container.renderToString(Page,{request:new Request(`https://teamrollouts.com${locale==='ko'?'/ko':''}${path}`)});
    const d=dom(renderDesignHtml(html,locale));
    if(locale==='en'&&process.env.GENERATE_CMS_SEED==='1'){
     const original=dom(html);
     const copies=new Set<string>();
     const walk=(node:Node)=>{
      if(node.nodeType===3&&!['SCRIPT','STYLE'].includes(node.parentElement?.tagName||'')){const text=normalizeCopy(node.textContent||'');if(text&&/[a-zA-Z]/.test(text))copies.add(text);}
      if(node.nodeType===1){for(const name of ['alt','title','aria-label','placeholder','data-per-year','data-per-month','data-suffix']){const text=(node as Element).getAttribute(name);if(text)copies.add(normalizeCopy(text));}}
      node.childNodes.forEach(walk);
     };walk(original.documentElement);
     original.querySelectorAll('meta[name="description"],meta[property^="og:"],meta[name^="twitter:"]').forEach(m=>{const v=m.getAttribute('content');if(v&&!/^https?:/.test(v)&&/[a-zA-Z]/.test(v))copies.add(v);});
     const jsonMedia=new Set<string>();
     const strings=(v:any)=>{if(typeof v==='string'&&v.startsWith('/studio-nine/'))jsonMedia.add(v);else if(typeof v==='string'&&/[a-zA-Z]/.test(v)&&!v.startsWith('https:')&&!v.startsWith('/'))copies.add(normalizeCopy(v));else if(Array.isArray(v))v.forEach(strings);else if(v&&typeof v==='object')Object.values(v).forEach(strings);};
     original.querySelectorAll('script[type="application/json"]').forEach(n=>strings(JSON.parse(n.textContent!)));
     jsonMedia.add('/studio-nine/img/og.png');
     const media=[...new Set([...jsonMedia,...Array.from(original.querySelectorAll('img[src]')).map(n=>n.getAttribute('src')!)])];
     const links=[...new Set(Array.from(original.querySelectorAll('a[href]:not([data-locale-choice])')).map(n=>n.getAttribute('href')!))];
     seeds.push({pageKey:key||'home',copy:[...copies],media,links});
    }

    expect(d.documentElement.lang).toBe(locale==='ko'?'ko-KR':'en');
    expect(d.querySelector('meta[name="team-design"]')?.getAttribute('content')).toBe('studio-nine-v3');
    expect(d.querySelector('#ckBanner')).not.toBeNull();
    expect(d.querySelector('[data-cookie-prefs]')).not.toBeNull();
    expect(d.querySelector('h1')?.textContent?.trim().length).toBeGreaterThan(5);
    for(const image of d.querySelectorAll<HTMLImageElement>('img[src]'))if(image.getAttribute('src')?.startsWith('/studio-nine/'))expect(readFileSync('public'+image.getAttribute('src')).length).toBeGreaterThan(0);
    if(locale==='ko')expect(d.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('ko_KR');
    const appLinks=Array.from(d.querySelectorAll<HTMLAnchorElement>('a')).filter(a=>a.href.startsWith('https://app.teamrollouts.com/'));
    expect(appLinks.length).toBeGreaterThan(0);for(const a of appLinks)expect(new URL(a.href).searchParams.get('lang')).toBe(locale);
    if(locale==='ko')expect(d.querySelector('#ckReject')?.textContent).toBe('필수 쿠키만 허용');
   }
  }
  if(process.env.GENERATE_CMS_SEED==='1'){mkdirSync('scripts/content',{recursive:true});writeFileSync('scripts/content/studio-nine-inventory.json',JSON.stringify(seeds,null,2)+'\n');}
 });
 it('has all Korean routes and retains the existing backend',()=>{
  expect(translatedPaths.length).toBe(16);expect(appLink('https://app.teamrollouts.com/sign-in?from=site','ko')).toContain('from=site&lang=ko');
  expect(readFileSync('astro.config.mjs','utf8')).toContain('output: "server"');
  expect(readFileSync('src/pages/api/preview/enable.ts','utf8')).toContain('SANITY_PREVIEW_SECRET');
 });
});
