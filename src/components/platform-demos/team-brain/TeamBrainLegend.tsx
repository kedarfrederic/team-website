/**
 * Team Brain — category legend / filter bar (bottom).
 *
 * "All" pill plus per-category chips with dot, label, and count.
 * Clicking a chip toggles filtering; active state is highlighted.
 */

import type { FC, CSSProperties } from "react";
import { T, catDot, CATEGORIES } from "./types";

interface Props {
  filter: string;
  onFilterChange: (next: string) => void;
  categoryCounts: Record<string, number>;
}

const TeamBrainLegend: FC<Props> = ({
  filter,
  onFilterChange,
  categoryCounts,
}) => (
  <div style={S.legend}>
    <button style={S.chipAll} onClick={() => onFilterChange("all")}>
      <span>&#9660; All</span>
    </button>
    {Object.entries(CATEGORIES).map(([key, c]) => {
      const isOn = filter === "all" || filter === key;
      const isSel = filter === key;
      const count = categoryCounts[key] || 0;
      return (
        <button
          key={key}
          style={{
            ...S.chip,
            ...(isSel ? S.chipActive : {}),
            ...(!isOn ? { opacity: 0.35 } : {}),
          }}
          onClick={() =>
            onFilterChange(filter === key ? "all" : key)
          }
        >
          <span style={catDot(c.color)} />
          <span>{c.label}</span>
          <span style={S.num}>({count.toLocaleString()})</span>
        </button>
      );
    })}
  </div>
);

export default TeamBrainLegend;

// ── Styles ──────────────────────────────────────────────────

const S = {
  legend: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "16px 20px",
    flexWrap: "wrap" as const,
    zIndex: 20,
    position: "relative" as const,
  } as CSSProperties,

  chipAll: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "5px 11px 5px 10px",
    background: T.paper100,
    border: "1px solid transparent",
    borderRadius: T.radiusPill,
    fontSize: 12,
    color: T.ink900,
    fontFamily: T.fontSans,
    fontWeight: 500,
    cursor: "pointer",
    transition: `all ${T.durFast} ${T.easeOut}`,
    userSelect: "none" as const,
  } as CSSProperties,

  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "5px 11px 5px 10px",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: T.radiusPill,
    fontSize: 12,
    color: T.fg2,
    fontFamily: T.fontSans,
    cursor: "pointer",
    transition: `all ${T.durFast} ${T.easeOut}`,
    userSelect: "none" as const,
  } as CSSProperties,

  chipActive: {
    background: "rgba(255,255,255,0.06)",
    borderColor: T.borderHair,
    color: T.fg1,
  } as CSSProperties,

  num: {
    fontFamily: T.fontMono,
    fontSize: 11,
    letterSpacing: T.trackingMono,
    color: T.fg3,
    marginLeft: 1,
  } as CSSProperties,
};
