// A multiple-choice question inside `check`. One correct option: answered on pick.
// Several: the reader selects, then checks. Wrong picks never reveal the right option.
import { useId, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from 'cn';

interface Option {
  html: string;
  correct: boolean;
}
type State = 'idle' | 'selected' | 'right' | 'wrong';

const row = {
  idle: '',
  selected: 'border-brand bg-tint',
  right: 'border-success bg-success/10',
  wrong: 'border-destructive bg-destructive/10',
} satisfies Record<State, string>;

const control = {
  idle: '',
  selected: '',
  right:
    'border-success text-success data-[state=checked]:border-success data-[state=checked]:bg-success [&_svg]:fill-success',
  wrong:
    'border-destructive text-destructive data-[state=checked]:border-destructive data-[state=checked]:bg-destructive [&_svg]:fill-destructive',
} satisfies Record<State, string>;

export default function Choice({ options }: { options: Option[] }) {
  const id = useId();
  const multiple = options.filter((o) => o.correct).length > 1;
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const right = checked && options.every((o, i) => o.correct === picked.includes(i));

  const stateOf = (i: number): State => {
    if (!picked.includes(i)) return 'idle';
    if (!checked) return 'selected';
    return options[i]?.correct ? 'right' : 'wrong';
  };
  const toggle = (i: number, on: boolean) => {
    setChecked(false);
    setPicked((p) => (on ? [...p, i] : p.filter((x) => x !== i)));
  };

  const items = options.map((o, i) => {
    const state = stateOf(i);
    const itemId = `${id}-${String(i)}`;
    return (
      <label
        key={itemId}
        htmlFor={itemId}
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-lg border bg-background px-4 py-3 text-[0.9375rem] leading-relaxed transition-colors hover:bg-accent',
          row[state],
        )}
      >
        {multiple ? (
          <Checkbox
            id={itemId}
            className={cn('mt-1', control[state])}
            checked={picked.includes(i)}
            onCheckedChange={(on) => {
              toggle(i, on === true);
            }}
          />
        ) : (
          <RadioGroupItem id={itemId} value={String(i)} className={cn('mt-1', control[state])} />
        )}
        <span
          className="flex-1 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1"
          dangerouslySetInnerHTML={{ __html: o.html }}
        />
        {state === 'right' && <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />}
        {state === 'wrong' && <X className="mt-1 size-4 shrink-0 text-destructive" aria-hidden="true" />}
      </label>
    );
  });

  return (
    <div className="not-prose my-4">
      {multiple ? (
        <div className="grid gap-2" role="group">
          {items}
        </div>
      ) : (
        <RadioGroup
          className="gap-2"
          value={picked.length ? String(picked[0]) : ''}
          onValueChange={(value) => {
            if (checked) return;
            setPicked([Number(value)]);
            setChecked(true);
          }}
        >
          {items}
        </RadioGroup>
      )}
      <div className="mt-3 flex items-center gap-3 text-sm empty:hidden" aria-live="polite">
        {multiple && !checked && (
          <Button
            size="sm"
            disabled={!picked.length}
            onClick={() => {
              setChecked(true);
            }}
          >
            Check
          </Button>
        )}
        {checked && (
          <>
            <span className={cn('font-medium', right ? 'text-success' : 'text-destructive')}>
              {right ? 'Correct.' : 'Not quite.'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setPicked([]);
                setChecked(false);
              }}
            >
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
