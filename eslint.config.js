// @ts-check
// ESLint complements, and does not overlap with, the two other checks in this repo:
//   - Prettier owns formatting. No formatting rules are enabled here (ESLint 10's
//     recommended configs contain none), so `eslint-config-prettier` isn't needed.
//   - tsconfig.json owns type errors. Rules that merely restate a compiler flag
//     (e.g. no-unused-vars vs noUnusedLocals) add nothing.
// What's left is the part neither can do: type-aware rules such as
// no-floating-promises, and linting of Angular templates (a11y + best practice).
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      // Type-aware: needs the TS program below. Catches what plain linting can't —
      // floating promises, and `any` leaking in from untyped library APIs.
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: __dirname },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
