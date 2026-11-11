// A Diagram: Mermaid source drawn in the hand-drawn look, in the Design's colours.
import { lazy, Suspense, useEffect, useId, useState } from 'react';
import { PencilLine } from 'lucide-react';

// Excalidraw is large: load it only when a reader opens a diagram.
const DiagramCanvas = lazy(() => {
  (window as Window & { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH = '/excalidraw/';
  return import('./DiagramCanvas');
});

// Mermaid only understands hex and rgb; resolve any CSS colour (oklch, color-mix) through a canvas.
function hex(variable: string) {
  const probe = document.createElement('span');
  probe.style.color = `var(${variable})`;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

// Show the diagram at its natural size, shrinking to at most 80% before the frame scrolls,
// so labels stay readable in a narrow column.
function fit(svg: string) {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement;
  const width = Number(root.getAttribute('viewBox')?.split(/\s+/)[2]);
  if (width) {
    root.setAttribute('width', '100%');
    root.removeAttribute('height');
    root.setAttribute('style', `max-width:${width}px;min-width:${Math.round(width * 0.8)}px`);
  }
  return new XMLSerializer().serializeToString(root);
}

let queue = Promise.resolve();

export default function Diagram({ code, caption }: { code: string; caption: string }) {
  const id = `diagram-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const dark = useDark();
  const [svg, setSvg] = useState<string>();
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Mermaid renders one diagram at a time.
    queue = queue.then(async () => {
      try {
        const [{ default: mermaid }] = await Promise.all([import('mermaid'), document.fonts.load('16px Kalam')]);
        const brand = hex('--brand');
        const fg = hex('--foreground');
        const bg = hex('--card');
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          look: 'handDrawn',
          theme: 'base',
          fontFamily: 'Kalam, "PingFang SC", cursive',
          themeVariables: {
            darkMode: dark,
            background: bg,
            fontSize: '17px',
            primaryColor: hex('--tint'),
            primaryBorderColor: brand,
            primaryTextColor: fg,
            secondaryColor: hex('--muted'),
            tertiaryColor: hex('--subtle'),
            lineColor: hex('--muted-foreground'),
            textColor: fg,
            mainBkg: hex('--tint'),
            nodeBorder: brand,
            clusterBkg: hex('--muted'),
            clusterBorder: hex('--border'),
            edgeLabelBackground: bg,
            noteBkgColor: hex('--muted'),
            noteBorderColor: hex('--border'),
            actorBkg: hex('--tint'),
            actorBorder: brand,
            signalColor: fg,
          },
        });
        const result = await mermaid.render(id, code);
        if (!cancelled) {
          setSvg(fit(result.svg));
          setError(undefined);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code, dark, id]);

  if (error) {
    return (
      <div className="w-full text-sm text-destructive">
        <p className="m-0 font-medium">This diagram could not be drawn.</p>
        <pre className="mt-2 mb-0 whitespace-pre-wrap">{code}</pre>
      </div>
    );
  }
  if (!svg) return <div className="h-40 w-full animate-pulse rounded-lg bg-muted" aria-label="Loading diagram" />;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex w-full cursor-zoom-in justify-center-safe rounded-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={`Open diagram${caption ? `: ${caption}` : ''} to zoom and draw`}
      >
        <span className="contents" dangerouslySetInnerHTML={{ __html: svg }} />
        <span className="absolute top-0 right-0 flex items-center gap-1.5 rounded-md border bg-background/90 px-2 py-1 text-xs text-muted-foreground opacity-0 shadow-xs transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">
          <PencilLine className="size-3.5" />
          Open
        </span>
      </button>
      {open && (
        <Suspense fallback={<div className="fixed inset-0 z-50 animate-pulse bg-background/80" />}>
          <DiagramCanvas code={code} caption={caption} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
