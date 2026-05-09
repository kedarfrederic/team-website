/**
 * Team Brain — orchestrator component.
 *
 * Composes data, interaction, and projection hooks with all
 * sub-components to render the full-screen 3D memory graph.
 */

import { useState, useEffect, useRef, useMemo, useCallback, type FC } from "react";
import type { TeamBrainProps, ProjectedNode, VisibleEdge } from "./types";
import { T, CATEGORIES, catDot } from "./types";
import { useTeamBrainData } from "./useTeamBrainData";
import { useTeamBrainInteraction } from "./useTeamBrainInteraction";
import { useTeamBrainProjection } from "./useTeamBrainProjection";
import { buildNarrativesFromGraph } from "./narratives";
import { getTimeAgo, type TickerItem } from "./TeamBrainTicker";
import TeamBrainCanvasLayer from "./TeamBrainCanvasLayer";
import TeamBrainNarrativePanel from "./TeamBrainNarrativePanel";
import TeamBrainTicker from "./TeamBrainTicker";
import TeamBrainLegend from "./TeamBrainLegend";
import TeamBrainStageChrome from "./TeamBrainStageChrome";
import { S } from "./orchestratorStyles";

type ExtendedProps = Partial<TeamBrainProps> & { hideChrome?: boolean; height?: number | string };

