import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_POSTS } from './core/data/blog.registry';

// The whole site is static: every route is prerendered at build time (outputMode:
// "static" in angular.json), there is no running Node server in production. Every
// route not listed explicitly here still gets prerendered via the trailing '**'
// catch-all, so adding a new top-level page in app.routes.ts needs no change here.
export const serverRoutes: ServerRoute[] = [
  { path: 'blog/not-found', renderMode: RenderMode.Prerender },
  {
    // One prerendered page per registered post (see core/data/blog.registry.ts).
    // fallback: Client means a slug NOT in BLOG_POSTS renders client-side instead of
    // 404ing at the server level — BlogPost then redirects it to /blog/not-found.
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    getPrerenderParams: async () => BLOG_POSTS.map(post => ({ slug: post.slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
