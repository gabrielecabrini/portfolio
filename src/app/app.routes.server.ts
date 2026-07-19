import { RenderMode, ServerRoute } from '@angular/ssr';

// The whole site is static: every route is prerendered at build time (outputMode:
// "static" in angular.json), there is no running Node server in production.
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Prerender },
];
