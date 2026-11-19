// /look demo engine — plays the in-app recreation (TeamApp.astro) as a scrubbable "video".
// Plain ES5, no deps, inlined by pages/look.astro. Page-level hooks it expects (in look.astro):
//   #headline #ctah #stage #demo #app #coach #coachCap #cursor  player: #ctrl #pp #track #fill #time #chap #replay
//   #jumpPin #jumpBtns #bookfab .look__ctacard .step[data-chap] [data-look-cta] #head (draggable founder bubble)
// URL params: ?name= &company= &artist= &release= &days= &teammate= &handle= &reldate= &budget= &seg= &c= &utm_*
(function(){
  var q = new URLSearchParams(location.search);
  var cap = function(s){ return s ? s.replace(/\b\w/g, function(c){ return c.toUpperCase(); }) : s; };
  // clamp: CRM values vary wildly in length — cut on a word boundary so nothing breaks the layout
  var clamp = function(s, max){ if(!s) return s; s=s.trim(); if(s.length<=max) return s;
    var cut=s.slice(0,max); var sp=cut.lastIndexOf(' '); if(sp>max*0.6) cut=cut.slice(0,sp); return cut.replace(/[\s,.;:–-]+$/,'')+'…'; };
  var g = function(k){ return (q.get(k)||'').trim(); };

  // ---- merge fields (with fallbacks, length-clamped) ----
  var first   = clamp(cap(g('name')), 18);
  var company = clamp(g('company'), 30);
  var artist  = clamp(g('artist'), 28)   || 'Nova Reed';
  var release = clamp(g('release'), 34)  || 'Afterglow';
  var days    = g('days')     || '32';
  var teammate= clamp(cap(g('teammate')), 18) || 'Kedar';
  var reldate = g('reldate')  || 'Sun, Nov 22';
  var budget  = g('budget')   || '$8,000';
  var SEG_ALIAS = { manager:'management', managers:'management', mgmt:'management', labels:'label',
                    'sub-label':'sublabel', imprint:'sublabel', distribution:'distributor', agencies:'agency', artists:'artist' };
  var seg     = (g('seg')||'label').toLowerCase();
  seg = SEG_ALIAS[seg] || seg;
  var handle  = clamp(g('handle'), 24)   || ('@' + artist.toLowerCase().replace(/[^a-z0-9]+/g,''));
  var budNum  = parseInt(budget.replace(/[^0-9]/g,''),10) || 8000;
  var money   = function(n){ return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  var BUD_OLD = money(budNum), BUD_NEW = money(budNum + 500);
  var artistParts = artist.split(/\s+/);
  var artistLast  = artistParts.length > 1 ? artistParts.pop() : '';
  var artistFirst = artistParts.join(' ');
  var reldateShort = reldate.replace(/^[A-Za-z]{3},\s*/, '');

  // ---- per-ICP segment config (set per-contact from the CRM) ----
  var SEGS = {
    label:      { acct: company||'Your label',  list:[['Mara Vane','1 needs you · 2 active','in 12d'],['The Hightides','2 active · 1 live','in 1mo'],['Odeon','1 active · 3 released','in 6d'],['Saint Cloud','2 active','in 18d']] },
    sublabel:   { acct: company||'Your imprint',list:[['Mara Vane','1 needs you · 2 active','in 12d'],['Odeon','1 active','in 6d'],['Saint Cloud','2 released',''],['Loom','1 active','in 1mo']] },
    agency:     { acct: company||'Your agency', list:[['Caro Vega','campaign live','in 4d'],['The Hightides','1 needs you · 1 active','in 9d'],['Mara Vane','2 active','in 12d'],['Saint Cloud','brief in','in 1mo']] },
    management: { acct: company||'Your roster', list:[['Caro Vega','on tour · 1 active','in 4d'],['Mara Vane','1 needs you · 1 active','in 12d'],['The Hale','2 released',''],['Odeon','1 active','in 6d']] },
    distributor:{ acct: company||'Your catalog',list:[['Mara Vane','2 active · 4 released','in 12d'],['The Hightides','1 active · 11 released','in 1mo'],['Odeon','2 active','in 6d'],['Saint Cloud','3 released','']] },
    artist:     { acct: artist, list:[] }
  };
  var segc = SEGS[seg] || SEGS.label;
  if (!SEGS[seg]) seg = 'label';
  var isArtistSeg = seg === 'artist';
  var account = segc.acct;
  var initial = (first ? first.split(/\s+/).map(function(w){return w[0];}).slice(0,2).join('') : 'U').toUpperCase();

  // ---- analytics hooks: each event goes to PostHog (the live site's analytics, see Analytics.astro)
  // and to dataLayer (kept for any tag manager). c = opaque CRM contact id; utm_* pass through.
  var tag = (function(){
    var base = { look_seg: seg };
    if (g('c')) base.look_contact = g('c');
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){ if (g(k)) base[k]=g(k); });
    window.dataLayer = window.dataLayer || [];
    return function(ev, extra){ var o={ event: ev }, k; for (k in base) o[k]=base[k]; for (k in (extra||{})) o[k]=extra[k];
      try { window.dataLayer.push(o); } catch(e){}
      try { if (window.posthog && window.posthog.capture) { var p={}; for (k in o) if (k!=='event') p[k]=o[k]; window.posthog.capture(ev, p); } } catch(e){} };
  })();
  tag('look_view');

  // page headline + CTA
  if (first || company){
    document.getElementById('headline').innerHTML =
      'Hi ' + (first||'there') + ', <em>here&rsquo;s how <span class="mark">' + (isArtistSeg ? 'your next release' : account) + '</span> would run on Team.</em>';
  }
  document.getElementById('ctah').textContent = isArtistSeg ? 'Want to see it with your next release in it?' : 'Want to see it with ' + (company ? company + '’s' : 'your') + ' roster in it?';

  // ======================= the app (1440x900, scaled) =======================
  var app = document.getElementById('app'), tapp = window.__tapp || document.getElementById('tapp');   // TeamApp mounts it in a shadow root
  function fit(){ if (app.clientWidth) tapp.style.setProperty('--k', (app.clientWidth/1440).toFixed(5)); }
  fit(); window.addEventListener('resize', fit); if (window.ResizeObserver) new ResizeObserver(fit).observe(app);

  function $(id){ return tapp.querySelector('#'+id); }
  function $q(sel, root){ return (root||tapp).querySelector(sel); }
  function $$(sel, root){ return [].slice.call((root||tapp).querySelectorAll(sel)); }
  function ovRoot(n){ return tapp.querySelector('.tov[data-ov="'+n+'"]'); }
  function inOv(n, sel){ var r=ovRoot(n); return r ? r.querySelector(sel) : null; }
  function sc(n){ return tapp.querySelector('.xscene[data-scene="'+n+'"]'); }

  // fill [data-f] slots (inside the app, and anything cloned from a <template> later)
  var F = { first: first||'there', account: account, company: company||account, artist: artist, artistFirst: artistFirst||artist, artistLast: artistLast,
            release: release, days: days, reldate: reldate, reldateShort: reldateShort, budget: BUD_OLD, teammate: teammate, initial: initial,
            handle: handle, artinitial: (artist[0]||'N').toUpperCase(), posttitle: 'Pre-save · ' + release,
            tourname: clamp(release, 26) + ' Tour' };
  function fillSlots(root){ $$('[data-f]', root).forEach(function(el){ var k=el.getAttribute('data-f'); if (F[k]!=null) el.textContent=F[k]; }); }
  fillSlots(tapp);

  // Home cards per segment (Nov 2026 shell): name, "out in N days" line, and a need-you / caught-up chip
  (function(){
    var ROLE = { label:'Label', sublabel:'Label', management:'Management', agency:'Agency', distributor:'Distributor', artist:'Artist' };
    var rt=$('hmRmType'); if (rt) rt.textContent = ROLE[seg] || 'Label';
    function days(w){ var m=/in\s+(\d+)\s*d/.exec(w||''); if (m) return +m[1]; if (/mo/.test(w||'')) return 30; return null; }
    function when(w){ var d=days(w); return d==null ? 'No release coming up' : d>=28 ? 'Out in a month' : 'Out in '+d+' days'; }
    segc.list.forEach(function(it, i){
      $$('[data-rn="'+i+'"]', tapp).forEach(function(el){ el.textContent = it[0]; });
      var c=$('rcard'+(i+1)); if(!c) return;
      var n=$q('[data-r="name"]',c), m=$q('[data-r="meta"]',c), w=$q('[data-r="when"]',c);
      if(n) n.textContent=it[0];
      if(w) w.textContent=when(it[2]);
      if(m){ var need=/(\d+)\s+needs? you/.exec(it[1]); m.className='hn-chip '+(need?'need':'ok'); m.textContent = need ? need[0] : 'All caught up'; }
    });
    // "where you left off" follows the segment's first artist
    var d0=days((segc.list[0]||[])[2]); if (d0!=null){ var ld=$('hmLeadDays'), lo=$('hmLeadOut');
      var t=new Date(2026,9,21+d0); if(ld) ld.textContent=d0;
      if(lo) lo.textContent='Out '+['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][t.getDay()]+', '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][t.getMonth()]+' '+t.getDate(); }
  })();

  // Spotify-style search results, keyed off the artist's first name (deterministic, plausible)
  (function(){
    var box=inOv('spotify','#spResults'), tpl=inOv('spotify','#spRowTpl'); if(!box||!tpl) return;
    var firstTok=(artist.split(/\s+/)[0]||artist);
    var h=2166136261>>>0, i; for(i=0;i<artist.length;i++){ h^=artist.charCodeAt(i); h=Math.imul(h,16777619); }
    function rnd(){ h+=0x6D2B79F5; var t=h; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }
    var SURN=['Reyes','Lux','Kade','Monroe','Wilder','Vance','Hollis','Marsh','Okafor','Rhodes','& the Hours'];
    var GEN=['latin pop','dream pop','house','alt r&b','indie rock','synth-pop','folk','lo-fi'];
    function meta(){ var n=Math.floor(rnd()*950)+6; return (n>=1000?(n/1000).toFixed(1)+'M':n+'K')+' followers · '+GEN[Math.floor(rnd()*GEN.length)]; }
    var top=inOv('spotify','#spTop'), rows=$$('.cx-row', box).filter(function(r){ return r!==top; }), used={};
    rows.forEach(function(r){ var k, nm, guard=0; do { k=Math.floor(rnd()*SURN.length); nm=firstTok+' '+SURN[k]; } while((used[k]||nm.toLowerCase()===artist.toLowerCase()) && guard++<40); used[k]=1;
      var n=$q('[data-r="name"]',r), m=$q('[data-r="meta"]',r); if(n) n.textContent=nm; if(m) m.textContent=meta(); });
  })();

  (function(){ var av=$('cpTmAv'); if(av) av.textContent=teammate.split(/\s+/).map(function(w){return w[0];}).slice(0,2).join('').toUpperCase();
    var tz=$('cpTease'); if(tz) tz.innerHTML=esc(release).split(/\s+/).slice(0,3).join('<br>');
    var f=$('cpFile'); if(f) f.textContent=(release.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'release')+'-teaser-v3.mp4'; })();

  var PRISTINE = tapp.innerHTML;   // reset = restore this (seek replays cues instantly from here)

  // ---- scenes + overlays ----
  var DOCK_SCENES = { startrel:1, rollout:1, budget:1, today:1, dna:1, docs:1, daytoday:1, schedule:1, tours:1, tourb:1 };
  function scene(name, instant){
    $$('.xscene').forEach(function(s){ if (instant) s.classList.add('is-instant'); s.hidden = s.getAttribute('data-scene')!==name; });
    if (instant) setTimeout(function(){ $$('.xscene.is-instant').forEach(function(s){ s.classList.remove('is-instant'); }); }, 30);
    var r=$('rail'); dockOn(!!DOCK_SCENES[name] && !(r && r.classList.contains('on')));
  }
  function dockOn(on){ var d=$('dock'); if (d) d.classList.toggle('hide', !on); }
  function ov(name, on){
    // the TeamMate rail slides in (real .rail.on transition); the ask bar steps aside while it's open
    if (name==='panel'){ var r=$('rail'); if (r) r.classList.toggle('on', on); var cs=curScene(); dockOn(!on && !!(cs && DOCK_SCENES[cs.getAttribute('data-scene')])); return; }
    if (name==='toast'){ var t=$('snapToast'); if (t) t.classList.toggle('on', on); return; }
    if (name==='pill'){ var p=$('tmPill'); if (p) p.classList.toggle('on', on); return; }
    var root=ovRoot(name); if (root) root.classList.toggle('on', on);
  }
  function show(el, on){ if (typeof el==='string') el=$(el); if (el) el.hidden = !on; return el; }
  function pop(el, instant){ if (typeof el==='string') el=$(el); if (!el) return; el.hidden=false; if (!instant){ el.classList.remove('t-pop'); void el.offsetWidth; el.classList.add('t-pop'); } }
  function press(el){ if (typeof el==='string') el=$(el); if (!el || el.id==='dock' || el.closest && el.closest('#dock')) return; el.classList.remove('t-press'); void el.offsetWidth; el.classList.add('t-press'); }
  // translate a long page's content up; clip what moves above its original top so it never shows
  // through the app's transparent header
  function scrollTo(el, px, instant){ if (typeof el==='function') el=el(); if (typeof el==='string') el=$(el); if (!el) return; el.classList.add('t-scroll');
    var tf='translateY(-'+px+'px)', cp='inset('+px+'px 0 0 0)';
    if (instant){ el.style.transition='none'; el.style.transform=tf; el.style.clipPath=cp; void el.offsetWidth; el.style.transition=''; }
    else { el.style.transform=tf; el.style.clipPath=cp; } }
  // scroll a page's wrapper so `el` sits `y` px below the wrapper's top (unscaled app px)
  function scrollToEl(wrap, el, y, instant){ if (typeof wrap==='string') wrap=$(wrap); if (typeof el==='string') el=$(el); if (!wrap||!el) return;
    var k=parseFloat(tapp.style.getPropertyValue('--k'))||1, cur=0, m=/translateY\(-?([\d.]+)px\)/.exec(wrap.style.transform||''); if (m) cur=+m[1];
    var off=(el.getBoundingClientRect().top - wrap.getBoundingClientRect().top)/k; scrollTo(wrap, Math.max(0, Math.round(off - y)), instant); }
  function curScene(){ return $q('.xscene:not([hidden])'); }

  // ---- typing: human rhythm (uneven keystrokes, small pauses after spaces/punctuation), pausable ----
  var clock=0, playing=false, last=0, paused=true, typeTimer=null, pendingType=null, typeSeq=0;
  function jitter(n){ var x=Math.sin(n*12.9898+78.233)*43758.5453; return x-Math.floor(x); }
  function keyDelay(text, i, cps){ var c=text.charAt(i-1), d=(1000/cps)*(0.55+jitter(i)*0.9);
    if (c===' ') d+=35; if (/[,.?!:;—]/.test(c)) d+=140; return d; }
  function typeDur(text, cps){ var t=0, i; for (i=1;i<=text.length;i++) t+=keyDelay(text, i, cps); return Math.round(t); }
  function typeInto(el, text, instant, cps, each){
    if (typeof el==='function') el=el(); if (typeof el==='string') el=$(el); if (!el) return;
    if (instant){ el.textContent=text; if (each) each(text); return; }
    var my=++typeSeq, i=0; cps=cps||22;
    (function tp(){
      if (my!==typeSeq) return;
      if (paused){ pendingType=tp; return; }
      var cur=text.slice(0,i); el.textContent=cur; if (each) each(cur);
      if (i++ < text.length){ typeTimer=setTimeout(tp, keyDelay(text, i, cps)); }
    })();
  }

  // ---- onboarding coachmark: ring a target + caption ----
  var coach=document.getElementById('coach'), coachCap=document.getElementById('coachCap');
  function target(t){ if (typeof t==='function') t=t();
    var el = typeof t==='string' ? (t.charAt(0)==='#' && t.indexOf(' ')<0 ? $(t.slice(1)) : $q(t)) : t;
    if (!el && window.console && /[?&]debug\b/.test(location.search)) console.warn('[look] missing target', t); return el; }
  function showCoach(t, text, where){
    var el=target(t); if (!el){ coach.classList.remove('on'); return; }
    var ar=app.getBoundingClientRect(), r=boxOf(el), pad=ar.width*0.006+4, m=pad*0.75;
    // keep the ring on screen: a target running past the frame is clipped to it
    var x0=Math.max(r.left-ar.left-pad, m), y0=Math.max(r.top-ar.top-pad, m),
        x1=Math.min(r.right-ar.left+pad, ar.width-m), y1=Math.min(r.bottom-ar.top+pad, ar.height-m);
    coach.style.left=x0+'px'; coach.style.top=y0+'px';
    coach.style.width=Math.max(x1-x0, 0)+'px'; coach.style.height=Math.max(y1-y0, 0)+'px';
    coachCap.textContent=text; coach.className='coach '+(where||'cap-bottom')+' on';
  }
  function hideCoach(){ coach.classList.remove('on'); }
  // a target's box; for display:contents wrappers (no box of their own), the union of their children
  function boxOf(el){ var r=el.getBoundingClientRect(); if (r.width || r.height) return r;
    var u=null; Array.prototype.forEach.call(el.children, function(c){ var q=boxOf(c); if (!q.width && !q.height) return;
      u = u ? { left:Math.min(u.left,q.left), top:Math.min(u.top,q.top), right:Math.max(u.right,q.right), bottom:Math.max(u.bottom,q.bottom) } : { left:q.left, top:q.top, right:q.right, bottom:q.bottom }; });
    return u ? { left:u.left, top:u.top, right:u.right, bottom:u.bottom, width:u.right-u.left, height:u.bottom-u.top } : r; }

  // ---- demo cursor: a hand-moved mouse. Curved path, speed by distance, eases into the target, pauses with the player ----
  var cursorEl=document.getElementById('cursor'), cur={ x:null, y:null }, curMove=null;
  function placeCursor(x, y){ cur.x=x; cur.y=y; cursorEl.style.left=x+'px'; cursorEl.style.top=y+'px'; }
  function moveCursor(t, instant){
    var el=target(t); if (!el) return;
    var ar=app.getBoundingClientRect(), r=el.getBoundingClientRect(), k=(ar.width/1440)||1;
    // aim slightly off-centre, the way a person lands on a button
    var x=(r.left-ar.left+r.width*(0.5+(jitter(r.left)-0.5)*0.18)), y=(r.top-ar.top+r.height*(0.52+(jitter(r.top)-0.5)*0.14));
    var wasOn=cursorEl.classList.contains('on'); cursorEl.classList.add('on');
    if (instant || cur.x===null || !wasOn){ curMove=null; placeCursor(x, y); return; }
    var x0=cur.x, y0=cur.y, dx=x-x0, dy=y-y0, dist=Math.sqrt(dx*dx+dy*dy); if (dist<1.5){ placeCursor(x, y); return; }
    var dv=dist/k, D=Math.max(320, Math.min(740, 260+dv*0.42));
    var bend=Math.min(70*k, dist*0.14)*(dx>=0?1:-1), nx=-dy/dist, ny=dx/dist;
    var cx=x0+dx*0.42+nx*bend, cy=y0+dy*0.42+ny*bend;
    var mv={ t:0, D:D, last:0 }; curMove=mv;
    (function step(now){ if (curMove!==mv) return;
      if (mv.last && !paused) mv.t+=now-mv.last; mv.last=now;
      var p=Math.min(1, mv.t/mv.D), e=p<0.5 ? 4*p*p*p : 1-Math.pow(-2*p+2, 3)/2, u=1-e;
      placeCursor(u*u*x0+2*u*e*cx+e*e*x, u*u*y0+2*u*e*cy+e*e*y);
      if (p<1) requestAnimationFrame(step); })(performance.now());
  }
  function clickCursor(){ cursorEl.classList.remove('click'); void cursorEl.offsetWidth; cursorEl.classList.add('click'); }
  function hideCursor(){ curMove=null; cursorEl.classList.remove('on','click'); }

  // ---- step sequencer: each step waits for the last, so the pacing reads like a person using the app ----
  // move (cursor travel) -> hover -> click -> a short beat -> the UI responds -> a breath before the next step
  var MOVE=720, NEAR=420, HOVER=210, EFFECT=340, GAP=380;
  function Seq(at){ this.at=at; this.t=0; }
  Seq.prototype.wait=function(ms){ this.t+=ms; return this; };
  Seq.prototype.run=function(fn){ this.at(this.t, fn); return this; };
  Seq.prototype.move=function(sel, near){ this.at(this.t, function(i){ moveCursor(sel, i); }); this.t+=(near ? NEAR : MOVE); return this; };
  Seq.prototype.click=function(sel, fn, o){ o=o||{}; this.t+=HOVER;
    this.at(this.t, function(i){ if(!i){ clickCursor(); press(target(sel)); } });
    this.t+=(o.effect!=null ? o.effect : EFFECT); if (fn) this.at(this.t, fn); this.t+=(o.gap!=null ? o.gap : GAP); return this; };
  Seq.prototype.tap=function(sel, fn, o){ o=o||{}; return this.move(sel, o.near).click(sel, fn, o); };
  Seq.prototype.type=function(el, text, cps, each){ this.at(this.t, function(i){ typeInto(el, text, i, cps, each); }); this.t+=typeDur(text, cps||22)+260; return this; };
  Seq.prototype.coach=function(sel, text, where, hold){ this.at(this.t, function(i){ if(!i) showCoach(sel, text, where); }); this.t+=Math.round((hold||2200)*0.86);
    this.at(this.t, function(){ hideCoach(); }); this.t+=260; return this; };

  // ---- TeamMate chat, built from the real panel's <template>s ----
  function tpl(id){ var t=$(id); var n=t.content.firstElementChild.cloneNode(true); fillSlots(n); if (n.querySelectorAll) fillSlots(n); return n; }
  function nowHM(){ var d=new Date(); return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2); }
  function tmAdd(n){ var b=$('tmBody'); b.appendChild(n); b.scrollTop=b.scrollHeight; return n; }
  function tmUser(text){ var n=tpl('tpl-user'); $q('.tm-ut',n).textContent=text; return tmAdd(n); }
  function tmWork(head, steps){ var n=tpl('tpl-working'); n.id='tmLive'; var wt=$q('.tm-wt',n); if (wt) wt.textContent=head||'Working…';
    var ol=$q('ol',n); if (ol){ ol.innerHTML=''; steps.forEach(function(s){ var li=tpl('tpl-step'); $q('.lb',li).textContent=s; li.setAttribute('data-state','pending'); ol.appendChild(li); }); }
    return tmAdd(n); }
  function tmStep(i, state){ var lis=$$('#tmLive ol li'); if (lis[i]) lis[i].setAttribute('data-state', state); }
  function tmAI(html, parts){ var live=$('tmLive'); if (live) live.parentNode.removeChild(live);
    var n=tpl('tpl-ai'); var tm=$q('.tm-time',n); if (tm) tm.textContent=nowHM(); $q('.tm-prose',n).innerHTML=html;
    (parts||[]).forEach(function(p){ n.appendChild(p); }); return tmAdd(n); }
  function tmAction(title, from, to){ var n=tpl('tpl-action'); var t=$q('.tm-actt',n); if (t) t.textContent=title; var bd=$q('.bd',n); if (bd) bd.textContent=from+' → '+to; return n; }
  function tmClearInput(){ var i=$('tmInput'); if (i) i.textContent=''; }
  function tmCompose(text, instant){ typeInto('tmInput', text, instant, 26); }

  // ======================= story copy =======================
  var QGEN = 'What’s missing from this plan?';
  var AGEN = '<p>Quite a lot, honestly. The rollout covers about a third of what <b>'+esc(release)+'</b> needs to ship clean. I count <b>14 gaps</b> across delivery, metadata, pitching, pre-save and paid.</p><p>Here are the 3 that block everything downstream. I’ll queue the other 11 once these are in.</p>';
  var GEN_ROWS = [['Add ISRC, UPC & ℗ line','Thu 22 Oct · high priority'],['Add track credits and splits','Fri 23 Oct · high priority'],['Upload final cover art','Sat 24 Oct · high priority']];
  var Q_SNAP = 'Raise the release budget to ' + BUD_NEW;
  var A_SNAP = '<p>The total budget on <b>'+esc(release)+'</b> is now <b>'+BUD_NEW+'</b>, up from '+BUD_OLD+'. Nothing is planned in a category yet, so I haven’t touched those.</p><p>'+esc(teammate)+' set the previous total. Want me to let them know?</p>';
  var Q_DRIVE = 'What’s the total budget in ' + artist + '’s Drive files?';
  var slug = release.replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase() || 'release';
  var A_DRIVE = '<p>The total budget in '+esc(artist)+'’s Google Drive files is <b>$94,500</b>, across the single, two music videos and paid social.</p>'+
    '<p>I checked it three ways and they match:</p><ul>'+
    '<li><a>'+slug+'-budget-summary.md</a> states $94,500.</li>'+
    '<li>The nine category totals in <a>'+slug+'-budget-by-category.csv</a> add up to $94,500.</li>'+
    '<li>The 61 line items in <a>master-budget.csv</a> add up to $94,500.</li></ul>'+
    '<p><b>One discrepancy:</b> paid social is $18,000 in the summary but $20,000 in the category sheet. The line items say $20,000, so the summary looks like a typo. Want me to fix it?</p>';
  var relTag = '#' + release.replace(/[^A-Za-z0-9]+/g,'');
  var CAPTION = days + ' days. ' + release + ' is out ' + reldateShort + ' 🌙 Pre-save now, link in bio. ' + relTag + ' #newmusic ' + handle;
  function capHTML(){ return esc(CAPTION).replace(esc(relTag), '<span class="hl">'+esc(relTag)+'</span>').replace('#newmusic', '<span class="hl">#newmusic</span>').replace(esc(handle), '<span class="hl">'+esc(handle)+'</span>'); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  // ======================= chapters =======================
  // chap(id, scrubber label, jump label|null, build(s)) — s is a Seq; the chapter lasts as long as its steps.
  var CHAPTERS = {}, CHAPS = [];
  function chap(id, label, jump, build){ CHAPTERS[id]={ id:id, label:label, jump:jump, build:build }; }
  function isOn(id, cls){ var e=$(id); return !!(e && e.classList.contains(cls)); }

  chap('roster', 'Your roster', null, function(s){
    s.run(function(i){ scene('roster', i); hideCursor(); })
     .wait(900)
     // the new Home is taller than the screen: bring "Add an artist, creator or brand" into view first
     .run(function(i){ scrollToEl($q('main', sc('roster')), 'rosterNew', 560, i); })
     .wait(900).move('#rosterNew')
     .coach('#rosterNew','Add a new artist in seconds','cap-left',1900);
    // only open "New workspace" when the add-an-artist chapter follows
    if (playlist[playlist.indexOf('roster')+1]==='artist') s.click('#rosterNew', function(){ ov('newws', true); }, { gap: 300 });
  });

  chap('artist', 'Add an artist', 'Add an artist', function(s){
    s.run(function(){ ov('newws', true); })
     .wait(500)
     .tap('#nwArtist', function(){ ov('newws', false); ov('spotify', true); var t=inOv('spotify','#spTxt'); if(t) t.textContent=''; show(inOv('spotify','#spResults'), false); var f=inOv('spotify','#spSearch'); if(f) f.classList.remove('is-focus'); })
     .wait(250)
     .tap(function(){ return inOv('spotify','#spSearch'); }, function(){ var f=inOv('spotify','#spSearch'); if(f) f.classList.add('is-focus'); }, { gap: 250 })
     .type(function(){ return inOv('spotify','#spTxt'); }, artist, 11)
     .run(function(){ show(inOv('spotify','#spLoading'), true); })
     .wait(1100)
     .run(function(){ show(inOv('spotify','#spLoading'), false); show(inOv('spotify','#spResults'), true); })
     .wait(600)
     .coach(function(){ return inOv('spotify','#spTop'); },'Pulled straight from Spotify','cap-bottom',1900)
     .move(function(){ return inOv('spotify','#spTop'); }, true)
     .run(function(){ var t=inOv('spotify','#spTop'); if(t) t.classList.add('is-hot'); })
     .click(function(){ return inOv('spotify','#spTop'); }, function(){ ov('spotify', false); hideCursor(); }, { gap: 500 })
     .run(function(i){ scrollTo($q('main', sc('roster')), 0, i); show('rcard4', false); pop('rcardNew', i); })
     .wait(700)
     .coach('#rcardNew','Their workspace is ready. The brain starts learning them','cap-right',2300);
  });

  chap('startrel', 'Start a release', 'Build the release', function(s){
    s.run(function(i){ scene('startrel', i); hideCursor(); })
     .wait(1000)
     .tap('#wizTitleBox', function(){ var b=$('wizTitleBox'); if(b) b.classList.add('is-focus'); }, { gap: 200 })
     .type('wizTitle', release, 11)
     .wait(200)
     .tap('#wizDate', function(){ var b=$('wizTitleBox'); if(b) b.classList.remove('is-focus'); show('wizCal', true); })
     .move('#wizCalPick', true)
     .run(function(){ var p=$('wizCalPick'); if(p) p.classList.add('is-hot'); })
     .click('#wizCalPick', function(){ var p=$('wizCalPick'); if(p) p.classList.add('on'); }, { gap: 250 })
     .run(function(){ show('wizCal', false); var d=$('wizDate'); if(d) d.classList.remove('unset'); var dt=$('wizDateTxt'); if(dt) dt.textContent=reldate+', 2026'; var c=$('wizCreate'); if(c) c.removeAttribute('disabled'); })
     .wait(500)
     .run(function(i){ scrollTo(function(){ return $q('main', sc('startrel')); }, 230, i); })
     .wait(1000)
     .coach('#wizDate','The pitch, pre-save and every step are timed from this date','cap-right',2300)
     .tap('#wizCreate', null, { gap: 150 });
  });

  chap('rollout', 'Your rollout', 'Work the rollout', function(s){
    s.run(function(i){ scene('rollout', i); hideCursor(); var c=$('rollCount'); if(c) c.textContent='12';
        $$('[data-tmpl]', sc('rollout')).forEach(function(card, k){ if(!i){ card.style.animationDelay=(k*90)+'ms'; card.classList.remove('t-in'); void card.offsetWidth; card.classList.add('t-in'); } }); })
     .wait(1300)
     .coach(function(){ return $('rollClock') && $('rollClock').parentNode; },'Your plan, auto-built and counting down to release','cap-bottom',2500);
  });

  // ask TeamMate from the bar: click it, type, send — then the rail slides open with the conversation
  function askBar(s, q){
    return s.tap('#dock', function(){ var t=$('dockTxt'); if(t){ t.textContent=''; t.classList.add('t-caret'); } }, { gap: 200 })
      .type('dockTxt', q, 21)
      .wait(250)
      .tap('#dockSend', function(){ var t=$('dockTxt'); if(t){ t.textContent=''; t.classList.remove('t-caret'); } ov('panel', true); hideCursor(); }, { gap: 380 })
      .run(function(){ tmUser(q); })
      .wait(1000);
  }

  chap('tmplan', 'TeamMate drafts the plan', 'Ask TeamMate', function(s){
    askBar(s, QGEN)
     .run(function(){ tmWork('Working…', ['Reading the rollout…','Checking delivery, metadata and pitching','Drafting the highest-impact tasks']); })
     .wait(500).run(function(){ tmStep(0,'active'); })
     .wait(800).run(function(){ tmStep(0,'done'); tmStep(1,'active'); })
     .wait(850).run(function(){ tmStep(1,'done'); tmStep(2,'active'); })
     .wait(850).run(function(){ tmStep(2,'done'); })
     .wait(450).run(function(){ var ap=tpl('tpl-approval'); var rows=$$('.tm-apr', ap);
        rows.forEach(function(r, k){ if (!GEN_ROWS[k]){ r.parentNode.removeChild(r); return; } var tt=$q('.tt',r), dt=$q('.tm-dt',r); if(tt) tt.textContent=GEN_ROWS[k][0]; if(dt) dt.textContent=GEN_ROWS[k][1]; });
        var wrap=document.createElement('div'); wrap.className='tm-ai'; wrap.appendChild(ap); wrap.id='tmAppr';
        tmAI(AGEN); tmAdd(wrap); })
     .wait(1100)
     .coach('#tmAppr .tm-apok','Nothing is added until you approve','cap-left',2100)
     .tap('#tmAppr .tm-apok', function(){ var ap=$q('#tmAppr .tm-appr'); if(ap){ $$('.tm-apr',ap).forEach(function(r){ r.setAttribute('data-state','busy'); }); } }, { gap: 0 })
     .wait(1000).run(function(){ var ap=$q('#tmAppr .tm-appr'); if(ap){ ap.setAttribute('data-resolved','true'); $$('.tm-apr',ap).forEach(function(r){ r.setAttribute('data-state','approved'); }); } })
     .wait(800).run(function(){ ov('panel', false); hideCursor(); })
     .wait(600).run(function(i){ $$('[data-gen]', sc('rollout')).forEach(function(c, k){ if(i) c.hidden=false; else { c.style.animationDelay=(k*190)+'ms'; pop(c); } }); var c=$('rollCount'); if(c) c.textContent='15'; })
     .wait(1100)
     .coach(function(){ return $q('[data-gen]', sc('rollout')); },'Three tasks, drafted and on your board','cap-bottom',2300);
  });

  chap('task', 'Add a task', null, function(s){
    s.tap('#addTaskSun', function(){ ov('addtask', true); })
     .wait(300)
     .tap('#taskName', null, { gap: 200 })
     .type('taskName', 'Plan the launch-week socials', 17)
     .tap('#taskAssignee', function(){ show('taskAssignMenu', true); }, { gap: 300 })
     .coach('#taskAssignMenu','Assign it to anyone on the team','cap-left',1700)
     .tap('#taskAssignFirst', function(){ show('taskAssignMenu', false); var a=$('taskAssignee'); if(a) a.innerHTML='<i class="tc-av tc-sm" style="background:#D9FA87;color:#0E0D0B">'+esc((teammate[0]||'K').toUpperCase())+'</i><span>'+esc(teammate)+'</span>'; }, { near: true })
     .tap('#taskDate', function(){ show('taskCal', true); })
     .tap('#taskCalPick', function(){ var p=$('taskCalPick'); if(p) p.classList.add('sel'); }, { near: true, gap: 250 })
     .run(function(){ show('taskCal', false); var v=$('taskDate'); if(v) v.textContent='Sun 25 Oct'; var c=$('taskCreate'); if(c) c.classList.add('is-ready'); })
     .wait(300)
     .tap('#taskCreate', function(i){ ov('addtask', false); hideCursor(); }, { gap: 400 })
     .run(function(i){ pop('taskCard', i); var c=$('rollCount'); if(c) c.textContent='16'; })
     .wait(700)
     .coach('#taskCard','On the board, assigned and dated','cap-left',2100);
  });

  // New Post: the v2 composer (opens empty; every pick happens on a click)
  function cp(){ return $('cp2'); }
  function cpCh(id, cls, n){ var r=$(id); if(r) r.classList.add('on'); var c=cp(); if(c){ c.classList.add('has-ch', cls); }
    var t=$('cpChTxt'); if(t) t.textContent = n + (n===1 ? ' channel' : ' channels'); }
  chap('post', 'Schedule a post', 'Schedule a post', function(s){
    s.tap('#rollNewPost', function(){ ov('newpost', true); }, { gap: 550 })
     // 1 · media: pick the teaser from the release's assets
     .tap('#cpAsset1', function(){ var a=$('cpAsset1'); if(a) a.classList.add('is-picked'); var c=cp(); if(c) c.classList.add('has-media'); }, { gap: 450 })
     // 2 · channels, from the sentence
     .tap('#cpTokCh', function(){ show('cpChMenu', true); }, { gap: 150 })
     .tap('#cpChIG', function(){ cpCh('cpChIG', 'ch-ig', 1); }, { near: true, gap: 60, effect: 220 })
     .tap('#cpChTT', function(){ cpCh('cpChTT', 'ch-tt', 2); }, { near: true, gap: 60, effect: 220 })
     .tap('#cpChYT', function(){ cpCh('cpChYT', 'ch-yt', 3); }, { near: true, gap: 300, effect: 220 })
     .run(function(){ show('cpChMenu', false); })
     .wait(250).run(function(i){ scrollTo('cpScroll', 300, i); }).wait(800)
     // 3 · caption: Teammate drafts it (thinks for a beat, then writes)
     .tap('#cpRewrite', function(){ var r=$('cpRewrite'); if(r) r.classList.add('is-busy'); }, { gap: 1150 })
     .run(function(){ var r=$('cpRewrite'); if(r) r.classList.remove('is-busy'); })
     .type('cpCapTxt', CAPTION, 44, function(t){ var n=$('cpCount'); if(n) n.textContent=t.length; var pv=$('cpPvCap'); if(pv) pv.innerHTML = esc(t.length > 62 ? t.slice(0,62).replace(/[\s.,;:]+$/,'')+'…' : t) + (t.length > 62 ? ' <span>more</span>' : ''); })
     .run(function(){ var c=$('cpCapTxt'); if(c) c.innerHTML = capHTML(); })
     .wait(300).run(function(i){ scrollTo('cpScroll', 610, i); }).wait(800)
     // 4 · when: Teammate's suggested slot
     .tap('#cpDay22', function(){ var d=$('cpDay22'); if(d) d.classList.add('sel'); }, { gap: 120 })
     .tap('#cpTime18', function(){ var t=$('cpTime18'); if(t) t.classList.add('on'); var w=$('cpWhenTxt'); if(w) w.textContent='Thu 22 Oct, 18:00'; var s2=$('cpSchedule'); if(s2) s2.classList.add('is-ready'); })
     // 5 · preview, then schedule
     .tap('#cpFab', function(){ var c=cp(); if(c) c.classList.add('pv-open'); }, { gap: 300 })
     .run(function(){ hideCursor(); }).wait(650)
     .coach('.cp2 .pv','See exactly how it lands, on every channel','cap-left',2200)
     .tap('#cpSchedule', function(){ ov('newpost', false); hideCursor(); }, { gap: 450 })
     .run(function(i){ pop('postCard', i); })
     .wait(700)
     .coach('#postCard','Scheduled to Instagram, TikTok and YouTube','cap-right',2100);
  });

  chap('snap', 'TeamMate makes the change', 'TeamMate does it', function(s){
    s.run(function(i){ if (!curScene() || !DOCK_SCENES[curScene().getAttribute('data-scene')]) scene('rollout', i); });
    askBar(s, Q_SNAP)
     .run(function(){ tmWork('Working…', ['On it — reading the release…','Updating the budget']); })
     .wait(450).run(function(){ tmStep(0,'active'); })
     .wait(800).run(function(){ tmStep(0,'done'); tmStep(1,'active'); })
     .wait(600).run(function(){ ov('panel', false); dockOn(false); var p=$('tmPill'); if(p) p.classList.add('wait'); var t=$('tmPillTxt'); if(t) t.textContent='Working on it…'; ov('pill', true); })
     .wait(500).run(function(i){ scene('budget', i); dockOn(false); show('budBody', false); show('budSkeleton', true); var pn=$q('#panel', sc('budget')); if(pn) pn.classList.add('bud-loading'); })
     .wait(850).run(function(){ show('budSkeleton', false); show('budBody', true); var pn=$q('#panel', sc('budget')); if(pn) pn.classList.remove('bud-loading'); })
     .wait(700).run(function(){ var a=$('budTotal'), b=$('budAvail'), bp=$('budPillAmt'); if(a) a.textContent=BUD_NEW; if(b) b.textContent=BUD_NEW; if(bp) bp.textContent=BUD_NEW; var tl=$('budTile'); if(tl) tl.classList.add('snap-hi');
        var tt=$('toastT'), td=$('toastD'); if(tt) tt.textContent='Set the release budget to '+BUD_NEW; if(td) td.textContent=BUD_OLD+' → '+BUD_NEW; ov('toast', true); })
     .wait(500).run(function(){ var p=$('tmPill'); if(p) p.classList.remove('wait'); var t=$('tmPillTxt'); if(t) t.textContent='My reply is ready'; })
     .wait(300)
     .coach('#budTile','TeamMate takes you to the change, and shows it','cap-right',2600)
     .wait(250)
     .run(function(i){ ov('toast', false); ov('pill', false); scene('rollout', i); ov('panel', true); tmStep(1,'done');
        tmAI(A_SNAP, [tmAction('Updated release “'+release+'”', BUD_OLD, BUD_NEW)]); })
     .wait(1000)
     .coach(function(){ return $q('#tmBody .tm-act') || $q('#tmBody .tm-acts'); },'Every change shown, verified and undoable','cap-left',2800)
     .run(function(){ ov('panel', false); })
     .wait(600);
  });

  chap('today', 'Your Today', 'Your Today', function(s){
    s.run(function(){ ov('panel', false); })
     .tap(function(){ return pillIn(curScene(), 0); }, function(i){ scene('today', i); hideCursor(); }, { gap: 900 })
     .coach('#attnCard1','Every morning, TeamMate surfaces what needs you','cap-left',2200)
     .tap('#attnNext', function(){ attn(2); }, { gap: 600 })
     .coach('#attnCard2','It catches metadata and asset gaps','cap-left',1900)
     .tap('#tdTabDetails', function(){ tdTab('Details'); }, { gap: 600 })
     .coach('#paneDetails','Fix it right here: no digging through tabs','cap-right',2100);
  });
  function attn(n){ [1,2,3].forEach(function(k){ show('attnCard'+k, k===n); }); var of=$('attnOf'); if(of) of.textContent=n+' of 10 items';
    var dots=$('attnDots'); if(dots){ $$('button, s, span, i', dots).forEach(function(d, k){ d.setAttribute('aria-current', k===n-1 ? 'true' : 'false'); }); } }
  function tdTab(name){ ['Connect','Details','Pitch'].forEach(function(k){ var t=$('tdTab'+k); if(t) t.setAttribute('aria-selected', k===name ? 'true' : 'false'); });
    show('paneConnect', name==='Connect'); show('paneDetails', name==='Details'); show('panePitch', name==='Pitch'); }

  // the n-th centre pill (Today / Rollout / Files / Budget …) in a scene's header
  function pillIn(scn, n){ var ps=$$('#pills > *', scn).filter(function(e){ return e.offsetWidth; }); return ps[n] || null; }
  function artistMenu(s){ // click the artist crumb in whatever header is showing
    return s.tap(function(){ return $q('.rsw-crumb', curScene()) || $q('.rsw-crumb'); }, function(){ ov('artistmenu', true); }, { gap: 250 });
  }
  chap('dna', 'Artist DNA', 'Artist DNA', function(s){
    s.run(function(i){ if (!curScene() || !$q('.rsw-crumb', curScene())) scene('today', i); ov('panel', false); });
    artistMenu(s)
     .tap('#menuDNA', function(i){ ov('artistmenu', false); scene('dna', i); hideCursor(); }, { near: true, gap: 900 })
     .coach(function(){ return $q('.dcover', sc('dna')) || $('dnaScroll'); },'Artist DNA: researched from 23 sources, kept current','cap-top',2500)
     .run(function(i){ scrollTo('dnaScroll', 470, i); }).wait(1150)
     .coach(function(){ return $q('.dv2-numbers', sc('dna')); },'The numbers that matter, observed weekly','cap-top',2000)
     .run(function(i){ scrollTo('dnaScroll', 0, i); }).wait(800);
    artistMenu(s)
     .tap('#menuRundown', function(i){ ov('artistmenu', false); scene('rundown', i); }, { near: true, gap: 800 })
     .tap('#rdPublish', function(){ var b=$('rdPublish'); if(b) b.classList.add('t-busy'); }, { gap: 1000 })
     .run(function(){ var b=$('rdPublish'); if(b) b.classList.remove('t-busy'); var r=sc('rundown'); if(r) r.classList.add('is-live'); var l=$('rdLink'); if(l) l.textContent='team.page/'+artist.toLowerCase().replace(/[^a-z0-9]+/g,'-'); hideCursor(); })
     .wait(500)
     .coach('#rdStatus','One shareable page for press, promoters and partners','cap-bottom',2600);
  });

  chap('files', 'Files & Drive', 'Files & Drive', function(s){
    s.run(function(i){ if (!curScene() || !$q('.rsw-crumb', curScene())) scene('today', i); ov('panel', false); });
    artistMenu(s)
     .tap('#menuDocs', function(i){ ov('artistmenu', false); scene('docs', i); show('dockAboutRelease', false); show('dockAboutArtist', true); }, { near: true, gap: 800 })
     .tap('#docsUpload', function(i){ var n=$('docsNew'); if(n){ n.classList.add('is-reading'); } pop('docsNew', i); }, { gap: 300 })
     .run(function(i){ hideCursor(); scrollToEl('docsScroll', 'docsNew', 210, i); }).wait(1000)
     .run(function(i){ if(!i) showCoach('#docsNew','Drop in a contract: TeamMate reads it, and keeps it','cap-bottom'); })
     .wait(1500).run(function(){ var n=$('docsNew'); if(n) n.classList.remove('is-reading'); })
     .wait(1000).run(function(){ hideCoach(); }).wait(300);
    askBar(s, Q_DRIVE)
     .run(function(){ var ch=$('tmChipTxt'); if(ch) ch.textContent='About '+artist; tmWork('Working…', ['Searching Google Drive…','Reading 3 budget files','Cross-checking the totals']); })
     .wait(450).run(function(){ tmStep(0,'active'); })
     .wait(800).run(function(){ tmStep(0,'done'); tmStep(1,'active'); })
     .wait(900).run(function(){ tmStep(1,'done'); tmStep(2,'active'); })
     .wait(800).run(function(){ tmStep(2,'done'); tmAI(A_DRIVE, [tpl('tpl-sources'), tpl('tpl-feedback')]); })
     .wait(1000)
     .coach(function(){ return $q('#tmBody .tm-ai:last-child .tm-prose'); },'It reads your Drive, and checks its own work','cap-left',3400)
     .run(function(){ ov('panel', false); })
     .wait(500);
  });

  // ---- touring: the artist's tour, routed on a map; one show gets confirmed, then the crew's day sheet goes out ----
  function tourMap(instant){ var m=$('trMap'); if (!m) return; m.classList.remove('is-in','is-done'); void m.offsetWidth; m.classList.add(instant ? 'is-done' : 'is-in'); }
  function tbTab(name){ ['Builder','Daysheets'].forEach(function(k){ var t=$('tbTab'+k); if(t) t.setAttribute('aria-selected', k===name ? 'true' : 'false'); });
    show('tbBuilder', name==='Builder'); show('tbDaysheet', name==='Daysheets'); }
  function confirmShow(instant){
    var sg=$('tsmStSigned'), cf=$('tsmStConfirmed'); if(sg) sg.className='done'; if(cf) cf.className='cur';
    var st=$('tsmStage'); if(st) st.textContent='Confirmed';
    var pl=$('tsmPill'); if(pl){ pl.className='tpill confirmed'; pl.lastChild.textContent='confirmed'; }
    var r=$('trRow4'); if(r){ var p=$q('.tpill', r); if(p){ p.className='tpill confirmed'; p.lastChild.textContent='CONFIRMED'; }
      var n=$q('.tr-num', r); if(n) n.style.background='var(--ember)'; var b=$q('.tr-bar i', r); if(b) b.className='confirmed'; }
    var pin=$('trPin4'); if(pin) pin.style.setProperty('--c', 'var(--ember)');
    var c=$('trChipConf'), t=$('trChipTent'); if(c) c.textContent='CONFIRMED 4'; if(t) t.textContent='TENTATIVE 3';
    pop('tsmHistNew', instant);
  }
  chap('tour', 'Touring', 'Take it on the road', function(s){
    s.run(function(i){ if (!curScene() || !$q('.rsw-crumb', curScene())) scene('today', i); ov('panel', false); });
    artistMenu(s)
     .tap('#menuTouring', function(i){ ov('artistmenu', false); scene('tours', i); }, { near: true, gap: 800 })
     .coach('#tourCard','Every tour, right beside the release','cap-bottom',2000)
     .tap('#tourCard', function(i){ scene('tourb', i); tbTab('Builder'); tourMap(i); hideCursor(); }, { gap: 300 })
     .wait(2900)
     .coach('#trMap','Routed on the map: every leg, distance and drive time','cap-top',2500)
     .coach(function(){ return $q('.tbd-rail', sc('tourb')); },'Every show, with its deal stage and ticket sales','cap-right',2200)
     .tap('#trRow4', function(){ ov('tourshow', true); }, { gap: 800 })
     .tap('#tsmStConfirmed', function(i){ confirmShow(i); }, { gap: 450 })
     .coach('#tsmPipe','From first offer to settled, in one record','cap-bottom',2200)
     .run(function(i){ hideCursor(); scrollToEl('tsmScroll', 'ms-settlement', 20, i);
        $$('.tsm-nav button', ovRoot('tourshow')).forEach(function(b, k){ b.setAttribute('aria-current', k===3 ? 'true' : 'false'); }); }).wait(1100)
     .coach('#tsmWf','The deal, projected to walkout as tickets sell','cap-left',2700)
     .tap('#tsmDaySheet', function(i){ ov('tourshow', false); tbTab('Daysheets'); }, { gap: 900 })
     .run(function(){ hideCursor(); })
     .coach('#tdsSheet','A day sheet for every show, built from the advance','cap-top',2400)
     .tap('#tdsShare', function(){ var b=$('tdsShare'); if(b) b.classList.add('t-busy'); }, { gap: 900 })
     .run(function(){ var b=$('tdsShare'); if(b) b.classList.remove('t-busy'); hideCursor(); var t=$('snapToast'); if(t) t.classList.add('t-plain');
        var tt=$('toastT'), td=$('toastD'); if(tt) tt.textContent='Day sheet shared with the crew'; if(td) td.textContent='14 people · Roundhouse, Tue 9 Mar'; ov('toast', true); })
     .wait(2800)
     .run(function(){ ov('toast', false); });
  });

  var dtdFrom = null;
  chap('daytoday', 'Day to day', 'Day to day', function(s){
    // open the artist's workspace from the roster card (the new artist if we just added one)
    s.run(function(){ ov('panel', false); var c=$('rcardNew'); dtdFrom = (c && !c.hidden) ? c : $('hmLeadD2d'); })
     .tap(function(){ return dtdFrom || $('hmLeadD2d'); }, function(i){ scene('daytoday', i); hideCursor(); }, { gap: 900 })
     .coach('#dtdPlate','Everything outside a release, in one list','cap-right',2300)
     .tap('#dtdRow1 .d2d-tick', function(){ var r=$('dtdRow1'); if(r){ r.classList.add('done'); var tk=$q('.d2d-tick', r); if(tk) tk.setAttribute('aria-checked','true'); } }, { gap: 500 })
     .run(function(){ hideCursor(); })
     .coach(function(){ return ($('dtdUpTravel') && $('dtdUpTravel').parentNode) || $('dtdUpTravel'); },'Travel, shows and release days, coming up','cap-left',2500);
  });

  chap('schedule', 'Schedule', 'Schedule', function(s){
    s.run(function(i){ if (curScene() && curScene().getAttribute('data-scene')!=='daytoday') scene('daytoday', i); })
     .tap('#dtdTabSched', function(i){ scene('schedule', i); hideCursor(); }, { gap: 900 })
     .coach(function(){ return $q('#schedScroll > *') || $('schedScroll'); },'Shows, studio days, press and travel, beside every release','cap-bottom',2300)
     .tap('#schedSync', function(){ ov('synccal', true); }, { gap: 700 })
     .run(function(){ hideCursor(); })
     .coach(function(){ return inOv('synccal','.dlg') || ovRoot('synccal'); },'You choose exactly what TeamMate reads','cap-left',2100)
     .tap('#calConnect', function(){ var b=$('calConnect'); if(b) b.classList.add('t-busy'); }, { gap: 1200 })
     .run(function(){ show('calMain', false); show('calDone', true); })
     .wait(700)
     .tap('#calDoneBtn', function(i){ ov('synccal', false); hideCursor(); show('schedSynced', true);
        $$('[data-sync]', sc('schedule')).forEach(function(r, k){ if(i) r.hidden=false; else { r.style.animationDelay=(k*160)+'ms'; pop(r); } }); }, { gap: 700 })
     .coach('#schedSynced','Synced with Google Calendar','cap-bottom',2100);
  });

  // ---- per-segment storylines (same engine, different chapters) ----
  var PLAYLIST = {
    label:       ['roster','artist','startrel','rollout','tmplan','post','snap','today','dna','files','tour'],
    sublabel:    ['roster','artist','startrel','rollout','tmplan','post','snap','today','dna','files','tour'],
    management:  ['roster','artist','daytoday','schedule','rollout','post','snap','dna','files','tour'],
    distributor: ['roster','artist','startrel','rollout','tmplan','task','post','snap','files'],
    agency:      ['roster','daytoday','schedule','rollout','post','snap','dna','files'],
    artist:      ['startrel','rollout','tmplan','post','snap','today','dna','files','tour']
  };
  var playlist = (PLAYLIST[seg] || PLAYLIST.label).filter(function(id){ return CHAPTERS[id]; });

  // ---- assemble: chapter start times → absolute cues ----
  var cues=[]; function cue(t, run){ cues.push({t:t, run:run, done:false}); }
  var CHAP_AT = {}, TOTAL = 0;
  playlist.forEach(function(id){ var c=CHAPTERS[id], st=TOTAL; CHAP_AT[id]=st;
    CHAPS.push([st, c.label]); var sq=new Seq(function(rel, run){ cue(st+rel, run); });
    // each chapter starts clean: nothing left open from the one before
    sq.run(function(){ ['newws','spotify','addtask','newpost','synccal','artistmenu','stacks','tourshow','toast','pill'].forEach(function(n){ ov(n, false); }); hideCoach(); });
    c.build(sq); c.dur=sq.t+500; TOTAL+=c.dur; });
  cues.sort(function(a,b){ return a.t-b.t; });
  // the first chapter sets the opening scene (roster, or the release page for an artist)
  var OPEN_SCENE = playlist[0]==='startrel' ? 'startrel' : playlist[0]==='daytoday' ? 'daytoday' : 'roster';

  // ---- live countdown clock on the rollout header ----
  var baseSecs=8*3600+20*60+17, secs=baseSecs;
  function paintClock(){ var el=$('rollClock'); if(!el) return; var h=secs/3600|0,m=(secs%3600)/60|0,s=secs%60; el.innerHTML=('0'+h).slice(-2)+'<b>:</b>'+('0'+m).slice(-2)+'<b>:</b>'+('0'+s).slice(-2); }

  // ======================= player =======================
  var ctrl=document.getElementById('ctrl'), pp=document.getElementById('pp'), track=document.getElementById('track'), fill=document.getElementById('fill'),
      timeEl=document.getElementById('time'), chapEl=document.getElementById('chap'), replay=document.getElementById('replay');
  function fmt(s){ s=Math.max(0,s/1000|0); return (s/60|0)+':'+('0'+(s%60)).slice(-2); }
  function resetState(){
    cues.forEach(function(c){ c.done=false; });
    tapp.innerHTML = PRISTINE; fit();
    scene(OPEN_SCENE, true); hideCoach(); hideCursor(); secs=baseSecs; paintClock();
  }
  function applyTo(t, instant){ cues.forEach(function(c){ if (c.t<=t && !c.done){ c.done=true; try { c.run(instant); } catch(e){ if (window.console) console.warn('[look]', e); } } }); }
  function chapter(t){ var name=CHAPS[0][1]; for (var i=0;i<CHAPS.length;i++){ if (t>=CHAPS[i][0]) name=CHAPS[i][1]; } chapEl.textContent=name; }
  function seek(t){
    ++typeSeq; if (typeTimer){ clearTimeout(typeTimer); typeTimer=null; } pendingType=null;
    clock=Math.max(0,Math.min(t,TOTAL)); resetState(); applyTo(clock, true);
    secs=Math.max(0,baseSecs-(clock/1000|0)); paintClock(); paint();
    if (clock>=TOTAL) finish(); else replay.hidden=true;
  }
  function paint(){ fill.style.width=(clock/TOTAL*100)+'%'; timeEl.textContent=fmt(clock); chapter(clock); updateJump(clock); }
  function loop(ts){ if (!playing) return; if (!last) last=ts; var dt=ts-last; last=ts;
    clock+=dt; if (clock>TOTAL) clock=TOTAL;
    var ps=secs; secs=Math.max(0,baseSecs-(clock/1000|0)); if (secs!==ps) paintClock();
    applyTo(clock, false); paint(); trackChapter(clock);
    if (clock>=TOTAL){ finish(); return; } requestAnimationFrame(loop); }
  var trackedPlay=false, trackedChap={};
  function trackChapter(t){ if (!playing) return; var cur=null;
    for (var i=0;i<playlist.length;i++){ if (t>=CHAP_AT[playlist[i]]) cur=playlist[i]; }
    if (cur && !trackedChap[cur]){ trackedChap[cur]=1; tag('look_chapter', { look_chapter: cur }); } }
  function play(){ if (playing) return; if (!trackedPlay){ trackedPlay=true; tag('look_play'); } if (clock>=TOTAL){ seek(0); }
    playing=true; paused=false; last=0; ctrl.classList.remove('is-paused'); replay.hidden=true;
    if (pendingType){ var f=pendingType; pendingType=null; f(); } requestAnimationFrame(loop); }
  function pause(){ playing=false; paused=true; ctrl.classList.add('is-paused'); if (typeTimer){ clearTimeout(typeTimer); } }
  var trackedDone=false;
  function finish(){ var wasPlaying=playing; playing=false; paused=true; clock=TOTAL; paint(); ctrl.classList.add('is-paused'); replay.hidden=false;
    if (wasPlaying && !trackedDone){ trackedDone=true; tag('look_complete'); } }

  pp.addEventListener('click', function(){ playing ? pause() : play(); });
  replay.addEventListener('click', function(){ seek(0); play(); });
  track.addEventListener('click', function(e){ var r=track.getBoundingClientRect(), wp=playing; if (playing) pause();
    seek(((e.clientX-r.left)/r.width)*TOTAL); if (wp) play(); });

  // ---- jump tabs (pinned bar) + how-it-runs steps scrub the demo and play from there ----
  (function(){
    var bar=document.getElementById('jumpBtns');
    if (bar){ bar.innerHTML=''; playlist.forEach(function(id){ var c=CHAPTERS[id]; if (!c.jump) return;
      var b=document.createElement('button'); b.className='look__jumpbtn'; b.setAttribute('data-seek', CHAP_AT[id]); b.textContent=c.jump; bar.appendChild(b); }); }
    var n=0;
    [].slice.call(document.querySelectorAll('.step[data-chap]')).forEach(function(st){ var ids=st.getAttribute('data-chap').split(/\s+/), hit=null;
      ids.forEach(function(id){ if (hit===null && (id in CHAP_AT)) hit=id; });
      if (hit===null){ st.hidden=true; return; }
      st.setAttribute('data-seek', CHAP_AT[hit]); var num=st.querySelector('.step__n'); if (num) num.textContent=('0'+(++n)).slice(-2); });
  })();
  var jumpBtns = [].slice.call(document.querySelectorAll('[data-seek]'));
  function updateJump(t){ var bt=-1, i, s;
    for (i=0;i<jumpBtns.length;i++){ s=+jumpBtns[i].getAttribute('data-seek'); if (t>=s-250 && s>bt) bt=s; }
    for (i=0;i<jumpBtns.length;i++){ jumpBtns[i].classList.toggle('on', +jumpBtns[i].getAttribute('data-seek')===bt); }
  }
  jumpBtns.forEach(function(b){ b.addEventListener('click', function(){
    var st=document.getElementById('stage'), nav=document.getElementById('nav');
    var navh=nav?Math.round(nav.getBoundingClientRect().height):64;
    // land the demo just below the pinned bar so it keeps showing after the jump
    var y=st.getBoundingClientRect().top+window.scrollY-(navh+78);
    try{ window.scrollTo({top:y,behavior:'smooth'}); }catch(e){ window.scrollTo(0,y); }
    seek(+b.getAttribute('data-seek')); play();
  }); });

  seek(0); updateJump(0);

  // ---- pin the jump bar while the demo is on screen; book FAB is on except while the CTA card is visible ----
  (function(){
    var pin=document.getElementById('jumpPin'), fab=document.getElementById('bookfab'),
        stage=document.getElementById('stage'), navEl=document.getElementById('nav');
    if(!pin||!stage) return;
    function navH(){ return navEl ? Math.round(navEl.getBoundingClientRect().height) : 64; }
    function placePin(){ pin.style.setProperty('--navh', (navH()+8)+'px'); }
    function onScroll(){
      var r=stage.getBoundingClientRect(), vh=window.innerHeight;
      var inView = window.scrollY > 40 && r.top < vh*0.6 && r.bottom > vh*0.25;
      var cta=document.querySelector('.look__ctacard'), cr=cta?cta.getBoundingClientRect():null;
      var ctaOn = !!cr && cr.top < vh && cr.bottom > 0;
      pin.classList.toggle('show', inView);
      if(fab){ fab.classList.toggle('show', !ctaOn); fab.setAttribute('aria-hidden', ctaOn?'true':'false'); }
    }
    placePin(); onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', function(){ placePin(); onScroll(); });
  })();

  try { window.__look = { seek: function(t){ pause(); seek(t); }, play: play, pause: pause, total: TOTAL, chapters: CHAP_AT, playlist: playlist, seg: seg }; } catch(e){}
  var started=false;
  // ?ch=<chapter id> starts the demo at that chapter (handy for reviews and for linking to one feature)
  var startCh=g('ch'); if (startCh && (startCh in CHAP_AT)) seek(CHAP_AT[startCh]);
  if ('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if (en.isIntersecting && !started){ started=true; play(); io.disconnect(); } }); }, { threshold:0.35 });
    io.observe(document.getElementById('demo'));
  } else { play(); }

  [].slice.call(document.querySelectorAll('[data-look-cta]')).forEach(function(a){
    a.addEventListener('click', function(){ tag('look_cta', { look_cta: a.getAttribute('data-look-cta') }); }); });

  // ---- draggable founder bubble ----
  var head=document.getElementById('head'), stageEl=document.getElementById('stage');
  if (head && stageEl){
    var drag=false, ox=0, oy=0;
    head.addEventListener('pointerdown', function(e){ drag=true; head.setPointerCapture(e.pointerId); head.classList.add('is-drag');
      var hr=head.getBoundingClientRect(), sr=stageEl.getBoundingClientRect(); ox=e.clientX-hr.left; oy=e.clientY-hr.top;
      head.style.left=(hr.left-sr.left)+'px'; head.style.top=(hr.top-sr.top)+'px'; head.style.bottom='auto'; e.preventDefault(); });
    head.addEventListener('pointermove', function(e){ if (!drag) return;
      var sr=stageEl.getBoundingClientRect(), hr=head.getBoundingClientRect(), pad=56;
      var x=e.clientX-sr.left-ox, y=e.clientY-sr.top-oy;
      x=Math.max(-pad,Math.min(x,sr.width-hr.width+pad)); y=Math.max(-pad,Math.min(y,sr.height-hr.height+pad));
      head.style.left=x+'px'; head.style.top=y+'px'; });
    function endDrag(){ if (drag){ drag=false; head.classList.remove('is-drag'); } }
    head.addEventListener('pointerup', endDrag); head.addEventListener('pointercancel', endDrag);
  }
})();
