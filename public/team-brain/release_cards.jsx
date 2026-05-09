// Release card components — used across all three variants.

const { useState } = React;

// Small progress ring SVG (used on variant A)
function ProgressRing({ pct, size = 42, stroke = 3 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="pring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="pring-track" cx={size/2} cy={size/2} r={r} strokeWidth={stroke}/>
        <circle className="pring-arc" cx={size/2} cy={size/2} r={r} strokeWidth={stroke}
                strokeDasharray={`${dash} ${c}`} />
      </svg>
      <div className="pct">{pct}%</div>
    </div>
  );
}

// ---------- VARIANT A: Editorial Ledger card ----------
function ReleaseCardA({ r, onDragStart, onDragOver, onDrop, onDragEnd, pinned }) {
  const statusClass = `status ${r.status}`;
  return (
    <div
      className={`rcard ${pinned ? 'pinned' : ''}`}
      draggable
      onDragStart={(e) => onDragStart?.(e, r.id)}
      onDragOver={(e) => onDragOver?.(e, r.id)}
      onDrop={(e) => onDrop?.(e, r.id)}
      onDragEnd={onDragEnd}
    >
      <div className="head">
        <span className={statusClass}>
          <span className="sdot"/>{r.statusLabel}
        </span>
        <span className="menu" title="Drag to reorder"><Icon.Drag/></span>
      </div>

      <div className="cover-strip">
        <div className="cover" aria-label={`${r.title} cover art`}>
          <Icon.WaxPlaceholder size={50}/>
        </div>
        <div className="title-block">
          <h3 className="release-title">{r.title}</h3>
          <div className="artist">{r.artist}</div>
          <div className="meta-row">
            <Icon.Calendar/> <span>{r.dateShort}</span>
            <span className="dot"/>
            <span>{r.relative}</span>
          </div>
        </div>
        <ProgressRing pct={r.progress}/>
      </div>

      <div className="tasks-row">
        <div className="tsum">
          <span className="n">{r.tasks.todo}</span>
          <span className="l">To do</span>
        </div>
        <div className="tsum">
          <span className="n">{r.tasks.done}</span>
          <span className="l">Done</span>
        </div>
        <div className="tsum">
          <span className={`n ${r.tasks.overdue > 0 ? 'late' : ''}`}>{r.tasks.overdue}</span>
          <span className="l">Overdue</span>
        </div>
      </div>

      <div className="foot">
        <div className="owner">
          <span className="mini-av" style={{ background: r.artistColor, color: '#fff' }}>
            {r.ownerInitials}
          </span>
          {r.owner}
        </div>
        <div className="date">
          <Icon.Calendar/> <strong>{r.date}</strong>
        </div>
      </div>

      {/* Hover preview */}
      <div className="preview">
        <div className="preview-inner">
          {r.late.length > 0 && (
            <div className="prev-block">
              <div className="prev-head late"><Icon.Overdue/> Overdue</div>
              {r.late.map((it, i) => (
                <div className="prev-item" key={i}>
                  <span className="t">{it.t}</span>
                  <span className="d">{it.d}</span>
                </div>
              ))}
            </div>
          )}
          {r.upcoming.length > 0 && (
            <div className="prev-block">
              <div className="prev-head up"><Icon.Upcoming/> Coming up</div>
              {r.upcoming.map((it, i) => (
                <div className="prev-item" key={i}>
                  <span className="t">{it.t}</span>
                  <span className="d">{it.d}</span>
                </div>
              ))}
            </div>
          )}
          {r.late.length === 0 && r.upcoming.length === 0 && (
            <div className="prev-block">
              <div className="prev-head up">Nothing scheduled</div>
              <div className="prev-item" style={{color:'var(--fg-3)',fontSize:12}}>
                <span className="t">Add the first task to start rollout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="progressbar"><div className="fill" style={{ width: `${r.progress}%` }}/></div>
    </div>
  );
}

// ---------- VARIANT B: Studio Board card ----------
function ReleaseCardB({ r, onDragStart, onDragOver, onDrop, onDragEnd }) {
  return (
    <div
      className="bcard"
      draggable
      onDragStart={(e) => onDragStart?.(e, r.id)}
      onDragOver={(e) => onDragOver?.(e, r.id)}
      onDrop={(e) => onDrop?.(e, r.id)}
      onDragEnd={onDragEnd}
    >
      <div className="bcard-head">
        <div className="bc-cover"><Icon.WaxPlaceholder size={30}/></div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="bc-title">{r.title}</div>
          <div className="bc-artist">{r.artist}</div>
        </div>
      </div>
      {(r.late.length > 0 || r.upcoming.length > 0) && (
        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {r.late.slice(0, 1).map((it, i) => (
            <div key={`l-${i}`} style={{ fontSize: 11.5, color: 'var(--ember-700)', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{it.t}</span>
              <span style={{fontFamily:'var(--font-mono)',fontSize:10,flex:'none'}}>{it.d}</span>
            </div>
          ))}
          {r.upcoming.slice(0, r.late.length > 0 ? 1 : 2).map((it, i) => (
            <div key={`u-${i}`} style={{ fontSize: 11.5, color: 'var(--fg-2)', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{it.t}</span>
              <span style={{fontFamily:'var(--font-mono)',fontSize:10,flex:'none'}}>{it.d}</span>
            </div>
          ))}
        </div>
      )}
      <div className="bcard-foot">
        <span className="mini-av" style={{ width: 18, height: 18, borderRadius: '50%', background: r.artistColor, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          {r.ownerInitials}
        </span>
        <span className="dbl">{r.dateShort}</span>
        <div className="bar"><div className="fill" style={{ width: `${r.progress}%` }}/></div>
        <span>{r.progress}%</span>
      </div>
    </div>
  );
}

// ---------- VARIANT C: Table row ----------
function ReleaseRowC({ r }) {
  return (
    <tr>
      <td>
        <div className="cell-release">
          <div className="mini-cover"><Icon.WaxPlaceholder size={28}/></div>
          <div>
            <div className="rel-title">{r.title}</div>
            <div className="rel-artist">{r.artist}</div>
          </div>
        </div>
      </td>
      <td>
        <span className={`status ${r.status}`}><span className="sdot"/>{r.statusLabel}</span>
      </td>
      <td>
        <div className="cell-progress">
          <div className="bar"><div className="fill" style={{ width: `${r.progress}%` }}/></div>
          <span className="pct">{r.progress}%</span>
        </div>
      </td>
      <td style={{fontFamily:'var(--font-mono)',fontSize:11.5,color:'var(--fg-2)',letterSpacing:'0.02em'}}>
        {r.tasks.done}<span style={{color:'var(--fg-3)'}}> / {r.tasks.total}</span>
        {r.tasks.overdue > 0 && (
          <span style={{marginLeft:8,color:'var(--ember-700)',fontSize:10.5}}>· {r.tasks.overdue} late</span>
        )}
      </td>
      <td>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'var(--fg-2)'}}>
          <span className="mini-av" style={{ width: 22, height: 22, borderRadius: '50%', background: r.artistColor, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9.5, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            {r.ownerInitials}
          </span>
          {r.owner}
        </div>
      </td>
      <td className="cell-date">
        {r.date}
        <span className="rel">{r.relative}</span>
      </td>
    </tr>
  );
}

Object.assign(window, { ReleaseCardA, ReleaseCardB, ReleaseRowC, ProgressRing });
