/**
 * Team Brain — Canvas rendering layer with rAF draw loop.
 *
 * All visual data is stored in refs. The draw loop runs via
 * requestAnimationFrame, completely decoupled from React's
 * render cycle. React only handles mount/unmount and passing
 * new data into refs — the canvas redraws independently.
 */

import { useRef, useEffect, useCallback, memo, type FC } from "react";
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

const DPR = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
const TWO_PI = Math.PI * 2;

/** Draw a single frame — pure function, no React involvement */
function drawFrame(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  nodes: ProjectedNode[],
  edges: VisibleEdge[],
  nodeById: Map<string, ProjectedNode>,
  fadeForDepth: (d: number) => number,
  isDim: (n: ProjectedNode) => boolean,
  activeHubId: string | null,
  showLines: boolean,
  hovered: string | null,
) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // Edges — batch by style to minimize state changes
  if (showLines) {
    for (const e of edges) {
      const a = nodeById.get(e.a);
      const b = nodeById.get(e.b);
      if (!a || !b) continue;
      const anyDim = isDim(a) || isDim(b);
      const fade = fadeForDepth((a.depth + b.depth) / 2);
      if (e.active) {
        ctx.strokeStyle = T.lime500;
        ctx.globalAlpha = 0.55 * fade;
        ctx.lineWidth = 1.1;
      } else if (e.strong) {
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = 0.22 * fade * (anyDim ? 0.25 : 1);
        ctx.lineWidth = 0.9;
      } else {
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = 0.07 * fade * (anyDim ? 0.2 : 1);
        ctx.lineWidth = 0.6;
      }
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }
  }

  // Nodes (back-to-front, already sorted)
  for (const n of nodes) {
    const cat = CATEGORIES[n.cat];
    if (!cat) continue;
    const dim = isDim(n);
    const fade = fadeForDepth(n.depth);
    const r = Math.max(4, 4.5 * n.r * n.depthFactor);
    const isHov = hovered === n.id;
    const isActive = activeHubId === n.id;
    const baseOpacity = (dim ? 0.12 : 1) * fade;
    const health = typeof n.properties?.health === "number" ? n.properties.health as number : -1;
    const nodeColor = health >= 0
      ? health < 0.4 ? "#E83E18" : health < 0.7 ? "#F5A623" : "#7ED321"
      : cat.color;

    // Hub glow
    if (n.hub && !dim) {
      ctx.globalAlpha = 0.12 * fade;
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, r * 3, 0, TWO_PI);
      ctx.fill();
    }

    // Active pulse ring
    if (isActive) {
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = T.lime500;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, r * 1.4, 0, TWO_PI);
      ctx.stroke();
    }

    // Node circle
    ctx.globalAlpha = baseOpacity;
    ctx.fillStyle = nodeColor;
    ctx.beginPath();
    ctx.arc(n.sx, n.sy, isHov ? r * 1.5 : r, 0, TWO_PI);
    ctx.fill();

    // Active white ring
    if (isActive) {
      ctx.globalAlpha = 0.9 * fade;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, r * 1.15, 0, TWO_PI);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
}

const TeamBrainCanvasLayer: FC<Props> = ({
  sortedNodes, visibleEdges, nodeById, fadeForDepth, isDim,
  activeHubId, showLines, hovered, onNodeHover, onNodeClick, size,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store all visual data in refs — the draw loop reads these
  const dataRef = useRef({
    nodes: sortedNodes, edges: visibleEdges, nodeById, fadeForDepth,
    isDim, activeHubId, showLines, hovered, w: size.w, h: size.h,
  });
  // Update refs on every prop change (cheap — no render triggered)
  dataRef.current = {
    nodes: sortedNodes, edges: visibleEdges, nodeById, fadeForDepth,
    isDim, activeHubId, showLines, hovered, w: size.w, h: size.h,
  };

  // Dirty flag — set when data changes, cleared after draw
  const dirtyRef = useRef(true);
  useEffect(() => { dirtyRef.current = true; });

  // Resize canvas when size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size.w * DPR;
    canvas.height = size.h * DPR;
    dirtyRef.current = true;
  }, [size.w, size.h]);

  // rAF draw loop — runs independently of React
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;

    const tick = () => {
      if (dirtyRef.current) {
        const d = dataRef.current;
        drawFrame(ctx, d.w, d.h, d.nodes, d.edges, d.nodeById, d.fadeForDepth, d.isDim, d.activeHubId, d.showLines, d.hovered);
        dirtyRef.current = false;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []); // mount once — loop runs forever

  // Hit detection — find nearest node to pointer
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const nodes = dataRef.current.nodes;

    let closest: string | null = null;
    let closestDist = 400; // squared max distance (20px)
    for (let i = nodes.length - 1; i >= 0; i--) { // front-to-back for correct z-order
      const n = nodes[i];
      const dx = n.sx - mx;
      const dy = n.sy - my;
      const distSq = dx * dx + dy * dy;
      const hitR = Math.max(12, 4.5 * n.r * n.depthFactor * 2.5);
      if (distSq < hitR * hitR && distSq < closestDist) {
        closestDist = distSq;
        closest = n.id;
      }
    }
    onNodeHover(closest);
  }, [onNodeHover]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const nodes = dataRef.current.nodes;

    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = n.sx - mx;
      const dy = n.sy - my;
      const hitR = Math.max(12, 4.5 * n.r * n.depthFactor * 2.5);
      if (dx * dx + dy * dy < hitR * hitR) {
        onNodeClick(n.id);
        return;
      }
    }
  }, [onNodeClick]);

  return (
    <canvas
      ref={canvasRef}
      width={size.w * DPR}
      height={size.h * DPR}
      style={{ display: "block", width: "100%", height: "100%", cursor: hovered ? "pointer" : "default" }}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    />
  );
};

export default memo(TeamBrainCanvasLayer);
