/* ────────────────────────────────────────────────────────────
   v2-contact.js — contact form → CRM.
   Ported from team-july2026-multipager/contact.html's inline script.

   POSTs to the same endpoint every other form on the site uses
   (admin.getteamnow.com/api/v1/website-leads, source_form:'contact'),
   with the same `website` honeypot. teamrollouts.com + www are on that
   endpoint's CORS allowlist (WEBSITE_LEAD_ORIGINS).

   Confirmation is optimistic and the fetch is fire-and-forget, matching
   the source: a network hiccup shouldn't show an error state to someone
   who has already written their message.
   ──────────────────────────────────────────────────────────── */
(() => {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;
  const btn = document.getElementById('cSubmit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.website.value) return; // honeypot tripped — bots fill this in

    const first = form.first_name.value.trim();
    const email = form.email.value.trim();
    if (!first) { form.first_name.focus(); return; }
    if (!email || !form.email.checkValidity()) { form.email.focus(); return; }

    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    const interest = [...form.querySelectorAll('input[name=interest]:checked')].map((i) => i.value);
    form.classList.add('done'); // optimistic confirm — see header note

    try {
      fetch('https://admin.getteamnow.com/api/v1/website-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_form: 'contact',
          first_name: first,
          last_name: form.last_name.value.trim(),
          email,
          organization: form.organization.value.trim(),
          interest,
          message: form.message.value.trim(),
          website: '',
          page_url: location.href,
        }),
      }).catch(() => {});
    } catch (err) {
      /* swallowed on purpose — see header note */
    }
  });
})();
