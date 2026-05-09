/**
 * Team Brain — 3D projection hook.
 *
 * Projects BrainNodes from 3D world space to 2D screen space,
 * applies density scaling, computes depth fade, and sorts
 * nodes back-to-front for correct painter's-algorithm rendering.
 */

import { useMemo, useCallback } from "react";
import type { BrainNode } from "./teamBrainDataAdapter";
import type { ProjectedNode } from "./types";

interface Size {
  w: number;
  h: number;
}

export function useTeamBrainProjection(
  nodes: BrainNode[],
  yaw: number,
  pitch: number,
  zoom: number,
  density: number,
  size: Size,
) {
  const projected: ProjectedNode[] = useMemo(() => {
    const cy = Math.cos(yaw),
      sy = Math.sin(yaw);
    const cp = Math.cos(pitch),
      sp = Math.sin(pitch);
    const cx = size.w / 2,
      cyy = size.h / 2;
    const perspective = 900;
    const scale = (Math.min(size.w, size.h) * 0.9 * zoom) / 700;

    return nodes.map((n) => {
      const x0 = n.x * density,
        y0 = n.y * density,
        z0 = n.z * density;
      const x1 = x0 * cy + z0 * sy;
      const z1 = -x0 * sy + z0 * cy;
      const y2 = y0 * cp - z1 * sp;
      const z2 = y0 * sp + z1 * cp;
      const depthFactor = perspective / (perspective + z2);
      const sx = cx + x1 * scale * depthFactor;
      const sy2 = cyy + y2 * scale * depthFactor;
      return { ...n, sx, sy: sy2, depth: z2, depthFactor };
    });
  }, [nodes, yaw, pitch, zoom, density, size.w, size.h]);

  const nodeById = useMemo(() => {
    const m = new Map<string, ProjectedNode>();
    projected.forEach((n) => m.set(n.id, n));
    return m;
  }, [projected]);

  const sortedNodes = useMemo(
    () => [...projected].sort((a, b) => b.depth - a.depth),
    [projected],
  );

  const [dMin, dMax] = useMemo(() => {
    let mn = Infinity,
      mx = -Infinity;
    projected.forEach((n) => {
      if (n.depth < mn) mn = n.depth;
      if (n.depth > mx) mx = n.depth;
    });
    return [mn, mx] as const;
  }, [projected]);

  const fadeForDepth = useCallback(
    (d: number) => {
      const t = (d - dMin) / (dMax - dMin + 1e-6);
      return 1 - t * 0.75;
    },
    [dMin, dMax],
  );

  return {
    projected,
    nodeById,
    sortedNodes,
    fadeForDepth,
    dMin,
    dMax,
  };
}