const TeamBrainVisualization: FC<ExtendedProps> = ({ releaseId, organizationId, onClose, hideChrome, height }) => {
  const { graph, narratives, stats, categoryCounts, isLoading, releaseName, rawData, chains } = useTeamBrainData(organizationId, releaseId);
  const safeOnClose = onClose ?? (() => {});
  const cam = useTeamBrainInteraction();
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showLines, setShowLines] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [tweaksOpen, setTweaksOpen] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [storyStep, setStoryStep] = useState(0);
  const [focused, setFocused] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [ticker, setTicker] = useState<TickerItem[]>([]);
  // Wait for valid size before projecting — prevents distorted first render
  const safeSize = size ?? { w: 1, h: 1 };
  const proj = useTeamBrainProjection(graph.nodes, cam.yaw, cam.pitch, cam.zoom, cam.density, safeSize);

  // ResizeObserver — re-runs when loading completes so it attaches to the stage div
  // (on first mount, isLoading=true → stage div doesn't exist → stageRef is null)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) setSize({ w: width, h: height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isLoading, graph.nodes.length]);

  useEffect(() => {
    if (!playing || !rawData) return;
    const sources: TickerItem[] = [];
    const catMap: Record<string, string> = { observation: "observations", decision: "decisions", conversation_fact: "conversations", workflow_pattern: "workflows", preference: "observations", outcome: "decisions", budget_pattern: "observations" };
    // Intelligence entries first (highest quality)
    const intel = (rawData as any).intelligenceEntries || [];
    for (const ie of (intel as any[]).slice(0, 6)) {
      sources.push({ cat: "decisions", text: (ie.title?.length > 50 ? ie.title.slice(0, 48) + "\u2026" : ie.title) || "Insight", fullText: ie.title || "Insight", dim: getTimeAgo(new Date(ie.createdAt)) });
    }
    // Filtered memories — skip noise (subtask logs, user messages, email ingestion)
    if (rawData.memories && (rawData.memories as any[]).length > 0) {
      const meaningful = [...(rawData.memories as any[])]
        .filter((m: any) => {
          const c = m.content || "";
          if (c.startsWith("Subtask ")) return false;
          if (c.startsWith("[user]:")) return false;
          if (c.startsWith("Email ") && c.includes("ingested")) return false;
          if (c.length < 15) return false;
          return true;
        })
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      for (const m of meaningful.slice(0, 6)) {
        sources.push({ cat: catMap[m.category] || "observations", text: m.content.length > 50 ? m.content.slice(0, 48) + "\u2026" : m.content, fullText: m.content, dim: getTimeAgo(new Date(m.createdAt)) });
      }
    }
    if (sources.length === 0) sources.push({ cat: "observations", text: "Studying release data\u2026", dim: "now" });
    let i = 0;
    const push = () => { setTicker((prev) => [sources[i % sources.length], ...prev].slice(0, 3)); i++; };
    push(); const iv = setInterval(push, 3200);
    return () => clearInterval(iv);
  }, [playing, rawData]);

  useEffect(() => {
    if (focused != null || !playing) return;
    const iv = setInterval(() => setStoryStep((s) => s + 1), 5200);
    return () => clearInterval(iv);
  }, [focused, playing]);

  const q = search.trim().toLowerCase();
  const isDim = useCallback((n: ProjectedNode) => {
    if (filter !== "all" && n.cat !== filter) return true;
    return q ? !n.label.toLowerCase().includes(q) && !n.cat.includes(q) : false;
  }, [filter, q]);

  const focusedNode = focused != null ? proj.nodeById.get(focused) ?? null : null;
  const focusedStory = useMemo(() => {
    if (!focusedNode) return null;
    const stories = buildNarrativesFromGraph([focusedNode], graph.edges.filter((e) => e.a === focusedNode.id || e.b === focusedNode.id));
    if (stories.length > 0) {
      const conns = graph.edges.filter((e) => e.a === focusedNode.id || e.b === focusedNode.id);
      stories[0].cross = conns.slice(0, 4).map((e) => { const oid = e.a === focusedNode.id ? e.b : e.a; return graph.nodes.find((nd) => nd.id === oid); }).filter(Boolean).map((cn) => ({ tag: CATEGORIES[cn!.cat]?.label || cn!.cat, text: cn!.label.length > 80 ? cn!.label.slice(0, 78) + "\u2026" : cn!.label }));
      if (stories[0].cross.length === 0) stories[0].cross.push({ tag: "Graph", text: `Connected to ${conns.length} other entities.` });
    }
    return stories[0] || null;
  }, [focusedNode, graph]);

  const autoStory = narratives.length > 0 ? narratives[storyStep % narratives.length] : null;
  const autoHub = useMemo(() => (!autoStory ? null : graph.nodes.find((n) => n.hub && n.cat === autoStory.cat) || graph.nodes.find((n) => n.hub) || null), [autoStory, graph]);
  const activeStory = focusedStory || autoStory;
  const activeHubId = focused != null ? focused : autoHub?.id ?? null;
  const activeHubProj = activeHubId != null ? proj.nodeById.get(activeHubId) ?? null : null;
  const visibleEdges: VisibleEdge[] = useMemo(() => graph.edges.map((e, idx) => { const a = e.a === activeHubId || e.b === activeHubId; if (e.strong || a || idx % 3 === 0) return { ...e, active: a }; return null; }).filter(Boolean) as VisibleEdge[], [graph.edges, activeHubId]);
  const hoveredNode = hovered != null ? proj.nodeById.get(hovered) ?? null : null;

  if (isLoading) return <div style={S.shell}><div style={S.center}><div style={{ color: T.fg3, fontSize: 14, fontFamily: T.fontSans }}>Loading knowledge graph...</div></div></div>;
  if (!rawData || graph.nodes.length === 0) return <div style={S.shell}><div style={S.center}><div style={{ fontSize: 16, fontWeight: 500, color: T.fg2, fontFamily: T.fontSans }}>Knowledge graph is empty</div><div style={{ fontSize: 13, color: T.fg3, fontFamily: T.fontSans }}>Build a strategy to start populating the graph.</div></div></div>;

  // Marketing-mode shell: render in-flow (relative positioned) instead of
  // the platform's fixed overlay. The platform uses this brain as a modal,
  // so its baseline shell is `position:fixed; inset:0; zIndex:100` — which
  // would cover the whole homepage if used directly.
  const marketingShell = hideChrome
    ? {
        ...S.shell,
        position: "relative" as const,
        inset: "auto" as any,
        zIndex: 0,
        height: height ?? "100%",
        width: "100%",
      }
    : { ...S.shell, ...(height ? { height } : {}) };

  return (
    <div style={marketingShell}>
      {!hideChrome && <TeamBrainStageChrome search={search} onSearchChange={setSearch} stats={stats!} onClose={safeOnClose} />}
      <div ref={stageRef} style={S.stage} onPointerDown={cam.onPointerDown} onPointerMove={cam.onPointerMove} onPointerUp={cam.onPointerUp} onPointerCancel={cam.onPointerUp} onWheel={cam.onWheel}>
        <div style={S.ambientGlow} />
        {size && <TeamBrainCanvasLayer sortedNodes={proj.sortedNodes} visibleEdges={visibleEdges} nodeById={proj.nodeById} fadeForDepth={proj.fadeForDepth} isDim={isDim} activeHubId={activeHubId} activeHubProjected={activeHubProj} showLines={showLines} hovered={hovered} onNodeHover={setHovered} onNodeClick={setFocused} size={size} />}
        {hoveredNode && <div style={S.nodeLabel(hoveredNode.sx, hoveredNode.sy)}><span style={catDot(CATEGORIES[hoveredNode.cat]?.color || "#888")} /><span>{hoveredNode.label}</span><span style={{ color: T.fg3 }}> · {hoveredNode.cat}{hoveredNode.hub ? " · hub" : ""}</span></div>}
        {showIntro && <div style={S.introCard}><div style={S.introEyebrow}>※ Team memory graph</div><h1 style={S.introH1}>Every rollout builds a <span style={S.ital}>brain</span>.</h1><p style={S.introP}>Each contact, task, observation, and decision becomes a memory.</p><button style={S.introClose} onClick={() => setShowIntro(false)}>×</button></div>}
        <TeamBrainNarrativePanel narrative={activeStory} visible={!!activeStory} pinned={focused != null} onUnpin={() => setFocused(null)} chain={chains[storyStep % Math.max(chains.length, 1)] ?? null} />
        <TeamBrainTicker items={ticker} panelOpen={!!activeStory} />
        <div style={S.stageControls}>
          <button style={cam.rotating ? S.ctrlOn : S.ctrl} onClick={() => cam.setRotating((r) => !r)} title="Auto-rotate">↻</button>
          <button style={playing ? { ...S.ctrlOn, background: "rgba(192,236,95,0.12)" } : S.ctrl} onClick={() => setPlaying((p) => !p)} title="Live">{playing ? "⏸" : "▶"}</button>
          <button style={tweaksOpen ? S.ctrlOn : S.ctrl} onClick={() => setTweaksOpen((t) => !t)} title="Tweaks">☰</button>
        </div>
        {tweaksOpen && <div style={S.tweaks}><div style={S.tweaksLabel}>※ Tweaks</div>
          <div style={S.tweakRow}><label style={{ color: T.fg2 }}>Rotation</label><div style={S.seg}>{([0, 0.4, 0.8, 1.4] as const).map((s) => <button key={s} style={cam.rotSpeed === s ? S.segBtnA : S.segBtn} onClick={() => { cam.setRotSpeed(s); cam.setRotating(s > 0); }}>{s === 0 ? "off" : s === 0.4 ? "slow" : s === 0.8 ? "med" : "fast"}</button>)}</div></div>
          <div style={S.tweakRow}><label style={{ color: T.fg2 }}>Density</label><input type="range" min="0.6" max="1.3" step="0.05" value={cam.density} onChange={(e) => cam.setDensity(parseFloat(e.target.value))} style={{ width: 100, accentColor: T.lime500 }} /></div>
          <div style={S.tweakRow}><label style={{ color: T.fg2 }}>Lines</label><div style={S.seg}><button style={showLines ? S.segBtnA : S.segBtn} onClick={() => setShowLines(true)}>on</button><button style={!showLines ? S.segBtnA : S.segBtn} onClick={() => setShowLines(false)}>off</button></div></div>
          <div style={S.tweakRow}><label style={{ color: T.fg2 }}>Zoom</label><input type="range" min="0.6" max="2" step="0.05" value={cam.zoom} onChange={(e) => cam.setZoom(parseFloat(e.target.value))} style={{ width: 100, accentColor: T.lime500 }} /></div>
        </div>}
        <div style={S.brand}><span style={S.brandSep} /><span style={S.brandCrumb}>Memory graph · {releaseName}</span></div>
      </div>
      <TeamBrainLegend filter={filter} onFilterChange={setFilter} categoryCounts={categoryCounts} />
    </div>
  );
};

export default TeamBrainVisualization;
