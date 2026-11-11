// Light or dark: follows the system until the reader picks one; the pick is kept in this browser.
// The inline script in layouts/Base.astro applies it before the first paint.
import { useSyncExternalStore } from 'react';

const STORE = 'learn.theme';
const root = () => document.documentElement;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ['class'] });
  return () => {
    observer.disconnect();
  };
}

const isDark = () => root().classList.contains('dark');

/** Whether the page is dark now; re-renders when the reader switches. */
export const useDark = () => useSyncExternalStore(subscribe, isDark, () => false);

export function setDark(dark: boolean) {
  root().classList.toggle('dark', dark);
  try {
    localStorage.setItem(STORE, dark ? 'dark' : 'light');
  } catch {
    // Storage blocked: the pick lasts for this page only.
  }
}
