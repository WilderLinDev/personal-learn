// A Diagram opened in Excalidraw: pan, zoom, move shapes, and add notes. Notes are kept in this
// browser only, per page and per diagram source; a changed diagram starts fresh.
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Excalidraw, convertToExcalidrawElements, restoreElements } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI, BinaryFiles } from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { parseMermaidToExcalidraw } from '@excalidraw/mermaid-to-excalidraw';
import { RotateCcw, X } from 'lucide-react';
import '@excalidraw/excalidraw/index.css';
import { Button } from '@/components/ui/button';
import { useDark } from '@/lib/theme';

interface Scene {
  elements: readonly ExcalidrawElement[];
  files: BinaryFiles;
}

/** Where this page's notes on this diagram source are kept. */
async function storageKey(code: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
  return `learn.diagram:${location.pathname}:${new Uint8Array(digest).slice(0, 8).toHex()}`;
}

const version = (elements: readonly ExcalidrawElement[]) => elements.reduce((n, e) => n + e.version, 0);

function read(key: string): Scene | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Scene) : null;
  } catch {
    return null;
  }
}

function write(key: string, scene: Scene | null) {
  try {
    if (scene) localStorage.setItem(key, JSON.stringify(scene));
    else localStorage.removeItem(key);
  } catch {
    // Storage full or blocked: notes stay for this visit only.
  }
}

// Excalidraw registers its fonts after it mounts, split by Unicode range: wait for the faces,
// then load the ones this diagram's text needs.
async function excalifont(text: string) {
  for (let i = 0; i < 50 && ![...document.fonts].some((f) => f.family.replace(/"/g, '') === 'Excalifont'); i++) {
    await new Promise((r) => setTimeout(r, 50));
  }
  await document.fonts.load('20px Excalifont', text);
}

async function original(code: string): Promise<Scene> {
  const { elements, files } = await parseMermaidToExcalidraw(code, { themeVariables: { fontSize: '20px' } });
  const converted = convertToExcalidrawElements(elements, { regenerateIds: false });
  // Re-measure text with Excalifont, which the conversion may have measured with a fallback font.
  return {
    elements: restoreElements(converted, null, { refreshDimensions: true, repairBindings: true }),
    files: files ?? {},
  };
}

export default function DiagramCanvas({
  code,
  caption,
  onClose,
}: {
  code: string;
  caption: string;
  onClose: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState(0);
  const [edited, setEdited] = useState(false);
  const [error, setError] = useState('');
  const api = useRef<ExcalidrawImperativeAPI | null>(null);
  const key = useRef('');
  const saved = useRef(0);
  // Changes count as notes only after the diagram itself is on the canvas.
  const live = useRef(false);
  const dark = useDark();
  const close = useEffectEvent(onClose);

  // Text is measured when elements are created, so convert only once Excalidraw's own font has loaded.
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    void (async () => {
      try {
        await excalifont(code);
        key.current = await storageKey(code);
        const notes = read(key.current);
        const scene = notes ?? (await original(code));
        if (controller.signal.aborted || !api.current) return;
        saved.current = version(scene.elements);
        live.current = true;
        api.current.addFiles(Object.values(scene.files));
        api.current.updateScene({ elements: scene.elements });
        api.current.scrollToContent(undefined, { fitToContent: true });
        setEdited(Boolean(notes));
        setLoading(false);
      } catch (e) {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      controller.abort();
    };
  }, [ready, code, generation]);

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Escape first clears Excalidraw's own selection or text editing; with nothing active it closes.
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const state = api.current?.getAppState();
      if (
        state &&
        (state.editingTextElement ||
          Object.keys(state.selectedElementIds).length ||
          state.activeTool.type !== 'selection')
      )
        return;
      close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const onChange = (elements: readonly ExcalidrawElement[], _state: unknown, files: BinaryFiles) => {
    const v = version(elements);
    if (!live.current || v === saved.current) return;
    saved.current = v;
    write(key.current, { elements: elements.filter((e) => !e.isDeleted), files });
    setEdited(true);
  };

  // Back to the diagram as written: forget the notes and remount the canvas.
  const reset = () => {
    live.current = false;
    write(key.current, null);
    setEdited(false);
    setLoading(true);
    setReady(false);
    setGeneration((g) => g + 1);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      role="dialog"
      aria-modal="true"
      aria-label={caption || 'Diagram'}
    >
      <header className="flex h-12 shrink-0 items-center gap-3 border-b px-3 sm:px-4">
        <strong className="truncate text-sm font-semibold">{caption || 'Diagram'}</strong>
        <span className="hidden truncate text-xs text-muted-foreground sm:inline">
          Draw and add notes; they stay in this browser.
        </span>
        <span className="ml-auto flex items-center gap-1">
          {edited && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw />
              Reset
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </span>
      </header>
      <div className="relative min-h-0 flex-1">
        {error ? (
          <p className="p-6 text-sm text-destructive">This diagram cannot be opened for drawing: {error}</p>
        ) : (
          <Excalidraw
            key={generation}
            initialData={{ appState: { viewBackgroundColor: 'transparent' } }}
            excalidrawAPI={(a) => {
              api.current = a;
              setReady(true);
            }}
            onChange={onChange}
            theme={dark ? 'dark' : 'light'}
            UIOptions={{
              canvasActions: { loadScene: false, saveToActiveFile: false, clearCanvas: false, toggleTheme: false },
            }}
          />
        )}
        {loading && !error && (
          <div className="pointer-events-none absolute inset-0 animate-pulse bg-muted/40" aria-label="Loading" />
        )}
      </div>
    </div>,
    document.body,
  );
}
