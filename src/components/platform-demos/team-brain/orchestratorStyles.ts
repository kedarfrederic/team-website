/**
 * Team Brain — orchestrator-specific inline styles.
 */

import type { CSSProperties } from "react";
import { T } from "./types";

export const S = {
  shell: { position: "fixed" as const, inset: 0, zIndex: 100, background: T.ink900, fontFamily: T.fontSans, WebkitFontSmoothing: "antialiased" as const, color: T.fg1, display: "grid", gridTemplateRows: "auto 1fr auto", overflow: "hidden", userSelect: "none" as const } as CSSProperties,
  center: { display: "flex", alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "column" as const, gap: 16, textAlign: "center" as const, padding: "0 40px" } as CSSProperties,
  stage: { position: "relative" as const, overflow: "hidden", cursor: "grab" } as CSSProperties,
  ambientGlow: { position: "absolute" as const, left: "50%", top: "50%", width: 900, height: 900, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(192,236,95,0.035) 0%, transparent 55%)", pointerEvents: "none" as const, zIndex: 0 } as CSSProperties,
  stageControls: { position: "absolute" as const, right: 20, top: 16, display: "flex", gap: 6, zIndex: 12 } as CSSProperties,
  ctrl: { width: 34, height: 34, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(23,23,26,0.72)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${T.borderHair}`, borderRadius: "var(--radius-pill)", color: T.fg2, cursor: "pointer", fontSize: 14 } as CSSProperties,
  ctrlOn: { width: 34, height: 34, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(192,236,95,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(192,236,95,0.3)", borderRadius: "var(--radius-pill)", color: T.lime500, cursor: "pointer", fontSize: 14 } as CSSProperties,
  introCard: { position: "absolute" as const, top: 16, left: 20, maxWidth: 340, padding: 20, background: "rgba(23,23,26,0.5)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${T.borderHair}`, borderRadius: T.radiusLg, zIndex: 14 } as CSSProperties,
  introEyebrow: { fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, color: T.lime500, marginBottom: 12 } as CSSProperties,
  introH1: { fontSize: 28, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.015em", margin: "0 0 12px", fontFamily: T.fontSans, color: T.fg1 } as CSSProperties,
  ital: { fontFamily: T.fontHighlight, fontStyle: "italic" as const, color: T.lime500, fontWeight: 400 } as CSSProperties,
  introP: { fontSize: 13.5, lineHeight: 1.5, color: T.fg2, margin: "0 0 12px" } as CSSProperties,
  introClose: { position: "absolute" as const, top: 12, right: 12, background: "none", border: "none", color: T.fg3, cursor: "pointer", fontSize: 16 } as CSSProperties,
  nodeLabel: (left: number, top: number): CSSProperties => ({
    position: "absolute", left, top, transform: "translate(-50%, calc(-100% - 12px))",
    background: "rgba(14,14,16,0.9)", border: `1px solid ${T.borderDefault}`,
    borderRadius: T.radiusSm, padding: "7px 10px", fontFamily: T.fontMono,
    fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase",
    color: T.fg1, pointerEvents: "none", whiteSpace: "nowrap", zIndex: 18,
    display: "flex", alignItems: "center", gap: 8,
  }),
  brand: { position: "absolute" as const, left: 20, bottom: 76, display: "flex", alignItems: "center", gap: 10, opacity: 0.5, zIndex: 14, pointerEvents: "none" as const } as CSSProperties,
  brandSep: { width: 1, height: 14, background: T.borderDefault, display: "block" } as CSSProperties,
  brandCrumb: { fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, color: T.fg3 } as CSSProperties,
  tweaks: { position: "absolute" as const, bottom: 72, left: 20, width: 260, background: "rgba(23,23,26,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1px solid ${T.borderDefault}`, borderRadius: T.radiusLg, padding: 16, zIndex: 30, fontFamily: T.fontSans, fontSize: 12 } as CSSProperties,
  tweaksLabel: { fontFamily: T.fontMono, fontSize: 11, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, color: T.fg3, marginBottom: 12 } as CSSProperties,
  tweakRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${T.borderHair}` } as CSSProperties,
  seg: { display: "inline-flex", background: "rgba(255,255,255,0.04)", borderRadius: T.radiusSm, padding: 2 } as CSSProperties,
  segBtn: { background: "transparent", border: 0, color: T.fg3, fontSize: 11, fontFamily: T.fontMono, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, padding: "4px 8px", borderRadius: 6, cursor: "pointer" } as CSSProperties,
  segBtnA: { background: "rgba(255,255,255,0.08)", border: 0, color: T.fg1, fontSize: 11, fontFamily: T.fontMono, letterSpacing: T.trackingMono, textTransform: "uppercase" as const, padding: "4px 8px", borderRadius: 6, cursor: "pointer" } as CSSProperties,
};
