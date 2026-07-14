import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_POSTS } from './core/data/blog.registry';

export const serverRoutes: ServerRoute[] = [
  { path: 'blog/not-found', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    getPrerenderParams: async () => BLOG_POSTS.map(post => ({ slug: post.slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
