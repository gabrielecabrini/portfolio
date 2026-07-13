import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'experience', renderMode: RenderMode.Prerender },
  { path: 'projects', renderMode: RenderMode.Prerender },
  { path: 'cv', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
