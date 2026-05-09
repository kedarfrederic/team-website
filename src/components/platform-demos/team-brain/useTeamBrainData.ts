/**
 * Marketing-site adaptation: replaces the platform's tRPC-fed data hook
 * with a static demo dataset. Same return shape so the rest of the
 * brain components (Visualization, Canvas, SVG, Ticker, Narrative,
 * Legend) keep working unchanged.
 */

import { useMemo } from "react";
import {
  transformKGToGraph,
  CATEGORIES,
  type BrainNode,
  type BrainEdge,
} from "./teamBrainDataAdapter";
import { buildNarrativesFromGraph } from "./narratives";

// ── Demo dataset — Arcadia release knowledge graph ───────────
// 30 entities + 60 relationships + 25 memories — enough density to feel
// real; small enough to render at 60fps in any browser. Marketing can
// later replace with content from Sanity (homepage.brainSection.demo).

const DEMO_ENTITIES = [
  { id: "rel-arcadia", name: "Arcadia", entityType: "release" },
  { id: "art-marlowe", name: "Marlowe Sky", entityType: "artist" },
  { id: "trk-arcadia-1", name: "Arcadia (single)", entityType: "track" },
  { id: "trk-arcadia-2", name: "Cinder", entityType: "track" },
  { id: "trk-arcadia-3", name: "Embers", entityType: "track" },
  { id: "out-streams", name: "100k Spotify streams (week 1)", entityType: "outcome" },
  { id: "out-saves", name: "Save rate 2x category avg", entityType: "outcome" },
  { id: "tact-presave", name: "Pre-save campaign", entityType: "tactic" },
  { id: "tact-pitch", name: "Editorial playlist pitch", entityType: "tactic" },
  { id: "tact-tiktok", name: "TikTok teaser challenge", entityType: "tactic" },
  { id: "tact-press", name: "Press EPK", entityType: "tactic" },
  { id: "pl-newmusic", name: "New Music Friday", entityType: "playlist" },
  { id: "pl-indie", name: "Indie Chill", entityType: "playlist" },
  { id: "pl-fresh", name: "Fresh Finds", entityType: "playlist" },
  { id: "plat-spotify", name: "Spotify", entityType: "platform" },
  { id: "plat-apple", name: "Apple Music", entityType: "platform" },
  { id: "plat-tiktok", name: "TikTok", entityType: "platform" },
  { id: "plat-instagram", name: "Instagram", entityType: "platform" },
  { id: "ven-distrokid", name: "DistroKid", entityType: "vendor" },
  { id: "ven-pr", name: "Indie PR Co.", entityType: "vendor" },
  { id: "con-curator-a", name: "M. Reyes (curator)", entityType: "contact" },
  { id: "con-journalist", name: "L. Park (journalist)", entityType: "contact" },
  { id: "task-artwork", name: "Finalise cover artwork", entityType: "task" },
  { id: "task-canvas", name: "Upload Spotify Canvas", entityType: "task" },
  { id: "task-pitch", name: "Submit playlist pitch", entityType: "task" },
  { id: "task-press", name: "Press release outreach", entityType: "task" },
  { id: "task-newsletter", name: "Send fan newsletter", entityType: "task" },
  { id: "task-launch", name: "Brooklyn launch party", entityType: "task" },
  { id: "g-indie", name: "Indie pop", entityType: "genre" },
  { id: "g-altrnb", name: "Alt R&B", entityType: "genre" },
];

