// Main app — 3D memory graph (SVG-projected), chrome, and interactions.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Narrative content that animates in when nodes are focused ----------
const HUB_STORIES = [
  {
    cat: 'campaign',
    title: ['Rollout — ', { ital: 'Midnight Cut' }, ' LP'],
    meta: 'Campaign · 14 weeks · 48 entities',
    reason: [
      'teammate clustered this rollout with ',
      { ital: 'two prior campaigns' },
      ' in your catalog that performed best at this streaming tier. Same tactic stack, slightly earlier editorial push.',
    ],
    cross: [
      { tag: 'Prior', text: 'Same mix engineer → faster Spotify add on 2 of 3 prior releases.' },
      { tag: 'Cross',  text: 'College radio contact cluster overlaps with the Oct EP rollout — 82% hit rate there.' },
      { tag: 'Signal', text: 'Week-1 save-rate pacing at 1.3× the comp set. teammate flagged it for the status thread.' },
    ],
  },
  {
    cat: 'decisions',
    title: ['Pull ', { ital: 'Track 4' }, ' as single 2'],
    meta: 'Decision · 11 observations behind it · committed Thu',
    reason: [
      'teammate weighed 11 observations from Discord, two A&R calls, and a Shazam pre-save spike. The model shows ',
      { ital: 'Track 4' },
      ' correlates with the fan-segment that converted best on the last two rollouts.',
    ],
    cross: [
      { tag: 'Memory', text: 'Matches the pattern from your Feb rollout — fan-first track, not the radio track.' },
      { tag: 'Ref',    text: 'Manager approved in the thread. See conversation → "so S2 is 4 — locked".' },
    ],
  },
  {
    cat: 'workflows',
    title: ['Pre-save ', { ital: 'waterfall' }, ' — live'],
    meta: 'Workflow · 7 steps · 4 automated',
    reason: [
      'Started 21 days pre-release, staggered by DSP. teammate auto-fills assets from the campaign brief and ',
      { ital: 'asks only when something changed' },
      '.',
    ],
    cross: [
      { tag: 'Reuse', text: 'Template from Midnight Cut — edited once, now a permanent team preset.' },
      { tag: 'Watch', text: 'TikTok artwork variant is flagged — aspect ratio differs from last rollout.' },
    ],
  },
  {
    cat: 'observations',
    title: ['Spotify add — ', { ital: 'New Music Friday' }],
    meta: 'Observation · confirmed 11:02 ET',
    reason: [
      'Spotify editorial contact confirmed placement. teammate cross-checked against your ',
      { ital: 'goal sheet' },
      ' — this is the editorial target you set in the campaign brief.',
    ],
    cross: [
      { tag: 'Memory', text: 'You\'ve hit NMF 4 of the last 6 releases — the pitch cadence in weeks -6 / -3 is the driver.' },
      { tag: 'Next',   text: 'teammate drafted a short thank-you to the editor. Awaiting your ok.' },
    ],
  },
];

// ---------- Small icons ----------
const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const IconClose = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);
const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);
const IconPause = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
);
const IconRotate = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>
  </svg>
);
const IconSliders = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    <circle cx="8" cy="6" r="2" fill="var(--ink-900)"/><circle cx="15" cy="12" r="2" fill="var(--ink-900)"/><circle cx="10" cy="18" r="2" fill="var(--ink-900)"/>
  </svg>
);
const IconMemory = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4M16 2v4M2 8h4M2 16h4"/>
  </svg>
);
const IconEntity = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconLink = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/>
    <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>
  </svg>
);

