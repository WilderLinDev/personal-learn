import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/', '.astro/', '.wrangler/']),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname, extraFileExtensions: ['.astro'] },
    },
  },
  // astro-eslint-parser has no projectService; it reads tsconfig.json instead.
  { files: ['**/*.astro'], languageOptions: { parserOptions: { projectService: false, project: true } } },
  { files: ['**/*.{ts,tsx}'], extends: [reactHooks.configs.flat.recommended] },
  { files: ['**/*.{js,mjs}'], extends: [tseslint.configs.disableTypeChecked] },
]);
