import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'blog/not-found', renderMode: RenderMode.Prerender },
  { path: 'blog/:slug', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender },
];
