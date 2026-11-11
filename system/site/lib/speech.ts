// Speech for pronunciation: Volcano Engine TTS 2.0 called from the browser with the reader's own
// credentials (kept only in this browser), or the system voice.
import { useSyncExternalStore } from 'react';

const ENDPOINT = 'https://openspeech.bytedance.com/api/v3/tts/unidirectional';
const STORE = 'learn.voice';
export const DEFAULT_VOICE = 'en_male_tim_uranus_bigtts';

export type Credentials = { apiKey: string } | { appId: string; token: string };
export type Settings = { mode: 'system' } | ({ mode: 'volcano'; voice?: string } & Credentials);

// Voice settings live in localStorage; components read them through useSettings().
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: Settings | null } = { raw: null, value: null };

export function loadSettings(): Settings | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORE);
  } catch {
    // Storage blocked: no saved settings.
  }
  if (raw !== cache.raw) {
    try {
      cache = { raw, value: raw ? (JSON.parse(raw) as Settings) : null };
    } catch {
      cache = { raw, value: null };
    }
  }
  return cache.value;
}

export function saveSettings(settings: Settings | null) {
  try {
    if (settings) localStorage.setItem(STORE, JSON.stringify(settings));
    else localStorage.removeItem(STORE);
  } catch {
    // Storage blocked: the settings are not kept.
  }
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

export const useSettings = () => useSyncExternalStore(subscribe, loadSettings, () => null);

/** Native-language glosses and CJK text are not read aloud. */
export const speakable = (text: string) =>
  text
    .replace(/[（(][^）)]*[\u3400-\u9fff][^）)]*[）)]/g, '')
    .replace(/[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

interface Message {
  code?: number;
  message?: string;
  data?: string;
  header?: { code?: number; message?: string };
}

async function volcano(text: string, settings: Extract<Settings, { mode: 'volcano' }>) {
  // Browsers may not send X-Api-Key across origins; Volcano also reads the API Key from ?api_key=.
  const url = new URL(ENDPOINT);
  const auth: Record<string, string> = {};
  if ('apiKey' in settings) url.searchParams.set('api_key', settings.apiKey);
  else Object.assign(auth, { 'X-Api-App-Key': settings.appId, 'X-Api-Access-Key': settings.token });
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...auth,
      'X-Api-Resource-Id': 'seed-tts-2.0',
      'X-Api-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify({
      req_params: {
        text,
        speaker: settings.voice ?? DEFAULT_VOICE,
        audio_params: { format: 'mp3', sample_rate: 24000 },
        additions: JSON.stringify({ explicit_language: 'en' }),
      },
    }),
  });
  if (res.status === 401 || res.status === 403) throw new Error('check your credentials in Voice settings.');
  // The response is one JSON message per line, each with a base64 chunk of audio.
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  for (const line of (await res.text()).split('\n')) {
    let message: Message;
    try {
      message = JSON.parse(line) as Message;
    } catch {
      continue;
    }
    const code = message.code ?? message.header?.code;
    if (code && code !== 20000000) {
      throw new Error(message.message ?? message.header?.message ?? `error ${String(code)}`);
    }
    if (message.data) chunks.push(Uint8Array.fromBase64(message.data));
  }
  if (!res.ok) throw new Error(res.headers.get('X-Api-Message') ?? `HTTP ${String(res.status)}`);
  if (!chunks.length) throw new Error('No audio returned');
  return new Blob(chunks).arrayBuffer();
}

export type PlayState = 'idle' | 'loading' | 'playing';

interface Playing {
  owner: object;
  onState: (state: PlayState) => void;
  stop: () => void;
}

// One sound at a time across the page. The AudioContext is unlocked inside the tap,
// so audio may start after the request.
class Player {
  private ctx?: AudioContext;
  private current?: Playing;

  unlock() {
    this.ctx ??= new AudioContext();
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  isPlaying(owner: object) {
    return this.current?.owner === owner;
  }

  stop() {
    const playing = this.current;
    this.current = undefined;
    playing?.stop();
    playing?.onState('idle');
  }

  async play(text: string, settings: Settings, owner: object, onState: (state: PlayState) => void) {
    this.stop();
    const entry: Playing = { owner, onState, stop: () => undefined };
    this.current = entry;
    const done = () => {
      if (this.current === entry) this.stop();
    };
    if (settings.mode === 'system') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      const voices = speechSynthesis.getVoices().filter((v) => v.lang === 'en-US');
      utterance.voice = voices.find((v) => /enhanced|premium|natural|google/i.test(v.name)) ?? voices[0] ?? null;
      utterance.onend = utterance.onerror = done;
      entry.stop = () => {
        speechSynthesis.cancel();
      };
      onState('playing');
      speechSynthesis.speak(utterance);
      return;
    }
    this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;
    onState('loading');
    try {
      const audio = await ctx.decodeAudioData(await volcano(text, settings));
      if (this.current !== entry) return;
      const source = ctx.createBufferSource();
      source.buffer = audio;
      source.connect(ctx.destination);
      source.onended = done;
      source.start();
      entry.stop = () => {
        source.onended = null;
        source.stop();
      };
      onState('playing');
    } catch (e) {
      done();
      throw e;
    }
  }
}

export const player = new Player();
