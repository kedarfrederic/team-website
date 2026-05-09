/**
 * Team Brain — top bar chrome (search, stat pills, close).
 */

import type { FC, CSSProperties } from "react";
import { T } from "./types";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  stats: { entityCount: number; relationshipCount: number; memoryCount: number };
  onClose: () => void;
}

const TeamBrainStageChrome: FC<Props> = ({ search, onSearchChange, stats, onClose }) => (
  <div style={S.topbar}>
    <div style={S.searchBox}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
      </svg>
      <input style={S.searchInput} placeholder="Search entities\u2026" value={search} onChange={(e) => onSearchChange(e.target.value)} />
    </div>
    <div style={S.countPill}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg>
      <span>Entities</span>
      <span style={S.countNum}>{stats.entityCount.toLocaleString()}</span>
    </div>
    <div style={S.countPill}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
      <span>Relations</span>
      <span style={S.countNum}>{stats.relationshipCount.toLocaleString()}</span>
    </div>
    <div style={S.countPillActive}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 2v4M16 2v4M2 8h4M2 16h4" /></svg>
      <span>Memories</span>
      <span style={S.countNumActive}>{stats.memoryCount.toLocaleString()}</span>
    </div>
    <div style={{ flex: 1 }} />
    <button style={S.closeBtn} onClick={onClose}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      Close
    </button>
  </div>
);

export default TeamBrainStageChrome;

// ── Styles ──────────────────────────────────────────────────

const S = {
  topbar: { display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", zIndex: 20, position: "relative" as const } as CSSProperties,
  searchBox: { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.borderHair}`, borderRadius: T.radiusPill, padding: "8px 14px 8px 12px", width: 240, fontSize: 13, color: T.fg2 } as CSSProperties,
  searchInput: { flex: 1, background: "transparent", border: 0, outline: "none", color: T.fg1, fontFamily: T.fontSans, fontSize: 13 } as CSSProperties,
  countPill: { display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.borderHair}`, borderRadius: T.radiusPill, fontSize: 12, color: T.fg1, cursor: "default" } as CSSProperties,
  countNum: { fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, color: T.fg2 } as CSSProperties,
  countPillActive: { display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", background: "rgba(192,236,95,0.08)", border: "1px solid rgba(192,236,95,0.25)", borderRadius: T.radiusPill, fontSize: 12, color: T.fg1, cursor: "default" } as CSSProperties,
  countNumActive: { fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, color: T.lime500 } as CSSProperties,
  closeBtn: { display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", background: "transparent", border: `1px solid ${T.borderHair}`, borderRadius: T.radiusPill, color: T.fg2, fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, cursor: "pointer" } as CSSProperties,
};
