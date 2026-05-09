/**
 * Team Brain Data Adapter — barrel module.
 *
 * Re-exports types, constants, and the main transform function.
 * The actual transform logic lives in adapterTransform.ts,
 * geometry helpers in adapterGeometry.ts, and input types in
 * adapterInputTypes.ts.
 */

// ── Node / Edge shapes for the 3D graph ────────────────────

export interface BrainNode {
  id: string;
  cat: string;
  label: string;
  x: number;
  y: number;
  z: number;
  r: number;
  hub: boolean;
  entityType?: string;
  properties?: Record<string, unknown>;
}

export interface BrainEdge {
  a: string;
  b: string;
  strong: boolean;
}

// ── Category palette ────────────────────────────────────────

export const CATEGORIES: Record<
  string,
  { label: string; color: string; r: number }
> = {
  campaign: { label: "campaign", color: "#E83E18", r: 1.2 },
  decisions: { label: "decisions", color: "#F4833E", r: 0.85 },
  observations: { label: "observations", color: "#C0EC5F", r: 0.35 },
  workflows: { label: "workflows", color: "#CAEC73", r: 0.95 },
  task: { label: "task", color: "#7A7770", r: 0.4 },
  tactic: { label: "tactic", color: "#FAFAF7", r: 0.6 },
  contact: { label: "contact", color: "#B8B6AE", r: 0.55 },
  conversations: { label: "conversations", color: "#8A8A94", r: 0.5 },
};

// ── KG type -> category mappings (used by adapterTransform) ─

export const ENTITY_TYPE_TO_CAT: Record<
  string,
  { cat: string; hub: boolean; r: number }
> = {
  campaign: { cat: "campaign", hub: true, r: 1.2 },
  release: { cat: "campaign", hub: true, r: 1.2 },
  outcome: { cat: "decisions", hub: true, r: 0.85 },
  track: { cat: "tactic", hub: false, r: 0.6 },
  artist: { cat: "contact", hub: false, r: 0.55 },
  contact: { cat: "contact", hub: false, r: 0.55 },
  vendor: { cat: "contact", hub: false, r: 0.55 },
  task: { cat: "task", hub: false, r: 0.4 },
  playlist: { cat: "workflows", hub: false, r: 0.95 },
  platform: { cat: "tactic", hub: false, r: 0.5 },
  genre: { cat: "tactic", hub: false, r: 0.5 },
  tactic: { cat: "tactic", hub: false, r: 0.6 },
};

export const MEMORY_CATEGORY_TO_CAT: Record<
  string,
  { cat: string; r: number }
> = {
  observation: { cat: "observations", r: 0.35 },
  decision: { cat: "decisions", r: 0.5 },
  outcome: { cat: "decisions", r: 0.5 },
  conversation_fact: { cat: "conversations", r: 0.5 },
  workflow_pattern: { cat: "workflows", r: 0.5 },
  preference: { cat: "observations", r: 0.35 },
  budget_pattern: { cat: "observations", r: 0.35 },
};

// ── Re-exports ──────────────────────────────────────────────

export { transformKGToGraph } from "./adapterTransform";
export type { IntelligenceEntry } from "./adapterInputTypes";
