import { Suspense, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import TierLadder from '../story/visuals/TierLadder';
import LatexProse from './LatexProse';
import { conceptDefinition, widgetRegistry } from './conceptRegistry';
import type { WidgetKey } from './conceptRegistry';
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

function ConceptVisuals({ concepts }: { concepts: string[] }) {
  const groups = useMemo(() => {
    const grouped = new Map<WidgetKey, string[]>();
    concepts.forEach((id) => {
      const widget = conceptDefinition(id).widget;
      if (widget) grouped.set(widget, [...(grouped.get(widget) ?? []), id]);
    });
    return [...grouped.entries()];
  }, [concepts]);
  return <div className="vl-widgets">{groups.map(([key, ids]) => {
    const Widget = widgetRegistry[key];
    const theta = key === 'phasor' && ids.includes('phase_angle') ? 90 : undefined;
    const caption = ids.map((id) => conceptDefinition(id).title).join(' · ');
    return <figure className="vl-widget" key={key}>
      <Suspense fallback={<div className="vl-widget-loading">Loading visual…</div>}><Widget {...(theta === undefined ? {} : { theta })} /></Suspense>
      <figcaption><strong>{caption}</strong> — {ids.map((id) => conceptDefinition(id).description).join(' ')}</figcaption>
    </figure>;
  })}</div>;
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
  const keptOcr = job.ocr.filter((row) => typeof row.text === 'string' && row.text.trim() && (row.duplicate_of === null || row.kept === true));
  const tierRows: Tier[] = Object.entries(tiers).filter(([key]) => key !== 'justification').map(([key, value]) => ({ symbol: text(value, '—'), name: key.replaceAll('_', ' '), description: 'Provenance classification for this analysis field.' }));

  return <article className="vl-page vl-detail">
    <Link className="vl-back" to="/videolab">← All video analyses</Link>
    <header className="vl-detail-header"><div><p className="vl-kicker">{text(job.platform)}</p><h1>{text(job.title, job.slug)}</h1><p>{text(job.creator.display_name, text(job.creator.username, 'Unknown creator'))}</p></div><code>{job.slug}</code></header>
    <section><h2>Pipeline stages</h2><div className="vl-stage-strip">{Object.entries(stages).map(([name, value]) => { const stage = record(value); return <span className={`vl-stage vl-${text(stage.status, 'pending')}`} key={name}>{name} · {text(stage.status, 'pending')}</span>; })}</div></section>
    <section><h2>Engagement</h2><dl className="vl-metrics">{[['Likes', 'likes'], ['Comments', 'comments_count'], ['Plays', 'play_count'], ['Views', 'views'], ['Shares', 'shares'], ['Saves', 'saves']].map(([label, key]) => <div key={key}><dt>{label}</dt><dd>{job.engagement[key] === null || job.engagement[key] === undefined ? '—' : String(job.engagement[key])}</dd></div>)}</dl></section>
    <section><h2>Transcript</h2><div className="vl-transcript">{segments.length > 0 ? segments.map((segment, index) => <div className="vl-timed-row" key={index}><time>[{seconds(segment.start)}]</time><p>{text(segment.text, '')}</p></div>) : <p>{text(job.transcript.text, 'Transcript unavailable.')}</p>}</div></section>
    <section><h2>On-screen text</h2>{keptOcr.length ? keptOcr.map((row, index) => <div className="vl-timed-row" key={index}><time>[{seconds(row.t_seconds)}]</time><p>{String(row.text)}</p></div>) : <p className="vl-muted">No deduplicated OCR text is available.</p>}</section>
    <section><h2>Frames</h2><div className="vl-frames">{job.frames.map((frame, index) => <figure key={index}><img src={text(frame.file, '')} alt={`Frame at ${seconds(frame.t_seconds)}`} loading="lazy" /><figcaption>{seconds(frame.t_seconds)} · {text(frame.selected_by)}</figcaption></figure>)}</div>{job.frames.length === 0 ? <p className="vl-muted">No exported frames are available.</p> : null}</section>
    <section><h2>Analysis</h2>{Object.entries(analysis).map(([key, value]) => <div className="vl-analysis-block" key={key}><h3>{key.replaceAll('_', ' ')}</h3><Value value={value} /></div>)}</section>
    <section><h2>Framework concepts</h2><div className="vl-concepts">{job.concepts.map((id) => { const concept = conceptDefinition(id); return <span className="vl-concept" title={concept.description} key={id}><strong>{concept.title}</strong><small>{concept.description}</small></span>; })}</div>{Object.entries(notes).filter(([key]) => key !== 'concepts').map(([key, value]) => <div className="vl-analysis-block" key={key}><h3>{key.replaceAll('_', ' ')}</h3><Value value={value} /></div>)}</section>
    <ConceptVisuals concepts={job.concepts} />
    <section><h2>Tier classification</h2>{tierRows.length ? <TierLadder tiers={tierRows} /> : <p className="vl-muted">No tier classification is available.</p>}<Value value={tiers.justification} /></section>
    <footer className="vl-detail-footer">Posted {text(meta.posted_at_iso)} · Created {text(job.created_at)}</footer>
  </article>;
}
