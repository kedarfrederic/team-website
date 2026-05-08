(function() {
  const nav = document.getElementById('nav');
  const hero = document.getElementById('heroSection');
  const heroInner = hero ? hero.querySelector('.icp-hero__inner') : null;
  if (!hero) return;

  function check() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const heroH = hero.offsetHeight;
    const scrolled = window.scrollY;

    // Nav solid transition
    if (heroBottom < 60) document.getElementById('nav')?.classList.add('nav--solid');
    else document.getElementById('nav')?.classList.remove('nav--solid');

    // Hero content fade on scroll
    if (heroInner) {
      const progress = Math.min(1, scrolled / (heroH * 0.5));
      heroInner.style.opacity = 1 - progress;
      heroInner.style.transform = 'translateY(' + (progress * 40) + 'px)';
    }
  }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();

(function() {
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.pillar-card').forEach(function(c) { observer.observe(c); });
    // Also observe the AI privacy panel
    var isoPanel = document.getElementById('isoPanel');
    if (isoPanel) observer.observe(isoPanel);
  }
})();

(function() {
  var panel = document.getElementById('isoPanel');
  if (!panel) return;
  var svg = document.getElementById('isoLinesSvg');
  var center = panel.querySelector('.iso-center');
  var conns = panel.querySelectorAll('.iso-connected');
  var pulses = [
    [document.getElementById('isoPulse1'), document.getElementById('isoPulse1r')],
    [document.getElementById('isoPulse2'), document.getElementById('isoPulse2r')],
    [document.getElementById('isoPulse3'), document.getElementById('isoPulse3r')],
  ];

  // Get center of an element relative to the panel
  function getCenter(el) {
    var pr = panel.getBoundingClientRect();
    var er = el.getBoundingClientRect();
    return { x: er.left - pr.left + er.width / 2, y: er.top - pr.top + er.height / 2 };
  }

  // Draw SVG lines connecting green tiles to center tile
  function drawLines() {
    var pw = panel.offsetWidth;
    var ph = panel.offsetHeight;
    svg.setAttribute('width', pw);
    svg.setAttribute('height', ph);
    svg.setAttribute('viewBox', '0 0 ' + pw + ' ' + ph);
    svg.innerHTML = '';
    var c = getCenter(center);
    conns.forEach(function(conn) {
      var t = getCenter(conn);
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', t.x);
      line.setAttribute('y1', t.y);
      line.setAttribute('x2', c.x);
      line.setAttribute('y2', c.y);
      line.setAttribute('stroke', '#191919');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    });
  }

  // Animate pulses along lines — only after lines have faded in (1.5s after panel visible)
  var startTimes = [0, 1500, 500, 2000, 1000, 700];
  var durations = [3000, 3500, 4000, 3000, 3500, 4000];
  var visibleSince = 0;

  // Track when panel becomes visible
  var panelObserver = new MutationObserver(function() {
    if (panel.classList.contains('is-visible') && !visibleSince) {
      visibleSince = performance.now();
    } else if (!panel.classList.contains('is-visible')) {
      visibleSince = 0;
    }
  });
  panelObserver.observe(panel, { attributes: true, attributeFilter: ['class'] });

  function animatePulses(timestamp) {
    var c = getCenter(center);
    var isVisible = panel.classList.contains('is-visible');
    // Pulses appear 1.5s after panel visible (after lines fade in at 0.8s + 0.6s transition)
    var pulsesReady = isVisible && visibleSince && (timestamp - visibleSince > 1500);

    conns.forEach(function(conn, i) {
      var t = getCenter(conn);
      var fwd = pulses[i][0];
      var rev = pulses[i][1];
      if (!fwd || !rev) return;

      var elapsed = (timestamp + startTimes[i * 2]) % durations[i * 2];
      var p = elapsed / durations[i * 2];
      var ep = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      var fx = t.x + (c.x - t.x) * ep;
      var fy = t.y + (c.y - t.y) * ep;
      var fo = p < 0.1 ? p / 0.1 : p > 0.9 ? (1 - p) / 0.1 : 1;
      fwd.style.left = (fx - 5) + 'px';
      fwd.style.top = (fy - 5) + 'px';
      fwd.style.opacity = pulsesReady ? fo : 0;

      // Reverse
      var elapsed2 = (timestamp + startTimes[i * 2 + 1]) % durations[i * 2 + 1];
      var p2 = elapsed2 / durations[i * 2 + 1];
      var ep2 = p2 < 0.5 ? 2 * p2 * p2 : 1 - Math.pow(-2 * p2 + 2, 2) / 2;
      var rx = c.x + (t.x - c.x) * ep2;
      var ry = c.y + (t.y - c.y) * ep2;
      var ro = p2 < 0.1 ? p2 / 0.1 : p2 > 0.9 ? (1 - p2) / 0.1 : 1;
      rev.style.left = (rx - 5) + 'px';
      rev.style.top = (ry - 5) + 'px';
      rev.style.opacity = pulsesReady ? ro : 0;
    });
    drawLines();
    requestAnimationFrame(animatePulses);
  }

  drawLines();
  requestAnimationFrame(animatePulses);
})();

(function() {
  // Compliance cards — horizontal 3-column grid (CSS layout). JS just
  // fades each card in as it enters viewport.
  var section = document.getElementById('complianceSection');
  if (!section) return;
  var cards = section.querySelectorAll('.compliance-card');
  var dots = section.querySelectorAll('.compliance-dots__dot');

  // Initial state for fade-in (don't override position — CSS owns layout)
  cards.forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e, i) {
        if (e.isIntersecting) {
          // Stagger each card by 100ms
          var idx = Array.prototype.indexOf.call(cards, e.target);
          setTimeout(function() {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
          }, idx * 100);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    cards.forEach(function(card) { obs.observe(card); });
  } else {
    cards.forEach(function(card) {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  // Hide the cycling dots — meaningless in static grid
  dots.forEach(function(dot) { dot.style.display = 'none'; });
})();

(function initFaq() {
  const list = document.getElementById('faqList');
  if (!list) return;
  const items = list.querySelectorAll('.faq-item');

  items.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      // Close all
      items.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false');
      });
      // Open this one if it wasn't already open
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
