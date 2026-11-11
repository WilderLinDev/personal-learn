// A multiple-choice question inside `check`. One correct option: answered on tap.
// Several: the reader selects, then checks.
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Option = { html: string; correct: boolean };

export default function Choice({ options }: { options: Option[] }) {
  const multiple = options.filter((o) => o.correct).length > 1;
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const toggle = (i: number) => {
    if (checked && !multiple) return;
    if (!multiple) {
      setPicked([i]);
      setChecked(true);
      return;
    }
    setChecked(false);
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };
  const right = checked && options.every((o, i) => o.correct === picked.includes(i));

  return (
    <div className="not-prose my-4">
      <ul className="m-0 grid list-none gap-2 p-0" role={multiple ? 'group' : 'radiogroup'}>
        {options.map((o, i) => {
          const selected = picked.includes(i);
          // Wrong picks never reveal the right option: the reader tries again, or opens the answer.
          const state = !checked ? (selected ? 'selected' : 'idle') : selected ? (o.correct ? 'right' : 'wrong') : 'idle';
          return (
            <li key={i}>
              <button
                type="button"
                role={multiple ? 'checkbox' : 'radio'}
                aria-checked={selected}
                onClick={() => toggle(i)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border bg-background px-4 py-3 text-left text-[0.9375rem] leading-relaxed transition-colors',
                  'hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                  state === 'selected' && 'border-brand bg-tint',
                  state === 'right' && 'border-success bg-success/10',
                  state === 'wrong' && 'border-destructive bg-destructive/10',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center border text-white',
                    multiple ? 'rounded-md' : 'rounded-full',
                    state === 'selected' && 'border-brand bg-brand',
                    state === 'right' && 'border-success bg-success',
                    state === 'wrong' && 'border-destructive bg-destructive',
                  )}
                  aria-hidden="true"
                >
                  {state === 'right' && <Check className="size-3.5" strokeWidth={3} />}
                  {state === 'wrong' && <X className="size-3.5" strokeWidth={3} />}
                  {state === 'selected' && multiple && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span className="[&_code]:rounded [&_code]:bg-muted [&_code]:px-1" dangerouslySetInnerHTML={{ __html: o.html }} />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-center gap-3 text-sm empty:hidden" aria-live="polite">
        {multiple && !checked && (
          <Button size="sm" disabled={!picked.length} onClick={() => setChecked(true)}>
            Check
          </Button>
        )}
        {checked && (
          <>
            <span className={cn('font-medium', right ? 'text-success' : 'text-destructive')}>
              {right ? 'Correct.' : 'Not quite.'}
            </span>
            <Button size="sm" variant="ghost" onClick={() => { setPicked([]); setChecked(false); }}>
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
