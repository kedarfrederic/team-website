// Team — custom iconography
// House style: 1.6px strokes, hand-drawn corner radii, editorial + mechanical.
// All icons 24x24 viewBox. Signature touches: notched corners, a small "tick"
// on geometric icons (signature angle of 62°), hand-dotted terminals.

const mk = (path, opts = {}) => {
  const { size = 16, fill = 'none', stroke = 'currentColor', sw = 1.6 } = opts;
  return (...args) => React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill, stroke, strokeWidth: sw,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    dangerouslySetInnerHTML: { __html: path }
  });
};

// Sidebar + nav icons (custom geometric style — not Lucide)
const Icon = {
  // Tuning fork (Command Center) — vertical forks with a diamond base
  Tuning: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4v7a3 3 0 0 0 6 0V4"/>
      <path d="M12 14v5"/>
      <path d="m10 19 2 2 2-2"/>
    </svg>
  ),
  // Clock with tick — Recents (custom: offset hour hand + top notch)
  Pulse: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <path d="M12 7v5l3 2"/>
      <path d="M12 2v2"/>
    </svg>
  ),
  // Artist — star-burst profile mark (not a generic person icon)
  Artist: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2"/>
      <path d="M5 20c1.4-3.8 4-5.8 7-5.8s5.6 2 7 5.8"/>
      <path d="M19 4l.8 1.8L21.5 6l-1.7 1-.8 1.7-.8-1.7L16.5 6l1.7-.2z" fill="currentColor" stroke="none"/>
    </svg>
  ),
  // Press — folded newsprint
  Press: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h12v14H6a2 2 0 0 1-2-2V5z"/>
      <path d="M16 9h4v8a2 2 0 0 1-2 2"/>
      <path d="M7 9h6M7 12h6M7 15h4"/>
    </svg>
  ),
  // Touring — route pin with ground line
  Route: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c-3 0-5 2.2-5 5 0 3.5 5 9 5 9s5-5.5 5-9c0-2.8-2-5-5-5z"/>
      <circle cx="12" cy="8" r="1.6"/>
      <path d="M5 20h14"/>
    </svg>
  ),
  // Folder (All Releases) — notched, editorial
  Stack: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h7l2 2h9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
    </svg>
  ),
  // In Progress — concentric arcs
  Progress: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <path d="M12 4a8 8 0 0 1 0 16" stroke="currentColor" strokeWidth="3" fill="none"/>
    </svg>
  ),
  // Shared With Me — overlapping discs
  Discs: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="5"/>
      <circle cx="15" cy="12" r="5"/>
    </svg>
  ),
  // Released — checkmark in vinyl
  Released: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <path d="m8 12 3 3 5-6"/>
    </svg>
  ),
  // Archived — tray
  Archive: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="4" rx="1"/>
      <path d="M5 9v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/>
      <path d="M10 13h4"/>
    </svg>
  ),
  // Starred
  Star: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.5l6.1-.9z"/>
    </svg>
  ),
  // Search
  Search: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5"/>
      <path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  // Plus
  Plus: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  // Help — fork pattern (not standard "?")
  Help: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1 1.2-1 2"/>
      <path d="M12 16.5v.01"/>
    </svg>
  ),
  // Moon/Sun (theme)
  Moon: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11z"/>
    </svg>
  ),
  Sun: ({size=15}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.5"/>
      <path d="M12 3v2M12 19v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M3 12h2M19 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/>
    </svg>
  ),
  // Chevron Down
  Caret: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  // Dots / menu — vertical
  Dots: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>
    </svg>
  ),
  // Calendar — block with tear tabs
  Calendar: ({size=12}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2"/>
      <path d="M3.5 10h17"/>
      <path d="M8 3v4M16 3v4"/>
    </svg>
  ),
  // Person (small)
  Person: ({size=12}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2"/>
      <path d="M5 20c1.4-3.8 4-5.8 7-5.8s5.6 2 7 5.8"/>
    </svg>
  ),
  // Views
  Grid: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1.2"/>
      <rect x="13" y="4" width="7" height="7" rx="1.2"/>
      <rect x="4" y="13" width="7" height="7" rx="1.2"/>
      <rect x="13" y="13" width="7" height="7" rx="1.2"/>
    </svg>
  ),
  Board: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="5" height="16" rx="1.2"/>
      <rect x="10" y="4" width="5" height="10" rx="1.2"/>
      <rect x="16" y="4" width="4" height="13" rx="1.2"/>
    </svg>
  ),
  List: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16"/>
      <circle cx="4" cy="6" r="0.6" fill="currentColor"/>
      <circle cx="4" cy="12" r="0.6" fill="currentColor"/>
      <circle cx="4" cy="18" r="0.6" fill="currentColor"/>
    </svg>
  ),
  Sliders: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h6M14 6h6M4 12h10M18 12h2M4 18h3M11 18h9"/>
      <circle cx="12" cy="6" r="1.6" fill="var(--card-bg)"/>
      <circle cx="16" cy="12" r="1.6" fill="var(--card-bg)"/>
      <circle cx="9" cy="18" r="1.6" fill="var(--card-bg)"/>
    </svg>
  ),
  Filter: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16l-6 8v5l-4 2v-7z"/>
    </svg>
  ),
  // Release placeholder: wax-disc stripes (Team's signature — matches the barcode in the screenshot but bespoke)
  WaxPlaceholder: ({size=36}) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="4" fill="transparent"/>
      <g stroke="currentColor" strokeWidth="1.1" opacity="0.5">
        <line x1="11" y1="8" x2="11" y2="28"/>
        <line x1="13" y1="10" x2="13" y2="26"/>
        <line x1="15" y1="8" x2="15" y2="28"/>
        <line x1="17" y1="11" x2="17" y2="25"/>
        <line x1="19" y1="9" x2="19" y2="27"/>
        <line x1="21" y1="10" x2="21" y2="26"/>
        <line x1="23" y1="8" x2="23" y2="28"/>
        <line x1="25" y1="11" x2="25" y2="25"/>
      </g>
    </svg>
  ),
  // Drag handle (custom: double-track groove)
  Drag: ({size=14}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/>
      <circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/>
      <circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/>
    </svg>
  ),
  // Overdue — squared warning
  Overdue: ({size=12}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(45 12 12)"/>
      <path d="M12 9v4M12 15.5v.01"/>
    </svg>
  ),
  // Upcoming — angle
  Upcoming: ({size=12}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h12"/>
      <path d="m13 6 6 6-6 6"/>
    </svg>
  ),
};

window.Icon = Icon;
