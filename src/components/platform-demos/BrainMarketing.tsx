/**
 * Marketing-site wrapper for the platform's TeamBrainVisualization.
 * Hides the platform chrome (close button, search bar, stats panel)
 * and injects a fixed height suitable for an in-page section.
 */
import TeamBrainVisualization from "./team-brain/TeamBrainVisualization";

export default function BrainMarketing({ height = 600 }: { height?: number | string }) {
  return <TeamBrainVisualization hideChrome height={height} />;
}
