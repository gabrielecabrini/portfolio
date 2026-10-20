// @ts-check
// ESLint complements, and does not overlap with, the two other checks in this repo:
//   - Prettier owns formatting. No formatting rules are enabled here (ESLint 10's
//     recommended configs contain none), so `eslint-config-prettier` isn't needed.
//   - `astro check` (tsconfig.json) owns type errors.
// What's left is the part neither can do: type-aware rules such as
// no-floating-promises, and Astro-specific template rules.
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default defineConfig([
  { ignores: ['dist/', '.astro/'] },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      // Type-aware: needs the TS program below. Catches what plain linting can't —
      // floating promises, and `any` leaking in from untyped library APIs.
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylistic,
    ],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  astro.configs.recommended,
]);
