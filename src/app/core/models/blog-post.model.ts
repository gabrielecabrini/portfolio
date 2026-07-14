export type Lang = 'it' | 'en';

// title/excerpt are literal strings here (unlike the CV models), not i18n keys —
// blog content isn't in public/assets/i18n, it lives with the post itself.
export interface BlogPostTranslation {
  title: string;
  excerpt: string;
}

// Metadata-only entry in core/data/blog.registry.ts. The actual article body is NOT
// here: it's Markdown loaded client-side from public/assets/blog/<slug>/<lang>.md
// (see BlogPost component). This split matters because `langs` drives which markdown
// files must exist, and `slug` must feed app.routes.server.ts's getPrerenderParams —
// see features/blog/README.md for the full checklist when adding a post.
export interface BlogPost {
  slug: string;
  date: string;
  tags: string[];
  langs: Lang[];
  translations: Partial<Record<Lang, BlogPostTranslation>>;
}
