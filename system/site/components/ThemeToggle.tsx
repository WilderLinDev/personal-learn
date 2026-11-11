// Light or dark: follows the system until the reader picks one; the pick is kept in this browser.
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('learn.theme', next ? 'dark' : 'light');
    } catch {}
  };
  return (
    <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label={dark ? 'Use light theme' : 'Use dark theme'}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
