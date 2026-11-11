// Turns `data-island` elements written by markdown.ts into React components, each loaded
// only when it scrolls near the viewport.
import type { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { SimulationProps } from './Simulation';

/** Each island reads its props from the server-rendered element, then loads its component. */
const ISLANDS: Record<string, ((el: HTMLElement) => Promise<ReactElement>) | undefined> = {
  async diagram(el) {
    const code = el.dataset.code ?? '';
    const caption = el.parentElement?.querySelector('figcaption')?.textContent ?? '';
    const { default: Diagram } = await import('./Diagram');
    return <Diagram code={code} caption={caption} />;
  },
  async choice(el) {
    const options = [...el.querySelectorAll<HTMLElement>(':scope > li')].map((li) => ({
      html: li.innerHTML,
      correct: li.dataset.correct === 'true',
    }));
    const { default: Choice } = await import('./Choice');
    return <Choice options={options} />;
  },
  async simulation(el) {
    const props = JSON.parse(el.dataset.props ?? '{}') as SimulationProps;
    const { default: Simulation } = await import('./Simulation');
    return <Simulation {...props} />;
  },
};

async function mount(el: HTMLElement) {
  const island = ISLANDS[el.dataset.island ?? ''];
  if (!island || el.dataset.mounted) return;
  el.dataset.mounted = 'true';
  const element = await island(el);
  // A list cannot hold React's root; mount into a sibling and hide the original.
  let host = el;
  if (el.tagName === 'UL' || el.tagName === 'OL') {
    host = document.createElement('div');
    el.after(host);
    el.hidden = true;
  } else {
    el.replaceChildren();
  }
  createRoot(host).render(element);
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) continue;
      observer.unobserve(entry.target);
      void mount(entry.target);
    }
  },
  { rootMargin: '400px 0px' },
);

for (const el of document.querySelectorAll<HTMLElement>('[data-island]')) observer.observe(el);
