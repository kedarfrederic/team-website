import { describe, it, expect, vi } from 'vitest';
import { JSDOM, CookieJar } from 'jsdom';
import { readFileSync } from 'node:fs';
const source = readFileSync('src/components/V2CookieBanner.astro', 'utf8');
const html = source.slice(source.indexOf('<div id="ckBanner"')).replace('<script is:inline>', '<script>');
function page(url: string, cookieJar: CookieJar) {
 return new JSDOM('<button data-cookie-prefs>Cookie settings</button>' + html, {url, cookieJar, runScripts:'dangerously'});
}
const banner = (p: JSDOM) => p.window.document.getElementById('ckBanner') as HTMLElement;
const click = (p: JSDOM, id: string) => (p.window.document.getElementById(id) as HTMLElement).click();
describe('shared Team cookie choices', () => {
 it('shares a rejection from the website with the app and back, without prompting twice', () => {
  const jar = new CookieJar();const home = page('https://preview.teamrollouts.com/', jar);
  expect(banner(home).hidden).toBe(false);click(home, 'ckReject');expect(banner(home).hidden).toBe(true);
  const app = page('https://pilot-staging.teamrollouts.com/sign-in', jar);
  expect(banner(app).hidden).toBe(true);
  expect(JSON.parse(decodeURIComponent(app.window.document.cookie.split('=')[1]))).toEqual({necessary:true,analytics:false,marketing:false});
  click(app, 'ckAccept');const returning = page('https://preview.teamrollouts.com/ko/', jar);
  expect(banner(returning).hidden).toBe(true);
  (returning.window.document.querySelector('[data-cookie-prefs]') as HTMLElement).click();
  expect(banner(returning).hidden).toBe(false);
  expect((returning.window.document.getElementById('ckAnalytics') as HTMLInputElement).checked).toBe(true);
  for(const p of [home,app,returning])p.window.close();
 });
 it('does not share a provider preview decision with Team or unrelated domains', () => {
  const jar = new CookieJar();const preview = page('https://branch.team-website-6ur.pages.dev/',jar);click(preview,'ckAccept');
  const home = page('https://preview.teamrollouts.com/',jar);expect(banner(home).hidden).toBe(false);
  const other = page('https://teamrollouts.com.evil.example/',jar);expect(banner(other).hidden).toBe(false);
  for(const p of [preview,home,other])p.window.close();
 });
 it('withdraws persistence and refreshes a decision made in another tab', () => {
  const jar = new CookieJar();const home = page('https://preview.teamrollouts.com/',jar);
  const posthog = {set_config:vi.fn()};(home.window as any).posthog=posthog;
  click(home,'ckAccept');expect(posthog.set_config).toHaveBeenLastCalledWith({persistence:'localStorage+cookie'});
  const app = page('https://pilot-staging.teamrollouts.com/',jar);click(app,'ckReject');
  home.window.dispatchEvent(new home.window.Event('focus'));
  expect(posthog.set_config).toHaveBeenLastCalledWith({persistence:'memory'});
  home.window.close();app.window.close();
 });
 it('asks again for invalid values rather than treating strings as acceptance', () => {
  const jar = new CookieJar();jar.setCookieSync('cookie_consent='+encodeURIComponent('{"analytics":"false","marketing":true}')+'; Domain=.teamrollouts.com; Path=/','https://preview.teamrollouts.com');
  const home=page('https://preview.teamrollouts.com/',jar);expect(banner(home).hidden).toBe(false);home.window.close();
 });
});
