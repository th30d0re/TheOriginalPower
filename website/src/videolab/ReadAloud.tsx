import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { latexToSpeech } from './speechText';
import { orderByDocumentElements } from './readAloudOrder';

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
  title?: string;
}

interface QueuedSentence {
  index: number | null;
  spoken: string;
}

interface ReaderRegistration {
  id: string;
  element: HTMLElement;
  play: (continueThroughGroup: boolean, groupTransition: boolean) => boolean;
  stop: () => void;
}

const CONTINUOUS_STORAGE_KEY = 'videolab:read-aloud-continuous';

interface ReadAloudGroupValue {
  rate: number;
  setRate: Dispatch<SetStateAction<number>>;
  voiceUri: string;
  setVoiceUri: Dispatch<SetStateAction<string>>;
  register: (reader: ReaderRegistration) => () => void;
  begin: (id: string, continueThroughGroup: boolean) => void;
  complete: (id: string) => void;
  stopAll: () => void;
}

const ReadAloudGroupContext = createContext<ReadAloudGroupValue | null>(null);

export function ReadAloudGroup({ children }: { children: ReactNode }) {
  const readersRef = useRef(new Map<string, ReaderRegistration>());
  const chainRef = useRef({ active: false, continueThroughGroup: false, currentId: '' });
  const [rate, setRate] = useState(1);
  const [voiceUri, setVoiceUri] = useState('');
  const [continuous, setContinuous] = useState(() => {
    try {
      return localStorage.getItem(CONTINUOUS_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const continuousRef = useRef(continuous);

  const orderedReaders = useCallback(() => orderByDocumentElements(
    readersRef.current.values(),
    document.querySelectorAll<HTMLElement>('[data-read-aloud-root]'),
  ), []);
  const register = useCallback((reader: ReaderRegistration) => {
    readersRef.current.set(reader.id, reader);
    return () => readersRef.current.delete(reader.id);
  }, []);
  const stopAll = useCallback(() => {
    chainRef.current = { active: false, continueThroughGroup: false, currentId: '' };
    readersRef.current.forEach((reader) => reader.stop());
  }, []);
  const begin = useCallback((id: string, continueThroughGroup: boolean) => {
    chainRef.current = { active: true, continueThroughGroup, currentId: id };
  }, []);
  const complete = useCallback((id: string) => {
    const chain = chainRef.current;
    if (!chain.active || chain.currentId !== id) return;
    if (!chain.continueThroughGroup && !continuousRef.current) {
      chain.active = false;
      return;
    }
    const readers = orderedReaders();
    const current = readers.findIndex((reader) => reader.id === id);
    if (current < 0) return;
    for (const reader of readers.slice(current + 1)) {
      if (reader.play(chain.continueThroughGroup, true)) return;
    }
    chainRef.current = { active: false, continueThroughGroup: false, currentId: '' };
  }, [orderedReaders]);
  const playAll = () => {
    stopAll();
    for (const reader of orderedReaders()) {
      if (reader.play(true, true)) return;
    }
  };
  const updateContinuous = (enabled: boolean) => {
    continuousRef.current = enabled;
    setContinuous(enabled);
    try { localStorage.setItem(CONTINUOUS_STORAGE_KEY, String(enabled)); } catch { /* Storage can be blocked. */ }
  };
  return <ReadAloudGroupContext.Provider value={{ rate, setRate, voiceUri, setVoiceUri, register, begin, complete, stopAll }}>
    <div className="read-aloud-group-controls" role="group" aria-label="Analysis read aloud">
      <button type="button" onClick={playAll}>Play all</button>
      <label><input type="checkbox" checked={continuous} onChange={(event) => updateContinuous(event.target.checked)} />Continue to the next section</label>
    </div>
    {children}
  </ReadAloudGroupContext.Provider>;
}

export default function ReadAloud({ sentences, children, label, title }: ReadAloudProps) {
  const instanceId = useId();
  const group = useContext(ReadAloudGroupContext);
  const groupRegister = group?.register;
  const groupBegin = group?.begin;
  const groupComplete = group?.complete;
  const groupStopAll = group?.stopAll;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
  const synthesisRef = useRef<SpeechSynthesis | null>(supported ? window.speechSynthesis : null);
  const runRef = useRef(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => supported ? window.speechSynthesis.getVoices() : []);
  const [localVoiceUri, setLocalVoiceUri] = useState('');
  const [localRate, setLocalRate] = useState(1);
  const voiceUri = group?.voiceUri ?? localVoiceUri;
  const rate = group?.rate ?? localRate;
  const setVoiceUri = group?.setVoiceUri ?? setLocalVoiceUri;
  const setRate = group?.setRate ?? setLocalRate;
  const [playback, setPlayback] = useState<PlaybackState>('idle');
  const [activeSentence, setActiveSentence] = useState<number | null>(null);
  const [activeWords, setActiveWords] = useState<WordHighlight | null>(null);
  const [helper, setHelper] = useState<HelperHealth | null>(null);
  const [helperProbed, setHelperProbed] = useState(false);
  const pausedRef = useRef(false);
  const speakingOnHelperRef = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const resumeRef = useRef<{ queue: QueuedSentence[]; position: number } | null>(null);
  const activeHelperRef = useRef<{ queue: QueuedSentence[]; position: number } | null>(null);

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

  const halt = useCallback(() => {
    runRef.current += 1;
    pausedRef.current = false;
    resumeRef.current = null;
    activeHelperRef.current = null;
    synthesisRef.current?.cancel();
    stopHelperSpeech();
    setPlayback('idle');
    setActiveSentence(null);
    setActiveWords(null);
  }, [stopHelperSpeech]);

  const stop = useCallback(() => {
    if (groupStopAll) groupStopAll();
    else halt();
  }, [groupStopAll, halt]);

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
  }, [setVoiceUri]);

  useEffect(() => stop, [sentences, stop]);

  // Route change unmounts the page: leave no speech running on the helper.
  useEffect(() => () => stopHelperSpeech(), [stopHelperSpeech]);

  useEffect(() => {
    const stopOtherReader = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== instanceId) halt();
    };
    window.addEventListener('readaloud:start', stopOtherReader);
    return () => window.removeEventListener('readaloud:start', stopOtherReader);
  }, [halt, instanceId]);

  const streamHelperEvents = useCallback((id: string, sentenceIndex: number | null, run: number) => new Promise<void>((resolve, reject) => {
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
      if (sentenceIndex !== null && typeof data.start === 'number' && typeof data.length === 'number') {
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
      activeHelperRef.current = { queue, position };
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
        speakingOnHelperRef.current = true;
        if (run !== runRef.current) {
          postHelperStop();
          return;
        }
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
      activeHelperRef.current = null;
      setPlayback('idle');
      setActiveSentence(null);
      setActiveWords(null);
      groupComplete?.(instanceId);
    }
  }, [groupComplete, instanceId, postHelperStop, rate, stop, streamHelperEvents]);

  const play = useCallback((continueThroughGroup = false, groupTransition = false): boolean => {
    if (!groupTransition) window.dispatchEvent(new CustomEvent('readaloud:start', { detail: instanceId }));
    halt();
    const bodyQueue: QueuedSentence[] = sentences.map((sentence, index) => ({ index, spoken: latexToSpeech(sentence) })).filter((item) => item.spoken);
    if (bodyQueue.length === 0) return false;
    const spokenTitle = title ? latexToSpeech(title) : '';
    const queue = spokenTitle ? [{ index: null, spoken: spokenTitle }, ...bodyQueue] : bodyQueue;
    groupBegin?.(instanceId, continueThroughGroup);
    if (helper) {
      setPlayback('playing');
      void playHelperQueue(queue, 0, runRef.current);
      return true;
    }
    const synthesis = synthesisRef.current;
    if (!synthesis) return false;
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
            setActiveWords(null);
            groupComplete?.(instanceId);
          }
        };
      }
      synthesis.speak(utterance);
    });
    return true;
  }, [groupBegin, groupComplete, halt, helper, instanceId, playHelperQueue, rate, sentences, stop, title, voiceUri, voices]);

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
        resumeRef.current = activeHelperRef.current;
        runRef.current += 1;
        stopHelperSpeech();
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

  useEffect(() => {
    if (!groupRegister || !rootRef.current) return;
    return groupRegister({ id: instanceId, element: rootRef.current, play, stop: halt });
  }, [groupRegister, halt, instanceId, play]);

  if ((!supported && !helper) || sentences.length === 0) return <>{children({ activeSentence: null, activeWords: null, sentences })}</>;

  return <div className={playback === 'idle' ? 'read-aloud' : 'read-aloud is-playing'} data-read-aloud-root ref={rootRef}>
    <div className="read-aloud-controls" role="group" aria-label={`Read aloud ${label}`}>
      <button type="button" onClick={() => play()}>Play</button>
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
