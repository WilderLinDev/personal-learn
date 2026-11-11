// Turns `data-island` elements written by markdown.mjs into React components, each loaded
// only when it scrolls near the viewport.
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

type Island = { load: () => Promise<{ default: ComponentType<any> }>; props: (el: HTMLElement) => object };

const ISLANDS: Record<string, Island> = {
  diagram: {
    load: () => import('./Diagram'),
    props: (el) => ({ code: el.dataset.code ?? '', caption: el.parentElement?.querySelector('figcaption')?.textContent ?? '' }),
  },
  choice: {
    load: () => import('./Choice'),
    props: (el) => ({
      options: [...el.children].map((li) => ({
        html: li.innerHTML,
        correct: (li as HTMLElement).dataset.correct === 'true',
      })),
    }),
  },
  simulation: {
    load: () => import('./Simulation'),
    props: (el) => JSON.parse(el.dataset.props ?? '{}'),
  },
};

async function mount(el: HTMLElement) {
  const island = ISLANDS[el.dataset.island ?? ''];
  if (!island || el.dataset.mounted) return;
  el.dataset.mounted = 'true';
  const props = island.props(el);
  const { default: Component } = await island.load();
  // A list cannot hold React's root; mount into a sibling and hide the original.
  let host: HTMLElement = el;
  if (el.tagName === 'UL' || el.tagName === 'OL') {
    host = document.createElement('div');
    el.after(host);
    el.hidden = true;
  } else {
    el.replaceChildren();
  }
  createRoot(host).render(<Component {...props} />);
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      mount(entry.target as HTMLElement);
    }
  },
  { rootMargin: '400px 0px' },
);

document.querySelectorAll<HTMLElement>('[data-island]').forEach((el) => observer.observe(el));
