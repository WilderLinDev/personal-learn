// A Topic's Simulation: vault/topics/<topic>/simulations/<name>.tsx, default-exporting a React component.
import { lazy, Suspense, useMemo, type ComponentType } from 'react';

const modules = import.meta.glob<{ default: ComponentType }>('/vault/topics/*/simulations/*.tsx');

export default function Simulation({ topic, name, title }: { topic: string; name: string; title: string }) {
  const load = modules[`/vault/topics/${topic}/simulations/${name}.tsx`];
  const Component = useMemo(() => load && lazy(load), [load]);
  if (!Component) return <p className="text-sm text-destructive">Simulation “{name}” not found.</p>;
  return (
    <section aria-label={title}>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-muted" />}>
        <Component />
      </Suspense>
    </section>
  );
}
