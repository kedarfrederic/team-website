/**
 * Team Brain — SVG rendering layer.
 *
 * Renders edges, energy pulses, and node circles with glow
 * and pulse rings inside a single SVG element.
 */

import { type FC, memo } from "react";
import { T, CATEGORIES } from "./types";
import type { ProjectedNode, VisibleEdge } from "./types";

interface Props {
  sortedNodes: ProjectedNode[];
  visibleEdges: VisibleEdge[];
  nodeById: Map<string, ProjectedNode>;
  fadeForDepth: (d: number) => number;
  isDim: (n: ProjectedNode) => boolean;
  activeHubId: string | null;
  activeHubProjected: ProjectedNode | null;
  showLines: boolean;
  hovered: string | null;
  onNodeHover: (id: string | null) => void;
  onNodeClick: (id: string) => void;
  size: { w: number; h: number };
}

const TeamBrainSvgLayer: FC<Props> = ({
  sortedNodes, visibleEdges, nodeById, fadeForDepth,
  isDim, activeHubId, activeHubProjected, showLines,
  hovered, onNodeHover, onNodeClick, size,
}) => (
  <svg
    viewBox={`0 0 ${size.w} ${size.h}`}
    preserveAspectRatio="xMidYMid meet"
    style={{ display: "block", width: "100%", height: "100%" }}
  >
    <defs>
      <radialGradient id="brainNodeGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="70%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <filter id="brainSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* Edges */}
    {showLines && visibleEdges.map((e, i) => {
      const a = nodeById.get(e.a);
      const b = nodeById.get(e.b);
      if (!a || !b) return null;
      const anyDim = isDim(a) || isDim(b);
      const fade = fadeForDepth((a.depth + b.depth) / 2);
      let stroke: string, opacity: number, width: number;
      if (e.active) { stroke = T.lime500; opacity = 0.55 * fade; width = 1.1; }
      else if (e.strong) { stroke = "#ffffff"; opacity = 0.22 * fade * (anyDim ? 0.25 : 1); width = 0.9; }
      else { stroke = "#ffffff"; opacity = 0.07 * fade * (anyDim ? 0.2 : 1); width = 0.6; }
      return <line key={`e-${i}`} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke={stroke} strokeOpacity={opacity} strokeWidth={width} />;
    })}

    {/* Energy pulses along active hub edges */}
    {activeHubProjected && showLines && visibleEdges
      .filter((e) => e.active).slice(0, 18)
      .map((e, i) => {
        const a = nodeById.get(e.a);
        const b = nodeById.get(e.b);
        if (!a || !b) return null;
        const other = a.id === activeHubId ? b : a;
        const dur = `${2 + (i % 4) * 0.4}s`;
        const begin = `${(i * 0.11) % 1.5}s`;
        return (
          <circle key={`p-${i}`} r="1.8" fill={T.lime500}>
            <animate attributeName="cx" dur={dur} repeatCount="indefinite" values={`${activeHubProjected.sx};${other.sx}`} begin={begin} />
            <animate attributeName="cy" dur={dur} repeatCount="indefinite" values={`${activeHubProjected.sy};${other.sy}`} begin={begin} />
            <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="0;1;0" begin={begin} />
          </circle>
        );
      })}

    {/* Nodes back-to-front */}
    {sortedNodes.map((n) => {
      const cat = CATEGORIES[n.cat];
      if (!cat) return null;
      const dim = isDim(n);
      const fade = fadeForDepth(n.depth);
      const r = Math.max(4, 4.5 * n.r * n.depthFactor);
      const hitR = Math.max(12, r * 2.5);
      const isHov = hovered === n.id;
      const isActive = activeHubId === n.id;
      const baseOpacity = (dim ? 0.12 : 1) * fade;
      // Health-based color: red (0) → yellow (0.5) → green (1.0)
      const health = typeof n.properties?.health === "number" ? n.properties.health as number : -1;
      const nodeColor = health >= 0
        ? health < 0.4 ? "#E83E18" : health < 0.7 ? "#F5A623" : "#7ED321"
        : cat.color;
      return (
        <g key={n.id} style={{ cursor: "pointer" }}>
          {n.hub && !dim && <circle cx={n.sx} cy={n.sy} r={r * 3} fill={nodeColor} opacity={0.12 * fade} />}
          {isActive && (
            <circle cx={n.sx} cy={n.sy} r={r * 1.4} fill="none" stroke={T.lime500} strokeWidth="1" opacity="0.7"
              style={{ transformOrigin: `${n.sx}px ${n.sy}px`, animation: "teamBrainPulse 2.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite" }} />
          )}
          <circle cx={n.sx} cy={n.sy} r={isHov ? r * 1.5 : r} fill={nodeColor} opacity={baseOpacity}
            style={{ transition: "all 150ms ease-out" }} />
          {/* Invisible hit target — much larger than visual node */}
          <circle cx={n.sx} cy={n.sy} r={hitR} fill="transparent"
            onMouseEnter={() => onNodeHover(n.id)} onMouseLeave={() => onNodeHover(null)}
            onClick={() => onNodeClick(n.id)}
            style={{ pointerEvents: "auto" }} />
          {isActive && <circle cx={n.sx} cy={n.sy} r={r * 1.15} fill="none" stroke="#fff" strokeWidth="1.2" opacity={0.9 * fade} />}
        </g>
      );
    })}
  </svg>
);

export default memo(TeamBrainSvgLayer);
