import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setDark, useDark } from '@/lib/theme';

export default function ThemeToggle() {
  const dark = useDark();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => {
        setDark(!dark);
      }}
      aria-label={dark ? 'Use light theme' : 'Use dark theme'}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