const DEMO_RELATIONSHIPS = [
  { sourceId: "rel-arcadia", targetId: "art-marlowe", relationType: "released_by" },
  { sourceId: "rel-arcadia", targetId: "trk-arcadia-1", relationType: "contains" },
  { sourceId: "rel-arcadia", targetId: "trk-arcadia-2", relationType: "contains" },
  { sourceId: "rel-arcadia", targetId: "trk-arcadia-3", relationType: "contains" },
  { sourceId: "rel-arcadia", targetId: "tact-presave", relationType: "uses" },
  { sourceId: "rel-arcadia", targetId: "tact-pitch", relationType: "uses" },
  { sourceId: "rel-arcadia", targetId: "tact-tiktok", relationType: "uses" },
  { sourceId: "rel-arcadia", targetId: "tact-press", relationType: "uses" },
  { sourceId: "rel-arcadia", targetId: "out-streams", relationType: "produced" },
  { sourceId: "rel-arcadia", targetId: "out-saves", relationType: "produced" },
  { sourceId: "tact-pitch", targetId: "pl-newmusic", relationType: "targets" },
  { sourceId: "tact-pitch", targetId: "pl-indie", relationType: "targets" },
  { sourceId: "tact-pitch", targetId: "pl-fresh", relationType: "targets" },
  { sourceId: "tact-pitch", targetId: "con-curator-a", relationType: "via" },
  { sourceId: "tact-presave", targetId: "plat-spotify", relationType: "on" },
  { sourceId: "tact-presave", targetId: "plat-apple", relationType: "on" },
  { sourceId: "tact-tiktok", targetId: "plat-tiktok", relationType: "on" },
  { sourceId: "tact-tiktok", targetId: "plat-instagram", relationType: "amplified_by" },
  { sourceId: "tact-press", targetId: "ven-pr", relationType: "via" },
  { sourceId: "tact-press", targetId: "con-journalist", relationType: "via" },
  { sourceId: "art-marlowe", targetId: "g-indie", relationType: "genre" },
  { sourceId: "art-marlowe", targetId: "g-altrnb", relationType: "genre" },
  { sourceId: "trk-arcadia-1", targetId: "pl-newmusic", relationType: "added_to" },
  { sourceId: "trk-arcadia-1", targetId: "pl-indie", relationType: "added_to" },
  { sourceId: "rel-arcadia", targetId: "task-artwork", relationType: "has" },
  { sourceId: "rel-arcadia", targetId: "task-canvas", relationType: "has" },
  { sourceId: "rel-arcadia", targetId: "task-pitch", relationType: "has" },
  { sourceId: "rel-arcadia", targetId: "task-press", relationType: "has" },
  { sourceId: "rel-arcadia", targetId: "task-newsletter", relationType: "has" },
  { sourceId: "rel-arcadia", targetId: "task-launch", relationType: "has" },
  { sourceId: "task-artwork", targetId: "out-saves", relationType: "supports" },
  { sourceId: "task-canvas", targetId: "out-saves", relationType: "supports" },
  { sourceId: "task-pitch", targetId: "out-streams", relationType: "drives" },
  { sourceId: "task-launch", targetId: "out-streams", relationType: "drives" },
  { sourceId: "rel-arcadia", targetId: "ven-distrokid", relationType: "via" },
];

const DEMO_MEMORIES = [
  { id: "m-1", category: "observation", content: "Marlowe's audience peaks Friday 6pm — schedule launch then.", relatedEntityIds: ["art-marlowe", "rel-arcadia"] },
  { id: "m-2", category: "decision", content: "Move release date from Apr 25 to Apr 18 — lower competitor density.", relatedEntityIds: ["rel-arcadia"] },
  { id: "m-3", category: "outcome", content: "Last Marlowe single peaked at week 2 with playlist adds.", relatedEntityIds: ["art-marlowe"] },
  { id: "m-4", category: "conversation_fact", content: "M. Reyes prefers tracks under 3:00 for Indie Chill.", relatedEntityIds: ["con-curator-a", "pl-indie"] },
  { id: "m-5", category: "workflow_pattern", content: "Pre-save → Canvas → Pitch — 3 weeks out works for indie pop.", relatedEntityIds: ["tact-presave", "tact-pitch"] },
  { id: "m-6", category: "preference", content: "Artist prefers warmer cover-art palettes.", relatedEntityIds: ["art-marlowe"] },
  { id: "m-7", category: "budget_pattern", content: "Spotify ad spend > Meta ad spend by 2x for indie pop.", relatedEntityIds: ["plat-spotify"] },
  { id: "m-8", category: "observation", content: "Save rate 2x above category average — push deluxe.", relatedEntityIds: ["out-saves"] },
  { id: "m-9", category: "decision", content: "Run TikTok challenge starting 10 days out.", relatedEntityIds: ["tact-tiktok"] },
  { id: "m-10", category: "observation", content: "L. Park covered last release — re-pitch for Arcadia.", relatedEntityIds: ["con-journalist"] },
  { id: "m-11", category: "workflow_pattern", content: "DistroKid delivery typically 2 days; build that into timeline.", relatedEntityIds: ["ven-distrokid"] },
  { id: "m-12", category: "outcome", content: "Editorial playlist drove 60% of week-1 streams last release.", relatedEntityIds: ["pl-newmusic"] },
];

export function useTeamBrainData(_organizationId?: string, _releaseId?: string) {
  const data = {
    entities: DEMO_ENTITIES,
    relationships: DEMO_RELATIONSHIPS,
    memories: DEMO_MEMORIES,
    stats: {
      entityCount: DEMO_ENTITIES.length,
      relationshipCount: DEMO_RELATIONSHIPS.length,
      memoryCount: DEMO_MEMORIES.length,
    },
    reasoningChains: [],
    intelligenceEntries: [],
  };

  const graph = useMemo(() => {
    return transformKGToGraph(
      data.entities as any[],
      data.relationships as any[],
      data.memories as any[],
      undefined,
    );
  }, []);

  const narratives = useMemo(() => {
    if (graph.nodes.length === 0) return [];
    return buildNarrativesFromGraph(graph.nodes, graph.edges);
  }, [graph]);

  const stats = data.stats as {
    entityCount: number;
    relationshipCount: number;
    memoryCount: number;
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of graph.nodes) counts[n.cat] = (counts[n.cat] || 0) + 1;
    return counts;
  }, [graph.nodes]);

  const releaseName = "Arcadia";
  const isLoading = false;
  const chains: any[] = [];

  return {
    graph,
    narratives,
    stats,
    categoryCounts,
    isLoading,
    releaseName,
    rawData: data,
    chains,
  };
}

export { CATEGORIES };
