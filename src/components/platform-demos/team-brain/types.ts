/**
 * Team Brain — shared types, design tokens, category re-export,
 * and dynamic font/keyframe injection.
 */

import type { CSSProperties } from "react";
import type { BrainNode } from "./teamBrainDataAdapter";
export type { BrainNode, BrainEdge } from "./teamBrainDataAdapter";
export { CATEGORIES } from "./teamBrainDataAdapter";

// ── Props ───────────────────────────────────────────────────

export interface TeamBrainProps {
  releaseId?: string;
  organizationId: string;
  onClose: () => void;
}

// ── Projected node (screen-space coords after 3D transform) ─

export interface ProjectedNode extends BrainNode {
  sx: number;
  sy: number;
  depth: number;
  depthFactor: number;
}

// ── Narrative story shape ───────────────────────────────────

export type ItalSegment = string | { ital: string };

export interface NarrativeStory {
  cat: string;
  title: ItalSegment[];
  meta: string;
  reason: ItalSegment[];
  cross: Array<{ tag: string; text: string }>;
}

// ── Visible edge (extends BrainEdge with active flag) ───────

export interface VisibleEdge {
  a: string;
  b: string;
  strong: boolean;
  active: boolean;
}

// ── Design tokens (inline, matching colors_and_type.css) ────

export const T = {
  ink900: "#0E0E10",
  ink800: "#17171A",
  ink700: "#1E1E22",
  ink600: "#2A2A30",
  ink500: "#3A3A42",
  paper100: "#FAFAF7",
  paper200: "#F2F1EC",
  lime500: "#C0EC5F",
  lime300: "#CAEC73",
  ember600: "#E83E18",
  ember400: "#F4833E",
  fg1: "#FAFAF7",
  fg2: "#B8B6AE",
  fg3: "#7A7770",
  borderHair: "rgba(255,255,255,0.06)",
  borderDefault: "rgba(255,255,255,0.10)",
  fontSans: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  fontHighlight:
    "'Instrument Serif', 'Playfair Display', Georgia, serif",
  trackingMono: "0.04em",
  radiusPill: "999px",
  radiusLg: "16px",
  radiusSm: "8px",
  radiusXs: "4px",
  easeOut: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  durFast: "120ms",
  durBase: "200ms",
};

// ── Style helpers reused by multiple sub-components ─────────

export const catDot = (color: string): CSSProperties => ({
  display: "inline-block",
  width: 8,
  height: 8,
  borderRadius: "var(--radius-pill)",
  background: color,
  flexShrink: 0,
});

export const catDotSmall = (color: string): CSSProperties => ({
  display: "inline-block",
  width: 7,
  height: 7,
  borderRadius: "var(--radius-pill)",
  background: color,
  flexShrink: 0,
});

// ── Dynamic font import ─────────────────────────────────────

const FONT_LINK_ID = "team-brain-fonts";
if (
  typeof document !== "undefined" &&
  !document.getElementById(FONT_LINK_ID)
) {
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

// ── Inject keyframes ────────────────────────────────────────

const STYLE_ID = "team-brain-keyframes";
if (
  typeof document !== "undefined" &&
  !document.getElementById(STYLE_ID)
) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes teamBrainPulse {
      0%   { opacity: 0.6; transform: scale(1); }
      60%  { opacity: 0;   transform: scale(2.2); }
      100% { opacity: 0;   transform: scale(2.2); }
    }
    @keyframes teamBrainTickerIn {
      from { opacity: 0; transform: translateX(12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes teamBrainFadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}
