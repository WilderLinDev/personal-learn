// Pronunciation for every lesson and reference document: tap a word for its US IPA, gloss, and
// sound; select any text to hear it. Playback: lib/speech.ts.
import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { DEFAULT_VOICE, loadSettings, player, saveSettings, speakable, type PlayState, type Settings } from '@/lib/speech';
import { cn } from '@/lib/utils';

type Hit = { kind: 'word' | 'selection'; value: string; range: Range; gloss?: string };
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
  return { kind: 'word', value, range, gloss };
}

function PlayButton({ state, label, className, onClick }: { state: PlayState; label: string; className?: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} data-state={state} className={className} onClick={onClick}>
      {state === 'loading' ? <Loader2 className="size-4 animate-spin" /> : <Volume2 className="size-4" />}
    </button>
  );
}

export default function Speech({ ipa }: { ipa: Record<string, string> }) {
  const [hit, setHit] = useState<Hit>();
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [error, setError] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pending = useRef<Request | undefined>(undefined);
  const owner = useRef({});

  const play = useCallback((r: Request) => {
    player.unlock();
    if (player.isPlaying(r.owner)) return player.stop();
    const settings = loadSettings();
    if (!settings) {
      pending.current = r;
      current.current = undefined;
      setHit(undefined);
      setSettingsOpen(true);
      return;
    }
    player.play(r.text, settings, r.owner, r.onState).catch((e: Error) => r.onError(`Couldn't play: ${e.message}`));
  }, []);

  const current = useRef<Hit | undefined>(undefined);
  const show = useCallback((next: Hit | undefined) => {
    if (next?.kind === 'selection' && current.current?.kind === 'selection' && next.value === current.current.value) return;
    current.current = next;
    if (player.isPlaying(owner.current)) player.stop();
    setError('');
    setHit(next);
  }, []);

  // Highlight a tapped word; a selection already shows as selected.
  useEffect(() => {
    if (!('highlights' in CSS)) return;
    const highlight = new Highlight();
    CSS.highlights.set('say', highlight);
    if (hit?.kind === 'word') highlight.add(hit.range);
    return () => highlight.clear();
  }, [hit]);

  // Tap a word, or select any text, inside the lesson.
  useEffect(() => {
    const prose = document.querySelector<HTMLElement>('.prose');
    if (!prose) return;
    const skip = 'a, button, summary, input, [data-island], .not-prose';

    const fromSelection = (): Hit | undefined => {
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const element = container instanceof Element ? container : container.parentElement;
      if (!prose.contains(container) || element?.closest(skip)) return;
      const value = speakable(selection.toString());
      if (!/[A-Za-z]/.test(value)) return;
      return { kind: 'selection', value, range: range.cloneRange() };
    };

    const onClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest(skip)) return;
      if (!document.getSelection()?.isCollapsed) return;
      show(wordAt(event.clientX, event.clientY));
    };
    // Selections made by mouse, keyboard, or touch handles all end in selectionchange.
    let timer: number | undefined;
    const onSelection = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const next = fromSelection();
        if (next) show(next);
      }, 350);
    };
    prose.addEventListener('click', onClick);
    document.addEventListener('selectionchange', onSelection);
    return () => {
      window.clearTimeout(timer);
      prose.removeEventListener('click', onClick);
      document.removeEventListener('selectionchange', onSelection);
    };
  }, [show]);

  const single = hit && /^[A-Za-z'’]+$/.test(hit.value);
  const key = single ? hit.value.toLowerCase().replace(/’/g, "'") : '';
  const sound = key ? (ipa[key] ?? ipa[key.replace(/'s$/, '')]) : undefined;

  const closeSettings = (next: Settings | null | undefined) => {
    if (next !== undefined) saveSettings(next);
    setSettingsOpen(false);
    const r = pending.current;
    pending.current = undefined;
    if (r && loadSettings()) play(r);
  };

  const onSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    const submitter = event.nativeEvent.submitter as HTMLButtonElement | null;
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
      <Popover open={Boolean(hit)} onOpenChange={(open) => !open && show(undefined)}>
        <PopoverAnchor virtualRef={{ current: { getBoundingClientRect: () => hit?.range.getBoundingClientRect() ?? new DOMRect() } }} />
        <PopoverContent
          aria-label="Pronunciation"
          className="w-64"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            // Taps and selections in the lesson move the popover instead of closing it.
            const target = e.target as HTMLElement;
            if (target.closest?.('.prose') && !target.closest('a, button, summary, input, [data-island], .not-prose')) e.preventDefault();
          }}
        >
          <div className="flex items-center justify-between gap-3">
            {single ? (
              <strong className="text-lg font-semibold tracking-tight">{hit?.value}</strong>
            ) : (
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{hit?.value}</p>
            )}
            <PlayButton
              state={playState}
              label="Play"
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-full border transition-colors hover:bg-accent',
                'shrink-0',
                playState !== 'idle' && 'border-brand text-brand',
              )}
              onClick={() => hit && play({ text: hit.value, owner: owner.current, onState: setPlayState, onError: setError })}
            />
          </div>
          {sound && <p className="mt-1 font-mono text-sm text-muted-foreground">/{sound}/</p>}
          {hit?.gloss && <p className="mt-2 text-sm">{hit.gloss}</p>}
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <button
            type="button"
            className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            onClick={() => {
              current.current = undefined;
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

    </>
  );
}
