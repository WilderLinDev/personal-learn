// Pronunciation for every lesson and reference document: tap a word for its US IPA, gloss, and
// sound; select any text to hear it. Playback: lib/speech.ts.
import { useRef, useState } from 'react';
import { Loader2, Volume2 } from 'lucide-react';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { player, saveSettings, useSettings, type PlayState, type Settings } from '@/lib/speech';
import { cn } from 'cn';
import { OWN_INTERACTION, useWordPicker } from './speech/useWordPicker';
import { VoiceSettings, type CloseSettings } from './speech/VoiceSettings';

const SINGLE_WORD = /^[A-Za-z'’]+$/;

export default function Speech({ ipa }: { ipa: Record<string, string> }) {
  const settings = useSettings();
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [error, setError] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Text the reader asked to hear before choosing a voice; it plays once they choose one.
  const pending = useRef<string | undefined>(undefined);
  const owner = useRef({});

  const { pick, clear } = useWordPicker(() => {
    if (player.isPlaying(owner.current)) player.stop();
    setError('');
  });

  const play = (text: string, voice: Settings | null) => {
    player.unlock();
    if (player.isPlaying(owner.current)) {
      player.stop();
      return;
    }
    if (!voice) {
      pending.current = text;
      clear();
      setSettingsOpen(true);
      return;
    }
    player.play(text, voice, owner.current, setPlayState).catch((e: unknown) => {
      setError(`Couldn't play: ${e instanceof Error ? e.message : String(e)}`);
    });
  };

  const closeSettings: CloseSettings = (next) => {
    if (next !== undefined) saveSettings(next);
    setSettingsOpen(false);
    const text = pending.current;
    pending.current = undefined;
    const voice = next === undefined ? settings : next;
    if (text && voice) play(text, voice);
  };

  const single = pick && SINGLE_WORD.test(pick.value);
  const key = single ? pick.value.toLowerCase().replace(/’/g, "'") : '';
  const sound = key ? (ipa[key] ?? ipa[key.replace(/'s$/, '')]) : undefined;
  const gloss = pick?.kind === 'word' ? pick.gloss : undefined;

  return (
    <>
      <Popover
        open={Boolean(pick)}
        onOpenChange={(open) => {
          if (open) return;
          if (player.isPlaying(owner.current)) player.stop();
          clear();
        }}
      >
        <PopoverAnchor
          virtualRef={{
            current: { getBoundingClientRect: () => pick?.range.getBoundingClientRect() ?? new DOMRect() },
          }}
        />
        <PopoverContent
          aria-label="Pronunciation"
          className="w-64"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          onInteractOutside={(e) => {
            // Taps and selections in the lesson move the popover instead of closing it.
            const target = e.target;
            if (target instanceof Element && target.closest('.prose') && !target.closest(OWN_INTERACTION)) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex items-center justify-between gap-3">
            {single ? (
              <strong className="text-lg font-semibold tracking-tight">{pick.value}</strong>
            ) : (
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{pick?.value}</p>
            )}
            <button
              type="button"
              aria-label="Play"
              data-state={playState}
              className={cn(
                'inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-accent',
                playState !== 'idle' && 'border-brand text-brand',
              )}
              onClick={() => {
                if (pick) play(pick.value, settings);
              }}
            >
              {playState === 'loading' ? <Loader2 className="size-4 animate-spin" /> : <Volume2 className="size-4" />}
            </button>
          </div>
          {sound && <p className="mt-1 font-mono text-sm text-muted-foreground">/{sound}/</p>}
          {gloss && <p className="mt-2 text-sm">{gloss}</p>}
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <button
            type="button"
            className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            onClick={() => {
              clear();
              setSettingsOpen(true);
            }}
          >
            Voice settings
          </button>
        </PopoverContent>
      </Popover>

      <VoiceSettings open={settingsOpen} saved={settings} onClose={closeSettings} />
    </>
  );
}
