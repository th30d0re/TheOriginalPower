import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { latexToSpeech } from './speechText';

type PlaybackState = 'idle' | 'playing' | 'paused';

interface ReadAloudRenderState {
  activeSentence: number | null;
  sentences: string[];
}

interface ReadAloudProps {
  sentences: string[];
  children: (state: ReadAloudRenderState) => ReactNode;
  label: string;
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

  const stop = useCallback(() => {
    runRef.current += 1;
    synthesisRef.current?.cancel();
    setPlayback('idle');
    setActiveSentence(null);
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

  useEffect(() => {
    const stopOtherReader = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== instanceId) stop();
    };
    window.addEventListener('readaloud:start', stopOtherReader);
    return () => window.removeEventListener('readaloud:start', stopOtherReader);
  }, [instanceId, stop]);

  if (!supported || sentences.length === 0) return <>{children({ activeSentence: null, sentences })}</>;

  const play = () => {
    window.dispatchEvent(new CustomEvent('readaloud:start', { detail: instanceId }));
    stop();
    const synthesis = synthesisRef.current;
    if (!synthesis) return;
    const run = runRef.current;
    const selectedVoice = voices.find((voice) => voice.voiceURI === voiceUri) ?? null;
    const queue = sentences.map((sentence, index) => ({ index, spoken: latexToSpeech(sentence) })).filter((item) => item.spoken);
    if (queue.length === 0) return;
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
    const synthesis = synthesisRef.current;
    if (!synthesis || playback === 'idle') return;
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
      <label>Voice <select aria-label="Speech voice" value={voiceUri} onChange={(event) => setVoiceUri(event.target.value)} disabled={voices.length === 0}>
        {voices.length === 0 ? <option value="">System default</option> : voices.map((voice) => <option value={voice.voiceURI} key={`${voice.voiceURI}-${voice.lang}`}>{voice.name} ({voice.lang})</option>)}
      </select></label>
    </div>
    <div className="read-aloud-content">{children({ activeSentence, sentences })}</div>
  </div>;
}
