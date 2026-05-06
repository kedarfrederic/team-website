/* ────────────────────────────────────────────────────────────
   Team — Website lead capture
   Hooks into every <form data-hubspot-form="…"> on the site
   (the attribute name is legacy — leads now go to the in-house
   CRM, not HubSpot) and POSTs to:
     https://admin.getteamnow.com/api/v1/website-leads
   Together with form-validation.js this is the full client-side
   submission pipeline.

   Auto-attaches, idempotent, and re-runs as forms get injected
   by the page-body fetch+inject pattern.
   ──────────────────────────────────────────────────────────── */
(function(){
  var ENDPOINT = 'https://admin.getteamnow.com/api/v1/website-leads';

  function readUtms(){
    try {
      var p = new URLSearchParams(window.location.search);
      return {
        utm_source:   p.get('utm_source')   || undefined,
        utm_medium:   p.get('utm_medium')   || undefined,
        utm_campaign: p.get('utm_campaign') || undefined,
      };
    } catch (e) { return {}; }
  }

  function ensureHoneypot(form){
    if (form.querySelector('[name="website"][data-team-honeypot]')) return;
    var hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'website';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.setAttribute('aria-hidden', 'true');
    hp.setAttribute('data-team-honeypot', '');
    hp.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
    form.appendChild(hp);
  }

  function statusEl(form){
    var s = form.querySelector('[data-lead-status]');
    if (s) return s;
    s = document.createElement('div');
    s.setAttribute('data-lead-status', '');
    s.style.cssText = 'margin-top:0.875rem;font-size:0.875rem;display:none';
    form.appendChild(s);
    return s;
  }

  function setStatus(form, kind, msg){
    var el = statusEl(form);
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    el.style.color = kind === 'error' ? '#b00020' : 'inherit';
    el.style.fontWeight = '500';
  }

  function buildPayload(form, sourceForm){
    var fd = new FormData(form);
    var payload = { source_form: sourceForm };
    var aliases = {
      first_name:    ['first_name', 'firstName'],
      last_name:     ['last_name',  'lastName'],
      email:         ['email'],
      organization:  ['organization', 'company', 'label', 'org'],
      role:          ['role', 'job_title', 'title'],
      artists_managed: ['artists_managed', 'artists', 'roster_size'],
      interest:      ['interest', 'reason'],
      message:       ['message', 'note', 'notes', 'comments'],
      website:       ['website'],
    };
    Object.keys(aliases).forEach(function(key){
      var picked;
      aliases[key].some(function(name){
        var v = fd.get(name);
        if (v != null && String(v).trim() !== '') { picked = String(v).trim(); return true; }
        return false;
      });
      if (picked != null) payload[key] = picked;
    });
    var utms = readUtms();
    Object.keys(utms).forEach(function(k){ if (utms[k]) payload[k] = utms[k]; });
    payload.page_url = window.location.href;
    return payload;
  }

  function attach(form){
    if (form.hasAttribute('data-team-leads-wired')) return;
    var sourceForm = form.getAttribute('data-hubspot-form');
    if (!sourceForm) return;
    form.setAttribute('data-team-leads-wired', '');
    ensureHoneypot(form);

    form.addEventListener('submit', function(e){
      // Don't intercept if the user-installed validator is going to
      // block (it stops propagation in capture phase) — we run after.
      e.preventDefault();
      var submitBtn = form.querySelector('[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      setStatus(form, '', '');

      var payload = buildPayload(form, sourceForm);

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(function(r){
        return r.json().then(function(j){ return { ok: r.ok, body: j }; });
      }).then(function(res){
        if (!res.ok) throw new Error(res.body && res.body.error || 'submit_failed');
        // Success
        if (submitBtn) submitBtn.textContent = sourceForm === 'demo'  ? 'Booked — we\'ll be in touch'
                                       : sourceForm === 'contact'    ? 'Sent — we\'ll be in touch'
                                       : sourceForm === 'onboarding' ? 'Setting up your workspace…'
                                                                     : 'Thanks!';
        form.dispatchEvent(new CustomEvent('team:lead-submitted', { detail: payload, bubbles: true }));
        // Optional: redirect onboarding straight into the app handoff
        // (kept commented until the platform endpoint is wired)
        // if (sourceForm === 'onboarding') window.location.href = 'https://admin.getteamnow.com/welcome';
      }).catch(function(err){
        console.error('[website-leads] submit failed', err);
        setStatus(form, 'error', 'Couldn\'t send that just now — please try again or email hello@teamrollouts.com');
        if (submitBtn) {
          submitBtn.disabled = false;
          if (originalLabel) submitBtn.textContent = originalLabel;
        }
      });
    });
  }

  function scan(){
    document.querySelectorAll('form[data-hubspot-form]:not([data-team-leads-wired])').forEach(attach);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }

  if (typeof MutationObserver !== 'undefined') {
    var mo = new MutationObserver(function(muts){
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].addedNodes && muts[i].addedNodes.length) { scan(); break; }
      }
    });
    if (document.body) mo.observe(document.body, { childList: true, subtree: true });
    else document.addEventListener('DOMContentLoaded', function(){ mo.observe(document.body, { childList: true, subtree: true }); });
  }
})();
