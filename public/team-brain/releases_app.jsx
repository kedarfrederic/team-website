// Main Releases app

const { useState, useEffect, useMemo } = React;

function Sidebar({ active, onNav }) {
  const workspaces = [
    { id: 'roc',     name: 'Roc Universa',   meta: 'Owner · 110 releases', icon: 'R', active: true },
    { id: 'go',      name: 'Go Records',     meta: 'Owner · 10 releases',  icon: 'G' },
    { id: 'mkt',     name: 'Marketing team', meta: 'Owner · 4 teams',      icon: 'M' },
    { id: 'mgmt',    name: 'Management',     meta: 'Owner · 6 artists',    icon: 'M' },
    { id: 'studio',  name: 'Studio',         meta: 'Member · 3 sessions',  icon: 'S' },
  ];
  const nav = [
    { id: 'command', label: 'Command Center', icon: <Icon.Tuning/>, count: null },
    { id: 'recents', label: 'Recents',        icon: <Icon.Pulse/>, active: true },
    { id: 'artists', label: 'Artists',        icon: <Icon.Artist/> },
    { id: 'press',   label: 'Press Runs',     icon: <Icon.Press/> },
    { id: 'touring', label: 'Touring',        icon: <Icon.Route/> },
  ];
  const releases = [
    { id: 'all',      label: 'All Releases',    icon: <Icon.Stack/>,    count: 110, active: true },
    { id: 'prog',     label: 'In Progress',     icon: <Icon.Progress/>, count: 50 },
    { id: 'shared',   label: 'Shared With Me',  icon: <Icon.Discs/>,    count: 3, pill: true },
    { id: 'released', label: 'Released',        icon: <Icon.Released/>, count: 48 },
    { id: 'archived', label: 'Archived',        icon: <Icon.Archive/>,  count: 12 },
  ];
  return (
    <aside className="sidebar">
      <div className="profile">
        <span className="avatar">SC</span>
        <div className="who"><strong>Sean Carter</strong><span>seantherealsc@gmail.com</span></div>
        <span className="caret"><Icon.Caret/></span>
      </div>

      <div className="ws-list">
        {workspaces.map(w => (
          <div key={w.id} className={`ws ${w.active ? 'active' : ''}`}>
            <span className="ws-icon">{w.icon}</span>
            <div className="ws-body">
              <span className="ws-name">{w.name}</span>
              <span className="ws-meta">{w.meta}</span>
            </div>
            {w.active && <span style={{color:'rgba(255,255,255,0.55)'}}><Icon.Caret size={12}/></span>}
          </div>
        ))}
      </div>

      <div className="ws-search">
        <Icon.Search size={13}/>
        <input placeholder="Search releases…"/>
      </div>

      <div className="nav-group">
        {nav.map(n => (
          <div key={n.id} className={`nav-item ${n.active ? 'active' : ''}`}>
            {n.icon}<span>{n.label}</span>
          </div>
        ))}
      </div>

      <div className="divider"/>

      <div className="nav-group">
        <div className="nav-label">Your releases</div>
        {releases.map(r => (
          <div key={r.id} className={`nav-item ${r.active ? 'active' : ''}`}>
            {r.icon}<span>{r.label}</span>
            {r.count != null && <span className={`count ${r.pill ? 'pill' : ''}`}>{r.count}</span>}
          </div>
        ))}
      </div>

      <div className="divider"/>

      <div className="nav-group">
        <div className="nav-label">Starred</div>
        <div className="nav-item">
          <Icon.Star/><span>Team Plan</span>
          <span className="count" style={{background:'rgba(151,117,250,0.15)',color:'#6b52b8',padding:'1px 7px',borderRadius:999,fontSize:10}}>Team</span>
        </div>
      </div>

      <div className="sidebar-foot">
        <div className="brand-mark"/>
        <span className="name">Team</span>
        <span className="tier">Pro</span>
      </div>
    </aside>
  );
}

