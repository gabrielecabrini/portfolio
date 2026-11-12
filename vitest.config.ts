import { defineConfig } from 'vitest/config';

// e2e needs `yarn build` (and Chromium for browser.spec): run the suites apart with --project unit / e2e.
export default defineConfig({
  test: {
    projects: [
      { test: { name: 'unit', include: ['src/**/*.spec.ts'] } },
      { test: { name: 'e2e', include: ['e2e/**/*.spec.ts'] } },
    ],
  },
});
