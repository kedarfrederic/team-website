(function(){
  // Only run on homepage
  if(window.location.pathname !== '/' && !window.location.pathname.endsWith('homepage.html')) return;
  // Only once per session
  if(sessionStorage.getItem('teamrun_dismissed')) return;

  const IDLE_MS = 120000;
  let idleTimer = null;
  const overlay = document.getElementById('teamrun-overlay');
  const frame = document.getElementById('teamrun-frame');
  const exitBtn = document.getElementById('teamrun-exit');
  // The Astro homepage no longer ships the teamrun idle game DOM. If any of
  // these elements is missing, bail silently instead of throwing
  // `null is not an object` and polluting the Studio iframe console.
  if (!overlay || !frame || !exitBtn) return;
  let gameActive = false;
  let dismissed = false;

  function resetTimer(){
    if(gameActive || dismissed) return;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(showGame, IDLE_MS);
  }

  function showGame(){
    if(gameActive) return;
    gameActive = true;
    frame.src = 'game/index.html';
    overlay.style.display = 'block';
    // Trigger fade in on next frame
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      overlay.style.opacity = '1';
    }); });
    setTimeout(function(){ frame.focus(); }, 1300);
  }

  function hideGame(){
    gameActive = false;
    dismissed = true;
    sessionStorage.setItem('teamrun_dismissed','1');
    overlay.style.opacity = '0';
    setTimeout(function(){
      overlay.style.display = 'none';
      frame.src = '';
    }, 1200);
  }

  exitBtn.addEventListener('click', hideGame);

  // Any interaction resets the idle timer
  ['mousemove','mousedown','keydown','scroll','touchstart','click'].forEach(function(evt){
    document.addEventListener(evt, resetTimer, {passive:true});
  });

  resetTimer();
})();
