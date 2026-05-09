/**
 * Team Brain — main KG-to-graph transform.
 *
 * Converts entities, relationships, memories, and intelligence
 * entries into BrainNode[] + BrainEdge[] for the 3D sphere.
 *
 * Performance-optimized: Set-based edge lookups, reduced jitter,
 * no random peer connections, O(1) existence checks.
 */

import type { BrainNode, BrainEdge } from "./teamBrainDataAdapter";
import { ENTITY_TYPE_TO_CAT, MEMORY_CATEGORY_TO_CAT } from "./teamBrainDataAdapter";
import type { KGEntityInput, KGRelationshipInput, KGMemoryInput, IntelligenceEntry } from "./adapterInputTypes";
import { fibSphere, mulberry32 } from "./adapterGeometry";

/** O(1) edge existence check */
function edgeKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

export function transformKGToGraph(
  entities: KGEntityInput[],
  relationships: KGRelationshipInput[],
  memories: KGMemoryInput[],
  intelligenceEntries?: IntelligenceEntry[],
): { nodes: BrainNode[]; edges: BrainEdge[] } {
  const rand = mulberry32(7);
  const nodes: BrainNode[] = [];
  const entityIdSet = new Set<string>();

  // 1. Classify entities into layers
  const hubEntities: KGEntityInput[] = [];
  const midEntities: KGEntityInput[] = [];
  const outerEntities: KGEntityInput[] = [];
  for (const e of entities) {
    const mapping = ENTITY_TYPE_TO_CAT[e.entityType];
    if (!mapping) { midEntities.push(e); continue; }
    if (mapping.hub) hubEntities.push(e);
    else if (mapping.cat === "task") outerEntities.push(e);
    else midEntities.push(e);
  }

  // 2. Place hub entities (radius ~90-120) — minimal jitter
  const hubPts = fibSphere(Math.max(hubEntities.length, 1), 90, 0);
  for (let i = 0; i < hubEntities.length; i++) {
    const e = hubEntities[i];
    const m = ENTITY_TYPE_TO_CAT[e.entityType] ?? { cat: "campaign", hub: true, r: 1.2 };
    const pt = hubPts[i] ?? [0, 0, 0];
    nodes.push({ id: e.id, cat: m.cat, label: e.name, x: pt[0] + (rand() - 0.5) * 6, y: pt[1] + (rand() - 0.5) * 6, z: pt[2] + (rand() - 0.5) * 6, r: m.r * 1.15, hub: true, entityType: e.entityType, properties: e.properties });
    entityIdSet.add(e.id);
  }

  // 3. Place mid-layer entities (radius ~160-210)
  const midPts = fibSphere(Math.max(midEntities.length, 1), 180, 0.37);
  for (let i = 0; i < midEntities.length; i++) {
    const e = midEntities[i];
    const m = ENTITY_TYPE_TO_CAT[e.entityType] ?? { cat: "tactic", hub: false, r: 0.6 };
    const pt = midPts[i] ?? [0, 0, 0];
    nodes.push({ id: e.id, cat: m.cat, label: e.name, x: pt[0] + (rand() - 0.5) * 8, y: pt[1] + (rand() - 0.5) * 8, z: pt[2] + (rand() - 0.5) * 8, r: m.r, hub: false, entityType: e.entityType, properties: e.properties });
    entityIdSet.add(e.id);
  }

  // 4. Place outer entities (radius ~270)
  const outerPts = fibSphere(Math.max(outerEntities.length, 1), 270, 0.19);
  for (let i = 0; i < outerEntities.length; i++) {
    const e = outerEntities[i];
    const m = ENTITY_TYPE_TO_CAT[e.entityType] ?? { cat: "task", hub: false, r: 0.4 };
    const pt = outerPts[i] ?? [0, 0, 0];
    nodes.push({ id: e.id, cat: m.cat, label: e.name, x: pt[0] + (rand() - 0.5) * 5, y: pt[1] + (rand() - 0.5) * 5, z: pt[2] + (rand() - 0.5) * 5, r: m.r, hub: false, entityType: e.entityType, properties: e.properties });
    entityIdSet.add(e.id);
  }

  // 5. Place intelligence entries (hub layer, radius ~110)
  if (intelligenceEntries && intelligenceEntries.length > 0) {
    const intelPts = fibSphere(Math.max(intelligenceEntries.length, 1), 110, 0.5);
    for (let i = 0; i < intelligenceEntries.length; i++) {
      const ie = intelligenceEntries[i];
      const pt = intelPts[i] ?? [0, 0, 0];
      nodes.push({ id: `intel_${ie.id}`, cat: "decisions", label: ie.title, x: pt[0] + (rand() - 0.5) * 6, y: pt[1] + (rand() - 0.5) * 6, z: pt[2] + (rand() - 0.5) * 6, r: 0.85, hub: true, entityType: "intelligence", properties: { description: ie.description, recommendedAction: ie.recommendedAction, impactScore: ie.impactScore, sentiment: ie.sentiment, category: ie.category, subcategory: ie.subcategory, platform: ie.platform, actionUrgency: ie.actionUrgency, metricValue: ie.metricValue, metricUnit: ie.metricUnit, deltaPercent: ie.deltaPercent, occurredAt: ie.occurredAt, sourceName: ie.sourceName } });
    }
  }

  // 6. Place memories (outer shell, radius ~290-310) — cap at 200 for performance
  const filteredMemories = memories.filter((m) => {
    const c = m.content || "";
    if (c.startsWith("Subtask ")) return false;
    if (c.startsWith("[user]:") && c.length < 20) return false;
    return true;
  });
  const memPts = fibSphere(Math.max(filteredMemories.length, 1), 290, 0.1);
  for (let i = 0; i < filteredMemories.length; i++) {
    const m = filteredMemories[i];
    const mapping = MEMORY_CATEGORY_TO_CAT[m.category] ?? { cat: "observations", r: 0.35 };
    const pt = memPts[i] ?? [0, 0, 0];
    const truncLabel = m.content.length > 60 ? m.content.slice(0, 58) + "\u2026" : m.content;
    nodes.push({ id: m.id, cat: mapping.cat, label: truncLabel, x: pt[0] + (rand() - 0.5) * 4, y: pt[1] + (rand() - 0.5) * 4, z: pt[2] + (rand() - 0.5) * 4, r: mapping.r, hub: false, entityType: `memory_${m.category}`, properties: { scope: m.scope, scopeId: m.scopeId, category: m.category, content: m.content, ...m.properties } });
  }

  // 7. Build edges from relationships — O(1) existence checks via Set
  const edges: BrainEdge[] = [];
  const edgeSet = new Set<string>();
  const hubIdSet = new Set(nodes.filter((n) => n.hub).map((n) => n.id));

  for (const rel of relationships) {
    if (!entityIdSet.has(rel.sourceEntityId) || !entityIdSet.has(rel.targetEntityId)) continue;
    const key = edgeKey(rel.sourceEntityId, rel.targetEntityId);
    if (edgeSet.has(key)) continue;
    edgeSet.add(key);
    edges.push({ a: rel.sourceEntityId, b: rel.targetEntityId, strong: rel.weight > 0.7 || hubIdSet.has(rel.sourceEntityId) || hubIdSet.has(rel.targetEntityId) });
  }

  // 8. Connect unconnected nodes to nearest hub — O(n*h) but no random peers
  const connectedIds = new Set<string>();
  for (const e of edges) { connectedIds.add(e.a); connectedIds.add(e.b); }
  const hubNodes = nodes.filter((n) => n.hub);
  if (hubNodes.length > 0) {
    for (const n of nodes) {
      if (n.hub || connectedIds.has(n.id)) continue;
      let bestHub = hubNodes[0]; let bestDist = Infinity;
      for (const h of hubNodes) {
        const dx = n.x - h.x; const dy = n.y - h.y; const dz = n.z - h.z;
        const d = dx * dx + dy * dy + dz * dz; // skip sqrt — comparing squared distances
        if (d < bestDist) { bestDist = d; bestHub = h; }
      }
      const key = edgeKey(n.id, bestHub.id);
      if (!edgeSet.has(key)) { edgeSet.add(key); edges.push({ a: n.id, b: bestHub.id, strong: false }); }
    }
  }

  // 9. Hub-to-hub edges (all pairs) — O(1) existence via edgeSet
  for (let i = 0; i < hubNodes.length; i++) {
    for (let j = i + 1; j < hubNodes.length; j++) {
      const key = edgeKey(hubNodes[i].id, hubNodes[j].id);
      if (!edgeSet.has(key)) { edgeSet.add(key); edges.push({ a: hubNodes[i].id, b: hubNodes[j].id, strong: true }); }
    }
  }

  return { nodes, edges };
}
