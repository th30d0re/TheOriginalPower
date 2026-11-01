import React, {useContext, useState} from 'react';
import {
  ClockContext,
  resolveMode,
  useTokens,
  type InstrumentMode,
  type Rect,
} from '@stage';
import type {DashboardInstrumentProps} from '../DashboardInstrument';
import {PanelContent, TrayModeControlContext} from '../PanelContent';
import {WAGE_EXPANDED_BOX} from '../ComplexWagePlane';

const modes: InstrumentMode[] = ['compact', 'expanded', 'settings'];

// Every tray instrument grows from its tray cell up to the same centred card used by the
// Complex Wage Plane in fix pass 3.
export const TRAY_EXPANDED_BOX: Rect = WAGE_EXPANDED_BOX;

export type TrayInteractionEvent =
  | 'hover-compact'
  | 'click-compact'
  | 'click-gear'
  | 'click-close';

export function transitionTrayMode(
  current: InstrumentMode,
  event: TrayInteractionEvent,
): InstrumentMode {
  if (event === 'hover-compact' || event === 'click-compact') {
    return current === 'settings' ? 'settings' : 'expanded';
  }
  if (event === 'click-gear') {
    return current === 'settings' ? 'expanded' : 'settings';
  }
  return 'compact';
}

export type TrayArtifactProps = DashboardInstrumentProps & {name: string};

export function TrayArtifact(props: TrayArtifactProps) {
  const {interactive} = useContext(ClockContext);
  return interactive ? <InteractiveTrayArtifact {...props} /> : <TrayArtifactFrame {...props} />;
}

function InteractiveTrayArtifact(props: TrayArtifactProps) {
  const [override, setOverride] = useState<InstrumentMode | null>(null);
  const changeOverride = (next: InstrumentMode | null) => {
    setOverride(next);
    props.onInteractiveModeChange?.(next);
  };
  return <TrayArtifactFrame {...props} override={override} changeOverride={changeOverride} />;
}

function TrayArtifactFrame(
  props: TrayArtifactProps & {
    override?: InstrumentMode | null;
    changeOverride?: (mode: InstrumentMode | null) => void;
  },
) {
  const {ms, interactive} = useContext(ClockContext);
  const tokens = useTokens();
  const {override, changeOverride} = props;
  const resolved = resolveMode(ms, props.modeTimeline ?? []);
  let weights = resolved.weights;
  if (props.mode) {
    weights = {
      compact: Number(props.mode === 'compact'),
      expanded: Number(props.mode === 'expanded'),
      settings: Number(props.mode === 'settings'),
    };
  }
  if (interactive && override) {
    weights = {
      compact: Number(override === 'compact'),
      expanded: Number(override === 'expanded'),
      settings: Number(override === 'settings'),
    };
  }
  const anchored: Record<InstrumentMode, Rect> = {
    compact: props.anchor,
    expanded: TRAY_EXPANDED_BOX,
    settings: TRAY_EXPANDED_BOX,
  };
  const rect: Rect = {x: 0, y: 0, width: 0, height: 0};
  for (const m of modes) {
    const r = anchored[m];
    rect.x += weights[m] * r.x;
    rect.y += weights[m] * r.y;
    rect.width += weights[m] * r.width;
    rect.height += weights[m] * r.height;
  }
  const active = modes.reduce((a, b) => (weights[a] >= weights[b] ? a : b));
  const elevated = active !== 'compact' || weights.expanded > 0 || weights.settings > 0;

  return (
    <TrayModeControlContext.Provider value={changeOverride ?? null}>
      <section
        data-instrument={props.name.toLowerCase().replaceAll(' ', '-')}
        data-active-mode={active}
        onMouseEnter={() => {
          if (interactive && active === 'compact') {
            changeOverride?.(transitionTrayMode(active, 'hover-compact'));
          }
        }}
        onClick={() => {
          if (interactive && active === 'compact') {
            changeOverride?.(transitionTrayMode(active, 'click-compact'));
          }
        }}
        style={{
          position: 'absolute',
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          background: 'transparent',
          border: 'none',
          borderRadius: 0,
          overflow: 'hidden',
          boxSizing: 'border-box',
          opacity: props.opacity ?? 1,
          zIndex: elevated ? 50 : undefined,
        }}
      >
        {modes
          .filter(m => weights[m] > 0)
          .map(m => (
            <div
              key={m}
              aria-hidden={active !== m}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: weights[m],
                pointerEvents: active === m ? 'auto' : 'none',
                visibility: weights[m] === 0 ? 'hidden' : 'visible',
              }}
            >
              <PanelContent name={props.name} mode={m} />
            </div>
          ))}
        {interactive && active === 'compact' && (
          <button
            type="button"
            data-control="gear"
            data-action="open-settings"
            aria-label="Open settings"
            onClick={e => {
              e.stopPropagation();
              changeOverride?.(transitionTrayMode(active, 'click-gear'));
            }}
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 24,
              height: 24,
              padding: 0,
              background: tokens.colours.glass,
              color: tokens.colours.text,
              border: `1.4px solid ${tokens.colours.border}`,
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            ⚙
          </button>
        )}
      </section>
    </TrayModeControlContext.Provider>
  );
}
