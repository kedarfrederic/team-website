/**
 * Custom VisualEditing wrapper that bypasses @sanity/astro's hardcoded
 * window.location.reload() refresh handler.
 *
 * Background: @sanity/astro/visual-editing fires window.location.reload()
 * on every refresh event from Studio — including the per-keystroke
 * "mutation" events that visual-editing's overlay sends as the editor
 * types. That kills scroll position, re-runs GSAP from scratch, and
 * makes the iframe unusable for live editing.
 *
 * The fix: return false for mutation events (Visual Editing's optimistic
 * UI handles in-place text updates via postMessage — no fetch needed),
 * and only reload for explicit manual refresh.
 */
import { VisualEditing as InternalVisualEditing } from "@sanity/visual-editing/react";

export default function VisualEditingClient({ zIndex }: { zIndex?: number }) {
  return (
    <InternalVisualEditing
      portal
      zIndex={zIndex}
      refresh={(payload) => {
        // Mutation = editor typed something. Optimistic UI handles it
        // in-place; we don't need to re-fetch or reload.
        if (payload.source === "mutation") return false;
        // Manual refresh (e.g. editor clicks the refresh button) → reload.
        return new Promise<void>((resolve) => {
          window.location.reload();
          resolve();
        });
      }}
    />
  );
}
