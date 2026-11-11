// The reader's voice: Volcano Engine credentials, kept only in this browser, or the system voice.
import type { SyntheticEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEFAULT_VOICE, type Settings } from '@/lib/speech';

/** `next` is the new settings, `null` to forget them, or `undefined` to keep them as they are. */
export type CloseSettings = (next: Settings | null | undefined) => void;

function settingsFrom(form: HTMLFormElement, action: string | undefined): Settings | null | undefined {
  const data = new FormData(form);
  const value = (name: string) => {
    const field = data.get(name);
    return typeof field === 'string' ? field.trim() : '';
  };
  const voice = value('voice') || DEFAULT_VOICE;
  if (action === 'system') return { mode: 'system' };
  if (action === 'clear') return null;
  if (value('apiKey')) return { mode: 'volcano', apiKey: value('apiKey'), voice };
  if (value('appId') && value('token')) return { mode: 'volcano', appId: value('appId'), token: value('token'), voice };
  return undefined;
}

export function VoiceSettings({
  open,
  saved,
  onClose,
}: {
  open: boolean;
  saved: Settings | null;
  onClose: CloseSettings;
}) {
  const volcano = saved?.mode === 'volcano' ? saved : undefined;
  const apiKey = volcano && 'apiKey' in volcano ? volcano.apiKey : undefined;
  const app = volcano && 'appId' in volcano ? volcano : undefined;

  const onSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    const submitter = event.nativeEvent.submitter;
    onClose(settingsFrom(event.currentTarget, submitter instanceof HTMLButtonElement ? submitter.value : undefined));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose(undefined);
      }}
    >
      <DialogContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Voice</DialogTitle>
            <DialogDescription>
              Pronunciation uses Volcano Engine TTS 2.0 with your own credentials. They are kept only in this browser
              and sent only to Volcano Engine.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="say-api-key">API Key</Label>
            <Input
              id="say-api-key"
              name="apiKey"
              type="password"
              autoComplete="off"
              spellCheck={false}
              defaultValue={apiKey}
            />
          </div>
          <details className="group rounded-lg border px-3 py-2 text-sm" open={Boolean(app)}>
            <summary className="cursor-pointer text-muted-foreground select-none">
              Use App ID and Access Token instead
            </summary>
            <div className="mt-3 grid gap-3 pb-1">
              <div className="grid gap-2">
                <Label htmlFor="say-app-id">App ID</Label>
                <Input id="say-app-id" name="appId" autoComplete="off" spellCheck={false} defaultValue={app?.appId} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="say-token">Access Token</Label>
                <Input id="say-token" name="token" type="password" autoComplete="off" defaultValue={app?.token} />
              </div>
            </div>
          </details>
          <div className="grid gap-2">
            <Label htmlFor="say-voice">Voice</Label>
            <Input
              id="say-voice"
              name="voice"
              autoComplete="off"
              spellCheck={false}
              defaultValue={volcano?.voice ?? DEFAULT_VOICE}
            />
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
  );
}
