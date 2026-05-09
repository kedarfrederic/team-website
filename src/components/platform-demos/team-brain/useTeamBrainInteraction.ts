/**
 * Team Brain — interaction hook.
 *
 * Manages camera state (yaw, pitch, zoom), auto-rotation,
 * drag-to-spin, and scroll-to-zoom.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

export function useTeamBrainInteraction() {
  const [yaw, setYaw] = useState(-0.6);
  const [pitch, setPitch] = useState(0.12);
  const [zoom, setZoom] = useState(1);
  const [rotating, setRotating] = useState(true);
  const [density, setDensity] = useState(1);
  const [rotSpeed, setRotSpeed] = useState(0.8);

  // ── Auto-rotate ─────────────────────────────────────────

  useEffect(() => {
    if (!rotating) return;
    let raf: number;
    let last = performance.now();
    const FRAME_INTERVAL = 33; // ~30fps instead of 60fps
    const tick = (t: number) => {
      const dt = t - last;
      if (dt >= FRAME_INTERVAL) {
        const dtSec = dt / 1000;
        last = t;
        setYaw((y) => y + dtSec * 0.25 * rotSpeed);
        setPitch((p) => p + Math.sin(t / 6200) * 0.0004 * rotSpeed);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotating, rotSpeed]);

  // ── Drag to spin ────────────────────────────────────────

  const dragState = useRef({ active: false, x: 0, y: 0 });

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      dragState.current = { active: true, x: e.clientX, y: e.clientY };
      setRotating(false);
      (e.currentTarget as HTMLDivElement).style.cursor = "grabbing";
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragState.current.active) return;
      const dx = e.clientX - dragState.current.x;
      const dy = e.clientY - dragState.current.y;
      dragState.current.x = e.clientX;
      dragState.current.y = e.clientY;
      setYaw((y) => y + dx * 0.006);
      setPitch((p) =>
        Math.max(-1.2, Math.min(1.2, p + dy * 0.005)),
      );
    },
    [],
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      dragState.current.active = false;
      (e.currentTarget as HTMLDivElement).style.cursor = "grab";
    },
    [],
  );

  const onWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      setZoom((z) =>
        Math.max(0.55, Math.min(2.2, z - e.deltaY * 0.0012)),
      );
    },
    [],
  );

  return {
    yaw,
    pitch,
    zoom,
    rotating,
    density,
    rotSpeed,
    setYaw,
    setPitch,
    setZoom,
    setRotating,
    setDensity,
    setRotSpeed,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
  };
}
