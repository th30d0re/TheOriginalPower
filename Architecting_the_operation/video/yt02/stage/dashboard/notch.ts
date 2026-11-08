// The five-tier notch's episode-specific visibility policy.
import {progress, usePlan, useStageMs, type Segment} from '@stage';

export {notchPath} from '@stage';

export const MAP_SCENES = new Set(['DashboardBoot', 'Dashboard1486', 'RoadmapBoot']);
export const NOTCH_MS = 900;

export function useNotch(segment: Segment): number {
  const ms = useStageMs();
  const plan = usePlan();
  const map = MAP_SCENES.has(segment.scene);
  const index = plan.segments.findIndex((candidate) => candidate.instance === segment.instance && candidate.start_ms === segment.start_ms);
  const previous = index > 0 ? plan.segments[index - 1] : undefined;
  if (!previous || MAP_SCENES.has(previous.scene) === map) return map ? 0 : 1;
  const transition = progress(ms, segment.start_ms, segment.start_ms + NOTCH_MS);
  return map ? 1 - transition : transition;
}
