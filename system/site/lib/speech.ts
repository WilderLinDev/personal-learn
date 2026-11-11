// Speech for pronunciation: Volcano Engine TTS 2.0 called from the browser with the reader's own
// credentials (kept only in this browser), or the system voice.

const ENDPOINT = 'https://openspeech.bytedance.com/api/v3/tts/unidirectional';
const STORE = 'learn.voice';
export const DEFAULT_VOICE = 'en_male_tim_uranus_bigtts';

export type Settings = { mode: 'volcano' | 'system'; apiKey?: string; appId?: string; token?: string; voice?: string };

export function loadSettings(): Settings | null {
  try {
    return JSON.parse(localStorage.getItem(STORE) || 'null');
  } catch {
    return null;
  }
}

export function saveSettings(s: Settings | null) {
  try {
    if (s) localStorage.setItem(STORE, JSON.stringify(s));
    else localStorage.removeItem(STORE);
  } catch {}
}

// Native-language glosses and CJK text are not read aloud.
export const speakable = (text: string) =>
  text
    .replace(/[（(][^）)]*[㐀-鿿][^）)]*[）)]/g, '')
    .replace(/[㐀-鿿　-〿＀-￯]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

async function volcano(text: string, s: Settings) {
  // Browsers may not send X-Api-Key across origins; Volcano also reads the API Key from ?api_key=.
  const auth: Record<string, string> = s.apiKey ? {} : { 'X-Api-App-Key': s.appId!, 'X-Api-Access-Key': s.token! };
  const url = s.apiKey ? `${ENDPOINT}?api_key=${encodeURIComponent(s.apiKey)}` : ENDPOINT;
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
        speaker: s.voice || DEFAULT_VOICE,
        audio_params: { format: 'mp3', sample_rate: 24000 },
        additions: JSON.stringify({ explicit_language: 'en' }),
      },
    }),
  });
  const body = await res.text();
  const chunks: Uint8Array[] = [];
  for (const line of body.split('\n')) {
    if (!line.trim()) continue;
    let msg: { code?: number; message?: string; data?: string; header?: { code?: number; message?: string } };
    try {
      msg = JSON.parse(line);
    } catch {
      continue;
    }
    const code = msg.code ?? msg.header?.code;
    if (res.status === 401 || res.status === 403) throw new Error('check your credentials in Voice settings.');
    if (code && code !== 20000000) throw new Error(msg.message || msg.header?.message || `error ${code}`);
    if (msg.data) chunks.push(Uint8Array.from(atob(msg.data), (c) => c.charCodeAt(0)));
  }
  if (!res.ok) throw new Error(res.headers.get('X-Api-Message') || `HTTP ${res.status}`);
  if (!chunks.length) throw new Error('No audio returned');
  const bytes = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let at = 0;
  for (const c of chunks) {
    bytes.set(c, at);
    at += c.length;
  }
  return bytes.buffer;
}

export type PlayState = 'idle' | 'loading' | 'playing';

// One sound at a time across the page. The AudioContext is unlocked inside the tap,
// so audio may start after the request.
class Player {
  private ctx?: AudioContext;
  private current?: { stop(): void; owner: object; onState: (s: PlayState) => void };

  unlock() {
    this.ctx ??= new AudioContext();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  isPlaying(owner: object) {
    return this.current?.owner === owner;
  }

  stop() {
    const c = this.current;
    this.current = undefined;
    c?.stop();
    c?.onState('idle');
  }

  async play(text: string, settings: Settings, owner: object, onState: (s: PlayState) => void) {
    this.stop();
    const entry = { owner, onState, stop: () => {} };
    this.current = entry;
    const done = () => {
      if (this.current === entry) this.stop();
    };
    if (settings.mode === 'system') {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      const voices = speechSynthesis.getVoices().filter((v) => v.lang === 'en-US');
      u.voice = voices.find((v) => /enhanced|premium|natural|google/i.test(v.name)) ?? voices[0] ?? null;
      u.onend = u.onerror = done;
      entry.stop = () => speechSynthesis.cancel();
      onState('playing');
      speechSynthesis.speak(u);
      return;
    }
    onState('loading');
    try {
      const audio = await this.ctx!.decodeAudioData(await volcano(text, settings));
      if (this.current !== entry) return;
      const source = this.ctx!.createBufferSource();
      source.buffer = audio;
      source.connect(this.ctx!.destination);
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
