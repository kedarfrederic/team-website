/**
 * Team Brain — memory ingestion ticker (bottom-right).
 *
 * Pill-shaped items with backdrop blur showing recent memory
 * ingestion events with category dot, text, and time ago.
 * Shifts left when narrative panel is open. Clickable to expand.
 */

import { useState, type FC, type CSSProperties } from "react";
import { T, catDotSmall, CATEGORIES } from "./types";

export interface TickerItem {
  cat: string;
  text: string;
  fullText?: string;
  dim: string;
}

interface Props {
  items: TickerItem[];
  panelOpen?: boolean;
}

const TeamBrainTicker: FC<Props> = ({ items, panelOpen }) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ ...S.ticker, right: panelOpen ? 360 : 20 }}>
      {items.map((t, i) => (
        <div
          key={`tick-${t.text}-${i}`}
          onClick={() => setExpanded(expanded === i ? null : i)}
          style={{
            ...S.tickerItem,
            opacity: 1 - i * 0.28,
            animation: "teamBrainTickerIn 300ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            maxWidth: expanded === i ? 500 : 320,
            cursor: "pointer",
          }}
        >
          <span style={catDotSmall(CATEGORIES[t.cat]?.color || "#888")} />
          <span>{expanded === i && t.fullText ? t.fullText : t.text}</span>
          <span style={S.tickDim}> · {t.dim}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamBrainTicker;

// ── Time-ago helper (used by orchestrator to build items) ────

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffS = Math.floor(diffMs / 1000);
  if (diffS < 60) return `${diffS}s ago`;
  const diffM = Math.floor(diffS / 60);
  if (diffM < 60) return `${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

// ── Styles ──────────────────────────────────────────────────

const S = {
  ticker: {
    position: "absolute" as const,
    bottom: 72,
    zIndex: 16,
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
    alignItems: "flex-end",
    transition: "right 300ms ease-out",
  } as CSSProperties,

  tickerItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(23,23,26,0.72)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${T.borderHair}`,
    borderRadius: T.radiusPill,
    padding: "6px 12px 6px 10px",
    fontFamily: T.fontMono,
    fontSize: 11,
    letterSpacing: T.trackingMono,
    textTransform: "uppercase" as const,
    color: T.fg2,
    transition: "max-width 300ms ease-out",
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
  } as CSSProperties,

  tickDim: { color: T.fg3 } as CSSProperties,
};
