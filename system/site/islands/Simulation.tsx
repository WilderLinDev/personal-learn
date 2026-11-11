// A Topic's Simulation: vault/topics/<topic>/simulations/<name>.tsx, default-exporting a React component.
import { lazy, Suspense, type ComponentType } from 'react';

const SIMULATIONS = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: ComponentType }>('/vault/topics/*/simulations/*.tsx')).map(
    ([path, load]) => [path, lazy(load)],
  ),
);

export interface SimulationProps {
  topic: string;
  name: string;
  title: string;
}

export default function Simulation({ topic, name, title }: SimulationProps) {
  const Component = SIMULATIONS[`/vault/topics/${topic}/simulations/${name}.tsx`];
  if (!Component) return <p className="text-sm text-destructive">Simulation “{name}” not found.</p>;
  return (
    <section aria-label={title}>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-muted" />}>
        <Component />
      </Suspense>
    </section>
  );
}