// ---------- Main ----------
function App() {
  const graph = useMemo(() => buildGraph(), []);
  const stageRef = useRef(null);
  const [size, setSize] = useState({ w: 1000, h: 700 });
  const [yaw, setYaw] = useState(-0.6);
  const [pitch, setPitch] = useState(0.12);
  const [zoom, setZoom] = useState(1);
  const [rotating, setRotating] = useState(true);
  const [playing, setPlaying] = useState(true); // memory-ingestion pulses
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null); // id of hub node whose story is shown
  const [filter, setFilter] = useState('all'); // category or 'all'
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [density, setDensity] = useState(1);      // 0.4 .. 1.3
  const [showLines, setShowLines] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [ticker, setTicker] = useState([]);        // memory ingestion feed
  const [showStroryStep, setStoryStep] = useState(0);
  const [search, setSearch] = useState('');

  // Tweakable defaults block — scanned + rewritten by the host on save
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
    "rotationSpeed": 0.8,
    "layout": "sphere",
    "showLines": true,
    "density": 1
  } /*EDITMODE-END*/;
  const [rotSpeed, setRotSpeed] = useState(TWEAK_DEFAULTS.rotationSpeed);
  const [layout, setLayout] = useState(TWEAK_DEFAULTS.layout);

  // ---------- Resize ----------
  useEffect(() => {
    const handle = () => {
      if (!stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  // ---------- Auto-rotate ----------
  useEffect(() => {
    if (!rotating) return;
    let raf, last = performance.now();
    const tick = (t) => {
      const dt = (t - last) / 1000; last = t;
      setYaw(y => y + dt * 0.25 * rotSpeed);
      setPitch(p => p + Math.sin(t / 6200) * 0.0004 * rotSpeed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotating, rotSpeed]);

  // ---------- Drag to spin ----------
  const dragState = useRef({ active: false, x: 0, y: 0 });
  const onPointerDown = (e) => {
    dragState.current = { active: true, x: e.clientX, y: e.clientY };
    setRotating(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.currentTarget.classList.add('dragging');
  };
  const onPointerMove = (e) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.x;
    const dy = e.clientY - dragState.current.y;
    dragState.current.x = e.clientX;
    dragState.current.y = e.clientY;
    setYaw(y => y + dx * 0.006);
    setPitch(p => Math.max(-1.2, Math.min(1.2, p + dy * 0.005)));
  };
  const onPointerUp = (e) => {
    dragState.current.active = false;
    e.currentTarget.classList.remove('dragging');
  };
  const onWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.max(0.55, Math.min(2.2, z - e.deltaY * 0.0012)));
  };

  // ---------- Memory ingestion ticker ----------
  useEffect(() => {
    if (!playing) return;
    const sources = [
      { cat: 'observations',  text: 'Stream spike — TikTok sound',  dim: '14s ago' },
      { cat: 'conversations', text: 'Manager text — "pitch is in"', dim: '22s ago' },
      { cat: 'task',          text: 'Artwork v3 approved',          dim: '38s ago' },
      { cat: 'observations',  text: 'Spotify editorial confirmed',  dim: '1m ago' },
      { cat: 'decisions',     text: 'Track 4 locked as Single 2',   dim: '3m ago' },
      { cat: 'tactic',        text: 'College radio push scheduled', dim: '5m ago' },
      { cat: 'observations',  text: 'Shazam pre-save +18%',         dim: '7m ago' },
      { cat: 'workflows',     text: 'Waterfall step 3 auto-ran',    dim: '9m ago' },
    ];
    let i = Math.floor(Math.random() * sources.length);
    const push = () => {
      setTicker(prev => [sources[i % sources.length], ...prev].slice(0, 3));
      i++;
    };
    push();
    const iv = setInterval(push, 2600);
    return () => clearInterval(iv);
  }, [playing]);

  // ---------- Rotate/project nodes for current frame ----------
  const projected = useMemo(() => {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const cx = size.w / 2, cyy = size.h / 2;
    const perspective = 900;
    const scale = Math.min(size.w, size.h) * 0.9 * zoom / 700;

    return graph.nodes.map(n => {
      // apply density scale around origin
      const x0 = n.x * density, y0 = n.y * density, z0 = n.z * density;
      // yaw around Y
      const x1 = x0 * cy + z0 * sy;
      const z1 = -x0 * sy + z0 * cy;
      // pitch around X
      const y2 = y0 * cp - z1 * sp;
      const z2 = y0 * sp + z1 * cp;
      // perspective project
      const depthFactor = perspective / (perspective + z2);
      const sx = cx + x1 * scale * depthFactor;
      const sy2 = cyy + y2 * scale * depthFactor;
      // front→back = higher z = farther (we've rotated so +z is away)
      const depth = z2; // for sorting and fading
      return { ...n, sx, sy: sy2, depth, depthFactor };
    });
  }, [graph, yaw, pitch, zoom, density, size.w, size.h]);

  const nodeById = useMemo(() => {
    const m = new Map();
    projected.forEach(n => m.set(n.id, n));
    return m;
  }, [projected]);

  // ---------- Filter & search dimming ----------
  const q = search.trim().toLowerCase();
  const isDim = (n) => {
    if (filter !== 'all' && n.cat !== filter) return true;
    if (q && !n.cat.includes(q)) return true;
    return false;
  };

  // ---------- Sort nodes back-to-front ----------
  const sortedNodes = useMemo(
    () => [...projected].sort((a, b) => b.depth - a.depth),
    [projected]
  );

  // Depth range for fade
  const [dMin, dMax] = useMemo(() => {
    let mn = Infinity, mx = -Infinity;
    projected.forEach(n => { if (n.depth < mn) mn = n.depth; if (n.depth > mx) mx = n.depth; });
    return [mn, mx];
  }, [projected]);
  const fadeForDepth = (d) => {
    const t = (d - dMin) / (dMax - dMin + 1e-6);
    // front bright, back dim
    return 1 - t * 0.75;
  };

  // ---------- Focused story (click a hub) ----------
  const focusedNode = focused != null ? nodeById.get(focused) : null;
  const focusedStory = focusedNode ? HUB_STORIES.find(s => s.cat === focusedNode.cat) || HUB_STORIES[0] : null;

  // Auto-cycle a showcase story every so often so the page feels alive
  useEffect(() => {
    if (focused != null || !playing) return;
    const hubs = graph.nodes.filter(n => n.hub);
    let i = 0;
    const pick = () => {
      setStoryStep(s => s + 1);
    };
    const iv = setInterval(pick, 5200);
    return () => clearInterval(iv);
  }, [focused, playing, graph]);

  const autoStoryCat = HUB_STORIES[showStroryStep % HUB_STORIES.length].cat;
  const autoStoryHub = useMemo(() => {
    return graph.nodes.find(n => n.hub && n.cat === autoStoryCat)
        || graph.nodes.find(n => n.hub);
  }, [autoStoryCat, graph]);
  const activeStory = focusedStory || HUB_STORIES[showStroryStep % HUB_STORIES.length];
  const activeHubId = focused != null ? focused : autoStoryHub?.id;
  const activeHubProjected = activeHubId != null ? nodeById.get(activeHubId) : null;

  // ---------- Which edges to render ----------
  // Too many edges kill perf/clarity. Render all hub-hub edges, plus edges
  // touching the active hub + a thinned sample of the rest.
  const visibleEdges = useMemo(() => {
    const out = [];
    graph.edges.forEach((e, idx) => {
      const isActive = e.a === activeHubId || e.b === activeHubId;
      if (e.strong || isActive || idx % 3 === 0) {
        out.push({ ...e, active: isActive });
      }
    });
    return out;
  }, [graph.edges, activeHubId]);

  // ---------- Edit-mode protocol ----------
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const persist = (edits) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  };

  // ---------- Label position for tooltip ----------
  const hoveredNode = hovered != null ? nodeById.get(hovered) : null;

  // ---------- Render ----------
  return (
    <div className="shell">
      {/* Top bar */}
      <div className="topbar">
        <div className="search">
          <IconSearch/>
          <input
            placeholder="Search entities…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="count-pill"><IconEntity/><span>Entities</span><span className="num">1,284</span></div>
        <div className="count-pill"><IconLink/><span>Relations</span><span className="num">251</span></div>
        <div className="count-pill active"><IconMemory/><span>Memories</span><span className="num">2,884</span></div>

        <div className="spacer"/>
        <button className="close-btn" onClick={() => {}}><IconClose/> Close</button>
      </div>

      {/* Stage */}
      <div
        className="stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        {/* Intro card */}
        {showIntro && (
          <div className="intro-card">
            <div className="eyebrow">※ Team memory graph</div>
            <h1>Every rollout builds a <span className="ital">brain</span>.</h1>
            <p>Each contact, task, observation, and decision becomes a memory. teammate cross-references them to derive strategy, catch regressions, and flag what's next.</p>
            <div className="hints">
              <span className="hint">Drag to spin</span>
              <span className="hint"><kbd>scroll</kbd> zoom</span>
              <span className="hint">Click a hub</span>
            </div>
          </div>
        )}

        {/* Stage controls */}
        <div className="stage-controls">
          <button className={`control-btn ${rotating ? 'on' : ''}`} title="Auto-rotate"
                  onClick={() => setRotating(r => !r)}>
            <IconRotate/>
          </button>
          <button className={`control-btn play-btn ${playing ? 'on' : ''}`} title="Live ingestion"
                  onClick={() => setPlaying(p => !p)}>
            {playing ? <IconPause/> : <IconPlay/>}
          </button>
          <button className={`control-btn ${tweaksOpen ? 'on' : ''}`} title="Tweaks"
                  onClick={() => setTweaksOpen(t => !t)}>
            <IconSliders/>
          </button>
        </div>

        {/* SVG graph */}
        <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#fff" stopOpacity="0.85"/>
              <stop offset="70%" stopColor="#fff" stopOpacity="0"/>
            </radialGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {showLines && visibleEdges.map((e, i) => {
            const a = nodeById.get(e.a), b = nodeById.get(e.b);
            if (!a || !b) return null;
            const adim = isDim(a), bdim = isDim(b);
            const anyDim = adim || bdim;
            const avgDepth = (a.depth + b.depth) / 2;
            const fade = fadeForDepth(avgDepth);

            let stroke, opacity, width;
            if (e.active) {
              stroke = 'var(--lime-500)';
              opacity = 0.55 * fade;
              width = 1.1;
            } else if (e.strong) {
              stroke = '#ffffff';
              opacity = 0.22 * fade * (anyDim ? 0.25 : 1);
              width = 0.9;
            } else {
              stroke = '#ffffff';
              opacity = 0.07 * fade * (anyDim ? 0.2 : 1);
              width = 0.6;
            }
            return (
              <line
                key={i}
                x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy}
                stroke={stroke} strokeOpacity={opacity} strokeWidth={width}
              />
            );
          })}

          {/* Animated energy pulse along active hub's edges */}
          {activeHubProjected && showLines && visibleEdges
            .filter(e => e.active)
            .slice(0, 18)
            .map((e, i) => {
              const a = nodeById.get(e.a), b = nodeById.get(e.b);
              if (!a || !b) return null;
              const other = a.id === activeHubId ? b : a;
              return (
                <circle key={`p-${i}`} r="1.8" fill="var(--lime-500)">
                  <animate
                    attributeName="cx"
                    dur={`${2 + (i % 4) * 0.4}s`}
                    repeatCount="indefinite"
                    values={`${activeHubProjected.sx};${other.sx}`}
                    begin={`${(i * 0.11) % 1.5}s`}
                  />
                  <animate
                    attributeName="cy"
                    dur={`${2 + (i % 4) * 0.4}s`}
                    repeatCount="indefinite"
                    values={`${activeHubProjected.sy};${other.sy}`}
                    begin={`${(i * 0.11) % 1.5}s`}
                  />
                  <animate
                    attributeName="opacity"
                    dur={`${2 + (i % 4) * 0.4}s`}
                    repeatCount="indefinite"
                    values="0;1;0"
                    begin={`${(i * 0.11) % 1.5}s`}
                  />
                </circle>
              );
            })}

          {/* Nodes, back-to-front */}
          {sortedNodes.map(n => {
            const cat = CATEGORIES[n.cat];
            const dim = isDim(n);
            const fade = fadeForDepth(n.depth);
            const r = Math.max(1.2, 3.5 * n.r * n.depthFactor);
            const isHoveredN = hovered === n.id;
            const isActiveN  = activeHubId === n.id;
            const baseOpacity = (dim ? 0.12 : 1) * fade;

            return (
              <g key={n.id} style={{ cursor: n.hub ? 'pointer' : 'default' }}>
                {/* outer glow for hubs */}
                {n.hub && !dim && (
                  <circle cx={n.sx} cy={n.sy} r={r * 3}
                          fill={cat.color} opacity={0.12 * fade}/>
                )}
                {/* pulse ring on active hub */}
                {isActiveN && (
                  <circle cx={n.sx} cy={n.sy} r={r * 1.4}
                          fill="none"
                          stroke="var(--lime-500)"
                          strokeWidth="1"
                          className="hub-pulse"
                          opacity="0.7"/>
                )}
                <circle
                  cx={n.sx} cy={n.sy}
                  r={isHoveredN ? r * 1.4 : r}
                  fill={cat.color}
                  opacity={baseOpacity}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(h => h === n.id ? null : h)}
                  onClick={() => { if (n.hub) setFocused(n.id); }}
                  style={{ pointerEvents: 'auto', transition: 'r 120ms var(--ease-out)' }}
                />
                {/* Highlight ring for active hub */}
                {isActiveN && (
                  <circle cx={n.sx} cy={n.sy} r={r * 1.15}
                          fill="none" stroke="#fff" strokeWidth="1.2"
                          opacity={0.9 * fade}/>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredNode && (
          <div className="node-label"
               style={{ left: hoveredNode.sx, top: hoveredNode.sy }}>
            <span className="cat-dot" style={{ background: CATEGORIES[hoveredNode.cat].color }}/>
            <span>{hoveredNode.cat}</span>
            {hoveredNode.hub && <span className="nl-cat">· hub</span>}
          </div>
        )}

        {/* Ticker */}
        <div className="ticker">
          {ticker.map((t, i) => (
            <div key={`${t.text}-${i}`} className="ticker-item" style={{ opacity: 1 - i * 0.28 }}>
              <span className="cat-dot" style={{ background: CATEGORIES[t.cat].color }}/>
              <span>{t.text}</span>
              <span className="tick-dim">· {t.dim}</span>
            </div>
          ))}
        </div>

        {/* Insight panel */}
        <div className={`insight-panel ${activeStory ? 'visible' : ''}`}>
          {activeStory && (
            <>
              <div className="label-row">
                <span className="cat-dot" style={{ background: CATEGORIES[activeStory.cat].color }}/>
                <span className="cat-label">{activeStory.cat} · intelligence</span>
              </div>
              <h3>{activeStory.title.map((p, i) => typeof p === 'string' ? p : <span className="ital" key={i}>{p.ital}</span>)}</h3>
              <div className="meta">{activeStory.meta}</div>

              <div className="section">
                <div className="sec-label">※ teammate's reasoning</div>
                <div className="reason">
                  {activeStory.reason.map((p, i) => typeof p === 'string' ? p : <span className="ital" key={i}>{p.ital}</span>)}
                </div>
              </div>

              <div className="section">
                <div className="sec-label">Cross-release references</div>
                {activeStory.cross.map((c, i) => (
                  <div className="cross-item" key={i}>
                    <span className="tag">{c.tag}</span>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>

              {focused != null && (
                <div className="section" style={{display:'flex',justifyContent:'flex-end'}}>
                  <button className="close-btn" onClick={() => setFocused(null)}>
                    <IconClose/> Unpin
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Brand corner */}
        <div className="brand">
          <img src="assets/team-logomark.png" alt=""/>
          <span className="sep"/>
          <span className="crumb">Memory graph · Midnight Cut LP</span>
        </div>

        {/* Tweaks */}
        <div className={`tweaks ${tweaksOpen ? 'open' : ''}`}>
          <div className="tweaks-label">※ Tweaks</div>
          <div className="tweak-row">
            <label>Rotation</label>
            <div className="seg">
              {[0, 0.4, 0.8, 1.4].map(s => (
                <button key={s}
                        className={rotSpeed === s ? 'active' : ''}
                        onClick={() => { setRotSpeed(s); persist({ rotationSpeed: s }); setRotating(s > 0); }}>
                  {s === 0 ? 'off' : s === 0.4 ? 'slow' : s === 0.8 ? 'med' : 'fast'}
                </button>
              ))}
            </div>
          </div>
          <div className="tweak-row">
            <label>Density</label>
            <input type="range" min="0.6" max="1.3" step="0.05"
                   value={density} onChange={e => setDensity(parseFloat(e.target.value))}/>
          </div>
          <div className="tweak-row">
            <label>Lines</label>
            <div className="seg">
              <button className={showLines ? 'active' : ''} onClick={() => { setShowLines(true); persist({ showLines: true }); }}>on</button>
              <button className={!showLines ? 'active' : ''} onClick={() => { setShowLines(false); persist({ showLines: false }); }}>off</button>
            </div>
          </div>
          <div className="tweak-row">
            <label>Intro card</label>
            <div className="seg">
              <button className={showIntro ? 'active' : ''} onClick={() => setShowIntro(true)}>on</button>
              <button className={!showIntro ? 'active' : ''} onClick={() => setShowIntro(false)}>off</button>
            </div>
          </div>
          <div className="tweak-row">
            <label>Zoom</label>
            <input type="range" min="0.6" max="2" step="0.05"
                   value={zoom} onChange={e => setZoom(parseFloat(e.target.value))}/>
          </div>
        </div>
      </div>

      {/* Legend / filter */}
      <div className="legend">
        <button
          className={`legend-chip all ${filter === 'all' ? '' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span>▼ All</span>
        </button>
        {Object.entries(CATEGORIES).map(([key, c]) => {
          const isOn = filter === 'all' || filter === key;
          const isSel = filter === key;
          return (
            <button
              key={key}
              className={`legend-chip ${isSel ? 'active' : ''} ${!isOn ? 'muted' : ''}`}
              onClick={() => setFilter(f => f === key ? 'all' : key)}
            >
              <span className="dot" style={{ background: c.color }}/>
              <span>{c.label}</span>
              <span className="num">({c.count.toLocaleString()})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
