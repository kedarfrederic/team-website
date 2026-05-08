(function() {
  var nav = document.getElementById('nav');
  var hero = document.getElementById('heroSection');
  var heroInner = hero ? hero.querySelector('.icp-hero__inner') : null;
  if (!hero) return;
  function check() {
    var heroBottom = hero.getBoundingClientRect().bottom;
    var heroH = hero.offsetHeight;
    var scrolled = window.scrollY;
    if (heroBottom < 60) document.getElementById('nav')?.classList.add('nav--solid');
    else document.getElementById('nav')?.classList.remove('nav--solid');
    if (heroInner) {
      var progress = Math.min(1, scrolled / (heroH * 0.5));
      heroInner.style.opacity = 1 - progress;
      heroInner.style.transform = 'translateY(' + (progress * 40) + 'px)';
    }
  }
  window.addEventListener('scroll', check, { passive: true });
  check();

  // Value cards scroll reveal
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.value-card').forEach(function(c) { obs.observe(c); });
  }
})();
