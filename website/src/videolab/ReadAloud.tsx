import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { latexToSpeech } from './speechText';

type PlaybackState = 'idle' | 'playing' | 'paused';

// Local helper (videolab/siri-speech) that speaks through AVSpeechSynthesizer in
// Siri Voice 2. Loopback only; the browser fallback below is used whenever the
// helper is not running.
const HELPER_BASE = 'http://127.0.0.1:5277';

interface HelperHealth {
  ok: boolean;
  voice: string | null;
  identifier: string;
  available: boolean;
}

// Word range within the latexToSpeech() output of the active sentence, streamed
// from the helper over SSE. Offsets are UTF-16 code units, matching String.slice.
export interface WordHighlight {
  sentence: number;
  start: number;
  length: number;
}

interface ReadAloudRenderState {
  activeSentence: number | null;
  activeWords: WordHighlight | null;
  sentences: string[];
}

interface ReadAloudProps {
  sentences: string[];
  children: (state: ReadAloudRenderState) => ReactNode;
  label: string;
}

interface QueuedSentence {
  index: number;
  spoken: string;
}

export default function ReadAloud({ sentences, children, label }: ReadAloudProps) {
  const instanceId = useId();
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
  const synthesisRef = useRef<SpeechSynthesis | null>(supported ? window.speechSynthesis : null);
  const runRef = useRef(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => supported ? window.speechSynthesis.getVoices() : []);
  const [voiceUri, setVoiceUri] = useState('');
  const [rate, setRate] = useState(1);
  const [playback, setPlayback] = useState<PlaybackState>('idle');
  const [activeSentence, setActiveSentence] = useState<number | null>(null);
  const [activeWords, setActiveWords] = useState<WordHighlight | null>(null);
  const [helper, setHelper] = useState<HelperHealth | null>(null);
  const [helperProbed, setHelperProbed] = useState(false);
  const pausedRef = useRef(false);
  const speakingOnHelperRef = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const resumeRef = useRef<{ queue: QueuedSentence[]; position: number } | null>(null);

  const postHelperStop = useCallback(() => {
    if (!speakingOnHelperRef.current) return;
    speakingOnHelperRef.current = false;
    fetch(`${HELPER_BASE}/stop`, { method: 'POST', keepalive: true }).catch(() => {});
  }, []);

  const stopHelperSpeech = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    postHelperStop();
  }, [postHelperStop]);

  const stop = useCallback(() => {
    runRef.current += 1;
    pausedRef.current = false;
    resumeRef.current = null;
    synthesisRef.current?.cancel();
    stopHelperSpeech();
    setPlayback('idle');
    setActiveSentence(null);
    setActiveWords(null);
  }, [stopHelperSpeech]);

  // Probe the helper once on mount. Failure of any kind keeps the browser path.
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1500);
    fetch(`${HELPER_BASE}/health`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<HelperHealth> : Promise.reject(new Error(String(response.status))))
      .then((health) => { if (health.available) setHelper(health); })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(timeout);
        setHelperProbed(true);
      });
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    const synthesis = window.speechSynthesis;
    synthesisRef.current = synthesis;

    const refreshVoices = () => {
      const available = synthesis.getVoices();
      setVoices(available);
      setVoiceUri((current) => current || available.find((voice) => voice.default)?.voiceURI || available[0]?.voiceURI || '');
    };
    queueMicrotask(refreshVoices);
    synthesis.addEventListener('voiceschanged', refreshVoices);
    return () => {
      runRef.current += 1;
      synthesis.cancel();
      synthesis.removeEventListener('voiceschanged', refreshVoices);
      synthesisRef.current = null;
    };
  }, []);

  useEffect(() => stop, [sentences, stop]);

  // Route change unmounts the page: leave no speech running on the helper.
  useEffect(() => () => stopHelperSpeech(), [stopHelperSpeech]);

  useEffect(() => {
    const stopOtherReader = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== instanceId) stop();
    };
    window.addEventListener('readaloud:start', stopOtherReader);
    return () => window.removeEventListener('readaloud:start', stopOtherReader);
  }, [instanceId, stop]);

  const streamHelperEvents = useCallback((id: string, sentenceIndex: number, run: number) => new Promise<void>((resolve, reject) => {
    const source = new EventSource(`${HELPER_BASE}/events?id=${encodeURIComponent(id)}`);
    eventSourceRef.current = source;
    source.onmessage = (event) => {
      if (run !== runRef.current) {
        source.close();
        resolve();
        return;
      }
      const data = JSON.parse(event.data) as { start?: number; length?: number; done?: boolean };
      if (data.done) {
        source.close();
        setActiveWords(null);
        resolve();
        return;
      }
      if (typeof data.start === 'number' && typeof data.length === 'number') {
        setActiveWords({ sentence: sentenceIndex, start: data.start, length: data.length });
      }
    };
    source.onerror = () => {
      source.close();
      if (run === runRef.current) reject(new Error('helper event stream failed'));
      else resolve();
    };
  }), []);

  const playHelperQueue = useCallback(async (queue: QueuedSentence[], from: number, run: number) => {
    for (let position = from; position < queue.length; position += 1) {
      if (run !== runRef.current) return;
      if (pausedRef.current) {
        resumeRef.current = { queue, position };
        return;
      }
      const item = queue[position];
      setActiveSentence(item.index);
      setActiveWords(null);
      try {
        const response = await fetch(`${HELPER_BASE}/speak`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: item.spoken, rate }),
        });
        if (!response.ok) throw new Error(`speak failed: ${response.status}`);
        const payload = await response.json() as { id?: string };
        if (!payload.id) throw new Error('speak returned no id');
        if (run !== runRef.current) return;
        speakingOnHelperRef.current = true;
        await streamHelperEvents(payload.id, item.index, run);
        speakingOnHelperRef.current = false;
      } catch {
        speakingOnHelperRef.current = false;
        if (run !== runRef.current) return;
        // The helper died mid-playback: drop to the browser fallback for the
        // next play rather than leaving a dead button.
        setHelper(null);
        stop();
        return;
      }
    }
    if (run === runRef.current) {
      setPlayback('idle');
      setActiveSentence(null);
      setActiveWords(null);
    }
  }, [rate, stop, streamHelperEvents]);

  if ((!supported && !helper) || sentences.length === 0) return <>{children({ activeSentence: null, activeWords: null, sentences })}</>;

  const play = () => {
    window.dispatchEvent(new CustomEvent('readaloud:start', { detail: instanceId }));
    stop();
    const queue = sentences.map((sentence, index) => ({ index, spoken: latexToSpeech(sentence) })).filter((item) => item.spoken);
    if (queue.length === 0) return;
    if (helper) {
      setPlayback('playing');
      void playHelperQueue(queue, 0, runRef.current);
      return;
    }
    const synthesis = synthesisRef.current;
    if (!synthesis) return;
    const run = runRef.current;
    const selectedVoice = voices.find((voice) => voice.voiceURI === voiceUri) ?? null;
    setPlayback('playing');
    queue.forEach((item, queueIndex) => {
      const utterance = new SpeechSynthesisUtterance(item.spoken);
      utterance.rate = rate;
      utterance.voice = selectedVoice;
      utterance.onstart = () => {
        if (run === runRef.current) setActiveSentence(item.index);
      };
      utterance.onerror = () => {
        if (run === runRef.current) stop();
      };
      if (queueIndex === queue.length - 1) {
        utterance.onend = () => {
          if (run === runRef.current) {
            setPlayback('idle');
            setActiveSentence(null);
          }
        };
      }
      synthesis.speak(utterance);
    });
  };

  const togglePause = () => {
    if (playback === 'idle') return;
    if (helper) {
      if (playback === 'paused') {
        pausedRef.current = false;
        setPlayback('playing');
        const resume = resumeRef.current;
        resumeRef.current = null;
        if (resume) void playHelperQueue(resume.queue, resume.position, runRef.current);
      } else {
        pausedRef.current = true;
        setPlayback('paused');
        // The helper exposes no pause endpoint: stop the current utterance and
        // re-speak the sentence from its start on resume.
        postHelperStop();
      }
      return;
    }
    const synthesis = synthesisRef.current;
    if (!synthesis) return;
    if (playback === 'paused') {
      synthesis.resume();
      setPlayback('playing');
    } else {
      synthesis.pause();
      setPlayback('paused');
    }
  };

  return <div className="read-aloud">
    <div className="read-aloud-controls" role="group" aria-label={`Read aloud ${label}`}>
      <button type="button" onClick={play}>Play</button>
      <button type="button" onClick={togglePause} disabled={playback === 'idle'}>{playback === 'paused' ? 'Resume' : 'Pause'}</button>
      <button type="button" onClick={stop} disabled={playback === 'idle'}>Stop</button>
      <label>Rate <span>{rate.toFixed(2)}×</span><input aria-label="Speech rate" type="range" min="0.75" max="1.5" step="0.05" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
      {helper
        ? <span className="read-aloud-helper-voice">Voice: {helper.voice ?? 'Siri Voice 2'} (local helper)</span>
        : <label>Voice <select aria-label="Speech voice" value={voiceUri} onChange={(event) => setVoiceUri(event.target.value)} disabled={voices.length === 0}>
          {voices.length === 0 ? <option value="">System default</option> : voices.map((voice) => <option value={voice.voiceURI} key={`${voice.voiceURI}-${voice.lang}`}>{voice.name} ({voice.lang})</option>)}
        </select></label>}
    </div>
    {!helper && helperProbed
      ? <p className="read-aloud-note">Siri Voice 2 needs the local helper running (<code>make videolab-speech</code>); using the browser voice.</p>
      : null}
    <div className="read-aloud-content">{children({ activeSentence, activeWords, sentences })}</div>
  </div>;
}
