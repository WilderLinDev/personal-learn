// Pronunciation for every lesson and reference document: tap a word for its US IPA, gloss, and
// sound; play any paragraph. Playback: lib/speech.ts.
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { DEFAULT_VOICE, loadSettings, player, saveSettings, speakable, type PlayState, type Settings } from '@/lib/speech';
import { cn } from '@/lib/utils';

type Hit = { value: string; range: Range; rect: DOMRect; gloss?: string };
type Request = { text: string; owner: object; onState: (s: PlayState) => void; onError: (m: string) => void };

function wordAt(x: number, y: number): Hit | undefined {
  const doc = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null };
  const pos = doc.caretPositionFromPoint?.(x, y);
  const legacy = pos ? undefined : document.caretRangeFromPoint?.(x, y);
  const node = pos ? pos.offsetNode : legacy?.startContainer;
  const offset = pos ? pos.offset : (legacy?.startOffset ?? 0);
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  const text = node.textContent || '';
  const isLetter = (c: string) => /[A-Za-z'’]/.test(c);
  let start = offset;
  let end = offset;
  while (start > 0 && isLetter(text[start - 1])) start--;
  while (end < text.length && isLetter(text[end])) end++;
  const value = text.slice(start, end).replace(/^['’]+|['’]+$/g, '');
  if (!/[A-Za-z]/.test(value)) return;
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  const rect = range.getBoundingClientRect();
  if (x < rect.left - 2 || x > rect.right + 2 || y < rect.top - 2 || y > rect.bottom + 2) return;
  const gloss = text.slice(end).match(/^\s*（([^）]+)）/)?.[1];
  return { value, range, rect, gloss };
}

function PlayButton({ state, label, className, onClick }: { state: PlayState; label: string; className?: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} data-state={state} className={className} onClick={onClick}>
      {state === 'loading' ? <Loader2 className="size-4 animate-spin" /> : <Volume2 className="size-4" />}
    </button>
  );
}

function ParagraphPlay({ text, play }: { text: string; play: (r: Request) => void }) {
  const [state, setState] = useState<PlayState>('idle');
  const owner = useRef({});
  return (
    <PlayButton
      state={state}
      label="Play paragraph"
      className="say-para"
      onClick={() => play({ text, owner: owner.current, onState: setState, onError: (m) => window.dispatchEvent(new CustomEvent('say-toast', { detail: m })) })}
    />
  );
}

