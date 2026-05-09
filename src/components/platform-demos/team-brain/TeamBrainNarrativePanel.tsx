/**
 * Team Brain — narrative insight panel (right side).
 *
 * Displays the active story with category dot, italic title,
 * meta line, reasoning section, and cross-references.
 */

import type { FC } from "react";
import type { CSSProperties } from "react";
import type { NarrativeStory, ItalSegment } from "./types";
import { T, catDot, CATEGORIES } from "./types";

// ── Inline SVG close icon ───────────────────────────────────

const IconClose: FC = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// ── Italic-mixed text renderer ──────────────────────────────

function renderMixed(parts: ItalSegment[]): React.ReactNode[] {
  return parts.map((p, i) =>
    typeof p === "string" ? (
      <span key={i}>{p}</span>
    ) : (
      <span key={i} style={S.ital}>{p.ital}</span>
    ),
  );
}

// ── Props ───────────────────────────────────────────────────

interface ChainData {
  headline: string;
  terminalRisk: string;
  recommendedAction: string;
  confidence: number;
  crossRelease: boolean;
}

interface Props {
  narrative: NarrativeStory | null;
  visible: boolean;
  pinned: boolean;
  onUnpin: () => void;
  chain?: ChainData | null;
}

// ── Component ───────────────────────────────────────────────

const TeamBrainNarrativePanel: FC<Props> = ({
  narrative,
  visible,
  pinned,
  onUnpin,
  chain,
}) => (
  <div style={visible && narrative ? S.panelVisible : S.panelHidden}>
    {narrative && (
      <>
        <div style={S.labelRow}>
          <span style={catDot(CATEGORIES[narrative.cat]?.color || "#888")} />
          <span style={S.catLabel}>{narrative.cat} · intelligence</span>
        </div>
        <h3 style={S.h3}>{renderMixed(narrative.title)}</h3>
        <div style={S.meta}>{narrative.meta}</div>

        {/* Reasoning chain — the multi-hop story */}
        {chain && (
          <div style={S.section}>
            <div style={S.secLabel}>※ dependency chain</div>
            <div style={S.reason}>{chain.headline}</div>
            {chain.terminalRisk && (
              <div style={{ ...S.crossItem, borderBottom: "none" }}>
                <span style={{ ...S.crossTag, color: "#E83E18", borderColor: "rgba(232,62,24,0.3)" }}>Risk</span>
                <span>{chain.terminalRisk}</span>
              </div>
            )}
            {chain.recommendedAction && (
              <div style={{ ...S.crossItem, borderBottom: "none" }}>
                <span style={{ ...S.crossTag, color: T.lime500, borderColor: "rgba(192,236,95,0.3)" }}>Action</span>
                <span>{chain.recommendedAction}</span>
              </div>
            )}
          </div>
        )}

        {/* Teammate's reasoning (from entity description) */}
        {!chain && (
          <div style={S.section}>
            <div style={S.secLabel}>※ teammate&apos;s reasoning</div>
            <div style={S.reason}>{renderMixed(narrative.reason)}</div>
          </div>
        )}

        <div style={S.section}>
          <div style={S.secLabel}>{chain?.crossRelease ? "Cross-release pattern" : "References"}</div>
          {narrative.cross.map((c, i) => (
            <div key={`cross-${i}`} style={S.crossItem}>
              <span style={S.crossTag}>{c.tag}</span>
              <span>{c.text}</span>
            </div>
          ))}
        </div>
        {pinned && (
          <div style={S.unpinRow}>
            <button style={S.closeBtn} onClick={onUnpin}>
              <IconClose />Unpin</button>
          </div>
        )}
      </>
    )}
  </div>
);

export default TeamBrainNarrativePanel;

// ── Styles ──────────────────────────────────────────────────

const panelBase: CSSProperties = {
  position: "absolute", top: 76, right: 20, width: 320,
  maxHeight: "calc(100vh - 180px)", overflowY: "auto",
  background: "rgba(23,23,26,0.72)",
  backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
  border: `1px solid ${T.borderDefault}`, borderRadius: T.radiusLg,
  zIndex: 15,
  transition: `opacity ${T.durBase} ${T.easeOut}, transform ${T.durBase} ${T.easeOut}`,
};

const S = {
  panelVisible: { ...panelBase, padding: 20, opacity: 1, transform: "translateY(0)", pointerEvents: "auto" as const } as CSSProperties,
  panelHidden: { ...panelBase, padding: 0, opacity: 0, transform: "translateY(-8px)", pointerEvents: "none" as const } as CSSProperties,
  labelRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 } as CSSProperties,
  catLabel: { fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, color: T.fg2 } as CSSProperties,
  h3: { fontSize: 22, fontWeight: 500, margin: "0 0 8px", lineHeight: 1.15, letterSpacing: "-0.01em", fontFamily: T.fontSans, color: T.fg1 } as CSSProperties,
  meta: { fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, color: T.fg3, marginBottom: 16 } as CSSProperties,
  section: { marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.borderHair}` } as CSSProperties,
  secLabel: { fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, color: T.fg3, marginBottom: 8 } as CSSProperties,
  reason: { fontSize: 13.5, lineHeight: 1.5, color: T.fg1 } as CSSProperties,
  crossItem: { display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.borderHair}`, fontSize: 13, lineHeight: 1.4, color: T.fg1 } as CSSProperties,
  crossTag: { fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, color: T.fg3, padding: "2px 7px", border: `1px solid ${T.borderHair}`, borderRadius: T.radiusXs, flexShrink: 0, marginTop: 1 } as CSSProperties,
  unpinRow: { ...({ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.borderHair}` }), display: "flex", justifyContent: "flex-end", borderTop: "none", paddingTop: 0 } as CSSProperties,
  closeBtn: { display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", background: "transparent", border: `1px solid ${T.borderHair}`, borderRadius: T.radiusPill, color: T.fg2, fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, cursor: "pointer" } as CSSProperties,
  ital: { fontFamily: T.fontHighlight, fontStyle: "italic" as const, fontWeight: 400, color: T.lime500, letterSpacing: "-0.005em" } as CSSProperties,
};
