import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import TierLadder from '../story/visuals/TierLadder';
import LatexProse from './LatexProse';
import ReadAloud from './ReadAloud';
import type { WordHighlight } from './ReadAloud';
import { latexToSpeech, splitIntoSentences } from './speechText';
import { conceptDefinition } from './conceptRegistry';
import AxisDeflection from './widgets/AxisDeflection';
import ConjugateCancel from './widgets/ConjugateCancel';
import CyclotronLoop from './widgets/CyclotronLoop';
import WagePhasor from './widgets/WagePhasor';
import type { Tier } from '../content/types';
import type { VideolabJob } from './types';
import { record, seconds, text } from './types';
import './videolab.css';

function useJobs() {
  const [jobs, setJobs] = useState<VideolabJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/videolab/jobs.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((value) => {
        if (!Array.isArray(value)) throw new Error('The videolab export is not an array.');
        setJobs(value as VideolabJob[]);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setError(reason instanceof Error ? reason.message : 'Unable to load videolab jobs.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);
  return { jobs, error, loading };
}

function Value({ value }: { value: unknown }): ReactNode {
  if (Array.isArray(value)) {
    return <ul>{value.map((item, index) => <li key={index}><Value value={item} /></li>)}</ul>;
  }
  if (value !== null && typeof value === 'object') {
    return <div className="vl-nested">{Object.entries(value).map(([key, item]) => (
      <div key={key}><h4>{key.replaceAll('_', ' ')}</h4><Value value={item} /></div>
    ))}</div>;
  }
  return <p><LatexProse text={value === null || value === undefined ? '—' : String(value)} /></p>;
}

function valueSentences(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(valueSentences);
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(valueSentences);
  return splitIntoSentences(value === null || value === undefined ? '—' : String(value));
}

// While the Siri helper speaks, word ranges index the latexToSpeech() output of
// the sentence, so render that same spoken string with the current word marked
// instead of the raw source.
function SpokenHighlight({ sentence, words }: { sentence: string; words: WordHighlight }) {
  const spoken = latexToSpeech(sentence);
  const start = Math.min(words.start, spoken.length);
  const end = Math.min(start + words.length, spoken.length);
  return <>{spoken.slice(0, start)}<mark className="read-aloud-word">{spoken.slice(start, end)}</mark>{spoken.slice(end)}</>;
}

function ReadableValue({ value, label }: { value: unknown; label: string }) {
  const sentences = valueSentences(value);
  return <ReadAloud sentences={sentences} label={label}>{({ activeSentence, activeWords }) => {
    let sentenceIndex = 0;
    const renderValue = (item: unknown): ReactNode => {
      if (Array.isArray(item)) return <ul>{item.map((entry, index) => <li key={index}>{renderValue(entry)}</li>)}</ul>;
      if (item !== null && typeof item === 'object') {
        return <div className="vl-nested">{Object.entries(item).map(([key, entry]) => <div key={key}><h4>{key.replaceAll('_', ' ')}</h4>{renderValue(entry)}</div>)}</div>;
      }
      const itemSentences = splitIntoSentences(item === null || item === undefined ? '—' : String(item));
      return <p>{itemSentences.map((sentence) => {
        const index = sentenceIndex++;
        const words = activeWords && activeWords.sentence === index ? activeWords : null;
        return <span className={activeSentence === index ? 'read-aloud-sentence is-active' : 'read-aloud-sentence'} key={index}>{words ? <SpokenHighlight sentence={sentence} words={words} /> : <LatexProse text={sentence} />}{' '}</span>;
      })}</p>;
    };
    return renderValue(value);
  }}</ReadAloud>;
}

function Status({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) return <div className="vl-state">Loading videolab jobs…</div>;
  if (error) return <div className="vl-state vl-error">{error}</div>;
  return null;
}

export function VideolabIndex() {
  const { jobs, error, loading } = useJobs();
  return (
    <div className="vl-page">
      <header className="vl-hero"><p className="vl-kicker">Evidence workspace</p><h1>Video analyses</h1><p>Pipeline artifacts connected to the framework visual library.</p></header>
      <Status loading={loading} error={error} />
      {!loading && !error && jobs.length === 0 ? <div className="vl-state">No exported jobs are available.</div> : null}
      <div className="vl-job-grid">
        {jobs.map((job) => (
          <Link className="vl-job-card" to={`/videolab/${encodeURIComponent(job.slug)}`} key={job.slug}>
            <div className="vl-card-line"><span className={`vl-health vl-${job.status}`} />{text(job.platform, 'Unknown platform')}<span>{seconds(job.duration_seconds)}</span></div>
            <h2>{text(job.title, job.slug)}</h2>
            <p>{text(job.creator.display_name, text(job.creator.username, 'Unknown creator'))}</p>
            <div className="vl-mini-concepts">{job.concepts.map((id) => <span key={id}>{conceptDefinition(id).title}</span>)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const VALID_AXES = new Set(['race', 'gender', 'sexuality', 'class', 'disability', 'religion', 'age', 'nationality', 'neurodivergence']);

function numberIn(value: unknown, minimum: number, maximum: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum;
}

function widgetVisual(type: unknown, params: Record<string, unknown>) {
  if (type === 'wage_phasor') {
    const thetaDeg = params.theta_deg;
    const psiM = params.psi_m;
    const psiS = params.psi_s;
    return numberIn(thetaDeg, 0, 180) && numberIn(psiM, -1, 1) && numberIn(psiS, 0, 1)
      ? <WagePhasor thetaDeg={thetaDeg} psiM={psiM} psiS={psiS} /> : null;
  }
  if (type === 'axis_deflection') {
    const axes = params.axes;
    const eAmplitude = params.e_amplitude;
    const bAmplitude = params.b_amplitude;
    const validAxes = Array.isArray(axes) && axes.length >= 1 && axes.length <= 3
      && axes.every((axis) => typeof axis === 'string' && VALID_AXES.has(axis))
      && new Set(axes).size === axes.length;
    return validAxes && numberIn(eAmplitude, 0, 1) && numberIn(bAmplitude, 0, 1)
      ? <AxisDeflection axes={axes as string[]} eAmplitude={eAmplitude} bAmplitude={bAmplitude} /> : null;
  }
  if (type === 'cyclotron_loop') {
    const eMagnitude = params.e_magnitude;
    const bMagnitude = params.b_magnitude;
    return numberIn(eMagnitude, 0, 1) && numberIn(bMagnitude, 0, 1)
      ? <CyclotronLoop eMagnitude={eMagnitude} bMagnitude={bMagnitude} /> : null;
  }
  if (type === 'conjugate_cancel') {
    const psiM = params.psi_m;
    const psiS = params.psi_s;
    return numberIn(psiM, -1, 1) && numberIn(psiS, 0, 1)
      ? <ConjugateCancel psiM={psiM} psiS={psiS} /> : null;
  }
  return null;
}

function AnalysisWidgets({ value }: { value: unknown }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return <section className="vl-widgets" aria-label="Analysis widgets">
    <h2>Analysis diagrams</h2>
    {value.map((rawSpec, index) => {
      const spec = record(rawSpec);
      const caption = typeof spec.caption === 'string' ? spec.caption : '';
      const visual = widgetVisual(spec.type, record(spec.params));
      return <figure className="vl-widget-card" key={`${String(spec.type)}-${index}`}>
        {visual}
        <figcaption>{caption ? <LatexProse text={caption} /> : null}</figcaption>
        {visual ? null : <p className="vl-widget-note">Diagram unavailable: unsupported type or parameters.</p>}
      </figure>;
    })}
  </section>;
}

export function VideolabDetail() {
  const { slug } = useParams();
  const { jobs, error, loading } = useJobs();
  const job = jobs.find((candidate) => candidate.slug === slug);
  if (loading || error) return <div className="vl-page"><Status loading={loading} error={error} /></div>;
  if (!job) return <div className="vl-page"><div className="vl-state">Analysis not found. <Link to="/videolab">Return to videolab</Link>.</div></div>;

  const metadata = job.metadata;
  const meta = record(metadata.metadata);
  const stages = record(job.job.stages);
  const analysis = record(metadata.content_analysis);
  const notes = record(metadata.framework_notes);
  const tiers = record(metadata.tier_classification);
  const segments = Array.isArray(job.transcript.segments) ? job.transcript.segments : [];
  const transcriptParts = segments.length > 0 ? segments.map((segment) => text(segment.text, '')) : [text(job.transcript.text, 'Transcript unavailable.')];
  const transcriptSentences = transcriptParts.flatMap(splitIntoSentences);
  const keptOcr = job.ocr.filter((row) => typeof row.text === 'string' && row.text.trim() && (row.duplicate_of === null || row.kept === true));
  const tierRows: Tier[] = Object.entries(tiers).filter(([key]) => key !== 'justification').map(([key, value]) => ({ symbol: text(value, '—'), name: key.replaceAll('_', ' '), description: 'Provenance classification for this analysis field.' }));

  return <article className="vl-page vl-detail">
    <Link className="vl-back" to="/videolab">← All video analyses</Link>
    <header className="vl-detail-header"><div><p className="vl-kicker">{text(job.platform)}</p><h1>{text(job.title, job.slug)}</h1><p>{text(job.creator.display_name, text(job.creator.username, 'Unknown creator'))}</p></div><code>{job.slug}</code></header>
    <section><h2>Pipeline stages</h2><div className="vl-stage-strip">{Object.entries(stages).map(([name, value]) => { const stage = record(value); return <span className={`vl-stage vl-${text(stage.status, 'pending')}`} key={name}>{name} · {text(stage.status, 'pending')}</span>; })}</div></section>
    <section><h2>Engagement</h2><dl className="vl-metrics">{[['Likes', 'likes'], ['Comments', 'comments_count'], ['Plays', 'play_count'], ['Views', 'views'], ['Shares', 'shares'], ['Saves', 'saves']].map(([label, key]) => <div key={key}><dt>{label}</dt><dd>{job.engagement[key] === null || job.engagement[key] === undefined ? '—' : String(job.engagement[key])}</dd></div>)}</dl></section>
    <section><h2>Transcript</h2><ReadAloud sentences={transcriptSentences} label="transcript">{({ activeSentence, activeWords }) => {
      let sentenceIndex = 0;
      const renderSentence = (sentence: string) => {
        const current = sentenceIndex++;
        const words = activeWords && activeWords.sentence === current ? activeWords : null;
        return <span className={activeSentence === current ? 'read-aloud-sentence is-active' : 'read-aloud-sentence'} key={current}>{words ? <SpokenHighlight sentence={sentence} words={words} /> : sentence}{' '}</span>;
      };
      return <div className="vl-transcript">{segments.length > 0 ? segments.map((segment, index) => <div className="vl-timed-row" key={index}><time>[{seconds(segment.start)}]</time><p>{splitIntoSentences(text(segment.text, '')).map(renderSentence)}</p></div>) : <p>{splitIntoSentences(text(job.transcript.text, 'Transcript unavailable.')).map(renderSentence)}</p>}</div>;
    }}</ReadAloud></section>
    <section><h2>On-screen text</h2>{keptOcr.length ? keptOcr.map((row, index) => <div className="vl-timed-row" key={index}><time>[{seconds(row.t_seconds)}]</time><p>{String(row.text)}</p></div>) : <p className="vl-muted">No deduplicated OCR text is available.</p>}</section>
    <section><h2>Frames</h2><div className="vl-frames">{job.frames.map((frame, index) => <figure key={index}><img src={text(frame.file, '')} alt={`Frame at ${seconds(frame.t_seconds)}`} loading="lazy" /><figcaption>{seconds(frame.t_seconds)} · {text(frame.selected_by)}</figcaption></figure>)}</div>{job.frames.length === 0 ? <p className="vl-muted">No exported frames are available.</p> : null}</section>
    <section><h2>Analysis</h2>{Object.entries(analysis).map(([key, value]) => <div className="vl-analysis-block" key={key}><h3>{key.replaceAll('_', ' ')}</h3><ReadableValue value={value} label={key.replaceAll('_', ' ')} /></div>)}</section>
    <section><h2>Framework concepts</h2><div className="vl-concepts">{job.concepts.map((id) => { const concept = conceptDefinition(id); return <span className="vl-concept" title={concept.description} key={id}><strong>{concept.title}</strong><small>{concept.description}</small></span>; })}</div>{Object.entries(notes).filter(([key]) => key !== 'concepts' && key !== 'widgets').map(([key, value]) => <div className="vl-analysis-block" key={key}><h3>{key.replaceAll('_', ' ')}</h3><ReadableValue value={value} label={key.replaceAll('_', ' ')} /></div>)}</section>
    <AnalysisWidgets value={notes.widgets} />
    <section><h2>Tier classification</h2>{tierRows.length ? <TierLadder tiers={tierRows} /> : <p className="vl-muted">No tier classification is available.</p>}<Value value={tiers.justification} /></section>
    <footer className="vl-detail-footer">Posted {text(meta.posted_at_iso)} · Created {text(job.created_at)}</footer>
  </article>;
}
