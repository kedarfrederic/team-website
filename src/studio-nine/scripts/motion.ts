// Team v2 — motion runtime: Lenis smooth scroll + GSAP ScrollTrigger + reveal observer.
import Lenis from 'lenis';
import { uiText } from '../lib/i18n/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine)').matches;

let lenis: Lenis | null = null;
if (!reduce && fine) {
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('lenis');
  (window as any).__lenis = lenis;
}

// Paint order: give each top-level section a descending z-index so a section's shadows
// bleed over the section below instead of being painted over by it.
const main = document.getElementById('main');
// Skip dialogs and templates: a modal must keep the browser's fixed, top-layer positioning, or it lays out
// at the top of the document (focus then scrolls the page to 0 and the dialog can sit off-screen).
if (main) Array.from(main.children).filter(el => !['DIALOG', 'TEMPLATE', 'SCRIPT', 'STYLE'].includes(el.tagName)).forEach((el, i, arr) => { const h = el as HTMLElement; h.style.position = h.style.position || 'relative'; h.style.zIndex = String(arr.length + 5 - i); });

// Reveal on enter
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
document.querySelectorAll('[data-reveal],[data-reveal-stagger],.lines').forEach((el) => io.observe(el));

// Stagger children delay
document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((el) => {
  const step = parseFloat(el.dataset.revealStagger || '0.08');
  Array.from(el.children).forEach((c, i) => ((c as HTMLElement).style.transitionDelay = `${i * step}s`));
});

// Anchor links through Lenis
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (ev) => {
    const id = a.getAttribute('href')!.slice(1);
    const t = id && document.getElementById(id);
    if (!t) return;
    ev.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: -80 }); else t.scrollIntoView({ behavior: 'smooth' });
  });
});

// Counting numbers: <em data-count="1200" data-suffix="+">. Counts up from 0 by default; add
// data-from to start somewhere else, which lets "0%" count DOWN from 100. Re-runs on every entry.
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const end = parseFloat(el.dataset.count || '0');
  const from = el.dataset.from !== undefined ? parseFloat(el.dataset.from) : 0;
  const suffix = el.dataset.suffix || '';
  const dec = (el.dataset.count || '').includes('.') ? 1 : 0;
  const fmt = (v: number) => v.toLocaleString(document.documentElement.lang === 'ko-KR' ? 'ko-KR' : 'en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
  const o = { v: from };
  let tw: gsap.core.Tween | null = null;
  const play = () => { tw?.kill(); o.v = from; el.textContent = fmt(from); tw = gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(o.v)) }); };
  if (reduce) { el.textContent = fmt(end); return; }
  el.textContent = fmt(from);
  ScrollTrigger.create({ trigger: el, start: 'top 88%', end: 'bottom 5%', onEnter: play, onEnterBack: play, onLeave: () => { tw?.kill(); }, onLeaveBack: () => { tw?.kill(); el.textContent = fmt(from); } });
});

// Forms → CRM endpoint (contact, footer newsletter). Same payload shape as the live site.
document.querySelectorAll<HTMLFormElement>('[data-form]').forEach((f) => {
  const errBox = f.querySelector<HTMLElement>('[data-form-error]');
  const errText = f.querySelector<HTMLElement>('[data-form-error-text]');
  // We validate and report ourselves, so the browser's own bubble never appears. Without JS the
  // form keeps native validation, because this attribute is only added once the script runs.
  f.setAttribute('novalidate', '');

  const showError = (msg: string) => {
    if (!errBox || !errText) return;
    errText.textContent = uiText(msg);
    errBox.hidden = false;
  };
  const clearError = () => {
    if (errBox) errBox.hidden = true;
    f.querySelectorAll('label.is-bad').forEach((l) => l.classList.remove('is-bad'));
  };

  /** Mark every invalid field and put the browser's own wording under it. */
  const validate = () => {
    const fields = Array.from(f.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input,textarea,select'));
    let first: HTMLElement | null = null;
    for (const field of fields) {
      if (field.type === 'hidden' || field.classList.contains('sr-only')) continue;
      const label = field.closest('label');
      if (field.checkValidity()) continue;
      label?.classList.add('is-bad');
      if (label) {
        let hint = label.querySelector<HTMLElement>('.form__hint');
        if (!hint) { hint = document.createElement('span'); hint.className = 'form__hint'; label.appendChild(hint); }
        hint.textContent = document.documentElement.lang.startsWith('ko') ? (field.validity.valueMissing ? '이 항목을 입력해 주세요.' : field.validity.typeMismatch ? '올바른 형식으로 입력해 주세요.' : '입력한 내용을 확인해 주세요.') : field.validationMessage;
      }
      if (!first) first = (label?.querySelector('.sel__btn') as HTMLElement) || field;
    }
    if (first) first.focus({ preventScroll: true });
    return !first;
  };

  f.addEventListener('input', (e) => (e.target as HTMLElement).closest('label')?.classList.remove('is-bad'));
  f.addEventListener('change', (e) => (e.target as HTMLElement).closest('label')?.classList.remove('is-bad'));

  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) { showError('A few details are missing. Check the highlighted fields and try again.'); return; }

    const fd = new FormData(f); const data: Record<string, any> = Object.fromEntries(fd.entries());
    data.source_form = f.dataset.form; data.page_url = location.href;
    const u = new URLSearchParams(location.search); ['utm_source', 'utm_medium', 'utm_campaign'].forEach(k => { if (u.get(k)) data[k] = u.get(k); });
    if (f.dataset.form === 'newsletter' && data.email) data.first_name = String(data.email).split('@')[0];
    const btn = f.querySelector<HTMLButtonElement>('button[type=submit]'); const label = btn?.textContent || '';
    if (btn) { btn.disabled = true; btn.textContent = uiText('Sending…'); }
    try {
      const r = await fetch('https://admin.getteamnow.com/api/v1/website-leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(String(r.status));
      if (f.dataset.form === 'newsletter') { f.reset(); if (btn) { btn.disabled = false; btn.textContent = uiText('Subscribed ✓'); } }
      else { f.querySelectorAll<HTMLElement>('label,.form__row,button').forEach(el => el.hidden = true); const d = f.querySelector<HTMLElement>('.form__done'); if (d) d.hidden = false; }
    } catch (err) {
      if (btn) { btn.disabled = false; btn.textContent = label; }
      // A blocked origin (the CRM only accepts the live domain) surfaces as a failed fetch, so
      // say something useful and offer a way through rather than a bare "try again".
      showError(err instanceof TypeError
        ? 'We could not send that from this address. Please email hello@teamrollouts.com and we will pick it up.'
        : 'Something went wrong sending that. Try again, or email hello@teamrollouts.com.');
    }
  });
});

// FAQ accordions: one open per list
document.querySelectorAll<HTMLElement>('.faq__list').forEach((list) => {
  list.addEventListener('toggle', (e) => { const d = e.target as HTMLDetailsElement; if (d.open) list.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(o => { if (o !== d) o.open = false; }); }, true);
});

export { gsap, ScrollTrigger, lenis, reduce };
