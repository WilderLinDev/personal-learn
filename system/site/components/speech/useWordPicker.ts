// What the reader picked in the lesson: a tapped word, or any selected text.
import { useEffect, useEffectEvent, useState } from 'react';
import { speakable } from '@/lib/speech';

export type Pick =
  { kind: 'word'; value: string; range: Range; gloss?: string } | { kind: 'selection'; value: string; range: Range };

/** Elements inside the lesson that keep their own taps and selections. */
export const OWN_INTERACTION = 'a, button, summary, input, [data-island], .not-prose';

const LETTER = /[A-Za-z'’]/;

function wordAt(x: number, y: number): Pick | undefined {
  const position = document.caretPositionFromPoint(x, y);
  const node = position?.offsetNode;
  if (!position || node?.nodeType !== Node.TEXT_NODE) return undefined;
  const text = node.textContent ?? '';
  let start = position.offset;
  let end = position.offset;
  while (start > 0 && LETTER.test(text.charAt(start - 1))) start--;
  while (end < text.length && LETTER.test(text.charAt(end))) end++;
  const value = text.slice(start, end).replace(/^['’]+|['’]+$/g, '');
  if (!/[A-Za-z]/.test(value)) return undefined;
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  const rect = range.getBoundingClientRect();
  if (x < rect.left - 2 || x > rect.right + 2 || y < rect.top - 2 || y > rect.bottom + 2) return undefined;
  const gloss = /^\s*（([^）]+)）/.exec(text.slice(end))?.[1];
  return { kind: 'word', value, range, gloss };
}

function selectionIn(prose: HTMLElement): Pick | undefined {
  const selection = document.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return undefined;
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const element = container instanceof Element ? container : container.parentElement;
  if (!prose.contains(container) || element?.closest(OWN_INTERACTION)) return undefined;
  const value = speakable(selection.toString());
  if (!/[A-Za-z]/.test(value)) return undefined;
  return { kind: 'selection', value, range: range.cloneRange() };
}

/**
 * Tracks the word the reader taps, or the text they select, inside `.prose`, and highlights a
 * tapped word. `onPick` runs before each change.
 */
export function useWordPicker(onPick: () => void) {
  const [pick, setPick] = useState<Pick>();

  const show = useEffectEvent((next: Pick | undefined) => {
    if (next?.kind === 'selection' && pick?.kind === 'selection' && next.value === pick.value) return;
    onPick();
    setPick(next);
  });

  useEffect(() => {
    if (!('highlights' in CSS)) return;
    const highlight = new Highlight();
    CSS.highlights.set('say', highlight);
    if (pick?.kind === 'word') highlight.add(pick.range);
    return () => {
      highlight.clear();
    };
  }, [pick]);

  useEffect(() => {
    const prose = document.querySelector<HTMLElement>('.prose');
    if (!prose) return;
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(OWN_INTERACTION)) return;
      if (!document.getSelection()?.isCollapsed) return;
      show(wordAt(event.clientX, event.clientY));
    };
    // Selections made by mouse, keyboard, or touch handles all end in selectionchange.
    let timer: number | undefined;
    const onSelection = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const next = selectionIn(prose);
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
  }, []);

  return {
    pick,
    clear: () => {
      setPick(undefined);
    },
  };
}