function Topbar({ variant, setVariant, view, setView, theme, setTheme, accent, setAccent, tweaksOpen, setTweaksOpen }) {
  return (
    <>
      <div className="topbar">
        <div>
          <div className="breadcrumb" style={{marginBottom:6}}>Roc Universa · Releases</div>
          <h1 className="page-title">
            Releases <span className="t-ital">—</span> <span className="title-count">110</span>
          </h1>
        </div>
        <div className="topbar-right">
          <div className="variant-picker">
            <button className={variant === 'A' ? 'active' : ''} onClick={() => setVariant('A')}>A · Ledger</button>
            <button className={variant === 'B' ? 'active' : ''} onClick={() => setVariant('B')}>B · Board</button>
            <button className={variant === 'C' ? 'active' : ''} onClick={() => setVariant('C')}>C · Catalog</button>
          </div>
          <button className="iconbtn" title="Theme" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Icon.Moon/> : <Icon.Sun/>}
          </button>
          <button className="iconbtn" title="Help"><Icon.Help/></button>
          <button className="iconbtn" title="Tweaks" onClick={() => setTweaksOpen(t => !t)}><Icon.Sliders/></button>
          <button className="btn"><Icon.Plus/> Add Artist</button>
          <button className="btn primary"><Icon.Plus/> New Release</button>
        </div>
      </div>

      <div className="filterbar">
        <div className="tabs">
          <button className="tab active">All Releases <span className="n">110</span></button>
          <button className="tab">In Progress <span className="n">50</span></button>
          <button className="tab">Released <span className="n">48</span></button>
          <button className="tab">Archived <span className="n">12</span></button>
        </div>

        <div className="right">
          <button className="btn sm"><Icon.Filter/> Filter</button>
          <button className="btn sm"><Icon.Sliders/> Sort</button>
          <div className="viewswitch">
            <button className={view === 'A' ? 'active' : ''} title="Grid" onClick={() => setView('A')}><Icon.Grid/></button>
            <button className={view === 'B' ? 'active' : ''} title="Board" onClick={() => setView('B')}><Icon.Board/></button>
            <button className={view === 'C' ? 'active' : ''} title="List" onClick={() => setView('C')}><Icon.List/></button>
          </div>
        </div>
      </div>
    </>
  );
}

