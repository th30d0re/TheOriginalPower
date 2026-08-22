// Registry that resolves a scene's VisualSpec to a concrete rendered visual.
// Contract: default export, takes { spec }, switches on spec.kind. See
// src/content/types.ts for the discriminated union this renders.
import { lazy, Suspense, type ComponentType } from 'react';
import type { VisualSpec } from '../../content/types';
import VennDiagram from '../../components/visualizations/VennDiagram';
import Timeline from '../../components/visualizations/Timeline';
import OutgroupExpansion from '../../components/visualizations/OutgroupExpansion';
import CompoundingMetrics from '../../components/visualizations/CompoundingMetrics';
import PhasorResonance from '../../components/visualizations/PhasorResonance';
import ManimPlayer from './ManimPlayer';
import Equation from './Equation';
import { StoryEquationCard } from '../../components/EquationCards';
import { findStoryEquation } from '../../content/equations/story';
import SeriesChart from './SeriesChart';
import TierLadder from './TierLadder';
import './visuals.css';

const InterferenceEngine3D = lazy(
  () => import('../../components/visualizations/InterferenceEngine3D'),
);
const ExtractionChart = lazy(() => import('../../components/visualizations/ExtractionChart'));

/** Bespoke chapter visuals register themselves here by name. Empty for now. */
const customVisuals: Record<string, ComponentType<Record<string, unknown>>> = {};

const Caption = ({ text }: { text?: string }) =>
  text ? <figcaption className="visual-caption">{text}</figcaption> : null;

const SceneVisual = ({ spec, chapterFile, equationOccurrence }: {
  spec: VisualSpec;
  chapterFile?: string;
  equationOccurrence?: number;
}) => {
  switch (spec.kind) {
    case 'venn':
      return (
        <figure className="visual-figure">
          <VennDiagram data={spec.data} />
          <Caption text={spec.caption} />
        </figure>
      );

    case 'timeline':
      return (
        <figure className="visual-figure">
          <Timeline data={spec.data} />
          <Caption text={spec.caption} />
        </figure>
      );

    case 'expansion':
      return (
        <figure className="visual-figure">
          <OutgroupExpansion />
          <Caption text={spec.caption} />
        </figure>
      );

    case 'compounding':
      return (
        <figure className="visual-figure">
          <CompoundingMetrics />
          <Caption text={spec.caption} />
        </figure>
      );

    case 'phasor':
      return (
        <figure className="visual-figure">
          <PhasorResonance />
          <Caption text={spec.caption} />
        </figure>
      );

    case 'interference':
      return (
        <figure className="visual-figure">
          <div className="embedded-visual-frame">
            <Suspense fallback={<div className="visual-placeholder">Loading visualization…</div>}>
              <InterferenceEngine3D />
            </Suspense>
          </div>
          <Caption text={spec.caption} />
        </figure>
      );

    case 'extractionChart':
      return (
        <figure className="visual-figure">
          <div className="embedded-visual-frame">
            <Suspense fallback={<div className="visual-placeholder">Loading visualization…</div>}>
              <ExtractionChart />
            </Suspense>
          </div>
          <Caption text={spec.caption} />
        </figure>
      );

    case 'series':
      return (
        <figure className="visual-figure">
          <SeriesChart
            series={spec.series}
            xLabel={spec.xLabel}
            yLabel={spec.yLabel}
            area={spec.area}
          />
          <Caption text={spec.caption} />
        </figure>
      );

    case 'tierLadder':
      return (
        <figure className="visual-figure">
          <TierLadder tiers={spec.tiers} />
          <Caption text={spec.caption} />
        </figure>
      );

    case 'manim':
      return <ManimPlayer src={spec.src} caption={spec.caption} />;

    case 'equation': {
      const entry = chapterFile === undefined || equationOccurrence === undefined
        ? undefined
        : findStoryEquation(chapterFile, equationOccurrence);
      if (entry === undefined || entry.enrichment === 'none') {
        return <Equation latex={spec.latex} label={spec.label} caption={spec.caption} />;
      }
      return <StoryEquationCard entry={entry} latex={spec.latex} label={spec.label} caption={spec.caption} />;
    }

    case 'custom': {
      const Custom = customVisuals[spec.component];
      if (!Custom) {
        return (
          <figure className="visual-figure">
            <div className="visual-placeholder">
              Visual &ldquo;{spec.component}&rdquo; is not registered yet.
            </div>
            <Caption text={spec.caption} />
          </figure>
        );
      }
      return (
        <figure className="visual-figure">
          <Custom {...(spec.props ?? {})} />
          <Caption text={spec.caption} />
        </figure>
      );
    }

    default: {
      // Exhaustiveness guard: if VisualSpec grows a new kind, this fails to compile.
      const _exhaustive: never = spec;
      return _exhaustive;
    }
  }
};

export default SceneVisual;