export default function Speech({ ipa }: { ipa: Record<string, string> }) {
  const [hit, setHit] = useState<Hit>();
  const [wordState, setWordState] = useState<PlayState>('idle');
  const [wordError, setWordError] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [hosts, setHosts] = useState<{ el: HTMLElement; text: string }[]>([]);
  const pending = useRef<Request | undefined>(undefined);
  const wordOwner = useRef({});

  const play = useCallback((r: Request) => {
    player.unlock();
    if (player.isPlaying(r.owner)) return player.stop();
    const settings = loadSettings();
    if (!settings) {
      pending.current = r;
      setHit(undefined);
      setSettingsOpen(true);
      return;
    }
    player.play(r.text, settings, r.owner, r.onState).catch((e: Error) => r.onError(`Couldn't play: ${e.message}`));
  }, []);

  // Highlight the tapped word.
  useEffect(() => {
    if (!('highlights' in CSS)) return;
    const highlight = new Highlight();
    CSS.highlights.set('say', highlight);
    if (hit) highlight.add(hit.range);
    return () => highlight.clear();
  }, [hit]);

  // Paragraph buttons and word taps.
  useEffect(() => {
    const prose = document.querySelector<HTMLElement>('.prose');
    if (!prose) return;
    const found: { el: HTMLElement; text: string }[] = [];
    prose.querySelectorAll<HTMLElement>('p, li').forEach((block) => {
      if (block.closest('table, .component-label, .foot, .stats, summary, [data-island], .not-prose') || block.querySelector('p, li')) return;
      const text = speakable(block.textContent || '');
      if (text.split(' ').length < 4) return;
      const el = document.createElement('span');
      el.className = 'say-host';
      block.append(' ', el);
      found.push({ el, text });
    });
    setHosts(found);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a, button, summary, input, [data-island], .not-prose')) return;
      if (!document.getSelection()?.isCollapsed) return;
      const next = wordAt(event.clientX, event.clientY);
      if (player.isPlaying(wordOwner.current)) player.stop();
      setWordError('');
      setHit(next);
    };
    prose.addEventListener('click', onClick);
    const onToast = (e: Event) => setToast((e as CustomEvent<string>).detail);
    window.addEventListener('say-toast', onToast);
    return () => {
      prose.removeEventListener('click', onClick);
      window.removeEventListener('say-toast', onToast);
      found.forEach(({ el }) => el.remove());
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const key = hit?.value.toLowerCase().replace(/’/g, "'") ?? '';
  const sound = ipa[key] ?? ipa[key.replace(/'s$/, '')];

  const closeSettings = (next: Settings | null | undefined) => {
    if (next !== undefined) saveSettings(next);
    setSettingsOpen(false);
    const r = pending.current;
    pending.current = undefined;
    if (r && loadSettings()) play(r);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? '').trim();
    const voice = value('voice') || DEFAULT_VOICE;
    const action = submitter?.value;
    if (action === 'system') return closeSettings({ mode: 'system' });
    if (action === 'clear') return closeSettings(null);
    if (value('apiKey')) return closeSettings({ mode: 'volcano', apiKey: value('apiKey'), voice });
    if (value('appId') && value('token')) return closeSettings({ mode: 'volcano', appId: value('appId'), token: value('token'), voice });
    closeSettings(undefined);
  };

  const saved = settingsOpen ? loadSettings() : null;

  return (
    <>
      {hosts.map(({ el, text }) => createPortal(<ParagraphPlay text={text} play={play} />, el))}

      <Popover open={Boolean(hit)} onOpenChange={(open) => !open && setHit(undefined)}>
        <PopoverAnchor virtualRef={{ current: { getBoundingClientRect: () => hit?.range.getBoundingClientRect() ?? new DOMRect() } }} />
        <PopoverContent
          aria-label="Pronunciation"
          className="w-64"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest?.('.prose')) e.preventDefault();
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <strong className="text-lg font-semibold tracking-tight">{hit?.value}</strong>
            <PlayButton
              state={wordState}
              label="Play"
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-full border transition-colors hover:bg-accent',
                wordState !== 'idle' && 'border-brand text-brand',
              )}
              onClick={() => hit && play({ text: hit.value, owner: wordOwner.current, onState: setWordState, onError: setWordError })}
            />
          </div>
          {sound && <p className="mt-1 font-mono text-sm text-muted-foreground">/{sound}/</p>}
          {hit?.gloss && <p className="mt-2 text-sm">{hit.gloss}</p>}
          {wordError && <p className="mt-2 text-sm text-destructive">{wordError}</p>}
          <button
            type="button"
            className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            onClick={() => {
              setHit(undefined);
              setSettingsOpen(true);
            }}
          >
            Voice settings
          </button>
        </PopoverContent>
      </Popover>

      <Dialog open={settingsOpen} onOpenChange={(open) => !open && closeSettings(undefined)}>
        <DialogContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Voice</DialogTitle>
              <DialogDescription>
                Pronunciation uses Volcano Engine TTS 2.0 with your own credentials. They are kept only in this browser and sent only to Volcano Engine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="say-api-key">API Key</Label>
              <Input id="say-api-key" name="apiKey" type="password" autoComplete="off" spellCheck={false} defaultValue={saved?.apiKey} />
            </div>
            <details className="group rounded-lg border px-3 py-2 text-sm" open={Boolean(saved?.appId && !saved?.apiKey)}>
              <summary className="cursor-pointer text-muted-foreground select-none">Use App ID and Access Token instead</summary>
              <div className="mt-3 grid gap-3 pb-1">
                <div className="grid gap-2">
                  <Label htmlFor="say-app-id">App ID</Label>
                  <Input id="say-app-id" name="appId" autoComplete="off" spellCheck={false} defaultValue={saved?.appId} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="say-token">Access Token</Label>
                  <Input id="say-token" name="token" type="password" autoComplete="off" defaultValue={saved?.token} />
                </div>
              </div>
            </details>
            <div className="grid gap-2">
              <Label htmlFor="say-voice">Voice</Label>
              <Input id="say-voice" name="voice" autoComplete="off" spellCheck={false} defaultValue={saved?.voice ?? DEFAULT_VOICE} />
            </div>
            <DialogFooter>
              <Button type="submit" value="system" variant="ghost">
                Use system voice
              </Button>
              <Button type="submit" value="clear" variant="outline">
                Clear
              </Button>
              <Button type="submit" value="save">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {toast && (
        <p role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border bg-popover px-4 py-2.5 text-sm shadow-md animate-in fade-in-0 slide-in-from-bottom-2">
          {toast}
        </p>
      )}
    </>
  );
}