function TweaksPanel({ theme, setTheme, accent, setAccent, typography, setTypography, open, onClose }) {
  const accents = [
    { id: 'ember', color: '#E83E18', label: 'Ember' },
    { id: 'ink',   color: '#0E0E10', label: 'Ink' },
    { id: 'lime',  color: '#A8D84A', label: 'Lime' },
    { id: 'plum',  color: '#6b52b8', label: 'Plum' },
    { id: 'cobalt',color: '#2b48c4', label: 'Cobalt' },
  ];
  return (
    <div className={`tweaks-float ${open ? 'open' : ''}`}>
      <h4>Tweaks</h4>
      <div className="tweak-row">
        <label>Theme</label>
        <div className="seg">
          <button className={theme==='light'?'active':''} onClick={() => setTheme('light')}>Light</button>
          <button className={theme==='dark'?'active':''} onClick={() => setTheme('dark')}>Dark</button>
        </div>
      </div>
      <div className="tweak-row">
        <label>Accent</label>
        <div className="swatches">
          {accents.map(a => (
            <button key={a.id}
              className={accent===a.id?'active':''}
              style={{background:a.color}}
              onClick={() => setAccent(a.id)} title={a.label}/>
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <label>Typography</label>
        <div className="seg">
          <button className={typography==='team'?'active':''} onClick={() => setTypography('team')}>Team</button>
          <button className={typography==='editorial'?'active':''} onClick={() => setTypography('editorial')}>Editorial</button>
          <button className={typography==='mono'?'active':''} onClick={() => setTypography('mono')}>Mono</button>
        </div>
      </div>
    </div>
  );
}

const LS = {
  get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
};
function App() {
  const [variant, setVariant] = useState(() => LS.get('team.variant', 'A'));
  const [view, setView] = useState(() => LS.get('team.view', 'A'));
  const [theme, setTheme] = useState(() => LS.get('team.theme', 'light'));
  const [accent, setAccent] = useState(() => LS.get('team.accent', 'ember'));
  const [typography, setTypography] = useState(() => LS.get('team.typography', 'team'));
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [order, setOrder] = useState(RELEASES.map(r => r.id));
  const [draggingId, setDraggingId] = useState(null);

  // Persist
  useEffect(() => { LS.set('team.variant', variant); setView(variant); }, [variant]);
  useEffect(() => { LS.set('team.theme', theme); }, [theme]);
  useEffect(() => { LS.set('team.accent', accent); }, [accent]);
  useEffect(() => { LS.set('team.typography', typography); }, [typography]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-surface', theme);
  }, [theme]);

  // Apply accent
  useEffect(() => {
    const map = {
      ember:  { c: '#E83E18', soft: 'rgba(232,62,24,0.08)' },
      ink:    { c: '#0E0E10', soft: 'rgba(14,14,16,0.07)' },
      lime:   { c: '#7FA830', soft: 'rgba(168,216,74,0.16)' },
      plum:   { c: '#6b52b8', soft: 'rgba(107,82,184,0.10)' },
      cobalt: { c: '#2b48c4', soft: 'rgba(43,72,196,0.10)' },
    };
    const a = map[accent];
    document.documentElement.style.setProperty('--accent', a.c);
    document.documentElement.style.setProperty('--accent-soft', a.soft);
  }, [accent]);

  // Apply typography
  useEffect(() => {
    const root = document.documentElement;
    if (typography === 'editorial') {
      root.style.setProperty('--font-feature', "'Instrument Serif', Georgia, serif");
      root.style.setProperty('--font-sans', "'Inter', sans-serif");
    } else if (typography === 'mono') {
      root.style.setProperty('--font-feature', "'JetBrains Mono', monospace");
      root.style.setProperty('--font-sans', "'Inter', sans-serif");
    } else {
      root.style.setProperty('--font-feature', "'Special Gothic Expanded One', 'Montserrat', sans-serif");
      root.style.setProperty('--font-sans', "'Inter', sans-serif");
    }
  }, [typography]);

  // Edit-mode protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Drag reorder
  const onDragStart = (e, id) => { setDraggingId(id); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e) => { e.preventDefault(); };
  const onDrop = (e, overId) => {
    e.preventDefault();
    if (!draggingId || draggingId === overId) return;
    setOrder(prev => {
      const next = prev.filter(i => i !== draggingId);
      const idx = next.indexOf(overId);
      next.splice(idx, 0, draggingId);
      return next;
    });
    setDraggingId(null);
  };
  const onDragEnd = () => setDraggingId(null);

  const orderedReleases = useMemo(
    () => order.map(id => RELEASES.find(r => r.id === id)).filter(Boolean),
    [order]
  );

  return (
    <div className="app">
      <Sidebar/>
      <main className="main">
        <Topbar
          variant={variant} setVariant={setVariant}
          view={view} setView={setView}
          theme={theme} setTheme={setTheme}
          accent={accent} setAccent={setAccent}
          tweaksOpen={tweaksOpen} setTweaksOpen={setTweaksOpen}
        />

        <div className="content">
          {variant === 'A' && (
            <div className="grid-a">
              {orderedReleases.map(r => (
                <ReleaseCardA key={r.id}
                  r={r}
                  pinned={r.pinned}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                />
              ))}
            </div>
          )}

          {variant === 'B' && (
            <div className="board">
              {COLUMNS.map(col => {
                const items = orderedReleases.filter(r => {
                  if (col.id === 'setup') return r.status === 'scheduled' || (r.status === 'progress' && r.progress < 30) || r.status === 'hold';
                  if (col.id === 'rollout') return r.status === 'progress' && r.progress >= 30 && r.progress < 80;
                  if (col.id === 'release') return r.status === 'progress' && r.progress >= 80;
                  if (col.id === 'released') return r.status === 'released';
                  return false;
                });
                return (
                  <div key={col.id} className="column">
                    <div className="col-head">
                      <span className="badge" style={{background: col.badge}}/>
                      <span className="name">{col.name}</span>
                      <span className="cnt">{items.length}</span>
                    </div>
                    {items.map(r => (
                      <ReleaseCardB key={r.id} r={r}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onDragEnd={onDragEnd}
                      />
                    ))}
                    {items.length === 0 && (
                      <div style={{
                        fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.1em',
                        textTransform:'uppercase',color:'var(--fg-3)',
                        padding:'16px 10px',textAlign:'center',
                        border:'1px dashed var(--card-border)',borderRadius:10
                      }}>
                        Empty
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {variant === 'C' && (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{width:'32%'}}>Release</th>
                    <th>Status</th>
                    <th style={{width:'18%'}}>Progress</th>
                    <th>Tasks</th>
                    <th>Owner</th>
                    <th style={{width:'14%'}}>Release date</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedReleases.map(r => <ReleaseRowC key={r.id} r={r}/>)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <TweaksPanel
        theme={theme} setTheme={setTheme}
        accent={accent} setAccent={setAccent}
        typography={typography} setTypography={setTypography}
        open={tweaksOpen} onClose={() => setTweaksOpen(false)}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
