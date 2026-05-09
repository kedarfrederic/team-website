/**
 * Team Brain — narrative story builder.
 *
 * Transforms hub nodes + edges into NarrativeStory cards
 * shown in the auto-cycling insight panel.
 */

import { CATEGORIES, type BrainNode, type BrainEdge } from "./teamBrainDataAdapter";
import type { NarrativeStory, ItalSegment } from "./types";

export function buildNarrativesFromGraph(
  nodes: BrainNode[],
  edges: BrainEdge[],
): NarrativeStory[] {
  const hubs = nodes.filter((n) => n.hub);
  if (hubs.length === 0) return [];

  const stories: NarrativeStory[] = [];

  for (const hub of hubs.slice(0, 12)) {
    const cat = hub.cat;
    const catLabel = CATEGORIES[cat]?.label || cat;
    const props = hub.properties || {};

    // Find connected nodes
    const connections = edges.filter(
      (e) => e.a === hub.id || e.b === hub.id,
    );
    const connectedNodes: BrainNode[] = [];
    for (const e of connections.slice(0, 6)) {
      const otherId = e.a === hub.id ? e.b : e.a;
      const other = nodes.find((nd) => nd.id === otherId);
      if (other) connectedNodes.push(other);
    }

    // Build title with italic highlight
    const name = hub.label || "Untitled";
    const words = name.split(" ");
    let title: ItalSegment[];
    if (words.length >= 3) {
      const italPart = words.slice(-2).join(" ");
      const prefix = words.slice(0, -2).join(" ");
      title = [
        `${catLabel === "campaign" ? "Rollout" : catLabel === "decisions" ? "Decision" : catLabel} — `,
        { ital: prefix ? name : italPart },
      ];
      if (prefix) {
        title = [`${prefix} — `, { ital: italPart }];
      }
    } else {
      title = [`${catLabel} — `, { ital: name }];
    }

    // Meta line
    const meta = `${hub.entityType || catLabel} · ${connections.length} connections · ${connectedNodes.length} related`;

    // Reasoning from description/content
    const desc =
      (props.description as string) || (props.content as string) || "";
    let reason: ItalSegment[];
    if (desc.length > 0) {
      const sentences = desc
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);
      if (sentences.length >= 2) {
        reason = [
          sentences[0].trim() + ". ",
          { ital: sentences[1].trim() },
          sentences.length > 2
            ? ". " + sentences.slice(2).join(". ").trim()
            : "",
        ];
      } else {
        reason = [desc];
      }
    } else {
      reason = [
        "teammate identified this as a key node in your knowledge graph. ",
        { ital: `${connections.length} relationships` },
        " connect it to other entities across your release.",
      ];
    }

    // Cross-references from connected nodes + recommended action
    const cross: Array<{ tag: string; text: string }> = [];

    // Add recommended action for intelligence hubs
    const recAction = props.recommendedAction as string;
    if (recAction) {
      cross.push({ tag: "Action", text: recAction.length > 90 ? recAction.slice(0, 88) + "\u2026" : recAction });
    }

    for (const cn of connectedNodes.slice(0, 3)) {
      cross.push({
        tag: CATEGORIES[cn.cat]?.label || cn.cat,
        text: cn.label.length > 80 ? cn.label.slice(0, 78) + "\u2026" : cn.label,
      });
    }

    if (cross.length === 0) {
      cross.push({ tag: "Graph", text: `Connected to ${connections.length} entities in your release.` });
    }

    stories.push({ cat, title, meta, reason, cross });
  }

  return stories;
}
